// controllers/stakeholderChangeRequestController.js
import mongoose from "mongoose";

import StakeholderChangeRequest from "../models/StakeholderChangeRequest.js";
import StakeholderType from "../models/stakeholderTypeModel.js";
import FocalPointMapping from "../models/focalPointMappingModel.js";
import RoleModel from "../models/roleModel.js";
import Location from "../models/locationModel.js";
import Stakeholder from "../models/stakeholderModel.js";

// KKKS mengajukan request perubahan
export const createChangeRequest = async (req, res) => {
  try {
    const { stakeholderId } = req.params;
    const changeData = req.body;
    const userId = req.user.id; // Gunakan req.user.id dari payload token

    if (!stakeholderId) {
      return res.status(400).json({ message: "Stakeholder ID is required" });
    }

    const newRequest = new StakeholderChangeRequest({
      stakeholderId,
      requestedBy: userId,
      changeData,
    });

    await newRequest.save();

    res
      .status(201)
      .json({ message: "Change request submitted", request: newRequest });
  } catch (error) {
    console.error("Error creating change request:", error);
    res.status(500).json({ message: "Failed to submit change request" });
  }
};

export const getAllChangeRequests = async (req, res) => {
  try {
    const requests = await StakeholderChangeRequest.find({ status: "Pending" })
      .populate({
        path: "stakeholderId",
        select:
          "name role stakeholderType engagementCategory location contact engagementFrequency engagementStrategy focalPoints influenceLevel interestLevel riskLevel opportunityLevel benefitLevel reengagementTriggers",
        populate: [
          { path: "role", select: "name" },
          { path: "stakeholderType", select: "name" },
          { path: "location.province", select: "name" },
          { path: "engagementFrequency", select: "name" },
          { path: "engagementStrategy", select: "strategy" },
          { path: "focalPoints", select: "recommendedFocalpoint" },
        ],
      })
      .populate("requestedBy", "name email");

    // Filter out orphaned requests where stakeholderId was deleted
    const validRequests = requests.filter(r => r.stakeholderId !== null);

    res.json(validRequests);
  } catch (error) {
    console.error("Error fetching change requests:", error);
    res.status(500).json({ message: "Failed to fetch change requests" });
  }
};

// KKKS bisa lihat riwayat request yang diajukan
export const getMyChangeRequests = async (req, res) => {
  try {
    const requests = await StakeholderChangeRequest.find({
      requestedBy: req.user.id,
    })
      .populate({
        path: "stakeholderId",
        select:
          "name role stakeholderType engagementCategory location contact engagementFrequency engagementStrategy focalPoints influence interest riskLevel opportunity benefit reengagementTriggers",
        populate: [
          { path: "role", select: "name" },
          { path: "stakeholderType", select: "name" },
          { path: "location.province", select: "name" },
          { path: "engagementFrequency", select: "name" },
          { path: "engagementStrategy", select: "strategy" },
          { path: "focalPoints", select: "recommendedFocalpoint" },
        ],
      })
      .populate("requestedBy", "name")
      .sort({ createdAt: -1 }); // Urutkan terbaru ke terlama (opsional)

    res.json(requests);
  } catch (error) {
    console.error("Error fetching user's change requests:", error);
    res.status(500).json({ message: "Failed to fetch user's change requests" });
  }
};

// BPMA approve / reject request

