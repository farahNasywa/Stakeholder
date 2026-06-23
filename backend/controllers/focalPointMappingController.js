// controllers/focalPointMappingController.js
import FocalPointMapping from '../models/focalPointMappingModel.js';
import StakeholderType from '../models/stakeholderTypeModel.js';

// Get all focal point mappings
export const getAllFocalPointMappings = async (req, res) => {
  try {
    const focalPointMappings = await FocalPointMapping.find().populate('stakeholderType');
    res.status(200).json(focalPointMappings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching focal point mappings', error: error.message });
  }
};

// Get focal point mapping by stakeholder type name
export const getFocalPointMappingByStakeholderTypeId = async (req, res) => {
  try {
    const { stakeholderType } = req.params;

    // Find stakeholderType document by name
    const stakeholderTypeDoc = await StakeholderType.findOne({ name: stakeholderType });
    if (!stakeholderTypeDoc) {
      return res.status(404).json({ message: 'Stakeholder type not found' });
    }

    const focalPointMapping = await FocalPointMapping.findOne({ stakeholderType: stakeholderTypeDoc._id })
      .populate('stakeholderType');

    if (!focalPointMapping) {
      return res.status(404).json({ message: 'Focal point mapping not found for this stakeholder type' });
    }

    res.status(200).json(focalPointMapping);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching focal point mapping', error: error.message });
  }
};

// Create new focal point mapping
export const createFocalPointMapping = async (req, res) => {
  try {
    const { stakeholderType, recommendedFocalpoint, backupSupportFocalpoint } = req.body;

    // Convert stakeholderType name to ObjectId
    const stakeholderTypeDoc = await StakeholderType.findOne({ name: stakeholderType });
    if (!stakeholderTypeDoc) {
      return res.status(400).json({ message: 'Invalid stakeholder type' });
    }

    const newFocalPointMapping = new FocalPointMapping({
      stakeholderType: stakeholderTypeDoc._id,
      recommendedFocalpoint,
      backupSupportFocalpoint
    });

    const savedFocalPointMapping = await newFocalPointMapping.save();
    res.status(201).json(savedFocalPointMapping);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Focal point mapping for this stakeholder type already exists' });
    } else {
      res.status(500).json({ message: 'Error creating focal point mapping', error: error.message });
    }
  }
};

// Update focal point mapping
export const updateFocalPointMapping = async (req, res) => {
  try {
    const { id } = req.params;
    const { stakeholderType, recommendedFocalpoint, backupSupportFocalpoint } = req.body;

    // Convert stakeholderType name to ObjectId
    const stakeholderTypeDoc = await StakeholderType.findOne({ name: stakeholderType });
    if (!stakeholderTypeDoc) {
      return res.status(400).json({ message: 'Invalid stakeholder type' });
    }

    const updatedFocalPointMapping = await FocalPointMapping.findByIdAndUpdate(
      id,
      {
        stakeholderType: stakeholderTypeDoc._id,
        recommendedFocalpoint,
        backupSupportFocalpoint
      },
      { new: true, runValidators: true }
    );

    if (!updatedFocalPointMapping) {
      return res.status(404).json({ message: 'Focal point mapping not found' });
    }

    res.status(200).json(updatedFocalPointMapping);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Focal point mapping for this stakeholder type already exists' });
    } else {
      res.status(500).json({ message: 'Error updating focal point mapping', error: error.message });
    }
  }
};

// Delete focal point mapping
export const deleteFocalPointMapping = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFocalPointMapping = await FocalPointMapping.findByIdAndDelete(id);

    if (!deletedFocalPointMapping) {
      return res.status(404).json({ message: 'Focal point mapping not found' });
    }

    res.status(200).json({ message: 'Focal point mapping deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting focal point mapping', error: error.message });
  }
};

// Anda dapat menamakan file ini `focalPointMappingController.js` atau `focalPointController.js`
// Perlu diingat, nama yang konsisten akan membantu menghindari kebingungan.

// import FocalPointMapping from '../models/focalPointMappingModel.js';
// import mongoose from 'mongoose';

// // Perbaikan: Ubah nama controller agar lebih jelas
// export const getFocalPointMappingByStakeholderTypeId = async (req, res) => {
//   try {
//     const { stakeholderTypeId } = req.params;

//     // Pastikan ID yang diberikan adalah ObjectId yang valid
//     if (!mongoose.Types.ObjectId.isValid(stakeholderTypeId)) {
//       return res.status(400).json({ message: "Invalid Stakeholder Type ID" });
//     }

//     const focalPointMapping = await FocalPointMapping.findOne({ stakeholderType: stakeholderTypeId });
    
//     if (!focalPointMapping) {
//       return res.status(404).json({ message: 'Focal point mapping not found for this stakeholder type' });
//     }

//     // Kirim seluruh objek focalPointMapping, termasuk _id
//     res.status(200).json(focalPointMapping);
//   } catch (error) {
//     console.error('Error fetching focal point mapping:', error);
//     res.status(500).json({ message: 'Error fetching focal point mapping', error: error.message });
//   }
// };
