// seeders/focalPointMappingSeeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FocalPointMapping from '../models/focalPointMappingModel.js';
import StakeholderType from '../models/stakeholderTypeModel.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stakeholderDB';

const focalPointMappingDataRaw = [
  {
    stakeholderType: "Academia & Education",
    recommendedFocalpoint: "Field Manager/ Public Relations Manager / CSR Manager / Community Engagement Lead",
    backupSupportFocalpoint: "Upstream Regulator (BPMA);Relevant Kadiv or Staff of BPMA / Senior Corporate Affairs Manager / Legal Manager / Compliance Manager"
  },
  {
    stakeholderType: "Civil Society and NGOs",
    recommendedFocalpoint: "Public Relations Manager/ Community Relations Manager / Social Performance Lead",
    backupSupportFocalpoint: "CSR Senior Manager / Legal Manager / Compliance Manager"
  },
  {
    stakeholderType: "Community-Based Organizations (CBOs)",
    recommendedFocalpoint: "Public Relations Manager/ CSR Manager / Community Engagement Lead / Department Head",
    backupSupportFocalpoint: "Senior CSR Manager / Community Engagement Advisor / Legal Manager / Compliance Officer"
  },
  {
    stakeholderType: "Directly Affected People (DAPs)",
    recommendedFocalpoint: "Public Relations Manager / Corporate Communications Lead",
    backupSupportFocalpoint: "CSR Manager / Legal Manager / Compliance Officer"
  },
  {
    stakeholderType: "Donors and Multilateral Institutions",
    recommendedFocalpoint: "CSR Manager, Finance Director, Public Affairs Manager",
    backupSupportFocalpoint: "Upstream Regulator (BPMA) – Relevant Kadiv or Staff /Senior Legal Manager / Head of Compliance / International Affairs Lead"
  },
  {
    stakeholderType: "Education and Training Institutions",
    recommendedFocalpoint: "CSR Manager / HC Manager/ HR Manager/ Public Relation / Community Engagement Lead",
    backupSupportFocalpoint: "Senior HR Manager / Legal Manager / Compliance Manager"
  },
  {
    stakeholderType: "Environmental Bodies and Consultants",
    recommendedFocalpoint: "HSE (Health, Safety, Environment) Manager / CSR Manager / Compliance Manager",
    backupSupportFocalpoint: "Senior HSE Advisor / Legal Manager / Head of Compliance"
  },
  {
    stakeholderType: "Government-District/City Executive",
    recommendedFocalpoint: "General Manager / Field Manager",
    backupSupportFocalpoint: "Upstream Regulator (BPMA); Relevant Deputy"
  },
  {
    stakeholderType: "Government-District/City Legislative",
    recommendedFocalpoint: "General Manager / Field Manager / Public Relations Manager / Government Relations Team",
    backupSupportFocalpoint: "Upstream Regulator (BPMA) – Relevant Deputy / Kadiv / Staff / Senior Government Relations Manager / Legal Manager"
  },
  {
    stakeholderType: "Government-Provincial Executive",
    recommendedFocalpoint: "General Manager / Field Manager",
    backupSupportFocalpoint: "Upstream Regulator (BPMA) – Chairman of BPMA / Relevant Deputy / Kadiv / Senior Government Relations Manager / Legal Manager"
  },
  {
    stakeholderType: "Government-Provincial Legislative",
    recommendedFocalpoint: "General Manager / Field Manager",
    backupSupportFocalpoint: "Upstream Regulator (BPMA); Relevant Deputy"
  },
  {
    stakeholderType: "Government-Security Forces",
    recommendedFocalpoint: "General Manager / Field Manager / Security Manager / Public Relations Manager / Government Relations Manager",
    backupSupportFocalpoint: "Upstream Regulator Security Liaison (if applicable) / Legal Manager / Compliance Manager"
  },
  {
    stakeholderType: "Government-Subdistrict & Village",
    recommendedFocalpoint: "Public Relations Manager / Government Relations Team / Community Relations Manager / Local Affairs Officer",
    backupSupportFocalpoint: "CSR Manager / Senior Legal Officer / Government Relations Lead / Compliance Officer"
  },
  {
    stakeholderType: "Government-Upstream Regulatory",
    recommendedFocalpoint: "Board of Director/ General Manager / Designated Manager",
    backupSupportFocalpoint: "Upstream Regulator (BPMA); Relevant Deputy"
  },
  {
    stakeholderType: "Health and Social Services",
    recommendedFocalpoint: "CSR Manager / Medical/Health Manager / HR Manager",
    backupSupportFocalpoint: "Legal Manager / Compliance Manager / Senior HR Manager"
  },
  {
    stakeholderType: "Investment and Licensing Agencies",
    recommendedFocalpoint: "Regulatory Affairs Manager / Legal Manager / Public Relations Manager",
    backupSupportFocalpoint: "Senior Legal Manager / Senior Compliance Manager / Government Relations Lead"
  },
  {
    stakeholderType: "Legal and Advisory Services",
    recommendedFocalpoint: "Legal Manager / Compliance Manager",
    backupSupportFocalpoint: "Senior Legal Manager / Senior Compliance Manager / Government Relations Lead"
  },
  {
    stakeholderType: "Local Communities",
    recommendedFocalpoint: "CSR Manager / Community Engagement Officer / Local Liaison Officer",
    backupSupportFocalpoint: "Community Relations Lead / Legal Manager / Compliance Manager"
  },
  {
    stakeholderType: "Media and Communication",
    recommendedFocalpoint: "Public Relations Manager / Communications Manager / External Relations Manager",
    backupSupportFocalpoint: "Senior Corporate Affairs Manager / Legal Manager / Compliance Manager"
  },
  {
    stakeholderType: "Political Figures and Bodies",
    recommendedFocalpoint: "Government Relations Manager / Public Relations Manager",
    backupSupportFocalpoint: "Senior Government Relations Manager / Legal Manager / Compliance Manager"
  }
];

async function seedFocalPointMappings() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Hapus data lama
    await FocalPointMapping.deleteMany({});
    console.log('Existing FocalPointMapping cleared');

    // Ambil semua StakeholderType
    const stakeholderTypes = await StakeholderType.find();
    const stakeholderTypeMap = {};
    stakeholderTypes.forEach(type => {
      stakeholderTypeMap[type.name] = type._id;
    });

    // Ganti nama jadi ObjectId
    const focalPointMappingData = focalPointMappingDataRaw.map(entry => {
      const objectId = stakeholderTypeMap[entry.stakeholderType];
      if (!objectId) {
        console.warn(`Stakeholder type "${entry.stakeholderType}" not found in DB.`);
        return null;
      }
      return {
        stakeholderType: objectId,
        recommendedFocalpoint: entry.recommendedFocalpoint,
        backupSupportFocalpoint: entry.backupSupportFocalpoint
      };
    }).filter(Boolean); // hilangkan null

    const inserted = await FocalPointMapping.insertMany(focalPointMappingData);
    console.log(`${inserted.length} FocalPointMappings seeded successfully`);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Seeder error:', err);
    process.exit(1);
  }
}

// Jalankan hanya jika dijalankan langsung
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFocalPointMappings();
}
