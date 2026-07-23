// scripts/backfillFocalPoints.js
//
// Stakeholder yang dibuat SEBELUM perbaikan ini tidak pernah memiliki field
// `focalPoints` ter-set (nilainya null), karena logika pencarian
// FocalPointMapping sebelumnya hanya dijalankan saat proses EDIT, bukan
// saat CREATE. Script ini AMAN dijalankan berkali-kali (idempotent):
// hanya mengisi stakeholder yang focalPoints-nya masih kosong, tidak
// mengubah data lain.
//
// Jalankan: node scripts/backfillFocalPoints.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Stakeholder from "../models/stakeholderModel.js";
import FocalPointMapping from "../models/focalPointMappingModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    const stakeholders = await Stakeholder.find({
      $or: [{ focalPoints: null }, { focalPoints: { $exists: false } }],
    });

    console.log(`Found ${stakeholders.length} stakeholder(s) without Focal Point mapping.`);

    let updated = 0;
    let noMapping = 0;

    for (const stakeholder of stakeholders) {
      if (!stakeholder.stakeholderType) {
        noMapping++;
        continue;
      }

      const mapping = await FocalPointMapping.findOne({
        stakeholderType: stakeholder.stakeholderType,
      });

      if (mapping) {
        stakeholder.focalPoints = mapping._id;
        await stakeholder.save();
        updated++;
        console.log(`  - Linked "${stakeholder.name}" -> mapping ${mapping._id}`);
      } else {
        noMapping++;
        console.warn(
          `  - No FocalPointMapping found for stakeholder "${stakeholder.name}" (stakeholderType: ${stakeholder.stakeholderType})`
        );
      }
    }

    console.log(`Done. Updated: ${updated}, no mapping found: ${noMapping}`);
    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
