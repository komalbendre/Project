import mongoose from "mongoose";

const careerPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  requiredSkills: [String],
  recommendedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  recommendedInternships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Internship"
  }],
  averageSalary: String
}, { timestamps: true });

export default mongoose.model("CareerPath", careerPathSchema);