export const reviewChangeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNote } = req.body;
    const reviewerId = req.user.id;

    // 1. Cari permintaan perubahan dan populate data stakeholderId
    const request = await StakeholderChangeRequest.findById(id).populate("stakeholderId");

    // Validasi dasar
    if (!request) {
      return res.status(404).json({ message: "Change request not found" });
    }
    if (request.status !== "Pending") {
      return res.status(400).json({ message: "Request has already been reviewed" });
    }

    if (status === "Approved") {
      // 2. Logika untuk permintaan penghapusan (isDeletionRequest)
      if (request.isDeletionRequest) {
        const deletedStakeholder = await Stakeholder.findByIdAndDelete(request.stakeholderId);
        
        if (!deletedStakeholder) {
          return res.status(404).json({ message: "Stakeholder to be deleted not found." });
        }
      } else {
        // 3. Logika untuk permintaan perubahan data
        const changeData = request.changeData;
        // Buang field sistem yang tidak boleh di-update
        const { _id, __v, createdAt, updatedAt, status: _status, originalData, ...safeChange } = changeData;
        const updateData = { ...safeChange };

        // --- Proses Konversi Field yang Merupakan ObjectId ---
        
        // Konversi field `role`
        if (changeData.role && changeData.role.name) {
          const roleDoc = await RoleModel.findOne({ name: changeData.role.name });
          if (roleDoc) {
            updateData.role = roleDoc._id;
          } else {
            return res.status(404).json({ message: "Role not found for update" });
          }
        }
        
        // Konversi field `stakeholderType`
        if (changeData.stakeholderType && changeData.stakeholderType.name) {
          const typeDoc = await StakeholderType.findOne({ name: changeData.stakeholderType.name });
          if (typeDoc) {
            updateData.stakeholderType = typeDoc._id;
          } else {
            return res.status(404).json({ message: "Stakeholder type not found for update" });
          }
        }

        // Konversi field `focalPoints`
        if (changeData.focalPoints) {
          const fp = changeData.focalPoints;
          if (mongoose.Types.ObjectId.isValid(fp)) {
            // Sudah ObjectId string
            updateData.focalPoints = fp;
          } else if (fp._id && mongoose.Types.ObjectId.isValid(fp._id)) {
            // Populated object dengan _id
            updateData.focalPoints = fp._id;
          } else if (fp.recommendedFocalpoint) {
            // Cari berdasarkan nama
            const focalPointDoc = await FocalPointMapping.findOne({
              recommendedFocalpoint: fp.recommendedFocalpoint
            });
            if (focalPointDoc) {
              updateData.focalPoints = focalPointDoc._id;
            } else {
              updateData.focalPoints = null;
            }
          } else {
            updateData.focalPoints = null;
          }
        } else {
          updateData.focalPoints = null;
        }

        // Konversi field `engagementStrategy`
        if (changeData.engagementStrategy) {
          const es = changeData.engagementStrategy;
          if (mongoose.Types.ObjectId.isValid(es)) {
            updateData.engagementStrategy = es;
          } else if (es._id && mongoose.Types.ObjectId.isValid(es._id)) {
            updateData.engagementStrategy = es._id;
          } else {
            updateData.engagementStrategy = null;
          }
        }

        // Konversi field `engagementFrequency`
        if (changeData.engagementFrequency) {
          const ef = changeData.engagementFrequency;
          if (mongoose.Types.ObjectId.isValid(ef)) {
            updateData.engagementFrequency = ef;
          } else if (ef._id && mongoose.Types.ObjectId.isValid(ef._id)) {
            updateData.engagementFrequency = ef._id;
          } else {
            updateData.engagementFrequency = null;
          }
        }

        // Konversi field `role`
        if (changeData.role && !changeData.role._id && changeData.role.name) {
          // Sudah ditangani di bawah
        } else if (changeData.role && changeData.role._id && mongoose.Types.ObjectId.isValid(changeData.role._id)) {
          updateData.role = changeData.role._id;
        }

        // Konversi field `stakeholderType`
        if (changeData.stakeholderType && !changeData.stakeholderType._id && changeData.stakeholderType.name) {
          // Sudah ditangani di bawah
        } else if (changeData.stakeholderType && changeData.stakeholderType._id && mongoose.Types.ObjectId.isValid(changeData.stakeholderType._id)) {
          updateData.stakeholderType = changeData.stakeholderType._id;
        }

        // Konversi field `location.province`
        if (changeData.location && changeData.location.province && changeData.location.province.name) {
          const provinceDoc = await Location.findOne({ name: changeData.location.province.name });
          if (provinceDoc) {
            // Pastikan Anda hanya mengganti ID provinsi, bukan seluruh objek location
            updateData.location = {
              ...updateData.location,
              province: provinceDoc._id
            };
          } else {
            return res.status(404).json({ message: "Province not found for update" });
          }
        }
        
        // Map field alias → field nama model yang benar
        const fieldAliasMap = {
          influence: "influenceLevel",
          interest: "interestLevel",
          opportunity: "opportunityLevel",
          benefit: "benefitLevel",
        };
        for (const [alias, modelField] of Object.entries(fieldAliasMap)) {
          if (updateData[alias] !== undefined) {
            updateData[modelField] = typeof updateData[alias] === "string"
              ? updateData[alias].toLowerCase()
              : updateData[alias];
            delete updateData[alias];
          }
          // Pastikan nilai yang sudah ada juga lowercase
          if (updateData[modelField] && typeof updateData[modelField] === "string") {
            updateData[modelField] = updateData[modelField].toLowerCase();
          }
        }
        // riskLevel juga perlu lowercase
        if (updateData.riskLevel && typeof updateData.riskLevel === "string") {
          updateData.riskLevel = updateData.riskLevel.toLowerCase();
        }

        // --- Akhir Proses Konversi ---
        
        // Lakukan pembaruan stakeholder + set status Approved
        updateData.status = "Approved";
        const updatedStakeholder = await Stakeholder.findByIdAndUpdate(
          request.stakeholderId,
          updateData,
          { new: true, runValidators: true }
        );

        if (!updatedStakeholder) {
          return res.status(404).json({ message: "Stakeholder to be updated not found." });
        }
      }
    } else if (status === "Rejected") {
      // Update status stakeholder menjadi Rejected
      await Stakeholder.findByIdAndUpdate(
        request.stakeholderId,
        { status: "Rejected" },
        { new: true }
      );
    }

    // 4. Update status permintaan perubahan itu sendiri
    request.status = status;
    request.reviewNote = reviewNote || "";
    request.reviewedBy = reviewerId;
    request.reviewedAt = new Date();
    await request.save();

    res.status(200).json({ message: `Change request reviewed as ${status}.`, request });

  } catch (error) {
    console.error("Error reviewing change request:", error);

    // Penanganan error yang lebih spesifik
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: `Invalid data format for field: ${error.path}` });
    }
    
    // Penanganan error umum
    res.status(500).json({ message: "Failed to review change request" });
  }
};

