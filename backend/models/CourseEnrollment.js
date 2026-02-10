import mongoose from "mongoose";

const courseEnrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  enrolledDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Enrolled", "Completed", "Dropped"],
    default: "Enrolled"
  }
}, { timestamps: true });

export default mongoose.model("CourseEnrollment", courseEnrollmentSchema);
