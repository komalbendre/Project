import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

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
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    flex: 1,
    paddingLeft: "8px",
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
      localStorage.removeItem("token"); // Fixed: was "user" now "token"
      localStorage.removeItem("user"); // Remove user data too
      navigate("/login");
    }
  };

  return (
    <nav style={styles.nav}>
      {/* Left: Logo */}
      <div>
        <Link to="/" style={styles.logo}>
          🚀Career Sync
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
            Resume Builder
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/profile-form" 
            style={({ isActive }) => 
              isActive ? {...styles.link, ...styles.activeLink} : styles.link
            }
          >
            Profile Form
          </NavLink>
        </li>
        {/* REMOVED THE EXTRA BUTTON - it was causing duplicate */}
      </ul>

      {/* Right: Search + User Menu */}
      <div style={styles.right}>
        {/* Search Bar */}
        <div style={styles.searchBar}>
          <input type="text" placeholder="Search..." style={styles.searchInput} />
        </div>

        {/* User Icon */}
        <div
          onClick={toggleDropdown}
          style={{
            fontSize: "24px",
            cursor: "pointer",
            padding: "5px",
            borderRadius: "50%",
            border: "1px solid #ddd",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          👤
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
              👤 Profile
            </Link>
            <Link 
              to="/settings" 
              style={styles.dropdownItem}
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Settings
            </Link>
            {/* Add Resume link to dropdown too */}
            <Link 
              to="/resume" 
              style={styles.dropdownItem}
              onClick={() => setIsOpen(false)}
            >
              📄 View Resume
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
              }}
            >
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
              }}
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;