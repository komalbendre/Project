import User from "../models/User.js";
import Profile from "../models/Profile.js"; // Add this import

export const getCurrentUser = async (req, res) => {
  try {
    console.log("Getting current user for ID:", req.user._id);
    
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Get the user's profile to include profile data
    const profile = await Profile.findOne({ userId: req.user._id });
    
    // Format the response - only include user fields, no profile fields
    const userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      isActive: user.isActive,
      profileCompleted: user.profileCompleted,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Include profile data if it exists
      profile: profile ? {
        id: profile._id,
        fullName: profile.fullName,
        phone: profile.phone,
        bio: profile.bio,
        technicalSkills: profile.technicalSkills,
        softSkills: profile.softSkills,
        linkedin: profile.linkedin,
        github: profile.github,
        portfolio: profile.portfolio,
        location: profile.location,
        experience: profile.experience,
        education: profile.education,
        certifications: profile.certifications,
        projects: profile.projects
      } : null
    };
    
    console.log("User found:", userData.email);
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Get the user's profile
    const profile = await Profile.findOne({ userId: req.params.id });
    
    const userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      isActive: user.isActive,
      profileCompleted: user.profileCompleted,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: profile ? {
        id: profile._id,
        fullName: profile.fullName,
        phone: profile.phone,
        bio: profile.bio,
        technicalSkills: profile.technicalSkills,
        softSkills: profile.softSkills,
        linkedin: profile.linkedin,
        github: profile.github,
        portfolio: profile.portfolio,
        location: profile.location,
        experience: profile.experience,
        education: profile.education,
        certifications: profile.certifications,
        projects: profile.projects
      } : null
    };
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user"
    });
  }
};