export const getLatestStatusForStakeholder = async (req, res) => {
  try {
    const { stakeholderId } = req.query;

    if (!stakeholderId) {
      return res.status(400).json({ message: "stakeholderId is required" });
    }

    const latestRequest = await StakeholderChangeRequest.findOne({
      stakeholderId: stakeholderId,
    })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!latestRequest) {
      return res.status(200).json({
        status: "Approved",
        reviewedAt: new Date(),
      });
    }

    res.status(200).json({
      status: latestRequest.status,
      reviewedAt: latestRequest.reviewedAt || latestRequest.createdAt,
    });
  } catch (error) {
    console.error("Error fetching latest status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteChangeRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const request = await StakeholderChangeRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Optional: pastikan yang delete adalah pemilik request atau admin
    if (request.requestedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this request" });
    }

    await StakeholderChangeRequest.findByIdAndDelete(id);

    res.status(200).json({ message: "Change request deleted successfully" });
  } catch (error) {
    console.error("Error deleting change request:", error);
    res.status(500).json({ message: "Failed to delete change request" });
  }
};

// Fungsi baru untuk mengajukan permintaan penghapusan stakeholder
export const createDeletionRequest = async (req, res) => {
  try {
    const { stakeholderId } = req.params;
    const userId = req.user.id;

    if (!stakeholderId) {
      return res.status(400).json({ message: "Stakeholder ID is required" });
    }

    // Cek apakah sudah ada pending request untuk stakeholder ini
    const existingPendingRequest = await StakeholderChangeRequest.findOne({
      stakeholderId,
      status: "Pending",
    });
    if (existingPendingRequest) {
      return res.status(400).json({
        message:
          "A pending change or deletion request already exists for this stakeholder.",
      });
    }

    const newRequest = new StakeholderChangeRequest({
      stakeholderId,
      requestedBy: userId,
      // changeData tidak diperlukan untuk permintaan hapus
      changeData: {},
      isDeletionRequest: true,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Deletion request submitted successfully.",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating deletion request:", error);
    res.status(500).json({ message: "Failed to submit deletion request" });
  }
};
