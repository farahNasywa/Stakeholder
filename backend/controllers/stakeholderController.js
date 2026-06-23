import mongoose from "mongoose";

import Stakeholder from "../models/stakeholderModel.js";
import { calculateCompleteEngagementAnalysis } from "../services/engagementCalculationService.js";
import StakeholderType from "../models/stakeholderTypeModel.js";
import Role from "../models/roleModel.js";
import EngagementStrategy from "../models/engagementStrategyModel.js";
import { getFocalPointsForStakeholderType } from "../services/focalPointService.js";
import StakeholderChangeRequest from "../models/StakeholderChangeRequest.js";
import Justification from "../models/justificationModel.js";
// import googleSheetsService from "../services/googleSheetsService.js";
// Get all stakeholders
export const getAllStakeholders = async (req, res) => {
  try {
    const stakeholders = await Stakeholder.find().populate(
      "role stakeholderType location"
    );
    res.status(200).json(stakeholders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleStakeholder = async (req, res) => {
  try {
    const stakeholder = await Stakeholder.findById(req.params.id)
      .populate("role", "name")
      .populate("stakeholderType", "name")
      .populate("location.province", "name")
      .populate("engagementFrequency", "name description")
      .populate("engagementStrategy", "strategy") // <-- Mem-populate objek engagementStrategy
      .populate("focalPoints", "recommendedFocalpoint backupSupportFocalpoint");

    if (!stakeholder) {
      return res.status(404).json({ message: "Stakeholder not found" });
    }

    // Ambil nilai untuk perhitungan
    const { influenceLevel, interestLevel, riskLevel, opportunityLevel, benefitLevel } =
      stakeholder;

    // Hitung analisis lengkap engagement
    const engagementResult = calculateCompleteEngagementAnalysis({
      influence: influenceLevel,
      interest: interestLevel,
      riskLevel,
      opportunity: opportunityLevel,
      benefit: benefitLevel,
    });
     const justification = await Justification.findOne({ stakeholder: req.params.id });
    // Bangun respons lengkap dengan data populated dan kalkulasi
    const response = {
      _id: stakeholder._id,
      name: stakeholder.name,
      justification: justification?.text || null,
      role: stakeholder.role || null,
      location:stakeholder.location || null,
      contact: stakeholder.contact || null,
      stakeholderType: stakeholder.stakeholderType || null,
      engagementCategory: stakeholder.engagementCategory || null,
      status: stakeholder.status || null,

      // Engagement strategy hasil kalkulasi (string)
      calculatedEngagementStrategy: engagementResult.engagementStrategy.result,
      // Engagement strategy yang dipilih user (objek)
      engagementStrategy: stakeholder.engagementStrategy || null, // <-- Kirim objek lengkap untuk dropdown

      influenceLevel,
      interestLevel,
      riskLevel,
      opportunityLevel,
      benefitLevel,
      engagementIntensity: engagementResult.engagementIntensity.result,

      engagementFrequency: stakeholder.engagementFrequency || null, // <-- Kirim objek lengkap

      finalRecommendations: {
        engagementPriority: engagementResult.engagementPriority.result,
        engagementPriorityDescription:
          engagementResult.engagementPriority.description,
      },

      focalPoints: {
        recommendedFocalpoint:
          stakeholder.focalPoints?.recommendedFocalpoint || null,
        backupSupportFocalpoint:
          stakeholder.focalPoints?.backupSupportFocalpoint || null,
      },

      mitigationPlanDescription: stakeholder.mitigationPlanDescription || null,
      reengagementTriggers: stakeholder.reengagementTriggers,
    };
    
    res.json(response);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid Stakeholder ID" });
    }
    res.status(500).json({ message: err.message });
  }
};
export const createStakeholder = async (req, res) => {
  try {
    const {
      name,
      role,
      stakeholderType,
      engagementCategory,
      location,
      contact,
      influenceLevel,
      influence,
      interestLevel,
      interest,
      riskLevel,
      opportunityLevel,
      opportunity,
      benefitLevel = "high",
      benefit,
      engagementRelevance,
      relevance,
      engagementFrequency,
      reengagementTriggers,
      status,
      createdBy,
      updatedBy,
    } = req.body;

    // Map field names to match the model schema
    const mappedInfluence = influenceLevel || influence;
    const mappedInterest = interestLevel || interest;
    const mappedOpportunity = opportunityLevel || opportunity;
    const mappedBenefit = benefitLevel || benefit || "high";
    const mappedRelevance = engagementRelevance || relevance;

    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({
        message: "Name and role are required fields"
      });
    }

    // Validate enum values if they exist
    const validLevels = ["low", "medium", "high"];
    if (mappedInfluence && !validLevels.includes(mappedInfluence.toLowerCase())) {
      return res.status(400).json({
        message: `Invalid influence level: ${mappedInfluence}. Must be low, medium, or high`
      });
    }

    if (mappedInterest && !validLevels.includes(mappedInterest.toLowerCase())) {
      return res.status(400).json({
        message: `Invalid interest level: ${mappedInterest}. Must be low, medium, or high`
      });
    }

    // 🔹 Calculate analysis if we have the required fields
    let analysis = null;
    let strategyDoc = null;

    if (mappedInfluence && mappedInterest) {
      analysis = calculateCompleteEngagementAnalysis({
        influence: mappedInfluence,
        interest: mappedInterest,
        riskLevel: riskLevel || "medium",
        opportunity: mappedOpportunity || "medium",
        benefit: mappedBenefit,
      });

      // 🔹 Find matching strategy in database
      const engagementStrategyResult = analysis.engagementStrategy.result;
      strategyDoc = await EngagementStrategy.findOne({
        strategy: new RegExp(engagementStrategyResult, "i"), // case-insensitive
      });

      if (!strategyDoc) {
        console.warn(`Engagement strategy "${engagementStrategyResult}" not found in database`);
        // Jangan fail, lanjut aja
      }
    }

    // 🔹 Create Stakeholder with properly mapped fields
    const stakeholder = new Stakeholder({
      name,
      role,
      stakeholderType: stakeholderType || role, // Use stakeholderType if provided, otherwise use role
      engagementCategory,
      location,
      contact,
      // Use mapped field names that match the model
      influenceLevel: mappedInfluence?.toLowerCase(),
      interestLevel: mappedInterest?.toLowerCase(),
      riskLevel: riskLevel?.toLowerCase() || "medium",
      opportunityLevel: mappedOpportunity?.toLowerCase() || "medium",
      benefitLevel: mappedBenefit?.toLowerCase(),
      engagementRelevance: mappedRelevance?.toLowerCase(),
      engagementFrequency,
      engagementStrategy: strategyDoc?._id,
      reengagementTriggers,
      status: status || "Approved", // Default to Approved
      createdBy,
      updatedBy,
    });

    const savedStakeholder = await stakeholder.save();

    // Catatan: Justification (alasan engagement) TIDAK dibuat di sini.
    // Frontend secara eksplisit memanggil endpoint
    // POST /sheets/:spreadsheetId/save-justification setelah stakeholder
    // berhasil disimpan, yang mengambil teks justifikasi dari Google Sheets
    // (lihat googleSheetController.saveJustification) dan menyimpannya ke
    // koleksi Justification. Ini menghindari duplikasi logika dan dependency
    // pada variabel "sheets" yang sebelumnya tidak pernah didefinisikan.

    // Return the saved stakeholder with populated fields
    const populatedStakeholder = await Stakeholder.findById(savedStakeholder._id)
      .populate("role", "name")
      .populate("stakeholderType", "name")
      .populate("location.province", "name")
      .populate("engagementFrequency", "name description")
      .populate("engagementStrategy", "strategy")
      .populate("focalPoints", "recommendedFocalpoint backupSupportFocalpoint");

    res.status(201).json(populatedStakeholder);

  } catch (error) {
    console.error("Error creating stakeholder:", error);

    if (error.name === "ValidationError") {
      const errorMessages = Object.keys(error.errors).map(key => {
        return `${key}: ${error.errors[key].message}`;
      });
      return res.status(400).json({
        message: "Validation error",
        errors: errorMessages,
        details: error.errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry detected",
        details: error.keyPattern
      });
    }

    res.status(500).json({
      message: "Internal server error while creating stakeholder",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// Update stakeholder
export const updateStakeholder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Stakeholder ID" });
    }

    // Validasi dan mapping status sesuai enum schema jika ada di updateData
    if (updateData.status) {
      const allowedStatus = ["Pending", "Approved", "Rejected"];
      if (!allowedStatus.includes(updateData.status)) {
        const statusLower = updateData.status.toLowerCase();
        if (statusLower === "valid") updateData.status = "Approved";
        else if (statusLower === "pending") updateData.status = "Pending";
        else if (statusLower === "rejected") updateData.status = "Rejected";
        else {
          return res.status(400).json({
            message: `Invalid status value: ${updateData.status}`,
          });
        }
      }
    }

    // Handle focalPoints mapping jika perlu
    if (updateData.focalPoints && typeof updateData.focalPoints === "object") {
      if (
        updateData.focalPoints._id &&
        mongoose.Types.ObjectId.isValid(updateData.focalPoints._id)
      ) {
        updateData.focalPoints = updateData.focalPoints._id;
      } else if (updateData.stakeholderType) {
        const stakeholderTypeDoc = await StakeholderType.findById(
          updateData.stakeholderType
        );
        if (stakeholderTypeDoc) {
          const fpMapping = await getFocalPointsForStakeholderType(
            stakeholderTypeDoc.name
          );
          updateData.focalPoints = fpMapping ? fpMapping._id : null;
        } else {
          updateData.focalPoints = null;
        }
      } else {
        updateData.focalPoints = null;
      }
    }

    // Jika stakeholderType diubah tapi focalPoints belum diatur, update focalPoints
    if (updateData.stakeholderType && !updateData.focalPoints) {
      const stakeholderTypeDoc = await StakeholderType.findById(
        updateData.stakeholderType
      );
      if (stakeholderTypeDoc) {
        const fpMapping = await getFocalPointsForStakeholderType(
          stakeholderTypeDoc.name
        );
        updateData.focalPoints = fpMapping ? fpMapping._id : null;
      } else {
        updateData.focalPoints = null;
      }
    }

    const updatedStakeholder = await Stakeholder.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, context: "query" }
    );

    if (!updatedStakeholder) {
      return res.status(404).json({ message: "Stakeholder not found" });
    }

    const finalStakeholder = await Stakeholder.findById(id)
      .populate("role", "name")
      .populate("stakeholderType", "name")
      .populate("location.province", "name")
      .populate("engagementFrequency", "name description")
      .populate("engagementStrategy", "strategy")
      .populate("focalPoints", "recommendedFocalpoint backupSupportFocalpoint");

    res.status(200).json(finalStakeholder);
  } catch (error) {
    console.error("Error updating stakeholder:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid data type provided" });
    }
    res.status(500).json({
      message: "Gagal memperbarui data stakeholder. Silakan coba lagi.",
    });
  }
};

