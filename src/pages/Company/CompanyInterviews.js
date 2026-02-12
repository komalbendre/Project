import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InterviewScheduleModal from "../../components/InterviewScheduleModal";

// SVG Icons Component
const Icons = {
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Video: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Location: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Filter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Link: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Info: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const CompanyInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
    date: 'all'
  });
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showApplicationSelector, setShowApplicationSelector] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchInterviews();
    fetchShortlistedApplications();
  }, []);

  useEffect(() => {
    filterInterviews();
  }, [interviews, filters]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      
      // Get all applications with interviews scheduled
      const response = await axios.get(
        `http://localhost:5000/api/applications/company`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Filter applications that have interviews scheduled
        const interviewApps = response.data.data.filter(app => app.interview?.scheduled);
        
        // Format interview data
        const formattedInterviews = interviewApps.map(app => ({
          id: app._id,
          applicationId: app._id,
          candidateName: app.fullName,
          candidateEmail: app.email,
          position: app.internship?.title || 'Internship',
          company: app.company?.companyName || app.internship?.companyName,
          date: app.interview.date,
          type: app.interview.type,
          duration: app.interview.duration,
          meetingLink: app.interview.meetingLink,
          location: app.interview.location,
          interviewer: app.interview.interviewer,
          status: app.status,
          scheduledAt: app.interview.scheduledAt,
          skills: app.skills,
          resumeUrl: app.resumeUrl
        }));

        setInterviews(formattedInterviews);

        // Calculate stats
        const now = new Date();
        const today = new Date().setHours(0, 0, 0, 0);
        
        setStats({
          total: formattedInterviews.length,
          today: formattedInterviews.filter(i => {
            const interviewDate = new Date(i.date).setHours(0, 0, 0, 0);
            return interviewDate === today;
          }).length,
          upcoming: formattedInterviews.filter(i => new Date(i.date) > now).length,
          completed: formattedInterviews.filter(i => new Date(i.date) < now).length,
          cancelled: 0
        });
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShortlistedApplications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/applications/company?status=shortlisted`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching shortlisted applications:", error);
    }
  };

  const filterInterviews = () => {
    let filtered = [...interviews];

    // Filter by status
    if (filters.status === 'upcoming') {
      filtered = filtered.filter(i => new Date(i.date) > new Date());
    } else if (filters.status === 'past') {
      filtered = filtered.filter(i => new Date(i.date) < new Date());
    } else if (filters.status === 'today') {
      const today = new Date().setHours(0, 0, 0, 0);
      filtered = filtered.filter(i => {
        const interviewDate = new Date(i.date).setHours(0, 0, 0, 0);
        return interviewDate === today;
      });
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(i => i.type === filters.type);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(i =>
        i.candidateName?.toLowerCase().includes(searchLower) ||
        i.candidateEmail?.toLowerCase().includes(searchLower) ||
        i.position?.toLowerCase().includes(searchLower) ||
        i.company?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (filters.date !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (filters.date === '7') {
        cutoffDate.setDate(now.getDate() - 7);
        filtered = filtered.filter(i => new Date(i.date) >= cutoffDate);
      } else if (filters.date === '30') {
        cutoffDate.setDate(now.getDate() - 30);
        filtered = filtered.filter(i => new Date(i.date) >= cutoffDate);
      }
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredInterviews(filtered);
  };

  const handleScheduleNew = () => {
    setShowApplicationSelector(true);
  };

  const handleSelectApplication = (application) => {
    setSelectedApplication(application);
    setIsScheduleModalOpen(true);
    setShowApplicationSelector(false);
  };

  const handleInterviewScheduled = async (interviewData) => {
    await fetchInterviews();
    await fetchShortlistedApplications();
    setIsScheduleModalOpen(false);
    setSelectedApplication(null);
  };

  const handleReschedule = (interview) => {
    setSelectedApplication({
      _id: interview.applicationId,
      fullName: interview.candidateName,
      email: interview.candidateEmail,
      internship: { title: interview.position },
      company: { companyName: interview.company }
    });
    setIsScheduleModalOpen(true);
  };

  const handleCancelInterview = async (interviewId) => {
    if (!window.confirm("Are you sure you want to cancel this interview?")) {
      return;
    }

    try {
      // You can implement a cancel interview endpoint or update status
      alert("Interview cancelled successfully");
      fetchInterviews();
    } catch (error) {
      console.error("Error cancelling interview:", error);
    }
  };

  const handleSendReminder = async (interview) => {
    try {
      // Implement send reminder functionality
      alert(`Reminder sent to ${interview.candidateName}`);
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInterviewTypeIcon = (type) => {
    switch(type) {
      case 'video': return <Icons.Video />;
      case 'phone': return <Icons.Phone />;
      case 'onsite': return <Icons.Location />;
      case 'technical': return <Icons.Link />;
      case 'hr': return <Icons.User />;
      default: return <Icons.Calendar />;
    }
  };

  const getStatusBadge = (date) => {
    const now = new Date();
    const interviewDate = new Date(date);
    
    if (interviewDate < now) {
      return { label: 'Completed', color: '#10b981', bg: '#d1fae5' };
    } else {
      const diffDays = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        return { label: 'Today', color: '#f59e0b', bg: '#fef3c7' };
      } else if (diffDays === 1) {
        return { label: 'Tomorrow', color: '#3b82f6', bg: '#dbeafe' };
      } else {
        return { label: 'Upcoming', color: '#8b5cf6', bg: '#ede9fe' };
      }
    }
  };

  const statCards = [
    {
      icon: <Icons.Calendar />,
      value: stats.total,
      label: "Total Interviews",
      color: "#3b82f6",
      bgColor: "#dbeafe"
    },
    {
      icon: <Icons.Clock />,
      value: stats.today,
      label: "Today",
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
    {
      icon: <Icons.Calendar />,
      value: stats.upcoming,
      label: "Upcoming",
      color: "#8b5cf6",
      bgColor: "#ede9fe"
    },
    {
      icon: <Icons.Check />,
      value: stats.completed,
      label: "Completed",
      color: "#10b981",
      bgColor: "#d1fae5"
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'video', label: 'Video Call' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'onsite', label: 'Onsite' },
    { value: 'technical', label: 'Technical' },
    { value: 'hr', label: 'HR' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Interviews' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'today', label: 'Today' },
    { value: 'past', label: 'Past' }
  ];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading interviews...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .interview-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Interviews</h1>
          <p style={styles.subtitle}>
            Manage and schedule interviews with candidates
          </p>
        </div>
        <button
          style={styles.scheduleButton}
          onClick={handleScheduleNew}
        >
          <Icons.Plus />
          Schedule Interview
        </button>
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
            <label style={styles.filterLabel}>Interview Type</label>
            <select
              style={styles.filterSelect}
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Date Range</label>
            <select
              style={styles.filterSelect}
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ ...styles.filterGroup, flex: 2 }}>
            <label style={styles.filterLabel}>Search</label>
            <div style={styles.searchWrapper}>
              <Icons.Search />
              <input
                type="text"
                style={styles.searchInput}
                placeholder="Search by candidate, position, or company..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              {filters.search && (
                <button
                  style={styles.clearButton}
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                >
                  <Icons.X />
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={styles.filterActions}>
          <button
            style={styles.clearFiltersButton}
            onClick={() => setFilters({
              status: 'all',
              type: 'all',
              search: '',
              date: 'all'
            })}
          >
            Clear Filters
          </button>
          <button
            style={styles.exportButton}
            onClick={() => alert('Export interviews as CSV')}
          >
            <Icons.Download />
            Export
          </button>
        </div>
      </div>

      {/* Application Selector Modal */}
      {showApplicationSelector && (
        <div style={styles.selectorOverlay}>
          <div style={styles.selectorModal}>
            <div style={styles.selectorHeader}>
              <h3 style={styles.selectorTitle}>Select Candidate</h3>
              <button
                style={styles.closeButton}
                onClick={() => setShowApplicationSelector(false)}
              >
                <Icons.X />
              </button>
            </div>
            <div style={styles.selectorContent}>
              {applications.length === 0 ? (
                <div style={styles.selectorEmpty}>
                  <Icons.Info />
                  <p>No shortlisted candidates available for interview scheduling.</p>
                  <button
                    style={styles.selectorButton}
                    onClick={() => navigate('/company/applications?filter=shortlisted')}
                  >
                    View Shortlisted Candidates
                  </button>
                </div>
              ) : (
                applications.map(app => (
                  <div
                    key={app._id}
                    style={styles.selectorItem}
                    onClick={() => handleSelectApplication(app)}
                  >
                    <div style={styles.selectorItemAvatar}>
                      {app.fullName?.charAt(0) || 'C'}
                    </div>
                    <div style={styles.selectorItemInfo}>
                      <h4>{app.fullName}</h4>
                      <p>{app.internship?.title}</p>
                      <span>{app.email}</span>
                    </div>
                    <button style={styles.selectorItemButton}>
                      Schedule
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interviews List */}
      <div style={styles.interviewsContainer}>
        {filteredInterviews.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Icons.Calendar />
            </div>
            <h3 style={styles.emptyTitle}>No interviews found</h3>
            <p style={styles.emptyText}>
              {filters.status !== 'all' || filters.type !== 'all' || filters.search || filters.date !== 'all'
                ? 'Try adjusting your filters to see more results'
                : 'Schedule your first interview to get started'}
            </p>
            <button
              style={styles.emptyButton}
              onClick={handleScheduleNew}
            >
              <Icons.Plus />
              Schedule Interview
            </button>
          </div>
        ) : (
          <div style={styles.interviewsList}>
            {filteredInterviews.map((interview) => {
              const status = getStatusBadge(interview.date);
              
              return (
                <div
                  key={interview.id}
                  style={styles.interviewCard}
                  className="interview-card"
                >
                  <div style={styles.interviewHeader}>
                    <div style={styles.candidateInfo}>
                      <div style={styles.candidateAvatar}>
                        {interview.candidateName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 style={styles.candidateName}>{interview.candidateName}</h3>
                        <p style={styles.candidatePosition}>{interview.position}</p>
                      </div>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      background: status.bg,
                      color: status.color
                    }}>
                      {status.label}
                    </span>
                  </div>

                  <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                      <Icons.Calendar />
                      <div>
                        <span style={styles.detailLabel}>Date</span>
                        <span style={styles.detailValue}>{formatDate(interview.date)}</span>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <Icons.Clock />
                      <div>
                        <span style={styles.detailLabel}>Time</span>
                        <span style={styles.detailValue}>{formatTime(interview.date)}</span>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      {getInterviewTypeIcon(interview.type)}
                      <div>
                        <span style={styles.detailLabel}>Type</span>
                        <span style={styles.detailValue}>
                          {interview.type?.charAt(0).toUpperCase() + interview.type?.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <Icons.Clock />
                      <div>
                        <span style={styles.detailLabel}>Duration</span>
                        <span style={styles.detailValue}>{interview.duration} min</span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.contactInfo}>
                    <div style={styles.contactItem}>
                      <Icons.Mail />
                      <span>{interview.candidateEmail}</span>
                    </div>
                    {interview.interviewer && (
                      <div style={styles.contactItem}>
                        <Icons.User />
                        <span>Interviewer: {interview.interviewer}</span>
                      </div>
                    )}
                  </div>

                  {interview.meetingLink && (
                    <div style={styles.meetingLink}>
                      <Icons.Link />
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        Join Meeting
                      </a>
                    </div>
                  )}

                  {interview.location && (
                    <div style={styles.location}>
                      <Icons.Location />
                      <span>{interview.location}</span>
                    </div>
                  )}

                  <div style={styles.interviewFooter}>
                    <div style={styles.footerLeft}>
                      <button
                        style={styles.actionButton}
                        onClick={() => handleSendReminder(interview)}
                      >
                        Send Reminder
                      </button>
                      <button
                        style={styles.actionButton}
                        onClick={() => handleReschedule(interview)}
                      >
                        Reschedule
                      </button>
                    </div>
                    <div style={styles.footerRight}>
                      <button
                        style={styles.cancelButton}
                        onClick={() => handleCancelInterview(interview.id)}
                      >
                        Cancel
                      </button>
                      <button
                        style={styles.viewButton}
                        onClick={() => navigate(`/company/applications/${interview.applicationId}`)}
                      >
                        View Application
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <InterviewScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
        onSuccess={handleInterviewScheduled}
      />
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
  scheduleButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
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
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    background: "white",
  },
  searchInput: {
    flex: 1,
    border: "none",
    fontSize: "0.875rem",
    outline: "none",
  },
  clearButton: {
    padding: "0.25rem",
    background: "transparent",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  filterActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
  },
  clearFiltersButton: {
    padding: "0.5rem 1rem",
    background: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
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
  },
  interviewsContainer: {
    background: "white",
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  interviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  interviewCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1.5rem",
    transition: "all 0.3s ease",
  },
  interviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
  },
  candidateInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  candidateAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  candidateName: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "0.25rem",
  },
  candidatePosition: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  statusBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: 600,
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "1rem",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  detailLabel: {
    display: "block",
    fontSize: "0.75rem",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "0.25rem",
  },
  detailValue: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
  },
  contactInfo: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "0.75rem",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  meetingLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    background: "#f0f9ff",
    borderRadius: "6px",
    marginBottom: "0.75rem",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    background: "#f3f4f6",
    borderRadius: "6px",
    marginBottom: "0.75rem",
    fontSize: "0.875rem",
    color: "#374151",
  },
  interviewFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1.25rem",
    paddingTop: "1.25rem",
    borderTop: "1px solid #e5e7eb",
  },
  footerLeft: {
    display: "flex",
    gap: "0.75rem",
  },
  footerRight: {
    display: "flex",
    gap: "0.75rem",
  },
  actionButton: {
    padding: "0.5rem 1rem",
    background: "white",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cancelButton: {
    padding: "0.5rem 1rem",
    background: "white",
    color: "#ef4444",
    border: "1px solid #ef4444",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  viewButton: {
    padding: "0.5rem 1rem",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  emptyIcon: {
    fontSize: "3rem",
    color: "#9ca3af",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.5rem",
  },
  emptyText: {
    color: "#6b7280",
    marginBottom: "1.5rem",
  },
  emptyButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
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
  selectorOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  selectorModal: {
    background: "white",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  selectorHeader: {
    padding: "1.5rem",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#1f2937",
  },
  closeButton: {
    padding: "0.5rem",
    background: "transparent",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
  },
  selectorContent: {
    padding: "1.5rem",
    overflowY: "auto",
  },
  selectorEmpty: {
    textAlign: "center",
    padding: "2rem",
    color: "#6b7280",
  },
  selectorButton: {
    marginTop: "1rem",
    padding: "0.75rem 1.5rem",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  selectorItem: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    marginBottom: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  selectorItemAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  selectorItemInfo: {
    flex: 1,
  },
  selectorItemInfo: {
    flex: 1,
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#1f2937",
      marginBottom: "0.25rem",
    },
    p: {
      fontSize: "0.875rem",
      color: "#3b82f6",
      marginBottom: "0.25rem",
    },
    span: {
      fontSize: "0.75rem",
      color: "#6b7280",
    }
  },
  selectorItemButton: {
    padding: "0.5rem 1rem",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  }
};

export default CompanyInterviews;