// import mongoose from "mongoose";

// const applicationSchema = new mongoose.Schema({
//     internshipId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Internship',
//         required: true
//     },
//     companyId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Company',
//         required: true
//     },
//     candidateId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     candidateName: {
//         type: String,
//         required: true
//     },
//     candidateEmail: {
//         type: String,
//         required: true
//     },
//     position: {
//         type: String,
//         required: true
//     },
//     department: {
//         type: String
//     },
//     appliedDate: {
//         type: Date,
//         default: Date.now
//     },
//     status: {
//         type: String,
//         enum: ['Pending', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired', 'Offer Sent'],
//         default: 'Pending'
//     },
//     stage: {
//         type: String,
//         default: 'Application Review'
//     },
//     score: {
//         type: Number,
//         min: 0,
//         max: 100
//     },
//     skills: [String],
//     experience: String,
//     education: String,
//     notes: String,
//     lastContact: Date,
//     resume: String,
//     aiScore: {
//   type: Number,
//   min: 0,
//   max: 100
// },
// missingSkills: [String]
// }, {
//     timestamps: true
// });

// applicationSchema.index({ companyId: 1, status: 1 });
// applicationSchema.index({ appliedDate: -1 });

// const Application = mongoose.model('Application', applicationSchema);
// export default Application;

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  resumeUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected', 'shortlisted'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

applicationSchema.index({ userId: 1, internshipId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedDate: -1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;