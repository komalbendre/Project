import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import CompanyManagement from "./CompanyManagement";
import UserManagement from "./UserManagement";
import UserDetailModal from "./UserDetailModal";
import { Icons } from "../utils/icons";
import { styles } from "../styles/adminDashboardStyles";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCompanies: 0,
        pendingApprovals: 0,
        activeCompanies: 0,
    });
    const [loading, setLoading] = useState(true);
    const [activeNavItem, setActiveNavItem] = useState("home");
    const [filters, setFilters] = useState({
        userStatus: "all",
        userRole: "all",
        companyStatus: "all",
    });

    // Modal states
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    // Check if user is admin
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (userRole !== "admin") {
            alert("Access denied. Admin privileges required.");
            navigate("/dashboard");
            return;
        }

        fetchDashboardData();
    }, [token, userRole, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all users
            const usersResponse = await axios.get("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch all companies
            const companiesResponse = await axios.get("http://localhost:5000/api/admin/companies", {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Users response:", usersResponse.data);
            console.log("Companies response:", companiesResponse.data);

            // Handle response format
            const usersData = usersResponse.data.success ? usersResponse.data.data : usersResponse.data;
            const companiesData = companiesResponse.data.success ? companiesResponse.data.data : companiesResponse.data;

            setUsers(Array.isArray(usersData) ? usersData : []);
            setCompanies(Array.isArray(companiesData) ? companiesData : []);

            // Calculate stats from real data
            const allUsers = Array.isArray(usersData) ? usersData : [];
            const allCompanies = Array.isArray(companiesData) ? companiesData : [];

            const totalUsers = allUsers.length;
            const totalCompanies = allCompanies.length;
            const pendingApprovals = allCompanies.filter(company =>
                company.status === 'pending'
            ).length;
            const activeCompanies = allCompanies.filter(company =>
                company.status === 'approved'
            ).length;

            setStats({
                totalUsers,
                totalCompanies,
                pendingApprovals,
                activeCompanies,
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            console.error("Error details:", error.response?.data);
            alert("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveCompany = async (companyId) => {
        try {
            await axios.put(
                `http://localhost:5000/api/admin/companies/${companyId}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Company approved successfully!");
            fetchDashboardData();
        } catch (error) {
            console.error("Error approving company:", error);
            alert("Failed to approve company");
        }
    };

    const handleRejectCompany = async (companyId) => {
        const reason = prompt("Please enter rejection reason:");
        if (!reason) return;

        try {
            await axios.put(
                `http://localhost:5000/api/admin/companies/${companyId}/reject`,
                { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Company rejected successfully!");
            fetchDashboardData();
        } catch (error) {
            console.error("Error rejecting company:", error);
            alert("Failed to reject company");
        }
    };

    const handleSuspendUser = async (userId) => {
        if (window.confirm("Are you sure you want to suspend this user?")) {
            try {
                await axios.put(
                    `http://localhost:5000/api/admin/users/${userId}/suspend`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                alert("User suspended successfully!");
                fetchDashboardData();
                handleCloseUserModal();
            } catch (error) {
                console.error("Error suspending user:", error);
                alert("Failed to suspend user");
            }
        }
    };

    const handleActivateUser = async (userId) => {
        try {
            await axios.put(
                `http://localhost:5000/api/admin/users/${userId}/activate`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("User activated successfully!");
            fetchDashboardData();
            handleCloseUserModal();
        } catch (error) {
            console.error("Error activating user:", error);
            alert("Failed to activate user");
        }
    };

    const handleViewUser = async (userId) => {
        try {
            setProfileLoading(true);
            setShowUserModal(true);
            
            const user = users.find(u => u._id === userId);
            setSelectedUser(user);
            
            try {
                const profileResponse = await axios.get(
                    `http://localhost:5000/api/profile/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                if (profileResponse.data.success) {
                    setProfileData(profileResponse.data.data);
                } else {
                    setProfileData(null);
                }
            } catch (profileError) {
                console.error("Error fetching profile:", profileError);
                setProfileData(null);
            }
        } catch (error) {
            console.error("Error viewing user:", error);
        } finally {
            setProfileLoading(false);
        }
    };

    const handleCloseUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
        setProfileData(null);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format date and time for last login
    const formatDateTime = (dateString) => {
        if (!dateString) return "Never";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get current date
    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return { text: 'Pending', color: '#f59e0b', bg: '#fef3c7' };
            case 'approved':
                return { text: 'Approved', color: '#10b981', bg: '#d1fae5' };
            case 'rejected':
                return { text: 'Rejected', color: '#ef4444', bg: '#fee2e2' };
            default:
                return { text: 'Unknown', color: '#6b7280', bg: '#f3f4f6' };
        }
    };

    // Get user status badge
    const getUserStatusBadge = (user) => {
        if (!user) return { text: 'Unknown', color: '#6b7280', bg: '#f3f4f6' };
        
        if (!user.isActive) {
            return { text: 'Suspended', color: '#ef4444', bg: '#fee2e2' };
        }
        if (user.role === 'company_admin' && !user.isApproved) {
            return { text: 'Pending', color: '#f59e0b', bg: '#fef3c7' };
        }
        return { text: 'Active', color: '#10b981', bg: '#d1fae5' };
    };

    // Filter users based on selected filters (exclude admin users)
    const filteredUsers = users.filter(user => {
        if (user.role === 'admin') {
            return false;
        }
        
        const statusBadge = getUserStatusBadge(user);
        const statusMatch = filters.userStatus === 'all' ||
            (filters.userStatus === 'active' && statusBadge.text === 'Active') ||
            (filters.userStatus === 'suspended' && statusBadge.text === 'Suspended') ||
            (filters.userStatus === 'pending' && statusBadge.text === 'Pending');

        let roleMatch = false;
        if (filters.userRole === 'all') {
            roleMatch = true;
        } else if (filters.userRole === 'company_admin') {
            roleMatch = user.role === 'company_admin';
        } else {
            roleMatch = user.role === filters.userRole;
        }

        return statusMatch && roleMatch;
    });

    // Get initial for avatar
    const getInitials = (name) => {
        if (!name) return "A";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Get last login time (most recent user login)
    const getLastLoginTime = () => {
        const loggedInUsers = users.filter(user => user.lastLogin);
        if (loggedInUsers.length === 0) return "No recent logins";
        
        const mostRecent = loggedInUsers.reduce((latest, user) => {
            const userTime = new Date(user.lastLogin).getTime();
            const latestTime = latest ? new Date(latest.lastLogin).getTime() : 0;
            return userTime > latestTime ? user : latest;
        }, null);
        
        return formatDateTime(mostRecent.lastLogin);
    };

    // Stats data with SVG icons
    const statsData = [
        { 
            Icon: Icons.Users, 
            value: stats.totalUsers, 
            label: "Total Users", 
            color: "#3b82f6" 
        },
        { 
            Icon: Icons.Building, 
            value: stats.totalCompanies, 
            label: "Total Companies", 
            color: "#8b5cf6" 
        },
        { 
            Icon: Icons.Clock, 
            value: stats.pendingApprovals, 
            label: "Pending Approvals", 
            color: "#f59e0b" 
        },
        { 
            Icon: Icons.CheckCircle, 
            value: stats.activeCompanies, 
            label: "Active Companies", 
            color: "#10b981" 
        },
    ];

    // Handle navigation from navbar
    const handleNavbarItemClick = (navItemId) => {
        setActiveNavItem(navItemId);
    };

    // Get pending companies (max 5)
    const pendingCompanies = companies
        .filter(company => company.status === 'pending')
        .slice(0, 5);

    // Get recent users (max 5, excluding admin users)
    const recentUsers = users
        .filter(user => user.role !== 'admin')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <style>{styles.global}</style>
                <div style={styles.spinner}></div>
            </div>
        );
    }

    // Custom styles for the two-column layout
    const twoColumnStyles = {
        twoColumnContainer: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginTop: '24px',
        },
        columnCard: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
        },
        columnCardHeader: {
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        columnCardTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#191919',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        columnCardCount: {
            fontSize: '12px',
            color: '#666',
            fontWeight: 600,
            background: '#f8fafc',
            padding: '4px 12px',
            borderRadius: '12px',
        },
        columnItem: {
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background-color 0.2s ease',
        },
        columnItemHover: {
            backgroundColor: '#f8fafc',
        },
        columnItemContent: {
            flex: 1,
        },
        columnItemName: {
            fontWeight: 600,
            fontSize: '14px',
            color: '#191919',
            marginBottom: '4px',
        },
        columnItemInfo: {
            fontSize: '13px',
            color: '#666',
        },
        columnItemButton: {
            padding: '6px 12px',
            background: 'white',
            color: '#0073b1',
            border: '1px solid #0073b1',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
        },
        columnItemButtonHover: {
            background: '#0073b1',
            color: 'white',
        },
        emptyColumn: {
            padding: '40px 20px',
            textAlign: 'center',
            color: '#94a3b8',
        },
        viewAllButton: {
            padding: '12px',
            background: '#f8fafc',
            color: '#0073b1',
            border: 'none',
            borderRadius: '0 0 8px 8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
        },
        viewAllButtonHover: {
            background: '#0073b1',
            color: 'white',
        },
    };

    return (
        <div style={styles.dashboardContainer}>
            <style>{styles.global}</style>

            {/* LinkedIn Top Navigation */}
            <Navbar activeTab={activeNavItem} setActiveTab={handleNavbarItemClick} />

            {/* Main Content */}
            <div style={styles.mainContent}>
                {/* Home Page Content */}
                {activeNavItem === "home" && (
                    <>
                        {/* Welcome Section */}
                        <div style={styles.welcomeSection}>
                            <div style={styles.welcomeContent}>
                                <h1 style={styles.greeting}>Admin Overview</h1>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "24px",
                                    marginTop: "8px",
                                    flexWrap: "wrap"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "14px",
                                        color: "#666"
                                    }}>
                                        <Icons.Calendar />
                                        <span>{getCurrentDate()}</span>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "14px",
                                        color: "#666"
                                    }}>
                                        <span style={{
                                            width: "6px",
                                            height: "6px",
                                            backgroundColor: "#10b981",
                                            borderRadius: "50%"
                                        }}></span>
                                        <span>Last login: {getLastLoginTime()}</span>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.welcomeAvatar}>
                                A
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div style={styles.statsGrid}>
                            {statsData.map((stat, index) => (
                                <div
                                    key={index}
                                    style={styles.statCard}
                                    className="hover-effect"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div style={{
                                        ...styles.statIcon,
                                        background: `${stat.color}20`,
                                        color: stat.color,
                                    }}>
                                        <stat.Icon />
                                    </div>
                                    <div style={styles.statContent}>
                                        <div style={styles.statValue}>{stat.value}</div>
                                        <div style={styles.statLabel}>{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Two Column Layout */}
                        <div style={twoColumnStyles.twoColumnContainer}>
                            {/* Left Column - Recent Users */}
                            <div style={twoColumnStyles.columnCard}>
                                <div style={twoColumnStyles.columnCardHeader}>
                                    <h3 style={twoColumnStyles.columnCardTitle}>
                                        <Icons.Users />
                                        Recent Users
                                    </h3>
                                    <span style={twoColumnStyles.columnCardCount}>
                                        {recentUsers.length} users
                                    </span>
                                </div>
                                
                                {recentUsers.length === 0 ? (
                                    <div style={twoColumnStyles.emptyColumn}>
                                        <Icons.Users />
                                        <p>No recent users</p>
                                    </div>
                                ) : (
                                    <>
                                        {recentUsers.map((user, index) => {
                                            const statusBadge = getUserStatusBadge(user);
                                            const userRole = user.role === 'company_admin' 
                                                ? 'Company Admin' 
                                                : user.role === 'user' 
                                                    ? 'User' 
                                                    : 'User';

                                            return (
                                                <div
                                                    key={user._id}
                                                    style={twoColumnStyles.columnItem}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = twoColumnStyles.columnItemHover.backgroundColor;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }}
                                                >
                                                    <div style={twoColumnStyles.columnItemContent}>
                                                        <div style={twoColumnStyles.columnItemName}>
                                                            {user.fname} {user.lname}
                                                        </div>
                                                        <div style={twoColumnStyles.columnItemInfo}>
                                                            {userRole} • {statusBadge.text}
                                                        </div>
                                                    </div>
                                                    <button
                                                        style={twoColumnStyles.columnItemButton}
                                                        onClick={() => {
                                                            handleNavbarItemClick("users");
                                                            setTimeout(() => handleViewUser(user._id), 100);
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.background = twoColumnStyles.columnItemButtonHover.background;
                                                            e.target.style.color = twoColumnStyles.columnItemButtonHover.color;
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.background = twoColumnStyles.columnItemButton.background;
                                                            e.target.style.color = twoColumnStyles.columnItemButton.color;
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        <button
                                            style={twoColumnStyles.viewAllButton}
                                            onClick={() => handleNavbarItemClick("users")}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = twoColumnStyles.viewAllButtonHover.background;
                                                e.target.style.color = twoColumnStyles.viewAllButtonHover.color;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = twoColumnStyles.viewAllButton.background;
                                                e.target.style.color = twoColumnStyles.viewAllButton.color;
                                            }}
                                        >
                                            <Icons.ArrowRight />
                                            View All Users
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Right Column - Pending Company Approvals */}
                            <div style={twoColumnStyles.columnCard}>
                                <div style={twoColumnStyles.columnCardHeader}>
                                    <h3 style={twoColumnStyles.columnCardTitle}>
                                        <Icons.Clock />
                                        Pending Approvals
                                    </h3>
                                    <span style={twoColumnStyles.columnCardCount}>
                                        {pendingCompanies.length} pending
                                    </span>
                                </div>
                                
                                {pendingCompanies.length === 0 ? (
                                    <div style={twoColumnStyles.emptyColumn}>
                                        <Icons.CheckCircle />
                                        <p>No pending approvals</p>
                                    </div>
                                ) : (
                                    <>
                                        {pendingCompanies.map((company, index) => (
                                            <div
                                                key={company._id}
                                                style={twoColumnStyles.columnItem}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = twoColumnStyles.columnItemHover.backgroundColor;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                <div style={twoColumnStyles.columnItemContent}>
                                                    <div style={twoColumnStyles.columnItemName}>
                                                        {company.companyName}
                                                    </div>
                                                    <div style={twoColumnStyles.columnItemInfo}>
                                                        {company.industry}
                                                    </div>
                                                </div>
                                                <button
                                                    style={twoColumnStyles.columnItemButton}
                                                    onClick={() => handleNavbarItemClick("companies")}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = twoColumnStyles.columnItemButtonHover.background;
                                                        e.target.style.color = twoColumnStyles.columnItemButtonHover.color;
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = twoColumnStyles.columnItemButton.background;
                                                        e.target.style.color = twoColumnStyles.columnItemButton.color;
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            style={twoColumnStyles.viewAllButton}
                                            onClick={() => handleNavbarItemClick("companies")}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = twoColumnStyles.viewAllButtonHover.background;
                                                e.target.style.color = twoColumnStyles.viewAllButtonHover.color;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = twoColumnStyles.viewAllButton.background;
                                                e.target.style.color = twoColumnStyles.viewAllButton.color;
                                            }}
                                        >
                                            <Icons.ArrowRight />
                                            View All Companies
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Users Management */}
                {activeNavItem === "users" && (
                    <UserManagement
                        filteredUsers={filteredUsers}
                        filters={filters}
                        setFilters={setFilters}
                        fetchDashboardData={fetchDashboardData}
                        handleViewUser={handleViewUser}
                        getUserStatusBadge={getUserStatusBadge}
                        getInitials={getInitials}
                        formatDate={formatDate}
                    />
                )}

                {/* Companies Management */}
                {activeNavItem === "companies" && (
                    <CompanyManagement
                        companies={companies}
                        filters={filters}
                        setFilters={setFilters}
                        fetchDashboardData={fetchDashboardData}
                        handleApproveCompany={handleApproveCompany}
                        handleRejectCompany={handleRejectCompany}
                        navigate={navigate}
                        getStatusBadge={getStatusBadge}
                        getInitials={getInitials}
                        formatDate={formatDate}
                    />
                )}

                {/* Reports - Coming Soon */}
                {activeNavItem === "reports" && (
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>
                                <Icons.Reports />
                                Reports
                            </h2>
                        </div>
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>
                                <Icons.Reports />
                            </div>
                            <p style={styles.emptyText}>Reports feature coming soon!</p>
                            <p style={{...styles.emptyText, fontSize: '13px', marginTop: '8px'}}>
                                Generate detailed analytics and insights about platform usage.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            <UserDetailModal
                showModal={showUserModal}
                onClose={handleCloseUserModal}
                selectedUser={selectedUser}
                profileData={profileData}
                profileLoading={profileLoading}
                getUserStatusBadge={getUserStatusBadge}
                formatDate={formatDate}
                formatDateTime={formatDateTime}
                onSuspendUser={handleSuspendUser}
                onActivateUser={handleActivateUser}
            />
        </div>
    );
};

export default AdminDashboard;