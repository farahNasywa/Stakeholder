import mongoose from "mongoose";

const engagementStrategySchema = new mongoose.Schema(
  {
    strategy: {
      type: String,
      required: true,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
);

const EngagementStrategy = mongoose.model("EngagementStrategy", engagementStrategySchema);
export default EngagementStrategy;
