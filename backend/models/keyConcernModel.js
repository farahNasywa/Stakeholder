import mongoose from "mongoose";

const keyConcernSchema = new mongoose.Schema(
  {
    key_concern: {
      type: String,
      required: true,
      unique: true, // Ensures each key concern is unique
      trim: true,
    },
    mitigation_plan: {
      type: String,
      required: true,
      trim: true,
    },
    objective: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const KeyConcern = mongoose.model("KeyConcern", keyConcernSchema);
export default KeyConcern;