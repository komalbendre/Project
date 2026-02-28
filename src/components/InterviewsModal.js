import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// SVG Icons Component
const Icons = {
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Video: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Location: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Building: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Link: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
    </svg>
  ),
};

const InterviewsModal = ({ isOpen, onClose, userId }) => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    today: 0
  });

  useEffect(() => {
    if (isOpen && userId) {
      fetchInterviews();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    filterInterviews();
  }, [interviews, filter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Get all user applications
      const response = await axios.get(
        `http://localhost:5000/api/applications/user?limit=100`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Filter applications that have interviews scheduled
        const interviewApps = response.data.data.filter(app => app.interview?.scheduled);
        
        // Format interview data
        const formattedInterviews = interviewApps.map(app => ({
          id: app._id,
          companyName: app.company?.companyName || app.internship?.companyName || 'Company',
          position: app.internship?.title || 'Internship',
          date: app.interview.date,
          type: app.interview.type,
          duration: app.interview.duration,
          meetingLink: app.interview.meetingLink,
          location: app.interview.location,
          interviewer: app.interview.interviewer,
          status: getInterviewStatus(app.interview.date),
          appliedDate: app.appliedDate,
          internshipId: app.internshipId
        }));

        setInterviews(formattedInterviews);

        // Calculate stats
        const now = new Date();
        const today = new Date().setHours(0, 0, 0, 0);
        
        setStats({
          total: formattedInterviews.length,
          upcoming: formattedInterviews.filter(i => new Date(i.date) > now).length,
          completed: formattedInterviews.filter(i => new Date(i.date) < now).length,
          today: formattedInterviews.filter(i => {
            const interviewDate = new Date(i.date).setHours(0, 0, 0, 0);
            return interviewDate === today;
          }).length
        });
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const getInterviewStatus = (date) => {
    const now = new Date();
    const interviewDate = new Date(date);
    const diffDays = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
    
    if (interviewDate < now) {
      return 'completed';
    } else if (diffDays === 0) {
      return 'today';
    } else if (diffDays === 1) {
      return 'tomorrow';
    } else {
      return 'upcoming';
    }
  };

  const filterInterviews = () => {
    let filtered = [...interviews];

    if (filter === 'upcoming') {
      filtered = filtered.filter(i => i.status === 'upcoming' || i.status === 'tomorrow' || i.status === 'today');
    } else if (filter === 'completed') {
      filtered = filtered.filter(i => i.status === 'completed');
    } else if (filter === 'today') {
      filtered = filtered.filter(i => i.status === 'today');
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredInterviews(filtered);
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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'today':
        return { label: 'Today', color: '#f59e0b', bg: '#fef3c7' };
      case 'tomorrow':
        return { label: 'Tomorrow', color: '#3b82f6', bg: '#dbeafe' };
      case 'upcoming':
        return { label: 'Upcoming', color: '#8b5cf6', bg: '#ede9fe' };
      case 'completed':
        return { label: 'Completed', color: '#10b981', bg: '#d1fae5' };
      default:
        return { label: 'Scheduled', color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const getInterviewIcon = (type) => {
    switch(type) {
      case 'video': return <Icons.Video />;
      case 'phone': return <Icons.Phone />;
      case 'onsite': return <Icons.Location />;
      case 'technical': return <Icons.Link />;
      case 'hr': return <Icons.User />;
      default: return <Icons.Calendar />;
    }
  };

  const handleJoinMeeting = (link) => {
    window.open(link, '_blank');
  };

  const handleViewInternship = (internshipId) => {
    onClose();
    navigate(`/apply/${internshipId}`);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>
              <Icons.Calendar />
              My Interviews
            </h2>
            <p style={styles.subtitle}>
              Track and manage your upcoming interviews
            </p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <Icons.Close />
          </button>
        </div>

        {/* Stats Cards */}
        {interviews.length > 0 && (
          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#dbeafe', color: '#3b82f6' }}>
                <Icons.Calendar />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{stats.total}</div>
                <div style={styles.statLabel}>Total Interviews</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#fef3c7', color: '#f59e0b' }}>
                <Icons.Clock />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{stats.today}</div>
                <div style={styles.statLabel}>Today</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#ede9fe', color: '#8b5cf6' }}>
                <Icons.Calendar />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{stats.upcoming}</div>
                <div style={styles.statLabel}>Upcoming</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#d1fae5', color: '#10b981' }}>
                <Icons.Check />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statValue}>{stats.completed}</div>
                <div style={styles.statLabel}>Completed</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {interviews.length > 0 && (
          <div style={styles.filterTabs}>
            <button
              onClick={() => setFilter('all')}
              style={{
                ...styles.filterTab,
                ...(filter === 'all' && styles.filterTabActive)
              }}
            >
              All Interviews
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              style={{
                ...styles.filterTab,
                ...(filter === 'upcoming' && styles.filterTabActive)
              }}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('today')}
              style={{
                ...styles.filterTab,
                ...(filter === 'today' && styles.filterTabActive)
              }}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('completed')}
              style={{
                ...styles.filterTab,
                ...(filter === 'completed' && styles.filterTabActive)
              }}
            >
              Completed
            </button>
          </div>
        )}

        {/* Content */}
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading your interviews...</p>
            </div>
          ) : interviews.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Icons.Calendar />
              </div>
              <h3 style={styles.emptyTitle}>No interviews scheduled</h3>
              <p style={styles.emptyText}>
                When companies schedule interviews with you, they'll appear here.
              </p>
              <button
                style={styles.browseButton}
                onClick={() => {
                  onClose();
                  navigate("/jobs");
                }}
              >
                Browse Internships
              </button>
            </div>
          ) : filteredInterviews.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Icons.Filter />
              </div>
              <h3 style={styles.emptyTitle}>No interviews found</h3>
              <p style={styles.emptyText}>
                No {filter} interviews match your current filter.
              </p>
              <button
                style={styles.clearFilterButton}
                onClick={() => setFilter('all')}
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <div style={styles.interviewsList}>
              {filteredInterviews.map((interview) => {
                const status = getStatusBadge(interview.status);
                
                return (
                  <div key={interview.id} style={styles.interviewCard}>
                    <div style={styles.cardHeader}>
                      <div style={styles.companyInfo}>
                        <div style={styles.companyAvatar}>
                          {interview.companyName?.charAt(0) || 'C'}
                        </div>
                        <div style={styles.companyDetails}>
                          <h4 style={styles.companyName}>{interview.companyName}</h4>
                          <p style={styles.position}>{interview.position}</p>
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
                        {getInterviewIcon(interview.type)}
                        <div>
                          <span style={styles.detailLabel}>Type</span>
                          <span style={styles.detailValue}>
                            {interview.type?.charAt(0).toUpperCase() + interview.type?.slice(1) || 'Video'}
                          </span>
                        </div>
                      </div>
                      <div style={styles.detailItem}>
                        <Icons.Clock />
                        <div>
                          <span style={styles.detailLabel}>Duration</span>
                          <span style={styles.detailValue}>{interview.duration || 60} min</span>
                        </div>
                      </div>
                    </div>

                    {interview.interviewer && (
                      <div style={styles.interviewer}>
                        <Icons.User />
                        <span>Interviewer: {interview.interviewer}</span>
                      </div>
                    )}

                    {interview.meetingLink && interview.status !== 'completed' && (
                      <div style={styles.meetingLink}>
                        <Icons.Link />
                        <button
                          onClick={() => handleJoinMeeting(interview.meetingLink)}
                          style={styles.linkButton}
                        >
                          Join Meeting
                        </button>
                      </div>
                    )}

                    {interview.location && (
                      <div style={styles.location}>
                        <Icons.Location />
                        <span>{interview.location}</span>
                      </div>
                    )}

                    <div style={styles.cardFooter}>
                      <button
                        style={styles.viewButton}
                        onClick={() => handleViewInternship(interview.internshipId)}
                      >
                        View Internship
                      </button>
                      {interview.status === 'completed' && (
                        <span style={styles.completedTag}>Interview Completed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    animation: 'slideUp 0.3s ease-out',
  },
  header: {
    padding: '24px 28px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px 16px 0 0',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '4px',
    fontFamily: "'Inter', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    transition: 'all 0.2s',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    padding: '20px 28px 0',
  },
  statCard: {
    background: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0f172a',
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
    padding: '20px 28px 0',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
  },
  filterTab: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    background: 'white',
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterTabActive: {
    background: '#0073b1',
    color: 'white',
    borderColor: '#0073b1',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 28px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f1f5f9',
    borderTopColor: '#0073b1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    color: '#94a3b8',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
  },
  browseButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  clearFilterButton: {
    padding: '12px 24px',
    background: '#f1f5f9',
    color: '#334155',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  interviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  interviewCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  companyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  companyAvatar: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)',
    color: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 600,
  },
  companyDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '4px',
  },
  position: {
    fontSize: '14px',
    color: '#0073b1',
    fontWeight: 500,
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '16px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  detailLabel: {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '2px',
  },
  detailValue: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
  },
  interviewer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#475569',
    marginBottom: '12px',
    padding: '8px 12px',
    background: '#f8fafc',
    borderRadius: '6px',
  },
  meetingLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    padding: '8px 12px',
    background: '#f0f9ff',
    borderRadius: '6px',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#475569',
    marginBottom: '16px',
    padding: '8px 12px',
    background: '#f8fafc',
    borderRadius: '6px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  viewButton: {
    padding: '8px 16px',
    background: '#f1f5f9',
    color: '#334155',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  completedTag: {
    fontSize: '12px',
    color: '#10b981',
    fontWeight: 600,
  },
};

// Add global animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default InterviewsModal;