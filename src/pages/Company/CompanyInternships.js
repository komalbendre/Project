import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Custom Modal Component
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  internshipTitle,
  isProcessing,
  successMessage,
  errorMessage,
  onClearMessage
}) => {
  if (!isOpen) return null;

  const modalConfig = {
    delete: {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      ),
      title: "Delete Internship",
      description: `Are you sure you want to delete "${internshipTitle}"? This action cannot be undone and all data will be permanently removed.`,
      confirmText: "Delete Internship",
      confirmColor: "#ef4444",
      bgColor: "#fef2f2",
      borderColor: "#fecaca"
    },
    close: {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M8 12h8" />
        </svg>
      ),
      title: "Close Internship",
      description: `Are you sure you want to close "${internshipTitle}"? This will stop receiving new applications. Existing applications will remain accessible.`,
      confirmText: "Close Internship",
      confirmColor: "#f59e0b",
      bgColor: "#fffbeb",
      borderColor: "#fde68a"
    }
  };

  const config = modalConfig[type];

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
      animation: "fadeIn 0.3s ease"
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
      
      <div style={{
        background: "white",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "480px",
        overflow: "hidden",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        animation: "slideUp 0.3s ease"
      }}>
        {/* Success/Error Message */}
        {successMessage && (
          <div style={{
            background: "#10b981",
            color: "white",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            animation: "fadeInOut 3s ease forwards"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={{
            background: "#ef4444",
            color: "white",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span>{errorMessage}</span>
            <button 
              onClick={onClearMessage}
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "1.25rem",
                padding: "0 0.5rem"
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div style={{
          padding: "2rem 2rem 1.5rem",
          background: config.bgColor,
          borderBottom: `1px solid ${config.borderColor}`,
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "12px",
            background: "white",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}>
            {config.icon}
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#1f2937"
            }}>
              {config.title}
            </h3>
            <p style={{
              margin: "0.25rem 0 0",
              fontSize: "0.875rem",
              color: "#6b7280"
            }}>
              Confirmation Required
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "2rem" }}>
          <p style={{
            margin: "0 0 1.5rem",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            color: "#4b5563"
          }}>
            {config.description}
          </p>

          <div style={{
            padding: "1rem",
            background: "#f9fafb",
            borderRadius: "8px",
            marginBottom: "1.5rem"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              color: "#6b7280"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>This action is irreversible for delete operations</span>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end"
          }}>
            <button
              onClick={onClose}
              disabled={isProcessing}
              style={{
                padding: "0.75rem 1.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "white",
                color: "#374151",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease",
                opacity: isProcessing ? 0.6 : 1,
                pointerEvents: isProcessing ? "none" : "auto"
              }}
              onMouseOver={(e) => {
                if (!isProcessing) {
                  e.target.style.background = "#f9fafb";
                  e.target.style.borderColor = "#9ca3af";
                }
              }}
              onMouseOut={(e) => {
                if (!isProcessing) {
                  e.target.style.background = "white";
                  e.target.style.borderColor = "#d1d5db";
                }
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                background: isProcessing ? "#9ca3af" : config.confirmColor,
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: isProcessing ? "default" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: isProcessing ? "none" : `0 4px 6px -1px ${config.confirmColor}40`,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseOver={(e) => {
                if (!isProcessing) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = `0 6px 8px -1px ${config.confirmColor}40`;
                }
              }}
              onMouseOut={(e) => {
                if (!isProcessing) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = `0 4px 6px -1px ${config.confirmColor}40`;
                }
              }}
            >
              {isProcessing ? (
                <>
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid white",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                  Processing...
                </>
              ) : (
                config.confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompanyInternships = () => {
    const [loading, setLoading] = useState(true);
    const [internships, setInternships] = useState([]);
    const [filteredInternships, setFilteredInternships] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [modal, setModal] = useState({
        isOpen: false,
        type: null, // 'close' or 'delete'
        internshipId: null,
        internshipTitle: "",
        isProcessing: false,
        successMessage: "",
        errorMessage: ""
    });
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // Fetch internships on component mount
    useEffect(() => {
        const checkAuthAndFetch = async () => {
            if (!token) {
                alert("Please login first");
                navigate("/login");
                return;
            }

            // Verify token is valid
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiry = payload.exp * 1000;

                if (Date.now() >= expiry) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    alert("Session expired. Please login again.");
                    navigate("/login");
                    return;
                }

                await fetchInternships();
            } catch (err) {
                console.error("Token validation error:", err);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("Invalid session. Please login again.");
                navigate("/login");
            }
        };

        checkAuthAndFetch();
    }, [token, navigate]);

    // Filter internships when search or filters change
    useEffect(() => {
        let filtered = internships;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(internship =>
                internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                internship.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                internship.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(internship =>
                internship.status.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // Apply type filter
        if (typeFilter !== "all") {
            filtered = filtered.filter(internship =>
                internship.type.toLowerCase() === typeFilter.toLowerCase()
            );
        }

        setFilteredInternships(filtered);
    }, [searchTerm, statusFilter, typeFilter, internships]);

    /**
     * Fetch internships from API
     */
    const fetchInternships = async () => {
        try {
            setLoading(true);
            
            const response = await axios.get(
                "http://localhost:5000/api/companies/internships",
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            if (response.data.success) {
                const internshipsData = response.data.data.map(internship => ({
                    id: internship._id || internship.id,
                    title: internship.title,
                    type: internship.type || 'remote',
                    applications: internship.applicationCount || 0,
                    status: internship.status || 'Open',
                    postedDate: internship.createdAt ? new Date(internship.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'N/A',
                    location: internship.location,
                    duration: internship.duration,
                    stipend: internship.stipend ? 
                        (internship.stipend.isPaid === false || internship.stipend.amount === 0) 
                            ? 'Unpaid' 
                            : `${internship.stipend.amount} ${internship.stipend.currency}/${internship.stipend.period}`
                        : 'Unpaid',
                    openings: internship.positions || 1,
                    department: internship.department,
                    deadline: internship.applicationDeadline ? new Date(internship.applicationDeadline).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : 'N/A'
                }));
                
                setInternships(internshipsData);
                setFilteredInternships(internshipsData);
            } else {
                alert("Failed to fetch internships: " + (response.data.message || "Unknown error"));
                setInternships([]);
                setFilteredInternships([]);
            }
        } catch (error) {
            console.error("Error fetching internships:", error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    localStorage.removeItem("token");
                    alert("Session expired. Please login again.");
                    navigate("/login");
                } else if (error.response.status === 403) {
                    alert("Access denied: " + (error.response.data?.message || ""));
                } else if (error.response.status === 400) {
                    alert("Error: " + (error.response.data?.message || "Bad request"));
                } else {
                    alert("Server error. Please try again or contact support.");
                }
            } else if (error.request) {
                alert("Cannot connect to server. Please check if backend is running.");
            } else {
                alert("Error: " + error.message);
            }
            
            setInternships([]);
            setFilteredInternships([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Navigation Handlers
     */
    const handleCreateNew = () => navigate("/company/internships/create");
    const handleView = (id) => navigate(`/company/internships/${id}`);
    const handleEdit = (id) => navigate(`/company/internships/${id}/edit`);
    const handleViewApplicants = (id) => navigate(`/company/applications?internship=${id}`);

    /**
     * Modal Handlers
     */
    const openModal = (type, internshipId, internshipTitle) => {
        setModal({
            isOpen: true,
            type,
            internshipId,
            internshipTitle,
            isProcessing: false,
            successMessage: "",
            errorMessage: ""
        });
    };

    const closeModal = () => {
        setModal({
            isOpen: false,
            type: null,
            internshipId: null,
            internshipTitle: "",
            isProcessing: false,
            successMessage: "",
            errorMessage: ""
        });
    };

    const clearModalMessage = () => {
        setModal(prev => ({
            ...prev,
            errorMessage: ""
        }));
    };

    /**
     * Internship Action Handlers
     */
    const handleClose = async (id, title) => {
        openModal('close', id, title);
    };

    const handleDelete = async (id, title) => {
        openModal('delete', id, title);
    };

    const confirmClose = async () => {
        setModal(prev => ({ ...prev, isProcessing: true, errorMessage: "" }));
        
        try {
            await axios.patch(
                `http://localhost:5000/api/companies/internships/${modal.internshipId}/status`,
                { status: "Closed" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setInternships(prev => prev.map(internship =>
                internship.id === modal.internshipId
                    ? { ...internship, status: "Closed" }
                    : internship
            ));

            setModal(prev => ({ 
                ...prev, 
                isProcessing: false, 
                successMessage: "Internship closed successfully!" 
            }));

            // Auto close modal after 2 seconds
            setTimeout(() => {
                closeModal();
            }, 2000);

        } catch (error) {
            console.error("Error closing internship:", error);
            const message = error.response?.data?.message || "Failed to close internship. Please try again.";
            setModal(prev => ({ 
                ...prev, 
                isProcessing: false, 
                errorMessage: message 
            }));
        }
    };

    const confirmDelete = async () => {
        setModal(prev => ({ ...prev, isProcessing: true, errorMessage: "" }));
        
        try {
            await axios.delete(
                `http://localhost:5000/api/companies/internships/${modal.internshipId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setInternships(prev => prev.filter(internship => internship.id !== modal.internshipId));
            
            setModal(prev => ({ 
                ...prev, 
                isProcessing: false, 
                successMessage: "Internship deleted successfully!" 
            }));

            // Auto close modal after 2 seconds
            setTimeout(() => {
                closeModal();
            }, 2000);

        } catch (error) {
            console.error("Error deleting internship:", error);
            const message = error.response?.data?.message || "Failed to delete internship. Please try again.";
            setModal(prev => ({ 
                ...prev, 
                isProcessing: false, 
                errorMessage: message 
            }));
        }
    };

    /**
     * Helper Functions
     */
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
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

    const calculateStats = () => {
        const totalInternships = internships.length;
        const activeInternships = internships.filter(i => i.status === 'Open').length;
        const totalApplications = internships.reduce((sum, i) => sum + i.applications, 0);
        const avgApplications = totalInternships > 0 ? (totalApplications / totalInternships).toFixed(1) : 0;

        return { totalInternships, activeInternships, totalApplications, avgApplications };
    };

    /**
     * Component Styles
     */
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
            fontSize: "clamp(1.5rem, 2vw, 2rem)",
            fontWeight: 700,
            color: "#1f2937",
            margin: 0,
        },
        subtitle: {
            color: "#6b7280",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
        },
        button: {
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
        },
        filtersContainer: {
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            alignItems: "center",
        },
        searchInput: {
            flex: 1,
            minWidth: "250px",
            padding: "0.75rem 1rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.875rem",
            fontFamily: "inherit",
        },
        select: {
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.875rem",
            background: "white",
            fontFamily: "inherit",
            minWidth: "150px",
        },
        statsGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
        },
        statCard: {
            background: "white",
            padding: "1.25rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        statValue: {
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1f2937",
            marginBottom: "0.25rem",
        },
        statLabel: {
            fontSize: "0.875rem",
            color: "#6b7280",
            fontWeight: 500,
        },
        tableContainer: {
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
        },
        tableHeader: {
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
        },
        th: {
            padding: "1rem 1.5rem",
            textAlign: "left",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#374151",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
        },
        td: {
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #e5e7eb",
            fontSize: "0.875rem",
            color: "#4b5563",
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
            background: "#f3f4f6",
            color: "#374151",
        },
        actionsCell: {
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
        },
        actionButton: {
            padding: "0.375rem 0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            background: "white",
            color: "#374151",
            fontSize: "0.75rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
        },
        viewButton: { borderColor: "#000000ff", color: "#000000ff" },
        editButton: { borderColor: "#000000ff", color: "#000000ff" },
        closeButton: { borderColor: "#f59e0b", color: "#f59e0b" },
        applicantsButton: { borderColor: "#000000ff", color: "#000000ff" },
        dangerButton: { borderColor: "#ef4444", color: "#ef4444" },
        emptyState: {
            textAlign: "center",
            padding: "3rem",
            color: "#6b7280",
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
    };

    const stats = calculateStats();

    // Loading state
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
                    <p style={{ marginLeft: "1rem", color: "#6b7280" }}>Loading internships...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{`
                .action-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .create-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
                input:focus, select:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }
            `}</style>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                onConfirm={modal.type === 'delete' ? confirmDelete : confirmClose}
                type={modal.type}
                internshipTitle={modal.internshipTitle}
                isProcessing={modal.isProcessing}
                successMessage={modal.successMessage}
                errorMessage={modal.errorMessage}
                onClearMessage={clearModalMessage}
            />

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Internship Management</h1>
                    <p style={styles.subtitle}>Manage your internships and view applications</p>
                </div>
                <button style={styles.button} onClick={handleCreateNew} className="create-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Post New Internship
                </button>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.totalInternships}</div>
                    <div style={styles.statLabel}>Total Internships</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.activeInternships}</div>
                    <div style={styles.statLabel}>Active Internships</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.totalApplications}</div>
                    <div style={styles.statLabel}>Total Applications</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{stats.avgApplications}</div>
                    <div style={styles.statLabel}>Avg. Applications per Internship</div>
                </div>
            </div>

            {/* Filters */}
            <div style={styles.filtersContainer}>
                <input
                    type="text"
                    placeholder="Search internships..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                </select>

                <select style={styles.select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="remote">Remote</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                </select>

                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    {filteredInternships.length} of {internships.length} internships
                </div>
            </div>

            {/* Internships Table */}
            <div style={styles.tableContainer}>
                {filteredInternships.length > 0 ? (
                    <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.th}>Internship Title</th>
                                <th style={styles.th}>Type</th>
                                <th style={styles.th}>Applications</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Created Date</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInternships.map((internship) => (
                                <tr key={internship.id}>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: 600, color: "#1f2937", marginBottom: "0.25rem" }}>
                                            {internship.title}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                                            {internship.department} • {internship.location} • {internship.openings} opening(s)
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.typeBadge,
                                            background: getTypeColor(internship.type) + '20',
                                            color: getTypeColor(internship.type),
                                        }}>
                                            {internship.type.charAt(0).toUpperCase() + internship.type.slice(1)}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: 600, color: "#1f2937" }}>
                                            {internship.applications}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{
                                            ...styles.statusBadge,
                                            background: getStatusColor(internship.status) + '20',
                                            color: getStatusColor(internship.status),
                                        }}>
                                            {internship.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{internship.postedDate}</td>
                                    <td style={styles.td}>
                                        <div style={styles.actionsCell}>
                                            <button
                                                style={{ ...styles.actionButton, ...styles.viewButton }}
                                                onClick={() => handleView(internship.id)}
                                                className="action-button"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                View
                                            </button>

                                            <button
                                                style={{ ...styles.actionButton, ...styles.editButton }}
                                                onClick={() => handleEdit(internship.id)}
                                                className="action-button"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                                Edit
                                            </button>

                                            <button
                                                style={{ ...styles.actionButton, ...styles.applicantsButton }}
                                                onClick={() => handleViewApplicants(internship.id)}
                                                className="action-button"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                Applicants ({internship.applications})
                                            </button>

                                            {internship.status === 'Open' && (
                                                <button
                                                    style={{ ...styles.actionButton, ...styles.closeButton }}
                                                    onClick={() => handleClose(internship.id, internship.title)}
                                                    className="action-button"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                    Close
                                                </button>
                                            )}

                                            {internship.applications === 0 && (
                                                <button
                                                    style={{ ...styles.actionButton, ...styles.dangerButton }}
                                                    onClick={() => handleDelete(internship.id, internship.title)}
                                                    className="action-button"
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 6h18" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={styles.emptyState}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1" style={{ marginBottom: "1rem" }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <h3 style={{ color: "#4b5563", marginBottom: "0.5rem" }}>
                            {internships.length === 0 ? "No internships posted yet" : "No matching internships"}
                        </h3>
                        <p style={{ marginBottom: "1.5rem" }}>
                            {internships.length === 0
                                ? "Get started by posting your first internship!"
                                : "Try adjusting your search or filters."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyInternships;