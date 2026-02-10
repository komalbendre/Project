import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fname: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true
  },
  lname: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'] 
  },
  role: { 
    type: String, 
    enum: ["user", "admin", "company_admin"],
    default: "user" 
  },
  isApproved: { 
    type: Boolean, 
    default: function() {
      // company_admin accounts default to false, others to true
      return this.role !== 'company_admin';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },

  // ===== New Profile Fields =====
  bio: { type: String, default: "" },
  // skills: { type: [String], default: [] },
  technicalSkills: { type: [String], default: [] },
softSkills: { type: [String], default: [] },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },

  experience: [{
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, default: "" }
  }],

  education: [{
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    field: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    description: { type: String, default: "" }
  }],

  certifications: [{
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    issueDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    credentialId: { type: String, default: "" },
    url: { type: String, default: "" }
  }],

  projects: [{
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    technologies: { type: String, default: "" },
    url: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null }
  }]

}, {
  timestamps: true
});

// ===== Hash password before saving =====
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ===== Compare entered password with hashed password =====
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
