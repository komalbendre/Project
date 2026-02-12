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
        // First try to get user info
        let userData = {};
        try {
          console.log("ProfilePage: Fetching user data from /api/users/me");
          const userResponse = await axios.get(
            `http://localhost:5000/api/users/me`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("ProfilePage: User response:", userResponse.data);
          userData = userResponse.data.data || userResponse.data;
          console.log("ProfilePage: Extracted user data:", userData);
        } catch (userErr) {
          console.error("ProfilePage: Could not fetch user info:", userErr.response?.data || userErr.message);
        }

        // Then try to get profile
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
            // If profile exists, use it
            setUser(response.data.data);
          } else {
            // If no profile data, use basic user info
            setUser({
              fullName: `${userData.fname} ${userData.lname}`.trim() || "User",
              email: userData.email || "No email provided",
              phone: "",
              bio: "",
              skills: [],
              linkedin: "",
              github: "",
              experience: [],
              education: [],
              certifications: [],
              projects: []
            });
          }
        } catch (profileErr) {
          // If profile doesn't exist (404), use user info
          if (profileErr.response?.status === 404) {
            setUser({
              fullName: `${userData.fname} ${userData.lname}`.trim() || "User",
              email: userData.email || "No email provided",
              phone: "",
              bio: "",
              skills: [],
              linkedin: "",
              github: "",
              experience: [],
              education: [],
              certifications: [],
              projects: []
            });
          } else {
            setError("Failed to load profile. Please try again.");
            console.error("Profile fetch error:", profileErr);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "3rem auto",
      padding: "0 1rem",
    },
    backButton: {
      background: "none",
      border: "none",
      color: "#4b5563",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "1rem",
      marginBottom: "1.5rem",
      padding: "0.5rem",
      borderRadius: "6px",
      transition: "all 0.2s",
    },
    card: {
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      marginBottom: "1rem",
    },
    header: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "2rem",
      display: "flex",
      alignItems: "center",
      gap: "1.5rem",
      flexWrap: "wrap",
    },
    avatar: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2rem",
      fontWeight: "bold",
      flexShrink: 0,
    },
    headerContent: {
      flex: 1,
      minWidth: "250px",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "600",
      margin: "0 0 0.5rem 0",
    },
    subtitle: {
      fontSize: "1rem",
      opacity: 0.8,
      margin: 0,
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      flexWrap: "wrap",
      marginTop: "1rem",
    },
    button: {
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s",
      fontSize: "0.95rem",
    },
    primaryButton: {
      background: "#3b82f6",
      color: "white",
    },
    outlineButton: {
      background: "white",
      color: "#3b82f6",
      border: "1px solid #3b82f6",
    },
    content: {
      padding: "2rem",
    },
    section: {
      marginBottom: "2rem",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#333",
    },
    divider: {
      height: "1px",
      background: "#e5e7eb",
      margin: "1rem 0",
    },
    infoItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "1rem",
      marginBottom: "1rem",
    },
    icon: {
      color: "#6b7280",
      minWidth: "24px",
      marginTop: "0.25rem",
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: "0.875rem",
      color: "#6b7280",
      marginBottom: "0.25rem",
    },
    infoValue: {
      fontSize: "1rem",
      color: "#111827",
      margin: 0,
    },
    bio: {
      background: "#f9fafb",
      padding: "1rem",
      borderRadius: "8px",
      lineHeight: "1.6",
      whiteSpace: "pre-wrap",
      margin: 0,
    },
    skillsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
    },
    skillChip: {
      background: "#e0e7ff",
      color: "#3730a3",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    footer: {
      background: "#f9fafb",
      padding: "1rem",
      borderRadius: "8px",
      textAlign: "center",
      color: "#6b7280",
      fontSize: "0.875rem",
    },
    loadingContainer: {
      textAlign: "center",
      marginTop: "5rem",
    },
    loadingSkeleton: {
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "loading 1.5s infinite",
      borderRadius: "4px",
      margin: "1rem auto",
      maxWidth: "600px",
    },
    errorContainer: {
      textAlign: "center",
      marginTop: "5rem",
      padding: "2rem",
      background: "#fee",
      borderRadius: "8px",
      border: "1px solid #fbb",
    },
    errorText: {
      color: "#c33",
      marginBottom: "1rem",
    },
    "@keyframes loading": {
      "0%": { backgroundPosition: "200% 0" },
      "100%": { backgroundPosition: "-200% 0" },
    },
  };

  // Inline style tag with keyframes
  const styleTag = `
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  const handleHover = (e, isHover) => {
    e.currentTarget.style.background = isHover ? "#f3f4f6" : "none";
  };

  const handleButtonHover = (e, isHover, isPrimary) => {
    if (isPrimary) {
      e.currentTarget.style.background = isHover ? "#2563eb" : "#3b82f6";
    } else {
      e.currentTarget.style.background = isHover ? "#eff6ff" : "white";
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleTag}</style>
        <div style={{ ...styles.loadingSkeleton, height: "200px" }}></div>
        <div style={{ ...styles.loadingSkeleton, height: "40px", width: "70%" }}></div>
        <div style={{ ...styles.loadingSkeleton, height: "30px", width: "50%" }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <style>{styleTag}</style>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.button}
            onMouseEnter={(e) => handleButtonHover(e, true, false)}
            onMouseLeave={(e) => handleButtonHover(e, false, false)}
            onClick={() => navigate(-1)}
          >
            ← Go Back
          </button>
          <button
            style={{ ...styles.button, ...styles.primaryButton, marginLeft: "1rem" }}
            onMouseEnter={(e) => handleButtonHover(e, true, true)}
            onMouseLeave={(e) => handleButtonHover(e, false, true)}
            onClick={() => navigate("/profile-form")}
          >
            ✎ Create Profile
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <style>{styleTag}</style>
        <div style={styles.loadingContainer}>
          <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
            No profile data found
          </p>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onMouseEnter={(e) => handleButtonHover(e, true, true)}
            onMouseLeave={(e) => handleButtonHover(e, false, true)}
            onClick={() => navigate("/profile-form")}
          >
            ✎ Create Profile
          </button>
        </div>
      </div>
    );
  }

  // Combine technical and soft skills for display
  const allSkills = [...(user.technicalSkills || []), ...(user.softSkills || []), ...(user.skills || [])];
  const uniqueSkills = [...new Set(allSkills.filter(skill => skill && skill.trim()))];

  return (
    <div style={styles.container}>
      <style>{styleTag}</style>

      {/* Back Button */}
      <button
        style={styles.backButton}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Profile Card */}
      <div style={styles.card}>
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
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.outlineButton }}
                onMouseEnter={(e) => handleButtonHover(e, true, false)}
                onMouseLeave={(e) => handleButtonHover(e, false, false)}
                onClick={() => navigate("/profile-form")}
              >
                ✎ Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Contact Information */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Contact Information
            </h2>
            <div style={styles.divider} />

            <div style={styles.infoItem}>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>Email</div>
                <p style={styles.infoValue}>
                  {user.email || "Not provided"}
                </p>
              </div>
            </div>

            <div style={styles.infoItem}>
              <div style={styles.infoContent}>
                <div style={styles.infoLabel}>Phone</div>
                <p style={styles.infoValue}>
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {user.bio && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                About
              </h2>
              <div style={styles.divider} />
              <p style={styles.bio}>
                {user.bio}
              </p>
            </div>
          )}

          {/* Skills Section */}
          {uniqueSkills.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Skills & Expertise
              </h2>
              <div style={styles.divider} />
              <div style={styles.skillsContainer}>
                {uniqueSkills.map((skill, index) => (
                  <span key={index} style={styles.skillChip}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links Section */}
          {(user.linkedin || user.github) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                 Social Profiles
              </h2>
              <div style={styles.divider} />

              {user.linkedin && (
                <div style={styles.infoItem}>
                  <span style={styles.icon}>in</span>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>LinkedIn</div>
                    <p
                      style={{ ...styles.infoValue, color: "#2563eb", cursor: "pointer" }}
                      onClick={() => openLink(user.linkedin)}
                    >
                      {user.linkedin}
                    </p>
                  </div>
                </div>
              )}

              {user.github && (
                <div style={styles.infoItem}>
                  <span style={styles.icon}>git</span>
                  <div style={styles.infoContent}>
                    <div style={styles.infoLabel}>GitHub</div>
                    <p
                      style={{ ...styles.infoValue, color: "#2563eb", cursor: "pointer" }}
                      onClick={() => openLink(user.github)}
                    >
                      {user.github}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Work Experience */}
          {user?.experience?.length > 0 && user.experience.some(exp => exp.title || exp.company || exp.description) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Work Experience
              </h2>
              <div style={styles.divider} />
              {user.experience.map((exp, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{exp.title}</h3>
                  <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>{exp.company}</p>
                  {exp.description && <p style={styles.bio}>{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {user?.education?.length > 0 && user.education.some(edu => edu.institution || edu.degree || edu.description) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Education
              </h2>
              <div style={styles.divider} />
              {user.education.map((edu, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{edu.institution}</h3>
                  <p style={{ color: "#6b7280", marginBottom: "0.5rem" }}>{edu.degree}</p>
                  {edu.description && <p style={styles.bio}>{edu.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {user?.projects?.length > 0 && user.projects.some(proj => proj.name || proj.description) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Projects
              </h2>
              <div style={styles.divider} />
              {user.projects.map((proj, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{proj.name}</h3>
                  {proj.description && <p style={styles.bio}>{proj.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {user?.certifications?.length > 0 && user.certifications.some(cert => cert.name || cert.issuer) && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                Certifications
              </h2>
              <div style={styles.divider} />
              {user.certifications.map((cert, idx) => (
                <div key={idx} style={{ marginBottom: "0.5rem" }}>
                  <h3 style={{ marginBottom: "0.25rem" }}>{cert.name}</h3>
                  <p style={{ color: "#6b7280" }}>{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        {user.updatedAt ? 
          `Profile last updated: ${new Date(user.updatedAt).toLocaleDateString()}` :
          "Create your profile to get started"
        }
      </div>
    </div>
  );
};

export default ProfilePage;