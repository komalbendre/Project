import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Company from "../models/Company.js";

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

/**
 * Authentication Middleware - Verifies JWT token and attaches user to request
 */
export const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token, access denied"
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user by ID and populate company data
    const user = await User.findById(decoded.userId)
      .select("-password")
      .populate({
        path: "companyId",
        select: "_id companyName status"
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user account is active
    if (user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated"
      });
    }

    // For company users, ensure company data is attached
    const companyRoles = ["company_admin", "company"];
    if (companyRoles.includes(user.role)) {
      if (!user.companyId) {
        const company = await Company.findOne({ userId: user._id });
        if (company) {
          user.companyId = company;
        }
      }
    }

    // Attach user data to request object
    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      companyId: user.companyId?._id || user.companyId,
      companyStatus: user.companyId?.status,
      companyName: user.companyId?.companyName
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);

    // Handle specific JWT errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

/**
 * Admin Only Middleware - Restricts access to admin users only
 */
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    next();
  } catch (err) {
    console.error("Admin middleware error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Authorization error"
    });
  }
};

/**
 * Company Only Middleware - Restricts access to company admin users only
 */
export const companyOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Accept both company roles
    if (req.user.role !== "company_admin" && req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Company admin privileges required."
      });
    }

    // Get company from database
    const company = await Company.findOne({ userId: req.user._id });
    
    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company profile not found. Please complete your company profile first."
      });
    }

    // Check if company is approved
    if (company.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: `Company account is ${company.status}. Please wait for admin approval.`
      });
    }

    // Update user object with company data
    req.user.companyId = company._id;
    req.user.companyStatus = company.status;
    req.user.companyName = company.companyName;

    next();
  } catch (err) {
    console.error("Company middleware error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error in company middleware"
    });
  }
};

/**
 * User Only Middleware - Restricts access to regular users only
 */
export const userOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. User privileges required."
      });
    }

    next();
  } catch (err) {
    console.error("User middleware error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Authorization error"
    });
  }
};

/**
 * Is Authenticated Middleware - Checks if user is logged in (any role)
 */
export const isAuthenticated = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    next();
  } catch (err) {
    console.error("Authentication middleware error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Authentication error"
    });
  }
};

/**
 * Role Check Middleware - Checks if user has any of the allowed roles
 */
export const roleCheck = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Allowed roles: ${allowedRoles.join(", ")}`
        });
      }

      // Additional check for company admins
      const companyRoles = ['company_admin', 'company'];
      if (companyRoles.includes(req.user.role) && !req.user.isApproved) {
        return res.status(403).json({
          success: false,
          message: "Company account pending approval"
        });
      }

      next();
    } catch (err) {
      console.error("Role check middleware error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Authorization error"
      });
    }
  };
};

/**
 * Generate JWT Token - Helper function
 */
export const generateToken = (userId, role) => {
  const payload = {
    userId,
    role,
    timestamp: Date.now()
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

/**
 * Verify JWT Token - Helper function
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Get User from Token - Helper function
 */
export const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    return user;
  } catch (error) {
    return null;
  }
};

export default auth;