// routes/stakeholderChangeRequestRoutes.js

import express from "express";
import {
  createChangeRequest,
  getAllChangeRequests,
  reviewChangeRequest,
  getMyChangeRequests,
  getLatestStatusForStakeholder,
  deleteChangeRequest,
  createDeletionRequest
} from "../controllers/stakeholderChangeRequestController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // <-- Ganti baris ini

const router = express.Router();

// KKKS kirim request change
router.post(
  "/:stakeholderId/request-change",
  authMiddleware, // <-- Gunakan nama importnya
  createChangeRequest
);

// BPMA lihat semua request change yang pending
router.get("/", authMiddleware, getAllChangeRequests);

// KKKS lihat riwayat request yang diajukan
router.get("/my-requests", authMiddleware, getMyChangeRequests);

// BPMA approve / reject request change
router.put("/:id/review", authMiddleware, reviewChangeRequest);

router.get('/latest-status', authMiddleware, getLatestStatusForStakeholder);

router.delete("/:id", authMiddleware, deleteChangeRequest);
router.post("/:stakeholderId/request-deletion", authMiddleware, createDeletionRequest);

export default router;