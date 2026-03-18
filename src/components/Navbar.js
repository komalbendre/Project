import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const NavIcons = {
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  CareerPaths: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Resume: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Login: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
};

// FIX: navbar height is now a single constant used in BOTH the nav style
// and the spacer below it — so they always match perfectly.
const NAVBAR_HEIGHT = 64;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("isApproved");
      navigate("/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#3498db" : "#2c3e50",
    fontWeight: isActive ? "600" : "500",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 0",
    borderBottom: isActive ? "2px solid #3498db" : "2px solid transparent",
    transition: "color 0.2s, border-color 0.2s",
  });

  return (
    <>
      {/* ── Fixed navbar ─────────────────────────────────────────── */}
      <nav
        style={{
          // FIX: explicit height so it never shifts between pages
          height: `${NAVBAR_HEIGHT}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "0 40px",
          borderBottom: "1px solid #e2e8f0",
          width: "100%",
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            color: "#2c3e50",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          Career Sync
        </Link>

        {/* Nav links */}
        <ul
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "28px",
            listStyle: "none",
            padding: 0,
            margin: "0 40px",
          }}
        >
          <li><NavLink to="/" style={navLinkStyle}><NavIcons.Home />Home</NavLink></li>
          <li><NavLink to="/dashboard" style={navLinkStyle}><NavIcons.Dashboard />Dashboard</NavLink></li>
          <li><NavLink to="/career-paths" style={navLinkStyle}><NavIcons.CareerPaths />Career Paths</NavLink></li>
          <li><NavLink to="/resume" style={navLinkStyle}><NavIcons.Resume />Resume Builder</NavLink></li>
        </ul>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
          {/* Search bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "30px",
              padding: "7px 14px",
              width: "240px",
              gap: "8px",
              backgroundColor: "#f8fafc",
            }}
          >
            <NavIcons.Search />
            <input
              type="text"
              placeholder="Search..."
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                flex: 1,
                backgroundColor: "transparent",
                color: "#2c3e50",
              }}
            />
          </div>

          {/* User icon + dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div
              onClick={toggleDropdown}
              style={{
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f8f9fa",
                color: "#2c3e50",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3498db")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            >
              <NavIcons.User />
            </div>

            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "48px",
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  width: "200px",
                  zIndex: 2000,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid #f1f5f9",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Menu
                </div>
                {[
                  { to: "/profile", icon: <NavIcons.User />, label: "Profile" },
                  { to: "/resume", icon: <NavIcons.Resume />, label: "View Resume" },
                  { to: "/settings", icon: <NavIcons.Settings />, label: "Settings" },
                ].map(({ to, icon, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      color: "#2c3e50",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {icon}
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <span style={{ borderLeft: "1px solid #e2e8f0", height: "22px" }} />

          {/* Auth button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#d92c45",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "14px",
                padding: "5px 8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <NavIcons.Logout />
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              style={{
                textDecoration: "none",
                color: "#3498db",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <NavIcons.Login />
              Login
            </NavLink>
          )}
        </div>
      </nav>

      {/* FIX: single spacer that exactly matches the navbar height.
          This pushes page content below the fixed navbar.
          App.js paddingTop must be removed (see App.js fix). */}
      <div style={{ height: `${NAVBAR_HEIGHT}px`, flexShrink: 0 }} />
    </>
  );
};

export default Navbar;