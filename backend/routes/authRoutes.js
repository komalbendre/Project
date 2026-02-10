import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

// Regular user signup route
router.post("/signup", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  const [fname, ...rest] = name.trim().split(" ");
  const lname = rest.join(" ") || "-";

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({
      fname,
      lname,
      email,
      password,
      role,
      isApproved: role === "company_admin" ? false : true
    });

    await user.save();

    // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
    res.status(201).json({ 
      user: { 
        id: user._id, 
        name: `${user.fname} ${user.lname}`, 
        email: user.email, 
        role: user.role,
        isApproved: user.isApproved 
      }, 
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });
    const name = `${user.fname} ${user.lname}`;

    res.json({ 
      user: { 
        id: user._id, 
        name, 
        email: user.email, 
        role: user.role,
        isApproved: user.isApproved  
      }, 
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;