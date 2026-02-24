import express from "express";
import { getChatHistory, sendMessage } from "../controllers/chatbotController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Load full chat history (Option B)
router.get("/history", auth, getChatHistory);

// Send new message
router.post("/message", auth, sendMessage);

export default router;
