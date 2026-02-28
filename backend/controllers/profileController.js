import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { getUserFromToken } from "../middleware/auth.js";

// ✅ GET /api/profile/:userId - Get user profile
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate user ID
    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Check if requesting user is authorized
    const token = req.header("Authorization")?.replace("Bearer ", "");
    let requestingUserId = null;
    
    if (token) {
      const requestingUser = await getUserFromToken(token);
      if (requestingUser) {
        requestingUserId = requestingUser._id.toString();
      }
    }

    // Find profile
    const profile = await Profile.findOne({ userId }).populate('userId', 'name email role');
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
        data: null
      });
    }

    // Check if user is viewing their own profile or is admin
    const isOwner = requestingUserId === profile.userId._id.toString();
    const isAdmin = req.user?.role === 'admin';
    
    // Return appropriate data based on permissions
    const profileData = {
      id: profile._id,
      userId: profile.userId._id,
      fullName: profile.fullName || "",
      email: profile.email || profile.userId.email || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
      technicalSkills: profile.technicalSkills || [],
      softSkills: profile.softSkills || [],
      linkedin: profile.linkedin || "",
      github: profile.github || "",
      portfolio: profile.portfolio || "",
      location: profile.location || "",
      experience: profile.experience || [],
      education: profile.education || [],
      certifications: profile.certifications || [],
      projects: profile.projects || [],
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };

    // Add additional fields if owner or admin
    if (isOwner || isAdmin) {
      profileData.user = {
        id: profile.userId._id,
        name: profile.userId.name,
        email: profile.userId.email,
        role: profile.userId.role
      };
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: profileData,
      isOwner,
      isAdmin
    });

  } catch (error) {
    console.error("Get profile error:", error);
    
    // Handle specific errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ GET /api/profile/me - Get current user's profile
export const getMyProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const profile = await Profile.findOne({ userId: req.user._id });
    
    if (!profile) {
      // Return basic user info even if profile not created
      return res.status(200).json({
        success: true,
        message: "Create your profile to get started",
        data: {
          userId: req.user._id,
          fullName: "",
          email: req.user.email,
          phone: "",
          bio: "",
          technicalSkills: [],
          softSkills: [],
          linkedin: "",
          github: "",
          experience: [],
          education: [],
          certifications: [],
          projects: [],
          user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            isApproved: req.user.isApproved
          }
        },
        isEmpty: true
      });
    }

    const profileData = {
      id: profile._id,
      userId: profile.userId,
      fullName: profile.fullName || "",
      email: profile.email || req.user.email,
      phone: profile.phone || "",
      bio: profile.bio || "",
      technicalSkills: profile.technicalSkills || [],
      softSkills: profile.softSkills || [],
      linkedin: profile.linkedin || "",
      github: profile.github || "",
      portfolio: profile.portfolio || "",
      location: profile.location || "",
      experience: profile.experience || [],
      education: profile.education || [],
      certifications: profile.certifications || [],
      projects: profile.projects || [],
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isApproved: req.user.isApproved
      }
    };

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: profileData
    });

  } catch (error) {
    console.error("Get my profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile"
    });
  }
};

