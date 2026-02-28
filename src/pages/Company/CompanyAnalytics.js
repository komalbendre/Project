import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios";

// SVG Icons Component
const Icons = {
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Refresh: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  TrendingUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8 10 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Activity: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
};

const CompanyAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [timeRange, setTimeRange] = useState("6");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem("token");
            
            // Fetch analytics data from backend
            const response = await axios.get(
                `http://localhost:5000/api/analytics/company?months=${timeRange}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setAnalyticsData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setError("Failed to load analytics data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        // Create CSV content
        const headers = ['Metric', 'Value'];
        const rows = [
            ['Total Internships', analyticsData?.overview.totalInternships || 0],
            ['Active Internships', analyticsData?.overview.activeInternships || 0],
            ['Total Applications', analyticsData?.overview.totalApplications || 0],
            ['Interviews Scheduled', analyticsData?.overview.interviewScheduled || 0],
            ['Total Hires', analyticsData?.overview.hired || 0],
            ['Conversion Rate', analyticsData?.overview.conversionRate || '0%'],
            ['Avg Response Time', analyticsData?.overview.avgResponseTime || '0'],
            ['Avg Time to Hire', analyticsData?.overview.avgTimeToHire || '0']
        ];

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f59e0b',
            reviewed: '#3b82f6',
            shortlisted: '#8b5cf6',
            accepted: '#10b981',
            rejected: '#ef4444',
            withdrawn: '#6b7280'
        };
        return colors[status.toLowerCase()] || '#64748b';
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6b7280'];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={styles.customTooltip}>
                    <p style={styles.tooltipLabel}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, margin: '4px 0' }}>
                            <span style={{ fontWeight: 600 }}>{entry.name}:</span> {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderOverviewStats = () => {
        if (!analyticsData) return null;

        const stats = [
            { 
                label: "Total Internships", 
                value: analyticsData.overview.totalInternships, 
                icon: <Icons.Briefcase />,
                color: "#3b82f6",
                bgColor: "#dbeafe",
                subtext: `${analyticsData.overview.activeInternships} active`
            },
            { 
                label: "Total Applications", 
                value: analyticsData.overview.totalApplications, 
                icon: <Icons.Users />,
                color: "#10b981",
                bgColor: "#d1fae5",
                subtext: `${analyticsData.overview.interviewScheduled} interviews`
            },
            { 
                label: "Total Hires", 
                value: analyticsData.overview.hired, 
                icon: <Icons.Check />,
                color: "#8b5cf6",
                bgColor: "#ede9fe",
                subtext: `${analyticsData.overview.conversionRate} conversion`
            },
            { 
                label: "Response Time", 
                value: analyticsData.overview.avgResponseTime, 
                icon: <Icons.Clock />,
                color: "#f59e0b",
                bgColor: "#fef3c7",
                subtext: `Hire time: ${analyticsData.overview.avgTimeToHire}`
            }
        ];

        return stats.map((stat, index) => (
            <div key={index} style={styles.statCard}>
                <div style={{ ...styles.statIcon, background: stat.bgColor, color: stat.color }}>
                    {stat.icon}
                </div>
                <div style={styles.statContent}>
                    <div style={styles.statValue}>{stat.value}</div>
                    <div style={styles.statLabel}>{stat.label}</div>
                    <div style={styles.statSubtext}>{stat.subtext}</div>
                </div>
            </div>
        ));
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
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading analytics data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.errorContainer}>
                    <div style={styles.errorIcon}>⚠️</div>
                    <h3 style={styles.errorTitle}>Something went wrong</h3>
                    <p style={styles.errorText}>{error}</p>
                    <button 
                        style={styles.retryButton}
                        onClick={fetchAnalyticsData}
                    >
                        <Icons.Refresh />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!analyticsData) {
        return null;
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Analytics Dashboard</h1>
                    <p style={styles.subtitle}>
                        Detailed insights into your hiring performance and recruitment metrics
                    </p>
                </div>
                <div style={styles.headerActions}>
                    <div style={styles.timeRangeSelector}>
                        <button
                            style={{
                                ...styles.timeRangeButton,
                                ...(timeRange === "3" && styles.activeTimeRange)
                            }}
                            onClick={() => setTimeRange("3")}
                        >
                            3 Months
                        </button>
                        <button
                            style={{
                                ...styles.timeRangeButton,
                                ...(timeRange === "6" && styles.activeTimeRange)
                            }}
                            onClick={() => setTimeRange("6")}
                        >
                            6 Months
                        </button>
                        <button
                            style={{
                                ...styles.timeRangeButton,
                                ...(timeRange === "12" && styles.activeTimeRange)
                            }}
                            onClick={() => setTimeRange("12")}
                        >
                            12 Months
                        </button>
                    </div>
                    <button 
                        style={styles.exportButton}
                        onClick={handleExport}
                    >
                        <Icons.Download />
                        Export
                    </button>
                    <button 
                        style={styles.refreshButton}
                        onClick={fetchAnalyticsData}
                    >
                        <Icons.Refresh />
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div style={styles.statsGrid}>
                {renderOverviewStats()}
            </div>

            {/* Main Charts Grid */}
            <div style={styles.grid}>
                {/* Applications Trend Chart */}
                <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                            <Icons.Activity />
                            Applications & Hiring Trend
                        </h3>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                                data={analyticsData.applicationsTrend}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="applicationsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="interviewsGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="hiresGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="month" 
                                    stroke="#6b7280"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <YAxis 
                                    stroke="#6b7280"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area 
                                    type="monotone" 
                                    dataKey="applications" 
                                    stroke="#3b82f6" 
                                    fill="url(#applicationsGradient)" 
                                    name="Applications"
                                    strokeWidth={2}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="interviews" 
                                    stroke="#10b981" 
                                    fill="url(#interviewsGradient)" 
                                    name="Interviews"
                                    strokeWidth={2}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="hires" 
                                    stroke="#8b5cf6" 
                                    fill="url(#hiresGradient)" 
                                    name="Hires"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Applications by Status (Pie Chart) */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                            Applications by Status
                        </h3>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.applicationsByStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="count"
                                >
                                    {analyticsData.applicationsByStatus?.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={getStatusColor(entry._id)} 
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend 
                                    layout="vertical" 
                                    verticalAlign="middle" 
                                    align="right"
                                    formatter={(value, entry) => {
                                        const data = analyticsData.applicationsByStatus?.find(
                                            item => item._id === value.toLowerCase()
                                        );
                                        return `${value} (${data?.count || 0})`;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Demand Chart */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                            Top Skills in Demand
                        </h3>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={analyticsData.skillDemand}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                                <XAxis 
                                    type="number" 
                                    stroke="#6b7280"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <YAxis 
                                    type="category" 
                                    dataKey="skill" 
                                    stroke="#6b7280"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    width={80}
                                />
                                <Tooltip />
                                <Bar 
                                    dataKey="demand" 
                                    fill="#3b82f6" 
                                    name="Demand Score"
                                    radius={[0, 4, 4, 0]}
                                />
                                <Bar 
                                    dataKey="applicants" 
                                    fill="#10b981" 
                                    name="Applicants"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Internship Performance Chart */}
                <div style={{ ...styles.card, gridColumn: 'span 2' }}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                            <Icons.Briefcase />
                            Internship Performance
                        </h3>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={analyticsData.applicationsByInternship}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="title" 
                                    stroke="#6b7280"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    angle={-15}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis 
                                    stroke="#6b7280"
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar 
                                    dataKey="applications" 
                                    fill="#3b82f6" 
                                    name="Applications"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar 
                                    dataKey="interviews" 
                                    fill="#10b981" 
                                    name="Interviews"
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar 
                                    dataKey="hires" 
                                    fill="#8b5cf6" 
                                    name="Hires"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Candidate Sources */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                            Candidate Sources
                        </h3>
                    </div>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.candidateSources}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="count"
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                >
                                    {analyticsData.candidateSources?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                            Recent Activities
                        </h3>
                    </div>
                    <div style={styles.activitiesList}>
                        {analyticsData.recentActivities?.map((activity) => (
                            <div key={activity.id} style={styles.activityItem}>
                                <div style={{
                                    ...styles.activityIcon,
                                    background: activity.type === 'application' ? '#dbeafe' :
                                               activity.type === 'interview' ? '#d1fae5' :
                                               activity.type === 'hire' ? '#ede9fe' :
                                               activity.type === 'shortlist' ? '#fef3c7' : '#fee2e2'
                                }}>
                                    {activity.type === 'application' && '📥'}
                                    {activity.type === 'interview' && '📅'}
                                    {activity.type === 'hire' && '✅'}
                                    {activity.type === 'shortlist' && '⭐'}
                                    {activity.type === 'review' && '📋'}
                                    {activity.type === 'rejection' && '❌'}
                                </div>
                                <div style={styles.activityContent}>
                                    <div style={styles.activityAction}>{activity.action}</div>
                                    <div style={styles.activityDetails}>
                                        <span style={styles.activityCandidate}>{activity.candidate}</span>
                                        <span style={styles.activityPosition}>{activity.position}</span>
                                    </div>
                                    <div style={styles.activityTime}>{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Internship Performance Table */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Internship Performance Details</h3>
                </div>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.tableHeaderCell}>Internship Title</th>
                                <th style={styles.tableHeaderCell}>Applications</th>
                                <th style={styles.tableHeaderCell}>Interviews</th>
                                <th style={styles.tableHeaderCell}>Hires</th>
                                <th style={styles.tableHeaderCell}>Conversion Rate</th>
                                <th style={styles.tableHeaderCell}>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analyticsData.applicationsByInternship?.map((item, index) => {
                                const conversion = ((item.hires / (item.applications || 1)) * 100).toFixed(1);
                                const isGood = parseFloat(conversion) >= 5;
                                
                                return (
                                    <tr key={index}>
                                        <td style={styles.tableCell}>
                                            <div style={{ fontWeight: 500 }}>{item.title}</div>
                                        </td>
                                        <td style={styles.tableCell}>{item.applications}</td>
                                        <td style={styles.tableCell}>{item.interviews}</td>
                                        <td style={styles.tableCell}>{item.hires}</td>
                                        <td style={styles.tableCell}>{conversion}%</td>
                                        <td style={styles.tableCell}>
                                            <span style={{
                                                ...styles.badge,
                                                background: isGood ? '#d1fae5' : '#fee2e2',
                                                color: isGood ? '#065f46' : '#991b1b'
                                            }}>
                                                {isGood ? 'Good' : 'Needs Improvement'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "2rem",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem",
    },
    title: {
        fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
        fontWeight: 800,
        color: "#2d3748",
        marginBottom: "0.5rem",
    },
    subtitle: {
        color: "#718096",
        fontSize: "1.125rem",
    },
    headerActions: {
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
    },
    timeRangeSelector: {
        display: "flex",
        gap: "0.5rem",
        background: "white",
        padding: "0.5rem",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    timeRangeButton: {
        padding: "0.5rem 1rem",
        border: "none",
        background: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: 500,
        transition: "all 0.2s ease",
    },
    activeTimeRange: {
        background: "#10b981",
        color: "white",
    },
    exportButton: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "0.875rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    refreshButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem",
        background: "white",
        color: "#374151",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "1.5rem",
        marginBottom: "2rem",
    },
    statCard: {
        background: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        transition: "all 0.3s ease",
    },
    statIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: "1.75rem",
        fontWeight: 700,
        color: "#2d3748",
        marginBottom: "0.25rem",
    },
    statLabel: {
        fontSize: "0.875rem",
        color: "#6b7280",
        fontWeight: 500,
        marginBottom: "0.25rem",
    },
    statSubtext: {
        fontSize: "0.75rem",
        color: "#9ca3af",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1.5rem",
        marginBottom: "1.5rem",
    },
    card: {
        background: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.5rem",
    },
    cardTitle: {
        fontSize: "1.125rem",
        fontWeight: 600,
        color: "#2d3748",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    chartContainer: {
        height: "300px",
    },
    customTooltip: {
        background: "white",
        padding: "0.75rem 1rem",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    },
    tooltipLabel: {
        fontWeight: 600,
        color: "#2d3748",
        marginBottom: "0.5rem",
    },
    activitiesList: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    activityItem: {
        display: "flex",
        gap: "0.75rem",
        padding: "0.75rem",
        background: "#f9fafb",
        borderRadius: "8px",
        transition: "all 0.2s ease",
    },
    activityIcon: {
        width: "36px",
        height: "36px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.125rem",
    },
    activityContent: {
        flex: 1,
    },
    activityAction: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#2d3748",
        marginBottom: "0.25rem",
    },
    activityDetails: {
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        marginBottom: "0.25rem",
        flexWrap: "wrap",
    },
    activityCandidate: {
        fontSize: "0.8125rem",
        color: "#3b82f6",
        fontWeight: 500,
    },
    activityPosition: {
        fontSize: "0.75rem",
        color: "#6b7280",
    },
    activityTime: {
        fontSize: "0.75rem",
        color: "#9ca3af",
    },
    tableWrapper: {
        overflowX: "auto",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableHeader: {
        background: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
    },
    tableHeaderCell: {
        padding: "0.75rem 1rem",
        textAlign: "left",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#374151",
    },
    tableCell: {
        padding: "0.75rem 1rem",
        borderBottom: "1px solid #f3f4f6",
        fontSize: "0.875rem",
    },
    badge: {
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: 600,
        display: "inline-block",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
    },
    spinner: {
        width: "50px",
        height: "50px",
        border: "5px solid #f3f3f3",
        borderTop: "5px solid #10b981",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "1rem",
    },
    loadingText: {
        color: "#6b7280",
        fontSize: "1rem",
    },
    errorContainer: {
        textAlign: "center",
        padding: "3rem",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        margin: "2rem auto",
    },
    errorIcon: {
        fontSize: "3rem",
        marginBottom: "1rem",
    },
    errorTitle: {
        fontSize: "1.25rem",
        fontWeight: 600,
        color: "#374151",
        marginBottom: "0.5rem",
    },
    errorText: {
        color: "#6b7280",
        marginBottom: "1.5rem",
    },
    retryButton: {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.75rem 1.5rem",
        background: "#10b981",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
};

export default CompanyAnalytics;