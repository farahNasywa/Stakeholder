import express from "express";
import {
  getAllLocations,
  createLocation,
  deleteLocation
} from "../controllers/locationController.js";

const router = express.Router();

router.get("/", getAllLocations);
router.post("/", createLocation);
router.delete("/:id", deleteLocation);

export default router;
