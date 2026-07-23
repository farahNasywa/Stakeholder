// services/focalPointService.js
import FocalPointMapping from '../models/focalPointMappingModel.js';
import StakeholderType from '../models/stakeholderTypeModel.js'; // Import StakeholderType model

/**
 * Fetches the FocalPointMapping document for a given stakeholder type.
 * @param {string} stakeholderTypeName - The name of the stakeholder type.
 * @returns {object|null} The FocalPointMapping document if found, otherwise null.
 */
export const getFocalPointsForStakeholderType = async (stakeholderTypeName) => {
  try {
    // Langkah 1: Cari ObjectId dari StakeholderType berdasarkan namanya
    const stakeholderType = await StakeholderType.findOne({ name: stakeholderTypeName });

    if (!stakeholderType) {
      console.warn(`StakeholderType dengan nama "${stakeholderTypeName}" tidak ditemukan.`);
      return null; // Mengembalikan null jika StakeholderType tidak ada
    }

    // Langkah 2: Gunakan ObjectId yang ditemukan untuk mencari FocalPointMapping
    const mapping = await FocalPointMapping.findOne({ stakeholderType: stakeholderType._id });

    if (mapping) {
      return mapping; // Mengembalikan seluruh dokumen mapping
    } else {
      console.warn(`Tidak ada Focal Point Mapping ditemukan untuk StakeholderType ID: ${stakeholderType._id} (Nama: ${stakeholderTypeName}).`);
      return null; // Mengembalikan null jika tidak ada mapping yang ditemukan
    }
  } catch (error) {
    console.error(`Error di getFocalPointsForStakeholderType untuk "${stakeholderTypeName}":`, error);
    // Penting: Jangan mengembalikan string default di sini, karena seeder mengharapkan ObjectId atau null
    throw error; // Lempar kembali error untuk penanganan di level yang lebih tinggi
  }
};
