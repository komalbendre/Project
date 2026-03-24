import React, { useState, useEffect } from "react";
import axios from "axios";

// Simple SVG Icons
const IconUsers = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconBuilding = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="9" y1="8" x2="10" y2="8" />
        <line x1="14" y1="8" x2="15" y2="8" />
        <line x1="9" y1="12" x2="10" y2="12" />
        <line x1="14" y1="12" x2="15" y2="12" />
    </svg>
);

const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const IconCheckCircle = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const IconTrendUp = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

const IconDownload = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const IconRefresh = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 4v6h-6M1 20v-6h6" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
);

const IconCalendar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("30");
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        pendingApprovals: 0,
        activeCompanies: 0,
        activeUsers: 0,
        completionRate: 0,
        avgDailyRegistrations: 0,
        userTrend: [],
        companyTrend: [],
        userRoles: { user: 0, company_admin: 0, admin: 0 },
        topIndustries: []
    });
    
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            
            const usersResponse = await axios.get("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const companiesResponse = await axios.get("http://localhost:5000/api/admin/companies", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const users = Array.isArray(usersResponse.data) ? usersResponse.data : 
                         (usersResponse.data.data || []);
            const companies = Array.isArray(companiesResponse.data) ? companiesResponse.data : 
                            (companiesResponse.data.data || []);
            
            // Calculate stats
            const totalUsers = users.length;
            const totalCompanies = companies.length;
            const pendingApprovals = companies.filter(c => c.status === 'pending').length;
            const activeCompanies = companies.filter(c => c.status === 'approved').length;
            const activeUsers = users.filter(u => u.isActive === true).length;
            
            const profilesCompleted = users.filter(u => u.profileCompleted === true).length;
            const completionRate = totalUsers > 0 ? ((profilesCompleted / totalUsers) * 100).toFixed(1) : 0;
            
            // Calculate avg daily registrations
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - parseInt(dateRange));
            const usersInRange = users.filter(u => new Date(u.createdAt) >= thirtyDaysAgo);
            const avgDailyRegistrations = (usersInRange.length / parseInt(dateRange)).toFixed(1);
            
            // Get simple trend summary (just the last 7 days for summary)
            const userTrend = getTrendSummary(users, 7);
            const companyTrend = getTrendSummary(companies, 7);
            
            // User roles
            const userRoles = {
                user: users.filter(u => u.role === 'user').length,
                company_admin: users.filter(u => u.role === 'company_admin').length,
                admin: users.filter(u => u.role === 'admin').length
            };
            
            // Top industries
            const industryMap = new Map();
            companies.forEach(company => {
                if (company.industry) {
                    industryMap.set(company.industry, (industryMap.get(company.industry) || 0) + 1);
                }
            });
            const topIndustries = Array.from(industryMap.entries())
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);
            
            setAnalytics({
                totalUsers,
                totalCompanies,
                pendingApprovals,
                activeCompanies,
                activeUsers,
                completionRate,
                avgDailyRegistrations,
                userTrend,
                companyTrend,
                userRoles,
                topIndustries
            });
            
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const getTrendSummary = (items, days) => {
        const now = new Date();
        let total = 0;
        
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);
            
            total += items.filter(item => {
                const createdAt = new Date(item.createdAt);
                return createdAt >= date && createdAt < nextDate;
            }).length;
        }
        
        return {
            total,
            average: (total / days).toFixed(1)
        };
    };
    
    const exportReport = () => {
        let csv = "Platform Analytics Report\n\n";
        csv += `Generated on,${new Date().toLocaleString()}\n`;
        csv += `Date Range,Last ${dateRange} days\n\n`;
        
        csv += "USER STATISTICS\n";
        csv += `Total Users,${analytics.totalUsers}\n`;
        csv += `Active Users,${analytics.activeUsers}\n`;
        csv += `Inactive Users,${analytics.totalUsers - analytics.activeUsers}\n`;
        csv += `Profile Completion Rate,${analytics.completionRate}%\n`;
        csv += `Avg Daily Registrations (Last ${dateRange} days),${analytics.avgDailyRegistrations}\n`;
        csv += `New Users (Last 7 days),${analytics.userTrend.total}\n`;
        csv += `Avg Daily Users (Last 7 days),${analytics.userTrend.average}\n\n`;
        
        csv += "COMPANY STATISTICS\n";
        csv += `Total Companies,${analytics.totalCompanies}\n`;
        csv += `Approved Companies,${analytics.activeCompanies}\n`;
        csv += `Pending Approval,${analytics.pendingApprovals}\n`;
        csv += `Rejected Companies,${analytics.totalCompanies - analytics.activeCompanies - analytics.pendingApprovals}\n`;
        csv += `New Companies (Last 7 days),${analytics.companyTrend.total}\n`;
        csv += `Avg Daily Companies (Last 7 days),${analytics.companyTrend.average}\n\n`;
        
        csv += "USER ROLES\n";
        csv += `Regular Users,${analytics.userRoles.user}\n`;
        csv += `Company Admins,${analytics.userRoles.company_admin}\n`;
        csv += `Platform Admins,${analytics.userRoles.admin}\n\n`;
        
        csv += "TOP INDUSTRIES\n";
        analytics.topIndustries.forEach(industry => {
            csv += `${industry.name},${industry.count}\n`;
        });
        
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    
    const styles = {
        card: {
            background: "white",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            overflow: "hidden",
        },
        cardHeader: {
            padding: "20px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
        },
        cardTitle: {
            fontSize: "18px",
            fontWeight: 600,
            color: "#191919",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        filterBar: {
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
        },
        filterSelect: {
            padding: "8px 12px",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            fontSize: "14px",
            backgroundColor: "white",
            cursor: "pointer",
        },
        refreshButton: {
            padding: "8px 12px",
            background: "#0073b1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s ease",
        },
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
        },
        statCard: {
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
        },
        statHeader: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
        },
        statTitle: {
            fontSize: "13px",
            fontWeight: 500,
            color: "#6b7280",
        },
        statIcon: {
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        statValue: {
            fontSize: "28px",
            fontWeight: 700,
            color: "#191919",
            marginBottom: "4px",
        },
        statSub: {
            fontSize: "12px",
            color: "#10b981",
            display: "flex",
            alignItems: "center",
            gap: "4px",
        },
        twoColumnGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            marginBottom: "24px",
        },
        section: {
            background: "white",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            overflow: "hidden",
        },
        sectionHeader: {
            padding: "16px 20px",
            borderBottom: "1px solid #e0e0e0",
            fontSize: "16px",
            fontWeight: 600,
            color: "#191919",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        sectionContent: {
            padding: "20px",
        },
        trendCard: {
            background: "#f8fafc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid #e5e7eb",
        },
        trendTitle: {
            fontSize: "13px",
            fontWeight: 500,
            color: "#6b7280",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
        },
        trendValue: {
            fontSize: "24px",
            fontWeight: 700,
            color: "#191919",
            marginBottom: "4px",
        },
        trendSub: {
            fontSize: "12px",
            color: "#6b7280",
        },
        progressItem: {
            marginBottom: "16px",
        },
        progressLabel: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
            fontSize: "13px",
            color: "#374151",
        },
        progressBar: {
            background: "#f3f4f6",
            borderRadius: "8px",
            overflow: "hidden",
            height: "8px",
        },
        progressFill: {
            height: "100%",
            transition: "width 0.5s ease",
            borderRadius: "8px",
        },
        industryItem: {
            marginBottom: "12px",
        },
        industryName: {
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
            fontSize: "13px",
            color: "#374151",
        },
        industryBar: {
            background: "#f3f4f6",
            borderRadius: "4px",
            overflow: "hidden",
            height: "4px",
        },
        loadingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
        },
        spinner: {
            width: "40px",
            height: "40px",
            border: "4px solid #f3f4f6",
            borderTop: "4px solid #0073b1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },
    };
    
    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <div style={styles.spinner}></div>
            </div>
        );
    }
    
    return (
        <div>
            {/* Header Card */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <h2 style={styles.cardTitle}>
                        <IconUsers />
                        Analytics & Reports
                    </h2>
                    <div style={styles.filterBar}>
                        <select
                            style={styles.filterSelect}
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="60">Last 60 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                        <button
                            style={styles.refreshButton}
                            onClick={fetchAnalytics}
                            onMouseEnter={(e) => e.target.style.background = "#005a8c"}
                            onMouseLeave={(e) => e.target.style.background = "#0073b1"}
                        >
                            <IconRefresh />
                            Refresh
                        </button>
                        <button
                            style={{...styles.refreshButton, background: "#10b981"}}
                            onClick={exportReport}
                            onMouseEnter={(e) => e.target.style.background = "#059669"}
                            onMouseLeave={(e) => e.target.style.background = "#10b981"}
                        >
                            <IconDownload />
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <span style={styles.statTitle}>Total Users</span>
                        <div style={{...styles.statIcon, background: "#eef2ff", color: "#3b82f6"}}>
                            <IconUsers />
                        </div>
                    </div>
                    <div style={styles.statValue}>{analytics.totalUsers}</div>
                    <div style={styles.statSub}>
                        <IconTrendUp />
                        {analytics.activeUsers} active
                    </div>
                </div>
                
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <span style={styles.statTitle}>Total Companies</span>
                        <div style={{...styles.statIcon, background: "#fef3c7", color: "#f59e0b"}}>
                            <IconBuilding />
                        </div>
                    </div>
                    <div style={styles.statValue}>{analytics.totalCompanies}</div>
                    <div style={styles.statSub}>
                        <IconTrendUp />
                        {analytics.activeCompanies} approved
                    </div>
                </div>
                
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <span style={styles.statTitle}>Pending Approvals</span>
                        <div style={{...styles.statIcon, background: "#fee2e2", color: "#ef4444"}}>
                            <IconClock />
                        </div>
                    </div>
                    <div style={styles.statValue}>{analytics.pendingApprovals}</div>
                    <div style={styles.statSub}>
                        Companies awaiting review
                    </div>
                </div>
                
                <div style={styles.statCard}>
                    <div style={styles.statHeader}>
                        <span style={styles.statTitle}>Profile Completion</span>
                        <div style={{...styles.statIcon, background: "#d1fae5", color: "#10b981"}}>
                            <IconCheckCircle />
                        </div>
                    </div>
                    <div style={styles.statValue}>{analytics.completionRate}%</div>
                    <div style={styles.statSub}>
                        {analytics.avgDailyRegistrations} avg daily registrations
                    </div>
                </div>
            </div>
            
            {/* User Roles & Industries */}
            <div style={styles.twoColumnGrid}>
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <IconUsers />
                        User Roles Distribution
                    </div>
                    <div style={styles.sectionContent}>
                        <div style={styles.progressItem}>
                            <div style={styles.progressLabel}>
                                <span>Regular Users</span>
                                <span>{analytics.userRoles.user}</span>
                            </div>
                            <div style={styles.progressBar}>
                                <div style={{
                                    ...styles.progressFill,
                                    width: `${(analytics.userRoles.user / analytics.totalUsers) * 100}%`,
                                    background: "#3b82f6"
                                }}></div>
                            </div>
                        </div>
                        <div style={styles.progressItem}>
                            <div style={styles.progressLabel}>
                                <span>Company Admins</span>
                                <span>{analytics.userRoles.company_admin}</span>
                            </div>
                            <div style={styles.progressBar}>
                                <div style={{
                                    ...styles.progressFill,
                                    width: `${(analytics.userRoles.company_admin / analytics.totalUsers) * 100}%`,
                                    background: "#f59e0b"
                                }}></div>
                            </div>
                        </div>
                        <div style={styles.progressItem}>
                            <div style={styles.progressLabel}>
                                <span>Platform Admins</span>
                                <span>{analytics.userRoles.admin}</span>
                            </div>
                            <div style={styles.progressBar}>
                                <div style={{
                                    ...styles.progressFill,
                                    width: `${(analytics.userRoles.admin / analytics.totalUsers) * 100}%`,
                                    background: "#ef4444"
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <IconBuilding />
                        Top Industries
                    </div>
                    <div style={styles.sectionContent}>
                        {analytics.topIndustries.map((industry, index) => (
                            <div key={index} style={styles.industryItem}>
                                <div style={styles.industryName}>
                                    <span>{industry.name}</span>
                                    <span>{industry.count}</span>
                                </div>
                                <div style={styles.industryBar}>
                                    <div style={{
                                        width: `${(industry.count / analytics.totalCompanies) * 100}%`,
                                        height: "4px",
                                        background: "#10b981",
                                        borderRadius: "4px"
                                    }}></div>
                                </div>
                            </div>
                        ))}
                        {analytics.topIndustries.length === 0 && (
                            <p style={{ color: "#9ca3af", textAlign: "center" }}>No companies registered yet</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Recent Activity Summary */}
            <div style={styles.twoColumnGrid}>
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <IconCalendar />
                        User Activity (Last 7 Days)
                    </div>
                    <div style={styles.sectionContent}>
                        <div style={styles.trendCard}>
                            <div style={styles.trendTitle}>
                                <IconUsers />
                                New Users
                            </div>
                            <div style={styles.trendValue}>{analytics.userTrend.total}</div>
                            <div style={styles.trendSub}>
                                Average {analytics.userTrend.average} per day
                            </div>
                        </div>
                        <div style={styles.trendCard}>
                            <div style={styles.trendTitle}>
                                <IconTrendUp />
                                Growth Rate
                            </div>
                            <div style={styles.trendValue}>
                                {((analytics.userTrend.total / analytics.totalUsers) * 100).toFixed(1)}%
                            </div>
                            <div style={styles.trendSub}>
                                of total users joined in last 7 days
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <IconCalendar />
                        Company Activity (Last 7 Days)
                    </div>
                    <div style={styles.sectionContent}>
                        <div style={styles.trendCard}>
                            <div style={styles.trendTitle}>
                                <IconBuilding />
                                New Companies
                            </div>
                            <div style={styles.trendValue}>{analytics.companyTrend.total}</div>
                            <div style={styles.trendSub}>
                                Average {analytics.companyTrend.average} per day
                            </div>
                        </div>
                        <div style={styles.trendCard}>
                            <div style={styles.trendTitle}>
                                <IconTrendUp />
                                Growth Rate
                            </div>
                            <div style={styles.trendValue}>
                                {((analytics.companyTrend.total / analytics.totalCompanies) * 100).toFixed(1)}%
                            </div>
                            <div style={styles.trendSub}>
                                of total companies joined in last 7 days
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;