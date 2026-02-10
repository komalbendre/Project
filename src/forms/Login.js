import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role: form.role // Optional: send role to backend for validation
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Check role matches backend - allow both "company" and "company_admin"
        const isCompanyRole = (data.user.role === "company" || data.user.role === "company_admin");
        const selectedIsCompany = (form.role === "company" || form.role === "company_admin");

        if (isCompanyRole && !selectedIsCompany) {
          setMessage("❌ Invalid credentials. Please check your email and password.");
          setError(true);
          setLoading(false);
          return;
        }

        if (data.user.role === "admin" && form.role !== "admin") {
          setMessage("❌ Invalid credentials. Please check your email and password.");
          setError(true);
          setLoading(false);
          return;
        }

        if (data.user.role === "user" && form.role !== "user") {
          setMessage("❌ Invalid credentials. Please check your email and password.");
          setError(true);
          setLoading(false);
          return;
        }

        // COMPANY APPROVAL CHECK - Modified for your backend response
        if ((data.user.role === "company" || data.user.role === "company_admin") && !data.user.isApproved) {
          setMessage("Your company account is waiting for admin approval. You will have limited access until approved.");
          setError(true);

          // Save data anyway - Dashboard will handle blocking
          saveUserData(data);

          // Navigate to company dashboard anyway (it will show pending status)
          setTimeout(() => {
            navigate("/company/dashboard");
          }, 1500);

          setLoading(false);
          return;
        }

        setMessage("✅ Login successful!");
        setError(false);

        // Save all user info to localStorage with isApproved
        saveUserData(data);

        // IMPORTANT: Redirect based on role
        setTimeout(() => {
          switch (data.user.role) {
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "company":
            case "company_admin":
              navigate("/company/dashboard");
              break;
            case "user":
              navigate("/dashboard");
              break;
            default:
              navigate("/");
          }
        }, 800);

      } else {
        // Handle backend error messages
        if (data.message === "Company account not approved by admin yet.") {
          setMessage("⚠️ " + data.message + " You can still login but will have limited access.");
          setError(true);

          // Save data and redirect to company dashboard anyway
          saveUserData(data);
          setTimeout(() => {
            navigate("/company/dashboard");
          }, 1500);
        } else {
          setMessage("❌ " + (data.message || "Invalid credentials. Please check your email and password."));
          setError(true);
        }
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again.");
      setError(true);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("userName", data.user.name);
    localStorage.setItem("userEmail", data.user.email);
    // Store isApproved from backend response
    localStorage.setItem("isApproved", data.user.isApproved ? "true" : "false");
    localStorage.setItem("loginTime", new Date().toISOString());

    // For debugging
    console.log("User data saved:", {
      role: data.user.role,
      isApproved: data.user.isApproved,
      name: data.user.name
    });
  };

  // Enhanced CSS Styles with container moved up
  const styles = {
    container: {
      maxWidth: "450px",
      margin: "40px auto", // Changed from 80px to 40px to move container up
      padding: "2.5rem",
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    },
    title: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "0.5rem",
      textAlign: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      fontSize: "1rem",
      color: "#718096",
      textAlign: "center",
      marginBottom: "2rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem"
    },
    input: {
      padding: "0.875rem 1rem",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      fontSize: "1rem",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      backgroundColor: "#f8fafc",
    },
    select: {
      padding: "0.875rem 1rem",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      fontSize: "1rem",
      fontFamily: "inherit",
      backgroundColor: "#f8fafc",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"%23718096\"><path d=\"M4 6l4 4 4-4z\"/></svg>')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "16px",
    },
    button: {
      padding: "1rem",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#fff",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
      marginTop: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    loadingButton: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    loadingSpinner: {
      width: "20px",
      height: "20px",
      border: "3px solid rgba(255,255,255,0.3)",
      borderRadius: "50%",
      borderTopColor: "#fff",
      animation: "spin 1s ease-in-out infinite",
    },
    messageContainer: {
      marginTop: "1.5rem",
      padding: "1rem",
      borderRadius: "10px",
      textAlign: "center",
      fontSize: "0.95rem",
      fontWeight: 500,
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
    warningMessage: {
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fde68a",
    },
    linkContainer: {
      textAlign: "center",
      marginTop: "1.5rem",
      color: "#718096",
      fontSize: "0.95rem",
    },
    link: {
      color: "#667eea",
      fontWeight: 600,
      textDecoration: "none",
      marginLeft: "0.5rem",
    },
    roleDescription: {
      fontSize: "0.875rem",
      color: "#718096",
      marginTop: "0.5rem",
      padding: "0.5rem 1rem",
      background: "#f1f5f9",
      borderRadius: "8px",
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  };

  const getRoleDescription = () => {
    switch (form.role) {
      case "user": return "Find jobs, build resume, get career recommendations";
      case "company_admin": return "Post jobs, manage applications, find candidates";
      case "admin": return "Manage users, approve companies, system oversight";
      default: return "";
    }
  };

  const getMessageStyle = () => {
    if (message.includes("waiting for admin approval") || message.includes("not approved")) {
      return { ...styles.messageContainer, ...styles.warningMessage };
    }
    return error
      ? { ...styles.messageContainer, ...styles.errorMessage }
      : { ...styles.messageContainer, ...styles.successMessage };
  };

  const styleTag = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background-color: white;
    }
    
    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
  `;

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#667eea";
    e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
    e.target.style.backgroundColor = "white";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.boxShadow = "none";
    e.target.style.backgroundColor = "#f8fafc";
  };

  return (
    <div style={styles.container}>
      <style>{styleTag}</style>

      <h1 style={styles.title}>Welcome Back</h1>
      <p style={styles.subtitle}>Sign in to continue to CareerSync</p>

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          required
        />

        <select
          style={styles.select}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        >
          <option value="user">User</option>
          <option value="company_admin">Company</option>
          <option value="admin">Admin</option>
        </select>

        <div style={styles.roleDescription}>
          {getRoleDescription()}
        </div>

        <button
          style={{
            ...styles.button,
            ...(loading && styles.loadingButton)
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span style={styles.loadingSpinner}></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {message && (
        <div style={getMessageStyle()}>
          {message}
        </div>
      )}

      <div style={styles.linkContainer}>
        Don't have an account?
        <Link to="/signup" style={styles.link}>
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;