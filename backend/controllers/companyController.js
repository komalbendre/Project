import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import User from "../models/User.js";

/**
 * Company Signup - Register a new company and company admin user
 */
export const companySignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      contactEmail,
      phoneNo,
      description = "",
      websiteUrl = "",
      industry,
      linkedinUrl = "",
      address = "",
      city = "",
      state = "",
      country = ""
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !companyName || !contactEmail || !phoneNo || !industry) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Split name into first and last name
    const [fname, ...rest] = name.trim().split(" ");
    const lname = rest.join(" ") || "-";

    // Create user with company_admin role
    const user = new User({
      fname,
      lname,
      email,
      password,
      role: "company_admin",
      isApproved: false
    });

    await user.save();

    // Create company with pending status
    const company = new Company({
      userId: user._id,
      companyName,
      contactEmail,
      phoneNo,
      description,
      websiteUrl,
      industry,
      linkedinUrl,
      address,
      city,
      state,
      country,
      status: 'pending'
    });

    await company.save();

    // Link company to user
    await User.findByIdAndUpdate(user._id, {
      companyId: company._id
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "mysecret", { expiresIn: "1d" });

    res.status(201).json({
      success: true,
      message: "Company registration submitted for admin approval",
      data: {
        user: {
          id: user._id,
          name: `${user.fname} ${user.lname}`,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved
        },
        company: {
          id: company._id,
          companyName: company.companyName,
          contactEmail: company.contactEmail,
          status: company.status
        },
        token
      }
    });

  } catch (error) {
    console.error("Company signup error:", error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }
    
    // Handle validation errors
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
      message: "Server error during company registration"
    });
  }
};

/**
 * Get All Companies - Admin only with pagination and filters
 */
export const getAllCompanies = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    // Build query object
    const query = {};
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch companies with pagination
    const companies = await Company.find(query)
      .populate('userId', 'fname lname email role isApproved')
      .populate('approvedBy', 'fname lname email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Company.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: "Companies retrieved successfully",
      data: companies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error("Get companies error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching companies"
    });
  }
};

/**
 * Get Pending Companies - Admin only
 */
export const getPendingCompanies = async (req, res) => {
  try {
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

/**
 * Approve Company - Admin only
 */
export const approveCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
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
    
    // Update company status and approval info
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

/**
 * Reject Company - Admin only
 */
export const rejectCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
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
    
    // Update company status with rejection reason
    company.status = 'rejected';
    company.rejectionReason = reason || "Not meeting requirements";
    await company.save();
    
    // Deactivate user account
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

/**
 * Get Company by ID - For authorized users
 */
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findById(id)
      .populate('userId', 'fname lname email role isApproved')
      .populate('approvedBy', 'fname lname email');
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    // Check if user is authorized to view
    const isOwner = req.user._id.toString() === company.userId._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Company retrieved successfully",
      data: company,
      isOwner,
      isAdmin
    });
    
  } catch (error) {
    console.error("Get company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching company"
    });
  }
};

/**
 * Get My Company - For company admin users
 */
export const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user._id })
      .populate('userId', 'fname lname email role isApproved');
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Company profile retrieved",
      data: company
    });
    
  } catch (error) {
    console.error("Get my company error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching company profile"
    });
  }
};

/**
 * Update Company Profile - For company owners or admins
 */
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const company = await Company.findById(id);
    
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    // Check if user is authorized
    const isOwner = req.user._id.toString() === company.userId.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own company profile"
      });
    }
    
    // Remove restricted fields
    delete updates.status;
    delete updates.approvedBy;
    delete updates.approvedAt;
    delete updates.userId;
    delete updates.contactEmail;
    
    // Update company
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('userId', 'fname lname email role isApproved');
    
    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: updatedCompany
    });
    
  } catch (error) {
    console.error("Update company error:", error);
    
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
      message: "Server error while updating company"
    });
  }
};