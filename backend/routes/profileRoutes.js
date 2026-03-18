import express from "express";
import Profile from "../models/Profile.js";

import {
  getProfile,
  getMyProfile,
  updateProfile,
  getAllProfiles,
  deleteProfile,
  getProfileStats
} from "../controllers/profileController.js";
import { auth, roleCheck } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────────────────────
// IMPORTANT: All static/named routes MUST come
// before parameterized routes like /:userId
// ─────────────────────────────────────────────

// GET  /api/profile/me/profile  — get logged-in user's profile
router.get("/me/profile", auth, getMyProfile);

// PUT  /api/profile/me/profile  — update via profileApi.js (was missing, caused silent 404)
router.put("/me/profile", auth, (req, res) => {
  // Inject userId from the authenticated user so updateProfile can use req.params.userId
  req.params.userId = req.user._id.toString();
  return updateProfile(req, res);
});

// GET  /api/profile/  — get all profiles (admin only)
router.get("/", auth, roleCheck(["admin"]), getAllProfiles);

// ─────────────────────────────────────────────
// Parameterized routes below
// ─────────────────────────────────────────────

// GET  /api/profile/:userId  — get any user's profile (public, limited info)
router.get("/:userId", getProfile);

// POST /api/profile/:userId  — create or update profile (used by ProfileForm.js)
router.post("/:userId", auth, updateProfile);

// GET  /api/profile/stats/:userId  — get profile completion stats
router.get("/stats/:userId", auth, getProfileStats);

// DELETE /api/profile/:userId  — delete profile (admin or own)
router.delete("/:userId", auth, roleCheck(["admin", "user"]), deleteProfile);

// ─────────────────────────────────────────────
// Search routes
// ─────────────────────────────────────────────

// GET /api/profile/search/skills?skills=React,Node.js
router.get("/search/skills", auth, async (req, res) => {
  try {
    const { skills } = req.query;

    if (!skills) {
      return res.status(400).json({
        success: false,
        message: "Skills parameter is required"
      });
    }

    const skillsArray = skills.split(",").map((skill) => skill.trim());

    const profiles = await Profile.find({
      $or: [
        { technicalSkills: { $in: skillsArray } },
        { softSkills: { $in: skillsArray } }
      ]
    })
      .populate("userId", "fname lname email role")
      .limit(20)
      .select("fullName technicalSkills softSkills location bio");

    res.status(200).json({
      success: true,
      message: "Profiles found by skills",
      data: profiles,
      count: profiles.length
    });
  } catch (error) {
    console.error("Search profiles error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching profiles"
    });
  }
});

// GET /api/profile/completion/:userId
router.get("/completion/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(200).json({
        success: true,
        message: "Profile completion",
        data: {
          completion: 0,
          completedFields: 0,
          totalFields: 8,
          fields: {
            fullName: false,
            email: false,
            phone: false,
            bio: false,
            skills: false,
            linkedin: false,
            github: false,
            location: false
          }
        }
      });
    }

    const fields = {
      fullName: !!(profile.fullName && profile.fullName.length > 0),
      email: !!(profile.email && profile.email.length > 0),
      phone: !!(profile.phone && profile.phone.length > 0),
      bio: !!(profile.bio && profile.bio.length > 0),
      skills: !!(
        (profile.technicalSkills && profile.technicalSkills.length > 0) ||
        (profile.softSkills && profile.softSkills.length > 0)
      ),
      linkedin: !!(profile.linkedin && profile.linkedin.length > 0),
      github: !!(profile.github && profile.github.length > 0),
      location: !!(profile.location && profile.location.length > 0)
    };

    const completedFields = Object.values(fields).filter(Boolean).length;
    const totalFields = Object.keys(fields).length;
    const completionPercentage = Math.round(
      (completedFields / totalFields) * 100
    );

    res.status(200).json({
      success: true,
      message: "Profile completion retrieved",
      data: {
        completion: completionPercentage,
        completedFields,
        totalFields,
        fields,
        recommendations: getCompletionRecommendations(fields)
      }
    });
  } catch (error) {
    console.error("Get completion error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching completion"
    });
  }
});

// PATCH /api/profile/:userId/field  — update a single field
router.patch("/:userId/field", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { field, value } = req.body;

    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile"
      });
    }

    const allowedFields = [
      "fullName", "email", "phone", "bio", "technicalSkills",
      "softSkills", "linkedin", "github", "portfolio", "location"
    ];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: `Invalid field. Allowed fields: ${allowedFields.join(", ")}`
      });
    }

    let validatedValue = value;

    if (field === "technicalSkills" || field === "softSkills") {
      if (typeof value === "string") {
        validatedValue = value
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      } else if (Array.isArray(value)) {
        validatedValue = value.map((s) => s.trim()).filter((s) => s.length > 0);
      } else {
        return res.status(400).json({
          success: false,
          message: "Skills must be an array or comma-separated string"
        });
      }
    }

    if (field === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }
    }

    if (field === "linkedin" && value && !value.includes("linkedin.com")) {
      return res.status(400).json({
        success: false,
        message: "Invalid LinkedIn URL"
      });
    }

    if (field === "github" && value && !value.includes("github.com")) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL"
      });
    }

    const updateData = {
      [field]: validatedValue,
      updatedAt: Date.now()
    };

    const profile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      {
        new: true,
        runValidators: true,
        upsert: true
      }
    ).populate("userId", "fname lname email role");

    res.status(200).json({
      success: true,
      message: `${field} updated successfully`,
      data: {
        field,
        value: validatedValue,
        profile: {
          id: profile._id,
          userId: profile.userId._id,
          [field]: validatedValue,
          updatedAt: profile.updatedAt
        }
      }
    });
  } catch (error) {
    console.error("Update field error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating field"
    });
  }
});

// Helper function for completion recommendations
const getCompletionRecommendations = (fields) => {
  const recommendations = [];
  if (!fields.fullName) recommendations.push("Add your full name");
  if (!fields.email) recommendations.push("Add your email address");
  if (!fields.phone) recommendations.push("Add your phone number");
  if (!fields.bio) recommendations.push("Write a short bio about yourself");
  if (!fields.skills) recommendations.push("Add at least one skill");
  if (!fields.linkedin) recommendations.push("Add your LinkedIn profile");
  if (!fields.github) recommendations.push("Add your GitHub profile");
  if (!fields.location) recommendations.push("Add your location");
  return recommendations;
};

export default router;