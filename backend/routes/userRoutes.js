import express from "express";
import User from "../models/User.js";
import { auth, adminOnly } from "../middleware/auth.js";
import { getCurrentUser, getUserById } from "../controllers/userController.js";

const router = express.Router();

// ✅ GET current user - MUST COME BEFORE /:id
router.get("/me", auth, getCurrentUser);

// ✅ Admin only routes
router.get("/", auth, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ✅ Get specific user by ID
router.get("/:id", auth, getUserById);

// Admin can add user manually (optional)
router.post("/", auth, adminOnly, async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Admin can update user
router.put("/:id", auth, adminOnly, async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedUser);
});

// Admin can delete user
router.delete("/:id", auth, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

export default router;