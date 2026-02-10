import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../utils/icons';
import { styles } from '../styles/adminDashboardStyles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ activeTab, setActiveTab }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminName, setAdminName] = useState('');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // LinkedIn-style navigation with SVG icons
    const navItems = [
        { id: "home", Icon: Icons.Home, label: "Home" },
        { id: "users", Icon: Icons.Users, label: "Users" },
        { id: "companies", Icon: Icons.Building, label: "Companies" },
        { id: "reports", Icon: Icons.Reports, label: "Reports" },
    ];

    // Dropdown menu items - Removed "My Profile"
    const dropdownItems = [
        { id: "settings", label: "Settings", icon: <Icons.Edit /> },
        { id: "logout", label: "Logout", icon: <Icons.ArrowLeft /> }
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
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    const handleDropdownClick = (itemId) => {
        setDropdownOpen(false);

        switch (itemId) {
            case "settings":
                // Add settings navigation here
                alert("Settings page coming soon!");
                break;
            case "logout":
                handleLogout();
                break;
            default:
                break;
        }
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

    // Get initials for avatar
    const getInitials = () => {
        if (adminName) {
            return adminName
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
        }
        return "A";
    };

    // Custom styles for dropdown
    const dropdownStyles = {
        dropdownContainer: {
            position: 'relative',
        },
        dropdownMenu: {
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: '0',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            zIndex: 1001,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
        },
        dropdownItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            color: '#191919',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            borderBottom: '1px solid #f1f5f9',
        },
        dropdownItemLast: {
            borderBottom: 'none',
        },
        dropdownItemHover: {
            background: '#f8fafc',
        },
        dropdownDivider: {
            height: '1px',
            background: '#e0e0e0',
            margin: '0',
        },
        dropdownIcon: {
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
        },
        userAvatarWithDropdown: {
            ...styles.userAvatar,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
        },
        userAvatarHover: {
            transform: 'scale(1.05)',
            boxShadow: '0 2px 8px rgba(0, 115, 177, 0.2)',
        }
    };

    // Add fadeIn animation to global styles
    const enhancedGlobalStyles = styles.global + `
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
        <nav style={styles.topNav}>
            <style>{enhancedGlobalStyles}</style>
            <div style={styles.navLeft}>
                <div style={styles.logo}>Admin Portal</div>
                <div style={styles.searchBar}>
                    <span style={styles.searchIcon}>
                        <Icons.Search />
                    </span>
                    <input
                        type="text"
                        placeholder="Search users, companies..."
                        style={styles.searchInput}
                    />
                </div>
            </div>
            <div style={styles.navCenter}>
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <a
                            key={item.id}
                            href="#"
                            style={{
                                ...styles.navItem,
                                ...(isActive ? styles.navItemActive : {}),
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveTab(item.id);
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    Object.assign(e.currentTarget.style, styles.navItemHover);
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.color = '#666';
                                    e.currentTarget.style.borderBottom = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                } else {
                                    Object.assign(e.currentTarget.style, styles.navItemActive);
                                }
                            }}
                        >
                            <span style={styles.navIcon}>
                                <item.Icon />
                            </span>
                            <span style={styles.navLabel}>{item.label}</span>
                        </a>
                    );
                })}
            </div>
            <div style={styles.navRight}>
                <div
                    style={dropdownStyles.dropdownContainer}
                    ref={dropdownRef}
                >
                    <div
                        style={{
                            ...dropdownStyles.userAvatarWithDropdown,
                            ...(dropdownOpen && dropdownStyles.userAvatarHover)
                        }}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 115, 177, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            if (!dropdownOpen) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                    >
                        {getInitials()}
                    </div>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div style={dropdownStyles.dropdownMenu}>
                            <div style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid #f1f5f9',
                                background: '#f8fafc'
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Admin Account
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#191919',
                                    marginTop: '2px'
                                }}>
                                    {adminEmail || 'Loading...'}
                                </div>
                                {adminName && (
                                    <div style={{
                                        fontSize: '13px',
                                        color: '#666',
                                        marginTop: '4px'
                                    }}>
                                        {adminName}
                                    </div>
                                )}
                            </div>

                            {dropdownItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    style={{
                                        ...dropdownStyles.dropdownItem,
                                        ...(index === dropdownItems.length - 1 && dropdownStyles.dropdownItemLast)
                                    }}
                                    onClick={() => handleDropdownClick(item.id)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#f8fafc';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'white';
                                    }}
                                >
                                    <span style={dropdownStyles.dropdownIcon}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;