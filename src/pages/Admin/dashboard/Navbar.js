import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
      <line x1="8" y1="18" x2="12" y2="18" />
    </svg>
  ),
  Reports: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
      <circle cx="12" cy="16" r="5" />
      <line x1="3" y1="14" x2="8" y2="14" />
      <line x1="16" y1="14" x2="21" y2="14" />
      <line x1="12" y1="10" x2="12" y2="16" />
      <line x1="8" y1="10" x2="16" y2="10" />
    </svg>
  ),
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
};

const Navbar = ({ activeTab, setActiveTab }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminName, setAdminName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // LinkedIn-style navigation with SVG icons
    const navItems = [
        { id: "home", Icon: NavIcons.Home, label: "Home" },
        { id: "users", Icon: NavIcons.Users, label: "Users" },
        { id: "companies", Icon: NavIcons.Building, label: "Companies" },
        { id: "reports", Icon: NavIcons.Reports, label: "Reports" },
    ];

    // Dropdown menu items - REMOVED LOGOUT ITEM
    const dropdownItems = [
        { id: "settings", label: "Settings", icon: <NavIcons.Edit /> }
        // Logout item removed from dropdown
    ];

    // Fetch admin info on component mount
    useEffect(() => {
        fetchAdminInfo();
    }, []);

    const fetchAdminInfo = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/user', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.user) {
                const user = response.data.user;
                setAdminEmail(user.email);
                setAdminName(`${user.fname} ${user.lname}`);
            }
        } catch (error) {
            console.error('Error fetching admin info:', error);
            // Fallback to localStorage email if API fails
            const storedEmail = localStorage.getItem('userEmail');
            if (storedEmail) {
                setAdminEmail(storedEmail);
            }
        }
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            navigate("/login");
        }
    };

    const handleDropdownClick = (itemId) => {
        setDropdownOpen(false);

        switch (itemId) {
            case "settings":
                // Add settings navigation here
                alert("Settings page coming soon!");
                break;
            default:
                break;
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Handle search functionality here
        console.log("Searching for:", searchQuery);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
            fontWeight: "bold",
            fontSize: "20px",
            color: "#2c3e50",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer"
        },
        left: {
            display: "flex",
            alignItems: "center",
            gap: "40px"
        },
        center: {
            flex: 1,
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            listStyle: "none",
            padding: 0,
            margin: 0,
        },
        navItem: {
            textDecoration: "none",
            color: "#2c3e50",
            fontSize: "15px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 0",
            cursor: "pointer",
            borderBottom: "2px solid transparent",
            transition: "all 0.2s ease"
        },
        navItemActive: {
            color: "#3498db",
            borderBottom: "2px solid #3498db"
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
            transition: "all 0.2s ease"
        },
        dropdown: {
            position: "absolute",
            top: "60px",
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            width: "280px",
            zIndex: 2000,
            animation: "fadeIn 0.2s ease",
        },
        dropdownHeader: {
            padding: "12px 16px",
            borderBottom: "1px solid #eee",
            background: "#f8f9fa"
        },
        dropdownHeaderTitle: {
            fontSize: "12px",
            color: "#666",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
        },
        dropdownHeaderEmail: {
            fontSize: "14px",
            fontWeight: 600,
            color: "#191919",
            marginTop: "2px"
        },
        dropdownHeaderName: {
            fontSize: "13px",
            color: "#666",
            marginTop: "4px"
        },
        dropdownItem: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            color: "#191919",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
            borderBottom: "1px solid #f1f5f9",
        },
        dropdownItemLast: {
            borderBottom: "none",
        },
        dropdownIcon: {
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
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
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    return (
        <>
            <style>{mediaStyles}</style>
            <nav style={styles.nav}>
                <div style={styles.left}>
                    <div style={styles.logo} onClick={() => navigate("/admin/dashboard")}>
                        <span className="logo-text">Admin Portal</span>
                    </div>

                    {/* Search Bar - Commented out */}
                    {/* <form onSubmit={handleSearch} style={styles.searchBar} className="search-bar">
                        <NavIcons.Search />
                        <input
                            type="text"
                            placeholder="Search users, companies..."
                            style={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form> */}
                </div>

                {/* Desktop Menu */}
                <ul style={styles.center} className="desktop-menu">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <li key={item.id}>
                                <a
                                    href="#"
                                    style={{
                                        ...styles.navItem,
                                        ...(isActive && styles.navItemActive)
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(item.id);
                                    }}
                                >
                                    <item.Icon />
                                    <span>{item.label}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>

                {/* Right Section */}
                <div style={styles.right}>
                    {/* User Icon with Dropdown */}
                    <div ref={dropdownRef} style={{ position: "relative" }}>
                        <div
                            style={{
                                ...styles.userIcon,
                                ...(dropdownOpen && { transform: "scale(1.05)", boxShadow: "0 2px 8px rgba(52, 152, 219, 0.2)" })
                            }}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            onMouseEnter={(e) => {
                                if (!dropdownOpen) {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(52, 152, 219, 0.2)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!dropdownOpen) {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "none";
                                }
                            }}
                        >
                            <NavIcons.User />
                        </div>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div style={styles.dropdown}>
                                <div style={styles.dropdownHeader}>
                                    <div style={styles.dropdownHeaderTitle}>Admin Account</div>
                                    {adminName && (
                                        <div style={styles.dropdownHeaderName}>
                                            {adminName}
                                        </div>
                                    )}
                                </div>

                                {dropdownItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            ...styles.dropdownItem,
                                            ...(index === dropdownItems.length - 1 && styles.dropdownItemLast)
                                        }}
                                        onClick={() => handleDropdownClick(item.id)}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#f8f9fa";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "white";
                                        }}
                                    >
                                        <span style={styles.dropdownIcon}>
                                            {item.icon}
                                        </span>
                                        <span style={{ color: "#191919" }}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <span style={styles.divider}></span>

                    {/* Logout Button - Keep this separate */}
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
                    >
                        ☰
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;