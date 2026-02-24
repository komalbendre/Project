import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:3000",
//     "X-Title": "Career Assistant"
//   }
});



// ===============================
// 🔹 GET CHAT HISTORY
// ===============================
export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        // Find existing session
        let session = await ChatSession.findOne({ userId });

        // If no session exists → create one
        if (!session) {
            const profile = await Profile.findOne({ userId });
            const user = await User.findById(userId);

            session = await ChatSession.create({
                userId,
                currentState: "idle",
                context: {
                    fullName: profile?.fullName || `${user.fname} ${user.lname}`,
                    degree: profile?.education?.[0]?.degree || "",
                    fieldOfStudy: profile?.education?.[0]?.fieldOfStudy || "",
                    technicalSkills: profile?.technicalSkills || [],
                    softSkills: profile?.softSkills || [],
                    bio: profile?.bio || "",
                }
            });

            // Add welcome message
            await ChatMessage.create({
                sessionId: session._id,
                sender: "bot",
                message: `Hi ${session.context.fullName} 👋  
I'm your AI Career Assistant.  
How can I help you today?`
            });
        }

        // Load full chat history
        const messages = await ChatMessage.find({ sessionId: session._id })
            .sort({ createdAt: 1 });

        res.json({ messages });

    } catch (error) {
        console.error("Error loading chat history:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ===============================
// 🔹 SEND MESSAGE
// ===============================
export const sendMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        let session = await ChatSession.findOne({ userId });

        if (!session) {
            session = await ChatSession.create({
                userId: userId
            });
        }

        // Save user message
        await ChatMessage.create({
            sessionId: session._id,
            sender: "user",
            message
        });

        // Get session context
        const profile = await Profile.findOne({ userId });
        const user = await User.findById(userId);

        // Build context for AI
        const systemPrompt = `
You are an AI Career Assistant.
User name: ${profile?.fullName || user.fname}
Degree: ${profile?.education?.[0]?.degree || ""}
Field: ${profile?.education?.[0]?.fieldOfStudy || ""}
Skills: ${profile?.technicalSkills?.join(", ") || ""}

Give helpful, practical, career-focused advice.
Be friendly and concise.
`;

        const completion = await openai.chat.completions.create({
            model: "meta-llama/llama-3.1-8b-instruct",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        });

        const botReply = completion.choices[0].message.content;

        // Save bot reply
        await ChatMessage.create({
            sessionId: session._id,
            sender: "bot",
            message: botReply
        });

        res.json({ reply: botReply });

    } catch (error) {
   console.error("FULL ERROR:", error);
   console.error("ERROR RESPONSE:", error.response?.data);
   res.status(500).json({
      error: error.response?.data || error.message
   });
}
};
