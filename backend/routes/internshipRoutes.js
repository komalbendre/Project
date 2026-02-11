// import express from "express";
// import Internship from "../models/Internship.js";
// import { auth } from "../middleware/auth.js";
// import { adminOnly } from "../middleware/auth.js";

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const internships = await Internship.find({ isActive: true }).sort({ postedAt: -1 });
//     res.json(internships);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// router.post("/", auth, adminOnly, async (req, res) => {
//   try {
//     const internship = new Internship({
//       ...req.body,
//       postedBy: req.user._id
//     });
//     await internship.save();
//     res.status(201).json(internship);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }k
// });

// export default router;

import express from "express";
import Internship from "../models/Internship.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all internships (public route)
router.get("/", async (req, res) => {
  try {
    const { 
      search, 
      location, 
      type, 
      department, 
      experienceLevel,
      page = 1, 
      limit = 20 
    } = req.query;
    
    const query = { 
      isActive: true,
      status: "Open"
    };
    
    // Build search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (type && ['remote', 'onsite', 'hybrid'].includes(type)) {
      query.type = type;
    }
    
    if (department) {
      query.department = department;
    }
    
    if (experienceLevel && ['Beginner', 'Intermediate', 'Advanced'].includes(experienceLevel)) {
      query.experienceLevel = experienceLevel;
    }
    
    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch internships with pagination
    const internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Internship.countDocuments(query);
    
    res.json({
      success: true,
      data: internships,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching internships:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
});

// Get single internship by ID (public route)
router.get("/:id", async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    
    if (!internship) {
      return res.status(404).json({ 
        success: false,
        message: "Internship not found" 
      });
    }

    res.json({
      success: true,
      data: internship
    });
  } catch (error) {
    console.error("Error fetching internship:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
});

// Get internships by company ID (public route)
router.get("/company/:companyId", async (req, res) => {
  try {
    const internships = await Internship.find({
      companyId: req.params.companyId,
      isActive: true,
      status: "Open"
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: internships
    });
  } catch (error) {
    console.error("Error fetching company internships:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
});

// Apply for internship (protected route)
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const { coverLetter, resumeUrl } = req.body;
    const userId = req.user._id;
    const internshipId = req.params.id;

    // Check if internship exists and is open
    const internship = await Internship.findById(internshipId);
    if (!internship || internship.status !== "Open") {
      return res.status(404).json({ 
        success: false,
        message: "Internship not found or not accepting applications" 
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      userId,
      internshipId
    });

    if (existingApplication) {
      return res.status(400).json({ 
        success: false,
        message: "You have already applied for this internship" 
      });
    }

    // Create application
    const application = new Application({
      userId,
      internshipId,
      coverLetter,
      resumeUrl,
      status: "pending"
    });

    await application.save();
    
    // Increment application count on internship
    internship.applicationCount += 1;
    await internship.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application
    });
  } catch (error) {
    console.error("Error applying for internship:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
});

// Get user's applications (protected route)
router.get("/user/applications", auth, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('internshipId')
      .sort({ appliedDate: -1 });
    
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
});

export default router;