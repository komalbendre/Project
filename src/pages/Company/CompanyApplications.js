import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

const CompanyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [companyInternships, setCompanyInternships] = useState([]);
    const [stats, setStats] = useState({
        totalApplications: 0,
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        accepted: 0,
        rejected: 0,
        withdrawn: 0,
        interviews: 0
    });
    const [filters, setFilters] = useState({
        status: 'all',
        internshipId: 'all',
        search: '',
        dateRange: 'all'
    });
    const [updatingStatus, setUpdatingStatus] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchCompanyData();
    }, [token, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const statusFilter = params.get('filter');
        const internshipFilter = params.get('internship');
        
        if (statusFilter) {
            setFilters(prev => ({ ...prev, status: statusFilter }));
        }
        if (internshipFilter) {
            setFilters(prev => ({ ...prev, internshipId: internshipFilter }));
        }
    }, [location]);

    useEffect(() => {
        filterApplications();
    }, [applications, filters]);

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            
            // Fetch company applications
            await fetchApplications();
            
            // Fetch company internships for filter dropdown
            await fetchCompanyInternships();
            
        } catch (error) {
            console.error("Error fetching company data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            // Build query params
            const params = new URLSearchParams();
            
            if (filters.status !== 'all') {
                params.append('status', filters.status);
            }
            
            if (filters.internshipId !== 'all') {
                params.append('internshipId', filters.internshipId);
            }
            
            if (filters.search) {
                params.append('search', filters.search);
            }
            
            const response = await axios.get(
                `http://localhost:5000/api/applications/company?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setApplications(response.data.data);
                
                // Update stats from response
                if (response.data.stats) {
                    setStats({
                        totalApplications: response.data.total || response.data.data.length,
                        pending: response.data.stats.pending || 0,
                        reviewed: response.data.stats.reviewed || 0,
                        shortlisted: response.data.stats.shortlisted || 0,
                        accepted: response.data.stats.accepted || 0,
                        rejected: response.data.stats.rejected || 0,
                        withdrawn: response.data.stats.withdrawn || 0,
                        interviews: response.data.data.filter(app => app.interview?.scheduled).length || 0
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
            setApplications([]);
        }
    };

    const fetchCompanyInternships = async () => {
        try {
            const response = await axios.get(
                'http://localhost:5000/api/companies/internships',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setCompanyInternships(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching internships:", error);
            setCompanyInternships([]);
        }
    };

    const filterApplications = () => {
        let filtered = [...applications];

        // Status filter is now handled by API, but we still need to apply search locally
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(app => 
                app.fullName?.toLowerCase().includes(searchLower) ||
                app.email?.toLowerCase().includes(searchLower) ||
                app.internship?.title?.toLowerCase().includes(searchLower) ||
                app.skills?.some(skill => skill.toLowerCase().includes(searchLower))
            );
        }

        // Apply date range filter locally
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const daysAgo = parseInt(filters.dateRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(now.getDate() - daysAgo);
            
            filtered = filtered.filter(app => 
                new Date(app.appliedDate) >= cutoffDate
            );
        }

        setFilteredApplications(filtered);
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setUpdatingStatus(true);
            
            const response = await axios.patch(
                `http://localhost:5000/api/applications/${applicationId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Update local state
                setApplications(prev => prev.map(app => 
                    app._id === applicationId ? { ...app, status: newStatus } : app
                ));
                
                // Refresh stats
                fetchApplications();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert(error.response?.data?.message || "Failed to update application status");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAddNote = async (applicationId, note) => {
        if (!note.trim()) return;
        
        try {
            const response = await axios.post(
                `http://localhost:5000/api/applications/${applicationId}/notes`,
                { note },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Refresh applications to show new note
                fetchApplications();
                alert("Note added successfully");
            }
        } catch (error) {
            console.error("Error adding note:", error);
            alert(error.response?.data?.message || "Failed to add note");
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedApplications.length === 0) {
            alert("Please select applications first");
            return;
        }

        if (!window.confirm(`Are you sure you want to ${action} ${selectedApplications.length} selected application(s)?`)) {
            return;
        }

        try {
            setUpdatingStatus(true);
            
            let newStatus;
            switch(action) {
                case 'shortlist':
                    newStatus = 'shortlisted';
                    break;
                case 'reject':
                    newStatus = 'rejected';
                    break;
                case 'review':
                    newStatus = 'reviewed';
                    break;
                default:
                    return;
            }

            // Update each selected application
            await Promise.all(
                selectedApplications.map(id => 
                    axios.patch(
                        `http://localhost:5000/api/applications/${id}/status`,
                        { status: newStatus },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                )
            );

            // Refresh applications
            await fetchApplications();
            setSelectedApplications([]);
            alert(`Successfully updated ${selectedApplications.length} application(s)`);
            
        } catch (error) {
            console.error("Error in bulk action:", error);
            alert(error.response?.data?.message || "Failed to perform bulk action");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleScheduleInterview = (application) => {
        // Navigate to interview scheduling page or open modal
        // You can implement a modal here or navigate to a dedicated page
        alert(`Schedule interview for ${application.fullName}`);
        // navigate(`/company/interviews/schedule?application=${application._id}`);
    };

    const handleViewApplication = (applicationId) => {
        navigate(`/company/applications/${applicationId}`);
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedApplications(filteredApplications.map(app => app._id));
        } else {
            setSelectedApplications([]);
        }
    };

    const handleSelectApplication = (applicationId, checked) => {
        if (checked) {
            setSelectedApplications(prev => [...prev, applicationId]);
        } else {
            setSelectedApplications(prev => prev.filter(id => id !== applicationId));
        }
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'pending': return '#f59e0b';
            case 'reviewed': return '#3b82f6';
            case 'shortlisted': return '#8b5cf6';
            case 'accepted': return '#10b981';
            case 'rejected': return '#ef4444';
            case 'withdrawn': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const getStatusBadgeStyle = (status) => {
        const color = getStatusColor(status);
        return {
            ...styles.badge,
            background: color + '20',
            color: color
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            background: "#f8fafc",
            minHeight: "100vh",
            padding: "2rem",
        },
        header: {
            marginBottom: "2rem",
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
        filtersContainer: {
            background: "white",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        filterRow: {
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
        },
        filterGroup: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            minWidth: "200px",
            flex: 1,
        },
        filterLabel: {
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#374151",
        },
        filterSelect: {
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.875rem",
            background: "white",
        },
        searchInput: {
            padding: "0.5rem 1rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.875rem",
            width: "100%",
        },
        bulkActions: {
            display: "flex",
            gap: "0.5rem",
            marginTop: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
        },
        actionButton: {
            padding: "0.5rem 1rem",
            background: "#f3f4f6",
            color: "#374151",
            border: "none",
            borderRadius: "6px",
            fontSize: "0.875rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease",
        },
        primaryActionButton: {
            background: "#10b981",
            color: "white",
        },
        applicationsContainer: {
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
            padding: "1rem",
            textAlign: "left",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#374151",
        },
        tableCell: {
            padding: "1rem",
            borderBottom: "1px solid #f3f4f6",
            fontSize: "0.875rem",
        },
        candidateInfo: {
            display: "flex",
            alignItems: "center",
            gap: "1rem",
        },
        candidateAvatar: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "#3b82f6",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: "0.875rem",
        },
        candidateDetails: {
            display: "flex",
            flexDirection: "column",
        },
        candidateName: {
            fontWeight: 600,
            marginBottom: "0.25rem",
        },
        candidateEmail: {
            fontSize: "0.75rem",
            color: "#6b7280",
        },
        badge: {
            padding: "0.25rem 0.75rem",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: 600,
            display: "inline-block",
            textTransform: "capitalize",
        },
        scoreBadge: {
            padding: "0.25rem 0.5rem",
            borderRadius: "6px",
            fontSize: "0.75rem",
            fontWeight: 600,
            background: "#f3f4f6",
            color: "#374151",
        },
        actionButtons: {
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
        },
        viewButton: {
            padding: "0.25rem 0.75rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.75rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
        },
        scheduleButton: {
            padding: "0.25rem 0.75rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.75rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
        },
        statusSelect: {
            padding: "0.25rem 0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            fontSize: "0.75rem",
            background: "white",
            cursor: "pointer",
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
            padding: "3rem",
            color: "#6b7280",
        },
        checkbox: {
            width: "16px",
            height: "16px",
            cursor: "pointer",
        },
        statsRow: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
        },
        statCard: {
            background: "white",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
        },
        statIcon: {
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
        },
        statContent: {
            flex: 1,
        },
        statValue: {
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
        },
        statLabel: {
            fontSize: "0.875rem",
            color: "#6b7280",
        },
        skillsContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "0.25rem",
            marginTop: "0.25rem",
        },
        skillTag: {
            padding: "0.125rem 0.5rem",
            background: "#f3f4f6",
            borderRadius: "12px",
            fontSize: "0.625rem",
            color: "#374151",
        },
    };

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'reviewed', label: 'Reviewed' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'withdrawn', label: 'Withdrawn' },
    ];

    const dateRangeOptions = [
        { value: 'all', label: 'All Time' },
        { value: '7', label: 'Last 7 Days' },
        { value: '30', label: 'Last 30 Days' },
        { value: '90', label: 'Last 90 Days' },
    ];

    const statCards = [
        {
            icon: "📥",
            value: stats.totalApplications,
            label: "Total Applications",
            color: "#3b82f6",
            bgColor: "#dbeafe"
        },
        {
            icon: "⏳",
            value: stats.pending,
            label: "Pending Review",
            color: "#f59e0b",
            bgColor: "#fef3c7"
        },
        {
            icon: "🎯",
            value: stats.interviews,
            label: "Interviews",
            color: "#8b5cf6",
            bgColor: "#ede9fe"
        },
        {
            icon: "✅",
            value: stats.accepted,
            label: "Accepted",
            color: "#10b981",
            bgColor: "#d1fae5"
        },
    ];

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
                    <p style={{ marginLeft: '1rem', color: '#6b7280' }}>Loading applications...</p>
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
                .view-button:hover, .schedule-button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
            `}</style>

            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Applications Management</h1>
                <p style={styles.subtitle}>
                    Manage and review candidate applications for your internships
                </p>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsRow}>
                {statCards.map((stat, index) => (
                    <div key={index} style={styles.statCard}>
                        <div style={{ ...styles.statIcon, background: stat.bgColor, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div style={styles.statContent}>
                            <div style={styles.statValue}>{stat.value}</div>
                            <div style={styles.statLabel}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={styles.filtersContainer}>
                <div style={styles.filterRow}>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Status</label>
                        <select 
                            style={styles.filterSelect}
                            value={filters.status}
                            onChange={(e) => {
                                setFilters(prev => ({ ...prev, status: e.target.value }));
                                fetchApplications();
                            }}
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Internship Position</label>
                        <select 
                            style={styles.filterSelect}
                            value={filters.internshipId}
                            onChange={(e) => {
                                setFilters(prev => ({ ...prev, internshipId: e.target.value }));
                                fetchApplications();
                            }}
                        >
                            <option value="all">All Positions</option>
                            {companyInternships.map(internship => (
                                <option key={internship._id} value={internship._id}>
                                    {internship.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Date Range</label>
                        <select 
                            style={styles.filterSelect}
                            value={filters.dateRange}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                        >
                            {dateRangeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div style={styles.filterRow}>
                    <div style={{ ...styles.filterGroup, flex: 2 }}>
                        <label style={styles.filterLabel}>Search</label>
                        <input
                            type="text"
                            style={styles.searchInput}
                            placeholder="Search by candidate name, email, skills, or position..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                    
                    <div style={{ ...styles.filterGroup, flex: 0, justifyContent: 'flex-end' }}>
                        <button
                            style={{
                                ...styles.actionButton,
                                background: '#3b82f6',
                                color: 'white',
                                marginTop: '1.5rem'
                            }}
                            onClick={() => {
                                setFilters({
                                    status: 'all',
                                    internshipId: 'all',
                                    search: '',
                                    dateRange: 'all'
                                });
                                fetchApplications();
                            }}
                            className="action-button"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div style={styles.bulkActions}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '1rem' }}>
                        {selectedApplications.length} selected
                    </span>
                    <button 
                        style={styles.actionButton}
                        onClick={() => handleBulkAction('review')}
                        className="action-button"
                        disabled={updatingStatus}
                    >
                        📋 Mark as Reviewed
                    </button>
                    <button 
                        style={styles.actionButton}
                        onClick={() => handleBulkAction('shortlist')}
                        className="action-button"
                        disabled={updatingStatus}
                    >
                        ⭐ Shortlist
                    </button>
                    <button 
                        style={{...styles.actionButton, ...styles.primaryActionButton}}
                        onClick={() => handleBulkAction('reject')}
                        className="action-button"
                        disabled={updatingStatus}
                    >
                        ❌ Reject
                    </button>
                </div>
            </div>

            {/* Applications Table */}
            <div style={styles.applicationsContainer}>
                {filteredApplications.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                        <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>No applications found</h3>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            {filters.status !== 'all' || filters.search || filters.internshipId !== 'all' || filters.dateRange !== 'all'
                                ? 'Try changing your filters to see more results'
                                : 'No applications have been submitted yet for your internships'}
                        </p>
                        <button
                            style={{
                                padding: "0.75rem 1.5rem",
                                background: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                            onClick={() => navigate('/company/internships')}
                        >
                            View Your Internships
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead style={styles.tableHeader}>
                                <tr>
                                    <th style={styles.tableHeaderCell}>
                                        <input
                                            type="checkbox"
                                            style={styles.checkbox}
                                            checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                    </th>
                                    <th style={styles.tableHeaderCell}>Candidate</th>
                                    <th style={styles.tableHeaderCell}>Position</th>
                                    <th style={styles.tableHeaderCell}>Applied Date</th>
                                    <th style={styles.tableHeaderCell}>Status</th>
                                    <th style={styles.tableHeaderCell}>Skills</th>
                                    <th style={styles.tableHeaderCell}>Resume</th>
                                    <th style={styles.tableHeaderCell}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.map((application) => (
                                    <tr key={application._id}>
                                        <td style={styles.tableCell}>
                                            <input
                                                type="checkbox"
                                                style={styles.checkbox}
                                                checked={selectedApplications.includes(application._id)}
                                                onChange={(e) => handleSelectApplication(application._id, e.target.checked)}
                                            />
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={styles.candidateInfo}>
                                                <div style={styles.candidateAvatar}>
                                                    {getInitials(application.fullName)}
                                                </div>
                                                <div style={styles.candidateDetails}>
                                                    <div style={styles.candidateName}>
                                                        {application.fullName || 'N/A'}
                                                    </div>
                                                    <div style={styles.candidateEmail}>
                                                        {application.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={{ fontWeight: 500 }}>
                                                {application.internship?.title || 'N/A'}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                {application.internship?.location || 'Remote'}
                                            </div>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div>{formatDate(application.appliedDate)}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                                {application.experience ? `${application.experience} yr` : 'Fresher'}
                                            </div>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div>
                                                <span style={getStatusBadgeStyle(application.status)}>
                                                    {application.status || 'Pending'}
                                                </span>
                                            </div>
                                            <select
                                                style={styles.statusSelect}
                                                value={application.status || 'pending'}
                                                onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                                disabled={updatingStatus}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="shortlisted">Shortlisted</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={styles.skillsContainer}>
                                                {application.skills?.slice(0, 3).map((skill, idx) => (
                                                    <span key={idx} style={styles.skillTag}>{skill}</span>
                                                ))}
                                                {application.skills?.length > 3 && (
                                                    <span style={styles.skillTag}>+{application.skills.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={styles.tableCell}>
                                            {application.resumeUrl ? (
                                                <a 
                                                    href={application.resumeUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#3b82f6', textDecoration: 'none' }}
                                                >
                                                    View Resume
                                                </a>
                                            ) : (
                                                <span style={{ color: '#9ca3af' }}>No resume</span>
                                            )}
                                        </td>
                                        <td style={styles.tableCell}>
                                            <div style={styles.actionButtons}>
                                                <button
                                                    style={styles.viewButton}
                                                    onClick={() => handleViewApplication(application._id)}
                                                    className="view-button"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    style={styles.scheduleButton}
                                                    onClick={() => handleScheduleInterview(application)}
                                                    className="schedule-button"
                                                >
                                                    Schedule
                                                </button>
                                            </div>
                                            {application.companyNotes?.length > 0 && (
                                                <div style={{ fontSize: '0.625rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                                    📝 {application.companyNotes.length} note(s)
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyApplications;