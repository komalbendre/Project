import React, { useState, useEffect } from "react";
import axios from "axios";

// SVG Icons Component
const Icons = {
  // Navigation & Actions
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  
  // Status Icons
  Pending: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Reviewed: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Shortlisted: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Accepted: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Rejected: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Withdrawn: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  AllApplications: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  ),
  
  // Detail Icons
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Location: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Money: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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
  
  // Contact Icons
  Email: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  GitHub: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  
  // Document Icons
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Resume: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  
  // Section Icons
  CoverLetter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  ),
  Contact: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Interview: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  ),
  Offer: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </svg>
  ),
  
  // Misc
  External: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  EmptyState: () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="15" x2="13" y2="15" />
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const ApplicationsModal = ({ isOpen, onClose, userId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen && userId) {
      fetchApplications();
    }
  }, [isOpen, userId, filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      let url = `http://localhost:5000/api/applications/user`;
      if (filter !== 'all') {
        url += `?status=${filter}`;
      }
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'shortlisted': return '#8b5cf6';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'withdrawn': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Icons.Pending />;
      case 'reviewed': return <Icons.Reviewed />;
      case 'shortlisted': return <Icons.Shortlisted />;
      case 'accepted': return <Icons.Accepted />;
      case 'rejected': return <Icons.Rejected />;
      case 'withdrawn': return <Icons.Withdrawn />;
      default: return <Icons.FileText />;
    }
  };

  const getStatusBadgeStyle = (status) => {
    const color = getStatusColor(status);
    return {
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      background: `${color}15`,
      color: color,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
    };
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>My Applications</h2>
            <p style={styles.subtitle}>
              Track and manage your internship applications
            </p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <Icons.Close />
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                ...styles.filterTab,
                ...(filter === status && styles.filterTabActive),
                color: filter === status ? getStatusColor(status === 'all' ? 'pending' : status) : '#64748b',
                borderColor: filter === status ? getStatusColor(status === 'all' ? 'pending' : status) : '#e2e8f0',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {status === 'all' ? <Icons.AllApplications /> : getStatusIcon(status)}
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Icons.EmptyState />
              </div>
              <h3 style={styles.emptyTitle}>No applications found</h3>
              <p style={styles.emptyText}>
                {filter === 'all' 
                  ? "You haven't applied to any internships yet."
                  : `No ${filter} applications found.`}
              </p>
              <button
                style={styles.browseButton}
                onClick={() => {
                  onClose();
                  window.location.href = '/career-paths';
                }}
              >
                Browse Internships
              </button>
            </div>
          ) : (
            <div style={styles.applicationsList}>
              {applications.map((app) => (
                <div
                  key={app._id}
                  style={styles.applicationCard}
                  onClick={() => setSelectedApplication(selectedApplication?._id === app._id ? null : app)}
                >
                  {/* Main Content */}
                  <div style={styles.cardHeader}>
                    <div style={styles.companyInfo}>
                      <div style={styles.companyAvatar}>
                        {app.company?.companyName?.charAt(0) || app.internship?.companyName?.charAt(0) || 'C'}
                      </div>
                      <div style={styles.companyDetails}>
                        <h4 style={styles.companyName}>
                          {app.company?.companyName || app.internship?.companyName || 'Company'}
                        </h4>
                        <p style={styles.position}>{app.internship?.title}</p>
                      </div>
                    </div>
                    <span style={getStatusBadgeStyle(app.status)}>
                      {getStatusIcon(app.status)} {app.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>
                        <Icons.Calendar />
                      </span>
                      <div>
                        <span style={styles.detailLabel}>Applied</span>
                        <span style={styles.detailValue}>{formatDate(app.appliedDate)}</span>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>
                        <Icons.Location />
                      </span>
                      <div>
                        <span style={styles.detailLabel}>Location</span>
                        <span style={styles.detailValue}>{app.internship?.location || 'Remote'}</span>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>
                        <Icons.Money />
                      </span>
                      <div>
                        <span style={styles.detailLabel}>Stipend</span>
                        <span style={styles.detailValue}>
                          {app.internship?.stipend?.isPaid 
                            ? `$${app.internship.stipend.amount}/${app.internship.stipend.period}`
                            : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailIcon}>
                        <Icons.Clock />
                      </span>
                      <div>
                        <span style={styles.detailLabel}>Duration</span>
                        <span style={styles.detailValue}>{app.internship?.duration || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {app.skills && app.skills.length > 0 && (
                    <div style={styles.skillsContainer}>
                      {app.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} style={styles.skillTag}>{skill}</span>
                      ))}
                      {app.skills.length > 5 && (
                        <span style={styles.skillTag}>+{app.skills.length - 5}</span>
                      )}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {selectedApplication?._id === app._id && (
                    <div style={styles.expandedDetails}>
                      <div style={styles.divider} />
                      
                      {/* Cover Letter */}
                      {app.coverLetter && (
                        <div style={styles.section}>
                          <h5 style={styles.sectionTitle}>
                            <span style={styles.sectionIcon}>
                              <Icons.CoverLetter />
                            </span>
                            Cover Letter
                          </h5>
                          <p style={styles.coverLetter}>{app.coverLetter}</p>
                        </div>
                      )}

                      {/* Contact Information */}
                      <div style={styles.section}>
                        <h5 style={styles.sectionTitle}>
                          <span style={styles.sectionIcon}>
                            <Icons.Contact />
                          </span>
                          Contact Information
                        </h5>
                        <div style={styles.contactGrid}>
                          <div style={styles.contactItem}>
                            <span style={styles.contactIcon}>
                              <Icons.Email />
                            </span>
                            <span>{app.email}</span>
                          </div>
                          <div style={styles.contactItem}>
                            <span style={styles.contactIcon}>
                              <Icons.Phone />
                            </span>
                            <span>{app.phone || 'Not provided'}</span>
                          </div>
                          {app.linkedinUrl && (
                            <div style={styles.contactItem}>
                              <span style={styles.contactIcon}>
                                <Icons.Linkedin />
                              </span>
                              <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                LinkedIn
                              </a>
                            </div>
                          )}
                          {app.githubUrl && (
                            <div style={styles.contactItem}>
                              <span style={styles.contactIcon}>
                                <Icons.GitHub />
                              </span>
                              <a href={app.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                GitHub
                              </a>
                            </div>
                          )}
                          {app.portfolioUrl && (
                            <div style={styles.contactItem}>
                              <span style={styles.contactIcon}>
                                <Icons.Globe />
                              </span>
                              <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                                Portfolio
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Resume */}
                      <div style={styles.section}>
                        <h5 style={styles.sectionTitle}>
                          <span style={styles.sectionIcon}>
                            <Icons.Resume />
                          </span>
                          Resume
                        </h5>
                        <a 
                          href={app.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={styles.resumeLink}
                        >
                          <span style={styles.resumeIcon}>
                            <Icons.FileText />
                          </span>
                          View Resume
                          <span style={styles.externalIcon}>
                            <Icons.External />
                          </span>
                        </a>
                      </div>

                      {/* Interview Details */}
                      {app.interview?.scheduled && (
                        <div style={{ ...styles.section, ...styles.interviewSection }}>
                          <h5 style={{ ...styles.sectionTitle, color: '#3b82f6' }}>
                            <span style={styles.sectionIcon}>
                              <Icons.Interview />
                            </span>
                            Interview Scheduled
                          </h5>
                          <div style={styles.interviewDetails}>
                            <div style={styles.interviewItem}>
                              <span>Date:</span>
                              <strong>{new Date(app.interview.date).toLocaleDateString()}</strong>
                            </div>
                            <div style={styles.interviewItem}>
                              <span>Type:</span>
                              <strong style={{ textTransform: 'capitalize' }}>{app.interview.type}</strong>
                            </div>
                            {app.interview.duration && (
                              <div style={styles.interviewItem}>
                                <span>Duration:</span>
                                <strong>{app.interview.duration} minutes</strong>
                              </div>
                            )}
                            {app.interview.meetingLink && (
                              <a 
                                href={app.interview.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={styles.meetingLink}
                              >
                                Join Meeting
                                <Icons.External />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Offer Details */}
                      {app.offer?.made && (
                        <div style={{ ...styles.section, ...styles.offerSection }}>
                          <h5 style={{ ...styles.sectionTitle, color: '#10b981' }}>
                            <span style={styles.sectionIcon}>
                              <Icons.Offer />
                            </span>
                            Offer Received
                          </h5>
                          <div style={styles.offerDetails}>
                            <div style={styles.offerItem}>
                              <span>Stipend:</span>
                              <strong>
                                {app.offer.stipend.currency} {app.offer.stipend.amount}/{app.offer.stipend.period}
                              </strong>
                            </div>
                            {app.offer.date && (
                              <div style={styles.offerItem}>
                                <span>Offered on:</span>
                                <strong>{formatDate(app.offer.date)}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
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
    ':hover': {
      background: '#f1f5f9',
      color: '#0f172a',
    }
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
    padding: '20px 28px 0',
    overflowX: 'auto',
    scrollbarWidth: 'none',
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
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  filterTabActive: {
    background: 'white',
    borderWidth: '2px',
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
    opacity: 0.5,
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
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  applicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  applicationCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.2s',
    cursor: 'pointer',
    ':hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      borderColor: '#cbd5e1',
    }
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
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  detailIcon: {
    fontSize: '18px',
    width: '24px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  skillTag: {
    padding: '4px 12px',
    background: '#f1f5f9',
    borderRadius: '16px',
    fontSize: '12px',
    color: '#334155',
  },
  expandedDetails: {
    marginTop: '20px',
  },
  divider: {
    height: '1px',
    background: '#e2e8f0',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '16px',
  },
  sectionIcon: {
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverLetter: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#475569',
    background: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#334155',
  },
  contactIcon: {
    fontSize: '14px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    color: '#0073b1',
    textDecoration: 'none',
    fontWeight: 500,
    ':hover': {
      textDecoration: 'underline',
    }
  },
  resumeLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#f0f7ff',
    borderRadius: '8px',
    color: '#0073b1',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s',
    ':hover': {
      background: '#e6f0fa',
    }
  },
  resumeIcon: {
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  externalIcon: {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  interviewSection: {
    background: '#f0f9ff',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #bae6fd',
  },
  interviewDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  interviewItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  meetingLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#3b82f6',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 500,
    marginTop: '8px',
    ':hover': {
      background: '#2563eb',
    }
  },
  offerSection: {
    background: '#f0fdf4',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
  },
  offerDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  offerItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
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

export default ApplicationsModal;