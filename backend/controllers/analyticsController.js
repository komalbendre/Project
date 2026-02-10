import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";

export const getCompanyAnalytics = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        // Get internships count
        const totalInternships = await Internship.countDocuments({ companyId });
        const activeInternships = await Internship.countDocuments({ 
            companyId, 
            status: 'Active' 
        });
        
        // Get applications count
        const totalApplications = await Application.countDocuments({ companyId });
        const interviewScheduled = await Application.countDocuments({ 
            companyId, 
            status: 'Interview Scheduled' 
        });
        const hired = await Application.countDocuments({ 
            companyId, 
            status: 'Hired' 
        });
        
        // Calculate conversion rate
        const conversionRate = totalApplications > 0 
            ? ((hired / totalApplications) * 100).toFixed(1) + '%'
            : '0%';
        
        // Get applications trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        // Get all applications for trend
        const applications = await Application.find({ 
            companyId,
            appliedDate: { $gte: sixMonthsAgo }
        }).sort({ appliedDate: 1 });
        
        // Create monthly trend
        const monthlyTrend = {};
        applications.forEach(app => {
            const month = app.appliedDate.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyTrend[month]) {
                monthlyTrend[month] = { applications: 0, interviews: 0, hires: 0 };
            }
            monthlyTrend[month].applications++;
            
            if (app.status === 'Interview Scheduled') {
                monthlyTrend[month].interviews++;
            }
            if (app.status === 'Hired') {
                monthlyTrend[month].hires++;
            }
        });
        
        const applicationsTrend = Object.keys(monthlyTrend).map(month => ({
            month,
            ...monthlyTrend[month]
        })).slice(-6); // Last 6 months
        
        // Get recent applications for activities
        const recentApplications = await Application.find({ companyId })
            .sort({ appliedDate: -1 })
            .limit(5);
        
        const recentActivities = recentApplications.map((app, index) => ({
            id: index + 1,
            action: 'New application received',
            candidate: app.candidateName,
            time: calculateTimeAgo(app.appliedDate),
            type: 'application'
        }));
        
        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalInternships,
                    activeInternships,
                    totalApplications,
                    interviewScheduled,
                    hired,
                    conversionRate,
                    avgResponseTime: "2.1 days"
                },
                applicationsTrend,
                recentActivities
            }
        });
        
    } catch (error) {
        console.error("Get analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching analytics"
        });
    }
};

function calculateTimeAgo(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
        return "Just now";
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    }
}