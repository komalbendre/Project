import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  providerName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: String,
  duration: String,
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "All Levels"]
  },
  price: {
    amount: Number,
    currency: String,
    isFree: Boolean
  },
  link: String,
  skillsCovered: [String],
  syllabus: [String],
  requirements: [String],
  instructor: String,
  rating: Number,
  enrolled: Number,
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected", "archived"],
    default: "pending"
  },
  adminNotes: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  approvedAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  requiredSkills: [String],   // ["Python"]
platform: String  
});

export default mongoose.model("Course", courseSchema);