// POST /api/profile/:userId - Create/Update profile
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      fullName,
      email,
      phone,
      bio,
      technicalSkills,
      softSkills,
      linkedin,
      github,
      portfolio,
      location,
      experience,
      education,
      certifications,
      projects
    } = req.body;

    // Validate user ID
    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Check if user is updating their own profile or is admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile"
      });
    }

    // Validate required fields
    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Full name is required and must be at least 2 characters"
      });
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Process technical skills
    let technicalSkillsArray = [];
    if (technicalSkills) {
      if (typeof technicalSkills === 'string') {
        technicalSkillsArray = technicalSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);
      } else if (Array.isArray(technicalSkills)) {
        technicalSkillsArray = technicalSkills.map(s => s.trim()).filter(s => s.length > 0);
      }
    }

    // Process soft skills
    let softSkillsArray = [];
    if (softSkills) {
      if (typeof softSkills === 'string') {
        softSkillsArray = softSkills.split(",").map(s => s.trim()).filter(s => s.length > 0);
      } else if (Array.isArray(softSkills)) {
        softSkillsArray = softSkills.map(s => s.trim()).filter(s => s.length > 0);
      }
    }

    // Validate total skills limit (combined)
    const totalSkills = technicalSkillsArray.length + softSkillsArray.length;
    if (totalSkills > 30) {
      return res.status(400).json({
        success: false,
        message: "Maximum 30 total skills allowed (combined technical and soft)"
      });
    }

    // Prepare profile data
    const profileData = {
      userId,
      fullName: fullName.trim(),
      email: email ? email.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      bio: bio ? bio.trim() : undefined,
      technicalSkills: technicalSkillsArray,
      softSkills: softSkillsArray,
      linkedin: linkedin ? linkedin.trim() : undefined,
      github: github ? github.trim() : undefined,
      portfolio: portfolio ? portfolio.trim() : undefined,
      location: location ? location.trim() : undefined,
      updatedAt: Date.now()
    };

    // Handle arrays if provided - ensure they have the right structure
    if (experience && Array.isArray(experience)) {
      profileData.experience = experience.map(exp => ({
        title: exp.title || "",
        company: exp.company || "",
        description: exp.description || ""
      }));
    }
    
    if (education && Array.isArray(education)) {
      profileData.education = education.map(edu => ({
        institution: edu.institution || "",
        degree: edu.degree || "",
        fieldOfStudy: edu.fieldOfStudy || "",
        startYear: edu.startYear || "",
        endYear: edu.endYear || "",
        currentlyStudying: edu.currentlyStudying || false,
        gradeCGPA: edu.gradeCGPA || "",
        subjectsCourses: edu.subjectsCourses || ""
      }));
    }
    
    if (certifications && Array.isArray(certifications)) {
      profileData.certifications = certifications.map(cert => ({
        name: cert.name || "",
        issuer: cert.issuer || ""
      }));
    }
    
    if (projects && Array.isArray(projects)) {
      profileData.projects = projects.map(proj => ({
        name: proj.name || "",
        description: proj.description || ""
      }));
    }

    console.log("Saving profile data for user:", userId);
    console.log("Technical skills:", technicalSkillsArray);
    console.log("Soft skills:", softSkillsArray);

    // Find existing profile
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { userId },
        profileData,
        { 
          new: true, 
          runValidators: true,
          upsert: false 
        }
      );
    } else {
      // Create new profile
      profileData.createdAt = Date.now();
      profile = new Profile(profileData);
      await profile.save();
      
      // Update user's profileCompleted status
      await User.findByIdAndUpdate(userId, { profileCompleted: true });
    }

    // Populate user data
    const populatedProfile = await Profile.findById(profile._id).populate('userId', 'fname lname email role isApproved');

    // Prepare response
    const responseData = {
      id: populatedProfile._id,
      userId: populatedProfile.userId._id,
      fullName: populatedProfile.fullName,
      email: populatedProfile.email || populatedProfile.userId.email,
      phone: populatedProfile.phone || "",
      bio: populatedProfile.bio || "",
      technicalSkills: populatedProfile.technicalSkills || [],
      softSkills: populatedProfile.softSkills || [],
      linkedin: populatedProfile.linkedin || "",
      github: populatedProfile.github || "",
      portfolio: populatedProfile.portfolio || "",
      location: populatedProfile.location || "",
      experience: populatedProfile.experience || [],
      education: populatedProfile.education || [],
      certifications: populatedProfile.certifications || [],
      projects: populatedProfile.projects || [],
      createdAt: populatedProfile.createdAt,
      updatedAt: populatedProfile.updatedAt,
      user: {
        id: populatedProfile.userId._id,
        fname: populatedProfile.userId.fname,
        lname: populatedProfile.userId.lname,
        fullName: `${populatedProfile.userId.fname} ${populatedProfile.userId.lname}`,
        email: populatedProfile.userId.email,
        role: populatedProfile.userId.role,
        isApproved: populatedProfile.userId.isApproved
      }
    };

    res.status(200).json({
      success: true,
      message: profile.createdAt === profile.updatedAt ? 
        "Profile created successfully" : 
        "Profile updated successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Update profile error:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Server error while saving profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// ✅ GET /api/profiles - Get all profiles (admin only)
export const getAllProfiles = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Admin access required"
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    // Search functionality
    if (req.query.search) {
      query.$or = [
        { fullName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { bio: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filter by skills
    if (req.query.skills) {
      const skillsArray = req.query.skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray };
    }

    // Get profiles with pagination
    const profiles = await Profile.find(query)
      .populate('userId', 'name email role isApproved createdAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Profile.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Format profiles
    const formattedProfiles = profiles.map(profile => ({
      id: profile._id,
      userId: profile.userId._id,
      fullName: profile.fullName,
      email: profile.email || profile.userId.email,
      phone: profile.phone || "Not provided",
      technicalSkills: profile.technicalSkills || [],
softSkills: profile.softSkills || [],
      location: profile.location || "Not provided",
      user: {
        id: profile.userId._id,
        name: profile.userId.name,
        email: profile.userId.email,
        role: profile.userId.role,
        isApproved: profile.userId.isApproved,
        createdAt: profile.userId.createdAt
      },
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    }));

    res.status(200).json({
      success: true,
      message: "Profiles retrieved successfully",
      data: formattedProfiles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error("Get all profiles error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profiles"
    });
  }
};

// ✅ DELETE /api/profile/:userId - Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is deleting their own profile or is admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own profile"
      });
    }

    const profile = await Profile.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      data: {
        userId,
        deletedAt: Date.now()
      }
    });

  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting profile"
    });
  }
};

