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
        // { title: "General", path: "/company/settings" },
        { title: "Company Profile", path: "/company/edit-profile" },
        // { title: "Team Members", path: "/company/settings/team" },
        { title: "Notifications", path: "/company/settings/notifications" },
        { title: "Account", path: "/company/settings/account" },
        // { title: "Security", path: "/company/settings/security" },
        // { title: "Billing", path: "/company/settings/billing" }
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
      background: "#ffffff",
      color: "#000000",
      transition: "all 0.3s ease",
      overflow: "hidden",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 1000,
      boxShadow: "2px 0 10px rgba(0, 0, 0, 0.08)",
      borderRight: "1px solid #e5e5e5",
      display: "flex",
      flexDirection: "column"
    },
    header: {
      padding: isOpen ? "1.5rem 1.25rem" : "1.5rem 0.75rem",
      borderBottom: "1px solid #e5e5e5",
      display: "flex",
      alignItems: "center",
      justifyContent: isOpen ? "space-between" : "center",
      minHeight: "70px",
      background: "#ffffff"
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
      background: "#000000",
      color: "#ffffff",
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
      color: "#000000",
      letterSpacing: "-0.5px"
    },
    toggleButton: {
      background: "#ffffff",
      border: "1px solid #d4d4d4",
      color: "#000000",
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
      background: "#ffffff",
      scrollbarWidth: "thin",
      scrollbarColor: "#ccc transparent"
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
      color: "#525252",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "0.95rem",
      fontWeight: 500,
      position: "relative"
    },
    menuIcon: {
      fontSize: "1.1rem",
      minWidth: "24px",
      textAlign: "center",
      color: "#000000"
    },
    menuText: {
      opacity: isOpen ? 1 : 0,
      transition: "opacity 0.3s ease",
      whiteSpace: "nowrap",
      flex: 1,
      textAlign: "left",
      color: "#525252"
    },
    arrowIcon: {
      fontSize: "0.75rem",
      transition: "transform 0.3s ease",
      opacity: isOpen ? 1 : 0,
      marginLeft: "auto"
    },
    badge: {
      background: "#000000",
      color: "#ffffff",
      fontSize: "0.7rem",
      padding: "0.1rem 0.4rem",
      borderRadius: "10px",
      fontWeight: "bold",
      minWidth: "20px",
      textAlign: "center"
    },
    submenu: {
      background: "#fafafa",
      borderRadius: "0 0 6px 6px",
      overflow: "hidden",
      maxHeight: expandedSettings ? "300px" : "0",
      transition: "max-height 0.3s ease"
    },
    submenuItem: {
      padding: "0.6rem 1rem 0.6rem 3rem",
      color: "#666666",
      fontSize: "0.85rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderLeft: "2px solid transparent"
    },
    footer: {
      padding: isOpen ? "1rem 1.25rem" : "1rem 0.75rem",
      borderTop: "1px solid #e5e5e5",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      background: "#ffffff"
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
      background: "#000000",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      fontSize: "0.875rem",
      border: "2px solid #e5e5e5"
    },
    userDetails: {
      flex: 1,
      minWidth: 0
    },
    userName: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#000000",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    userEmail: {
      fontSize: "0.75rem",
      color: "#666666",
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
      background: "#ffffff",
      border: "1px solid #d4d4d4",
      color: "#000000",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: 500,
      transition: "all 0.2s ease",
      marginTop: "0.5rem"
    },
    logoutText: {
      opacity: isOpen ? 1 : 0,
      transition: "opacity 0.3s ease"
    },
    activeMenuItem: {
      background: "#f5f5f5",
      color: "#000000",
      borderLeft: "3px solid #000000"
    },
    activeSubmenuItem: {
      color: "#000000",
      fontWeight: 600,
      background: "#f0f0f0",
      borderLeft: "2px solid #000000"
    },
    activeIcon: {
      color: "#000000"
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
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
            onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
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
                onMouseEnter={(e) => !isActive(item.path) && 
                  (e.currentTarget.style.background = "#f9f9f9")
                }
                onMouseLeave={(e) => !isActive(item.path) && 
                  (e.currentTarget.style.background = "transparent")
                }
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
                        filter: (isActive(item.path) || (item.hasSubmenu && isSettingsActive())) ? "invert(0)" : "invert(0.5)"
                      }}
                    />
                  ) : (
                    item.icon
                  )}
                </span>
                {isOpen && (
                  <span style={{
                    ...styles.menuText,
                    ...((isActive(item.path) || (item.hasSubmenu && isSettingsActive())) && { color: "#000000", fontWeight: 600 })
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
                      onMouseEnter={(e) => !isActive(subItem.path) && 
                        (e.currentTarget.style.background = "#f5f5f5")
                      }
                      onMouseLeave={(e) => !isActive(subItem.path) && 
                        (e.currentTarget.style.background = "transparent")
                      }
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
            onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
          >
            {isOpen && <span style={styles.logoutText}>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default CompanySidebar;