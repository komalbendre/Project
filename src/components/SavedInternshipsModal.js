import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// SVG Icons Component
const Icons = {
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  MapPin: () => (
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
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Bookmark: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  BookmarkFilled: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0h10" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const SavedInternshipsModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSavedInternships();
    }
  }, [isOpen]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'savedInternships') {
        loadSavedInternships();
      }
    };

    const handleCustomEvent = (e) => {
      loadSavedInternships();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('savedInternshipsUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('savedInternshipsUpdated', handleCustomEvent);
    };
  }, []);

  const loadSavedInternships = () => {
    setLoading(true);
    const saved = localStorage.getItem("savedInternships");
    if (saved) {
      setSavedInternships(JSON.parse(saved));
    } else {
      setSavedInternships([]);
    }
    setLoading(false);
  };

  const removeSavedInternship = (internshipId) => {
    const updated = savedInternships.filter(item => item._id !== internshipId);
    setSavedInternships(updated);
    localStorage.setItem("savedInternships", JSON.stringify(updated));
    
    // Dispatch event for dashboard to update count
    window.dispatchEvent(new CustomEvent('savedInternshipsUpdated', { 
      detail: { count: updated.length } 
    }));
  };

  const handleApply = (internshipId) => {
    onClose();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/apply/${internshipId}`);
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

  const formatStipend = (stipend) => {
    if (!stipend || !stipend.isPaid || stipend.amount === 0) {
      return "Unpaid";
    }
    const periodMap = {
      'month': 'month',
      'week': 'week',
      'lump-sum': 'total'
    };
    return `${stipend.currency} ${stipend.amount}/${periodMap[stipend.period] || 'month'}`;
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>
              <Icons.BookmarkFilled />
              Saved Internships
            </h2>
            <p style={styles.subtitle}>
              {savedInternships.length} {savedInternships.length === 1 ? 'internship' : 'internships'} saved for later
            </p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <Icons.Close />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading saved internships...</p>
            </div>
          ) : savedInternships.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Icons.Bookmark />
              </div>
              <h3 style={styles.emptyTitle}>No saved internships</h3>
              <p style={styles.emptyText}>
                Browse internships and click the bookmark icon to save them for later
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
          ) : (
            <div style={styles.internshipsList}>
              {savedInternships.map((internship) => (
                <div key={internship._id} style={styles.internshipCard}>
                  <div style={styles.cardHeader}>
                    <div style={styles.companyInfo}>
                      <div style={styles.companyAvatar}>
                        {internship.companyName?.charAt(0) || 'C'}
                      </div>
                      <div style={styles.companyDetails}>
                        <h4 style={styles.internshipTitle}>{internship.title}</h4>
                        <p style={styles.companyName}>{internship.companyName}</p>
                      </div>
                    </div>
                    <button
                      style={styles.removeButton}
                      onClick={() => removeSavedInternship(internship._id)}
                      title="Remove from saved"
                    >
                      <Icons.Trash />
                    </button>
                  </div>

                  <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                      <Icons.MapPin />
                      <span>{internship.location}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <Icons.Money />
                      <span>{formatStipend(internship.stipend)}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <Icons.Briefcase />
                      <span>{internship.duration || 'N/A'}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <Icons.Clock />
                      <span>{internship.experienceLevel || 'N/A'}</span>
                    </div>
                  </div>

                  {internship.applicationDeadline && (
                    <div style={styles.deadline}>
                      <Icons.Calendar />
                      <span>Apply by: {formatDate(internship.applicationDeadline)}</span>
                    </div>
                  )}

                  {internship.savedAt && (
                    <div style={styles.savedDate}>
                      Saved on {formatDate(internship.savedAt)}
                    </div>
                  )}

                  <div style={styles.cardFooter}>
                    <button
                      style={styles.viewButton}
                      onClick={() => {
                        // You can navigate to internship details page if you have one
                        alert(`View details for ${internship.title}`);
                      }}
                    >
                      View Details
                    </button>
                    <button
                      style={styles.applyButton}
                      onClick={() => handleApply(internship._id)}
                    >
                      Apply Now
                      <Icons.ArrowRight />
                    </button>
                  </div>
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
    maxWidth: '800px',
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
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  internshipsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  internshipCard: {
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
  internshipTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '4px',
  },
  companyName: {
    fontSize: '14px',
    color: '#475569',
  },
  removeButton: {
    padding: '8px',
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderRadius: '6px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    marginBottom: '12px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#475569',
  },
  deadline: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '8px',
    padding: '8px 12px',
    background: '#f8fafc',
    borderRadius: '6px',
  },
  savedDate: {
    fontSize: '11px',
    color: '#94a3b8',
    marginBottom: '16px',
  },
  cardFooter: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
  viewButton: {
    flex: 1,
    padding: '10px',
    background: 'white',
    color: '#334155',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  applyButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: 'linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
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

export default SavedInternshipsModal;