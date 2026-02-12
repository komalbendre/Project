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

        // Get company details
        const company = await Company.findById(companyId);

        // Get internships count and stats
        const totalInternships = await Internship.countDocuments({ companyId });
        const activeInternships = await Internship.countDocuments({ 
            companyId, 
            status: 'Open',
            isActive: true
        });
        const closedInternships = await Internship.countDocuments({ 
            companyId, 
            status: 'Closed' 
        });
        const draftInternships = await Internship.countDocuments({ 
            companyId, 
            status: 'Draft' 
        });

        // Get applications stats by status
        const totalApplications = await Application.countDocuments({ companyId });
        
        const applicationsByStatus = await Application.aggregate([
            { $match: { companyId: company._id } },
            { $group: {
                _id: '$status',
                count: { $sum: 1 }
            }}
        ]);

        // Get applications with interviews scheduled
        const interviewScheduled = await Application.countDocuments({ 
            companyId, 
            'interview.scheduled': true 
        });

        // Get hired count (accepted offers)
        const hired = await Application.countDocuments({ 
            companyId, 
            status: 'accepted' 
        });

        // Calculate conversion rate
        const conversionRate = totalApplications > 0 
            ? ((hired / totalApplications) * 100).toFixed(1)
            : '0.0';

        // Get applications trend (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        
        const applicationsTrend = await Application.aggregate([
            {
                $match: {
                    companyId: company._id,
                    appliedDate: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$appliedDate' },
                        month: { $month: '$appliedDate' }
                    },
                    applications: { $sum: 1 },
                    interviews: {
                        $sum: {
                            $cond: [{ $eq: ['$interview.scheduled', true] }, 1, 0]
                        }
                    },
                    hires: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
            { $limit: 12 }
        ]);

        // Format trend data
        const formattedTrendData = applicationsTrend.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                applications: item.applications,
                interviews: item.interviews,
                hires: item.hires
            };
        });

        // Get applications by internship
        const applicationsByInternship = await Application.aggregate([
            { $match: { companyId: company._id } },
            {
                $group: {
                    _id: '$internshipId',
                    applications: { $sum: 1 },
                    interviews: {
                        $sum: {
                            $cond: [{ $eq: ['$interview.scheduled', true] }, 1, 0]
                        }
                    },
                    hires: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { applications: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'internships',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'internship'
                }
            },
            { $unwind: '$internship' },
            {
                $project: {
                    title: '$internship.title',
                    applications: 1,
                    interviews: 1,
                    hires: 1,
                    conversion: {
                        $multiply: [
                            { $divide: ['$hires', { $max: ['$applications', 1] }] },
                            100
                        ]
                    }
                }
            }
        ]);

        // Get skill demand from applications
        const skillDemand = await Application.aggregate([
            { $match: { companyId: company._id } },
            { $unwind: '$skills' },
            {
                $group: {
                    _id: { $toLower: '$skills' },
                    count: { $sum: 1 },
                    hires: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    skill: {
                        $concat: [
                            { $toUpper: { $substrCP: ['$_id', 0, 1] } },
                            { $substrCP: ['$_id', 1, { $subtract: [{ $strLenCP: '$_id' }, 1] }] }
                        ]
                    },
                    applicants: '$count',
                    hires: 1,
                    demand: {
                        $min: [
                            { $add: [50, { $multiply: ['$count', 2] }] },
                            100
                        ]
                    }
                }
            }
        ]);

        // Get candidate sources (where applications came from)
        // Note: You may need to add a 'source' field to Application model
        // For now, using mock distribution based on real data
        const candidateSources = [
            { source: 'CareerSync', count: Math.round(totalApplications * 0.55), percentage: 55 },
            { source: 'LinkedIn', count: Math.round(totalApplications * 0.25), percentage: 25 },
            { source: 'Campus', count: Math.round(totalApplications * 0.12), percentage: 12 },
            { source: 'Referrals', count: Math.round(totalApplications * 0.08), percentage: 8 }
        ];

        // Get recent activities
        const recentApplications = await Application.find({ companyId })
            .populate('internship', 'title')
            .sort({ appliedDate: -1 })
            .limit(10);

        const recentActivities = recentApplications.map((app, index) => {
            let action = '';
            let type = '';
            
            if (app.interview?.scheduled) {
                action = 'Interview scheduled';
                type = 'interview';
            } else if (app.status === 'accepted') {
                action = 'Offer accepted';
                type = 'hire';
            } else if (app.status === 'rejected') {
                action = 'Application rejected';
                type = 'rejection';
            } else if (app.status === 'shortlisted') {
                action = 'Candidate shortlisted';
                type = 'shortlist';
            } else if (app.status === 'reviewed') {
                action = 'Application reviewed';
                type = 'review';
            } else {
                action = 'New application received';
                type = 'application';
            }

            return {
                id: index + 1,
                action,
                candidate: app.fullName,
                position: app.internship?.title || 'Internship',
                time: calculateTimeAgo(app.appliedDate),
                type
            };
        });

        // Calculate average response time (mock for now)
        const avgResponseTime = calculateAvgResponseTime(applicationsByStatus);

        // Calculate average time to hire (mock for now)
        const avgTimeToHire = "14 days";

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalInternships,
                    activeInternships,
                    closedInternships,
                    draftInternships,
                    totalApplications,
                    interviewScheduled,
                    hired,
                    conversionRate: `${conversionRate}%`,
                    avgResponseTime,
                    avgTimeToHire
                },
                applicationsByStatus,
                applicationsTrend: formattedTrendData,
                applicationsByInternship,
                skillDemand,
                candidateSources,
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

