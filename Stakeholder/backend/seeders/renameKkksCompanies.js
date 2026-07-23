// seeders/renameKkksCompanies.js
//
// Script AMAN (tidak menghapus data apa pun) untuk memberi nama resmi
// pada akun KKKS yang sudah ada, supaya kolom "KKKS" pada halaman
// Validation BPMA menampilkan nama perusahaan yang benar (diambil
// langsung dari User.name, bukan hardcode).
//
// Jalankan sekali: node seeders/renameKkksCompanies.js
// Aman dijalankan berkali-kali (idempotent) - hanya mencocokkan lewat
// email dan memperbarui field `name`, tidak menyentuh password/role/data lain.
// User yang emailnya tidak ada dalam daftar TIDAK akan diubah/dihapus.

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

// Sesuaikan email di sini dengan email akun KKKS yang SUDAH ADA di database kamu.
const companyNameByEmail = {
  "bpma@gmail.com": "BPMA Admin",
  "medco@gmail.com": "Medco E&P Malaka",
  "triangle@gmail.com": "Triangle Pase Inc.",
  "zaratex@gmail.com": "Zaratex",
  "conrad@gmail.com": "Zaratex", // jaga-jaga kalau akun lama masih pakai email 'conrad'
  "pema@gmail.com": "Pema Global Energi",
  "aceh.energy@gmail.com": "Aceh Energy",
};

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    let updated = 0;
    let skipped = 0;

    for (const [email, name] of Object.entries(companyNameByEmail)) {
      const user = await User.findOne({ email });
      if (!user) {
        skipped++;
        continue;
      }
      if (user.name !== name) {
        user.name = name;
        await user.save();
        console.log(`Updated: ${email} -> "${name}"`);
        updated++;
      }
    }

    console.log(`Done. Updated: ${updated}, not found/skipped: ${skipped}`);
    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
