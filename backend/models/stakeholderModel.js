import mongoose from "mongoose";
import { calculateCompleteEngagementAnalysis } from "../services/engagementCalculationService.js";
import { calculateCompleteReengagementAnalysis } from "../services/reengagementCalculationService.js";

const stakeholderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    stakeholderType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StakeholderType",
      required: true,
    },
    engagementCategory: {
      type: String,
      required: true,
      enum: ["Primary", "Secondary", "Tertiary"],
    },
    location: {
      province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: false,
      },
      city: { type: String, required: false },
      district: { type: String, required: false },
    },
    contact: {
      type: String,
      default: null,
    },
    // Assessment levels
    influenceLevel: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    interestLevel: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    opportunityLevel: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    benefitLevel: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    // Calculated fields
    engagementPriority: {
      type: String,
      default: null,
    },
    engagementRelevance: {
      type: String,
      required: false,
      enum: ["high", "medium", "low"],
    },
    engagementFrequency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EngagementFrequency",
      required: false,
    },
    engagementStrategy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EngagementStrategy",
      required: false,
    },
    focalPoints: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FocalPointMapping",
      default: null,
    },
    // Re-engagement triggers
    reengagementTriggers: {
      flags: {
        issueEscalation: { type: Boolean, default: false },
        projectMilestoneImpact: { type: Boolean, default: false },
        stakeholderRequest: { type: Boolean, default: false },
        regulatoryChangeAlert: { type: Boolean, default: false },
        mediaCoverageAlert: { type: Boolean, default: false },
        communityFeedbackReceived: { type: Boolean, default: false },
      },
      status: {
        type: String,
        enum: ["Re-engage", "No re-engagement needed"],
        default: "No re-engagement needed",
      },
      reasons: {
        type: String,
        default:
          "No significant concerns; Negligible Risk; No action necessary (Tidak ada kekhawatiran signifikan; Risiko sangat kecil; Tidak perlu Tindakan)",
      },
      score: {
        type: Number,
        default: 6, // minimum score ketika semua flags = false
      },
      calculatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    // Status untuk approval workflow
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
    },
    // Tracking changes
    originalData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    changeRequestedBy: {
      type: String,
      default: null,
    },
    changeRequestedAt: {
      type: Date,
      default: null,
    },
    validatedBy: {
      type: String,
      default: null,
    },
    validatedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    mitigationPlanDescription: {
      type: String,
      default: null,
    },
    createdBy: {
      type: String,
      required: false,
    },
    updatedBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: false,
    versionKey: "__v",
  }
);

// Middleware pre-save untuk kalkulasi otomatis
stakeholderSchema.pre("save", function (next) {
  if (
    this.isModified([
      "influenceLevel",
      "interestLevel",
      "riskLevel",
      "opportunityLevel",
      "benefitLevel",
    ])
  ) {
    const assessmentLevels = {
      influence: this.influenceLevel,   // pakai field baru
      interest: this.interestLevel,
      riskLevel: this.riskLevel,
      opportunity: this.opportunityLevel,
      benefit: this.benefitLevel,
    };

    const analysis = calculateCompleteEngagementAnalysis(assessmentLevels);

    this.engagementPriority = analysis.engagementPriority.result;
    this.engagementRelevance = analysis.engagementIntensity.result;
  }

  // re-engagement triggers tetap sama
  try {
    const flags = this.reengagementTriggers?.flags || {};
    const reengagementAnalysis = calculateCompleteReengagementAnalysis(flags);

    this.reengagementTriggers.status = reengagementAnalysis.status;
    this.reengagementTriggers.reasons = reengagementAnalysis.reason;
    this.reengagementTriggers.score = reengagementAnalysis.score;
    this.reengagementTriggers.calculatedAt = new Date();
  } catch (error) {
    console.error("Error calculating re-engagement triggers:", error);
    this.reengagementTriggers.status = "No re-engagement needed";
    this.reengagementTriggers.reasons = "Error in calculation - using default";
    this.reengagementTriggers.score = 6;
  }

  next();
});



// Method untuk handle approval workflow
stakeholderSchema.methods.requestChange = function (changedData, requestedBy) {
  this.originalData = this.toObject();
  delete this.originalData._id;
  delete this.originalData.__v;

  Object.assign(this, changedData);
  this.status = "Pending";
  this.changeRequestedBy = requestedBy;
  this.changeRequestedAt = new Date();
  this.updatedBy = requestedBy;

  return this.save();
};

stakeholderSchema.methods.approveChange = function (approvedBy) {
  this.status = "Approved";
  this.validatedBy = approvedBy;
  this.validatedAt = new Date();
  this.originalData = null;
  this.changeRequestedBy = null;
  this.changeRequestedAt = null;
  this.rejectionReason = null;

  return this.save();
};

stakeholderSchema.methods.rejectChange = function (rejectedBy, reason) {
  if (this.originalData) {
    const originalData = { ...this.originalData };
    Object.assign(this, originalData);
  }

  this.status = "Rejected";
  this.validatedBy = rejectedBy;
  this.validatedAt = new Date();
  this.rejectionReason = reason;

  return this.save();
};

// Indexes
stakeholderSchema.index({ stakeholderType: 1 });
stakeholderSchema.index({ location: 1 });
stakeholderSchema.index({ status: 1 });
stakeholderSchema.index({ createdBy: 1 });
stakeholderSchema.index({ "reengagementTriggers.status": 1 });
stakeholderSchema.index({ "reengagementTriggers.score": 1 });

const Stakeholder = mongoose.model("Stakeholder", stakeholderSchema);
export default Stakeholder;
