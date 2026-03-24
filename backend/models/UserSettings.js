// backend/models/UserSettings.js
import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Notification Preferences
  notifications: {
    email: {
      newInternshipMatches: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      interviewReminders: { type: Boolean, default: true },
      careerPathRecommendations: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
      marketingEmails: { type: Boolean, default: false }
    },
    push: {
      enabled: { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    }
  },
  
  // Privacy Settings
  privacy: {
    profileVisibility: { 
      type: String, 
      enum: ['public', 'private', 'connections'], 
      default: 'public' 
    },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    showResume: { type: Boolean, default: true },
    allowMessagesFrom: { 
      type: String, 
      enum: ['anyone', 'connections', 'nobody'], 
      default: 'anyone' 
    }
  },
  
  // Appearance Settings
  appearance: {
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'system'], 
      default: 'light' 
    },
    language: { 
      type: String, 
      default: 'en' 
    },
    defaultResumeTemplate: { 
      type: String, 
      enum: ['resumeOne', 'resumeTwo', 'resumeThree'], 
      default: 'resumeOne' 
    },
    compactView: { type: Boolean, default: false }
  },
  
  // Account Settings (stored separately for security)
  account: {
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { 
      type: Number, 
      default: 30, // minutes
      min: 5,
      max: 120
    },
    lastPasswordChange: { type: Date },
    passwordResetRequired: { type: Boolean, default: false }
  },
  
  // Preferences
  preferences: {
    defaultJobSearchRadius: { 
      type: Number, 
      default: 50, // miles/km
      min: 0,
      max: 500
    },
    preferredJobTypes: [{
      type: String,
      enum: ['full-time', 'part-time', 'internship', 'remote', 'hybrid']
    }],
    preferredLocations: [String],
    desiredSalary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' }
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }
  
}, {
  timestamps: true
});

// Index for faster queries
userSettingsSchema.index({ userId: 1 });
userSettingsSchema.index({ 'privacy.profileVisibility': 1 });

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

export default UserSettings;