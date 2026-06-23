// services/engagementCalculationService.js

/**
 * Mengonversi level teks (Low, Medium, High) menjadi nilai numerik.
 * @param {string} level - Level teks (e.g., "Low", "Medium", "High").
 * @returns {number | string} Nilai numerik (1, 2, 3) atau string kosong jika tidak cocok.
 */

const convertLevelToNumeric = (level) => {
  const normalized = (level || "").trim().toLowerCase();
  if (normalized === "high") return 3;
  if (normalized === "medium") return 2;
  if (normalized === "low") return 1;
  return ""; // fallback jika tidak cocok
};


/**
 * Menghitung analisis engagement lengkap berdasarkan level penilaian stakeholder.
 *
 * @param {object} assessmentLevels - Objek yang berisi influence, interest, riskLevel, opportunity, benefit.
 * @returns {object} Objek dengan metrik engagement yang dihitung.
 */
export const calculateCompleteEngagementAnalysis = (assessmentLevels) => {
  const { influence, interest, riskLevel, opportunity, benefit } = assessmentLevels;

  // --- 1. Hitung engagementStrategyResult (berdasarkan Influence dan Interest) ---
  let engagementStrategyResult;
  if (influence === "high" && interest === "high") {
    engagementStrategyResult = "Key Player";
  } else if (influence === "high" && (interest === "medium" || interest === "low")) {
    engagementStrategyResult = "Keep Satisfied";
  } else if (interest === "high" && (influence === "medium" || influence === "low")) {
    engagementStrategyResult = "Keep Informed";
  } else if (influence === "medium" && interest === "medium") {
    engagementStrategyResult = "Keep Informed";
  } else if ((influence === "medium" && interest === "low") || (influence === "low" && interest === "medium") || (influence === "low" && interest === "low")) {
    engagementStrategyResult = "Monitor";
  } else {
    engagementStrategyResult = "Check Input";
  }

  // --- 2. Hitung engagementIntensityResult (berdasarkan Risk Level, Opportunity, Benefit) ---
  let engagementIntensityResult;
  const numericRisk = convertLevelToNumeric(riskLevel);
  const numericOpportunity = convertLevelToNumeric(opportunity);
  const numericBenefit = convertLevelToNumeric(benefit);

  // Periksa apakah semua input kosong (sesuai IF(AND(I3=""; J3=""; K3=""); "Check Input";))
  if (numericRisk === "" && numericOpportunity === "" && numericBenefit === "") {
    engagementIntensityResult = "Check Input";
  } else {
    const validValues = [numericRisk, numericOpportunity, numericBenefit].filter(val => val !== "");
    const sum = validValues.reduce((acc, val) => acc + val, 0);
    const average = validValues.length > 0 ? sum / validValues.length : 0;

    if (average >= 2.5) {
      engagementIntensityResult = "Very High";
    } else if (average >= 2) {
      engagementIntensityResult = "High";
    } else if (average >= 1.5) {
      engagementIntensityResult = "Medium";
    } else {
      engagementIntensityResult = "Low";
    }
  }

  // --- 3. Hitung engagementPriorityResult (berdasarkan Engagement Strategy dan Engagement Intensity) ---
  let engagementPriorityResult;
  let engagementPriorityDescription;

  if (engagementStrategyResult === "Key Player") {
    if (engagementIntensityResult === "Very High" || engagementIntensityResult === "High") {
      engagementPriorityResult = "Engage intensively & continuously";
    } else {
      engagementPriorityResult = "Engage regularly & monitor closely";
    }
  } else if (engagementStrategyResult === "Keep Satisfied") {
    if (engagementIntensityResult === "Very High" || engagementIntensityResult === "High") {
      engagementPriorityResult = "Ensure satisfaction with proactive updates";
    } else {
      engagementPriorityResult = "Maintain engagement & respond to issues";
    }
  } else if (engagementStrategyResult === "Keep Informed") {
    if (engagementIntensityResult === "Very High" || engagementIntensityResult === "High") {
      engagementPriorityResult = "Communicate actively on key topics";
    } else {
      engagementPriorityResult = "Share information periodically";
    }
  } else if (engagementStrategyResult === "Monitor") {
    if (engagementIntensityResult === "Very High" || engagementIntensityResult === "High") {
      engagementPriorityResult = "Observe actively; engage if needed";
    } else {
      engagementPriorityResult = "Monitor periodically";
    }
  } else {
    engagementPriorityResult = "Check Input";
  }

  // --- 4. Tentukan deskripsi untuk engagementPriorityResult ---
  const engagementPriorityDescriptions = {
    "Engage intensively & continuously": "Structured, frequent, two-way engagement with stakeholders of high influence and high interest.",
    "Engage regularly & monitor closely": "Ongoing engagement while tracking stakeholder perspectives and project risks closely.",
    "Ensure satisfaction with proactive updates": "Provide clear, timely information to address concerns and expectations proactively.",
    "Maintain engagement & respond to issues": "Continue communication and respond to stakeholder feedback and concerns as needed.",
    "Communicate actively on key topics": "Deliver targeted information on material issues that stakeholders care about.",
    "Share information periodically": "Provide updates at regular intervals, typically for less critical stakeholders.",
    "Observe actively; engage if needed": "Monitor stakeholders’ positions or concerns, and initiate engagement when necessary.",
    "Monitor periodically": "Observe stakeholder dynamics or risks occasionally, without active engagement unless required.",
    "Check Input": "Please check the input values for a valid engagement priority calculation."
  };
  engagementPriorityDescription = engagementPriorityDescriptions[engagementPriorityResult] || "No description available.";


  return {
    engagementPriority: {
      calculatedFrom: { strategy: engagementStrategyResult, intensity: engagementIntensityResult },
      result: engagementPriorityResult,
      description: engagementPriorityDescription
    },
    engagementIntensity: {
      calculatedFrom: { riskLevel, opportunity, benefit },
      result: engagementIntensityResult,
      description: "Indicates the level of effort and resources required for engagement."
    },
    engagementApproach: {
      // engagementApproach logic remains as placeholder, as no specific formula was provided for it.
      // You can update this section with your specific logic for engagementApproach.
      calculatedFrom: { influence, interest, benefit, opportunity },
      result: "Monitor", // Placeholder
      description: "Suggests the best way to interact with the stakeholder."
    },
    engagementStrategy: {
      calculatedFrom: { influence, interest },
      result: engagementStrategyResult,
      description: "Outlines the overarching plan for engagement."
    }
  };
};
