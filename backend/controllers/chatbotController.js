import ChatSession from "../models/ChatSession.js";
import ChatMessage from "../models/ChatMessage.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

// ===============================
// 🔹 GET CHAT HISTORY
// ===============================
export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;

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
        const userId = req.user_id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const session = await ChatSession.findOne({ userId });

        if (!session) {
            return res.status(400).json({ message: "Chat session not found" });
        }

        // Save user message
        await ChatMessage.create({
            sessionId: session._id,
            sender: "user",
            message
        });

        // 🔹 Temporary simple bot reply (we upgrade next)
        const botReply = "I understand 👍 Let me process that for you.";

        // Save bot reply
        await ChatMessage.create({
            sessionId: session._id,
            sender: "bot",
            message: botReply
        });

        res.json({ reply: botReply });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Server error" });
    }
};
