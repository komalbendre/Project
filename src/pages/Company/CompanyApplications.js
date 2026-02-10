import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CompanyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplications, setSelectedApplications] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        dateRange: 'all',
        position: 'all',
        search: ''
    });
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        fetchApplications();
    }, [token, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const statusFilter = params.get('filter');
        if (statusFilter) {
            setFilters(prev => ({ ...prev, status: statusFilter }));
        }
    }, [location]);

    useEffect(() => {
        filterApplications();
    }, [applications, filters]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            // In real app, fetch from API
            const mockApplications = generateMockApplications();
            setApplications(mockApplications);
        } catch (error) {
            console.error("Error fetching applications:", error);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const generateMockApplications = () => {
        return [
            { 
                id: 1, 
                candidate: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+1 (555) 123-4567',
                    resume: 'john_doe_resume.pdf',
                    profilePic: null
                },
                position: 'Frontend Developer Intern',
                department: 'Engineering',
                appliedDate: '2024-03-15',
                status: 'Pending',
                stage: 'Application Review',
                score: 85,
                skills: ['React', 'JavaScript', 'HTML/CSS'],
                experience: '1 year',
                education: 'B.S. Computer Science',
                notes: 'Strong portfolio, good communication skills',
                lastContact: '2024-03-15'
            },
            { 
                id: 2, 
                candidate: {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '+1 (555) 987-6543',
                    resume: 'jane_smith_resume.pdf',
                    profilePic: null
                },
                position: 'Data Analyst Intern',
                department: 'Analytics',
                appliedDate: '2024-03-14',
                status: 'Reviewed',
                stage: 'Technical Assessment',
                score: 92,
                skills: ['Python', 'SQL', 'Tableau'],
                experience: '2 years',
                education: 'M.S. Data Science',
                notes: 'Excellent analytical skills, passed initial screening',
                lastContact: '2024-03-14'
            },
            { 
                id: 3, 
                candidate: {
                    name: 'Bob Johnson',
                    email: 'bob@example.com',
                    phone: '+1 (555) 456-7890',
                    resume: 'bob_johnson_resume.pdf',
                    profilePic: null
                },
                position: 'Marketing Intern',
                department: 'Marketing',
                appliedDate: '2024-03-13',
                status: 'Interview Scheduled',
                stage: 'First Interview',
                score: 78,
                skills: ['SEO', 'Content Marketing', 'Social Media'],
                experience: '6 months',
                education: 'B.A. Marketing',
                notes: 'Interview scheduled for tomorrow',
                lastContact: '2024-03-13'
            },
            { 
                id: 4, 
                candidate: {
                    name: 'Alice Brown',
                    email: 'alice@example.com',
                    phone: '+1 (555) 789-0123',
                    resume: 'alice_brown_resume.pdf',
                    profilePic: null
                },
                position: 'UX Designer Intern',
                department: 'Design',
                appliedDate: '2024-03-12',
                status: 'Rejected',
                stage: 'Final Review',
                score: 65,
                skills: ['Figma', 'UI/UX', 'Prototyping'],
                experience: '1 year',
                education: 'B.Des. Interaction Design',
                notes: 'Portfolio needs improvement',
                lastContact: '2024-03-12'
            }
        ];
    };

    const filterApplications = () => {
        let filtered = [...applications];

        if (filters.status !== 'all') {
            filtered = filtered.filter(app => app.status.toLowerCase().includes(filters.status));
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(app => 
                app.candidate.name.toLowerCase().includes(searchLower) ||
                app.position.toLowerCase().includes(searchLower) ||
                app.department.toLowerCase().includes(searchLower)
            );
        }

        if (filters.position !== 'all') {
            filtered = filtered.filter(app => app.position === filters.position);
        }

        setFilteredApplications(filtered);
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setApplications(prev => prev.map(app => 
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleBulkAction = (action) => {
        if (selectedApplications.length === 0) {
            alert("Please select applications first");
            return;
        }

        switch(action) {
            case 'shortlist':
                selectedApplications.forEach(id => handleStatusChange(id, 'Shortlisted'));
                break;
            case 'reject':
                selectedApplications.forEach(id => handleStatusChange(id, 'Rejected'));
                break;
            case 'schedule':
                alert(`Schedule interviews for ${selectedApplications.length} candidates`);
                break;
            case 'email':
                alert(`Send email to ${selectedApplications.length} candidates`);
                break;
        }
        
        setSelectedApplications([]);
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedApplications(filteredApplications.map(app => app.id));
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
        switch(status) {
            case 'Pending': return '#f59e0b';
            case 'Reviewed': return '#3b82f6';
            case 'Shortlisted': return '#8b5cf6';
            case 'Interview Scheduled': return '#ec4899';
            case 'Offer Sent': return '#10b981';
            case 'Rejected': return '#ef4444';
            case 'Hired': return '#059669';
            default: return '#6b7280';
        }
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
            flex: 1,
            minWidth: "300px",
        },
        bulkActions: {
            display: "flex",
            gap: "0.5rem",
            marginTop: "1rem",
            flexWrap: "wrap",
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
            fontSize: "1rem",
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
        },
        viewButton: {
            padding: "0.25rem 0.75rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.75rem",
            cursor: "pointer",
        },
        scheduleButton: {
            padding: "0.25rem 0.75rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.75rem",
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
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
        },
        statCard: {
            background: "white",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flex: 1,
            minWidth: "200px",
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
    };

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'reviewed', label: 'Reviewed' },
        { value: 'shortlisted', label: 'Shortlisted' },
        { value: 'interview', label: 'Interview Scheduled' },
        { value: 'rejected', label: 'Rejected' },
    ];

    const positionOptions = [
        { value: 'all', label: 'All Positions' },
        { value: 'Frontend Developer Intern', label: 'Frontend Developer' },
        { value: 'Data Analyst Intern', label: 'Data Analyst' },
        { value: 'Marketing Intern', label: 'Marketing' },
        { value: 'UX Designer Intern', label: 'UX Designer' },
    ];

    const stats = [
        {
            icon: "📥",
            value: applications.length,
            label: "Total Applications",
            color: "#3b82f6",
            bgColor: "#dbeafe"
        },
        {
            icon: "⏳",
            value: applications.filter(app => app.status === 'Pending').length,
            label: "Pending Review",
            color: "#f59e0b",
            bgColor: "#fef3c7"
        },
        {
            icon: "🎯",
            value: applications.filter(app => app.status === 'Interview Scheduled').length,
            label: "Interviews",
            color: "#8b5cf6",
            bgColor: "#ede9fe"
        },
        {
            icon: "✅",
            value: applications.filter(app => app.status === 'Reviewed').length,
            label: "Reviewed",
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
            `}</style>

            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Applications Management</h1>
                <p style={styles.subtitle}>
                    Manage and review candidate applications for your internships
                </p>
            </div>

            {/* Stats */}
            <div style={styles.statsRow}>
                {stats.map((stat, index) => (
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
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Position</label>
                        <select 
                            style={styles.filterSelect}
                            value={filters.position}
                            onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                        >
                            {positionOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ ...styles.filterGroup, flex: 1 }}>
                        <label style={styles.filterLabel}>Search</label>
                        <input
                            type="text"
                            style={styles.searchInput}
                            placeholder="Search by candidate name, position, or department..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Bulk Actions */}
                <div style={styles.bulkActions}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', marginRight: '1rem' }}>
                        {selectedApplications.length} selected
                    </span>
                    <button 
                        style={styles.actionButton}
                        onClick={() => handleBulkAction('shortlist')}
                        className="action-button"
                    >
                        📋 Shortlist
                    </button>
                    <button 
                        style={styles.actionButton}
                        onClick={() => handleBulkAction('reject')}
                        className="action-button"
                    >
                        ❌ Reject
                    </button>
                    <button 
                        style={styles.actionButton}
                        onClick={() => handleBulkAction('schedule')}
                        className="action-button"
                    >
                        🗓️ Schedule Interview
                    </button>
                    <button 
                        style={styles.actionButton}
                        onClick={() => handleBulkAction('email')}
                        className="action-button"
                    >
                        📧 Send Email
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
                            {filters.status !== 'all' || filters.search || filters.position !== 'all' 
                                ? 'Try changing your filters'
                                : 'No applications have been submitted yet'}
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
                            onClick={() => navigate('/company/dashboard')}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
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
                                <th style={styles.tableHeaderCell}>Stage</th>
                                <th style={styles.tableHeaderCell}>Score</th>
                                <th style={styles.tableHeaderCell}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.map((application) => (
                                <tr key={application.id}>
                                    <td style={styles.tableCell}>
                                        <input
                                            type="checkbox"
                                            style={styles.checkbox}
                                            checked={selectedApplications.includes(application.id)}
                                            onChange={(e) => handleSelectApplication(application.id, e.target.checked)}
                                        />
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.candidateInfo}>
                                            <div style={styles.candidateAvatar}>
                                                {application.candidate.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div style={styles.candidateDetails}>
                                                <div style={styles.candidateName}>
                                                    {application.candidate.name}
                                                </div>
                                                <div style={styles.candidateEmail}>
                                                    {application.candidate.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={{ fontWeight: 500 }}>{application.position}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                            {application.department}
                                        </div>
                                    </td>
                                    <td style={styles.tableCell}>{application.appliedDate}</td>
                                    <td style={styles.tableCell}>
                                        <span style={{
                                            ...styles.badge,
                                            background: getStatusColor(application.status) + '20',
                                            color: getStatusColor(application.status)
                                        }}>
                                            {application.status}
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.badge}>
                                            {application.stage}
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <span style={styles.scoreBadge}>
                                            {application.score}%
                                        </span>
                                    </td>
                                    <td style={styles.tableCell}>
                                        <div style={styles.actionButtons}>
                                            <button
                                                style={styles.viewButton}
                                                onClick={() => alert(`View application ${application.id}`)}
                                            >
                                                View
                                            </button>
                                            <button
                                                style={styles.scheduleButton}
                                                onClick={() => alert(`Schedule interview for ${application.candidate.name}`)}
                                            >
                                                Schedule
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CompanyApplications;