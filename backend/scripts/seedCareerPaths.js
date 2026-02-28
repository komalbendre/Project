import mongoose from "mongoose";
import dotenv from "dotenv";
import CareerPath from "../models/CareerPath.js";
import { CAREER_PATHS } from "../data/careerPaths.seed.js";

dotenv.config({ path: "./backend/.env" });

await mongoose.connect(process.env.MONGO_URI);

await CareerPath.deleteMany();
await CareerPath.insertMany(CAREER_PATHS);

console.log("✅ Career paths seeded successfully");
process.exit();
