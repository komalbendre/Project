import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";

/**
 * Get Company's Internships - For company admin users
 */
export const getCompanyInternships = async (req, res) => {
    try {
        // Get company for the logged-in user
        const company = await Company.findOne({ userId: req.user._id });
        
        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Company profile not found"
            });
        }
        
        // Check if company is approved
        if (company.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: `Company is ${company.status}. Please wait for admin approval.`
            });
        }
        
        // Fetch internships for the company
        const internships = await Internship.find({ companyId: company._id })
            .sort({ createdAt: -1 })
            .lean();
        
        // Get application counts for each internship
        const internshipsWithCounts = await Promise.all(
            internships.map(async (internship) => {
                try {
                    const applicationCount = await Application.countDocuments({
                        internshipId: internship._id
                    });
                    return {
                        ...internship,
                        applicationCount,
                        id: internship._id
                    };
                } catch (err) {
                    // Return 0 if there's an error counting applications
                    return {
                        ...internship,
                        applicationCount: 0,
                        id: internship._id
                    };
                }
            })
        );
        
        res.status(200).json({
            success: true,
            data: internshipsWithCounts,
            count: internshipsWithCounts.length,
            message: internshipsWithCounts.length === 0 
                ? "No internships found. Create your first internship!" 
                : "Internships retrieved successfully"
        });
        
    } catch (error) {
        console.error("Get internships error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching internships"
        });
    }
};

/**
 * Create New Internship - For company admin users
 */
export const createInternship = async (req, res) => {
    try {
        // Get company ID and name from user or find company
        let companyId = req.user.companyId;
        let companyName = "";
        
        if (!companyId) {
            const company = await Company.findOne({ userId: req.user._id });
            if (company) {
                companyId = company._id;
                companyName = company.companyName;
            }
        } else {
            const company = await Company.findById(companyId);
            companyName = company.companyName;
        }

        if (!companyId || !companyName) {
            return res.status(400).json({
                success: false,
                message: "Company not found. Please complete your company profile."
            });
        }

        const {
            title,
            department,
            location,
            type,
            duration,
            startDate,
            applicationDeadline,
            positions,
            stipend,
            experienceLevel,
            description,
            responsibilities,
            requirements,
            skills,
            benefits,
            applicationProcess,
            contactEmail,
            contactPhone,
            status
        } = req.body;

        // Validate required fields
        const requiredFields = [
            'title', 'department', 'location', 'duration',
            'applicationDeadline', 'positions', 'description',
            'responsibilities', 'requirements'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Parse skills string to array if needed
        let skillsArray = [];
        if (skills) {
            if (Array.isArray(skills)) {
                skillsArray = skills;
            } else if (typeof skills === 'string') {
                skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
            }
        }

        // Handle stipend - ensure it's an object with proper structure
        let stipendData;
        if (stipend && typeof stipend === 'object') {
            stipendData = {
                amount: parseFloat(stipend.amount) || 0,
                currency: stipend.currency || 'USD',
                period: stipend.period || 'month',
                isPaid: stipend.isPaid || false
            };
        } else {
            stipendData = {
                amount: 0,
                currency: 'USD',
                period: 'month',
                isPaid: false
            };
        }

        // Create new internship with companyName
        const internship = new Internship({
            companyId,
            companyName, // Add companyName
            title,
            department,
            location,
            type: type || 'remote',
            duration,
            startDate: startDate ? new Date(startDate) : null,
            applicationDeadline: new Date(applicationDeadline),
            positions: parseInt(positions),
            stipend: stipendData,
            experienceLevel: experienceLevel || 'Beginner',
            description,
            responsibilities,
            requirements,
            skills: skillsArray,
            benefits: benefits || '',
            applicationProcess: applicationProcess || '',
            contactEmail: contactEmail || '',
            contactPhone: contactPhone || '',
            status: status || 'Open'
        });

        await internship.save();

        res.status(201).json({
            success: true,
            message: "Internship posted successfully",
            data: internship
        });

    } catch (error) {
        console.error("Create internship error:", error);
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
            message: "Server error while creating internship"
        });
    }
};

/**
 * Get Single Internship - For company admin users
 */
