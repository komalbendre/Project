import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dashboardIcon from "../assets/dashboard.png";
import internshipIcon from "../assets/internshipicon.png";
import applicationIcon from "../assets/applicationicon.png";
import interviewIcon from "../assets/interviewicon.png";
import analyticsIcon from "../assets/analytics.png";
import settingIcon from "../assets/setting.png";

// SVG Icons Component (same as Navbar)
const NavIcons = {
  Logo: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
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
  Internships: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Applications: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Interviews: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Analytics: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
      <circle cx="12" cy="16" r="5" />
      <line x1="3" y1="14" x2="8" y2="14" />
      <line x1="16" y1="14" x2="21" y2="14" />
      <line x1="12" y1="10" x2="12" y2="16" />
      <line x1="8" y1="10" x2="16" y2="10" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ArrowDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
};

const CompanyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSettings, setExpandedSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/company/dashboard",
      icon: NavIcons.Dashboard,
      type: "svg"
    },
    {
      id: "internships",
      title: "Internships",
      path: "/company/internships",
      icon: NavIcons.Internships,
      type: "svg"
    },
    {
      id: "applications",
      title: "Applications",
      path: "/company/applications",
      icon: NavIcons.Applications,
      type: "svg"
    },
    {
      id: "interviews",
      title: "Interviews",
      path: "/company/interviews",
      icon: NavIcons.Interviews,
      type: "svg"
    },
    {
      id: "analytics",
      title: "Analytics",
      path: "/company/analytics",
      icon: NavIcons.Analytics,
      type: "svg"
    },
    {
      id: "settings",
      title: "Settings",
      icon: NavIcons.Settings,
      type: "svg",
      hasSubmenu: true,
      submenuItems: [
        { title: "Company Profile", path: "/company/edit-profile" },
        { title: "Notifications", path: "/company/settings/notifications" },
        { title: "Account", path: "/company/settings/account" }
      ]
    }
  ];

  const handleMenuClick = (item) => {
    if (item.hasSubmenu) {
      setExpandedSettings(!expandedSettings);
    } else {
      navigate(item.path);
      setMobileMenuOpen(false);
      setExpandedSettings(false);
      setDropdownOpen(false);
    }
  };

  const handleSubmenuClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setExpandedSettings(false);
    setDropdownOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSettingsActive = () => {
    return menuItems.find(item => item.id === "settings")?.submenuItems?.some(
      subItem => isActive(subItem.path)
    ) || false;
  };

  // Get user info from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const companyName = localStorage.getItem("companyName") || userData.companyName || "Company";
  const userEmail = localStorage.getItem("userEmail") || userData.email || "admin@company.com";

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
      localStorage.removeItem("companyName");
      localStorage.removeItem("userEmail");
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
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
      position: "fixed",
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
      cursor: "pointer"
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
    centerItem: {
      position: "relative"
    },
    link: {
      textDecoration: "none",
      color: "#2c3e50",
      fontSize: "15px",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "8px 0"
    },
    activeLink: {
      color: "#3498db",
      fontWeight: "bold",
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
    userIcon: {
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
      border: "none",
      background: "none",
      width: "100%",
      textAlign: "left"
    },
    submenu: {
      position: "absolute",
      top: "100%",
      left: 0,
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      minWidth: "200px",
      zIndex: 2000,
      marginTop: "5px"
    },
    submenuItem: {
      padding: "10px 14px",
      fontSize: "14px",
      color: "#2c3e50",
      cursor: "pointer",
      transition: "background 0.2s",
      whiteSpace: "nowrap"
    },
    activeSubmenuItem: {
      color: "#3498db",
      fontWeight: "bold",
      background: "#f8f9fa"
    },
    mobileMenuButton: {
      display: "none",
      background: "#f8f9fa",
      border: "1px solid #ddd",
      color: "#2c3e50",
      width: "40px",
      height: "40px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "1.2rem",
      alignItems: "center",
      justifyContent: "center"
    },
    mobileMenu: {
      display: "none",
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: "#fff",
      borderTop: "1px solid #ddd",
      padding: "1rem",
      maxHeight: "calc(100vh - 70px)",
      overflowY: "auto",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    },
    divider: {
      borderLeft: "1px solid #ccc",
      height: "20px"
    },
    logoutButton: {
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
    }
  };

  // Media query for responsive design
  const mediaStyles = `
    @media (max-width: 1024px) {
      .desktop-menu {
        display: none !important;
      }
      .mobile-menu-button {
        display: flex !important;
      }
      .search-bar {
        display: none !important;
      }
    }
    @media (max-width: 768px) {
      .navbar-container {
        padding: 12px 20px !important;
      }
      .logo-text {
        display: none !important;
      }
    }
  `;

  return (
    <>
      <style>{mediaStyles}</style>
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate("/company/dashboard")}>
          <NavIcons.Logo />
          <span className="logo-text">Career Sync</span>
        </div>

        {/* Desktop Menu */}
        <ul style={styles.center} className="desktop-menu">
          {menuItems.map((item) => (
            <li key={item.id} style={styles.centerItem}>
              {item.hasSubmenu ? (
                <>
                  <button
                    style={{
                      ...styles.link,
                      ...((isSettingsActive()) && styles.activeLink)
                    }}
                    onClick={() => handleMenuClick(item)}
                  >
                    <item.icon />
                    {item.title}
                    <NavIcons.ArrowDown />
                  </button>
                  
                  {/* Settings Submenu */}
                  {expandedSettings && (
                    <div style={styles.submenu}>
                      {item.submenuItems.map((subItem, index) => (
                        <div
                          key={index}
                          style={{
                            ...styles.submenuItem,
                            ...(isActive(subItem.path) && styles.activeSubmenuItem)
                          }}
                          onClick={() => handleSubmenuClick(subItem.path)}
                          onMouseEnter={(e) => {
                            if (!isActive(subItem.path)) {
                              e.currentTarget.style.background = "#f8f9fa";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive(subItem.path)) {
                              e.currentTarget.style.background = "transparent";
                            }
                          }}
                        >
                          {subItem.title}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  style={{
                    ...styles.link,
                    ...(isActive(item.path) && styles.activeLink)
                  }}
                  onClick={() => handleMenuClick(item)}
                >
                  <item.icon />
                  {item.title}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div style={styles.right}>
          {/* Search Bar */}
          <form onSubmit={handleSearch} style={styles.searchBar} className="search-bar">
            <NavIcons.Search />
            <input
              type="text"
              placeholder="Search..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* User Icon */}
          <div
            style={styles.userIcon}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <NavIcons.User />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>Menu</div>
              <div
                style={styles.dropdownItem}
                onClick={() => {
                  navigate("/company/edit-profile");
                  setDropdownOpen(false);
                }}
              >
                <NavIcons.User />
                Company Profile
              </div>
              <div
                style={styles.dropdownItem}
                onClick={() => {
                  navigate("/company/settings/notifications");
                  setDropdownOpen(false);
                }}
              >
                <NavIcons.Settings />
                Settings
              </div>
            </div>
          )}

          {/* Divider */}
          <span style={styles.divider}></span>

          {/* Logout Button */}
          <button
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            <NavIcons.Logout />
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            style={styles.mobileMenuButton}
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            {menuItems.map((item) => (
              <div key={item.id} style={{ marginBottom: "0.5rem" }}>
                <button
                  style={{
                    ...styles.link,
                    width: "100%",
                    justifyContent: "flex-start",
                    padding: "12px",
                    ...((isActive(item.path) || (item.hasSubmenu && isSettingsActive())) && styles.activeLink)
                  }}
                  onClick={() => handleMenuClick(item)}
                >
                  <item.icon />
                  {item.title}
                  {item.hasSubmenu && <NavIcons.ArrowDown style={{ marginLeft: "auto" }} />}
                </button>
                
                {/* Mobile Submenu */}
                {item.hasSubmenu && expandedSettings && (
                  <div style={{ marginLeft: "30px", marginTop: "5px" }}>
                    {item.submenuItems.map((subItem, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "10px 12px",
                          fontSize: "14px",
                          color: isActive(subItem.path) ? "#3498db" : "#2c3e50",
                          fontWeight: isActive(subItem.path) ? "bold" : "normal",
                          cursor: "pointer",
                          background: isActive(subItem.path) ? "#f8f9fa" : "transparent"
                        }}
                        onClick={() => handleSubmenuClick(subItem.path)}
                      >
                        {subItem.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} style={{ ...styles.searchBar, width: "100%", marginTop: "1rem" }}>
              <NavIcons.Search />
              <input
                type="text"
                placeholder="Search..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Mobile User Info */}
            <div style={{ marginTop: "1rem", padding: "12px", borderTop: "1px solid #ddd" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#3498db",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold"
                }}>
                  {getInitials(companyName)}
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{companyName}</div>
                  <div style={{ fontSize: "12px", color: "#7f8c8d" }}>{userEmail}</div>
                </div>
              </div>
              <button
                style={{ ...styles.logoutButton, width: "100%", justifyContent: "center", padding: "10px" }}
                onClick={handleLogout}
              >
                <NavIcons.Logout />
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for content */}
      <div style={{ height: "70px" }} />
    </>
  );
};

export default CompanyNavbar;