import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import CareerPath from "../models/CareerPath.js";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash"
// });
const model = genAI.getGenerativeModel({
  model: "gemini-pro"
});

router.post("/career-advice", async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ error: "Skills array required" });
    }

    const careers = await CareerPath.find({}, "title requiredSkills description");

    const prompt = `
You are a career recommendation engine.

User skills:
${skills.join(", ")}

Available career paths (JSON):
${JSON.stringify(careers)}

TASK:
1. Compare user skills with requiredSkills
2. Pick best 3 matching careers
3. Give match percentage
4. List missing skills

Return ONLY valid JSON:

{
  "recommendations": [
    {
      "title": "",
      "match": 0,
      "missingSkills": []
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    res.json({ success: true, ...data });

  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI career recommendation failed" });
  }
});

export default router;
