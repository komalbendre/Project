import express from "express";
import { auth, adminOnly } from "../middleware/auth.js";
import {
  getUsers,
  getCompanies,
  getPendingCompanies,
  approveCompany,
  rejectCompany,
  suspendUser,
  activateUser,
  getStats
} from "../controllers/adminController.js";

const router = express.Router();

//Users management
router.get("/users", auth, adminOnly, getUsers);
router.put("/users/:id/suspend", auth, adminOnly, suspendUser);
router.put("/users/:id/activate", auth, adminOnly, activateUser);

//Companies management
router.get("/companies", auth, adminOnly, getCompanies);
router.get("/companies/pending", auth, adminOnly, getPendingCompanies);
router.put("/companies/:id/approve", auth, adminOnly, approveCompany);
router.put("/companies/:id/reject", auth, adminOnly, rejectCompany);

//Dashboard stats
router.get("/stats", auth, adminOnly, getStats);

export default router;