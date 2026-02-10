import Application from "../models/Application.js";
import Internship from "../models/Internship.js";

// Get company's applications
export const getCompanyApplications = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { status, limit = 50 } = req.query;
        
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        const query = { companyId };
        if (status && status !== 'all') {
            query.status = status;
        }
        
        const applications = await Application.find(query)
            .sort({ appliedDate: -1 })
            .limit(parseInt(limit));
        
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