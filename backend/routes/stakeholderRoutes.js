// stakeholderRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
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
router.post("/", createStakeholder);
router.put("/:id", updateStakeholder);
router.get('/:id', getSingleStakeholder); 
router.delete("/:id/request-delete", authMiddleware, submitDeleteRequest); // KKKS submit request
router.delete("/:id", authMiddleware, deleteStakeholder); // BPMA/Admin langsung hapus

export default router;