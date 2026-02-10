import express from "express";
import Course from "../models/Course.js";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ postedAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create course (admin only)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      postedBy: req.user._id
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update course (admin only)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete course (admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;