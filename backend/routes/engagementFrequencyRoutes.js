import express from "express";
import {
  createEngagementFrequency,
  getAllEngagementFrequencies,
  getEngagementFrequencyById,
  updateEngagementFrequency,
  deleteEngagementFrequency
} from "../controllers/engagementFrequencyController.js";

const router = express.Router();

router.post("/", createEngagementFrequency);
router.get("/", getAllEngagementFrequencies);
router.get("/:id", getEngagementFrequencyById);
router.put("/:id", updateEngagementFrequency);
router.delete("/:id", deleteEngagementFrequency);

export default router;
