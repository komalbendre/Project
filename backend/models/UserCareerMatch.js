import mongoose from "mongoose";

const userCareerMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  careerPathId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CareerPath",
    required: true
  },
  matchPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  matchedSkills: [String],
  missingSkills: [String]
}, { timestamps: true });

export default mongoose.model("UserCareerMatch", userCareerMatchSchema);
