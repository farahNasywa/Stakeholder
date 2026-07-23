// scripts/verifyFocalPointCoverage.js
//
// Mengecek apakah SETIAP StakeholderType di database punya pasangan
// FocalPointMapping. Kalau ada yang belum, stakeholder dengan tipe itu
// tidak akan pernah punya Focal Point/Backup sampai mapping-nya ditambahkan
// manual ke koleksi focalpointmappings.
//
// Jalankan: node scripts/verifyFocalPointCoverage.js
// Script ini HANYA membaca data (read-only), tidak mengubah apa pun.

import mongoose from "mongoose";
import dotenv from "dotenv";
import StakeholderType from "../models/stakeholderTypeModel.js";
import FocalPointMapping from "../models/focalPointMappingModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected\n");

    const types = await StakeholderType.find();
    const mappings = await FocalPointMapping.find();
    const mappedTypeIds = new Set(mappings.map((m) => m.stakeholderType.toString()));

    console.log(`Total StakeholderType: ${types.length}`);
    console.log(`Total FocalPointMapping: ${mappings.length}\n`);

    const missing = types.filter((t) => !mappedTypeIds.has(t._id.toString()));

    if (missing.length === 0) {
      console.log("✅ Semua StakeholderType sudah punya FocalPointMapping.");
    } else {
      console.log(`⚠️  ${missing.length} StakeholderType BELUM punya FocalPointMapping:`);
      missing.forEach((t) => console.log(`  - ${t.name} (id: ${t._id})`));
    }

    // Cek juga arah sebaliknya: mapping yang stakeholderType-nya sudah
    // tidak ada lagi di koleksi StakeholderType (data yatim/orphan).
    const typeIds = new Set(types.map((t) => t._id.toString()));
    const orphanMappings = mappings.filter((m) => !typeIds.has(m.stakeholderType.toString()));
    if (orphanMappings.length > 0) {
      console.log(`\n⚠️  ${orphanMappings.length} FocalPointMapping mengacu ke StakeholderType yang sudah tidak ada:`);
      orphanMappings.forEach((m) => console.log(`  - mapping id: ${m._id} (stakeholderType: ${m.stakeholderType})`));
    }

    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
