import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const companyAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token, authentication denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== "company") {
      return res.status(401).json({ message: "Invalid token type" });
    }
    
    const company = await Company.findById(decoded.id).select("-password");
    
    if (!company) {
      return res.status(401).json({ message: "Company not found" });
    }
    
    req.company = company;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};