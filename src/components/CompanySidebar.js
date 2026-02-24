import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dashboardIcon from "../assets/dashboard.png";
import internshipIcon from "../assets/internshipicon.png";
import applicationIcon from "../assets/applicationicon.png";
import interviewIcon from "../assets/interviewicon.png";
import analyticsIcon from "../assets/analytics.png";
import settingIcon from "../assets/setting.png";

const CompanySidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSettings, setExpandedSettings] = useState(false);

  // Updated color scheme
  const colors = {
    // Black/Dark Gray for structure
    darkBlack: '#0F172A',      // Main sidebar background
    softBlack: '#1E293B',      // Hover states, active items
    darkGray: '#334155',       // Borders, icons
    
    // Blue for primary actions
    primaryBlue: '#2563EB',     // Active menu, buttons
    hoverBlue: '#1D4ED8',       // Hover states
    lightBlue: '#DBEAFE',       // Background for active items
    
    // White for clean backgrounds
    pureWhite: '#FFFFFF',       // Text on dark backgrounds
    lightBackground: '#F8FAFC', // Background for cards/content
    
    // Supporting colors
    grayText: '#64748B',        // Secondary text
    borderColor: '#E2E8F0'      // Borders, dividers
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/company/dashboard",
      icon: dashboardIcon,
      type: "image" 
    },
    {
      id: "internships",
      title: "Internships",
      path: "/company/internships",
      icon: internshipIcon,
      type: "image"
    },
    {
      id: "applications",
      title: "Applications",
      path: "/company/applications",
      icon: applicationIcon,
      type: "image"
    },
    {
      id: "interviews",
      title: "Interviews",
      path: "/company/interviews",
      icon: interviewIcon,
      type: "image"
    },
    {
      id: "analytics",
      title: "Analytics",
      path: "/company/analytics",
      icon: analyticsIcon,
      type: "image"
    },
    {
      id: "settings",
      title: "Settings",
      icon: settingIcon,
      type: "image",
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
      if (isOpen) {
        setExpandedSettings(!expandedSettings);
      } else {
        // If sidebar is closed, navigate to the first submenu item
        navigate(item.submenuItems[0].path);
      }
    } else {
      navigate(item.path);
      if (window.innerWidth < 768) {
        onToggle();
      }
    }
  };

  const handleSubmenuClick = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onToggle();
      setExpandedSettings(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isSettingsActive = () => {
    return menuItems.find(item => item.id === "settings")?.submenuItems?.some(
      subItem => isActive(subItem.path)
    ) || false;
  };

  const styles = {
    sidebar: {
      width: isOpen ? "260px" : "80px",
      height: "100vh",
      background: colors.darkBlack,
      color: colors.pureWhite,
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 1000,
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
      borderRight: `1px solid ${colors.softBlack}`,
      display: "flex",
      flexDirection: "column"
    },
    header: {
      padding: isOpen ? "1.5rem 1.25rem" : "1.5rem 0.75rem",
      borderBottom: `1px solid ${colors.softBlack}`,
      display: "flex",
      alignItems: "center",
      justifyContent: isOpen ? "space-between" : "center",
      minHeight: "70px",
      background: colors.darkBlack
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      opacity: isOpen ? 1 : 0,
      transition: "opacity 0.3s ease",
      width: isOpen ? "auto" : 0,
      overflow: "hidden"
    },
    logoIcon: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      background: colors.primaryBlue,
      color: colors.pureWhite,
      width: "32px",
      height: "32px",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    logoText: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: colors.pureWhite,
      letterSpacing: "-0.5px"
    },
    toggleButton: {
      background: colors.softBlack,
      border: `1px solid ${colors.darkGray}`,
      color: colors.pureWhite,
      width: "32px",
      height: "32px",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "0.875rem"
    },
    menu: {
      flex: 1,
      padding: "1rem 0",
      overflowY: "auto",
      background: colors.darkBlack,
      scrollbarWidth: "thin",
      scrollbarColor: `${colors.darkGray} transparent`
    },
    menuItem: {
      margin: "0.25rem 0.75rem",
      borderRadius: "6px",
      overflow: "hidden"
    },
    menuButton: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      width: "100%",
      padding: isOpen ? "0.75rem 1rem" : "0.75rem 0",
      justifyContent: isOpen ? "flex-start" : "center",
      background: "transparent",
      border: "none",
      color: colors.grayText,
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "0.95rem",
      fontWeight: 500,
      position: "relative",
      borderRadius: "6px"
    },
    menuIcon: {
      fontSize: "1.1rem",
      minWidth: "24px",
      textAlign: "center",
      color: colors.grayText
    },
    menuText: {
      opacity: isOpen ? 1 : 0,
      transition: "opacity 0.3s ease",
      whiteSpace: "nowrap",
      flex: 1,
      textAlign: "left",
      color: colors.grayText
    },
    arrowIcon: {
      fontSize: "0.75rem",
      transition: "transform 0.3s ease",
      opacity: isOpen ? 1 : 0,
      marginLeft: "auto",
      color: colors.grayText
    },
    badge: {
      background: colors.primaryBlue,
      color: colors.pureWhite,
      fontSize: "0.7rem",
      padding: "0.1rem 0.4rem",
      borderRadius: "10px",
      fontWeight: "bold",
      minWidth: "20px",
      textAlign: "center"
    },
    submenu: {
      background: colors.softBlack,
      borderRadius: "0 0 6px 6px",
      overflow: "hidden",
      maxHeight: expandedSettings ? "300px" : "0",
      transition: "max-height 0.3s ease"
    },
    submenuItem: {
      padding: "0.6rem 1rem 0.6rem 3rem",
      color: colors.grayText,
      fontSize: "0.85rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderLeft: `2px solid transparent`
    },
    footer: {
      padding: isOpen ? "1rem 1.25rem" : "1rem 0.75rem",
      borderTop: `1px solid ${colors.softBlack}`,
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      background: colors.darkBlack
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      opacity: isOpen ? 1 : 0,
      transition: "opacity 0.3s ease",
      overflow: "hidden"
    },
    userAvatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: colors.primaryBlue,
      color: colors.pureWhite,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      fontSize: "0.875rem",
      border: `2px solid ${colors.softBlack}`
    },
    userDetails: {
      flex: 1,
      minWidth: 0
    },
    userName: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: colors.pureWhite,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    userEmail: {
      fontSize: "0.75rem",
      color: colors.grayText,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    logoutButton: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: isOpen ? "0.5rem 1rem" : "0.5rem 0",
      justifyContent: isOpen ? "flex-start" : "center",
      background: colors.softBlack,
      border: `1px solid ${colors.darkGray}`,
      color: colors.pureWhite,
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: 500,
      transition: "all 0.2s ease",
      marginTop: "0.5rem"
    },
    logoutText: {
      opacity: isOpen ? 1 : 0,
      transition: "opacity 0.3s ease",
      color: colors.pureWhite
    },
    activeMenuItem: {
      background: colors.softBlack,
      color: colors.pureWhite,
      borderLeft: `3px solid ${colors.primaryBlue}`
    },
    activeSubmenuItem: {
      color: colors.pureWhite,
      fontWeight: 600,
      background: colors.darkBlack,
      borderLeft: `2px solid ${colors.primaryBlue}`
    },
    activeIcon: {
      color: colors.pureWhite
    },
    activeMenuText: {
      color: colors.pureWhite,
      fontWeight: 600
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(15, 23, 42, 0.5)", // Using darkBlack with opacity
      zIndex: 999,
      display: window.innerWidth < 768 && isOpen ? "block" : "none"
    }
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
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    localStorage.removeItem("companyName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <>
      <div style={styles.overlay} onClick={onToggle} />
      <div style={styles.sidebar}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>CS</div>
            <div style={styles.logoText}>CareerSync</div>
          </div>
          <button
            style={styles.toggleButton}
            onClick={onToggle}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.darkGray}
            onMouseLeave={(e) => e.currentTarget.style.background = colors.softBlack}
          >
            {isOpen ? "←" : "→"}
          </button>
        </div>

        {/* Menu Items */}
        <div style={styles.menu}>
          {menuItems.map((item) => (
            <div key={item.id} style={styles.menuItem}>
              <button
                style={{
                  ...styles.menuButton,
                  ...((isActive(item.path) || (item.hasSubmenu && isSettingsActive())) && styles.activeMenuItem)
                }}
                onClick={() => handleMenuClick(item)}
                onMouseEnter={(e) => {
                  if (!isActive(item.path) && !(item.hasSubmenu && isSettingsActive())) {
                    e.currentTarget.style.background = colors.softBlack;
                    e.currentTarget.style.color = colors.pureWhite;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path) && !(item.hasSubmenu && isSettingsActive())) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = colors.grayText;
                  }
                }}
              >
                <span style={{
                  ...styles.menuIcon,
                  ...((isActive(item.path) || (item.hasSubmenu && isSettingsActive())) && styles.activeIcon)
                }}>
                  {item.type === "image" ? (
                    <img 
                      src={item.icon} 
                      alt={item.title}
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                        filter: (isActive(item.path) || (item.hasSubmenu && isSettingsActive())) 
                          ? "brightness(0) invert(1)" // White for active
                          : "brightness(0) invert(0.6)" // Gray for inactive
                      }}
                    />
                  ) : (
                    item.icon
                  )}
                </span>
                {isOpen && (
                  <span style={{
                    ...styles.menuText,
                    ...((isActive(item.path) || (item.hasSubmenu && isSettingsActive())) && styles.activeMenuText)
                  }}>
                    {item.title}
                  </span>
                )}
                {item.badge && isOpen && (
                  <span style={styles.badge}>{item.badge}</span>
                )}
                {item.hasSubmenu && isOpen && (
                  <span style={{
                    ...styles.arrowIcon,
                    transform: expandedSettings ? "rotate(180deg)" : "rotate(0deg)"
                  }}>
                    ▼
                  </span>
                )}
              </button>
              
              {/* Settings Submenu */}
              {item.hasSubmenu && isOpen && (
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
                          e.currentTarget.style.background = colors.darkBlack;
                          e.currentTarget.style.color = colors.pureWhite;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(subItem.path)) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = colors.grayText;
                        }
                      }}
                    >
                      {subItem.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {getInitials(companyName)}
            </div>
            {isOpen && (
              <div style={styles.userDetails}>
                <div style={styles.userName}>{companyName}</div>
                <div style={styles.userEmail}>{userEmail}</div>
              </div>
            )}
          </div>
          <button
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.darkGray;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.softBlack;
            }}
          >
            <span style={styles.menuIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            {isOpen && <span style={styles.logoutText}>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default CompanySidebar;