import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import Stakeholder from "../models/stakeholderModel.js";
import Role from "../models/roleModel.js";
import StakeholderType from "../models/stakeholderTypeModel.js";
import Location from "../models/locationModel.js";
import EngagementFrequency from "../models/engagementFrequencyModel.js";
import EngagementStrategy from "../models/engagementStrategyModel.js";
import { calculateCompleteEngagementAnalysis } from "../services/engagementCalculationService.js";
import { getFocalPointsForStakeholderType } from "../services/focalPointService.js";
import Justification from "../models/justificationModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

// 🔹 Data justifikasi ASLI yang diekspor langsung dari MongoDB Atlas
// (collection "justifications", field "text", source "'All in One'!D91:G").
// Ini persis sama dengan format yang dihasilkan workflow Google Sheets
// (lihat googleSheetController.saveJustification) dan persis yang
// diharapkan oleh fungsi formatJustification() di
// frontend/src/pages/EngagementJustification.jsx — baris "1. ...", baris
// "Q1".."Q30", baris "Yes"/"No", dst.
const justificationSamplesPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "data",
  "justificationSamples.json"
);
const REAL_JUSTIFICATION_SAMPLES = JSON.parse(
  fs.readFileSync(justificationSamplesPath, "utf8")
);

// Definisi stakeholder menggunakan nama, bukan hardcoded ObjectId
const stakeholderData = [
  {
    name: "H. Muzakkir Manaf",
    roleName: "Governor of Aceh",
    stakeholderTypeName: "Government-Provincial Executive",
    engagementCategory: "Primary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "high",
    interestLevel: "high",
    riskLevel: "high",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Monthly",
    engagementStrategyText: "Manage legal/regulatory risk, align with national development priorities, maintain strategic alignment",
    reengagementTriggers: {
      flags: {
        issueEscalation: false,
        projectMilestoneImpact: false,
        stakeholderRequest: false,
        regulatoryChangeAlert: false,
        mediaCoverageAlert: false,
        communityFeedbackReceived: false,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  {
    name: "Irjen Pol Achmad Kartiko",
    roleName: "District Police Office/ Chief (Polres/ Kapolres)",
    stakeholderTypeName: "Government-Security Forces",
    engagementCategory: "Primary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "high",
    interestLevel: "high",
    riskLevel: "high",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Monthly",
    engagementStrategyText: "Manage and reduce operational risks through stakeholder early-warning inputs",
    reengagementTriggers: {
      flags: {
        issueEscalation: true,
        projectMilestoneImpact: false,
        stakeholderRequest: false,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: false,
        communityFeedbackReceived: false,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  // ================= TAMBAHAN DATA =================

  {
    name: "Mayjen TNI Niko Fahrizal",
    roleName: "Military Commander (Pangdam)",
    stakeholderTypeName: "Government-Security Forces",
    engagementCategory: "Tertiary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "high",
    interestLevel: "medium",
    riskLevel: "high",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Quarterly",
    engagementStrategyText: "Maintain security coordination and protect strategic assets",
    reengagementTriggers: {
      flags: {
        issueEscalation: true,
        projectMilestoneImpact: false,
        stakeholderRequest: false,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: false,
        communityFeedbackReceived: false,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  {
    name: "Zulfadhli Amd",
    roleName: "Head of DPR Aceh",
    stakeholderTypeName: "Government-Provincial Legislative",
    engagementCategory: "Tertiary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "high",
    interestLevel: "high",
    riskLevel: "high",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Quarterly",
    engagementStrategyText: "Engage in policy alignment and political advocacy",
    reengagementTriggers: {
      flags: {
        issueEscalation: true,
        projectMilestoneImpact: true,
        stakeholderRequest: true,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: true,
        communityFeedbackReceived: false,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  {
    name: "Khairil Syahrial",
    roleName: "Head of Commission II DPR Aceh",
    stakeholderTypeName: "Government-Provincial Legislative",
    engagementCategory: "Tertiary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "medium",
    interestLevel: "high",
    riskLevel: "medium",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Quarterly",
    engagementStrategyText: "Coordinate on economic, natural resources, and environmental policies",
    reengagementTriggers: {
      flags: {
        issueEscalation: true,
        projectMilestoneImpact: false,
        stakeholderRequest: true,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: false,
        communityFeedbackReceived: false,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  {
    name: "Hj. Aisyah Ismail",
    roleName: "Head of Commission III DPR Aceh",
    stakeholderTypeName: "Government-Provincial Legislative",
    engagementCategory: "Tertiary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "high",
    interestLevel: "high",
    riskLevel: "medium",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Quarterly",
    engagementStrategyText: "Support financial oversight and investment alignment",
    reengagementTriggers: {
      flags: {
        issueEscalation: true,
        projectMilestoneImpact: true,
        stakeholderRequest: true,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: false,
        communityFeedbackReceived: false,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  {
    name: "Taufik",
    roleName: "Head of Energy and Mineral Resources Agency",
    stakeholderTypeName: "Government-Provincial Executive",
    engagementCategory: "Tertiary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "high",
    interestLevel: "high",
    riskLevel: "medium",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Quarterly",
    engagementStrategyText: "Ensure compliance and support energy sector development",
    reengagementTriggers: {
      flags: {
        issueEscalation: true,
        projectMilestoneImpact: true,
        stakeholderRequest: false,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: false,
        communityFeedbackReceived: false,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  {
    name: "A. Hanan",
    roleName: "Head of Environmental Agency",
    stakeholderTypeName: "Government-Provincial Executive",
    engagementCategory: "Tertiary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "high",
    interestLevel: "high",
    riskLevel: "high",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Quarterly",
    engagementStrategyText: "Monitor environmental compliance and sustainability",
    reengagementTriggers: {
      flags: {
        issueEscalation: true,
        projectMilestoneImpact: true,
        stakeholderRequest: false,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: true,
        communityFeedbackReceived: true,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  {
    name: "Akmil Husein",
    roleName: "Head of Manpower Agency",
    stakeholderTypeName: "Government-Provincial Executive",
    engagementCategory: "Tertiary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "medium",
    interestLevel: "high",
    riskLevel: "medium",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Quarterly",
    engagementStrategyText: "Support workforce development and labor relations",
    reengagementTriggers: {
      flags: {
        issueEscalation: true,
        projectMilestoneImpact: false,
        stakeholderRequest: true,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: false,
        communityFeedbackReceived: true,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  },

  {
    name: "Dr. Husnan Harun",
    roleName: "Head of Regional Development Agency",
    stakeholderTypeName: "Government-Provincial Executive",
    engagementCategory: "Tertiary",
    locationProvinceName: "Aceh (NAD)",
    locationCity: "Banda Aceh",
    contact: null,
    influenceLevel: "high",
    interestLevel: "medium",
    riskLevel: "medium",
    opportunityLevel: "high",
    benefitLevel: "high",
    engagementFrequencyName: "Quarterly",
    engagementStrategyText: "Align development planning with project objectives",
    reengagementTriggers: {
      flags: {
        issueEscalation: false,
        projectMilestoneImpact: true,
        stakeholderRequest: false,
        regulatoryChangeAlert: true,
        mediaCoverageAlert: false,
        communityFeedbackReceived: false,
      },
    },
    createdBy: "system",
    updatedBy: "system",
  }
];

// Ambil teks justifikasi ASLI (dari export MongoDB) secara bergilir
// (round-robin) untuk setiap stakeholder, supaya formatnya 100% sama
// dengan data produksi nyata — bukan teks generik buatan seeder.
const buildJustificationText = (info, engagementAnalysis, index) => {
  const sample =
    REAL_JUSTIFICATION_SAMPLES[index % REAL_JUSTIFICATION_SAMPLES.length];
  return sample;
};

const seedStakeholders = async () => {
  try {
    console.log("MongoDB Connected");

    await Stakeholder.deleteMany();
    console.log("Existing stakeholders deleted");

    // Hapus juga Justification lama, supaya tidak ada dokumen "yatim" yang
    // masih menunjuk ke _id stakeholder yang sudah dihapus di atas.
    await Justification.deleteMany();
    console.log("Existing justifications (linked to old stakeholders) deleted");

    // Lookup semua referensi sekaligus
    const [allRoles, allTypes, allLocations, allFrequencies, allStrategies] = await Promise.all([
      Role.find(),
      StakeholderType.find(),
      Location.find(),
      EngagementFrequency.find(),
      EngagementStrategy.find(),
    ]);

    const findRef = (collection, field, value, label) => {
      const doc = collection.find(d => d[field] === value);
      if (!doc) console.warn(`  ⚠ ${label} not found: "${value}"`);
      return doc ? doc._id : null;
    };

    const processedStakeholders = [];
    const engagementAnalysesByIndex = [];

    for (const info of stakeholderData) {
      const roleId        = findRef(allRoles,       "name",     info.roleName,            "Role");
      const typeId        = findRef(allTypes,        "name",     info.stakeholderTypeName, "StakeholderType");
      const provinceId    = findRef(allLocations,    "name",     info.locationProvinceName,"Location");
      const frequencyId   = findRef(allFrequencies,  "name",     info.engagementFrequencyName, "EngagementFrequency");
      const strategyId    = findRef(allStrategies,   "strategy", info.engagementStrategyText,  "EngagementStrategy");

      const assessmentLevels = {
        influence: info.influenceLevel,
        interest:  info.interestLevel,
        riskLevel: info.riskLevel,
        opportunity: info.opportunityLevel,
        benefit: info.benefitLevel,
      };

      const engagementAnalysis = calculateCompleteEngagementAnalysis(assessmentLevels);

      let focalPointId = null;
      try {
        const fp = await getFocalPointsForStakeholderType(info.stakeholderTypeName);
        focalPointId = fp ? fp._id : null;
      } catch (e) {
        console.warn(`  ⚠ Focal point not found for ${info.stakeholderTypeName}`);
      }

      processedStakeholders.push({
        name: info.name,
        role: roleId,
        stakeholderType: typeId,
        engagementCategory: info.engagementCategory,
        location: {
          province: provinceId,
          city: info.locationCity,
          district: null,
        },
        contact: info.contact,
        influenceLevel: info.influenceLevel,
        interestLevel:  info.interestLevel,
        riskLevel:      info.riskLevel,
        opportunityLevel: info.opportunityLevel,
        benefitLevel:   info.benefitLevel,
        engagementFrequency: frequencyId,
        engagementStrategy:  strategyId,
        focalPoints: focalPointId,
        reengagementTriggers: { flags: info.reengagementTriggers.flags },
        status: "Approved",
        createdBy: info.createdBy,
        updatedBy: info.updatedBy,
      });

      console.log(`Processed: ${info.name}`);
      console.log(`  role: ${info.roleName} → ${roleId || "NOT FOUND"}`);
      console.log(`  Engagement Priority: ${engagementAnalysis.engagementPriority.result}`);

      engagementAnalysesByIndex.push(engagementAnalysis);
    }

    const savedStakeholders = [];
    for (let i = 0; i < processedStakeholders.length; i++) {
      const data = processedStakeholders[i];
      const stakeholder = new Stakeholder(data);
      const saved = await stakeholder.save();
      savedStakeholders.push(saved);
      console.log(`✓ Saved: ${saved.name}`);

      // 🔹 Buat / perbarui Justification untuk stakeholder ini di sini juga
      // (bukan di seeder terpisah), supaya data Engagement Justification
      // SELALU tersedia setiap kali Stakeholder Seeder dijalankan ulang —
      // tidak lagi bergantung pada urutan menjalankan seeder lain secara
      // manual (lihat root cause di README bagian Engagement Justification).
      const info = stakeholderData[i];
      const justificationText = buildJustificationText(info, engagementAnalysesByIndex[i], i);
      await Justification.findOneAndUpdate(
        { stakeholder: saved._id },
        {
          stakeholder: saved._id,
          text: justificationText,
          source: "'All in One'!D91:G",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
      );
      console.log(`  ↳ Justification ready for: ${saved.name}`);
    }

    console.log("\n✅ Stakeholders seeding completed successfully!");
    savedStakeholders.forEach((s, i) => {
      console.log(`${i + 1}. ${s.name} | Priority: ${s.engagementPriority} | Status: ${s.status}`);
    });

    return savedStakeholders;
  } catch (error) {
    console.error("❌ Seeding error:", error);
    throw error;
  }
};

const runSeeder = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔗 Connected to MongoDB");
    await seedStakeholders();
    console.log("🎉 All operations completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

runSeeder();
export { seedStakeholders };
