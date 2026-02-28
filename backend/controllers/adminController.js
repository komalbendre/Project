import User from "../models/User.js";
import Company from "../models/Company.js";

// ✅ Get all users (admin only)
export const getUsers = async (req, res) => {
  try {
    console.log("Admin: Fetching all users");
    
    const users = await User.find().select("-password");
    
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users"
    });
  }
};

// ✅ Get all companies (admin only)
export const getCompanies = async (req, res) => {
  try {
    console.log("Admin: Fetching all companies");
    
    const companies = await Company.find()
      .populate('userId', 'fname lname email role isApproved')
      .populate('approvedBy', 'fname lname email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: "Companies retrieved successfully",
      data: companies
    });
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching companies"
    });
  }
};

// ✅ Get pending companies (admin only)
export const getPendingCompanies = async (req, res) => {
  try {
    console.log("Admin: Fetching pending companies");
    
    const companies = await Company.find({ status: 'pending' })
      .populate('userId', 'fname lname email createdAt')
      .sort({ createdAt: 1 });
    
    res.status(200).json({
      success: true,
      message: "Pending companies retrieved",
      data: companies
    });
  } catch (error) {
    console.error("Get pending companies error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching pending companies"
    });
  }
};

// ✅ Approve company (admin only)
export const approveCompany = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Admin: Approving company ${id}`);
    
    const company = await Company.findById(id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    if (company.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: "Company already approved"
      });
    }
    
    // Update company status
    company.status = 'approved';
    company.approvedBy = req.user._id;
    company.approvedAt = Date.now();
    await company.save();
    
    // Update user approval status
    await User.findByIdAndUpdate(company.userId, {
      isApproved: true
    });
    
    res.status(200).json({
      success: true,
      message: "Company approved successfully",
      data: company
    });
    
  } catch (error) {
    console.error("Approve company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while approving company"
    });
  }
};

// ✅ Reject company (admin only)
export const rejectCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    console.log(`Admin: Rejecting company ${id}`);
    
    const company = await Company.findById(id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    if (company.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: "Company already rejected"
      });
    }
    
    // Update company status
    company.status = 'rejected';
    company.rejectionReason = reason || "Not meeting requirements";
    await company.save();
    
    // Optionally deactivate user account
    await User.findByIdAndUpdate(company.userId, {
      isActive: false
    });
    
    res.status(200).json({
      success: true,
      message: "Company rejected successfully",
      data: company
    });
    
  } catch (error) {
    console.error("Reject company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while rejecting company"
    });
  }
};

// ✅ Suspend user (admin only)
export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Admin: Suspending user ${id}`);
    
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "User suspended successfully",
      data: user
    });
  } catch (error) {
    console.error("Suspend user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while suspending user"
    });
  }
};

// ✅ Activate user (admin only)
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Admin: Activating user ${id}`);
    
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: user
    });
  } catch (error) {
    console.error("Activate user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while activating user"
    });
  }
};

// ✅ Get dashboard stats (admin only)
export const getStats = async (req, res) => {
  try {
    console.log("Admin: Fetching dashboard stats");
    
    const totalUsers = await User.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const pendingCompanies = await Company.countDocuments({ status: 'pending' });
    const activeCompanies = await Company.countDocuments({ status: 'approved' });
    
    // Get recent registrations (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    const recentCompanies = await Company.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });
    
    res.status(200).json({
      success: true,
      message: "Stats retrieved successfully",
      data: {
        totalUsers,
        totalCompanies,
        pendingCompanies,
        activeCompanies,
        recentUsers,
        recentCompanies
      }
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching stats"
    });
  }
};