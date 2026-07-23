import express from "express";
import {
  createEngagementStrategy,
  getAllEngagementStrategies,
  getEngagementStrategyById,
  updateEngagementStrategy,
  deleteEngagementStrategy
} from "../controllers/engagementStrategyController.js";

const router = express.Router();

router.post("/", createEngagementStrategy);
router.get("/", getAllEngagementStrategies);
router.get("/:id", getEngagementStrategyById);
router.put("/:id", updateEngagementStrategy);
router.delete("/:id", deleteEngagementStrategy);

export default router;
