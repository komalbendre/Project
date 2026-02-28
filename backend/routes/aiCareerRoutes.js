import express from 'express';
import { auth } from '../middleware/auth.js';
import { 
  getAICareerSuggestions, 
  getCareerRoadmap, 
  analyzeSkillGap 
} from '../controllers/aiCareerController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get AI-powered career suggestions based on user skills
router.post('/career-suggestions', getAICareerSuggestions);

// Generate detailed roadmap for a specific career
router.post('/career-roadmap', getCareerRoadmap);

// Analyze skill gaps for a target career
router.post('/skill-gap-analysis', analyzeSkillGap);

export default router;