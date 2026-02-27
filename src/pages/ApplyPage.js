import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

// SVG Icons Component (keep all your existing Icons code here - it's the same)
const Icons = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
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
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  GraduationCap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Tool: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
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
  Award: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Save: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Money: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Building: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Tag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
};

const ApplyPage = () => {
  const navigate = useNavigate();
  const { internshipId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [internship, setInternship] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: [],
    coverLetter: "",
    resumeUrl: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    additionalInfo: ""
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      alert("Please login to apply for internships");
      navigate("/login");
      return;
    }

    fetchInternshipDetails();
    fetchUserProfile();
  }, [internshipId, navigate]);

  const fetchInternshipDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/internships/${internshipId}`);
      
      if (response.data.success) {
        const data = response.data.data;
        setInternship({
          id: data._id,
          title: data.title,
          company: data.companyName || "Tech Company",
          location: data.location,
          stipend: formatStipend(data.stipend),
          duration: data.duration,
          timeline: data.startDate ? new Date(data.startDate).toLocaleDateString() : "Flexible",
          description: data.description,
          skills: data.skills || [],
          applicationDeadline: data.applicationDeadline
        });
      }
    } catch (error) {
      console.error("Error fetching internship:", error);
      alert("Failed to load internship details");
      navigate("/career-paths");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const response = await axios.get(
        `http://localhost:5000/api/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const profile = response.data.data;
        setUserProfile(profile);
        
        // Pre-fill form with profile data
        setFormData(prev => ({
          ...prev,
          fullName: profile.fullName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          skills: profile.technicalSkills || [],
          linkedinUrl: profile.linkedin || "",
          githubUrl: profile.github || "",
          portfolioUrl: profile.portfolio || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
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
    return `$${stipend.amount}/${periodMap[stipend.period] || 'month'}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    } else if (formData.coverLetter.length < 50) {
      newErrors.coverLetter = "Cover letter should be at least 50 characters";
    } else if (formData.coverLetter.length > 5000) {
      newErrors.coverLetter = "Cover letter should not exceed 5000 characters";
    }
    
    if (!formData.resumeUrl.trim()) {
      newErrors.resumeUrl = "Resume URL is required";
    } else if (!formData.resumeUrl.match(/^https?:\/\/.+/)) {
      newErrors.resumeUrl = "Please enter a valid URL (include http:// or https://)";
    }
    
    if (formData.portfolioUrl && !formData.portfolioUrl.match(/^https?:\/\/.+/)) {
      newErrors.portfolioUrl = "Please enter a valid URL (include http:// or https://)";
    }
    
    if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com')) {
      newErrors.linkedinUrl = "Please enter a valid LinkedIn URL";
    }
    
    if (formData.githubUrl && !formData.githubUrl.includes('github.com')) {
      newErrors.githubUrl = "Please enter a valid GitHub URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSubmitting(true);
      
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      // Make sure we have the userId
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Create payload with valid enum values
      const applicationPayload = {
        userId: userId,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        experience: "0", // Use a valid enum value from ['0','1','2','3','4','5']
        education: "",   // Empty string IS allowed for education
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        coverLetter: formData.coverLetter.trim(),
        resumeUrl: formData.resumeUrl.trim(),
        portfolioUrl: formData.portfolioUrl.trim() || "",
        linkedinUrl: formData.linkedinUrl.trim() || "",
        githubUrl: formData.githubUrl.trim() || "",
        startDate: undefined,
        additionalInfo: formData.additionalInfo.trim() || ""
      };

      // Remove undefined fields
      Object.keys(applicationPayload).forEach(key => 
        applicationPayload[key] === undefined && delete applicationPayload[key]
      );

      console.log("Submitting application payload:", applicationPayload);
      
      const response = await axios.post(
        `http://localhost:5000/api/applications/${internshipId}/apply`,
        applicationPayload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log("Application response:", response.data);
      
      if (response.data.success) {
        setSubmitSuccess(true);
        // Store the application ID in localStorage to track applied internships
        const appliedInternships = JSON.parse(localStorage.getItem('appliedInternships') || '[]');
        appliedInternships.push(internshipId);
        localStorage.setItem('appliedInternships', JSON.stringify(appliedInternships));
        
        setTimeout(() => {
          navigate("/career-paths");
        }, 3000);
      }
      
    } catch (error) {
      console.error("Error submitting application:", error);
      
      let errorMessage = "Failed to submit application. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.errors) {
          // Handle validation errors from backend
          const backendErrors = error.response.data.errors;
          if (typeof backendErrors === 'object') {
            errorMessage = Object.values(backendErrors).join(", ");
          } else {
            errorMessage = backendErrors;
          }
        } else if (error.response.status === 400) {
          errorMessage = "Validation error. Please check your form data.";
        } else if (error.response.status === 401) {
          errorMessage = "Your session has expired. Please login again.";
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response.status === 403) {
          errorMessage = "You don't have permission to apply for this internship.";
        } else if (error.response.status === 404) {
          errorMessage = "Internship not found.";
        } else if (error.response.status === 409) {
          errorMessage = "You have already applied for this internship.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      } else {
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const SkillsDisplay = ({ skills }) => {
    if (!skills || skills.length === 0) {
      return (
        <div style={styles.noSkillsMessage}>
          <Icons.Info /> No skills found in your profile. Please update your profile first.
        </div>
      );
    }

    return (
      <div style={styles.skillsDisplayContainer}>
        {skills.map((skill, index) => (
          <span key={index} style={styles.skillDisplayTag}>
            {skill}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading application form...</div>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
          <h2 style={{ color: "#2d3748", marginBottom: "0.5rem" }}>Internship Not Found</h2>
          <p style={{ color: "#718096", marginBottom: "1.5rem" }}>
            The internship you're trying to apply for doesn't exist or has been removed.
          </p>
          <Link to="/career-paths" style={styles.backLink}>
            ← Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successContainer}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Application Submitted Successfully!</h2>
          <p style={styles.successMessage}>
            Your application for <strong>{internship.title}</strong> at <strong>{internship.company}</strong> has been submitted.
          </p>
          <div style={styles.successDetails}>
            <p style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
              <Icons.Info /> What happens next?
            </p>
            <ul style={styles.successList}>
              <li>The employer will review your application</li>
              <li>You'll receive an email confirmation</li>
              <li>Check your application status in your dashboard</li>
            </ul>
          </div>
          <p style={styles.redirectMessage}>Redirecting you to internships page...</p>
          <button 
            onClick={() => navigate("/career-paths")}
            style={styles.returnButton}
          >
            Return to Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #0073b1;
          box-shadow: 0 0 0 3px rgba(0, 115, 177, 0.1);
        }
        
        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #006097 0%, #0080b0 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 115, 177, 0.25);
        }
        
        .cancel-button:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }
        
        .back-button:hover {
          background: #f0f7ff;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Back Button & Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <button 
            onClick={handleCancel} 
            style={styles.backButton}
            className="back-button"
          >
            <Icons.ArrowLeft />
            Back
          </button>
        </div>
        <h1 style={styles.title}>Apply for Internship</h1>
        <p style={styles.subtitle}>Complete the form below to submit your application</p>
      </div>

      {/* Two Column Layout */}
      <div style={styles.mainLayout}>
        {/* Left Column - Internship Details */}
        <div style={styles.leftColumn}>
          <div style={styles.internshipCard}>
            <div style={styles.internshipHeader}>
              <h2 style={styles.internshipTitle}>{internship.title}</h2>
              <p style={styles.internshipCompany}>
                <Icons.Building />
                {internship.company}
              </p>
            </div>

            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}><Icons.Money /></span>
                <div>
                  <span style={styles.infoLabel}>Stipend</span>
                  <span style={styles.infoValue}>{internship.stipend}</span>
                </div>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}><Icons.MapPin /></span>
                <div>
                  <span style={styles.infoLabel}>Location</span>
                  <span style={styles.infoValue}>{internship.location}</span>
                </div>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}><Icons.Clock /></span>
                <div>
                  <span style={styles.infoLabel}>Duration</span>
                  <span style={styles.infoValue}>{internship.duration}</span>
                </div>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}><Icons.Calendar /></span>
                <div>
                  <span style={styles.infoLabel}>Start Date</span>
                  <span style={styles.infoValue}>{internship.timeline}</span>
                </div>
              </div>
              
              <div style={styles.infoItem}>
                <span style={styles.infoIcon}><Icons.Clock /></span>
                <div>
                  <span style={styles.infoLabel}>Deadline</span>
                  <span style={styles.infoValue}>
                    {internship.applicationDeadline 
                      ? new Date(internship.applicationDeadline).toLocaleDateString() 
                      : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                <Icons.FileText />
                Description
              </h3>
              <p style={styles.description}>{internship.description}</p>
            </div>

            {internship.skills && internship.skills.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  <Icons.Tag />
                  Required Skills
                </h3>
                <div style={styles.skillsContainer}>
                  {internship.skills.map((skill, index) => (
                    <span key={index} style={styles.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={styles.profileTip}>
              <span style={styles.tipIcon}><Icons.Info /></span>
              <div>
                <h4 style={styles.tipTitle}>Application Tips</h4>
                <ul style={styles.tipList}>
                  <li>Customize your cover letter for this specific role</li>
                  <li>Highlight relevant projects</li>
                  <li>Ensure your resume is up to date</li>
                  <li>Include links to your portfolio or GitHub</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Application Form */}
        <div style={styles.rightColumn}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Error Summary */}
            {errors.submit && (
              <div style={styles.errorSummary}>
                <Icons.AlertCircle />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Personal Information Section */}
            <div style={styles.formSection}>
              <div style={styles.formSectionHeader}>
                <span style={styles.formSectionIcon}><Icons.User /></span>
                <h3 style={styles.formSectionTitle}>Personal Information</h3>
              </div>
              
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.User /></span>
                    Full Name <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <input
                      type="text"
                      name="fullName"
                      style={{
                        ...styles.input,
                        ...(errors.fullName && styles.inputError)
                      }}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="form-input"
                    />
                  </div>
                  {errors.fullName && <span style={styles.errorText}><Icons.AlertCircle /> {errors.fullName}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.Email /></span>
                    Email <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <input
                      type="email"
                      name="email"
                      style={{
                        ...styles.input,
                        ...(errors.email && styles.inputError)
                      }}
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="form-input"
                    />
                  </div>
                  {errors.email && <span style={styles.errorText}><Icons.AlertCircle /> {errors.email}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.Phone /></span>
                    Phone <span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputWrapper}>
                    <input
                      type="tel"
                      name="phone"
                      style={{
                        ...styles.input,
                        ...(errors.phone && styles.inputError)
                      }}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="form-input"
                    />
                  </div>
                  {errors.phone && <span style={styles.errorText}><Icons.AlertCircle /> {errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Skills Section - Read-only */}
            <div style={styles.formSection}>
              <div style={styles.formSectionHeader}>
                <span style={styles.formSectionIcon}><Icons.Tag /></span>
                <h3 style={styles.formSectionTitle}>Your Skills (from profile)</h3>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}><Icons.Tag /></span>
                  Technical Skills
                </label>
                <SkillsDisplay skills={formData.skills} />
                <div style={styles.helperText}>
                  <Icons.Info />
                  Skills are automatically fetched from your profile. Update them in your profile if needed.
                </div>
              </div>
            </div>

            {/* Cover Letter Section */}
            <div style={styles.formSection}>
              <div style={styles.formSectionHeader}>
                <span style={styles.formSectionIcon}><Icons.FileText /></span>
                <h3 style={styles.formSectionTitle}>
                  Cover Letter <span style={styles.required}>*</span>
                </h3>
              </div>
              
              <div style={styles.formGroup}>
                <textarea
                  name="coverLetter"
                  style={{
                    ...styles.textarea,
                    ...(errors.coverLetter && styles.inputError)
                  }}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Explain why you're a great fit for this internship. Highlight your relevant skills, experience, and enthusiasm for the role..."
                  className="form-textarea"
                  rows={6}
                />
                {errors.coverLetter && <span style={styles.errorText}><Icons.AlertCircle /> {errors.coverLetter}</span>}
                <div style={styles.charCount}>
                  {formData.coverLetter.length} / 50 minimum characters (max 5000)
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div style={styles.formSection}>
              <div style={styles.formSectionHeader}>
                <span style={styles.formSectionIcon}><Icons.FileText /></span>
                <h3 style={styles.formSectionTitle}>
                  Resume URL <span style={styles.required}>*</span>
                </h3>
              </div>
              
              <div style={styles.formGroup}>
                <div style={styles.inputWrapper}>
                  <input
                    type="url"
                    name="resumeUrl"
                    style={{
                      ...styles.input,
                      ...(errors.resumeUrl && styles.inputError)
                    }}
                    value={formData.resumeUrl}
                    onChange={handleInputChange}
                    placeholder="https://drive.google.com/your-resume.pdf"
                    className="form-input"
                  />
                </div>
                {errors.resumeUrl && <span style={styles.errorText}><Icons.AlertCircle /> {errors.resumeUrl}</span>}
                <div style={styles.helperText}>
                  <Icons.Info />
                  Link to Google Drive, Dropbox, or other cloud storage
                </div>
              </div>
            </div>

            {/* Portfolio & Social Links Section */}
            <div style={styles.formSection}>
              <div style={styles.formSectionHeader}>
                <span style={styles.formSectionIcon}><Icons.Link /></span>
                <h3 style={styles.formSectionTitle}>Portfolio & Social Links</h3>
              </div>
              
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.Globe /></span>
                    Portfolio
                  </label>
                  <div style={styles.inputWrapper}>
                    <input
                      type="url"
                      name="portfolioUrl"
                      style={{
                        ...styles.input,
                        ...(errors.portfolioUrl && styles.inputError)
                      }}
                      value={formData.portfolioUrl}
                      onChange={handleInputChange}
                      placeholder="https://yourportfolio.com"
                      className="form-input"
                    />
                  </div>
                  {errors.portfolioUrl && <span style={styles.errorText}><Icons.AlertCircle /> {errors.portfolioUrl}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.Linkedin /></span>
                    LinkedIn
                  </label>
                  <div style={styles.inputWrapper}>
                    <input
                      type="url"
                      name="linkedinUrl"
                      style={{
                        ...styles.input,
                        ...(errors.linkedinUrl && styles.inputError)
                      }}
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="form-input"
                    />
                  </div>
                  {errors.linkedinUrl && <span style={styles.errorText}><Icons.AlertCircle /> {errors.linkedinUrl}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.GitHub /></span>
                    GitHub
                  </label>
                  <div style={styles.inputWrapper}>
                    <input
                      type="url"
                      name="githubUrl"
                      style={{
                        ...styles.input,
                        ...(errors.githubUrl && styles.inputError)
                      }}
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className="form-input"
                    />
                  </div>
                  {errors.githubUrl && <span style={styles.errorText}><Icons.AlertCircle /> {errors.githubUrl}</span>}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div style={styles.formSection}>
              <div style={styles.formSectionHeader}>
                <span style={styles.formSectionIcon}><Icons.Info /></span>
                <h3 style={styles.formSectionTitle}>Additional Information</h3>
              </div>
              
              <div style={styles.formGroup}>
                <textarea
                  name="additionalInfo"
                  style={styles.textarea}
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Any additional information you'd like to share with the employer..."
                  className="form-textarea"
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div style={styles.formActions}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleCancel}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(submitting && styles.submitButtonDisabled)
                }}
                disabled={submitting}
                className="submit-button"
              >
                {submitting ? (
                  <>
                    <div style={styles.submitSpinner} />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Icons.Check />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "2rem",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "2rem",
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    marginBottom: "0.5rem",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    color: "#0073b1",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#191919",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#666",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "2rem",
  },
  leftColumn: {
    position: "sticky",
    top: "2rem",
    height: "fit-content",
  },
  rightColumn: {
    background: "transparent",
  },
  internshipCard: {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    padding: "1.5rem",
  },
  internshipHeader: {
    marginBottom: "1.5rem",
  },
  internshipTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#191919",
    marginBottom: "0.5rem",
  },
  internshipCompany: {
    fontSize: "1.125rem",
    color: "#0073b1",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  infoIcon: {
    fontSize: "1.25rem",
    color: "#0073b1",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    display: "block",
    fontSize: "0.75rem",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    display: "block",
    fontSize: "0.875rem",
    color: "#2d3748",
    fontWeight: 600,
  },
  divider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "1.5rem 0",
  },
  section: {
    marginBottom: "1.5rem",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#191919",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  description: {
    fontSize: "0.875rem",
    color: "#4a5568",
    lineHeight: 1.6,
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  skillTag: {
    background: "#f0f7ff",
    color: "#0073b1",
    padding: "0.375rem 0.875rem",
    borderRadius: "20px",
    fontSize: "0.8125rem",
    fontWeight: 500,
    border: "1px solid #dbeafe",
  },
  profileTip: {
    background: "#f0f9ff",
    padding: "1rem",
    borderRadius: "8px",
    borderLeft: "4px solid #0073b1",
    display: "flex",
    gap: "0.75rem",
  },
  tipIcon: {
    fontSize: "1.25rem",
    color: "#0073b1",
  },
  tipTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#0073b1",
    marginBottom: "0.5rem",
  },
  tipList: {
    margin: 0,
    paddingLeft: "1.25rem",
    fontSize: "0.8125rem",
    color: "#4a5568",
  },
  form: {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    padding: "1.5rem",
  },
  formSection: {
    marginBottom: "2rem",
  },
  formSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #e5e7eb",
  },
  formSectionIcon: {
    width: "28px",
    height: "28px",
    background: "#f0f7ff",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0073b1",
  },
  formSectionTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    color: "#191919",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1rem",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.5rem",
  },
  labelIcon: {
    opacity: 0.7,
  },
  required: {
    color: "#dc2626",
    marginLeft: "2px",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    transition: "all 0.2s ease",
    backgroundColor: "white",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "0.95rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "120px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  errorText: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: "#dc2626",
    marginTop: "0.25rem",
  },
  errorSummary: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
  },
  skillsDisplayContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    padding: "1rem",
    background: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    minHeight: "3rem",
  },
  skillDisplayTag: {
    background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.875rem",
    fontWeight: 500,
    border: "none",
    boxShadow: "0 2px 4px rgba(0,115,177,0.2)",
  },
  noSkillsMessage: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem",
    background: "#fff3cd",
    color: "#856404",
    borderRadius: "8px",
    border: "1px solid #ffeeba",
    fontSize: "0.875rem",
  },
  helperText: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.75rem",
    color: "#6b7280",
    marginTop: "0.5rem",
  },
  charCount: {
    fontSize: "0.75rem",
    color: "#6b7280",
    textAlign: "right",
    marginTop: "0.25rem",
  },
  formActions: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
    justifyContent: "flex-end",
  },
  cancelButton: {
    padding: "0.75rem 1.5rem",
    background: "#f1f5f9",
    color: "#4a5568",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  submitSpinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    display: "inline-block",
    marginRight: "0.5rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "50vh",
    gap: "1rem",
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #0073b1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#666",
    fontSize: "1rem",
  },
  errorContainer: {
    textAlign: "center",
    padding: "3rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
  },
  backLink: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: 600,
  },
  successContainer: {
    textAlign: "center",
    padding: "3rem",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    maxWidth: "600px",
    margin: "2rem auto",
  },
  successIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  successTitle: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#10b981",
    marginBottom: "1rem",
  },
  successMessage: {
    fontSize: "1rem",
    color: "#4a5568",
    marginBottom: "1.5rem",
  },
  successDetails: {
    background: "#f0f9ff",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    textAlign: "left",
    border: "1px solid #bae6fd",
  },
  successList: {
    margin: "0.5rem 0 0 0",
    paddingLeft: "1.5rem",
    color: "#0369a1",
  },
  redirectMessage: {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "1rem",
  },
  returnButton: {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

export default ApplyPage;