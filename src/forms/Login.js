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
        body: JSON.stringify(form),
      });
 
      const data = await res.json();
 
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userName", data.user.name);
        // FIX: authRoutes sends 'id' not '_id' — was always storing undefined
        localStorage.setItem("userId", data.user.id || data.user._id);
        localStorage.setItem("isApproved", data.user.isApproved ? "true" : "false");
 
        setMessage("Login successful!");
        setError(false);
 
        setTimeout(() => {
          switch (data.user.role) {
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "company":
            case "company_admin":
              navigate("/company/dashboard");
              break;
            default:
              navigate("/dashboard");
          }
        }, 800);
      } else {
        setMessage("❌ " + (data.message || "Invalid credentials"));
        setError(true);
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };
 
  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f9fafb",
      padding: "20px",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    },
    container: {
      width: "100%",
      maxWidth: "420px",
      padding: "2.5rem",
      background: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "0.5rem",
      color: "#2d3748",
    },
    subtitle: {
      textAlign: "center",
      color: "#718096",
      marginBottom: "2rem",
      fontSize: "0.95rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    input: {
      padding: "0.9rem 1rem",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      fontSize: "1rem",
      backgroundColor: "#f8fafc",
      outline: "none",
    },
    select: {
      padding: "0.9rem 1rem",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      fontSize: "1rem",
      backgroundColor: "#f8fafc",
      cursor: "pointer",
    },
    button: {
      padding: "1rem",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(135deg, #293e97 0%, #0d5469 100%)",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
      fontSize: "1rem",
      marginTop: "0.5rem",
    },
    disabledButton: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    message: {
      marginTop: "1.5rem",
      padding: "1rem",
      borderRadius: "10px",
      textAlign: "center",
      fontWeight: "500",
      fontSize: "0.9rem",
    },
    error: {
      background: "#fee2e2",
      color: "#991b1b",
    },
    success: {
      background: "#d1fae5",
      color: "#065f46",
    },
    linkContainer: {
      textAlign: "center",
      marginTop: "1.5rem",
      fontSize: "0.9rem",
      color: "#718096",
    },
    link: {
      color: "#667eea",
      fontWeight: "600",
      textDecoration: "none",
      marginLeft: "5px",
    },
  };
 
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to continue to CareerSync</p>
 
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
 
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
 
          <select
            style={styles.select}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="company_admin">Company</option>
            <option value="admin">Admin</option>
          </select>
 
          <button
            style={{
              ...styles.button,
              ...(loading && styles.disabledButton),
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
 
        {message && (
          <div
            style={{
              ...styles.message,
              ...(error ? styles.error : styles.success),
            }}
          >
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
    </div>
  );
}
 
export default Login;