// ✅ GET /api/profile/stats/:userId - Get profile statistics
export const getProfileStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(200).json({
        success: true,
        message: "Profile statistics",
        data: {
          completion: 0,
          totalSkills: 0,
          hasContactInfo: false,
          hasBio: false,
          hasLinks: false,
          lastUpdated: null
        }
      });
    }

    // Calculate profile completion percentage
    let completionScore = 0;
    const totalFields = 8; // Number of fields we're checking
    
    if (profile.fullName && profile.fullName.length > 0) completionScore++;
    if (profile.email && profile.email.length > 0) completionScore++;
    if (profile.phone && profile.phone.length > 0) completionScore++;
    if (profile.bio && profile.bio.length > 0) completionScore++;
    if ((profile.technicalSkills && profile.technicalSkills.length > 0) || 
    (profile.softSkills && profile.softSkills.length > 0)) completionScore++;
    if (profile.linkedin && profile.linkedin.length > 0) completionScore++;
    if (profile.github && profile.github.length > 0) completionScore++;
    if (profile.location && profile.location.length > 0) completionScore++;
    
    const completionPercentage = Math.round((completionScore / totalFields) * 100);

    res.status(200).json({
      success: true,
      message: "Profile statistics retrieved",
      data: {
        completion: completionPercentage,
        totalSkills: profile.skills?.length || 0,
        hasContactInfo: !!(profile.email || profile.phone),
        hasBio: !!(profile.bio && profile.bio.length > 0),
        hasLinks: !!(profile.linkedin || profile.github || profile.portfolio),
        hasExperience: !!(profile.experience && profile.experience.length > 0),
        hasEducation: !!(profile.education && profile.education.length > 0),
        lastUpdated: profile.updatedAt,
        createdAt: profile.createdAt
      }
    });

  } catch (error) {
    console.error("Get profile stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching profile statistics"
    });
  }
};