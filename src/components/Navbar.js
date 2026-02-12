import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

// SVG Icons Component
const NavIcons = {
  Logo: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  CareerPaths: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Resume: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  ProfileForm: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Login: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  )
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "12px 40px",
    borderBottom: "1px solid #ddd",
    color: "#2c3e50",
    width: "100%",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Open Sans', sans-serif",
  },
  logo: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "20px",
    marginRight: "30px",
    color: "#2c3e50",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  center: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    marginLeft: "50px",
    gap: "24px",
    listStyle: "none", 
    padding: 0,
    margin: 0,
  },
  link: {
    textDecoration: "none",
    color: "#2c3e50",
    fontSize: "15px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    position: "relative",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "30px",
    padding: "8px 14px",
    width: "280px",
    gap: "8px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    flex: 1,
    paddingLeft: "0",
  },
  dropdown: {
    position: "absolute",
    top: "60px",
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "220px",
    zIndex: 2000,
  },
  dropdownHeader: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    fontWeight: "600",
    fontSize: "14px",
    color: "#e67e22",
  },
  dropdownItem: {
    padding: "10px 14px",
    fontSize: "14px",
    color: "#2c3e50",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
  },
  activeLink: {
    color: "#3498db",
    fontWeight: "bold",
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav style={styles.nav}>
      {/* Left: Logo */}
      <div>
        <Link to="/" style={styles.logo}>
          {/* <NavIcons.Logo /> */}
          Career Sync
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <ul style={styles.center}>
        <li>
          <NavLink 
            to="/" 
            style={({ isActive }) => 
              isActive ? {...styles.link, ...styles.activeLink} : styles.link
            }
          >
            <NavIcons.Home />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/dashboard" 
            style={({ isActive }) => 
              isActive ? {...styles.link, ...styles.activeLink} : styles.link
            }
          >
            <NavIcons.Dashboard />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/career-paths" 
            style={({ isActive }) => 
              isActive ? {...styles.link, ...styles.activeLink} : styles.link
            }
          >
            <NavIcons.CareerPaths />
            Career Paths
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/resume" 
            style={({ isActive }) => 
              isActive ? {...styles.link, ...styles.activeLink} : styles.link
            }
          >
            <NavIcons.Resume />
            Resume Builder
          </NavLink>
        </li>
        {/* <li>
          <NavLink 
            to="/profile-form" 
            style={({ isActive }) => 
              isActive ? {...styles.link, ...styles.activeLink} : styles.link
            }
          >
            <NavIcons.ProfileForm />
            Profile Form
          </NavLink>
        </li> */}
      </ul>

      {/* Right: Search + User Menu */}
      <div style={styles.right}>
        {/* Search Bar */}
        <div style={styles.searchBar}>
          <NavIcons.Search />
          <input type="text" placeholder="Search..." style={styles.searchInput} />
        </div>

        {/* User Icon */}
        <div
          onClick={toggleDropdown}
          style={{
            fontSize: "24px",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "50%",
            border: "1px solid #ddd",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
          }}
        >
          <NavIcons.User />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>Menu</div>
            <Link 
              to="/profile" 
              style={styles.dropdownItem}
              onClick={() => setIsOpen(false)}
            >
              <NavIcons.User />
              Profile
            </Link>
            <Link 
              to="/settings" 
              style={styles.dropdownItem}
              onClick={() => setIsOpen(false)}
            >
              <NavIcons.Settings />
              Settings
            </Link>
            <Link 
              to="/resume" 
              style={styles.dropdownItem}
              onClick={() => setIsOpen(false)}
            >
              <NavIcons.Resume />
              View Resume
            </Link>
          </div>
        )}

        {/* Divider + Auth Controls */}
        <span style={{ borderLeft: "1px solid #ccc", height: "20px" }}></span>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#d92c45",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "14px",
                padding: "5px 10px",
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
                fontWeight: "bold",
                fontSize: "14px",
                padding: "5px 10px",
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
      </div>
    </nav>
  );
};

export default Navbar;