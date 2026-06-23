// routes/keyConcernRoutes.js
import express from "express";
import {
  getAllKeyConcerns,
  getKeyConcernById,
  createKeyConcern,
  updateKeyConcern,
  deleteKeyConcern,
} from "../controllers/keyConcernController.js";

const router = express.Router();

router.get("/", getAllKeyConcerns);
router.get("/:id", getKeyConcernById);
router.post("/", createKeyConcern);
router.put("/:id", updateKeyConcern);
router.delete("/:id", deleteKeyConcern);

export default router;
