import mongoose from 'mongoose';

const focalPointMappingSchema = new mongoose.Schema({
  stakeholderType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StakeholderType',
    required: true,
    unique: true
  },
  recommendedFocalpoint: {
    type: String,
    required: true
  },
  backupSupportFocalpoint: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('FocalPointMapping', focalPointMappingSchema);
