import mongoose from "mongoose";
import dotenv from "dotenv";
import StakeholderType from "./../models/stakeholderTypeModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

const stakeholderTypes = [
  { name: "Academia & Education" },
  { name: "Civil Society and NGOs" },
  { name: "Community-Based Organizations (CBOs)" },
  { name: "Directly Affected People (DAPs)" },
  { name: "Donors and Multilateral Institutions" },
  { name: "Education and Training Institutions" },
  { name: "Environmental Bodies and Consultants" },
  { name: "Government-District/City Executive" },
  { name: "Government-District/City Legislative" },
  { name: "Government-Provincial Executive" },
  { name: "Government-Provincial Legislative" },
  { name: "Government-Security Forces" },
  { name: "Government-Subdistrict & Village" },
  { name: "Government-Upstream Regulatory" },
  { name: "Health and Social Services" },
  { name: "Investment and Licensing Agencies" },
  { name: "Legal and Advisory Services" },
  { name: "Local Communities" },
  { name: "Media and Communication" },
  { name: "Political Figures and Bodies" },
  { name: "Private Sector and Businesses" },
  { name: "Religious Courts and Judicial Bodies" },
  { name: "Religious Organizations and Leaders" },
  { name: "State-Owned Enterprises (BUMN/BUMD)" }
];

mongoose.connect(MONGO_URI).then(async () => {
  console.log("MongoDB Connected");

  await StakeholderType.deleteMany(); // opsional: hapus data sebelumnya
  await StakeholderType.insertMany(stakeholderTypes);

  console.log("StakeholderTypes seeding completed.");
  process.exit(); // keluar setelah selesai
}).catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
