import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters'],
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [2000, 'Bio cannot exceed 2000 characters']
  },
  technicalSkills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  }],
  softSkills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters']
  }],
  linkedin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v.includes('linkedin.com');
      },
      message: 'Invalid LinkedIn URL'
    }
  },
  github: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || v.includes('github.com');
      },
      message: 'Invalid GitHub URL'
    }
  },
  portfolio: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  
  // Experience - simplified to match frontend
  // experience: [{
  //   title: {
  //     type: String,
  //     trim: true
  //   },
  //   company: {
  //     type: String,
  //     trim: true
  //   },
  //   description: {
  //     type: String
  //   }
  // }],

  // Education - updated to match frontend
  education: [{
    institution: {
      type: String,
      trim: true
    },
    degree: {
      type: String,
      trim: true
    },
    fieldOfStudy: {
      type: String,
      trim: true
    },
    startYear: {
      type: String,
      trim: true
    },
    endYear: {
      type: String,
      trim: true
    },
    currentlyStudying: {
      type: Boolean,
      default: false
    },
    gradeCGPA: {
      type: String,
      trim: true
    },
    subjectsCourses: {
      type: String,
      trim: true
    }
  }],
  
  // Certifications - simplified to match frontend
  certifications: [{
    name: {
      type: String,
      trim: true
    },
    issuer: {
      type: String,
      trim: true
    }
  }],
  
  // Projects - simplified to match frontend
  projects: [{
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String
    }
  }]

}, {
  timestamps: true
});

// Index for faster queries
profileSchema.index({ userId: 1 });
profileSchema.index({ fullName: 'text', bio: 'text' });
profileSchema.index({ updatedAt: -1 });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;