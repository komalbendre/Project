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

// Get current user's profile
router.get("/me/profile", auth, getMyProfile);

// ✅ Public route - Get any user's profile (with limited info)
router.get("/:userId", getProfile);


// Update profile (user can update own, admin can update any)
router.post("/:userId", auth, updateProfile);

// Get profile statistics for dashboard
router.get("/stats/:userId", auth, getProfileStats);

// ✅ Admin only routes

// Get all profiles with pagination and search
router.get("/", auth, roleCheck(['admin']), getAllProfiles);

// Delete profile (admin or own profile)
router.delete("/:userId", auth, roleCheck(['admin', 'user']), deleteProfile);

// ✅ Additional routes for enhanced features

// Search profiles by skills
router.get("/search/skills", auth, async (req, res) => {
  try {
    const { skills } = req.query;

    if (!skills) {
      return res.status(400).json({
        success: false,
        message: "Skills parameter is required"
      });
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());

    const profiles = await Profile.find({
      skills: { $in: skillsArray }
    })
      .populate('userId', 'name email role')
      .limit(20)
      .select('fullName skills location bio');

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

// Get profile completion status
router.get("/completion/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is requesting their own completion or is admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
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

    // Calculate completion
    const fields = {
      fullName: !!(profile.fullName && profile.fullName.length > 0),
      email: !!(profile.email && profile.email.length > 0),
      phone: !!(profile.phone && profile.phone.length > 0),
      bio: !!(profile.bio && profile.bio.length > 0),
      skills: !!(profile.skills && profile.skills.length > 0),
      linkedin: !!(profile.linkedin && profile.linkedin.length > 0),
      github: !!(profile.github && profile.github.length > 0),
      location: !!(profile.location && profile.location.length > 0)
    };

    const completedFields = Object.values(fields).filter(Boolean).length;
    const totalFields = Object.keys(fields).length;
    const completionPercentage = Math.round((completedFields / totalFields) * 100);

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

// Helper function for completion recommendations
const getCompletionRecommendations = (fields) => {
  const recommendations = [];

  if (!fields.fullName) recommendations.push("Add your full name");
  if (!fields.email) recommendations.push("Add your email address");
  if (!fields.phone) recommendations.push("Add your phone number");
  if (!fields.bio) recommendations.push("Write a short bio about yourself");
  if (!fields.skills) recommendations.push("Add at least 3 skills");
  if (!fields.linkedin) recommendations.push("Add your LinkedIn profile");
  if (!fields.github) recommendations.push("Add your GitHub profile");
  if (!fields.location) recommendations.push("Add your location");

  return recommendations;
};

// Update specific profile field
router.patch("/:userId/field", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { field, value } = req.body;

    // Check if user is updating their own profile or is admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile"
      });
    }

    // Validate field
    const allowedFields = [
      'fullName', 'email', 'phone', 'bio', 'skills',
      'linkedin', 'github', 'portfolio', 'location'
    ];

    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: `Invalid field. Allowed fields: ${allowedFields.join(', ')}`
      });
    }

    // Validate value based on field
    let validatedValue = value;

    if (field === 'skills') {
      if (typeof value === 'string') {
        validatedValue = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
      } else if (Array.isArray(value)) {
        validatedValue = value.map(s => s.trim()).filter(s => s.length > 0);
      } else {
        return res.status(400).json({
          success: false,
          message: "Skills must be an array or comma-separated string"
        });
      }

      if (validatedValue.length > 20) {
        return res.status(400).json({
          success: false,
          message: "Maximum 20 skills allowed"
        });
      }
    }

    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }
    }

    if (field === 'linkedin' && value && !value.includes('linkedin.com')) {
      return res.status(400).json({
        success: false,
        message: "Invalid LinkedIn URL"
      });
    }

    if (field === 'github' && value && !value.includes('github.com')) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL"
      });
    }

    // Update the field
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
        upsert: true // Create profile if it doesn't exist
      }
    ).populate('userId', 'name email role');

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

    if (error.name === 'ValidationError') {
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

// Export router
export default router;