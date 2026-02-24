import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true   // One session per user
  },

  currentState: {
    type: String,
    default: "idle"
  },

  context: {
    fullName: { type: String, default: "" },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    technicalSkills: [{ type: String }],
    softSkills: [{ type: String }],
    bio: { type: String, default: "" },
    lastSuggestedCareer: { type: String, default: "" }
  }

}, { timestamps: true });

export default mongoose.model("ChatSession", chatSessionSchema);
