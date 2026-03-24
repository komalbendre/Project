// backend/routes/settingsRoutes.js
import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getSettings,
  updateNotifications,
  updatePrivacy,
  updateAppearance,
  updatePreferences,
  changePassword,
  deleteAccount,
  updateAccountSettings
} from "../controllers/settingsController.js";

const router = express.Router();


// Test endpoint - NO AUTH for testing (move before auth middleware)
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Settings routes are working!'
  });
});

// All settings routes are protected
router.use(auth);

// Get all settings
router.get("/", getSettings);

// Update specific settings sections
router.put("/notifications", updateNotifications);
router.put("/privacy", updatePrivacy);
router.put("/appearance", updateAppearance);
router.put("/preferences", updatePreferences);
router.put("/account", updateAccountSettings);

// Password change
router.put("/change-password", changePassword);

// Account deletion
router.delete("/account", deleteAccount);

export default router;