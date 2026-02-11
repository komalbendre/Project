import Application from "../models/Application.js";
import Internship from "../models/Internship.js";
import Profile from "../models/Profile.js";
import Company from "../models/Company.js";

/**
 * @desc    Apply for an internship
 * @route   POST /api/applications/:internshipId/apply
 * @access  Private (Users only)
 */
export const applyForInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const userId = req.user._id;

    // Check if internship exists and is open
    const internship = await Internship.findById(internshipId);
    
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found"
      });
    }

    if (internship.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "This internship is no longer accepting applications"
      });
    }

    if (internship.applicationDeadline && new Date(internship.applicationDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed"
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      userId,
      internshipId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this internship"
      });
    }

    const {
      fullName,
      email,
      phone,
      currentRole,
      experience,
      education,
      skills,
      coverLetter,
      resumeUrl,
      portfolioUrl,
      linkedinUrl,
      githubUrl,
      startDate,
      additionalInfo
    } = req.body;

    // Create new application
    const application = new Application({
      userId,
      internshipId,
      companyId: internship.companyId,
      fullName,
      email,
      phone,
      currentRole,
      experience,
      education,
      skills: skills || [],
      coverLetter,
      resumeUrl,
      portfolioUrl,
      linkedinUrl,
      githubUrl,
      startDate: startDate || undefined,
      additionalInfo,
      appliedDate: Date.now(),
      status: "pending"
    });

    await application.save();

    // Increment application count on internship
    internship.applicationCount += 1;
    await internship.save();

    // Populate application with details
    await application.populate([
      { path: 'internship', select: 'title companyName location type' },
      { path: 'company', select: 'companyName contactEmail' }
    ]);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application
    });

  } catch (error) {
    console.error("Error submitting application:", error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while submitting application",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get user's applications
 * @route   GET /api/applications/user
 * @access  Private (Users only)
 */
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId };
    
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(query)
      .populate({
        path: 'internship',
        select: 'title companyName location stipend duration experienceLevel status applicationDeadline'
      })
      .populate({
        path: 'company',
        select: 'companyName logo industry'
      })
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: applications
    });

  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching applications"
    });
  }
};

/**
 * @desc    Get company's applications
 * @route   GET /api/applications/company
 * @access  Private (Company Admins only)
 */
export const getCompanyApplications = async (req, res) => {
  try {
    // Get company for the logged-in user
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company profile not found"
      });
    }

    const {
      status,
      internshipId,
      search,
      sort = '-appliedDate',
      page = 1,
      limit = 20
    } = req.query;

    const query = { companyId: company._id };

    // Filter by status
    if (status) {
      if (Array.isArray(status)) {
        query.status = { $in: status };
      } else {
        query.status = status;
      }
    }

    // Filter by specific internship
    if (internshipId) {
      query.internshipId = internshipId;
    }

    // Search by applicant name or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Parse sort parameter
    let sortOption = { appliedDate: -1 };
    if (sort) {
      const [field, order] = sort.startsWith('-') 
        ? [sort.substring(1), -1] 
        : [sort, 1];
      sortOption = { [field]: order };
    }

    const applications = await Application.find(query)
      .populate({
        path: 'userId',
        select: 'fname lname email role'
      })
      .populate({
        path: 'internship',
        select: 'title location type stipend duration experienceLevel'
      })
      .populate({
        path: 'applicant',
        select: 'fullName technicalSkills softSkills bio education experience'
      })
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    // Get statistics
    const stats = await Application.aggregate([
      { $match: { companyId: company._id } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    const statusCounts = {
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
      accepted: 0,
      withdrawn: 0
    };

    stats.forEach(stat => {
      if (stat._id in statusCounts) {
        statusCounts[stat._id] = stat.count;
      }
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      stats: statusCounts,
      data: applications
    });

  } catch (error) {
    console.error("Error fetching company applications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching applications"
    });
  }
};

/**
 * @desc    Get application by ID
 * @route   GET /api/applications/:id
 * @access  Private (Owner or Company Admin)
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate({
        path: 'userId',
        select: 'fname lname email role isApproved'
      })
      .populate({
        path: 'internship',
        select: 'title companyName location description requirements skills department type'
      })
      .populate({
        path: 'company',
        select: 'companyName contactEmail phoneNo industry'
      })
      .populate({
        path: 'applicant',
        select: 'fullName bio technicalSkills softSkills linkedin github portfolio experience education certifications projects'
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if user is authorized to view
    const isOwner = req.user._id.toString() === application.userId._id.toString();
    const isCompanyAdmin = req.user.role === 'company_admin' && 
      req.user.companyId?.toString() === application.companyId?.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isCompanyAdmin && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Mark as viewed by company if not already viewed
    if (isCompanyAdmin && !application.viewedByCompany) {
      application.viewedByCompany = true;
      application.viewedDate = Date.now();
      await application.save();
    }

    res.status(200).json({
      success: true,
      data: application,
      isOwner,
      isCompanyAdmin,
      isAdmin
    });

  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching application"
    });
  }
};

/**
 * @desc    Update application status (Company only)
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Company Admins only)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // Get company for the logged-in user
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company profile not found"
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if application belongs to this company
    if (application.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Valid status transitions
    const validTransitions = {
      'pending': ['reviewed', 'rejected'],
      'reviewed': ['shortlisted', 'rejected'],
      'shortlisted': ['accepted', 'rejected'],
      'accepted': ['withdrawn'],
      'rejected': [],
      'withdrawn': []
    };

    if (!validTransitions[application.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${application.status} to ${status}`
      });
    }

    application.status = status;

    // Add company note if provided
    if (notes) {
      application.companyNotes.push({
        note: notes,
        addedBy: req.user._id,
        addedAt: Date.now()
      });
    }

    // Set reviewed date if moving from pending to reviewed
    if (status === 'reviewed' && application.status === 'pending') {
      application.reviewedDate = Date.now();
      application.reviewedBy = req.user._id;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    });

  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating application status"
    });
  }
};

/**
 * @desc    Add company note to application
 * @route   POST /api/applications/:id/notes
 * @access  Private (Company Admins only)
 */
