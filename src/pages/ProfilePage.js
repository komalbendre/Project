import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log("ProfilePage: Fetching profile for userId:", userId);
        
        // Try to get profile directly from the API
        try {
          const response = await axios.get(
            `http://localhost:5000/api/profile/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log("PROFILE API RESPONSE:", response.data);

          if (response.data.success && response.data.data) {
            setUser(response.data.data);
            setLoading(false);
            return;
          }
        } catch (profileErr) {
          console.log("Profile fetch error:", profileErr);
          
          // If profile doesn't exist, try to get user data
          if (profileErr.response?.status === 404) {
            try {
              const userResponse = await axios.get(
                `http://localhost:5000/api/users/me`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              const userData = userResponse.data.data || userResponse.data;
              
              setUser({
                fullName: `${userData.fname} ${userData.lname}`.trim() || "User",
                email: userData.email || "No email provided",
                phone: "",
                bio: "",
                technicalSkills: [],
                softSkills: [],
                linkedin: "",
                github: "",
                portfolio: "",
                location: "",
                experience: [],
                education: [{
                  institution: "",
                  degree: "",
                  fieldOfStudy: "",
                  startYear: "",
                  endYear: "",
                  currentlyStudying: false,
                  gradeCGPA: "",
                  subjectsCourses: ""
                }],
                certifications: [],
                projects: []
              });
            } catch (userErr) {
              console.error("Could not fetch user info:", userErr);
              setError("Failed to load user information");
            }
          } else {
            setError("Failed to load profile. Please try again.");
          }
        }
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  const getInitials = (name) => {
    if (!name || name === "User") return "U";
    return name
      .split(" ")
      .map(n => n?.[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const openLink = (url) => {
    if (!url) return;
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(formattedUrl, "_blank");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatYear = (year) => {
    if (!year) return "Not specified";
    return year;
  };

  const parseLocation = (location) => {
    if (!location) return { cityState: "", country: "" };
    const parts = location.split(',').map(part => part.trim());
    if (parts.length > 1) {
      return {
        cityState: parts[0],
        country: parts.slice(1).join(', ')
      };
    }
    return {
      cityState: location,
      country: ""
    };
  };

  const styles = {
    global: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { transform: translateX(-10px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      .hover-lift {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .hover-lift:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }
    `,

    container: {
      maxWidth: "1000px",
      margin: "2rem auto",
      padding: "0 1.5rem",
      animation: "fadeIn 0.5s ease-out",
    },

    backButton: {
      background: "white",
      border: "1px solid #e2e8f0",
      color: "#475569",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.95rem",
      marginBottom: "1.5rem",
      padding: "0.75rem 1.25rem",
      borderRadius: "10px",
      transition: "all 0.2s",
      fontWeight: "500",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    },

    card: {
      background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
      overflow: "hidden",
      marginBottom: "1.5rem",
      animation: "slideIn 0.3s ease-out",
    },

    header: {
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      color: "white",
      padding: "2.5rem 2rem",
      display: "flex",
      alignItems: "center",
      gap: "2rem",
      flexWrap: "wrap",
    },

    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2.5rem",
      fontWeight: "600",
      flexShrink: 0,
      boxShadow: "0 4px 12px rgba(0, 115, 177, 0.3)",
      border: "3px solid rgba(255,255,255,0.2)",
    },

    headerContent: {
      flex: 1,
      minWidth: "250px",
    },

    title: {
      fontSize: "2.25rem",
      fontWeight: "700",
      margin: "0 0 0.5rem 0",
      fontFamily: "'Inter', sans-serif",
    },

    subtitle: {
      fontSize: "1.1rem",
      opacity: 0.9,
      margin: "0 0 0.5rem 0",
      fontWeight: "400",
    },

    location: {
      fontSize: "0.95rem",
      opacity: 0.8,
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },

    buttonGroup: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      marginTop: "1.5rem",
    },

    button: {
      padding: "0.75rem 1.75rem",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s",
      fontSize: "0.95rem",
      fontFamily: "'Inter', sans-serif",
    },

    primaryButton: {
      background: "linear-gradient(135deg, #0073b1, #00a0dc)",
      color: "white",
      boxShadow: "0 4px 12px rgba(0, 115, 177, 0.3)",
    },

    outlineButton: {
      background: "rgba(255,255,255,0.1)",
      color: "white",
      border: "1px solid rgba(255,255,255,0.3)",
      backdropFilter: "blur(10px)",
    },

    content: {
      padding: "2.5rem",
    },

    section: {
      marginBottom: "2.5rem",
    },

    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "700",
      marginBottom: "1.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      color: "#0f172a",
      fontFamily: "'Inter', sans-serif",
    },

    divider: {
      height: "2px",
      background: "linear-gradient(90deg, #e2e8f0 0%, #e2e8f0 50%, transparent 100%)",
      margin: "1rem 0 1.5rem",
    },

    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1.5rem",
    },

    infoItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "1rem",
      padding: "1rem",
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      transition: "all 0.2s",
    },

    icon: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      background: "#f1f5f9",
      color: "#0073b1",
    },

    infoContent: {
      flex: 1,
    },

    infoLabel: {
      fontSize: "0.75rem",
      color: "#64748b",
      marginBottom: "0.25rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      fontWeight: "600",
    },

    infoValue: {
      fontSize: "1rem",
      color: "#0f172a",
      margin: 0,
      fontWeight: "500",
      lineHeight: 1.5,
    },

    bio: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      lineHeight: "1.7",
      whiteSpace: "pre-wrap",
      margin: 0,
      border: "1px solid #e2e8f0",
      color: "#334155",
      fontSize: "0.95rem",
    },

    skillsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.75rem",
    },

    skillChip: {
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      color: "#0369a1",
      padding: "0.6rem 1.25rem",
      borderRadius: "30px",
      fontSize: "0.875rem",
      fontWeight: "600",
      border: "1px solid #bae6fd",
      transition: "all 0.2s",
    },

    experienceItem: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      marginBottom: "1rem",
    },

    experienceTitle: {
      fontSize: "1.1rem",
      fontWeight: "600",
      color: "#0f172a",
      marginBottom: "0.5rem",
    },

    experienceMeta: {
      color: "#64748b",
      fontSize: "0.9rem",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      flexWrap: "wrap",
    },

    experienceDescription: {
      color: "#475569",
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },

    emptyState: {
      textAlign: "center",
      padding: "3rem",
      background: "white",
      borderRadius: "12px",
      border: "1px dashed #cbd5e1",
      color: "#64748b",
    },

    emptyStateIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      opacity: 0.5,
    },

    footer: {
      background: "white",
      padding: "1.25rem",
      borderRadius: "12px",
      textAlign: "center",
      color: "#64748b",
      fontSize: "0.875rem",
      border: "1px solid #e2e8f0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
    },

    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%)",
    },

    spinner: {
      width: "56px",
      height: "56px",
      border: "4px solid rgba(0, 115, 177, 0.1)",
      borderTopColor: "#0073b1",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },

    errorContainer: {
      textAlign: "center",
      padding: "3rem",
      background: "white",
      borderRadius: "16px",
      border: "1px solid #fee2e2",
      boxShadow: "0 4px 20px rgba(239, 68, 68, 0.1)",
    },

    errorText: {
      color: "#b91c1c",
      marginBottom: "1.5rem",
      fontSize: "1.1rem",
    },

    linkText: {
      color: "#0073b1",
      cursor: "pointer",
      fontWeight: "600",
      textDecoration: "none",
      borderBottom: "2px solid transparent",
      transition: "border-color 0.2s",
      display: "inline-block",
    },

    // Portfolio card styles
    portfolioCard: {
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      padding: "1.5rem",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      marginTop: "1rem",
    },

    portfolioLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem 1rem",
      background: "white",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      color: "#0f172a",
      textDecoration: "none",
      fontSize: "0.95rem",
      fontWeight: "500",
      transition: "all 0.2s",
    },

    // Grade badge styles
    gradeBadge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.75rem",
      background: "#f1f5f9",
      borderRadius: "20px",
      fontSize: "0.875rem",
      color: "#475569",
      border: "1px solid #cbd5e1",
    },

    // Currently studying badge
    studyingBadge: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.75rem",
      background: "#dbeafe",
      color: "#1e40af",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      border: "1px solid #bfdbfe",
    },
  };

  // Icons as SVG components
  const Icons = {
    back: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    ),
    edit: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    ),
    contact: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    email: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    phone: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    about: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <circle cx="12" cy="8" r="0.5" fill="currentColor" />
      </svg>
    ),
    skills: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    technicalSkills: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    softSkills: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    linkedin: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    github: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
    portfolio: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    experience: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    education: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    projects: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    certifications: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    calendar: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    location: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    award: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    building: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="16" y2="11" />
        <line x1="8" y1="15" x2="16" y2="15" />
        <line x1="8" y1="19" x2="12" y2="19" />
      </svg>
    ),
    graduation: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    project: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    external: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <style>{styles.global}</style>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <style>{styles.global}</style>
        <div style={styles.errorContainer}>
          <div style={{ marginBottom: "1.5rem" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="0.5" fill="#b91c1c" />
            </svg>
          </div>
          <p style={styles.errorText}>{error}</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              style={{ ...styles.button, ...styles.outlineButton, color: "#0073b1", borderColor: "#0073b1", background: "white" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f9ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
              }}
              onClick={() => navigate(-1)}
            >
              {Icons.back}
              Go Back
            </button>
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #006097, #0084b3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #0073b1, #00a0dc)";
              }}
              onClick={() => navigate("/profile-form")}
            >
              {Icons.edit}
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <style>{styles.global}</style>
        <div style={{ ...styles.errorContainer, borderColor: "#e2e8f0" }}>
          <div style={{ marginBottom: "1.5rem", opacity: 0.5 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p style={{ ...styles.errorText, color: "#475569" }}>
            No profile data found
          </p>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #006097, #0084b3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #0073b1, #00a0dc)";
            }}
            onClick={() => navigate("/profile-form")}
          >
            {Icons.edit}
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  const location = parseLocation(user.location);
  const allTechnicalSkills = user.technicalSkills || [];
  const allSoftSkills = user.softSkills || [];
  const hasAnySkills = allTechnicalSkills.length > 0 || allSoftSkills.length > 0;
  const hasSocialLinks = user.linkedin || user.github || user.portfolio;

  return (
    <div style={styles.container}>
      <style>{styles.global}</style>

      {/* Back Button */}
      <button
        style={styles.backButton}
        className="hover-lift"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f8fafc";
          e.currentTarget.style.borderColor = "#cbd5e1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = "#e2e8f0";
        }}
        onClick={() => navigate(-1)}
      >
        {Icons.back}
        Back to Dashboard
      </button>

      {/* Profile Card */}
      <div style={styles.card} className="hover-lift">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {getInitials(user.fullName)}
          </div>
          <div style={styles.headerContent}>
            <h1 style={styles.title}>
              {user.fullName || "User"}
            </h1>
            <p style={styles.subtitle}>
              {user.email || "No email provided"}
            </p>
            {(location.cityState || location.country) && (
              <p style={styles.location}>
                {Icons.location}
                {[location.cityState, location.country].filter(Boolean).join(', ')}
              </p>
            )}
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.outlineButton }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                onClick={() => navigate("/profile-form")}
              >
                {Icons.edit}
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Contact Information */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.icon}>{Icons.contact}</span>
              Contact Information
            </h2>
            <div style={styles.divider} />
            
            <div style={styles.infoGrid}>
              <div style={styles.infoItem} className="hover-lift">
                <span style={styles.icon}>{Icons.email}</span>
                <div style={styles.infoContent}>
                  <div style={styles.infoLabel}>Email</div>
                  <p style={styles.infoValue}>
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div style={styles.infoItem} className="hover-lift">
                <span style={styles.icon}>{Icons.phone}</span>
                <div style={styles.infoContent}>
                  <div style={styles.infoLabel}>Phone</div>
                  <p style={styles.infoValue}>
                    {user.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {user.bio && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.icon}>{Icons.about}</span>
                About
              </h2>
              <div style={styles.divider} />
              <p style={styles.bio}>
                {user.bio}
              </p>
            </div>
          )}

          {/* Skills Section - Separate Technical and Soft Skills */}
          {hasAnySkills && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.icon}>{Icons.skills}</span>
                Skills & Expertise
              </h2>
              <div style={styles.divider} />

              {/* Technical Skills */}
              {allTechnicalSkills.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span style={{ ...styles.icon, width: "32px", height: "32px" }}>{Icons.technicalSkills}</span>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#0f172a" }}>Technical Skills</h3>
                  </div>
                  <div style={styles.skillsContainer}>
                    {allTechnicalSkills.map((skill, index) => (
                      <span key={index} style={styles.skillChip} className="hover-lift">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {allSoftSkills.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                    <span style={{ ...styles.icon, width: "32px", height: "32px" }}>{Icons.softSkills}</span>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#0f172a" }}>Soft Skills</h3>
                  </div>
                  <div style={styles.skillsContainer}>
                    {allSoftSkills.map((skill, index) => (
                      <span key={index} style={{ ...styles.skillChip, background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", color: "#166534", borderColor: "#86efac" }} className="hover-lift">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Social Links & Portfolio Section */}
          {hasSocialLinks && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.icon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </span>
                Social Profiles & Portfolio
              </h2>
              <div style={styles.divider} />
              
              <div style={styles.infoGrid}>
                {user.linkedin && (
                  <div style={styles.infoItem} className="hover-lift">
                    <span style={styles.icon}>{Icons.linkedin}</span>
                    <div style={styles.infoContent}>
                      <div style={styles.infoLabel}>LinkedIn</div>
                      <p
                        style={{ ...styles.infoValue, ...styles.linkText }}
                        onClick={() => openLink(user.linkedin)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderBottomColor = "#0073b1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderBottomColor = "transparent";
                        }}
                      >
                        {user.linkedin}
                      </p>
                    </div>
                  </div>
                )}

                {user.github && (
                  <div style={styles.infoItem} className="hover-lift">
                    <span style={styles.icon}>{Icons.github}</span>
                    <div style={styles.infoContent}>
                      <div style={styles.infoLabel}>GitHub</div>
                      <p
                        style={{ ...styles.infoValue, ...styles.linkText }}
                        onClick={() => openLink(user.github)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderBottomColor = "#0073b1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderBottomColor = "transparent";
                        }}
                      >
                        {user.github}
                      </p>
                    </div>
                  </div>
                )}

                {user.portfolio && (
                  <div style={styles.infoItem} className="hover-lift">
                    <span style={styles.icon}>{Icons.portfolio}</span>
                    <div style={styles.infoContent}>
                      <div style={styles.infoLabel}>Portfolio</div>
                      <p
                        style={{ ...styles.infoValue, ...styles.linkText }}
                        onClick={() => openLink(user.portfolio)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderBottomColor = "#0073b1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderBottomColor = "transparent";
                        }}
                      >
                        {user.portfolio}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education Section */}
          {user?.education?.length > 0 && user.education.some(edu => edu.institution || edu.degree) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.icon}>{Icons.education}</span>
                Education
              </h2>
              <div style={styles.divider} />
              
              {user.education.map((edu, idx) => (
                <div key={idx} style={styles.experienceItem} className="hover-lift">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                    <h3 style={styles.experienceTitle}>
                      {edu.institution || "Institution not specified"}
                    </h3>
                    {edu.currentlyStudying && (
                      <span style={styles.studyingBadge}>
                        {Icons.graduation}
                        Currently Studying
                      </span>
                    )}
                  </div>
                  
                  <div style={styles.experienceMeta}>
                    {edu.degree && (
                      <>
                        <span style={{ fontWeight: "600" }}>{edu.degree}</span>
                        {edu.fieldOfStudy && <span>in {edu.fieldOfStudy}</span>}
                      </>
                    )}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    {edu.startYear && edu.endYear ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: "#64748b" }}>
                        {Icons.calendar}
                        {edu.startYear} - {edu.currentlyStudying ? "Present" : edu.endYear}
                      </span>
                    ) : edu.startYear && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: "#64748b" }}>
                        {Icons.calendar}
                        From {edu.startYear}
                      </span>
                    )}

                    {edu.gradeCGPA && (
                      <span style={styles.gradeBadge}>
                        {Icons.award}
                        {edu.gradeCGPA}
                      </span>
                    )}
                  </div>

                  {edu.subjectsCourses && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#475569" }}>Subjects/Courses:</span>
                      <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
                        {edu.subjectsCourses}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Work Experience
          {user?.experience?.length > 0 && user.experience.some(exp => exp.title || exp.company) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.icon}>{Icons.experience}</span>
                Work Experience
              </h2>
              <div style={styles.divider} />
              
              {user.experience.map((exp, idx) => (
                <div key={idx} style={styles.experienceItem} className="hover-lift">
                  <h3 style={styles.experienceTitle}>{exp.title || "Position not specified"}</h3>
                  <div style={styles.experienceMeta}>
                    {exp.company && (
                      <>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          {Icons.building}
                          {exp.company}
                        </span>
                      </>
                    )}
                  </div>
                  {exp.description && (
                    <p style={styles.experienceDescription}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )} */}

          {/* Projects */}
          {user?.projects?.length > 0 && user.projects.some(proj => proj.name) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.icon}>{Icons.projects}</span>
                Projects
              </h2>
              <div style={styles.divider} />
              
              {user.projects.map((proj, idx) => (
                <div key={idx} style={styles.experienceItem} className="hover-lift">
                  <h3 style={styles.experienceTitle}>{proj.name || "Project name not specified"}</h3>
                  {proj.description && (
                    <p style={styles.experienceDescription}>{proj.description}</p>
                  )}
                  {proj.link && (
                    <p
                      style={{ ...styles.linkText, marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                      onClick={() => openLink(proj.link)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderBottomColor = "#0073b1";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderBottomColor = "transparent";
                      }}
                    >
                      {Icons.external}
                      View Project
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {user?.certifications?.length > 0 && user.certifications.some(cert => cert.name) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span style={styles.icon}>{Icons.certifications}</span>
                Certifications
              </h2>
              <div style={styles.divider} />
              
              <div style={styles.infoGrid}>
                {user.certifications.map((cert, idx) => (
                  <div key={idx} style={styles.infoItem} className="hover-lift">
                    <span style={styles.icon}>{Icons.certifications}</span>
                    <div style={styles.infoContent}>
                      <div style={styles.infoLabel}>Certificate</div>
                      <h3 style={{ ...styles.infoValue, fontWeight: "600", marginBottom: "0.25rem" }}>
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                          {cert.issuer}
                        </p>
                      )}
                      {cert.date && (
                        <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          {Icons.calendar}
                          Issued: {formatDate(cert.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State - No sections filled */}
          {!user.bio && !hasAnySkills && !hasSocialLinks && 
           !user.education?.length && !user.experience?.length && 
           !user.projects?.length && !user.certifications?.length && (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#334155", marginBottom: "0.5rem" }}>
                Your profile is incomplete
              </h3>
              <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                Add your education, experience, skills, and more to stand out to employers.
              </p>
              <button
                style={{ ...styles.button, ...styles.primaryButton, margin: "0 auto" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #006097, #0084b3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #0073b1, #00a0dc)";
                }}
                onClick={() => navigate("/profile-form")}
              >
                {Icons.edit}
                Complete Your Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer} className="hover-lift">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          {Icons.calendar}
          {user.updatedAt ? 
            `Profile last updated: ${formatDate(user.updatedAt)}` :
            "Create your profile to get started"
          }
        </div>
      </div>

      {/* Style for spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;