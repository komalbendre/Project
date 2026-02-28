import express from "express";
import {
  applyForInternship,
  getUserApplications,
  getCompanyApplications,
  getApplicationById,
  updateApplicationStatus,
  addCompanyNote,
  scheduleInterview,
  makeOffer,
  withdrawApplication,
  getCompanyApplicationStats,
  getUserApplicationStats  // Add this import
} from "../controllers/applicationController.js";
import { auth, roleCheck, companyOnly } from "../middleware/auth.js";

const router = express.Router();

// ===== PUBLIC ROUTES (None) =====
// All application routes require authentication

// ===== USER ROUTES =====
// Apply for internship
router.post("/:internshipId/apply", auth, roleCheck(['user']), applyForInternship);

// Get user's applications
router.get("/user", auth, roleCheck(['user']), getUserApplications);

// Get user application statistics for dashboard
router.get("/user/stats", auth, roleCheck(['user']), getUserApplicationStats);  // Move this before the parameterized route

// Withdraw application
router.post("/:id/withdraw", auth, roleCheck(['user']), withdrawApplication);

// ===== COMPANY ROUTES =====
// Get company's applications
router.get("/company", auth, companyOnly, getCompanyApplications);

// Get company's application statistics
router.get("/stats/company", auth, companyOnly, getCompanyApplicationStats);

// ===== SHARED ROUTES (with authorization in controller) =====
// Get application by ID - THIS MUST BE LAST because :id is a parameter
router.get("/:id", auth, getApplicationById);

// ===== COMPANY ONLY ROUTES =====
// Update application status
router.patch("/:id/status", auth, companyOnly, updateApplicationStatus);

// Add company note
router.post("/:id/notes", auth, companyOnly, addCompanyNote);

// Schedule interview
router.post("/:id/interview", auth, companyOnly, scheduleInterview);

// Make offer
router.post("/:id/offer", auth, companyOnly, makeOffer);

export default router;