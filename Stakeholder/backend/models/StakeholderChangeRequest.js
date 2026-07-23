import mongoose from "mongoose";

const stakeholderChangeRequestSchema = new mongoose.Schema({
  stakeholderId: { type: mongoose.Schema.Types.ObjectId, ref: "Stakeholder", required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  changeData: { type: Object}, // Data yang diajukan perubahan (atau data Stakeholder baru untuk requestType "Create")
  // requestType menandai jenis permintaan: penambahan Stakeholder baru,
  // perubahan data, atau penghapusan. isDeletionRequest tetap dipertahankan
  // untuk kompatibilitas dengan kode lama yang sudah memakainya.
  requestType: {
    type: String,
    enum: ["Create", "Edit", "Delete"],
    default: "Edit",
  },
  isDeletionRequest: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewNote: String,
});

stakeholderChangeRequestSchema.pre("validate", function(next) {
  // Jika ini bukan permintaan penghapusan DAN changeData tidak ada atau kosong
  if (!this.isDeletionRequest && (!this.changeData || Object.keys(this.changeData).length === 0)) {
    // Mongoose akan memicu error validasi
    this.invalidate('changeData', 'Path `changeData` is required for non-deletion requests.');
  }
  next();
});

const StakeholderChangeRequest = mongoose.model(
  "StakeholderChangeRequest",
  stakeholderChangeRequestSchema
);

export default StakeholderChangeRequest;
