import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true
  },
  phoneNo: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  websiteUrl: {
    type: String,
    trim: true,
    lowercase: true
  },
  industry: {
    type: String,
    trim: true,
    required: [true, 'Industry is required']
  },
  linkedinUrl: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
companySchema.index({ userId: 1 });
companySchema.index({ status: 1 });
companySchema.index({ companyName: 'text', description: 'text', industry: 'text' });
companySchema.index({ contactEmail: 1 });
companySchema.index({ createdAt: -1 });

const Company = mongoose.model('Company', companySchema);

export default Company;