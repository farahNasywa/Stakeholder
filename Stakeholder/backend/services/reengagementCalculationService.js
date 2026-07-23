// services/reengagementCalculationService.js

export const calculateReengagementScore = (flags) => {
  let score = 0;
  
  score += flags.issueEscalation ? 10 : 1;           // D2
  score += flags.projectMilestoneImpact ? 8 : 2;     // E2
  score += flags.stakeholderRequest ? 9 : 1;         // F2
  score += flags.regulatoryChangeAlert ? 7 : 3;      // G2
  score += flags.mediaCoverageAlert ? 6 : 4;         // H2
  score += flags.communityFeedbackReceived ? 5 : 3;  // I2
  
  return score;
};

/**
 * Determine re-engagement status based on score
 * Rumus: IF(score >= 21, "Re-engage", "No re-engagement needed")
 */
export const calculateReengagementStatus = (score) => {
  return score >= 21 ? 'Re-engage' : 'No re-engagement needed';
};

/**
 * Get re-engagement reason based on score
 * Berdasarkan rumus Excel dengan nested IF statements
 */
export const calculateReengagementReason = (score) => {
  if (score >= 46) {
    return 'Critical issues; Very High Risk; Immediate action and continuous monitoring (Masalah kritis; Risiko sangat tinggi; Tindakan segera dan pemantauan berkelanjutan)';
  } else if (score >= 41) {
    return 'Serious concerns; High Risk; Rapid follow-up required (Kekhawatiran serius; Risiko tinggi; Tindak lanjut cepat diperlukan)';
  } else if (score >= 31) {
    return 'Moderate concerns; Medium Risk; Plan timely engagement (Kekhawatiran sedang; Risiko sedang; Rencanakan keterlibatan tepat waktu)';
  } else if (score >= 21) {
    return 'Low impact; Low Risk; Monitor and engage if new issues arise (Dampak rendah; Risiko rendah; Pantau dan libatkan jika muncul isu baru)';
  } else if (score >= 11) {
    return 'Minimal concerns; Very Low Risk; Low priority follow-up (Kekhawatiran minimal; Risiko sangat rendah; Tindak lanjut dengan prioritas rendah)';
  } else {
    return 'No significant concerns; Negligible Risk; No action necessary (Tidak ada kekhawatiran signifikan; Risiko sangat kecil; Tidak perlu Tindakan)';
  }
};

/**
 * Complete re-engagement analysis
 * Main function yang menggabungkan semua calculation
 */
export const calculateCompleteReengagementAnalysis = (flags) => {
  // Validate input
  if (!flags || typeof flags !== 'object') {
    throw new Error('Flags must be a valid object');
  }

  // Default flags jika tidak ada
  const defaultFlags = {
    issueEscalation: null,
    projectMilestoneImpact: null,
    stakeholderRequest: null,
    regulatoryChangeAlert: null,
    mediaCoverageAlert: null,
    communityFeedbackReceived: null,
  };

  const validatedFlags = { ...defaultFlags, ...flags };

  // Calculate score
  const score = calculateReengagementScore(validatedFlags);
  
  // Calculate status and reason
  const status = calculateReengagementStatus(score);
  const reason = calculateReengagementReason(score);

  return {
    score,
    status,
    reason,
    flags: validatedFlags,
    calculatedAt: new Date().toISOString(),
  };
};

/**
 * Validate flags structure
 */
export const validateReengagementFlags = (flags) => {
  const requiredFlags = [
    'issueEscalation',
    'projectMilestoneImpact', 
    'stakeholderRequest',
    'regulatoryChangeAlert',
    'mediaCoverageAlert',
    'communityFeedbackReceived'
  ];

  const errors = [];
  
  requiredFlags.forEach(flag => {
    if (!(flag in flags)) {
      errors.push(`Missing flag: ${flag}`);
    } else if (typeof flags[flag] !== 'boolean') {
      errors.push(`Flag ${flag} must be boolean, got ${typeof flags[flag]}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get score breakdown for debugging/display
 */
export const getScoreBreakdown = (flags) => {
  const breakdown = {
    issueEscalation: { flag: flags.issueEscalation, score: flags.issueEscalation ? 10 : 1 },
    projectMilestoneImpact: { flag: flags.projectMilestoneImpact, score: flags.projectMilestoneImpact ? 8 : 2 },
    stakeholderRequest: { flag: flags.stakeholderRequest, score: flags.stakeholderRequest ? 9 : 1 },
    regulatoryChangeAlert: { flag: flags.regulatoryChangeAlert, score: flags.regulatoryChangeAlert ? 7 : 3 },
    mediaCoverageAlert: { flag: flags.mediaCoverageAlert, score: flags.mediaCoverageAlert ? 6 : 4 },
    communityFeedbackReceived: { flag: flags.communityFeedbackReceived, score: flags.communityFeedbackReceived ? 5 : 3 },
  };

  const totalScore = Object.values(breakdown).reduce((sum, item) => sum + item.score, 0);

  return {
    breakdown,
    totalScore
  };
};

// Default export untuk kemudahan import
const reengagementCalculationService = {
  calculateReengagementScore,
  calculateReengagementStatus,
  calculateReengagementReason,
  calculateCompleteReengagementAnalysis,
  validateReengagementFlags,
  getScoreBreakdown
};

export default reengagementCalculationService;