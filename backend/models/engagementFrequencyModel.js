import mongoose from "mongoose";

const engagementFrequencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

engagementFrequencySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const EngagementFrequency = mongoose.model("EngagementFrequency", engagementFrequencySchema);
export default EngagementFrequency;