import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ResumeOne from "../resumes/resumeOne";
import ResumeTwo from "../resumes/resumeTwo";  // Add this
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

  const prepareResumeData = (profileData) => {
    console.log("Profile data for resume:", profileData);
    console.log("Certifications structure:", profileData?.certifications);

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
      skills: Array.isArray(profileData?.skills)
        ? profileData.skills
        : (profileData?.skills ? profileData.skills.split(",").map(s => s.trim()) : []),

      // Handle experience data
      experience: Array.isArray(profileData?.experience)
        ? profileData.experience.map(exp => ({
          title: exp.title || "",
          company: exp.company || "",
          duration: exp.duration || (exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : ""),
          description: exp.description || "",
          location: exp.location || ""
        }))
        : [
          {
            title: "Frontend Developer",
            company: "Tech Company Inc.",
            duration: "2022 - Present",
            description: "Developed responsive web applications using React and TypeScript.",
            location: "San Francisco, CA"
          }
        ],

      // Handle education data
      education: Array.isArray(profileData?.education)
        ? profileData.education.map(edu => ({
          degree: edu.degree || "",
          institution: edu.institution || "",
          duration: edu.duration || (edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : ""),
          description: edu.description || "",
          location: edu.location || ""
        }))
        : [
          {
            degree: "Bachelor of Computer Science",
            institution: "University of Technology",
            duration: "2018 - 2022",
            description: "Specialized in Software Engineering",
            location: "New York, NY"
          }
        ],

      // Handle projects data
      projects: Array.isArray(profileData?.projects)
        ? profileData.projects.map(proj => ({
          name: proj.name || "",
          description: proj.description || "",
          technologies: Array.isArray(proj.technologies) ? proj.technologies : []
        }))
        : [
          {
            name: "E-commerce Platform",
            description: "Full-stack e-commerce application with React and Node.js",
            technologies: ["React", "Node.js", "MongoDB", "Express"]
          }
        ],

      // Handle certifications - extract names from objects
      certifications: getCertificationNames(profileData?.certifications),

      languages: profileData?.languages || ["English", "Spanish"]
    };

    console.log("Processed resume data:", data);
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
      let filename = `${user.fullName.replace(/\s+/g, '_')}_Resume.${format.toLowerCase()}`;

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
    minHeight: "40vh", // Reduced from "50vh"
    gap: "0.75rem", // Reduced from "1rem"
  },
  loadingSpinner: {
    width: "40px", // Reduced from "50px"
    height: "40px", // Reduced from "50px"
    border: "4px solid #f3f3f3", // Reduced from "5px"
    borderTop: "4px solid #667eea", // Reduced from "5px"
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "1.5rem", // Reduced from "2rem"
    marginBottom: "2rem", // Reduced from "3rem"
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem", // Reduced from "2rem"
  },
  sectionCard: {
    background: "white",
    padding: "1.25rem", // Reduced from "1.5rem"
    borderRadius: "12px", // Reduced from "16px"
    boxShadow: "0 3px 15px rgba(0, 0, 0, 0.05)", // Reduced from "0 4px 20px"
  },
  sectionTitle: {
    fontSize: "1.1rem", // Reduced from "1.25rem"
    fontWeight: 600,
    color: "#2d3748",
    marginBottom: "0.75rem", // Reduced from "1rem"
    display: "flex",
    alignItems: "center",
    gap: "0.4rem", // Reduced from "0.5rem"
  },
  templatesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "0.75rem", // Reduced from "1rem"
  },
  templateCard: {
    padding: "1rem", // Reduced from "1.25rem"
    borderRadius: "10px", // Reduced from "12px"
    border: "2px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem", // Reduced from "1rem"
  },
  selectedTemplate: {
    borderColor: "#667eea",
    background: "rgba(102, 126, 234, 0.05)",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(102, 126, 234, 0.15)", // Reduced from "0 8px 20px"
  },
  templateIcon: {
    width: "36px", // Reduced from "40px"
    height: "36px", // Reduced from "40px"
    borderRadius: "8px", // Reduced from "10px"
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem", // Reduced from "1.25rem"
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontWeight: 600,
    color: "#2d3748",
    marginBottom: "0.2rem", // Reduced from "0.25rem"
    fontSize: "0.95rem", // Added smaller font
  },
  templateDescription: {
    fontSize: "0.8rem", // Reduced from "0.875rem"
    color: "#718096",
  },
  previewArea: {
    background: "white",
    borderRadius: "12px", // Reduced from "16px"
    boxShadow: "0 3px 15px rgba(0, 0, 0, 0.05)", // Reduced from "0 4px 20px"
    overflow: "hidden",
    minHeight: "700px", // Reduced from "800px"
    position: "relative",
  },
  previewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.25rem", // Reduced from "1.5rem"
    borderBottom: "1px solid #e2e8f0",
  },
  previewTitle: {
    fontSize: "1.1rem", // Reduced from "1.25rem"
    fontWeight: 600,
    color: "#2d3748",
  },
  previewControls: {
    display: "flex",
    gap: "0.6rem", // Reduced from "0.75rem"
  },
  controlButton: {
    padding: "0.4rem 0.8rem", // Reduced from "0.5rem 1rem"
    background: "#f1f5f9",
    border: "none",
    borderRadius: "6px", // Reduced from "8px"
    fontSize: "0.8rem", // Reduced from "0.875rem"
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.4rem", // Reduced from "0.5rem"
  },
  generateButton: {
    padding: "0.875rem 1.5rem", // Reduced from "1rem 2rem"
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px", // Reduced from "12px"
    fontSize: "0.95rem", // Reduced from "1rem"
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem", // Reduced from "0.75rem"
    marginTop: "auto",
  },
  loadingButton: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  resumePreview: {
    padding: "1.5rem", // Reduced from "2rem"
    height: "100%",
    overflowY: "auto",
  },
  // Resume Template 1: Modern Professional - Smaller
  resumeTemplate1: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    maxWidth: "700px", // Reduced from "800px"
    margin: "0 auto",
    color: "#1a1a1a",
    fontSize: "0.9rem", // Added base font size
  },
  resumeHeader1: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "1.5rem", // Reduced from "2rem"
    borderRadius: "10px", // Reduced from "12px"
    marginBottom: "1.5rem", // Reduced from "2rem"
  },
  resumeName1: {
    fontSize: "2rem", // Reduced from "2.5rem"
    fontWeight: 700,
    marginBottom: "0.4rem", // Reduced from "0.5rem"
  },
  resumeTitle1: {
    fontSize: "1.1rem", // Reduced from "1.25rem"
    opacity: 0.9,
    marginBottom: "0.75rem", // Reduced from "1rem"
  },
  resumeContact1: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem", // Reduced from "1rem"
    fontSize: "0.8rem", // Reduced from "0.9rem"
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem", // Reduced from "0.5rem"
  },
  section1: {
    marginBottom: "1.25rem", // Reduced from "1.5rem"
  },
  sectionTitle1: {
    fontSize: "1.3rem", // Reduced from "1.5rem"
    fontWeight: 600,
    color: "#2d3748",
    marginBottom: "0.75rem", // Reduced from "1rem"
    paddingBottom: "0.4rem", // Reduced from "0.5rem"
    borderBottom: "2px solid #667eea",
  },
  skillTag1: {
    display: "inline-block",
    background: "#e0e7ff",
    color: "#3730a3",
    padding: "0.4rem 0.8rem", // Reduced from "0.5rem 1rem"
    borderRadius: "16px", // Reduced from "20px"
    margin: "0.2rem", // Reduced from "0.25rem"
    fontSize: "0.8rem", // Reduced from "0.875rem"
  },
  experienceItem1: {
    marginBottom: "1rem", // Reduced from "1.25rem"
  },
  experienceHeader1: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.4rem", // Reduced from "0.5rem"
  },
  experienceTitle1: {
    fontWeight: 600,
    fontSize: "1rem", // Reduced from "1.1rem"
    color: "#2d3748",
  },
  experienceCompany1: {
    color: "#667eea",
    fontWeight: 500,
    fontSize: "0.9rem", // Added smaller font
  },
  experienceDuration1: {
    color: "#718096",
    fontSize: "0.8rem", // Reduced from "0.875rem"
  },
  experienceDescription1: {
    color: "#4a5568",
    lineHeight: 1.5,
    fontSize: "0.9rem", // Added smaller font
  },
  // Resume Template 3: Classic
  resumeTemplate3: {
    fontFamily: "'Times New Roman', serif",
    maxWidth: "700px", // Reduced from "800px"
    margin: "0 auto",
    color: "#1a1a1a",
    fontSize: "0.9rem", // Added base font size
  },
  resumeHeader3: {
    borderBottom: "3px solid #f59e0b",
    paddingBottom: "0.75rem", // Reduced from "1rem"
    marginBottom: "1.5rem", // Reduced from "2rem"
  },
  // Resume Template 4: Minimalist
  resumeTemplate4: {
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    maxWidth: "700px", // Reduced from "800px"
    margin: "0 auto",
    color: "#1a1a1a",
    fontSize: "0.9rem", // Added base font size
  },
  resumeHeader4: {
    textAlign: "center",
    marginBottom: "1.5rem", // Reduced from "2rem"
    paddingBottom: "0.75rem", // Reduced from "1rem"
    borderBottom: "1px solid #e2e8f0",
  },
  resumeName4: {
    fontSize: "1.75rem", // Reduced from "2rem"
    fontWeight: 300,
    letterSpacing: "1px", // Reduced from "2px"
    marginBottom: "0.4rem", // Reduced from "0.5rem"
  },
  actionButtons: {
    display: "flex",
    gap: "0.75rem", // Reduced from "1rem"
    justifyContent: "center",
    marginTop: "1.5rem", // Reduced from "2rem"
    flexWrap: "wrap",
  },
  actionButtonPrimary: {
    padding: "0.75rem 1.5rem", // Reduced from "0.875rem 2rem"
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px", // Reduced from "10px"
    fontSize: "0.9rem", // Reduced from "1rem"
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem", // Reduced from "0.75rem"
  },
  actionButtonSecondary: {
    padding: "0.75rem 1.5rem", // Reduced from "0.875rem 2rem"
    background: "#f1f5f9",
    color: "#4a5568",
    border: "none",
    borderRadius: "8px", // Reduced from "10px"
    fontSize: "0.9rem", // Reduced from "1rem"
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.6rem", // Reduced from "0.75rem"
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem 1.5rem", // Reduced from "4rem 2rem"
    color: "#718096",
  },
  emptyIcon: {
    fontSize: "3rem", // Reduced from "4rem"
    marginBottom: "0.75rem", // Reduced from "1rem"
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: "1.25rem", // Reduced from "1.5rem"
    fontWeight: 600,
    marginBottom: "0.4rem", // Reduced from "0.5rem"
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
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1); // Reduced from 4px 15px
  }
  
  .generate-button:hover:not(:disabled) {
    transform: translateY(-2px); // Reduced from -3px
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); // Reduced from 10px 25px
  }
  
  .control-button:hover {
    background: #e2e8f0;
  }
  
  .action-button-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(102, 126, 234, 0.3); // Reduced from 8px 20px
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

  // const renderResumePreview = () => {
  //   if (!previewMode || !resumeData) {
  //     return (
  //       <div style={styles.emptyState}>
  //         <div style={styles.emptyIcon}>📄</div>
  //         <h3 style={styles.emptyTitle}>Resume Preview</h3>
  //         <p>Select a template and click "Generate Resume" to see your resume here.</p>
  //       </div>
  //     );
  //   }

  //   switch (selectedTemplate) {
  //     case 1:
  //       return (
  //         <div style={styles.resumeTemplate1}>
  //           {/* Header */}
  //           <div style={styles.resumeHeader1}>
  //             <h1 style={styles.resumeName1}>{resumeData.personalInfo.name}</h1>
  //             <p style={styles.resumeTitle1}>Frontend Developer & UI Specialist</p>
  //             <div style={styles.resumeContact1}>
  //               {resumeData.personalInfo.email && (
  //                 <div style={styles.contactItem}>📧 {resumeData.personalInfo.email}</div>
  //               )}
  //               {resumeData.personalInfo.phone && (
  //                 <div style={styles.contactItem}>📱 {resumeData.personalInfo.phone}</div>
  //               )}
  //               {resumeData.personalInfo.location && (
  //                 <div style={styles.contactItem}>📍 {resumeData.personalInfo.location}</div>
  //               )}
  //               {resumeData.personalInfo.linkedin && (
  //                 <div style={styles.contactItem}>💼 linkedin.com/in/username</div>
  //               )}
  //               {resumeData.personalInfo.github && (
  //                 <div style={styles.contactItem}>🐙 github.com/username</div>
  //               )}
  //             </div>
  //           </div>

  //           {/* Summary */}
  //           <div style={styles.section1}>
  //             <h2 style={styles.sectionTitle1}>Professional Summary</h2>
  //             <p style={{ lineHeight: 1.6, color: "#4a5568" }}>{resumeData.summary}</p>
  //           </div>

  //           {/* Skills */}
  //           <div style={styles.section1}>
  //             <h2 style={styles.sectionTitle1}>Technical Skills</h2>
  //             <div>
  //               {resumeData.skills.map((skill, index) => (
  //                 <span key={index} style={styles.skillTag1}>{skill}</span>
  //               ))}
  //             </div>
  //           </div>

  //           {/* Experience */}
  //           <div style={styles.section1}>
  //             <h2 style={styles.sectionTitle1}>Work Experience</h2>
  //             {resumeData.experience.map((exp, index) => (
  //               <div key={index} style={styles.experienceItem1}>
  //                 <div style={styles.experienceHeader1}>
  //                   <div>
  //                     <h3 style={styles.experienceTitle1}>{exp.title}</h3>
  //                     <p style={styles.experienceCompany1}>{exp.company}</p>
  //                   </div>
  //                   <span style={styles.experienceDuration1}>{exp.duration}</span>
  //                 </div>
  //                 <p style={styles.experienceDescription1}>{exp.description}</p>
  //               </div>
  //             ))}
  //           </div>

  //           {/* Education */}
  //           <div style={styles.section1}>
  //             <h2 style={styles.sectionTitle1}>Education</h2>
  //             {resumeData.education.map((edu, index) => (
  //               <div key={index} style={styles.experienceItem1}>
  //                 <div style={styles.experienceHeader1}>
  //                   <div>
  //                     <h3 style={styles.experienceTitle1}>{edu.degree}</h3>
  //                     <p style={styles.experienceCompany1}>{edu.institution}</p>
  //                   </div>
  //                   <span style={styles.experienceDuration1}>{edu.duration}</span>
  //                 </div>
  //                 <p style={styles.experienceDescription1}>{edu.description}</p>
  //               </div>
  //             ))}
  //           </div>

  //           {/* Projects */}
  //           <div style={styles.section1}>
  //             <h2 style={styles.sectionTitle1}>Projects</h2>
  //             {resumeData.projects.map((project, index) => (
  //               <div key={index} style={styles.experienceItem1}>
  //                 <h3 style={styles.experienceTitle1}>{project.name}</h3>
  //                 <p style={styles.experienceDescription1}>{project.description}</p>
  //                 <div style={{ marginTop: "0.5rem" }}>
  //                   {project.technologies.map((tech, idx) => (
  //                     <span key={idx} style={styles.skillTag1}>{tech}</span>
  //                   ))}
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       );

  //     case 2:
  //       // Use the imported ResumeOne component for template 2 (Creative)
  //       return (
  //         <div style={{ padding: '20px' }}>
  //           <ResumeOne resumeData={resumeData} isPreview={true} />
  //         </div>
  //       );

  //     case 3:
  //       // Classic Template
  //       return (
  //         <div style={styles.resumeTemplate3}>
  //           <div style={styles.resumeHeader3}>
  //             <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#2d3748", marginBottom: "0.5rem" }}>
  //               {resumeData.personalInfo.name}
  //             </h1>
  //             <p style={{ fontSize: "1.25rem", color: "#718096" }}>Classic Professional</p>
  //             <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
  //               {resumeData.personalInfo.email && <span>Email: {resumeData.personalInfo.email}</span>}
  //               {resumeData.personalInfo.phone && <span>Phone: {resumeData.personalInfo.phone}</span>}
  //             </div>
  //           </div>

  //           <div style={{ marginBottom: "1.5rem" }}>
  //             <h2 style={{ fontSize: "1.5rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
  //               Professional Summary
  //             </h2>
  //             <p>{resumeData.summary}</p>
  //           </div>

  //           <div style={{ marginBottom: "1.5rem" }}>
  //             <h2 style={{ fontSize: "1.5rem", fontWeight: 600, borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
  //               Experience
  //             </h2>
  //             {resumeData.experience.map((exp, index) => (
  //               <div key={index} style={{ marginBottom: "1rem" }}>
  //                 <div style={{ display: "flex", justifyContent: "space-between" }}>
  //                   <h3 style={{ fontWeight: 600 }}>{exp.title} - {exp.company}</h3>
  //                   <span>{exp.duration}</span>
  //                 </div>
  //                 <p>{exp.description}</p>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       );

  //     case 4:
  //       // Minimalist Template
  //       return (
  //         <div style={styles.resumeTemplate4}>
  //           <div style={styles.resumeHeader4}>
  //             <h1 style={styles.resumeName4}>{resumeData.personalInfo.name}</h1>
  //             <p style={{ color: "#718096", fontSize: "1rem" }}>Minimalist Professional</p>
  //             <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#4a5568" }}>
  //               {resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.location}
  //             </div>
  //           </div>

  //           <div style={{ marginBottom: "2rem" }}>
  //             <h2 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: "0.5rem" }}>SUMMARY</h2>
  //             <p style={{ color: "#4a5568", lineHeight: 1.6 }}>{resumeData.summary}</p>
  //           </div>

  //           <div style={{ marginBottom: "2rem" }}>
  //             <h2 style={{ fontSize: "1.2rem", fontWeight: 500, marginBottom: "0.5rem" }}>EXPERIENCE</h2>
  //             {resumeData.experience.map((exp, index) => (
  //               <div key={index} style={{ marginBottom: "1rem" }}>
  //                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
  //                   <span style={{ fontWeight: 500 }}>{exp.title}</span>
  //                   <span style={{ color: "#718096", fontSize: "0.9rem" }}>{exp.duration}</span>
  //                 </div>
  //                 <div style={{ color: "#4a5568", fontSize: "0.9rem", marginBottom: "0.25rem" }}>{exp.company}</div>
  //                 <div style={{ color: "#718096", fontSize: "0.85rem" }}>{exp.description}</div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       );

  //     default:
  //       return (
  //         <div style={styles.resumeTemplate1}>
  //           <div style={styles.resumeHeader1}>
  //             <h1 style={styles.resumeName1}>{resumeData.personalInfo.name}</h1>
  //             <p style={styles.resumeTitle1}>Professional Resume</p>
  //           </div>
  //         </div>
  //       );
  //   }
  // };
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
              <p style={styles.resumeTitle1}>Frontend Developer & UI Specialist</p>
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
                  <div style={styles.contactItem}>💼 linkedin.com/in/username</div>
                )}
                {resumeData.personalInfo.github && (
                  <div style={styles.contactItem}>🐙 github.com/username</div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div style={styles.section1}>
              <h2 style={styles.sectionTitle1}>Professional Summary</h2>
              <p style={{ lineHeight: 1.6, color: "#4a5568" }}>{resumeData.summary}</p>
            </div>

            {/* Skills */}
            <div style={styles.section1}>
              <h2 style={styles.sectionTitle1}>Technical Skills</h2>
              <div>
                {resumeData.skills.map((skill, index) => (
                  <span key={index} style={styles.skillTag1}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div style={styles.section1}>
              <h2 style={styles.sectionTitle1}>Work Experience</h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} style={styles.experienceItem1}>
                  <div style={styles.experienceHeader1}>
                    <div>
                      <h3 style={styles.experienceTitle1}>{exp.title}</h3>
                      <p style={styles.experienceCompany1}>{exp.company}</p>
                    </div>
                    <span style={styles.experienceDuration1}>{exp.duration}</span>
                  </div>
                  <p style={styles.experienceDescription1}>{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={styles.section1}>
              <h2 style={styles.sectionTitle1}>Education</h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} style={styles.experienceItem1}>
                  <div style={styles.experienceHeader1}>
                    <div>
                      <h3 style={styles.experienceTitle1}>{edu.degree}</h3>
                      <p style={styles.experienceCompany1}>{edu.institution}</p>
                    </div>
                    <span style={styles.experienceDuration1}>{edu.duration}</span>
                  </div>
                  <p style={styles.experienceDescription1}>{edu.description}</p>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div style={styles.section1}>
              <h2 style={styles.sectionTitle1}>Projects</h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} style={styles.experienceItem1}>
                  <h3 style={styles.experienceTitle1}>{project.name}</h3>
                  <p style={styles.experienceDescription1}>{project.description}</p>
                  <div style={{ marginTop: "0.5rem" }}>
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} style={styles.skillTag1}>{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );


      case 2:
        // Creative - Uses ResumeOne
        return (
          <div style={{ padding: '20px' }}>
            <ResumeOne resumeData={resumeData} isPreview={true} />
          </div>
        );

      case 3:
        // Classic - Uses ResumeTwo
        return (
          <div style={{ padding: '20px' }}>
            <ResumeTwo resumeData={resumeData} isPreview={true} />
          </div>
        );

      case 4:
        // Minimalist - Uses ResumeThree
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
          {/* Profile Data Section */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionTitle}>
              <span>👤</span> Your Profile Data
            </h2>
            <div style={{ fontSize: "0.9rem", color: "#4a5568" }}>
              <p><strong>Name:</strong> {user.fullName || "Not set"}</p>
              <p><strong>Email:</strong> {user.email || "Not set"}</p>
              <p><strong>Skills:</strong> {Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "Not set"}</p>
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
                🚀 Generate Resume
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
            {/* {previewMode && (
              <div style={styles.previewControls}>
                <button
                  style={styles.controlButton}
                  onClick={() => downloadResume("PDF")}
                  onMouseEnter={(e) => handleButtonHover(e, true, false)}
                  onMouseLeave={(e) => handleButtonHover(e, false, false)}
                  className="control-button"
                >
                  📥 PDF
                </button>
                <button
                  style={styles.controlButton}
                  onClick={() => downloadResume("DOCX")}
                  onMouseEnter={(e) => handleButtonHover(e, true, false)}
                  onMouseLeave={(e) => handleButtonHover(e, false, false)}
                  className="control-button"
                >
                  📝 Word
                </button>
                <button
                  style={styles.controlButton}
                  onClick={shareResume}
                  onMouseEnter={(e) => handleButtonHover(e, true, false)}
                  onMouseLeave={(e) => handleButtonHover(e, false, false)}
                  className="control-button"
                >
                  🔗 Share
                </button>
              </div>
            )} */}
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
          {/* <button
            style={styles.actionButtonPrimary}
            onClick={() => setPreviewMode(false)}
            onMouseEnter={(e) => handleButtonHover(e, true, true)}
            onMouseLeave={(e) => handleButtonHover(e, false, true)}
            className="action-button-primary"
          >
            Edit Template
          </button> */}
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
