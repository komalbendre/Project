import express from "express";
import { 
    getCompanyAnalytics,
    getApplicationsByStatus,
    getMonthlyTrends,
    getSkillAnalytics,
    getInternshipPerformance
} from "../controllers/analyticsController.js";
import { auth, companyOnly } from "../middleware/auth.js";

const router = express.Router();

// All analytics routes require company admin authentication
router.use(auth, companyOnly);

// Get comprehensive company analytics
router.get("/company", getCompanyAnalytics);

// Get applications by status (for pie chart)
router.get("/company/status", getApplicationsByStatus);

// Get monthly trends
router.get("/company/trends", getMonthlyTrends);

// Get skill analytics
router.get("/company/skills", getSkillAnalytics);

// Get internship performance
router.get("/company/internship-performance", getInternshipPerformance);

export default router;