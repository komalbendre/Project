import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const CompanyAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [timeRange, setTimeRange] = useState("monthly");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeRange]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            // Mock data
            const mockData = generateMockAnalytics(timeRange);
            setAnalyticsData(mockData);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateMockAnalytics = (range) => {
        const monthlyData = [
            { month: 'Jan', applications: 42, interviews: 8, hires: 1 },
            { month: 'Feb', applications: 56, interviews: 12, hires: 3 },
            { month: 'Mar', applications: 78, interviews: 18, hires: 4 },
            { month: 'Apr', applications: 65, interviews: 15, hires: 2 },
            { month: 'May', applications: 89, interviews: 22, hires: 5 },
            { month: 'Jun', applications: 72, interviews: 16, hires: 3 },
        ];

        const weeklyData = [
            { week: 'Week 1', applications: 18, interviews: 4, hires: 1 },
            { week: 'Week 2', applications: 22, interviews: 6, hires: 2 },
            { week: 'Week 3', applications: 20, interviews: 5, hires: 1 },
            { week: 'Week 4', applications: 16, interviews: 3, hires: 0 },
        ];

        return {
            overview: {
                totalApplications: 342,
                avgResponseTime: "2.1 days",
                conversionRate: "3.5%",
                avgTimeToHire: "14 days",
                totalHires: 12,
                totalCost: "$14,500"
            },
            trendData: range === "weekly" ? weeklyData : monthlyData,
            departmentPerformance: [
                { name: 'Engineering', applications: 189, hires: 8, conversion: 4.2 },
                { name: 'Marketing', applications: 67, hires: 3, conversion: 4.5 },
                { name: 'Design', applications: 54, hires: 2, conversion: 3.7 },
                { name: 'Business', applications: 32, hires: 1, conversion: 3.1 },
            ],
            candidateSources: [
                { source: 'CareerSync', count: 189, percentage: 55 },
                { source: 'LinkedIn', count: 87, percentage: 25 },
                { source: 'Campus', count: 42, percentage: 12 },
                { source: 'Referrals', count: 24, percentage: 7 },
            ],
            skillDemand: [
                { skill: 'React', demand: 95, applicants: 120 },
                { skill: 'Python', demand: 88, applicants: 95 },
                { skill: 'UI/UX', demand: 82, applicants: 78 },
                { skill: 'Data Analysis', demand: 78, applicants: 65 },
                { skill: 'Node.js', demand: 75, applicants: 85 },
            ]
        };
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
        },
        subtitle: {
            color: "#718096",
            fontSize: "1.125rem",
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
        },
        activeTimeRange: {
            background: "#10b981",
            color: "white",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
        },
        card: {
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        cardTitle: {
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#2d3748",
            marginBottom: "1rem",
        },
        chartContainer: {
            height: "300px",
            marginTop: "1rem",
        },
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
        },
        statCard: {
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        statValue: {
            fontSize: "2rem",
            fontWeight: 700,
            color: "#2d3748",
            marginBottom: "0.5rem",
        },
        statLabel: {
            fontSize: "0.875rem",
            color: "#6b7280",
            fontWeight: 500,
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
        positiveBadge: {
            background: "#d1fae5",
            color: "#065f46",
        },
        negativeBadge: {
            background: "#fee2e2",
            color: "#991b1b",
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
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #10b981",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },
        exportButton: {
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
    };

    if (loading || !analyticsData) {
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
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{`
                .time-range-button:hover:not(.active) {
                    background: #f3f4f6;
                }
            `}</style>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Analytics Dashboard</h1>
                    <p style={styles.subtitle}>Detailed insights into your hiring performance</p>
                </div>
                <div style={styles.timeRangeSelector}>
                    <button
                        style={{
                            ...styles.timeRangeButton,
                            ...(timeRange === "weekly" && styles.activeTimeRange)
                        }}
                        onClick={() => setTimeRange("weekly")}
                    >
                        Weekly
                    </button>
                    <button
                        style={{
                            ...styles.timeRangeButton,
                            ...(timeRange === "monthly" && styles.activeTimeRange)
                        }}
                        onClick={() => setTimeRange("monthly")}
                    >
                        Monthly
                    </button>
                    <button
                        style={{
                            ...styles.timeRangeButton,
                            ...(timeRange === "quarterly" && styles.activeTimeRange)
                        }}
                        onClick={() => setTimeRange("quarterly")}
                    >
                        Quarterly
                    </button>
                </div>
            </div>

            {/* Overview Stats */}
            <div style={styles.statsGrid}>
                {[
                    { label: "Total Applications", value: analyticsData.overview.totalApplications, icon: "📥" },
                    { label: "Conversion Rate", value: analyticsData.overview.conversionRate, icon: "📊" },
                    { label: "Avg Response Time", value: analyticsData.overview.avgResponseTime, icon: "⚡" },
                    { label: "Avg Time to Hire", value: analyticsData.overview.avgTimeToHire, icon: "⏱️" },
                    { label: "Total Hires", value: analyticsData.overview.totalHires, icon: "✅" },
                    { label: "Total Cost", value: analyticsData.overview.totalCost, icon: "💰" },
                ].map((stat, index) => (
                    <div key={index} style={styles.statCard}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                            <div style={{ fontSize: "1.5rem" }}>{stat.icon}</div>
                            <div style={styles.statValue}>{stat.value}</div>
                        </div>
                        <div style={styles.statLabel}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Charts Grid */}
            <div style={styles.grid}>
                {/* Applications Trend */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Applications Trend</h3>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey={timeRange === "weekly" ? "week" : "month"} stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="applications" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                <Area type="monotone" dataKey="interviews" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Candidate Sources */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Candidate Sources</h3>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analyticsData.candidateSources}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {analyticsData.candidateSources.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042'][index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Skill Demand */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Skill Demand vs Applicants</h3>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.skillDemand}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="skill" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="demand" fill="#3b82f6" name="Demand" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="applicants" fill="#10b981" name="Applicants" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Performance */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Department Performance</h3>
                    <div style={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.departmentPerformance}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Bar dataKey="applications" fill="#3b82f6" name="Applications" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="hires" fill="#10b981" name="Hires" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Department Performance Table */}
            <div style={styles.card}>
                <h3 style={styles.cardTitle}>Department Performance Details</h3>
                <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                        <tr>
                            <th style={styles.tableHeaderCell}>Department</th>
                            <th style={styles.tableHeaderCell}>Applications</th>
                            <th style={styles.tableHeaderCell}>Hires</th>
                            <th style={styles.tableHeaderCell}>Conversion Rate</th>
                            <th style={styles.tableHeaderCell}>Performance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {analyticsData.departmentPerformance.map((dept, index) => (
                            <tr key={index}>
                                <td style={styles.tableCell}>
                                    <div style={{ fontWeight: 500 }}>{dept.name}</div>
                                </td>
                                <td style={styles.tableCell}>{dept.applications}</td>
                                <td style={styles.tableCell}>{dept.hires}</td>
                                <td style={styles.tableCell}>{dept.conversion}%</td>
                                <td style={styles.tableCell}>
                                    <span style={{
                                        ...styles.badge,
                                        ...(dept.conversion >= 4 ? styles.positiveBadge : styles.negativeBadge)
                                    }}>
                                        {dept.conversion >= 4 ? "Good" : "Needs Improvement"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyAnalytics;