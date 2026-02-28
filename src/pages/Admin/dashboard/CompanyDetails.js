import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CompanyDetails = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchCompanyDetails();
    }, [companyId]);

    const fetchCompanyDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/companies/${companyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("Company details response:", response.data);
            
            if (response.data.success) {
                setCompany(response.data.data);
            } else {
                setError(response.data.message || "Failed to load company details");
            }
        } catch (error) {
            console.error("Error fetching company details:", error);
            console.error("Error response:", error.response);
            
            if (error.response) {
                if (error.response.status === 404) {
                    setError("Company not found");
                } else if (error.response.status === 401) {
                    setError("Unauthorized. Please log in again.");
                } else if (error.response.status === 403) {
                    setError("Access denied. Admin privileges required.");
                } else {
                    setError(error.response.data?.message || `Server error: ${error.response.status}`);
                }
            } else if (error.request) {
                setError("No response from server. Please check your connection.");
            } else {
                setError("Error: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (window.confirm("Are you sure you want to approve this company?")) {
            try {
                await axios.put(
                    `http://localhost:5000/api/companies/${companyId}/approve`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setMessage({
                    text: "Company approved successfully!",
                    type: "success"
                });
                fetchCompanyDetails();
            } catch (error) {
                console.error("Error approving company:", error);
                setMessage({
                    text: "Failed to approve company",
                    type: "error"
                });
            }
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        try {
            await axios.put(
                `http://localhost:5000/api/companies/${companyId}/reject`,
                { reason: rejectReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMessage({
                text: "Company rejected successfully!",
                type: "success"
            });
            setShowRejectModal(false);
            setRejectReason("");
            fetchCompanyDetails();
        } catch (error) {
            console.error("Error rejecting company:", error);
            setMessage({
                text: "Failed to reject company",
                type: "error"
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return { 
                    text: 'Pending Review', 
                    color: '#d97706', 
                    bg: '#fef3c7',
                    iconColor: '#f59e0b'
                };
            case 'approved':
                return { 
                    text: 'Approved', 
                    color: '#059669', 
                    bg: '#d1fae5',
                    iconColor: '#10b981'
                };
            case 'rejected':
                return { 
                    text: 'Rejected', 
                    color: '#dc2626', 
                    bg: '#fee2e2',
                    iconColor: '#ef4444'
                };
            default:
                return { 
                    text: 'Unknown', 
                    color: '#6b7280', 
                    bg: '#f3f4f6',
                    iconColor: '#9ca3af'
                };
        }
    };

    const getInitials = (name) => {
        if (!name) return "C";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
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
            alignItems: "flex-start",
            marginBottom: "2rem",
        },
        headerContent: {
            flex: 1,
        },
        title: {
            fontSize: "2rem",
            fontWeight: 700,
            color: "#1f2937",
            marginBottom: "0.5rem",
        },
        subtitle: {
            color: "#6b7280",
            fontSize: "1rem",
        },
        headerButtons: {
            display: "flex",
            gap: "1rem",
        },
        backButton: {
            padding: "0.75rem 1.5rem",
            background: "white",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        actionButton: {
            padding: "0.75rem 1.5rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        approveButton: {
            background: "#10b981",
        },
        rejectButton: {
            background: "#ef4444",
        },
        content: {
            maxWidth: "1200px",
            margin: "0 auto",
        },
        loadingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
        },
        loadingSpinner: {
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },
        errorContainer: {
            background: "#fee2e2",
            color: "#991b1b",
            padding: "1.5rem",
            borderRadius: "8px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "4rem auto",
        },
        companyHeader: {
            background: "white",
            padding: "2.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
        },
        companyAvatar: {
            width: "80px",
            height: "80px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "32px",
            fontWeight: "bold",
            flexShrink: 0,
        },
        companyInfo: {
            flex: 1,
        },
        companyName: {
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#1f2937",
            marginBottom: "0.5rem",
        },
        companyIndustry: {
            fontSize: "1rem",
            color: "#6b7280",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        companyContact: {
            fontSize: "0.875rem",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
        },
        contactItem: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        statusSection: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "1rem",
        },
        statusBadge: {
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            fontSize: "0.875rem",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        decisionButtons: {
            display: "flex",
            gap: "0.75rem",
        },
        infoGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
        },
        section: {
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
        },
        sectionTitle: {
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        infoRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 0",
            borderBottom: "1px solid #f3f4f6",
        },
        infoLabel: {
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#6b7280",
        },
        infoValue: {
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#374151",
            textAlign: "right",
            maxWidth: "60%",
            wordBreak: "break-word",
        },
        infoValueLink: {
            color: "#3b82f6",
            textDecoration: "none",
            fontWeight: 600,
        },
        descriptionSection: {
            gridColumn: "1 / -1",
            background: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
        },
        descriptionBox: {
            background: "#f9fafb",
            padding: "1.25rem",
            borderRadius: "6px",
            fontSize: "0.875rem",
            lineHeight: "1.6",
            color: "#4b5563",
            border: "1px solid #e5e7eb",
        },
        approvalInfo: {
            background: "#f0f9ff",
            padding: "1rem",
            borderRadius: "6px",
            marginTop: "1rem",
            border: "1px solid #bae6fd",
        },
        rejectionInfo: {
            background: "#fef2f2",
            padding: "1rem",
            borderRadius: "6px",
            marginTop: "1rem",
            border: "1px solid #fecaca",
        },
        infoText: {
            fontSize: "0.875rem",
            color: "#0369a1",
            marginBottom: "0.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        modalOverlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
        },
        modal: {
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
        },
        modalTitle: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#1f2937",
            marginBottom: "1rem",
        },
        modalInput: {
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
            fontFamily: "inherit",
            minHeight: "100px",
            resize: "vertical",
        },
        modalButtons: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
        },
        modalCancel: {
            padding: "0.5rem 1rem",
            background: "white",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: "pointer",
        },
        modalReject: {
            padding: "0.5rem 1rem",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
        },
        message: {
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        successMessage: {
            background: "#d1fae5",
            color: "#065f46",
            border: "1px solid #a7f3d0",
        },
        errorMessage: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
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
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <div style={styles.header}>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate("/admin/dashboard?tab=companies")}
                        onMouseEnter={(e) => e.target.style.background = "#f9fafb"}
                        onMouseLeave={(e) => e.target.style.background = "white"}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to Companies
                    </button>
                </div>
                <div style={styles.errorContainer}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p style={{ fontWeight: 600, marginTop: "0.5rem" }}>{error}</p>
                </div>
            </div>
        );
    }

    if (!company) {
        return null;
    }

    const statusBadge = getStatusBadge(company.status);
    const user = company.userId || {};
    const isPending = company.status === 'pending';
    const isApproved = company.status === 'approved';
    const isRejected = company.status === 'rejected';

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                a:hover {
                    text-decoration: underline;
                }
                
                textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
            `}</style>

            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.title}>Company Details</h1>
                    <p style={styles.subtitle}>
                    </p>
                </div>
                <div style={styles.headerButtons}>
                    <button
                        style={styles.backButton}
                        onClick={() => navigate("/admin/dashboard?tab=companies")}
                        onMouseEnter={(e) => e.target.style.background = "#f9fafb"}
                        onMouseLeave={(e) => e.target.style.background = "white"}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to Companies
                    </button>
                </div>
            </div>

            {/* Message Display */}
            {message.text && (
                <div style={{
                    ...styles.message,
                    ...(message.type === "success" ? styles.successMessage : styles.errorMessage)
                }}>
                    {message.type === "success" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                    )}
                    {message.text}
                </div>
            )}

            <div style={styles.content}>
                {/* Company Header */}
                <div style={styles.companyHeader}>
                    <div style={styles.companyAvatar}>
                        {getInitials(company.companyName)}
                    </div>
                    <div style={styles.companyInfo}>
                        <h2 style={styles.companyName}>{company.companyName}</h2>
                        <div style={styles.companyIndustry}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
                            </svg>
                            {company.industry}
                        </div>
                        <div style={styles.companyContact}>
                            <span style={styles.contactItem}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                {company.contactEmail}
                            </span>
                            <span style={styles.contactItem}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                {company.phoneNo}
                            </span>
                        </div>
                    </div>
                    <div style={styles.statusSection}>
                        <span style={{
                            ...styles.statusBadge,
                            background: statusBadge.bg,
                            color: statusBadge.color,
                        }}>
                            {isPending && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            )}
                            {isApproved && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            )}
                            {isRejected && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <line x1="15" y1="9" x2="9" y2="15"/>
                                    <line x1="9" y1="9" x2="15" y2="15"/>
                                </svg>
                            )}
                            {statusBadge.text}
                        </span>
                        
                        {isPending && (
                            <div style={styles.decisionButtons}>
                                <button
                                    style={{...styles.actionButton, ...styles.approveButton}}
                                    onClick={handleApprove}
                                    onMouseEnter={(e) => e.target.style.background = "#059669"}
                                    onMouseLeave={(e) => e.target.style.background = "#10b981"}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Approve
                                </button>
                                <button
                                    style={{...styles.actionButton, ...styles.rejectButton}}
                                    onClick={() => setShowRejectModal(true)}
                                    onMouseEnter={(e) => e.target.style.background = "#dc2626"}
                                    onMouseLeave={(e) => e.target.style.background = "#ef4444"}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                    Reject
                                </button>
                            </div>
                        )}
                        
                        {isApproved && company.approvedAt && (
                            <div style={styles.approvalInfo}>
                                <div style={styles.infoText}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                    Approved on {formatDate(company.approvedAt)}
                                </div>
                                {company.approvedBy && (
                                    <div style={{ fontSize: "0.75rem", color: "#666" }}>
                                        By: {company.approvedBy?.fname} {company.approvedBy?.lname}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {isRejected && (
                            <div style={styles.rejectionInfo}>
                                <div style={{...styles.infoText, color: "#991b1b"}}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="15" y1="9" x2="9" y2="15"/>
                                        <line x1="9" y1="9" x2="15" y2="15"/>
                                    </svg>
                                    Rejected
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#666" }}>
                                    Reason: {company.rejectionReason || "No reason provided"}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Information Grid */}
                <div style={styles.infoGrid}>
                    {/* Company Details */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
                            </svg>
                            Company Details
                        </h3>
                        <div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Company Name</span>
                                <span style={styles.infoValue}>{company.companyName}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Industry</span>
                                <span style={styles.infoValue}>{company.industry}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Contact Email</span>
                                <a 
                                    href={`mailto:${company.contactEmail}`}
                                    style={styles.infoValueLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {company.contactEmail}
                                </a>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Phone</span>
                                <span style={styles.infoValue}>{company.phoneNo}</span>
                            </div>
                            {company.websiteUrl && (
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Website</span>
                                    <a 
                                        href={company.websiteUrl}
                                        style={styles.infoValueLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            )}
                            {company.linkedinUrl && (
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>LinkedIn</span>
                                    <a 
                                        href={company.linkedinUrl}
                                        style={styles.infoValueLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Profile
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Location Details */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            Location
                        </h3>
                        <div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Address</span>
                                <span style={styles.infoValue}>{company.address || "Not provided"}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>City</span>
                                <span style={styles.infoValue}>{company.city || "Not provided"}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>State/Province</span>
                                <span style={styles.infoValue}>{company.state || "Not provided"}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Country</span>
                                <span style={styles.infoValue}>{company.country || "Not provided"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Company Admin */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            Company Admin
                        </h3>
                        <div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Name</span>
                                <span style={styles.infoValue}>
                                    {user.fname} {user.lname}
                                </span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Email</span>
                                <a 
                                    href={`mailto:${user.email}`}
                                    style={styles.infoValueLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {user.email}
                                </a>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Account Status</span>
                                <span style={styles.infoValue}>
                                    {user.isApproved ? "Approved" : "Pending Approval"}
                                </span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Registered</span>
                                <span style={styles.infoValue}>
                                    {formatDate(company.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Info */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Registration Info
                        </h3>
                        <div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Application Date</span>
                                <span style={styles.infoValue}>
                                    {formatDate(company.createdAt)}
                                </span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>Status</span>
                                <span style={styles.infoValue}>
                                    <span style={{
                                        display: "inline-block",
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        background: statusBadge.color,
                                        marginRight: "6px"
                                    }}></span>
                                    {statusBadge.text}
                                </span>
                            </div>
                            {company.approvedAt && (
                                <div style={styles.infoRow}>
                                    <span style={styles.infoLabel}>Approved Date</span>
                                    <span style={styles.infoValue}>
                                        {formatDate(company.approvedAt)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Company Description - Full Width */}
                <div style={styles.descriptionSection}>
                    <h3 style={styles.sectionTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        Company Description
                    </h3>
                    <div style={styles.descriptionBox}>
                        {company.description || "No description provided."}
                    </div>
                </div>
            </div>

            {/* Rejection Modal */}
            {showRejectModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Reject Company Registration</h3>
                        <p style={{ color: "#6b7280", marginBottom: "1rem", fontSize: "0.875rem", lineHeight: "1.5" }}>
                            Please provide a reason for rejecting this company registration. 
                            This reason will be visible to the company admin.
                        </p>
                        <textarea
                            style={styles.modalInput}
                            placeholder="Enter rejection reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div style={styles.modalButtons}>
                            <button
                                style={styles.modalCancel}
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason("");
                                }}
                                onMouseEnter={(e) => e.target.style.background = "#f9fafb"}
                                onMouseLeave={(e) => e.target.style.background = "white"}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.modalReject}
                                onClick={handleReject}
                                disabled={!rejectReason.trim()}
                                onMouseEnter={(e) => {
                                    if (rejectReason.trim()) {
                                        e.target.style.background = "#dc2626";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = rejectReason.trim() ? "#ef4444" : "#9ca3af";
                                }}
                            >
                                Reject Company
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyDetails;