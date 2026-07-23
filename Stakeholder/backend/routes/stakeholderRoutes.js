// stakeholderRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import requireBpma from "../middlewares/requireBpma.js";
import {
  getAllStakeholders,
  getSingleStakeholder,
  searchStakeholders,
  createStakeholder,
  updateStakeholder,
  updateReengagementTriggers,
  deleteStakeholder,       
  submitDeleteRequest,
  getAllStakeholdersWithJustification,
  getStakeholdersWithoutJustification
} from "../controllers/stakeholderController.js";


const router = express.Router();

// Rute harus disusun dari yang paling spesifik ke yang paling umum
// Rute dengan parameter unik harus ditempatkan di atas rute dengan parameter umum
router.get("/with-justification", getAllStakeholdersWithJustification);
router.get("/without-justification", getStakeholdersWithoutJustification);
router.get("/search", searchStakeholders);
router.get("/", getAllStakeholders);
router.post("/", authMiddleware, createStakeholder); // Status ditentukan server-side berdasarkan role (lihat controller)
// Hasil kalkulasi sistem (re-engagement) - boleh disimpan siapa saja yang
// login, TIDAK memerlukan validasi BPMA karena bukan perubahan data profil.
router.put("/:id/reengagement", authMiddleware, updateReengagementTriggers);
// Dikembalikan seperti semula: update langsung terbuka untuk siapa saja yang
// login (tanpa gate khusus-BPMA), supaya Deep Analysis 2 dan Stakeholder
// Profile Setup bisa menyimpan seperti sebelumnya.
router.put("/:id", authMiddleware, updateStakeholder);
router.get('/:id', getSingleStakeholder); 
router.delete("/:id/request-delete", authMiddleware, submitDeleteRequest); // KKKS submit request
router.delete("/:id", authMiddleware, requireBpma, deleteStakeholder); // Hanya BPMA yang boleh hapus langsung

export default router;