export const addCompanyNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || note.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Note cannot be empty"
      });
    }

    // Get company for the logged-in user
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company profile not found"
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if application belongs to this company
    if (application.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    application.companyNotes.push({
      note: note.trim(),
      addedBy: req.user._id,
      addedAt: Date.now()
    });

    await application.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: application.companyNotes[application.companyNotes.length - 1]
    });

  } catch (error) {
    console.error("Error adding company note:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding note"
    });
  }
};

/**
 * @desc    Schedule interview for application
 * @route   POST /api/applications/:id/interview
 * @access  Private (Company Admins only)
 */
export const scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      date,
      type,
      duration,
      meetingLink,
      location,
      interviewer
    } = req.body;

    // Get company for the logged-in user
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company profile not found"
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if application belongs to this company
    if (application.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Validate date
    if (new Date(date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Interview date cannot be in the past"
      });
    }

    application.interview = {
      scheduled: true,
      date,
      type,
      duration: parseInt(duration) || 60,
      meetingLink,
      location,
      interviewer,
      scheduledBy: req.user._id,
      scheduledAt: Date.now()
    };

    // Update status to shortlisted if it was reviewed
    if (application.status === 'reviewed') {
      application.status = 'shortlisted';
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully",
      data: application.interview
    });

  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({
      success: false,
      message: "Server error while scheduling interview"
    });
  }
};

/**
 * @desc    Make offer to applicant
 * @route   POST /api/applications/:id/offer
 * @access  Private (Company Admins only)
 */
export const makeOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      amount,
      currency = 'USD',
      period = 'month'
    } = req.body;

    // Get company for the logged-in user
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company profile not found"
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if application belongs to this company
    if (application.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid stipend amount"
      });
    }

    application.offer = {
      made: true,
      date: Date.now(),
      stipend: {
        amount,
        currency,
        period
      },
      madeBy: req.user._id
    };

    application.status = 'accepted';
    await application.save();

    res.status(200).json({
      success: true,
      message: "Offer sent successfully",
      data: application.offer
    });

  } catch (error) {
    console.error("Error making offer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while making offer"
    });
  }
};

/**
 * @desc    Withdraw application (User only)
 * @route   POST /api/applications/:id/withdraw
 * @access  Private (Users only)
 */
export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    // Check if user owns this application
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // Cannot withdraw if already accepted or rejected
    if (application.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: "Cannot withdraw an accepted offer. Please contact the company directly."
      });
    }

    if (application.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: "Cannot withdraw a rejected application"
      });
    }

    application.status = 'withdrawn';
    application.withdrawal = {
      withdrawn: true,
      reason: reason || 'Not specified',
      date: Date.now()
    };

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      data: application
    });

  } catch (error) {
    console.error("Error withdrawing application:", error);
    res.status(500).json({
      success: false,
      message: "Server error while withdrawing application"
    });
  }
};

/**
 * @desc    Get application statistics for company dashboard
 * @route   GET /api/applications/stats/company
 * @access  Private (Company Admins only)
 */
export const getCompanyApplicationStats = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company profile not found"
      });
    }

    const { timeframe = '30' } = req.query;
    const daysAgo = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get overall statistics
    const overallStats = await Application.aggregate([
      { $match: { companyId: company._id } },
      { $group: {
        _id: null,
        totalApplications: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        reviewed: { $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] } },
        shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
        accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
        withdrawn: { $sum: { $cond: [{ $eq: ['$status', 'withdrawn'] }, 1, 0] } }
      }}
    ]);

    // Get applications over time
    const applicationsOverTime = await Application.aggregate([
      {
        $match: {
          companyId: company._id,
          appliedDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appliedDate' },
            month: { $month: '$appliedDate' },
            day: { $dayOfMonth: '$appliedDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get applications by internship
    const applicationsByInternship = await Application.aggregate([
      { $match: { companyId: company._id } },
      {
        $group: {
          _id: '$internshipId',
          count: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'internships',
          localField: '_id',
          foreignField: '_id',
          as: 'internship'
        }
      },
      { $unwind: '$internship' },
      {
        $project: {
          _id: 1,
          title: '$internship.title',
          count: 1,
          pending: 1,
          accepted: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: overallStats[0] || {
          totalApplications: 0,
          pending: 0,
          reviewed: 0,
          shortlisted: 0,
          accepted: 0,
          rejected: 0,
          withdrawn: 0
        },
        applicationsOverTime,
        applicationsByInternship,
        timeframe: daysAgo
      }
    });

  } catch (error) {
    console.error("Error fetching application stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching statistics"
    });
  }
};