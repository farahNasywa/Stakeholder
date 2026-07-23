// seeders/checkData.js
//
// Script diagnostik untuk mengecek langsung ke MongoDB Atlas:
//  - Berapa jumlah Stakeholder yang ada
//  - Berapa jumlah Justification yang ada
//  - Stakeholder mana yang SUDAH punya Justification
//  - Stakeholder mana yang BELUM punya Justification (justification: null)
//
// Jalankan dengan:
//   node seeders/checkData.js
//
// Gunakan ini untuk memastikan apakah data Engagement Justification memang
// sudah ada di database sebelum menuduh frontend/backend yang salah.

import mongoose from "mongoose";
import dotenv from "dotenv";
import Stakeholder from "../models/stakeholderModel.js";
import Justification from "../models/justificationModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`🔗 Connected to: ${MONGO_URI.replace(/\/\/.*@/, "//<credentials>@")}\n`);

    const stakeholders = await Stakeholder.find().select("_id name");
    const justifications = await Justification.find().select("stakeholder text");

    console.log(`📊 Total Stakeholder : ${stakeholders.length}`);
    console.log(`📊 Total Justification: ${justifications.length}\n`);

    const justifiedIds = new Set(justifications.map((j) => j.stakeholder.toString()));

    const withJustification = stakeholders.filter((s) => justifiedIds.has(s._id.toString()));
    const withoutJustification = stakeholders.filter((s) => !justifiedIds.has(s._id.toString()));

    console.log(`✅ Stakeholder DENGAN Justification (${withJustification.length}):`);
    withJustification.forEach((s) => console.log(`   - ${s.name}  (_id: ${s._id})`));

    console.log(`\n❌ Stakeholder TANPA Justification (${withoutJustification.length}):`);
    withoutJustification.forEach((s) => console.log(`   - ${s.name}  (_id: ${s._id})`));

    // Cek juga apakah ada Justification "yatim" yang menunjuk ke stakeholder
    // yang sudah tidak ada lagi (akibat re-seed Stakeholder tanpa re-seed
    // Justification).
    const stakeholderIds = new Set(stakeholders.map((s) => s._id.toString()));
    const orphanJustifications = justifications.filter(
      (j) => !stakeholderIds.has(j.stakeholder.toString())
    );

    if (orphanJustifications.length > 0) {
      console.log(
        `\n⚠ Ditemukan ${orphanJustifications.length} Justification "yatim" (menunjuk ke stakeholder yang sudah tidak ada). ` +
          `Ini biasanya terjadi karena Stakeholder Seeder dijalankan ulang TANPA menjalankan ulang Justification Seeder.`
      );
    }

    if (stakeholders.length === 0) {
      console.log(
        "\n👉 Belum ada data Stakeholder sama sekali. Jalankan dulu: npm run seed:stakeholders"
      );
    } else if (withoutJustification.length === stakeholders.length) {
      console.log(
        "\n👉 Tidak ada satupun stakeholder yang punya Justification. Jalankan: npm run seed:justifications (atau npm run seed:stakeholders ulang, karena sekarang otomatis membuat Justification juga)."
      );
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error checking data:", err);
    process.exit(1);
  }
};

run();