export const getInternshipById = async (req, res) => {
    try {
        const { id } = req.params;

        // Get company ID
        let companyId = req.user.companyId;
        
        if (!companyId) {
            const company = await Company.findOne({ userId: req.user._id });
            if (company) {
                companyId = company._id;
            }
        }

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        // Find internship belonging to the company
        const internship = await Internship.findOne({
            _id: id,
            companyId
        });

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        // Get application count
        const applicationCount = await Application.countDocuments({
            internshipId: id
        });

        res.status(200).json({
            success: true,
            data: {
                ...internship.toObject(),
                applicationCount
            }
        });

    } catch (error) {
        console.error("Get internship error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching internship"
        });
    }
};

/**
 * Update Internship - For company admin users
 */
export const updateInternship = async (req, res) => {
    try {
        const { id } = req.params;

        // Get company ID
        let companyId = req.user.companyId;
        
        if (!companyId) {
            const company = await Company.findOne({ userId: req.user._id });
            if (company) {
                companyId = company._id;
            }
        }

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        const updates = req.body;

        // Check if internship exists and belongs to company
        const internship = await Internship.findOne({
            _id: id,
            companyId
        });

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        // Convert skills string to array if needed
        if (updates.skills && typeof updates.skills === 'string') {
            updates.skills = updates.skills.split(',').map(s => s.trim());
        }

        // Handle stipend updates
        if (updates.stipend && typeof updates.stipend === 'object') {
            // Ensure stipend has proper structure
            updates.stipend = {
                amount: parseFloat(updates.stipend.amount) || 0,
                currency: updates.stipend.currency || 'USD',
                period: updates.stipend.period || 'month',
                isPaid: updates.stipend.isPaid || false
            };
        }

        // Handle date fields
        if (updates.startDate) {
            updates.startDate = new Date(updates.startDate);
        }

        if (updates.applicationDeadline) {
            updates.applicationDeadline = new Date(updates.applicationDeadline);
        }

        // Update fields
        Object.keys(updates).forEach(key => {
            if (key !== 'companyId' && key !== '_id') {
                internship[key] = updates[key];
            }
        });

        internship.updatedAt = Date.now();
        await internship.save();

        res.status(200).json({
            success: true,
            message: "Internship updated successfully",
            data: internship
        });

    } catch (error) {
        console.error("Update internship error:", error);
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
            message: "Server error while updating internship"
        });
    }
};

/**
 * Delete Internship - For company admin users
 */
export const deleteInternship = async (req, res) => {
    try {
        const { id } = req.params;

        // Get company ID
        let companyId = req.user.companyId;
        
        if (!companyId) {
            const company = await Company.findOne({ userId: req.user._id });
            if (company) {
                companyId = company._id;
            }
        }

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        // Check if internship exists and belongs to company
        const internship = await Internship.findOne({
            _id: id,
            companyId
        });

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        // Check if there are applications
        const applicationCount = await Application.countDocuments({
            internshipId: id
        });

        if (applicationCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete internship with applications. Please close it instead."
            });
        }

        await Internship.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: "Internship deleted successfully"
        });

    } catch (error) {
        console.error("Delete internship error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting internship"
        });
    }
};

/**
 * Update Internship Status - For company admin users
 */
export const updateInternshipStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Get company ID
        let companyId = req.user.companyId;
        
        if (!companyId) {
            const company = await Company.findOne({ userId: req.user._id });
            if (company) {
                companyId = company._id;
            }
        }

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        // Validate status value
        if (!['Open', 'Closed', 'Draft'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // Update internship status
        const internship = await Internship.findOneAndUpdate(
            {
                _id: id,
                companyId
            },
            {
                status,
                updatedAt: Date.now()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Internship status updated successfully",
            data: internship
        });

    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating internship status"
        });
    }
};

/**
 * Get Internship Applications - For company admin users
 */
export const getInternshipApplications = async (req, res) => {
    try {
        const { id } = req.params;

        // Get company ID
        let companyId = req.user.companyId;
        
        if (!companyId) {
            const company = await Company.findOne({ userId: req.user._id });
            if (company) {
                companyId = company._id;
            }
        }

        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        // Verify internship belongs to company
        const internship = await Internship.findOne({
            _id: id,
            companyId
        });

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: "Internship not found"
            });
        }

        // Get applications for the internship
        const applications = await Application.find({ internshipId: id })
            .sort({ appliedDate: -1 })
            .select('-__v');

        res.status(200).json({
            success: true,
            data: applications
        });

    } catch (error) {
        console.error("Get applications error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching applications"
        });
    }
};