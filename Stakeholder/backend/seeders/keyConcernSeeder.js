import mongoose from "mongoose";
import dotenv from "dotenv";
import KeyConcern from "../models/keyConcernModel.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stakeholderDB";

const keyConcernsData = [
  {
    key_concern: "Environmental Impact: Concerns over habitat destruction, water contamination, and air pollution.",
    mitigation_plan: "ESIA + EMP + monitoring",
    objective: "Minimize environmental footprint and ensure compliance with standards.",
  },
  {
    key_concern: "Health Risks: Potential health hazards from emissions and spills affecting local populations.",
    mitigation_plan: "Health risk assessment + air/water testing + local drills",
    objective: "Safeguard community health while minimizing reputational risk and ensuring operational continuity.",
  },
  {
    key_concern: "Cultural Heritage: Protection of indigenous lands and cultural sites from exploitation.",
    mitigation_plan: "CHIA + FPIC + site protection",
    objective: "Respect cultural values to build community trust and reduce delays or legal challenges.",
  },
  {
    key_concern: "Economic Benefits: Expectations for local employment opportunities and business development.",
    mitigation_plan: "Local hiring plan + SME procurement",
    objective: "Stimulate local economies while enhancing social license and local stakeholder support.",
  },
  {
    key_concern: "Fair Compensation: Adequate compensation for land use and resource extraction.",
    mitigation_plan: "Transparent valuation + community consultation + written agreements",
    objective: "Build credibility and avoid disputes that could delay operations or affect future access.",
  },
  {
    key_concern: "Community Displacement: Risks of displacement due to project developments.",
    mitigation_plan: "Resettlement plan + FPIC + fair land acquisition",
    objective: "Ensure ethical land use while minimizing legal, social, and reputational risks.",
  },
  {
    key_concern: "Infrastructure Strain: Impact on local infrastructure like roads, schools, and healthcare facilities.",
    mitigation_plan: "Infrastructure support plan + government coordination",
    objective: "Improve shared infrastructure to support stable operations and enhance public goodwill.",
  },
  {
    key_concern: "Transparency: Desire for clear and honest communication about project impacts and benefits.",
    mitigation_plan: "Regular updates + multi-platform info + open forums",
    objective: "Strengthen stakeholder confidence and reduce misinformation or resistance to the project.",
  },
  {
    key_concern: "Environmental Justice: Ensuring that vulnerable communities are not disproportionately affected.",
    mitigation_plan: "Impact mapping + targeted support + inclusion of vulnerable groups",
    objective: "Demonstrate inclusive impact management to support ESG performance and reduce litigation risk.",
  },
  {
    key_concern: "Regulatory Compliance: Adherence to local and international environmental standards.",
    mitigation_plan: "Audit checklist + align with AMDAL/IFC + permit tracking",
    objective: "Avoid fines, shutdowns, and reputation damage through consistent regulatory performance.",
  },
  {
    key_concern: "Emergency Preparedness: Plans for responding to spills, leaks, or other accidents.",
    mitigation_plan: "Response plan + community drills + equipment readiness",
    objective: "Protect people and assets, ensuring business continuity in crisis scenarios.",
  },
  {
    key_concern: "Climate Change: Contribution of operations to global warming and climate change.",
    mitigation_plan: "GHG inventory + emission reduction plan + offsets strategy",
    objective: "Demonstrate climate responsibility to improve ESG ratings and secure long-term investor and regulatory trust.",
  },
  {
    key_concern: "Resource Depletion: Concerns over the sustainability of resource extraction.",
    mitigation_plan: "Resource management plan + efficiency monitoring",
    objective: "Ensure long-term resource availability while improving operational efficiency and cost savings.",
  },
  {
    key_concern: "Wildlife Protection: Safeguarding local wildlife and biodiversity.",
    mitigation_plan: "Biodiversity study + exclusion zones + habitat restoration",
    objective: "Minimize ecological disruption to maintain compliance and public support for ongoing operations.",
  },
  {
    key_concern: "Noise Pollution: Impact of noise from drilling and transportation on local communities.",
    mitigation_plan: "Noise barriers + scheduling limits + community alerts",
    objective: "Reduce noise-related complaints and operational interruptions by maintaining community well-being.",
  },
  {
    key_concern: "Water Usage: High water consumption and its effects on local water resources.",
    mitigation_plan: "Water sourcing plan + reuse systems + local impact review",
    objective: "Promote sustainable water use to preserve local resources and prevent operational restrictions.",
  },
  {
    key_concern: "Air Quality: Emissions affecting air quality and public health.",
    mitigation_plan: "Emission controls + air monitoring + public disclosure",
    objective: "Protect public health and meet regulatory requirements to maintain a stable operating environment.",
  },
  {
    key_concern: "Soil Contamination: Risks of soil degradation and contamination.",
    mitigation_plan: "Spill prevention + soil testing + remediation plan",
    objective: "Prevent long-term environmental liabilities and protect project integrity.",
  },
  {
    key_concern: "Community Health Services: Adequacy of local health services to address project-related health issues.",
    mitigation_plan: "Medical support fund + health partnerships + mobile clinics",
    objective: "Support resilient local health systems to build goodwill and reduce reputational and operational risks.",
  },
  {
    key_concern: "Worker Safety: Ensuring the safety of workers and contractors on-site.",
    mitigation_plan: "OHS standards + PPE + regular safety training",
    objective: "Ensure a zero-harm workplace to protect workforce productivity and meet legal and ethical responsibilities.",
  },
  {
    key_concern: "Community Engagement: Involvement of local communities in decision-making processes.",
    mitigation_plan: "Stakeholder forum + feedback loop + local reps involved",
    objective: "Strengthen social license and reduce conflict by enabling inclusive, informed decision-making.",
  },
  {
    key_concern: "Economic Diversification: Opportunities for communities to diversify their economies beyond oil and gas.",
    mitigation_plan: "Local business support + skills training + non-O&G projects",
    objective: "Foster long-term community resilience while reducing dependence-related reputational risks.",
  },
  {
    key_concern: "Education and Training: Provision of education and training programs for local populations.",
    mitigation_plan: "Vocational programs + school support + O&G literacy sessions",
    objective: "Build local capacity to enhance employment readiness and reinforce positive company presence.",
  },
  {
    key_concern: "Supply Chain Opportunities: Inclusion of local businesses in the project's supply chain.",
    mitigation_plan: "SME support + open tender + local vendor training",
    objective: "Strengthen local economies while improving supply chain resilience and enhancing community support.",
  },
  {
    key_concern: "Access to Information: Availability of project-related information to the public.",
    mitigation_plan: "Local info centers + multilingual materials + regular briefings",
    objective: "Promote transparency and trust, reducing misinformation and reputational risks.",
  },
];

// Connect to MongoDB and seed data
mongoose.connect(MONGO_URI).then(async () => {
  console.log("MongoDB connected for KeyConcern seeding.");

  // Drop collection entirely agar index unique ikut bersih
  try {
    await KeyConcern.collection.drop();
    console.log("KeyConcern collection dropped.");
  } catch (e) {
    // Collection mungkin belum ada, lanjut saja
    console.log("Collection tidak ada, lanjut insert.");
  }

  // ordered: false = lanjut insert meski ada 1 yang gagal
  const result = await KeyConcern.insertMany(keyConcernsData, { ordered: false });
  console.log(`Key concerns seeded: ${result.length} entries inserted.`);
  process.exit();
}).catch(err => {
  console.error("Error seeding key concerns:", err);
  process.exit(1);
});
