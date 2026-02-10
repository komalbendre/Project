import User from "../models/User.js";

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
    
    // Format the response
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
      bio: user.bio || "",
      technicalSkills: user.technicalSkills || [],
      softSkills: user.softSkills || [],
      linkedin: user.linkedin || "",
      github: user.github || "",
      experience: user.experience || [],
      education: user.education || [],
      certifications: user.certifications || [],
      projects: user.projects || [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
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
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user"
    });
  }
};