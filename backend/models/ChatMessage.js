import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatSession",
    required: true
  },

  sender: {
    type: String,
    enum: ["user", "bot"],
    required: true
  },

  message: {
    type: String,
    required: true
  }

}, { timestamps: true });

export default mongoose.model("ChatMessage", chatMessageSchema);
