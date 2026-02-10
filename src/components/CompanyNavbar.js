import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import userIconImage from "../assets/user.png";
import notificationIcon from "../assets/notification.png";

const CompanyNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showFallbackAvatar, setShowFallbackAvatar] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");
    const companyName = localStorage.getItem("companyName") || "Company";

    // Safe error handler
    const handleImageError = () => {
        console.error("Failed to load user icon, showing fallback");
        setShowFallbackAvatar(true);
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Logout error:", error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("companyName");
        navigate("/login");
    };

    const navItems = [
        { path: "/company/dashboard", label: "Dashboard" },
        { path: "/company/internships", label: "Internships" },
        { path: "/company/applications", label: "Applications"},
        { path: "/company/interviews", label: "Interviews" },
        { path: "/company/analytics", label: "Analytics"},
        { path: "/company/messages", label: "Messages",badge: 3 },
    ];

    const quickActions = [
        { label: "Post Internship", icon: "🚀", path: "/company/jobs/post" },
        { label: "Search Candidates", icon: "🔍", path: "/company/candidates" },
        { label: "Bulk Email", icon: "📧", path: "/company/communications" },
    ];

    const styles = {
        navbar: {
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "0 1.5rem",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        },
        navbarContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
            maxWidth: "1400px",
            margin: "0 auto",
        },
        leftSection: {
            display: "flex",
            alignItems: "center",
            gap: "2rem",
        },
        logo: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
        },
        logoIcon: {
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
        },
        logoText: {
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#2d3748",
        },
        navItems: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        navLink: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            transition: "all 0.2s ease",
            position: "relative",
        },
        activeNavLink: {
            background: "#f0f9ff",
            color: "#0369a1",
        },
        navBadge: {
            position: "absolute",
            top: "4px",
            right: "4px",
            background: "#ef4444",
            color: "white",
            fontSize: "0.625rem",
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        rightSection: {
            display: "flex",
            alignItems: "center",
            gap: "1rem",
        },
        quickActionButton: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1rem",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
        },
        companyInfo: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            position: "relative",
        },
        companyAvatar: {
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            // background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 600,
            fontSize: "0.875rem",
            overflow: "hidden",
            border: "2px solid #e5e7eb",
        },
        userIconImg: {
            width: "100%",
            height: "100%",
            objectFit: "contain",
            backgroundColor: "#f3f4f6",
        },
        userIconOnly: {
            width: "32px",
            height: "32px",
            cursor: "pointer",
            display: "block",
        },

        notificationIconOnly: {
    width: "24px",
    height: "24px",
    cursor: "pointer",
    position: "relative",
},
notificationWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
},
notificationDot: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    width: "8px",
    height: "8px",
    backgroundColor: "#ef4444",
    borderRadius: "50%",
},


        fallbackAvatar: {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
        },
        companyDetails: {
            display: "flex",
            flexDirection: "column",
        },
        companyName: {
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#2d3748",
        },
        companyRole: {
            fontSize: "0.75rem",
            color: "#6b7280",
        },
        dropdown: {
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb",
            minWidth: "200px",
            zIndex: 100,
            overflow: "hidden",
        },
        dropdownItem: {
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            color: "#4b5563",
            textDecoration: "none",
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
            borderBottom: "1px solid #f3f4f6",
        },
        dropdownItemLast: {
            borderBottom: "none",
        },
        mobileMenuButton: {
            display: "none",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#6b7280",
            padding: "0.5rem",
        },
        mobileMenu: {
            display: "none",
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            borderTop: "1px solid #e5e7eb",
            padding: "1rem",
            zIndex: 40,
        },
        mobileNavItems: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
        },
        mobileQuickActions: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #e5e7eb",
        },
        notificationBell: {
            position: "relative",
            padding: "0.5rem",
            cursor: "pointer",
        },
        notificationBadge: {
            position: "absolute",
            top: "2px",
            right: "2px",
            background: "#ef4444",
            color: "white",
            fontSize: "0.625rem",
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        "@media (max-width: 1024px)": {
            navItems: {
                display: "none",
            },
            mobileMenuButton: {
                display: "block",
            },
            mobileMenu: {
                display: mobileMenuOpen ? "block" : "none",
            },
        },
        "@media (max-width: 768px)": {
            quickActionButton: {
                display: "none",
            },
            companyDetails: {
                display: "none",
            },
        },
    };

    return (
        <>
            <style>{`
                .nav-link:hover {
                    background: #f3f4f6;
                }
                
                .quick-action-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
                
                .company-info:hover {
                    background: #f3f4f6;
                }
                
                .dropdown-item:hover {
                    background: #f9fafb;
                }
            `}</style>

            <nav style={styles.navbar}>
                <div style={styles.navbarContainer}>
                    {/* Left Section */}
                    <div style={styles.leftSection}>
                        <Link to="/company/dashboard" style={styles.logo}>
                            <div style={styles.logoIcon}>💼</div>
                            <div style={styles.logoText}>CareerSync</div>
                        </Link>

                        {/* Desktop Navigation */}
                        {/* <div style={styles.navItems}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        ...styles.navLink,
                                        ...(location.pathname === item.path && styles.activeNavLink),
                                    }}
                                    className="nav-link"
                                >
                                    <span>{item.icon}</span>
                                    {item.label}
                                    {item.badge && (
                                        <span style={styles.navBadge}>{item.badge}</span>
                                    )}
                                </Link>
                            ))}
                        </div> */}
                    </div>

                    {/* Right Section */}
                    <div style={styles.rightSection}>
                        {/* <div style={styles.notificationBell}>
                            <span>🔔</span>
                            <span style={styles.notificationBadge}>3</span>
                        </div> */}

                        {/* Quick Action Button */}
                        {/* <button
                            style={styles.quickActionButton}
                            className="quick-action-button"
                            onClick={() => navigate("/company/jobs/post")}
                        >
                            <span>🚀</span>
                            <span>Post Internship</span>
                        </button> */}

                        {/* Company Profile Dropdown */}
                        <div
                            style={styles.companyInfo}
                            className="company-info"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {/* <div style={styles.companyAvatar}>
                                {showFallbackAvatar ? (
                                    <div style={styles.fallbackAvatar}>
                                        {companyName.charAt(0).toUpperCase()}
                                    </div>
                                ) : (
                                    <img
                                        src={userIconImage}
                                        alt="User"
                                        style={styles.userIconImg}
                                        onError={handleImageError}
                                    />
                                )}
                            </div> */}
                            <img
                                src={userIconImage}
                                alt="User menu"
                                style={styles.userIconOnly}
                                onError={handleImageError}
                            />
                            {/* <div style={styles.companyDetails}>
                                <div style={styles.companyName}>{companyName}</div>
                                <div style={styles.companyRole}>Company Admin</div>
                            </div> */}
                            {/* <span>▼</span> */}

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div style={styles.dropdown}>
                                    <div style={{ padding: "0.5rem" }}>
                                        <div style={{
                                            padding: "0.75rem",
                                            fontSize: "0.75rem",
                                            color: "#6b7280",
                                            borderBottom: "1px solid #f3f4f6"
                                        }}>
                                            Signed in as<br />
                                            <span style={{ fontWeight: 600, color: "#2d3748" }}>
                                                {companyName}
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to="/company/edit-profile"
                                        style={styles.dropdownItem}
                                        className="dropdown-item"
                                    >
                                        Company Settings
                                    </Link>
                                    {/* <Link 
                                        to="/company/billing" 
                                        style={styles.dropdownItem}
                                        className="dropdown-item"
                                    >
                                         Billing
                                    </Link> */}
                                    <Link
                                        to="/company/support"
                                        style={styles.dropdownItem}
                                        className="dropdown-item"
                                    >
                                        Help & Support
                                    </Link>
                                    <div style={{
                                        ...styles.dropdownItem,
                                        ...styles.dropdownItemLast,
                                        color: "#ef4444",
                                        cursor: "pointer"
                                    }}
                                        className="dropdown-item"
                                        onClick={handleLogout}>
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            style={styles.mobileMenuButton}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div style={styles.mobileMenu}>
                    <div style={styles.mobileNavItems}>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    ...styles.navLink,
                                    ...(location.pathname === item.path && styles.activeNavLink),
                                }}
                                className="nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                                {item.badge && (
                                    <span style={styles.navBadge}>{item.badge}</span>
                                )}
                            </Link>
                        ))}
                    </div>

                    <div style={styles.mobileQuickActions}>
                        <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#6b7280", marginBottom: "0.5rem" }}>
                            Quick Actions
                        </div>
                        {quickActions.map((action) => (
                            <button
                                key={action.label}
                                style={{
                                    ...styles.navLink,
                                    textAlign: "left",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    navigate(action.path);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <span>{action.icon}</span>
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default CompanyNavbar;