// ========== KKKS Submit Delete Request ==========
export const submitDeleteRequest = async (req, res) => {
  try {
    const { id } = req.params; // id stakeholder
    const userId = req.user.id;
    const role = req.user.role;

    if (role !== "kkks") {
      return res.status(403).json({ message: "Hanya KKKS yang dapat mengajukan hapus" });
    }

    // cek apakah stakeholder ada
    const stakeholder = await Stakeholder.findById(id);
    if (!stakeholder) {
      return res.status(404).json({ message: "Stakeholder tidak ditemukan" });
    }

    // buat change request delete
    const changeRequest = await StakeholderChangeRequest.create({
      stakeholderId: stakeholder._id,
      action: "delete",
      status: "pending",
      requestedBy: userId,
      oldData: stakeholder.toObject(), // simpan snapshot data lama
    });

    res.status(201).json({
      message: "Pengajuan hapus stakeholder berhasil dibuat",
      request: changeRequest
    });

  } catch (error) {
    res.status(500).json({ message: "Gagal membuat pengajuan hapus", error: error.message });
  }
};


// ========== BPMA / Admin Delete Stakeholder ==========
export const deleteStakeholder = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;

    if (role === "kkks") {
      return res.status(403).json({ message: "Gunakan submitDeleteRequest untuk KKKS" });
    }

    const stakeholder = await Stakeholder.findById(id);
    if (!stakeholder) {
      return res.status(404).json({ message: "Stakeholder tidak ditemukan" });
    }

    // hapus stakeholder
    await Stakeholder.findByIdAndDelete(id);

    // kalau ada change request pending terkait stakeholder ini → ubah jadi approved
    await StakeholderChangeRequest.updateMany(
      { stakeholderId: id, status: "pending", action: "delete" },
      { status: "approved", approvedAt: new Date(), approvedBy: req.user.id }
    );

    res.json({ message: "Stakeholder berhasil dihapus" });

  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus stakeholder", error: error.message });
  }
};

