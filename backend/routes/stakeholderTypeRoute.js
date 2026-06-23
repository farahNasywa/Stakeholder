import express from "express";
import {
    getAllStakeholderTypes,
    getStakeholderTypeById,
    createStakeholderType,
    updateStakeholderType,
    deleteStakeholderType
} from "../controllers/stakeholderTypeController.js";

const router = express.Router();

router.get("/", getAllStakeholderTypes);
router.get("/:id", getStakeholderTypeById);
router.post("/", createStakeholderType);
router.put("/:id", updateStakeholderType);
router.delete("/:id", deleteStakeholderType);

export default router;
