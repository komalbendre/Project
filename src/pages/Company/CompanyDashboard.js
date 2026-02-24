import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const CompanyDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [companyData, setCompanyData] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [internships, setInternships] = useState([]);
    const [applications, setApplications] = useState([]);
    const [quickStats, setQuickStats] = useState({
        todayApplications: 0,
        pendingReviews: 0,
        upcomingInterviewsCount: 0,
        newMessages: 3
    });
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    useEffect(() => {
        if (!token || !userRole) {
            navigate("/login");
            return;
        }

        if (userRole !== "company_admin" && userRole !== "company") {
            alert("Access denied. Company account required.");
            navigate("/dashboard");
            return;
        }

        fetchAllData();
    }, [token, userRole, navigate]);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            // Fetch company data
            const companyResponse = await axios.get(
                "http://localhost:5000/api/companies/my-company",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCompanyData(companyResponse.data.data);

            // Fetch internships with application counts
            await fetchInternships();

            // Fetch applications and stats
            await fetchApplications();

            // Fetch analytics/stats from dedicated endpoints
            await fetchAnalyticsData();

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalyticsData = async () => {
        try {
            // Get application statistics
            const statsResponse = await axios.get(
                "http://localhost:5000/api/applications/stats/company",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (statsResponse.data.success) {
                const stats = statsResponse.data.data;

                // Format analytics data for the dashboard
                setAnalyticsData({
                    overview: {
                        totalInternships: internships.length,
                        activeInternships: internships.filter(i => i.status === 'Open').length,
                        totalApplications: stats.overall?.totalApplications || 0,
                        interviewScheduled: applications.filter(app => app.interview?.scheduled).length,
                        hired: stats.overall?.accepted || 0,
                        conversionRate: stats.overall?.totalApplications > 0
                            ? `${((stats.overall?.accepted || 0) / stats.overall?.totalApplications * 100).toFixed(1)}%`
                            : "0%",
                        avgResponseTime: "2.5 days" // You'd need to calculate this from data
                    },
                    upcomingInterviews: applications
                        .filter(app => app.interview?.scheduled && new Date(app.interview.date) > new Date())
                        .slice(0, 5),
                    recentActivities: [] // You'd need to create an activity log
                });
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            // Fallback to calculating from applications data
            if (applications.length > 0) {
                setAnalyticsData({
                    overview: {
                        totalInternships: internships.length,
                        activeInternships: internships.filter(i => i.status === 'Open').length,
                        totalApplications: applications.length,
                        interviewScheduled: applications.filter(app => app.interview?.scheduled).length,
                        hired: applications.filter(app => app.status === 'accepted').length,
                        conversionRate: applications.length > 0
                            ? `${((applications.filter(app => app.status === 'accepted').length / applications.length) * 100).toFixed(1)}%`
                            : "0%",
                        avgResponseTime: "2.5 days"
                    },
                    upcomingInterviews: applications
                        .filter(app => app.interview?.scheduled && new Date(app.interview.date) > new Date())
                        .slice(0, 5),
                    recentActivities: []
                });
            }
        }
    };

    const fetchInternships = async () => {
        try {
            const internshipsResponse = await axios.get(
                "http://localhost:5000/api/companies/internships",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (internshipsResponse.data.success) {
                const internshipsData = internshipsResponse.data.data.map(internship => ({
                    ...internship,
                    id: internship._id,
                    title: internship.title,
                    applicants: internship.applicationCount || 0,
                    status: internship.status,
                    postedDate: new Date(internship.createdAt).toLocaleDateString()
                }));
                setInternships(internshipsData);
            }
        } catch (error) {
            console.error("Error fetching internships:", error);
        }
    };
    const fetchApplications = async () => {
        try {
            const applicationsResponse = await axios.get(
                "http://localhost:5000/api/applications/company",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (applicationsResponse.data.success) {
                const apps = applicationsResponse.data.data.map(app => ({
                    ...app,
                    id: app._id,
                    candidateName: app.fullName,
                    position: app.internship?.title || 'Unknown Position',
                    date: new Date(app.appliedDate).toLocaleDateString(),
                    appliedDate: app.appliedDate,
                    status: app.status,
                    score: app.score || 0,
                    interviewDate: app.interview?.date || null
                }));
                setApplications(apps);

                // Calculate quick stats from real data
                const today = new Date().toDateString();
                const todayApps = apps.filter(app =>
                    new Date(app.appliedDate).toDateString() === today
                ).length;

                const pendingApps = apps.filter(app =>
                    app.status === 'pending'
                ).length;

                const upcomingInterviews = apps.filter(app =>
                    app.interview?.scheduled && new Date(app.interview.date) > new Date()
                ).length;

                setQuickStats({
                    todayApplications: todayApps,
                    pendingReviews: pendingApps,
                    upcomingInterviewsCount: upcomingInterviews,
                    newMessages: 3 // You'd need a messages endpoint for this
                });
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const generateMockAnalytics = () => ({
        overview: {
            totalInternships: 0,
            activeInternships: 0,
            totalApplications: 0,
            interviewScheduled: 0,
            hired: 0,
            conversionRate: "0%",
            avgResponseTime: "0 days"
        },
        upcomingInterviews: [],
        recentActivities: []
    });

    const generateMockInternships = () => {
        return [];
    };

    const generateMockApplications = () => {
        return [];
    };

    // Function to generate calendar data
    const getInterviewCalendarData = () => {
        // Get interviews from applications that have scheduled interviews
        const interviewApplications = applications.filter(app => app.interview?.scheduled);

        // Group interviews by date
        const interviewsByDate = {};
        interviewApplications.forEach(app => {
            const interviewDate = new Date(app.interview.date);
            const dateKey = interviewDate.toISOString().split('T')[0];

            if (!interviewsByDate[dateKey]) {
                interviewsByDate[dateKey] = [];
            }
            interviewsByDate[dateKey].push(app);
        });

        // Get current month and year
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Generate calendar for current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        // Create calendar array
        const calendar = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendar.push({ day: null, hasInterview: false, interviewCount: 0 });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateKey = date.toISOString().split('T')[0];
            const hasInterview = interviewsByDate[dateKey];

            calendar.push({
                day,
                date: dateKey,
                hasInterview: !!hasInterview,
                interviewCount: hasInterview ? hasInterview.length : 0,
                isToday: date.toDateString() === new Date().toDateString(),
                isPast: date < new Date(new Date().setHours(0, 0, 0, 0))
            });
        }

        return {
            calendar,
            monthName: currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            totalInterviews: interviewApplications.length,
            upcomingInterviews: interviewApplications.filter(app => {
                const interviewDate = new Date(app.interview.date);
                return interviewDate >= new Date(new Date().setHours(0, 0, 0, 0));
            }).length
        };
    };

    // Updated color scheme: Black (structure), Blue (primary actions), White (background)
    const colors = {
        black: '#000000',
        blackLight: '#1a1a1a',
        blackLighter: '#333333',
        blue: '#0066cc',
        blueLight: '#4d94ff',
        blueLighter: '#e6f0ff',
        white: '#ffffff',
        whiteDark: '#f8f8f8',
        whiteDarker: '#f0f0f0',
        gray: '#666666',
        grayLight: '#999999',
        grayLighter: '#cccccc'
    };

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            background: colors.whiteDark,
            minHeight: "100vh",
            padding: "2rem 2rem 2rem 2rem",
        },
        card: {
            background: colors.white,
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        statCard: {
            background: colors.white,
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
        },
        statContent: {
            flex: 1,
        },
        statValue: {
            fontSize: "1.75rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
            color: colors.black,
        },
        statLabel: {
            fontSize: "0.875rem",
            color: colors.gray,
            fontWeight: 500,
        },
        statChange: {
            fontSize: "0.75rem",
            fontWeight: 600,
        },
        positiveChange: {
            color: colors.blue,
        },
        negativeChange: {
            color: "#ef4444", // Keeping red for negative changes
        },
        chartContainer: {
            height: "300px",
            marginTop: "1rem",
        },
        emptyState: {
            textAlign: "center",
            padding: "2rem",
            color: colors.gray,
        },
        primaryButton: {
            padding: "0.75rem 1.5rem",
            background: colors.blue,
            color: colors.white,
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        companyHeader: {
            background: colors.white,
            borderRadius: "12px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            border: `1px solid ${colors.grayLighter}`,
            position: "relative",
        },
        companyHeaderContent: {
            display: "flex",
            alignItems: "flex-start",
            gap: "2rem",
            flexWrap: "wrap",
        },
        companyLogoContainer: {
            width: "80px",
            height: "80px",
            minWidth: "80px",
            borderRadius: "10px",
            background: colors.whiteDark,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: `1px solid ${colors.grayLighter}`,
        },
        companyLogo: {
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: colors.black,
            fontFamily: "'Inter', sans-serif",
        },
        companyLogoImage: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
        },
        companyInfo: {
            flex: 1,
            minWidth: "300px",
        },
        companyHeaderTop: {
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
        },
        companyName: {
            fontSize: "clamp(1.5rem, 2vw, 2rem)",
            fontWeight: 700,
            color: colors.black,
            margin: 0,
            letterSpacing: "-0.5px",
        },
        verificationBadge: {
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.75rem",
            background: colors.blue,
            color: colors.white,
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
        },
        companyMetaGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            marginBottom: "1.25rem",
            paddingBottom: "1.25rem",
            borderBottom: `1px solid ${colors.grayLighter}`,
        },
        metaItem: {
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
        },
        metaIcon: {
            width: "24px",
            height: "24px",
            minWidth: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            color: colors.gray,
        },
        metaContent: {
            flex: 1,
        },
        metaLabel: {
            fontSize: "0.75rem",
            color: colors.gray,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "0.25rem",
        },
        metaValue: {
            fontSize: "0.875rem",
            fontWeight: 500,
            color: colors.black,
        },
        companyDescription: {
            color: colors.gray,
            fontSize: "0.875rem",
            lineHeight: 1.6,
            maxWidth: "800px",
            marginBottom: "1.5rem",
            padding: "1rem",
            background: colors.whiteDark,
            borderRadius: "6px",
            borderLeft: `3px solid ${colors.blue}`,
        },
        headerActions: {
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
        },
        actionButton: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "0.875rem",
            border: "1px solid",
        },
        primaryAction: {
            background: colors.blue,
            color: colors.white,
            borderColor: colors.blue,
        },
        secondaryAction: {
            background: colors.white,
            color: colors.black,
            borderColor: colors.grayLighter,
        },
        actionIcon: {
            fontSize: "0.875rem",
        },
        memberSince: {
            marginTop: "1rem",
            fontSize: "0.75rem",
            color: colors.grayLight,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
        },
        loadingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
        },
        loadingSpinner: {
            width: "50px",
            height: "50px",
            border: `5px solid ${colors.grayLighter}`,
            borderTop: `5px solid ${colors.blue}`,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },
        link: {
            color: colors.blue,
            textDecoration: 'none',
            fontWeight: 500,
        }
    };

    const stats = [
        {
            value: analyticsData?.overview?.totalInternships || internships.length || 0,
            label: "Total Internships",
            action: () => navigate("/company/internships")
        },
        {
            value: analyticsData?.overview?.activeInternships || internships.filter(i => i.status === 'Open').length || 0,
            label: "Active Internships",
            action: () => navigate("/company/internships?status=active")
        },
        {
            value: analyticsData?.overview?.totalApplications || applications.length || 0,
            label: "Total Applications",
            action: () => navigate("/company/applications")
        },
        {
            value: analyticsData?.overview?.interviewScheduled || applications.filter(app => app.interview?.scheduled).length || 0,
            label: "Interviews",
            action: () => navigate("/company/interviews")
        },
    ];

    const handleViewCandidate = (candidateId) => {
        navigate(`/company/candidates/${candidateId}`);
    };

    const handleViewApplication = (applicationId) => {
        navigate(`/company/applications/${applicationId}`);
    };

    const handleScheduleInterview = (candidateId) => {
        navigate(`/company/interviews/schedule/${candidateId}`);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p style={{ marginLeft: "1rem", color: colors.gray }}>Loading company dashboard...</p>
                </div>
            </div>
        );
    }

    // Prepare data for Applicants per Internship chart
    const applicantsPerInternship = internships.map(internship => ({
        name: internship.title || internship.position || 'Unnamed Internship',
        applicants: internship.applicants || 0,
        color: colors.blue
    }));

    // Prepare data for Interview Status pie chart
    const interviewStatusData = [
        {
            name: 'Scheduled',
            value: applications.filter(app => app.interview?.scheduled && !app.interview?.feedback).length,
            color: '#f59e0b'
        },
        {
            name: 'Completed',
            value: applications.filter(app => app.interview?.feedback).length,
            color: colors.blue
        },
        {
            name: 'Selected',
            value: applications.filter(app => app.status === 'accepted').length,
            color: '#8b5cf6'
        },
        {
            name: 'Rejected',
            value: applications.filter(app => app.status === 'rejected').length,
            color: '#ef4444'
        },
        {
            name: 'Pending',
            value: applications.filter(app => app.status === 'pending').length,
            color: colors.gray
        }
    ].filter(item => item.value > 0);

    return (
        <div style={styles.container}>
            <style>{`
                .action-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .primary-action:hover {
                    background: ${colors.blueLight};
                }
                
                .secondary-action:hover {
                    background: ${colors.whiteDark};
                }
                
                .stat-card:hover {
                    border-color: ${colors.blue};
                }
                
                a:hover {
                    color: ${colors.blueLight};
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* Professional Company Header */}
            <div style={styles.companyHeader}>
                <div style={styles.companyHeaderContent}>
                    {/* Company Logo */}
                    <div style={styles.companyLogoContainer}>
                        {companyData?.logo ? (
                            <img
                                src={companyData.logo}
                                alt={companyData.companyName}
                                style={styles.companyLogoImage}
                            />
                        ) : (
                            <div style={styles.companyLogo}>
                                {companyData?.companyName?.charAt(0) || 'C'}
                            </div>
                        )}
                    </div>

                    {/* Company Information */}
                    <div style={styles.companyInfo}>
                        {/* Top Row: Name & Status */}
                        <div style={styles.companyHeaderTop}>
                            <h1 style={styles.companyName}>
                                {companyData?.companyName || "Company Name"}
                            </h1>

                            <span style={styles.verificationBadge}>
                                {companyData?.status === 'approved' ? 'Verified' :
                                    companyData?.status === 'rejected' ? 'Not Verified' :
                                        'Pending Verification'}
                            </span>
                        </div>

                        {/* Company Metadata Grid */}
                        <div style={styles.companyMetaGrid}>
                            {companyData?.industry && (
                                <div style={styles.metaItem}>
                                    <div style={styles.metaIcon}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div style={styles.metaContent}>
                                        <div style={styles.metaLabel}>Industry</div>
                                        <div style={styles.metaValue}>{companyData.industry}</div>
                                    </div>
                                </div>
                            )}

                            {(companyData?.city || companyData?.country) && (
                                <div style={styles.metaItem}>
                                    <div style={styles.metaIcon}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div style={styles.metaContent}>
                                        <div style={styles.metaLabel}>Location</div>
                                        <div style={styles.metaValue}>
                                            {[companyData.city, companyData.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {companyData?.contactEmail && (
                                <div style={styles.metaItem}>
                                    <div style={styles.metaIcon}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div style={styles.metaContent}>
                                        <div style={styles.metaLabel}>Contact Email</div>
                                        <div style={styles.metaValue}>{companyData.contactEmail}</div>
                                    </div>
                                </div>
                            )}

                            {companyData?.phoneNo && (
                                <div style={styles.metaItem}>
                                    <div style={styles.metaIcon}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div style={styles.metaContent}>
                                        <div style={styles.metaLabel}>Phone</div>
                                        <div style={styles.metaValue}>{companyData.phoneNo}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Company Description */}
                        {companyData?.description && (
                            <div style={styles.companyDescription}>
                                {companyData.description}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={styles.headerActions}>
                            <button
                                style={{ ...styles.actionButton, ...styles.secondaryAction }}
                                onClick={() => navigate("/company/edit-profile")}
                                className="action-button secondary-action"
                            >
                                <span style={styles.actionIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                </span>
                                Edit Profile
                            </button>

                            <button
                                style={{ ...styles.actionButton, ...styles.primaryAction }}
                                onClick={() => navigate("/company/internships/create")}
                                className="action-button primary-action"
                            >
                                <span style={styles.actionIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                </span>
                                Post New Internship
                            </button>

                            <button
                                style={{ ...styles.actionButton, ...styles.secondaryAction }}
                                onClick={() => navigate("/company/analytics")}
                                className="action-button secondary-action"
                            >
                                <span style={styles.actionIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                                        <path d="M22 12A10 10 0 0 0 12 2v10z" />
                                    </svg>
                                </span>
                                View Analytics
                            </button>
                        </div>

                        {/* Member Since */}
                        {companyData?.createdAt && (
                            <div style={styles.memberSince}>
                                <span>Member since {new Date(companyData.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Analytics Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        style={styles.statCard}
                        className="stat-card"
                        onClick={stat.action}
                    >
                        <div style={styles.statContent}>
                            <div style={styles.statValue}>{stat.value}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                            {/* <div style={{
                                ...styles.statChange,
                                ...(stat.change.startsWith('+') ? styles.positiveChange : styles.negativeChange)
                            }}> */}
                            {/* {stat.change} from last month */}
                            {/* </div> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Dashboard Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Charts Row */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                    {/* Left Column - Applicants per Internship */}
                    <div style={styles.card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ color: colors.black }}>Applicants per Internship</h3>
                            <button
                                style={{
                                    padding: "0.5rem 1rem",
                                    background: colors.blue,
                                    color: colors.white,
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s ease"
                                }}
                                onClick={() => navigate("/company/internships")}
                                onMouseEnter={(e) => e.target.style.background = colors.blueLight}
                                onMouseLeave={(e) => e.target.style.background = colors.blue}
                            >
                                View All
                                <span style={{ fontSize: "1rem" }}>→</span>
                            </button>
                        </div>
                        <div style={styles.chartContainer}>
                            {applicantsPerInternship.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={applicantsPerInternship}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grayLighter} />
                                        <XAxis
                                            dataKey="name"
                                            stroke={colors.gray}
                                            angle={-45}
                                            textAnchor="end"
                                            height={60}
                                            fontSize={12}
                                        />
                                        <YAxis stroke={colors.gray} />
                                        <Tooltip
                                            formatter={(value) => [`${value} applicants`, 'Count']}
                                            labelFormatter={(label) => `Internship: ${label}`}
                                        />
                                        <Bar
                                            dataKey="applicants"
                                            radius={[4, 4, 0, 0]}
                                            fill={colors.blue}
                                        >
                                            {applicantsPerInternship.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={styles.emptyState}>
                                    <p>No internships posted yet. Applications data will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Interview Status */}
                    <div style={styles.card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ color: colors.black }}>Interview Status</h3>
                            <button
                                style={{
                                    padding: "0.5rem 1rem",
                                    background: colors.blue,
                                    color: colors.white,
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s ease"
                                }}
                                onClick={() => navigate("/company/applications")}
                                onMouseEnter={(e) => e.target.style.background = colors.blueLight}
                                onMouseLeave={(e) => e.target.style.background = colors.blue}
                            >
                                View Details
                                <span style={{ fontSize: "1rem" }}>→</span>
                            </button>
                        </div>
                        <div style={styles.chartContainer}>
                            {interviewStatusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={interviewStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {interviewStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name, props) => [
                                                `${value} ${value === 1 ? 'candidate' : 'candidates'}`,
                                                props.payload.name
                                            ]}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={styles.emptyState}>
                                    <p>No interview data available yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                    {/* Interview Calendar */}
                    <div style={styles.card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ color: colors.black }}>Interview Calendar</h3>
                            <button
                                style={{
                                    padding: "0.5rem 1rem",
                                    background: colors.blue,
                                    color: colors.white,
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s ease"
                                }}
                                onClick={() => navigate("/company/interviews")}
                                onMouseEnter={(e) => e.target.style.background = colors.blueLight}
                                onMouseLeave={(e) => e.target.style.background = colors.blue}
                            >
                                Schedule Interview
                                <span style={{ fontSize: "1rem" }}>→</span>
                            </button>
                        </div>

                        {(() => {
                            const calendarData = getInterviewCalendarData();

                            return (
                                <div>
                                    {/* Calendar Header */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1rem',
                                        padding: '0.75rem',
                                        background: colors.whiteDark,
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 600, color: colors.black }}>
                                            {calendarData.monthName}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    background: colors.whiteDarker,
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    color: colors.black
                                                }}
                                                onClick={() => alert('Previous month')}
                                            >
                                                ←
                                            </button>
                                            <button
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    background: colors.whiteDarker,
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    color: colors.black
                                                }}
                                                onClick={() => alert('Next month')}
                                            >
                                                →
                                            </button>
                                        </div>
                                    </div>

                                    {/* Calendar Stats */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '0.75rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '0.75rem',
                                            background: colors.blueLighter,
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.blueLighter}`
                                        }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.blue }}>
                                                {calendarData.totalInterviews}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: colors.black, marginTop: '0.25rem' }}>
                                                Total Scheduled
                                            </div>
                                        </div>
                                        <div style={{
                                            textAlign: 'center',
                                            padding: '0.75rem',
                                            background: colors.blueLighter,
                                            borderRadius: '8px',
                                            border: `1px solid ${colors.blueLighter}`
                                        }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.blue }}>
                                                {calendarData.upcomingInterviews}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: colors.black, marginTop: '0.25rem' }}>
                                                Upcoming
                                            </div>
                                        </div>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        {/* Weekday headers */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(7, 1fr)',
                                            gap: '0.25rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                                <div key={day} style={{
                                                    textAlign: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    color: colors.gray,
                                                    padding: '0.25rem'
                                                }}>
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar days */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(7, 1fr)',
                                            gap: '0.25rem'
                                        }}>
                                            {calendarData.calendar.map((dayData, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        aspectRatio: '1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '6px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: dayData.isToday ? 600 : 400,
                                                        background: dayData.isToday ? colors.blue :
                                                            dayData.hasInterview ? (dayData.isPast ? '#fee2e2' : colors.blueLighter) :
                                                                dayData.day === null ? 'transparent' :
                                                                    dayData.isPast ? colors.whiteDark : colors.white,
                                                        color: dayData.isToday ? colors.white :
                                                            dayData.hasInterview ? (dayData.isPast ? '#991b1b' : colors.blue) :
                                                                dayData.isPast ? colors.grayLight : colors.black,
                                                        border: dayData.hasInterview ? `2px solid ${dayData.isPast ? '#fca5a5' : colors.blueLight}` :
                                                            dayData.isToday ? 'none' :
                                                                dayData.day === null ? 'none' : `1px solid ${colors.grayLighter}`,
                                                        cursor: dayData.day ? 'pointer' : 'default',
                                                        position: 'relative'
                                                    }}
                                                    onClick={() => {
                                                        if (dayData.day && dayData.hasInterview) {
                                                            alert(`${dayData.interviewCount} interview${dayData.interviewCount !== 1 ? 's' : ''} scheduled on ${dayData.date}`);
                                                        }
                                                    }}
                                                    title={dayData.hasInterview ?
                                                        `${dayData.interviewCount} interview${dayData.interviewCount !== 1 ? 's' : ''} scheduled` :
                                                        'No interviews scheduled'}
                                                >
                                                    {dayData.day && (
                                                        <>
                                                            <div>{dayData.day}</div>
                                                            {dayData.hasInterview && (
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    bottom: '2px',
                                                                    display: 'flex',
                                                                    gap: '1px'
                                                                }}>
                                                                    {[...Array(Math.min(dayData.interviewCount, 3))].map((_, i) => (
                                                                        <div key={i} style={{
                                                                            width: '4px',
                                                                            height: '4px',
                                                                            borderRadius: '50%',
                                                                            background: dayData.isPast ? '#dc2626' : colors.blue
                                                                        }} />
                                                                    ))}
                                                                    {dayData.interviewCount > 3 && (
                                                                        <div style={{
                                                                            fontSize: '0.5rem',
                                                                            color: dayData.isPast ? '#dc2626' : colors.blue,
                                                                            fontWeight: 600
                                                                        }}>
                                                                            +{dayData.interviewCount - 3}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Calendar Legend */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '1rem',
                                        fontSize: '0.75rem',
                                        color: colors.gray
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <div style={{ width: '12px', height: '12px', background: colors.blue, borderRadius: '2px' }} />
                                            <span>Today</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <div style={{ width: '12px', height: '12px', background: colors.blueLighter, border: `1px solid ${colors.blueLight}`, borderRadius: '2px' }} />
                                            <span>Upcoming Interview</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <div style={{ width: '12px', height: '12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '2px' }} />
                                            <span>Past Interview</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Recent Applications Preview */}
                    <div style={styles.card}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h3 style={{ color: colors.black }}>Recent Applications</h3>
                            <button
                                style={{
                                    padding: "0.5rem 1rem",
                                    background: colors.blue,
                                    color: colors.white,
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    transition: "all 0.2s ease"
                                }}
                                onClick={() => navigate("/company/applications")}
                                onMouseEnter={(e) => e.target.style.background = colors.blueLight}
                                onMouseLeave={(e) => e.target.style.background = colors.blue}
                            >
                                View All
                                <span style={{ fontSize: "1rem" }}>→</span>
                            </button>
                        </div>
                        {applications.length > 0 ? (
                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {applications.slice(0, 5).map((app, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0',
                                        borderBottom: index < 4 ? `1px solid ${colors.grayLighter}` : 'none'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 500, fontSize: '0.875rem', color: colors.black }}>
                                                {app.candidateName || app.candidate || 'Unknown Candidate'}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: colors.gray }}>
                                                {app.position}
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '0.25rem 0.5rem',
                                            background: app.status === 'Pending' ? '#fef3c7' :
                                                app.status === 'Interview Scheduled' ? colors.blueLighter :
                                                    app.status === 'Hired' ? '#d1fae5' :
                                                        app.status === 'Rejected' ? '#fee2e2' : colors.whiteDark,
                                            color: app.status === 'Pending' ? '#92400e' :
                                                app.status === 'Interview Scheduled' ? colors.blue :
                                                    app.status === 'Hired' ? '#065f46' :
                                                        app.status === 'Rejected' ? '#991b1b' : colors.black,
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}>
                                            {app.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={styles.emptyState}>
                                <p>No applications received yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: "3rem",
                paddingTop: "2rem",
                borderTop: `1px solid ${colors.grayLighter}`,
                color: colors.gray,
                fontSize: "0.875rem",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <div>
                            <div style={{ fontWeight: 600, color: colors.black, marginBottom: "0.25rem" }}>
                                {companyData?.companyName || "Your Company"}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: colors.gray }}>
                                Company Dashboard • v2.1.0
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "1.5rem" }}>
                            <a href="#" style={{ color: colors.gray, textDecoration: "none", fontSize: "0.75rem" }}>
                                Privacy Policy
                            </a>
                            <a href="#" style={{ color: colors.gray, textDecoration: "none", fontSize: "0.75rem" }}>
                                Terms of Service
                            </a>
                            <a href="#" style={{ color: colors.gray, textDecoration: "none", fontSize: "0.75rem" }}>
                                Help Center
                            </a>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ fontSize: "0.75rem", color: colors.gray }}>
                            © {new Date().getFullYear()} CareerSync. All rights reserved.
                        </div>
                        <div style={{
                            padding: "0.25rem 0.75rem",
                            background: colors.whiteDark,
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            color: colors.gray
                        }}>
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;