import mongoose from "mongoose";
import dotenv from "dotenv";
import EngagementStrategy from "../models/engagementStrategyModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

const engagementStrategies = [
  "Manage legal/regulatory risk, align with national development priorities, maintain strategic alignment",
  "Manage and reduce operational risks through stakeholder early-warning inputs",
  "Maintain security coordination and protect strategic assets",
  "Engage in policy alignment and political advocacy",
  "Coordinate on economic, natural resources, and environmental policies",
  "Support financial oversight and investment alignment",
  "Ensure compliance and support energy sector development",
  "Monitor environmental compliance and sustainability",
  "Support workforce development and labor relations",
  "Align development planning with project objectives"
];

const seedStrategies = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // ❌ JANGAN deleteMany kalau mau aman
    // await EngagementStrategy.deleteMany();

    for (const text of engagementStrategies) {
      if (!text || text.trim() === "") continue;

      const existing = await EngagementStrategy.findOne({ strategy: text });

      if (!existing) {
        await EngagementStrategy.create({ strategy: text });
        console.log(`✓ Inserted: ${text}`);
      } else {
        console.log(`↺ Skipped (exists): ${text}`);
      }
    }

    console.log("\n🎉 Engagement strategies seeding completed!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedStrategies();