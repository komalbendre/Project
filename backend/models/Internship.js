import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true
    },

    // Add companyName field for easier access
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },

    title: {
      type: String,
      required: [true, "Internship title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"]
    },

    // Currently only CS, but scalable
    department: {
      type: String,
      enum: ["Computer Science", "Engineering", "Design", "Business", "Marketing", "Data Science"],
      default: "Computer Science",
      required: true
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },

    type: {
      type: String,
      enum: ["remote", "onsite", "hybrid"],
      default: "remote",
      required: true
    },

    duration: {
      type: String, // e.g. "3 Months"
      required: [true, "Duration is required"],
      trim: true
    },

    startDate: {
      type: Date
    },

    // Full DateTime – backend compares time, frontend shows date
    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
      index: true
    },

    positions: {
      type: Number,
      min: 1,
      default: 1,
      required: true
    },

    // Normalized stipend (better than string)
    stipend: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: "USD"
      },
      period: {
        type: String,
        enum: ["month", "week", "lump-sum"],
        default: "month"
      },
      isPaid: {
        type: Boolean,
        default: false
      }
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },

    responsibilities: {
      type: String,
      required: [true, "Responsibilities are required"],
      trim: true
    },

    requirements: {
      type: String,
      required: [true, "Requirements are required"],
      trim: true
    },

    skills: [
      {
        type: String,
        trim: true
      }
    ],

    benefits: {
      type: String,
      trim: true
    },

    applicationProcess: {
      type: String,
      trim: true
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true
    },

    contactPhone: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["Open", "Closed", "Draft"],
      default: "Open",
      index: true
    },

    // Allows companies to pause internships
    isActive: {
      type: Boolean,
      default: true
    },

    applicationCount: {
      type: Number,
      default: 0
    },

    postedDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // handles createdAt & updatedAt automatically
  }
);

// Indexes for performance
internshipSchema.index({ title: "text", description: "text", skills: "text" });
internshipSchema.index({ companyId: 1, status: 1 });
internshipSchema.index({ createdAt: -1 });

const Internship = mongoose.model("Internship", internshipSchema);

export default Internship;