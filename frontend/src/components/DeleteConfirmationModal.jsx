// src/components/DeleteConfirmationModal.jsx
import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, stakeholderName }) => {
  // Jika modal tidak terbuka, jangan tampilkan apa pun
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay (Latar Belakang Gelap)
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      {/* Kotak Modal */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-md">
        <h3 className="text-xl font-bold mb-4 text-red-600">
          Konfirmasi Penghapusan
        </h3>
        <p className="mb-6 text-gray-700">
          Apakah Anda yakin ingin menghapus stakeholder <strong>{stakeholderName}</strong>? Tindakan ini
          tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-medium"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;