import express from "express";
import {
  companySignup,
  getAllCompanies,
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  getCompanyById,
  getMyCompany,
  updateCompany
} from "../controllers/companyController.js";
import {
    getCompanyInternships,
    createInternship,
    getInternshipById,
    updateInternship,
    deleteInternship,
    updateInternshipStatus,
    getInternshipApplications
} from "../controllers/internshipController.js";
import { auth, adminOnly, companyOnly } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC ROUTES
// Company signup (public)
router.post("/", companySignup);

// PROTECTED COMPANY ROUTES
// Get company profile (company admin only)
router.get("/my-company", auth, companyOnly, getMyCompany);

// Company internships management
router.get("/internships", auth, companyOnly, getCompanyInternships);
router.post("/internships", auth, companyOnly, createInternship);

// ADMIN ONLY ROUTES
// Get all companies with pagination
router.get("/", auth, adminOnly, getAllCompanies);

// Get pending companies
router.get("/pending", auth, adminOnly, getPendingCompanies);

// PARAMETERIZED ROUTES
// Get company by ID
router.get("/:id", auth, getCompanyById);

// Update company profile
router.put("/:id", auth, updateCompany);

// Approve company (admin only)
router.put("/:id/approve", auth, adminOnly, approveCompany);

// Reject company (admin only)
router.put("/:id/reject", auth, adminOnly, rejectCompany);

// INTERNSHIP SUB-ROUTES
// Get single internship
router.get("/internships/:id", auth, companyOnly, getInternshipById);

// Update internship
router.put("/internships/:id", auth, companyOnly, updateInternship);

// Delete internship
router.delete("/internships/:id", auth, companyOnly, deleteInternship);

// Update internship status
router.patch("/internships/:id/status", auth, companyOnly, updateInternshipStatus);

// Get internship applications
router.get("/internships/:id/applications", auth, companyOnly, getInternshipApplications);

export default router;