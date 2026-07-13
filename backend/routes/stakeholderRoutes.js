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
// Update langsung ke data Stakeholder HANYA untuk BPMA. Role lain (KKKS dsb)
// wajib memakai /:id/request-change agar melalui alur validasi BPMA.
router.put("/:id", authMiddleware, requireBpma, updateStakeholder);
router.get('/:id', getSingleStakeholder); 
router.delete("/:id/request-delete", authMiddleware, submitDeleteRequest); // KKKS submit request
router.delete("/:id", authMiddleware, requireBpma, deleteStakeholder); // Hanya BPMA yang boleh hapus langsung

export default router;