import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js"; 
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import resumeRoutes from './routes/resumeRoutes.js';
import internshipRoutes from "./routes/internshipRoutes.js";
import careerPathRoutes from "./routes/careerPathRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());          
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/companies", companyRoutes);
app.use('/api/resume', resumeRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/career-paths", careerPathRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.originalUrl} not found`);
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Backend running at: http://localhost:${PORT}`);
  console.log(`Internships API: GET http://localhost:${PORT}/api/internships`);
});