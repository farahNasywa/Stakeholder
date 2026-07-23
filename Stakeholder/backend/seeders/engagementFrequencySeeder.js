import mongoose from "mongoose";
import dotenv from "dotenv";
import EngagementFrequency from "../models/engagementFrequencyModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

const frequencies = [
  {
    name: "Weekly",
    description: "For project-critical stakeholders (e.g. contractors, communities during construction phase). Used during high-risk or high-activity periods."
  },
  {
    name: "Bi-weekly",
    description: "When rapid updates are needed (e.g. during E&S mitigation or incident response)."
  },
  {
    name: "Monthly",
    description: "Standard for local government, impacted communities, contractors, and labor groups."
  },
  {
    name: "Every 6 Weeks",
    description: "Useful for technical partners, project steering committees, or joint venture participants."
  },
  {
    name: "Quarterly",
    description: "Common for regulators, NGOs, media briefings, provincial governments. Matches many ESG reporting timelines."
  },
  {
    name: "Bi-annually (Every 6 months)",
    description: "Suitable for academia, distant stakeholders, regional NGOs, and watchdog groups."
  },
  {
    name: "Annually",
    description: "For general public, corporate shareholders, and sustainability/ESG report users."
  },
  {
    name: "Ad-hoc / As Needed",
    description: "Triggered by incidents, major milestones, or stakeholder requests. Flexibility is key here."
  },
  {
    name: "Aligned with Project Milestones",
    description: "Used for engagement during exploration, permitting, construction, decommissioning, etc."
  },
  {
    name: "During Regulatory Submissions",
    description: "Required frequency for authorities and permitting bodies; often tied to deadlines."
  },
  {
    name: "During Crisis or Emergency Events",
    description: "Immediate and frequent contact with affected parties (e.g., spills, accidents, security)."
  },
  {
    name: "Ongoing / Continuous",
    description: "For embedded stakeholders like in-field community liaisons, on-site contractors, or co-management partners."
  }
];

mongoose.connect(MONGO_URI).then(async () => {
  console.log("MongoDB connected");
  await EngagementFrequency.deleteMany();
  await EngagementFrequency.insertMany(frequencies);
  console.log("EngagementFrequency seeding completed");
  process.exit();
}).catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});