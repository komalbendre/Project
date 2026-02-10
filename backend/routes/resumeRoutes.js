import express from "express";
import {
  generateResumePDF,
  generateResumeDOCX,
} from "../controllers/resumeController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/resume/pdf
// router.post("/pdf", auth, generateResumePDF);

// POST /api/resume/docx
// router.post("/docx", auth, generateResumeDOCX);

// backend\routes\resumeRoutes.js
router.post("/pdf", auth, (req, res, next) => {
  console.log("PDF Generation Request Body:", req.body);
  console.log("User ID:", req.user.id);
  generateResumePDF(req, res).catch(next);
});

router.post("/docx", auth, (req, res, next) => {
  console.log("DOCX Generation Request Body:", req.body);
  console.log("User ID:", req.user.id);
  generateResumeDOCX(req, res).catch(next);
});

export default router;