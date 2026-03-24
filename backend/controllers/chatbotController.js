import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// Initialize AI clients based on available API keys
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Choose which AI to use (prefer GROQ, then Gemini, then fallback)
const getAIResponse = async (systemPrompt, userMessage, conversationHistory) => {
    // Try GROQ first (fast and good)
    if (groq) {
        try {
            const messages = [
                { role: "system", content: systemPrompt },
                ...conversationHistory,
                { role: "user", content: userMessage }
            ];

            const completion = await groq.chat.completions.create({
                messages: messages,
                model: "mixtral-8x7b-32768", // or "llama2-70b-4096"
                temperature: 0.7,
                max_tokens: 500,
            });

            return completion.choices[0]?.message?.content || null;
        } catch (error) {
            console.error("GROQ API Error:", error.message);
        }
    }

    // Try Gemini as fallback
    if (genAI) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            
            const fullPrompt = `${systemPrompt}\n\nConversation history:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nUser: ${userMessage}\n\nAssistant:`;
            
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Gemini API Error:", error.message);
        }
    }

    // Fallback to local responses if no API is available
    return null;
};

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
        res.status(500).json({ message: "Server error", error: error.message });
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

        // Find or create session
        let session = await ChatSession.findOne({ userId });

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

        // Build system prompt
        const systemPrompt = `You are an AI Career Assistant for an internship platform.
User: ${profile?.fullName || user?.fname || "User"}
Degree: ${profile?.education?.[0]?.degree || "Not specified"}
Field of Study: ${profile?.education?.[0]?.fieldOfStudy || "Not specified"}
Technical Skills: ${profile?.technicalSkills?.join(", ") || "Not specified"}
Soft Skills: ${profile?.softSkills?.join(", ") || "Not specified"}

Your role is to help with:
- Career guidance and advice
- Resume writing tips
- Interview preparation
- Internship search strategies
- Skill development recommendations
- Industry insights

Keep responses concise, professional, and encouraging. Focus on practical advice.
If asked about specific internships, suggest checking the platform's internship listings.
Always maintain a supportive and positive tone.`;

        // Get last 10 messages for context
        const recentMessages = await ChatMessage.find({ sessionId: session._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        const conversationHistory = recentMessages.reverse().map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.message
        }));

        let botReply;

        try {
            // Try to get AI response
            const aiResponse = await getAIResponse(systemPrompt, message, conversationHistory);
            
            if (aiResponse) {
                botReply = aiResponse;
            } else {
                // Use fallback responses if AI fails
                botReply = getFallbackResponse(message);
            }
        } catch (error) {
            console.error("AI Error:", error);
            botReply = getFallbackResponse(message);
        }

        // Save bot reply
        await ChatMessage.create({
            sessionId: session._id,
            sender: "bot",
            message: botReply
        });

        res.json({ reply: botReply });

    } catch (error) {
        console.error("FULL ERROR:", error);
        console.error("ERROR STACK:", error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to process message",
            error: error.message
        });
    }
};

// Fallback responses when AI is not available
function getFallbackResponse(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('resume') || lowerMsg.includes('cv')) {
        return "For a great resume, focus on: 1) Clear formatting, 2) Relevant skills and achievements, 3) Quantifiable results, 4) Tailoring to the job description. Would you like specific tips for your field?";
    }
    
    if (lowerMsg.includes('interview')) {
        return "Interview success tips: Research the company, practice common questions, prepare your own questions, dress appropriately, and follow up with a thank-you email. Practice with mock interviews to build confidence!";
    }
    
    if (lowerMsg.includes('skill') || lowerMsg.includes('learn')) {
        return "Focus on both technical and soft skills. For tech roles, consider platforms like Coursera, Udemy, or freeCodeCamp. Soft skills like communication, teamwork, and problem-solving are equally important!";
    }
    
    if (lowerMsg.includes('internship')) {
        return "To find internships: 1) Check our platform listings, 2) Network on LinkedIn, 3) Attend career fairs, 4) Reach out to companies directly, 5) Use job boards. Start early and tailor your applications!";
    }
    
    if (lowerMsg.includes('career') || lowerMsg.includes('path')) {
        return "Choosing a career path: 1) Assess your interests and strengths, 2) Research industries, 3) Talk to professionals, 4) Try internships, 5) Consider skill development. It's okay to explore different options!";
    }
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return "Hello! I'm your Career Assistant. I can help you with resume tips, interview preparation, career guidance, and finding internships. What would you like to know?";
    }
    
    return "I'm here to help with your career journey! Feel free to ask about resumes, interviews, internships, skills, or career paths. What specific area would you like guidance on?";
}