import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// SVG Icons Component
const Icons = {
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
  Lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Building: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
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
  Tag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
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
  Loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  ),
  Career: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
    </svg>
  ),
  Rocket: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M13 11l7-7 1 1-7 7z" />
      <path d="M21 11l-4.5 4.5" />
      <path d="M11 13l-4.5 4.5" />
      <path d="M4 16.5L8.5 21" />
      <path d="M17 3l4 4" />
      <path d="M7 7l4 4" />
      <path d="M3 17l4 4" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Connection: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Growth: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

function Signup() {
  const [activeTab, setActiveTab] = useState("user");
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [companyForm, setCompanyForm] = useState({
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyEmail: "",
    phoneNo: "",
    description: "",
    websiteUrl: "",
    industry: "",
    linkedinUrl: "",
    address: "",
    city: "",
    state: "",
    country: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUserFormValid, setIsUserFormValid] = useState(false);
  const [isCompanyFormValid, setIsCompanyFormValid] = useState(false);
  const navigate = useNavigate();

  // Validate user form
  useEffect(() => {
    const isValid =
      userForm.name.trim() !== "" &&
      userForm.email.trim() !== "" &&
      userForm.password.length >= 6 &&
      userForm.confirmPassword.length >= 6 &&
      userForm.password === userForm.confirmPassword;

    setIsUserFormValid(isValid);
  }, [userForm]);

  // Validate company form
  useEffect(() => {
    const requiredFields = [
      'adminFirstName',
      'adminLastName',
      'adminEmail',
      'companyName',
      'companyEmail',
      'phoneNo',
      'industry'
    ];

    const allRequiredFilled = requiredFields.every(field =>
      companyForm[field] && companyForm[field].toString().trim() !== ""
    );

    const passwordValid =
      companyForm.password.length >= 6 &&
      companyForm.confirmPassword.length >= 6 &&
      companyForm.password === companyForm.confirmPassword;

    setIsCompanyFormValid(allRequiredFilled && passwordValid);
  }, [companyForm]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (password, isCompany = false) => {
    if (isCompany) {
      setCompanyForm({ ...companyForm, password });
    } else {
      setUserForm({ ...userForm, password });
    }
    setPasswordStrength(checkPasswordStrength(password));
  };

  const getPasswordStrengthText = () => {
    const password = activeTab === "user" ? userForm.password : companyForm.password;
    if (password.length === 0) return "";
    const strength = checkPasswordStrength(password);
    switch (strength) {
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "Very Weak";
    }
  };

  const getStrengthColor = () => {
    const password = activeTab === "user" ? userForm.password : companyForm.password;
    const strength = checkPasswordStrength(password);
    switch (strength) {
      case 1: return "#ef4444";
      case 2: return "#f59e0b";
      case 3: return "#3b82f6";
      case 4: return "#10b981";
      default: return "#9ca3af";
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    if (userForm.password !== userForm.confirmPassword) {
      setMessage("❌ Passwords do not match");
      setError(true);
      return;
    }

    if (userForm.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          role: "user"
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully! Redirecting to login...");
        setError(false);

        setUserForm({ name: "", email: "", password: "", confirmPassword: "" });
        setPasswordStrength(0);

        setTimeout(() => navigate("/login"), 1500);
      } else {
        if (data.message && data.message.toLowerCase().includes("already exists") ||
          data.message.toLowerCase().includes("duplicate") ||
          data.message.toLowerCase().includes("already registered")) {
          setTimeout(() => navigate("/login"), 500);
        } else {
          setMessage((data.message || "Signup failed"));
          setError(true);
        }
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
      setError(true);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();

    if (companyForm.password !== companyForm.confirmPassword) {
      setMessage("Passwords do not match");
      setError(true);
      return;
    }

    if (companyForm.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setError(true);
      return;
    }

    const requiredFields = [
      'adminFirstName',
      'adminLastName',
      'adminEmail',
      'companyName',
      'companyEmail',
      'phoneNo',
      'industry'
    ];

    const missingFields = requiredFields.filter(field => !companyForm[field]);

    if (missingFields.length > 0) {
      setMessage(`Please fill all required fields: ${missingFields.join(', ')}`);
      setError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const res = await fetch("http://localhost:5000/api/companies/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${companyForm.adminFirstName} ${companyForm.adminLastName}`,
          email: companyForm.adminEmail,
          password: companyForm.password,
          role: "company_admin",
          companyName: companyForm.companyName,
          contactEmail: companyForm.companyEmail,
          phoneNo: companyForm.phoneNo,
          description: companyForm.description,
          websiteUrl: companyForm.websiteUrl,
          industry: companyForm.industry,
          linkedinUrl: companyForm.linkedinUrl,
          address: companyForm.address,
          city: companyForm.city,
          state: companyForm.state,
          country: companyForm.country
        }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        setMessage("Company registration submitted! Your account will be activated after admin approval.");
        setError(false);

        setCompanyForm({
          adminFirstName: "",
          adminLastName: "",
          adminEmail: "",
          password: "",
          confirmPassword: "",
          companyName: "",
          companyEmail: "",
          phoneNo: "",
          description: "",
          websiteUrl: "",
          industry: "",
          linkedinUrl: "",
          address: "",
          city: "",
          state: "",
          country: ""
        });
        setPasswordStrength(0);

        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } else {
        if (data.message && (data.message.toLowerCase().includes("already exists") ||
          data.message.toLowerCase().includes("duplicate") ||
          data.message.toLowerCase().includes("already registered") ||
          data.message.toLowerCase().includes("email already"))) {
          setTimeout(() => navigate("/login"), 500);
        } else {
          setMessage((data.message || "Registration failed"));
          setError(true);
        }
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
      setError(true);
      console.error("Company signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  // CSS Styles
  const styles = {
    page: {
      minHeight: "100vh",
      background: "f9fafb", // Light purple gradient
      display: "flex",
      justifyContent: "flex-end", // Align content to the right
      alignItems: "center",
      padding: "1rem",
      position: "relative",
      overflow: "hidden",
    },

    backgroundText: {
      position: "absolute",
      left: "5%",
      top: "50%",
      transform: "translateY(-50%)",
      maxWidth: "500px",
      color: "#1f2937",
      zIndex: 1,
    },

    mainTitle: {
      fontSize: "3.5rem",
      fontWeight: 800,
      lineHeight: 1.1,
      marginBottom: "1.5rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Add gradient
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontFamily: "'Inter', sans-serif",
    },

    subtitle: {
      fontSize: "1.25rem",
      color: "#374151", // Darker gray/almost black
      marginBottom: "2rem",
      lineHeight: 1.6,
    },
    features: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      marginTop: "2rem",
    },

    featureItem: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      color: "#374151", // Darker gray/almost black
      fontSize: "1rem",
    },
    featureIcon: {
      width: "24px",
      height: "24px",
    },

    container: {
      width: "600px",
      padding: "1.75rem",
      background: "white",
      borderRadius: "20px",
      border: "1px solid #e2e8f0", // Add a subtle border instead
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      position: "relative",
      zIndex: 2,
      marginRight: "5%",
    },

    header: {
      textAlign: "center",
      marginBottom: "1.25rem",
    },

    title: {
      fontSize: "1.6rem", // Slightly smaller
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "0.4rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },

    headerSubtitle: {
      fontSize: "0.9rem", // Slightly smaller
      color: "#718096",
      marginBottom: "1.25rem",
    },

    tabs: {
      display: "flex",
      marginBottom: "1.25rem",
      borderBottom: "2px solid #e2e8f0",
    },

    tab: {
      flex: 1,
      padding: "0.75rem", // Slightly smaller
      textAlign: "center",
      background: "none",
      border: "none",
      fontSize: "0.9rem", // Slightly smaller
      fontWeight: 600,
      color: "#718096",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
    },

    activeTab: {
      color: "#1f2937", // Purple color to match background
    },

    activeTabIndicator: {
      position: "absolute",
      bottom: "-2px",
      left: "0",
      width: "100%",
      height: "3px",
      background: "#1f2937", // Changed from blue to dark gray
      borderRadius: "3px 3px 0 0",
    },

    form: {
      display: "flex",
      flexDirection: "column",
      gap: "0.65rem"
    },

    formSection: {
      marginBottom: "0.9rem",
    },

    sectionTitle: {
      fontSize: "0.95rem", // Slightly smaller
      fontWeight: 600,
      color: "#4a5568",
      marginBottom: "0.4rem",
      paddingBottom: "0.3rem",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
    },

    sectionSubtitle: {
      fontSize: "0.8rem", // Slightly smaller
      color: "#6b7280",
      marginBottom: "0.4rem",
      fontStyle: "italic",
    },

    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.2rem",
      marginBottom: "0.3rem",
    },

    label: {
      fontSize: "0.8rem", // Slightly smaller
      fontWeight: 600,
      color: "#4a5568",
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
      marginBottom: "0.2rem",
    },

    labelIcon: {
      opacity: 0.7,
    },

    required: {
      color: "#ef4444",
      fontSize: "0.9em",
      marginLeft: "2px",
    },

    inputContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },

    input: {
      width: "100%",
      padding: "0.65rem 1rem", // Slightly smaller
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      fontSize: "0.85rem", // Slightly smaller
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      backgroundColor: "#f8fafc",
    },

    textarea: {
      width: "100%",
      padding: "0.65rem 1rem", // Slightly smaller
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      fontSize: "0.85rem", // Slightly smaller
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      backgroundColor: "#f8fafc",
      minHeight: "80px", // Slightly smaller
      resize: "vertical",
    },

    select: {
      width: "100%",
      padding: "0.65rem 1rem", // Slightly smaller
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      fontSize: "0.85rem", // Slightly smaller
      fontFamily: "inherit",
      backgroundColor: "#f8fafc",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"%23718096\"><path d=\"M4 6l4 4 4-4z\"/></svg>')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "14px", // Slightly smaller
    },

    passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },

    passwordToggle: {
      position: "absolute",
      right: "0.9rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#718096",
      padding: "0",
      width: "18px",
      height: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    passwordStrength: {
      marginTop: "0.3rem",
      height: "4px",
      background: "#e2e8f0",
      borderRadius: "2px",
      overflow: "hidden",
    },

    strengthBar: {
      height: "100%",
      borderRadius: "2px",
      transition: "width 0.3s ease",
    },

    strengthText: {
      fontSize: "0.7rem", // Slightly smaller
      color: "#718096",
      marginTop: "0.2rem",
      textAlign: "right",
    },

    button: {
      padding: "0.7rem",
      borderRadius: "10px",
      border: "none",
      background: "#1f2937", // Changed from blue to dark gray
      color: "#fff",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
      marginTop: "0.4rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
    },

    loadingButton: {
      opacity: 0.7,
      cursor: "not-allowed",
    },

    loadingSpinner: {
      width: "16px", // Slightly smaller
      height: "16px",
      animation: "spin 1s linear infinite",
    },

    messageContainer: {
      marginTop: "0.9rem",
      padding: "0.75rem", // Slightly smaller
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "0.85rem", // Slightly smaller
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
    },

    errorMessage: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },

    successMessage: {
      background: "#d1fae5",
      color: "#065f46",
      border: "1px solid #a7f3d0",
    },

    infoMessage: {
      background: "#f3f4f6", // Changed from light blue to light gray
      color: "#374151", // Changed from blue to dark gray
      border: "1px solid #e5e7eb", // Changed from light blue to light gray
      textAlign: "left",
      fontSize: "0.8rem",
      padding: "0.65rem",
      borderRadius: "8px",
      marginBottom: "0.9rem",
      display: "flex",
      alignItems: "flex-start",
      gap: "0.4rem",
    },

    linkContainer: {
      textAlign: "center",
      marginTop: "1.25rem",
      color: "#718096",
      fontSize: "0.85rem", // Slightly smaller
    },

    link: {
      color: "#3b82f6", // Changed from #7c3aed to blue
      fontWeight: 600,
      textDecoration: "none",
      marginLeft: "0.4rem",
    },

    requirements: {
      fontSize: "0.7rem", // Slightly smaller
      color: "#94a3b8",
      marginTop: "0.2rem",
      paddingLeft: "0.9rem",
    },

    twoColumns: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "0.65rem",
    },

    threeColumns: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: "0.65rem",
    },

    emailNote: {
      fontSize: "0.7rem", // Slightly smaller
      color: "#6b7280",
      marginTop: "0.2rem",
      fontStyle: "italic",
    },

    iconWrapper: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "18px", // Slightly smaller
      height: "18px",
    },

  };

  const styleTag = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #3b82f6; // Changed from #7c3aed to blue
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); // Changed to blue
    background-color: white;
  }
  
  .tab:hover {
    background-color: rgba(59, 130, 246, 0.05); // Changed to blue
  }
    button:hover:not(:disabled) {
    background-color: #111827; /* Slightly darker on hover */
  }