// Search stakeholder by name and role
export const searchStakeholders = async (req, res) => {
  try {
    const query = req.query.q;

    // 1. Validasi input: Jika query kosong, kembalikan array kosong.
    if (!query || query.trim() === "") {
      return res.json([]);
    }

    // 2. Buat Regular Expression untuk pencarian (case-insensitive) dan escape karakter khusus.
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedQuery, "i");

    // 3. Cari role yang cocok dengan query untuk mendapatkan ID-nya.
    const roles = await Role.find({ name: regex }).select("_id");
    const roleIds = roles.map((r) => r._id);

    // 4. Lakukan pencarian stakeholder berdasarkan nama atau ID role.
    const searchResults = await Stakeholder.find({
      $or: [
        { name: regex }, // Mencari di field 'name'
        { role: { $in: roleIds } }, // Mencari di field 'role' menggunakan ID yang sudah ditemukan
      ],
    })
      .populate("role", "name")
      .populate("stakeholderType", "name")
      .populate("location.province", "name")
      .select("name role stakeholderType engagementCategory");

    res.json(searchResults);
  } catch (error) {
    console.error("Error saat pencarian:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Get all stakeholders that have justifications
export const getAllStakeholdersWithJustification = async (req, res) => {
  try {
    const stakeholders = await Stakeholder.find()
      .populate('role', 'name')
      .populate('stakeholderType', 'name')
      .populate('location', 'name')
      .lean();

    // Get all justifications and create a map
    const justifications = await Justification.find().sort({ createdAt: -1 }).lean();
    const justificationMap = new Map();
    
    justifications.forEach(justification => {
      const stakeholderId = justification.stakeholder.toString();
      if (!justificationMap.has(stakeholderId)) {
        justificationMap.set(stakeholderId, []);
      }
      justificationMap.get(stakeholderId).push(justification);
    });

    // Return stakeholders with justifications
    const stakeholdersWithJustification = stakeholders.filter(stakeholder => 
      justificationMap.has(stakeholder._id.toString())
    ).map(stakeholder => {
      const stakeholderJustifications = justificationMap.get(stakeholder._id.toString()) || [];
      const latestText = stakeholderJustifications[0]?.text || "";
      // Bangun preview singkat (1 baris pertama / 150 karakter) untuk ditampilkan
      // sebagai kartu pada halaman daftar Engagement Justification.
      const justificationPreview = latestText
        .replace(/\r?\n/g, " ")
        .trim()
        .slice(0, 150);

      return {
        ...stakeholder,
        justifications: stakeholderJustifications,
        justificationPreview: justificationPreview
          ? `${justificationPreview}${latestText.length > 150 ? "..." : ""}`
          : null,
      };
    });

    res.json(stakeholdersWithJustification);
  } catch (error) {
    console.error('Error fetching stakeholders with justification:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get stakeholders without justifications (for auto-suggestion)
export const getStakeholdersWithoutJustification = async (req, res) => {
  try {
    const { q } = req.query;
    
    // Get all stakeholder IDs that have justifications
    const stakeholdersWithJustifications = await Justification.find().distinct('stakeholder');
    
    // Build query for stakeholders without justifications
    let query = {
      _id: { $nin: stakeholdersWithJustifications }
    };
    
    // Add name search if query provided
    if (q && q.trim()) {
      const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedQuery, 'i');
      query.name = regex;
    }
    
    const stakeholders = await Stakeholder.find(query)
      .populate('role', 'name')
      .populate('stakeholderType', 'name')
      .select('name role stakeholderType engagementCategory')
      .limit(10) // Limit results for performance
      .lean();

    res.json(stakeholders);
  } catch (error) {
    console.error('Error fetching stakeholders without justification:', error);
    res.status(500).json({ message: error.message });
  }
};


