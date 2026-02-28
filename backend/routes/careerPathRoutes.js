import express from "express";
import {
  getAllCareerPaths,
  getCareerPathById,
} from "../controllers/careerPathController.js";

const router = express.Router();

router.get("/", getAllCareerPaths);
router.get("/:id", getCareerPathById);

export default router;
