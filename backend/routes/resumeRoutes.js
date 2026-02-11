import express from "express";
import {
  generateResumePDF,
  generateResumeDOCX,
} from "../controllers/resumeController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/resume/pdf
router.post("/pdf", auth, async (req, res, next) => {
  try {
    console.log("PDF Generation Request Body:", req.body);
    console.log("User ID:", req.user._id);

    await generateResumePDF(req, res);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/resume/docx
 */
router.post("/docx", auth, async (req, res, next) => {
  try {
    console.log("DOCX Generation Request Body:", req.body);
    console.log("User ID:", req.user._id); 

    await generateResumeDOCX(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