`;

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#7c3aed";
    e.target.style.boxShadow = "0 0 0 3px rgba(124, 58, 237, 0.1)";
    e.target.style.backgroundColor = "white";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
    e.target.style.backgroundColor = "#f8fafc";
  };

  const getMessageStyle = () => {
    return error
      ? { ...styles.messageContainer, ...styles.errorMessage }
      : { ...styles.messageContainer, ...styles.successMessage };
  };

  // Industry options
  const industries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Manufacturing",
    "Retail",
    "Hospitality",
    "Construction",
    "Transportation",
    "Media",
    "Energy",
    "Agriculture",
    "Other"
  ];

  return (
    <div style={styles.page}>
      <style>{styleTag}</style>

      {/* Left side background text */}
      <div style={styles.backgroundText}>
        <h1 style={styles.mainTitle}>
          Build Your Career<br />with CareerSync
        </h1>
        <p style={styles.subtitle}>
          Discover internships, connect with companies,<br />
          and track your growth — all in one place.
        </p>
        <div style={styles.features}>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}><Icons.Rocket /></div>
            <span>Launch your career with curated opportunities</span>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}><Icons.Connection /></div>
            <span>Connect with industry professionals</span>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}><Icons.Growth /></div>
            <span>Track your skills and growth journey</span>
          </div>
        </div>
      </div>

      {/* Form container on the right */}
      <div style={styles.container}>
        <div style={styles.header}>
          {/* Tab Navigation */}
          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === "user" && styles.activeTab)
              }}
              onClick={() => setActiveTab("user")}
            >
              <div style={styles.iconWrapper}>
                <Icons.User />
              </div>
              User
              {activeTab === "user" && <div style={styles.activeTabIndicator}></div>}
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeTab === "company" && styles.activeTab)
              }}
              onClick={() => setActiveTab("company")}
            >
              <div style={styles.iconWrapper}>
                <Icons.Building />
              </div>
              Company
              {activeTab === "company" && <div style={styles.activeTabIndicator}></div>}
            </button>
          </div>
        </div>

        {/* User Signup Form */}
        {activeTab === "user" && (
          <form style={styles.form} onSubmit={handleUserSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <div style={styles.labelIcon}><Icons.User /></div>
                Full Name<span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Enter your full name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <div style={styles.labelIcon}><Icons.Email /></div>
                Email Address<span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <div style={styles.labelIcon}><Icons.Lock /></div>
                Password<span style={styles.required}>*</span>
              </label>
              <div style={styles.passwordContainer}>
                <input
                  style={styles.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={userForm.password}
                  onChange={(e) => handlePasswordChange(e.target.value, false)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>

              <div style={styles.passwordStrength}>
                <div
                  style={{
                    ...styles.strengthBar,
                    width: `${(passwordStrength / 4) * 100}%`,
                    background: getStrengthColor()
                  }}
                />
              </div>
              <div style={styles.strengthText}>
                {getPasswordStrengthText()}
              </div>

              <div style={styles.requirements}>
                • At least 8 characters • One uppercase letter • One number • One special character
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <div style={styles.labelIcon}><Icons.Lock /></div>
                Confirm Password<span style={styles.required}>*</span>
              </label>
              <div style={styles.inputContainer}>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Re-enter your password"
                  value={userForm.confirmPassword}
                  onChange={(e) => setUserForm({ ...userForm, confirmPassword: e.target.value })}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </div>
            </div>

            <button
              style={{
                ...styles.button,
                ...(loading && styles.loadingButton),
                ...(!isUserFormValid && { opacity: 0.5, cursor: "not-allowed" })
              }}
              type="submit"
              disabled={loading || !isUserFormValid}
            >
              {loading ? (
                <>
                  <span style={styles.loadingSpinner}><Icons.Loader /></span>
                  Creating Account...
                </>
              ) : (
                "Create User Account"
              )}
            </button>
          </form>
        )}

        {/* Company Signup Form */}
        {activeTab === "company" && (
          <form style={styles.form} onSubmit={handleCompanySubmit}>
            <div style={styles.infoMessage}>
              <div style={styles.iconWrapper}><Icons.Info /></div>
              <div>
                <strong>Note:</strong> Your company account will be reviewed by admin before activation.
                You'll receive an email notification once approved.
              </div>
            </div>

            {/* 👇 PERSONAL INFORMATION SECTION (Company Admin) */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <div style={styles.iconWrapper}><Icons.User /></div>
                Admin Personal Information
              </h3>
              <p style={styles.sectionSubtitle}>
                This will be your login account to manage the company profile
              </p>

              <div style={styles.threeColumns}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.User /></div>
                    First Name<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="John"
                      value={companyForm.adminFirstName}
                      onChange={(e) => setCompanyForm({ ...companyForm, adminFirstName: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.User /></div>
                    Last Name<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Doe"
                      value={companyForm.adminLastName}
                      onChange={(e) => setCompanyForm({ ...companyForm, adminLastName: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.Email /></div>
                    Personal Email<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="email"
                      placeholder="john.doe@example.com"
                      value={companyForm.adminEmail}
                      onChange={(e) => setCompanyForm({ ...companyForm, adminEmail: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    />
                  </div>
                  <div style={styles.emailNote}>
                    This will be your login email
                  </div>
                </div>
              </div>

              <div style={styles.twoColumns}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.Lock /></div>
                    Password<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.passwordContainer}>
                    <input
                      style={styles.input}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={companyForm.password}
                      onChange={(e) => handlePasswordChange(e.target.value, true)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    />
                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.Lock /></div>
                    Confirm Password<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.passwordContainer}>
                    <input
                      style={styles.input}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={companyForm.confirmPassword}
                      onChange={(e) => setCompanyForm({ ...companyForm, confirmPassword: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    />
                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={styles.passwordStrength}>
                <div
                  style={{
                    ...styles.strengthBar,
                    width: `${(passwordStrength / 4) * 100}%`,
                    background: getStrengthColor()
                  }}
                />
              </div>
              <div style={styles.strengthText}>
                {getPasswordStrengthText()}
              </div>
            </div>

            {/* 👇 COMPANY DETAILS SECTION */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <div style={styles.iconWrapper}><Icons.Building /></div>
                Company Details
              </h3>
              <p style={styles.sectionSubtitle}>
                Information about your company
              </p>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <div style={styles.labelIcon}><Icons.Building /></div>
                  Company Name<span style={styles.required}>*</span>
                </label>
                <div style={styles.inputContainer}>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Your company name"
                    value={companyForm.companyName}
                    onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  />
                </div>
              </div>

              <div style={styles.twoColumns}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.Email /></div>
                    Company Contact Email<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="email"
                      placeholder="contact@company.com"
                      value={companyForm.companyEmail}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyEmail: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    />
                  </div>
                  <div style={styles.emailNote}>
                    For public contact and job applications
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.Phone /></div>
                    Phone Number<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={companyForm.phoneNo}
                      onChange={(e) => setCompanyForm({ ...companyForm, phoneNo: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={styles.twoColumns}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.Tag /></div>
                    Industry<span style={styles.required}>*</span>
                  </label>
                  <div style={styles.inputContainer}>
                    <select
                      style={styles.select}
                      value={companyForm.industry}
                      onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    >
                      <option value="">Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.Globe /></div>
                    Website URL
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="url"
                      placeholder="https://example.com"
                      value={companyForm.websiteUrl}
                      onChange={(e) => setCompanyForm({ ...companyForm, websiteUrl: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <div style={styles.labelIcon}><Icons.FileText /></div>
                  Company Description
                </label>
                <div style={styles.inputContainer}>
                  <textarea
                    style={styles.textarea}
                    placeholder="Describe your company, mission, values, and what makes you unique..."
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <div style={styles.labelIcon}><Icons.Linkedin /></div>
                  LinkedIn URL
                </label>
                <div style={styles.inputContainer}>
                  <input
                    style={styles.input}
                    type="url"
                    placeholder="https://linkedin.com/company/..."
                    value={companyForm.linkedinUrl}
                    onChange={(e) => setCompanyForm({ ...companyForm, linkedinUrl: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>
            </div>

            {/* 👇 LOCATION SECTION */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <div style={styles.iconWrapper}><Icons.MapPin /></div>
                Company Location
              </h3>
              <p style={styles.sectionSubtitle}>
                Where your company is based
              </p>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <div style={styles.labelIcon}><Icons.MapPin /></div>
                  Address
                </label>
                <div style={styles.inputContainer}>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Street address"
                    value={companyForm.address}
                    onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              <div style={styles.threeColumns}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.MapPin /></div>
                    City
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="City"
                      value={companyForm.city}
                      onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.MapPin /></div>
                    State/Province
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="State"
                      value={companyForm.state}
                      onChange={(e) => setCompanyForm({ ...companyForm, state: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <div style={styles.labelIcon}><Icons.MapPin /></div>
                    Country
                  </label>
                  <div style={styles.inputContainer}>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="Country"
                      value={companyForm.country}
                      onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              style={{
                ...styles.button,
                ...(loading && styles.loadingButton),
                ...(!isCompanyFormValid && { opacity: 0.5, cursor: "not-allowed" })
              }}
              type="submit"
              disabled={loading || !isCompanyFormValid}
            >
              {loading ? (
                <>
                  <span style={styles.loadingSpinner}><Icons.Loader /></span>
                  Submitting Registration...
                </>
              ) : (
                "Submit Company Registration"
              )}
            </button>
          </form>
        )}

        {/* Message Display */}
        {message && (
          <div style={getMessageStyle()}>
            {error ? <Icons.X /> : <Icons.Check />}
            {message}
          </div>
        )}

        {/* Login Link */}
        <div style={styles.linkContainer}>
          Already have an account?
          <Link to="/login" style={styles.link}>
            Sign In
          </Link>
        </div>

        {/* Terms and Privacy */}
        <div style={{
          textAlign: "center",
          marginTop: "1.25rem",
          fontSize: "0.7rem",
          color: "#94a3b8"
        }}>
          By creating an account, you agree to our<br />
          <Link to="/terms" style={{ color: "#3b82f6", margin: "0 0.25rem" }}>Terms</Link>
          and
          <Link to="/privacy" style={{ color: "#3b82f6", margin: "0 0.25rem" }}>Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;