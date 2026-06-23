import express from "express";
import { getRoles, createRole } from "../controllers/roleController.js";

const router = express.Router();

router.get("/", getRoles);
router.post("/", createRole);

export default router;