// Get applications by status for pie chart
export const getApplicationsByStatus = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        const company = await Company.findOne({ userId: req.user._id });
        
        const statusData = await Application.aggregate([
            { $match: { companyId: company._id } },
            { $group: {
                _id: '$status',
                value: { $sum: 1 }
            }}
        ]);

        const statusColors = {
            pending: '#f59e0b',
            reviewed: '#3b82f6',
            shortlisted: '#8b5cf6',
            accepted: '#10b981',
            rejected: '#ef4444',
            withdrawn: '#6b7280'
        };

        const formattedData = statusData.map(item => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.value,
            color: statusColors[item._id] || '#64748b'
        }));

        res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        console.error("Error fetching application statuses:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching status data"
        });
    }
};

// Get monthly trend data
export const getMonthlyTrends = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { months = 6 } = req.query;
        
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        const company = await Company.findOne({ userId: req.user._id });
        
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - parseInt(months));

        const trendData = await Application.aggregate([
            {
                $match: {
                    companyId: company._id,
                    appliedDate: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$appliedDate' },
                        month: { $month: '$appliedDate' }
                    },
                    applications: { $sum: 1 },
                    interviews: {
                        $sum: {
                            $cond: [{ $eq: ['$interview.scheduled', true] }, 1, 0]
                        }
                    },
                    hires: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const formattedData = trendData.map(item => {
            const date = new Date(item._id.year, item._id.month - 1);
            return {
                month: date.toLocaleString('default', { month: 'short' }),
                applications: item.applications,
                interviews: item.interviews,
                hires: item.hires
            };
        });

        res.status(200).json({
            success: true,
            data: formattedData
        });

    } catch (error) {
        console.error("Error fetching trends:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching trend data"
        });
    }
};

// Get skill analytics
export const getSkillAnalytics = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        const company = await Company.findOne({ userId: req.user._id });

        const skillData = await Application.aggregate([
            { $match: { companyId: company._id } },
            { $unwind: '$skills' },
            {
                $group: {
                    _id: { $toLower: '$skills' },
                    count: { $sum: 1 },
                    hired: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $project: {
                    skill: {
                        $concat: [
                            { $toUpper: { $substrCP: ['$_id', 0, 1] } },
                            { $substrCP: ['$_id', 1, { $subtract: [{ $strLenCP: '$_id' }, 1] }] }
                        ]
                    },
                    applicants: '$count',
                    hired: 1,
                    successRate: {
                        $multiply: [
                            { $divide: ['$hired', { $max: ['$count', 1] }] },
                            100
                        ]
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: skillData
        });

    } catch (error) {
        console.error("Error fetching skill analytics:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching skill data"
        });
    }
};

// Get internship performance
export const getInternshipPerformance = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        
        if (!companyId) {
            return res.status(400).json({
                success: false,
                message: "Company not found"
            });
        }

        const company = await Company.findOne({ userId: req.user._id });

        const performanceData = await Application.aggregate([
            { $match: { companyId: company._id } },
            {
                $group: {
                    _id: '$internshipId',
                    applications: { $sum: 1 },
                    interviews: {
                        $sum: {
                            $cond: [{ $eq: ['$interview.scheduled', true] }, 1, 0]
                        }
                    },
                    hires: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { applications: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'internships',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'internship'
                }
            },
            { $unwind: '$internship' },
            {
                $project: {
                    title: '$internship.title',
                    applications: 1,
                    interviews: 1,
                    hires: 1,
                    conversionRate: {
                        $concat: [
                            { 
                                $toString: { 
                                    $round: [
                                        { 
                                            $multiply: [
                                                { $divide: ['$hires', { $max: ['$applications', 1] }] },
                                                100
                                            ]
                                        },
                                        1
                                    ]
                                }
                            },
                            '%'
                        ]
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: performanceData
        });

    } catch (error) {
        console.error("Error fetching internship performance:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching performance data"
        });
    }
};

// Helper function to calculate time ago
function calculateTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
}

// Helper function to calculate average response time
function calculateAvgResponseTime(statusData) {
    // This would need actual timestamps for when applications were reviewed
    // For now, returning a mock value
    return "2.1 days";
}