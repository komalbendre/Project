import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  // User who applied
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Internship they applied to
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
    index: true
  },

  // Company (for easier querying)
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },

  // Personal Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },

  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },

  currentRole: {
    type: String,
    trim: true,
    maxlength: [100, 'Current role cannot exceed 100 characters']
  },

  experience: {
    type: String,
    trim: true,
    enum: ['0', '1', '2', '3', '4', '5'],
    default: ''
  },

  education: {
    type: String,
    trim: true,
    enum: ['highschool', 'associate', 'bachelors', 'masters', 'phd', 'bootcamp', 'self-taught', ''],
    default: ''
  },

  // Skills
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  }],

  // Documents
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    trim: true,
    minlength: [50, 'Cover letter must be at least 50 characters'],
    maxlength: [5000, 'Cover letter cannot exceed 5000 characters']
  },

  resumeUrl: {
    type: String,
    required: [true, 'Resume URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return v.match(/^https?:\/\/.+/);
      },
      message: 'Please enter a valid URL (include http:// or https://)'
    }
  },

  portfolioUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v.match(/^https?:\/\/.+/);
      },
      message: 'Please enter a valid URL (include http:// or https://)'
    }
  },

  linkedinUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v.includes('linkedin.com');
      },
      message: 'Please enter a valid LinkedIn URL'
    }
  },

  githubUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v.includes('github.com');
      },
      message: 'Please enter a valid GitHub URL'
    }
  },

  startDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'Start date cannot be in the past'
    }
  },

  additionalInfo: {
    type: String,
    trim: true,
    maxlength: [2000, 'Additional information cannot exceed 2000 characters']
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted', 'withdrawn'],
    default: 'pending',
    index: true
  },

  // Application Timeline
  appliedDate: {
    type: Date,
    default: Date.now,
    index: true
  },

  reviewedDate: {
    type: Date
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Company Notes (for recruiters)
  companyNotes: [{
    note: {
      type: String,
      trim: true
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Interview Details
  interview: {
    scheduled: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date
    },
    type: {
      type: String,
      enum: ['phone', 'video', 'onsite', 'technical', 'hr', '']
    },
    duration: {
      type: Number, // in minutes
      min: 15,
      max: 180
    },
    meetingLink: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    interviewer: {
      type: String,
      trim: true
    },
    feedback: {
      type: String,
      trim: true
    }
  },

  // Offer Details
  offer: {
    made: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date
    },
    stipend: {
      amount: {
        type: Number,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD'
      },
      period: {
        type: String,
        enum: ['month', 'week', 'lump-sum']
      }
    },
    accepted: {
      type: Boolean,
      default: false
    },
    acceptedDate: {
      type: Date
    }
  },

  // Rejection Details
  rejection: {
    reason: {
      type: String,
      trim: true
    },
    stage: {
      type: String,
      enum: ['application', 'screening', 'interview', 'offer', '']
    },
    date: {
      type: Date
    },
    feedback: {
      type: String,
      trim: true
    }
  },

  // Withdrawal Details
  withdrawal: {
    withdrawn: {
      type: Boolean,
      default: false
    },
    reason: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    }
  },

  // Metadata
  viewedByCompany: {
    type: Boolean,
    default: false
  },

  viewedDate: {
    type: Date
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }

}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Compound indexes for efficient queries
applicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ companyId: 1, status: 1 });
applicationSchema.index({ internshipId: 1, status: 1 });
applicationSchema.index({ companyId: 1, appliedDate: -1 });
applicationSchema.index({ status: 1, appliedDate: -1 });

// Virtual for applicant profile
applicationSchema.virtual('applicant', {
  ref: 'Profile',
  localField: 'userId',
  foreignField: 'userId',
  justOne: true
});

// Virtual for internship details
applicationSchema.virtual('internship', {
  ref: 'Internship',
  localField: 'internshipId',
  foreignField: '_id',
  justOne: true
});

// Virtual for company details
applicationSchema.virtual('company', {
  ref: 'Company',
  localField: 'companyId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included in JSON output
applicationSchema.set('toJSON', { virtuals: true });
applicationSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update lastUpdated
applicationSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Pre-save middleware to set companyId from internship
applicationSchema.pre('save', async function(next) {
  if (!this.companyId && this.internshipId) {
    try {
      const Internship = mongoose.model('Internship');
      const internship = await Internship.findById(this.internshipId);
      if (internship) {
        this.companyId = internship.companyId;
      }
    } catch (error) {
      console.error('Error setting companyId:', error);
    }
  }
  next();
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;