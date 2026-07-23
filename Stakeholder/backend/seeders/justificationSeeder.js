// seeders/justificationSeeder.js
//
// Seeder TAMBAHAN/CADANGAN untuk mengisi koleksi "Justification" untuk
// setiap stakeholder yang sudah ada di database. Sumber teksnya adalah
// data ASLI yang diekspor langsung dari MongoDB Atlas oleh pengguna
// (lihat backend/seeders/data/justificationSamples.json), BUKAN teks
// generik — sesuai permintaan agar data MongoDB asli dipakai sebagai
// sumber utama.
//
// Catatan: sejak perbaikan terbaru, `stakeholderSeeder.js` SUDAH otomatis
// membuat dokumen Justification untuk setiap stakeholder yang dia buat
// (lihat fungsi seedStakeholders -> Justification.findOneAndUpdate).
// Seeder ini tetap dipertahankan sebagai cara CEPAT untuk mengisi ulang/
// memperbaiki teks Justification TANPA perlu menghapus & membuat ulang
// seluruh data Stakeholder.
//
// Jalankan:
//   npm run seed:justifications

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import Stakeholder from "../models/stakeholderModel.js";
import Justification from "../models/justificationModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

const justificationSamplesPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "data",
  "justificationSamples.json"
);
const REAL_JUSTIFICATION_SAMPLES = JSON.parse(
  fs.readFileSync(justificationSamplesPath, "utf8")
);

const seedJustifications = async () => {
  const stakeholders = await Stakeholder.find();

  if (stakeholders.length === 0) {
    console.warn(
      "⚠ Tidak ada data Stakeholder ditemukan. Jalankan seed:stakeholders terlebih dahulu."
    );
    return;
  }

  let created = 0;
  let updated = 0;

  for (let i = 0; i < stakeholders.length; i++) {
    const stakeholder = stakeholders[i];
    const text = REAL_JUSTIFICATION_SAMPLES[i % REAL_JUSTIFICATION_SAMPLES.length];
    const source = "'All in One'!D91:G";

    const existing = await Justification.findOne({ stakeholder: stakeholder._id });
    if (existing) {
      existing.text = text;
      existing.source = source;
      await existing.save();
      updated += 1;
    } else {
      await Justification.create({
        stakeholder: stakeholder._id,
        text,
        source,
      });
      created += 1;
    }
    console.log(`✓ Justification ready for: ${stakeholder.name}`);
  }

  console.log(
    `\n🎉 Justification seeding completed! Created: ${created}, Updated: ${updated}`
  );
};

const runSeeder = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🔗 Connected to MongoDB");
    await seedJustifications();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding justifications:", err);
    process.exit(1);
  }
};

runSeeder();
export { seedJustifications };
