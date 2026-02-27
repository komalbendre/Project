import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ResumeOne from "../resumes/resumeOne";
import ResumeTwo from "../resumes/resumeTwo";
import ResumeThree from "../resumes/resumeThree";

const ResumeBuilder = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [resumeData, setResumeData] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Check authentication
  useEffect(() => {
    if (!token || !userId) {
      const shouldRedirect = window.confirm("Please login to create a resume. Redirect to login page?");
      if (shouldRedirect) {
        navigate("/login");
      } else {
        navigate("/");
      }
      return;
    }

    fetchUserProfile();
  }, [userId, token, navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log the response to debug
      console.log("API Response:", response.data);
      console.log("API Response Data:", response.data.data);
      console.log("Technical Skills:", response.data.data?.technicalSkills);
      console.log("Soft Skills:", response.data.data?.softSkills);
      console.log("Certifications data:", response.data.data?.certifications);

      // Access the data property from the response
      if (response.data.success) {
        setUser(response.data.data);
        prepareResumeData(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Failed to load profile data. Please complete your profile first.");
      navigate("/profile-form");
    } finally {
      setLoading(false);
    }
  };

  // Update the prepareResumeData function to properly handle skills
  const prepareResumeData = (profileData) => {
    console.log("Profile data for resume:", profileData);
    console.log("Certifications structure:", profileData?.certifications);
    console.log("Technical Skills:", profileData?.technicalSkills);
    console.log("Soft Skills:", profileData?.softSkills);

    // Helper function to extract certification names
    const getCertificationNames = (certs) => {
      if (!certs) return [];

      if (Array.isArray(certs)) {
        return certs.map(cert => {
          if (typeof cert === 'string') return cert;
          if (cert && typeof cert === 'object') return cert.name || cert.title || JSON.stringify(cert);
          return String(cert);
        });
      }

      return [];
    };

    // Combine technical and soft skills for resume display
    const allSkills = [
      ...(Array.isArray(profileData?.technicalSkills) ? profileData.technicalSkills : []),
      ...(Array.isArray(profileData?.softSkills) ? profileData.softSkills : [])
    ];

    const data = {
      personalInfo: {
        name: profileData?.fullName || "",
        email: profileData?.email || "",
        phone: profileData?.phone || "",
        location: profileData?.location || "Not specified",
        linkedin: profileData?.linkedin || "",
        github: profileData?.github || "",
        portfolio: profileData?.portfolio || "",
      },
      summary: profileData?.bio || "Experienced professional seeking new opportunities.",
      skills: allSkills,
      technicalSkills: profileData?.technicalSkills || [],
      softSkills: profileData?.softSkills || [],

      // Handle experience data
      experience: Array.isArray(profileData?.experience) && profileData.experience.length > 0
        ? profileData.experience.map(exp => ({
            title: exp.title || "",
            company: exp.company || "",
            duration: exp.duration || (exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : ""),
            description: exp.description || "",
            location: exp.location || ""
          }))
        : [],

      // Handle education data
      education: Array.isArray(profileData?.education) && profileData.education.length > 0
        ? profileData.education.map(edu => ({
            degree: edu.degree || "",
            institution: edu.institution || "",
            duration: edu.duration || (edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : 
                      (edu.startYear && edu.currentlyStudying ? `${edu.startYear} - Present` : "")),
            description: edu.description || "",
            location: edu.location || "",
            fieldOfStudy: edu.fieldOfStudy || "",
            gradeCGPA: edu.gradeCGPA || "",
            subjectsCourses: edu.subjectsCourses || ""
          }))
        : [],

      // Handle projects data
      projects: Array.isArray(profileData?.projects) && profileData.projects.length > 0
        ? profileData.projects.map(proj => ({
            name: proj.name || "",
            description: proj.description || "",
            technologies: Array.isArray(proj.technologies) ? proj.technologies : []
          }))
        : [],

      // Handle certifications
      certifications: getCertificationNames(profileData?.certifications),

      languages: profileData?.languages || ["English"]
    };

    console.log("Processed resume data:", data);
    console.log("Skills in resume data:", data.skills);
    setResumeData(data);
  };

  // Resume Templates
  const templates = [
    {
      id: 1,
      name: "Modern Professional",
      description: "Clean, modern design perfect for tech roles",
      color: "#667eea",
      icon: "🎨",
    },
    {
      id: 2,
      name: "Creative",
      description: "Colorful and creative for design/marketing roles",
      color: "#10b981",
      icon: "✨",
    },
    {
      id: 3,
      name: "Classic",
      description: "Traditional format preferred by conservative industries",
      color: "#f59e0b",
      icon: "📜",
    },
    {
      id: 4,
      name: "Minimalist",
      description: "Simple and clean for maximum readability",
      color: "#8b5cf6",
      icon: "📄",
    },
  ];

  const generateResume = () => {
    setGenerating(true);

    // Simulate resume generation
    setTimeout(() => {
      setPreviewMode(true);
      setGenerating(false);
      alert("Resume generated successfully! Scroll down to preview.");
    }, 1500);
  };

  const downloadResume = async (format) => {
    if (!resumeData || !user) {
      alert("Please generate a resume first");
      return;
    }

    setGenerating(true);
    try {
      const endpoint = format === "PDF" ? "/pdf" : "/docx";

      console.log("Sending resume data:", resumeData);

      const response = await axios.post(
        `http://localhost:5000/api/resume${endpoint}`,
        {
          resumeData,
          templateId: selectedTemplate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );

      console.log("Response received:", response);

      if (response.status !== 200) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Check if we got a blob
      if (!(response.data instanceof Blob)) {
        throw new Error('Response is not a file');
      }

      // Create download link
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;

      // Get filename
      let filename = `${user.fullName?.replace(/\s+/g, '_') || 'resume'}_Resume.${format.toLowerCase()}`;

      // Try to get filename from headers
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"']+)["']?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Download error details:", error);
      console.error("Error response:", error.response);

      if (error.response) {
        // Try to parse error message from response
        if (error.response.status === 404) {
          alert("Profile not found. Please complete your profile first.");
          navigate("/profile-form");
        } else if (error.response.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.clear();
          navigate("/login");
        } else if (error.response.data && typeof error.response.data === 'string') {
          // Try to read blob if response is blob
          const text = await error.response.data.text();
          try {
            const errorData = JSON.parse(text);
            alert(`Error: ${errorData.message || 'Unknown error'}`);
          } catch (e) {
            alert(`Server error: ${error.response.status}`);
          }
        } else {
          alert(`Failed to download ${format}. Please try again.`);
        }
      } else if (error.request) {
        alert("No response from server. Please check if the backend is running.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setGenerating(false);
    }
  };

  const shareResume = () => {
    const shareUrl = `${window.location.origin}/resume/${userId}`;
    if (navigator.share) {
      navigator.share({
        title: `${user?.fullName}'s Resume`,
        text: `Check out ${user?.fullName}'s resume`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Resume link copied to clipboard!");
    }
  };

  // CSS Styles
  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "0.5rem 1.5rem",
      maxWidth: "1300px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "0.75rem",
      marginTop: "-0.5rem",
    },
    title: {
      fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
      fontWeight: 800,
      color: "#2d3748",
      marginBottom: "0.25rem", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      fontSize: "0.95rem",
      color: "#718096",
      marginBottom: "1.5rem",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "40vh",
      gap: "0.75rem",
    },
    loadingSpinner: {
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #667eea",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    mainContent: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: "1.5rem",
      marginBottom: "2rem",
    },
    sidebar: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    sectionCard: {
      background: "white",
      padding: "1.25rem",
      borderRadius: "12px",
      boxShadow: "0 3px 15px rgba(0, 0, 0, 0.05)",
    },
    sectionTitle: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "0.75rem",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
    },
    templatesGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "0.75rem",
    },
    templateCard: {
      padding: "1rem",
      borderRadius: "10px",
      border: "2px solid #e2e8f0",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    selectedTemplate: {
      borderColor: "#667eea",
      background: "rgba(102, 126, 234, 0.05)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 15px rgba(102, 126, 234, 0.15)",
    },
    templateIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.1rem",
    },
    templateInfo: {
      flex: 1,
    },
    templateName: {
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "0.2rem",
      fontSize: "0.95rem",
    },
    templateDescription: {
      fontSize: "0.8rem",
      color: "#718096",
    },
    previewArea: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 3px 15px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
      minHeight: "700px",
      position: "relative",
    },
    previewHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1.25rem",
      borderBottom: "1px solid #e2e8f0",
    },
    previewTitle: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#2d3748",
    },
    previewControls: {
      display: "flex",
      gap: "0.6rem",
    },
    controlButton: {
      padding: "0.4rem 0.8rem",
      background: "#f1f5f9",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.8rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
    },
    generateButton: {
      padding: "0.875rem 1.5rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      marginTop: "auto",
    },
    loadingButton: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    resumePreview: {
      padding: "1.5rem",
      height: "100%",
      overflowY: "auto",
    },
    resumeTemplate1: {
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      maxWidth: "700px",
      margin: "0 auto",
      color: "#1a1a1a",
      fontSize: "0.9rem",
    },
    resumeHeader1: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "1.5rem",
      borderRadius: "10px",
      marginBottom: "1.5rem",
    },
    resumeName1: {
      fontSize: "2rem",
      fontWeight: 700,
      marginBottom: "0.4rem",
    },
    resumeTitle1: {
      fontSize: "1.1rem",
      opacity: 0.9,
      marginBottom: "0.75rem",
    },
    resumeContact1: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.75rem",
      fontSize: "0.8rem",
    },
    contactItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
    },
    section1: {
      marginBottom: "1.25rem",
    },
    sectionTitle1: {
      fontSize: "1.3rem",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "0.75rem",
      paddingBottom: "0.4rem",
      borderBottom: "2px solid #667eea",
    },
    skillTag1: {
      display: "inline-block",
      background: "#e0e7ff",
      color: "#3730a3",
      padding: "0.4rem 0.8rem",
      borderRadius: "16px",
      margin: "0.2rem",
      fontSize: "0.8rem",
    },
    experienceItem1: {
      marginBottom: "1rem",
    },
    experienceHeader1: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0.4rem",
    },
    experienceTitle1: {
      fontWeight: 600,
      fontSize: "1rem",
      color: "#2d3748",
    },
    experienceCompany1: {
      color: "#667eea",
      fontWeight: 500,
      fontSize: "0.9rem",
    },
    experienceDuration1: {
      color: "#718096",
      fontSize: "0.8rem",
    },
    experienceDescription1: {
      color: "#4a5568",
      lineHeight: 1.5,
      fontSize: "0.9rem",
    },
    actionButtons: {
      display: "flex",
      gap: "0.75rem",
      justifyContent: "center",
      marginTop: "1.5rem",
      flexWrap: "wrap",
    },
    actionButtonPrimary: {
      padding: "0.75rem 1.5rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
    },
    actionButtonSecondary: {
      padding: "0.75rem 1.5rem",
      background: "#f1f5f9",
      color: "#4a5568",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.9rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem 1.5rem",
      color: "#718096",
    },
    emptyIcon: {
      fontSize: "3rem",
      marginBottom: "0.75rem",
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      marginBottom: "0.4rem",
      color: "#4a5568",
    },
  };

  const styleTag = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .template-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
    }
    
    .generate-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .control-button:hover {
      background: #e2e8f0;
    }
    
    .action-button-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(102, 126, 234, 0.3);
    }
    
    .action-button-secondary:hover {
      background: #e2e8f0;
    }
  `;

  const handleTemplateHover = (e, isHover) => {
    if (!e.currentTarget.className.includes("selected")) {
      e.currentTarget.style.transform = isHover ? "translateY(-2px)" : "translateY(0)";
      e.currentTarget.style.boxShadow = isHover ? "0 4px 15px rgba(0, 0, 0, 0.1)" : "none";
    }
  };

  const handleButtonHover = (e, isHover, isPrimary) => {
    if (isPrimary) {
      e.currentTarget.style.transform = isHover ? "translateY(-3px)" : "translateY(0)";
      e.currentTarget.style.boxShadow = isHover ? "0 10px 25px rgba(102, 126, 234, 0.3)" : "none";
    } else {
      e.currentTarget.style.background = isHover ? "#e2e8f0" : "#f1f5f9";
    }
  };

  const renderResumePreview = () => {
    if (!previewMode || !resumeData) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📄</div>
          <h3 style={styles.emptyTitle}>Resume Preview</h3>
          <p>Select a template and click "Generate Resume" to see your resume here.</p>
        </div>
      );
    }

    switch (selectedTemplate) {
      case 1:
        return (
          <div style={styles.resumeTemplate1}>
            {/* Header */}
            <div style={styles.resumeHeader1}>
              <h1 style={styles.resumeName1}>{resumeData.personalInfo.name}</h1>
              <p style={styles.resumeTitle1}>
                {resumeData.technicalSkills?.length > 0 
                  ? resumeData.technicalSkills.slice(0, 3).join(" • ") 
                  : "Professional"}
              </p>
              <div style={styles.resumeContact1}>
                {resumeData.personalInfo.email && (
                  <div style={styles.contactItem}>📧 {resumeData.personalInfo.email}</div>
                )}
                {resumeData.personalInfo.phone && (
                  <div style={styles.contactItem}>📱 {resumeData.personalInfo.phone}</div>
                )}
                {resumeData.personalInfo.location && (
                  <div style={styles.contactItem}>📍 {resumeData.personalInfo.location}</div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div style={styles.contactItem}>💼 {resumeData.personalInfo.linkedin}</div>
                )}
                {resumeData.personalInfo.github && (
                  <div style={styles.contactItem}>🐙 {resumeData.personalInfo.github}</div>
                )}
              </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
              <div style={styles.section1}>
                <h2 style={styles.sectionTitle1}>Professional Summary</h2>
                <p style={{ lineHeight: 1.6, color: "#4a5568" }}>{resumeData.summary}</p>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <div style={styles.section1}>
                <h2 style={styles.sectionTitle1}>Skills</h2>
                <div>
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} style={styles.skillTag1}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <div style={styles.section1}>
                <h2 style={styles.sectionTitle1}>Work Experience</h2>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} style={styles.experienceItem1}>
                    <div style={styles.experienceHeader1}>
                      <div>
                        <h3 style={styles.experienceTitle1}>{exp.title}</h3>
                        <p style={styles.experienceCompany1}>{exp.company}</p>
                      </div>
                      {exp.duration && <span style={styles.experienceDuration1}>{exp.duration}</span>}
                    </div>
                    {exp.description && <p style={styles.experienceDescription1}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {resumeData.education && resumeData.education.length > 0 && (
              <div style={styles.section1}>
                <h2 style={styles.sectionTitle1}>Education</h2>
                {resumeData.education.map((edu, index) => (
                  <div key={index} style={styles.experienceItem1}>
                    <div style={styles.experienceHeader1}>
                      <div>
                        <h3 style={styles.experienceTitle1}>{edu.degree || edu.fieldOfStudy || "Education"}</h3>
                        <p style={styles.experienceCompany1}>{edu.institution}</p>
                      </div>
                      {edu.duration && <span style={styles.experienceDuration1}>{edu.duration}</span>}
                    </div>
                    {edu.gradeCGPA && <p style={styles.experienceDescription1}>CGPA: {edu.gradeCGPA}</p>}
                    {edu.subjectsCourses && <p style={styles.experienceDescription1}>{edu.subjectsCourses}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div style={styles.section1}>
                <h2 style={styles.sectionTitle1}>Projects</h2>
                {resumeData.projects.map((project, index) => (
                  <div key={index} style={styles.experienceItem1}>
                    <h3 style={styles.experienceTitle1}>{project.name}</h3>
                    <p style={styles.experienceDescription1}>{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} style={styles.skillTag1}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div style={styles.section1}>
                <h2 style={styles.sectionTitle1}>Certifications</h2>
                <ul style={{ paddingLeft: "1.5rem", color: "#4a5568" }}>
                  {resumeData.certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div style={{ padding: '20px' }}>
            <ResumeOne resumeData={resumeData} isPreview={true} />
          </div>
        );

      case 3:
        return (
          <div style={{ padding: '20px' }}>
            <ResumeTwo resumeData={resumeData} isPreview={true} />
          </div>
        );

      case 4:
        return (
          <div style={{ padding: '20px' }}>
            <ResumeThree resumeData={resumeData} isPreview={true} />
          </div>
        );

      default:
        return (
          <div style={styles.resumeTemplate1}>
            <div style={styles.resumeHeader1}>
              <h1 style={styles.resumeName1}>{resumeData.personalInfo.name}</h1>
              <p style={styles.resumeTitle1}>Professional Resume</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleTag}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={{ color: "#718096", fontSize: "1rem" }}>
            Loading your profile data...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <style>{styleTag}</style>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔒</div>
          <h3 style={styles.emptyTitle}>Profile Required</h3>
          <p>Please complete your profile first to generate a resume.</p>
          <button
            style={styles.generateButton}
            onClick={() => navigate("/profile-form")}
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleTag}</style>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Resume Builder</h1>
        <p style={styles.subtitle}>
          Create a professional resume using your profile data
        </p>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {/* Templates Section */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}>
              <span>🎨</span> Choose Template
            </h2>
            <div style={styles.templatesGrid}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    ...styles.templateCard,
                    ...(selectedTemplate === template.id && styles.selectedTemplate),
                  }}
                  onClick={() => setSelectedTemplate(template.id)}
                  onMouseEnter={(e) => handleTemplateHover(e, true)}
                  onMouseLeave={(e) => handleTemplateHover(e, false)}
                  className="template-card"
                >
                  <div
                    style={{
                      ...styles.templateIcon,
                      background: template.color,
                      color: "white",
                    }}
                  >
                    {template.icon}
                  </div>
                  <div style={styles.templateInfo}>
                    <div style={styles.templateName}>{template.name}</div>
                    <div style={styles.templateDescription}>{template.description}</div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div style={{ color: template.color, fontWeight: 600 }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Profile Data Section */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}>
              <span>👤</span> Your Profile Data
            </h2>
            <div style={{ fontSize: "0.9rem", color: "#4a5568" }}>
              <p><strong>Name:</strong> {user.fullName || "Not set"}</p>
              <p><strong>Email:</strong> {user.email || "Not set"}</p>
              <p><strong>Technical Skills:</strong> {user.technicalSkills?.length > 0 ? user.technicalSkills.join(", ") : "Not set"}</p>
              <p><strong>Soft Skills:</strong> {user.softSkills?.length > 0 ? user.softSkills.join(", ") : "Not set"}</p>
              {(!user.technicalSkills?.length && !user.softSkills?.length) && (
                <p style={{ color: "#f59e0b", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  ⚠️ No skills found. Please update your profile.
                </p>
              )}
              <p style={{ marginTop: "1rem" }}>
                <button
                  style={{
                    padding: "0.5rem 1rem",
                    background: "none",
                    border: "1px solid #667eea",
                    color: "#667eea",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                  onClick={() => navigate("/profile-form")}
                >
                  Update Profile
                </button>
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            style={{
              ...styles.generateButton,
              ...(generating && styles.loadingButton),
            }}
            onClick={generateResume}
            disabled={generating}
            onMouseEnter={(e) => handleButtonHover(e, true, true)}
            onMouseLeave={(e) => handleButtonHover(e, false, true)}
            className="generate-button"
          >
            {generating ? (
              <>
                <span style={{ ...styles.loadingSpinner, width: "20px", height: "20px", borderWidth: "3px" }}></span>
                Generating...
              </>
            ) : (
              <>
                Generate Resume
              </>
            )}
          </button>
        </div>

        {/* Preview Area */}
        <div style={styles.previewArea}>
          <div style={styles.previewHeader}>
            <h2 style={styles.previewTitle}>
              {previewMode ? `Resume Preview - ${templates.find(t => t.id === selectedTemplate)?.name}` : "Preview Area"}
            </h2>
          </div>

          <div style={styles.resumePreview}>
            {renderResumePreview()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {previewMode && (
        <div style={styles.actionButtons}>
          <button
            style={styles.actionButtonPrimary}
            onClick={() => downloadResume("PDF")}
            onMouseEnter={(e) => handleButtonHover(e, true, true)}
            onMouseLeave={(e) => handleButtonHover(e, false, true)}
            className="action-button-primary"
          >
            Download PDF
          </button>
          <button
            style={styles.actionButtonPrimary}
            onClick={() => downloadResume("DOCX")}
            onMouseEnter={(e) => handleButtonHover(e, true, true)}
            onMouseLeave={(e) => handleButtonHover(e, false, true)}
            className="action-button-primary"
          >
            Download Word
          </button>
          <button
            style={styles.actionButtonPrimary}
            onClick={shareResume}
            onMouseEnter={(e) => handleButtonHover(e, true, true)}
            onMouseLeave={(e) => handleButtonHover(e, false, true)}
            className="action-button-primary"
          >
            Share Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;