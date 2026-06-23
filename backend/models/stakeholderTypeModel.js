import mongoose from "mongoose";

const stakeholderTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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

// Auto-update `updatedAt` saat data diubah
stakeholderTypeSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const StakeholderType = mongoose.model("StakeholderType", stakeholderTypeSchema);

export default StakeholderType;
