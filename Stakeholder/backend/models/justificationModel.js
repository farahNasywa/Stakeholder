// models/justificationModel.js
import mongoose from "mongoose";

const justificationSchema = new mongoose.Schema({
  stakeholder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stakeholder",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  source: {
    type: String, // misalnya "Google Sheet D91:G91"
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Justification = mongoose.model("Justification", justificationSchema);
export default Justification;
