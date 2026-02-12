import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// SVG Icons Component
const Icons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
  Filter: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9 18 15 12 9 6" />
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
  Tag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
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

const Internships = () => {
  const navigate = useNavigate();
  
  // State for internships data
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    department: '',
    experienceLevel: '',
    isPaid: ''
  });

  // State for filter visibility on mobile
  const [showFilters, setShowFilters] = useState(false);

  // State for saved internships
  const [savedInternships, setSavedInternships] = useState([]);

  // Department options
  const departmentOptions = [
    "Computer Science",
    "Engineering",
    "Design",
    "Business",
    "Marketing",
    "Data Science"
  ];

  // Experience level options
  const experienceOptions = [
    "Beginner",
    "Intermediate",
    "Advanced"
  ];

  // Type options
  const typeOptions = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "Onsite" },
    { value: "hybrid", label: "Hybrid" }
  ];

  useEffect(() => {
    fetchInternships();
    loadSavedInternships();
  }, [pagination.page, filters]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'savedInternships') {
        loadSavedInternships();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);
      
      if (filters.search) params.append('search', filters.search);
      if (filters.location) params.append('location', filters.location);
      if (filters.type) params.append('type', filters.type);
      if (filters.department) params.append('department', filters.department);
      if (filters.experienceLevel) params.append('experienceLevel', filters.experienceLevel);
      
      const response = await axios.get(
        `http://localhost:5000/api/internships?${params.toString()}`
      );

      if (response.data.success) {
        setInternships(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      setError("Failed to load internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedInternships = () => {
    const saved = localStorage.getItem("savedInternships");
    if (saved) {
      setSavedInternships(JSON.parse(saved));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      department: '',
      experienceLevel: '',
      isPaid: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleApply = (internshipId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/apply/${internshipId}`);
  };

  const toggleSaveInternship = (internship) => {
    let updated = [...savedInternships];
    const index = updated.findIndex(item => item._id === internship._id);
    
    if (index === -1) {
      // Save internship with more details
      updated.push({
        _id: internship._id,
        title: internship.title,
        companyName: internship.companyName,
        location: internship.location,
        stipend: internship.stipend,
        duration: internship.duration,
        experienceLevel: internship.experienceLevel,
        applicationDeadline: internship.applicationDeadline,
        savedAt: new Date().toISOString()
      });
    } else {
      // Remove from saved
      updated.splice(index, 1);
    }
    
    setSavedInternships(updated);
    localStorage.setItem("savedInternships", JSON.stringify(updated));
    
    // Dispatch custom event for dashboard to listen
    window.dispatchEvent(new CustomEvent('savedInternshipsUpdated', { 
      detail: { count: updated.length } 
    }));
  };

  const isSaved = (internshipId) => {
    return savedInternships.some(item => item._id === internshipId);
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

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && internships.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading internships...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .internship-card {
          animation: fadeIn 0.3s ease-out;
        }
        .filter-toggle {
          display: none;
        }
        @media (max-width: 768px) {
          .filter-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            z-index: 1000;
            padding: 20px;
            overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          .filter-sidebar.active {
            transform: translateX(0);
          }
          .filter-toggle {
            display: flex;
          }
          .desktop-only {
            display: none;
          }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Find Your Perfect Internship</h1>
          <p style={styles.subtitle}>
            Discover opportunities from top companies and kickstart your career
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <Icons.Search />
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search by title, company, or skills..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          {filters.search && (
            <button
              style={styles.clearButton}
              onClick={() => handleFilterChange('search', '')}
            >
              <Icons.X />
            </button>
          )}
        </div>
        <button
          style={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle"
        >
          <Icons.Filter />
          Filters
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Filters Sidebar */}
        <div 
          style={{
            ...styles.filterSidebar,
            ...(showFilters && styles.filterSidebarActive)
          }}
          className={`filter-sidebar ${showFilters ? 'active' : ''}`}
        >
          <div style={styles.filterHeader}>
            <h3 style={styles.filterTitle}>
              <Icons.Filter />
              Filters
            </h3>
            <button
              style={styles.closeFilters}
              onClick={() => setShowFilters(false)}
              className="filter-toggle"
            >
              <Icons.X />
            </button>
          </div>

          {/* Location Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Location</label>
            <input
              type="text"
              style={styles.filterInput}
              placeholder="City, State, or Remote"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          {/* Work Type Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Work Type</label>
            <select
              style={styles.filterSelect}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Department</label>
            <select
              style={styles.filterSelect}
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="">All Departments</option>
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Experience Level Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Experience Level</label>
            <select
              style={styles.filterSelect}
              value={filters.experienceLevel}
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            >
              <option value="">All Levels</option>
              {experienceOptions.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Stipend Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Stipend</label>
            <select
              style={styles.filterSelect}
              value={filters.isPaid}
              onChange={(e) => handleFilterChange('isPaid', e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Paid</option>
              <option value="false">Unpaid</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            style={styles.clearFiltersButton}
            onClick={clearFilters}
          >
            Clear All Filters
          </button>
        </div>

        {/* Internships Grid */}
        <div style={styles.internshipsGrid}>
          {error ? (
            <div style={styles.errorState}>
              <Icons.Info />
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button style={styles.retryButton} onClick={fetchInternships}>
                Try Again
              </button>
            </div>
          ) : internships.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>💼</div>
              <h3 style={styles.emptyTitle}>No internships found</h3>
              <p style={styles.emptyText}>
                Try adjusting your filters or search criteria
              </p>
              <button
                style={styles.clearFiltersButton}
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div style={styles.resultsHeader}>
                <p style={styles.resultsCount}>
                  Showing {internships.length} of {pagination.total} internships
                </p>
              </div>

              {/* Internship Cards */}
              {internships.map((internship) => (
                <div
                  key={internship._id}
                  style={styles.internshipCard}
                  className="internship-card"
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.companyInfo}>
                      <div style={styles.companyAvatar}>
                        {internship.companyName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 style={styles.internshipTitle}>{internship.title}</h3>
                        <p style={styles.companyName}>{internship.companyName}</p>
                      </div>
                    </div>
                    <button
                      style={styles.saveButton}
                      onClick={() => toggleSaveInternship(internship)}
                    >
                      {isSaved(internship._id) ? <Icons.BookmarkFilled /> : <Icons.Bookmark />}
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
                      <span>{internship.duration}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <Icons.Clock />
                      <span>{internship.experienceLevel}</span>
                    </div>
                  </div>

                  <p style={styles.description}>
                    {internship.description?.length > 150
                      ? `${internship.description.substring(0, 150)}...`
                      : internship.description}
                  </p>

                  {internship.skills && internship.skills.length > 0 && (
                    <div style={styles.skillsContainer}>
                      {internship.skills.slice(0, 4).map((skill, index) => (
                        <span key={index} style={styles.skillTag}>
                          {skill}
                        </span>
                      ))}
                      {internship.skills.length > 4 && (
                        <span style={styles.skillTag}>+{internship.skills.length - 4}</span>
                      )}
                    </div>
                  )}

                  <div style={styles.cardFooter}>
                    <div style={styles.deadline}>
                      <Icons.Calendar />
                      <span>
                        Apply by: {new Date(internship.applicationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      style={styles.applyButton}
                      onClick={() => handleApply(internship._id)}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={styles.pagination}>
                  <button
                    style={styles.pageButton}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <Icons.ChevronLeft />
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      Math.abs(pageNum - pagination.page) <= 1
                    ) {
                      return (
                        <button
                          key={pageNum}
                          style={{
                            ...styles.pageButton,
                            ...(pagination.page === pageNum && styles.pageButtonActive)
                          }}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === 2 ||
                      pageNum === pagination.totalPages - 1
                    ) {
                      return <span key={pageNum} style={styles.pageEllipsis}>...</span>;
                    }
                    return null;
                  })}

                  <button
                    style={styles.pageButton}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    <Icons.ChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    minHeight: "100vh",
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
    border: "4px solid #e2e8f0",
    borderTopColor: "#0073b1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  loadingText: {
    color: "#64748b",
    fontSize: "16px",
  },
  header: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    padding: "60px 24px",
    marginBottom: "32px",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 800,
    color: "white",
    marginBottom: "16px",
    fontFamily: "'Inter', sans-serif",
  },
  subtitle: {
    fontSize: "clamp(1rem, 2vw, 1.25rem)",
    color: "#cbd5e1",
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchContainer: {
    maxWidth: "1200px",
    margin: "0 auto 32px",
    padding: "0 24px",
    display: "flex",
    gap: "16px",
  },
  searchWrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  searchInput: {
    flex: 1,
    padding: "14px 0",
    border: "none",
    fontSize: "16px",
    outline: "none",
    background: "transparent",
  },
  clearButton: {
    padding: "6px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
  },
  filterToggle: {
    display: "none",
    alignItems: "center",
    gap: "8px",
    padding: "0 20px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  mainContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "32px",
  },
  filterSidebar: {
    background: "white",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    height: "fit-content",
    position: "sticky",
    top: "24px",
  },
  filterSidebarActive: {
    transform: "translateX(0)",
  },
  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  filterTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  closeFilters: {
    display: "none",
    padding: "8px",
    background: "transparent",
    border: "none",
    color: "#64748b",
    cursor: "pointer",
  },
  filterGroup: {
    marginBottom: "20px",
  },
  filterLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "8px",
  },
  filterInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  filterSelect: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    background: "white",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    backgroundSize: "16px",
    paddingRight: "40px",
  },
  clearFiltersButton: {
    width: "100%",
    padding: "12px",
    background: "#f1f5f9",
    color: "#334155",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "8px",
  },
  internshipsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  resultsCount: {
    fontSize: "14px",
    color: "#64748b",
  },
  internshipCard: {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  companyInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  companyAvatar: {
    width: "56px",
    height: "56px",
    background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
    color: "white",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: 600,
  },
  internshipTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "4px",
  },
  companyName: {
    fontSize: "16px",
    color: "#475569",
  },
  saveButton: {
    padding: "8px",
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#475569",
  },
  description: {
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#334155",
    marginBottom: "16px",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "20px",
  },
  skillTag: {
    padding: "6px 12px",
    background: "#f1f5f9",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#334155",
    fontWeight: 500,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  deadline: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#64748b",
  },
  applyButton: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "32px",
  },
  pageButton: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    background: "white",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pageButtonActive: {
    background: "#0073b1",
    color: "white",
    borderColor: "#0073b1",
  },
  pageEllipsis: {
    color: "#64748b",
    fontSize: "14px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "24px",
  },
  errorState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "white",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  retryButton: {
    padding: "12px 24px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "16px",
  },
};

// Add missing Email icon
Icons.Email = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

export default Internships;