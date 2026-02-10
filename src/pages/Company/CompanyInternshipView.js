import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CompanyInternshipView = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [internship, setInternship] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchInternshipDetails();
        fetchApplications();
    }, [token, navigate, id]);

    const fetchInternshipDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5000/api/companies/internships/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setInternship(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching internship:", error);
            if (error.response?.status === 404) {
                alert("Internship not found");
                navigate("/company/internships");
            } else {
                alert("Failed to load internship details. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            setLoadingApplications(true);
            const response = await axios.get(
                `http://localhost:5000/api/companies/internships/${id}/applications`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setApplications(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
            // Don't show error for applications - they might not exist
        } finally {
            setLoadingApplications(false);
        }
    };

    const handleEdit = () => {
        navigate(`/company/internships/${id}/edit`);
    };

    const handleClose = async () => {
        if (window.confirm("Are you sure you want to close this internship? This will stop receiving new applications.")) {
            try {
                await axios.patch(
                    `http://localhost:5000/api/companies/internships/${id}/status`,
                    { status: "Closed" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                alert("Internship closed successfully!");
                fetchInternshipDetails(); // Refresh data
            } catch (error) {
                console.error("Error closing internship:", error);
                alert("Failed to close internship. Please try again.");
            }
        }
    };

    const handleReopen = async () => {
        if (window.confirm("Are you sure you want to reopen this internship?")) {
            try {
                await axios.patch(
                    `http://localhost:5000/api/companies/internships/${id}/status`,
                    { status: "Open" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                alert("Internship reopened successfully!");
                fetchInternshipDetails(); // Refresh data
            } catch (error) {
                console.error("Error reopening internship:", error);
                alert("Failed to reopen internship. Please try again.");
            }
        }
    };

    const handleViewApplicants = () => {
        navigate(`/company/applications?internship=${id}`);
    };

    const handleScheduleInterview = () => {
        navigate(`/company/interviews/schedule?internship=${id}`);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return '#10b981';
            case 'closed': return '#ef4444';
            case 'draft': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'remote': return '#3b82f6';
            case 'onsite': return '#8b5cf6';
            case 'hybrid': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatStipend = (stipend) => {
        if (!stipend) return "Unpaid";
        if (typeof stipend === 'string') return stipend;

        // If stipend is an object
        if (stipend.isPaid === false || stipend.amount === 0) {
            return "Unpaid";
        }

        return `${stipend.amount} ${stipend.currency} per ${stipend.period}`;
    };

    const formatTextToList = (text) => {
        if (!text) return [];
        return text.split('\n').filter(line => line.trim());
    };

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'Pending': return '#92400e';
            case 'Reviewed': return '#0369a1';
            case 'Interview Scheduled': return '#7c3aed';
            case 'Hired': return '#065f46';
            case 'Rejected': return '#991b1b';
            case 'Offer Sent': return '#059669';
            default: return '#6b7280';
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'Pending': return '#fef3c7';
            case 'Reviewed': return '#f0f9ff';
            case 'Interview Scheduled': return '#f5f3ff';
            case 'Hired': return '#d1fae5';
            case 'Rejected': return '#fee2e2';
            case 'Offer Sent': return '#d1fae5';
            default: return '#f3f4f6';
        }
    };

    const calculateDaysRemaining = (deadline) => {
        if (!deadline) return "N/A";
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Closed";
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        return `${diffDays} days`;
    };

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            background: "#f8fafc",
            minHeight: "100vh",
            padding: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
        },
        header: {
            marginBottom: "2rem",
        },
        title: {
            fontSize: "clamp(1.5rem, 2vw, 2rem)",
            fontWeight: 700,
            color: "#1f2937",
            margin: 0,
            marginBottom: "0.5rem",
        },
        subtitle: {
            color: "#6b7280",
            fontSize: "0.875rem",
        },
        contentGrid: {
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.5rem",
        },
        mainContent: {
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
        },
        sidebar: {
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
        },
        card: {
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        sectionTitle: {
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#2d3748",
            marginBottom: "1rem",
            paddingBottom: "0.5rem",
            borderBottom: "1px solid #e5e7eb",
        },
        infoGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            marginBottom: "1.5rem",
        },
        infoItem: {
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
        },
        infoLabel: {
            fontSize: "0.75rem",
            color: "#6b7280",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
        },
        infoValue: {
            fontSize: "0.875rem",
            color: "#374151",
            fontWeight: 500,
        },
        statusBadge: {
            display: "inline-flex",
            alignItems: "center",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
        },
        typeBadge: {
            display: "inline-flex",
            alignItems: "center",
            padding: "0.25rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: 600,
        },
        list: {
            listStyle: "none",
            padding: 0,
            margin: 0,
        },
        listItem: {
            padding: "0.5rem 0",
            color: "#4b5563",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
        },
        bullet: {
            color: "#10b981",
            fontWeight: "bold",
            minWidth: "1rem",
        },
        skillsContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.5rem",
        },
        skillChip: {
            padding: "0.375rem 0.75rem",
            background: "#f3f4f6",
            color: "#374151",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 500,
        },
        buttonContainer: {
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginTop: "1rem",
        },
        button: {
            padding: "0.625rem 1.25rem",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "0.875rem",
            border: "1px solid",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        primaryButton: {
            background: "#10b981",
            color: "white",
            borderColor: "#10b981",
        },
        secondaryButton: {
            background: "white",
            color: "#374151",
            borderColor: "#d1d5db",
        },
        dangerButton: {
            background: "#ef4444",
            color: "white",
            borderColor: "#ef4444",
        },
        applicationsTable: {
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
        },
        tableHeader: {
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
        },
        th: {
            padding: "0.75rem 1rem",
            textAlign: "left",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#374151",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
        },
        td: {
            padding: "0.75rem 1rem",
            borderBottom: "1px solid #e5e7eb",
            fontSize: "0.875rem",
            color: "#4b5563",
        },
        applicantStatusBadge: {
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 500,
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
        emptyState: {
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
        },
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
                    <p style={{ marginLeft: "1rem", color: "#6b7280" }}>Loading internship details...</p>
                </div>
            </div>
        );
    }

    if (!internship) {
        return (
            <div style={styles.container}>
                <div style={styles.emptyState}>
                    <h3>Internship not found</h3>
                    <p>The internship you're looking for doesn't exist or you don't have permission to view it.</p>
                    <button
                        style={{ ...styles.button, ...styles.secondaryButton }}
                        onClick={() => navigate("/company/internships")}
                    >
                        Back to Internships
                    </button>
                </div>
            </div>
        );
    }

    const responsibilitiesList = formatTextToList(internship.responsibilities);
    const requirementsList = formatTextToList(internship.requirements);
    const benefitsList = formatTextToList(internship.benefits);
    const processList = formatTextToList(internship.applicationProcess);
    const skills = Array.isArray(internship.skills) ? internship.skills : [];

    return (
        <div style={styles.container}>
            <style>{`
                .button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
            `}</style>

            {/* Header */}
            <div style={styles.header}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1 style={styles.title}>{internship.title}</h1>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                            <span style={{
                                ...styles.statusBadge,
                                background: getStatusColor(internship.status) + '20',
                                color: getStatusColor(internship.status),
                            }}>
                                {internship.status}
                            </span>
                            <span style={{
                                ...styles.typeBadge,
                                background: getTypeColor(internship.type) + '20',
                                color: getTypeColor(internship.type),
                            }}>
                                {internship.type.charAt(0).toUpperCase() + internship.type.slice(1)}
                            </span>
                            <span style={styles.subtitle}>
                                Posted on {formatDate(internship.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button
                            style={{ ...styles.button, ...styles.secondaryButton }}
                            onClick={handleEdit}
                            className="button"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                        </button>

                        <button
                            style={{ ...styles.button, ...styles.primaryButton }}
                            onClick={handleViewApplicants}
                            className="button"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            View Applicants ({internship.applicationCount || 0})
                        </button>

                        {internship.status === 'Open' ? (
                            <button
                                style={{ ...styles.button, ...styles.dangerButton }}
                                onClick={handleClose}
                                className="button"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                Close Internship
                            </button>
                        ) : (
                            <button
                                style={{ ...styles.button, ...styles.primaryButton }}
                                onClick={handleReopen}
                                className="button"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                </svg>
                                Reopen Internship
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div style={styles.contentGrid}>
                {/* Main Content */}
                <div style={styles.mainContent}>
                    {/* Internship Details */}
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Internship Details</h3>

                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Department</div>
                                <div style={styles.infoValue}>{internship.department}</div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Location</div>
                                <div style={styles.infoValue}>{internship.location}</div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Duration</div>
                                <div style={styles.infoValue}>{internship.duration} months</div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Start Date</div>
                                <div style={styles.infoValue}>
                                    {internship.startDate ? formatDate(internship.startDate) : "Immediate"}
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Positions Available</div>
                                <div style={styles.infoValue}>{internship.positions}</div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Stipend</div>
                                <div style={styles.infoValue}>{formatStipend(internship.stipend)}</div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Application Deadline</div>
                                <div style={styles.infoValue}>{formatDate(internship.applicationDeadline)}</div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Last Updated</div>
                                <div style={styles.infoValue}>{formatDate(internship.updatedAt)}</div>
                            </div>
                        </div>

                        <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                            Description
                        </h4>
                        <p style={{ color: "#4b5563", fontSize: "0.875rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                            {internship.description}
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            <div>
                                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                                    Responsibilities
                                </h4>
                                <ul style={styles.list}>
                                    {responsibilitiesList.map((item, index) => (
                                        <li key={index} style={styles.listItem}>
                                            <span style={styles.bullet}>•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
                                    Requirements
                                </h4>
                                <ul style={styles.list}>
                                    {requirementsList.map((item, index) => (
                                        <li key={index} style={styles.listItem}>
                                            <span style={styles.bullet}>•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Benefits & Application Process */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>Benefits & Perks</h3>
                            <ul style={styles.list}>
                                {benefitsList.length > 0 ? (
                                    benefitsList.map((item, index) => (
                                        <li key={index} style={styles.listItem}>
                                            <span style={styles.bullet}>•</span>
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <li style={styles.listItem}>No specific benefits listed</li>
                                )}
                            </ul>
                        </div>

                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>Application Process</h3>
                            <ul style={styles.list}>
                                {processList.length > 0 ? (
                                    processList.map((item, index) => (
                                        <li key={index} style={styles.listItem}>
                                            <span style={styles.bullet}>{index + 1}.</span>
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <li style={styles.listItem}>Standard application process</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={styles.sidebar}>
                    {/* Skills */}
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Required Skills</h3>
                        <div style={styles.skillsContainer}>
                            {skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <div key={index} style={styles.skillChip}>
                                        {skill}
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                                    No specific skills listed
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Contact Information</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Contact Email</div>
                                <div style={styles.infoValue}>
                                    {internship.contactEmail || "Not specified"}
                                </div>
                            </div>
                            <div style={styles.infoItem}>
                                <div style={styles.infoLabel}>Contact Phone</div>
                                <div style={styles.infoValue}>
                                    {internship.contactPhone || "Not specified"}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: "1.5rem" }}>
                            <button
                                style={{ ...styles.button, ...styles.primaryButton, width: "100%" }}
                                onClick={handleScheduleInterview}
                                className="button"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Schedule Interview
                            </button>
                        </div>
                    </div>

                    {/* Recent Applications */}
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Recent Applications</h3>
                        {loadingApplications ? (
                            <div style={{ textAlign: "center", padding: "1rem" }}>
                                <div style={{
                                    width: "20px",
                                    height: "20px",
                                    border: "2px solid #f3f3f3",
                                    borderTop: "2px solid #10b981",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                    margin: "0 auto"
                                }}></div>
                            </div>
                        ) : applications.length > 0 ? (
                            <table style={styles.applicationsTable}>
                                <thead style={styles.tableHeader}>
                                    <tr>
                                        <th style={styles.th}>Candidate</th>
                                        <th style={styles.th}>Applied</th>
                                        <th style={styles.th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.slice(0, 5).map((app) => (
                                        <tr key={app._id}>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: 500, color: "#1f2937" }}>
                                                    {app.candidateName}
                                                </div>
                                                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                                                    {app.candidateEmail}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                {formatDate(app.appliedDate)}
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.applicantStatusBadge,
                                                    background: getStatusBgColor(app.status),
                                                    color: getStatusTextColor(app.status),
                                                }}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={styles.emptyState}>
                                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                                    No applications yet
                                </p>
                            </div>
                        )}

                        {applications.length > 0 && (
                            <button
                                style={{ ...styles.button, ...styles.secondaryButton, width: "100%", marginTop: "1rem" }}
                                onClick={handleViewApplicants}
                                className="button"
                            >
                                View All Applicants →
                            </button>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Quick Stats</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Total Applications</span>
                                <span style={{ fontSize: "1rem", fontWeight: 600, color: "#1f2937" }}>
                                    {internship.applicationCount || 0}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Positions Filled</span>
                                <span style={{ fontSize: "1rem", fontWeight: 600, color: "#1f2937" }}>
                                    0 / {internship.positions}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Days Remaining</span>
                                <span style={{ fontSize: "1rem", fontWeight: 600, color: "#10b981" }}>
                                    {calculateDaysRemaining(internship.applicationDeadline)}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Conversion Rate</span>
                                <span style={{ fontSize: "1rem", fontWeight: 600, color: "#3b82f6" }}>
                                    {internship.applicationCount > 0
                                        ? `${((0 / internship.applicationCount) * 100).toFixed(1)}%`
                                        : "0%"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyInternshipView;