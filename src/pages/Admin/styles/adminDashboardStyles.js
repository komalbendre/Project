// All Styles
export const styles = {
    global: `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background-color: #f3f2ef;
        }
        
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        
        .hover-effect:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .action-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }
        
        .table-row:hover {
            background-color: #f8fafc !important;
        }
    `,

    // LinkedIn Top Navigation
    topNav: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "white",
        borderBottom: "1px solid #e0e0e0",
        padding: "0 24px",
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
    },
    navLeft: {
        display: "flex",
        alignItems: "center",
        gap: "24px",
    },
    logo: {
        fontSize: "24px",
        fontWeight: 700,
        color: "#0073b1",
    },
    searchBar: {
        position: "relative",
        width: "280px",
    },
    searchInput: {
        width: "100%",
        padding: "8px 40px 8px 16px",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        backgroundColor: "#eef3f8",
        fontSize: "14px",
    },
    searchIcon: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#666",
    },
    navCenter: {
        display: "flex",
        gap: 0,
    },
    navItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 12px',
        color: '#666',
        textDecoration: 'none',
        fontSize: '12px',
        fontWeight: 500,
        position: 'relative',
        transition: 'all 0.2s ease',
        borderBottom: 'none',
        boxShadow: 'none',
    },
    navItemActive: {
        color: '#0073b1',
        borderBottom: '2px solid #0073b1',
        boxShadow: 'none',
    },
    navItemHover: {
        color: '#0073b1',
        borderBottom: 'none',
        boxShadow: 'none',
    },
    navIcon: {
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "4px",
    },
    navLabel: {
        fontSize: "12px",
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
    },
    adminBadge: {
        padding: "4px 12px",
        background: "linear-gradient(135deg, #0073b1, #00a0dc)",
        color: "white",
        borderRadius: "16px",
        fontSize: "12px",
        fontWeight: 600,
    },
    userAvatar: {
        width: "32px",
        height: "32px",
        background: "linear-gradient(135deg, #0073b1, #00a0dc)",
        color: "white",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
    },

    // Main Layout
    dashboardContainer: {
        minHeight: "100vh",
    },
    mainContent: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
        paddingTop: "20px", 
    },

    // Welcome Section (LinkedIn Style)
    welcomeSection: {
        background: "white",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        padding: "32px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "24px",
    },
    welcomeContent: {
        flex: 1,
        minWidth: "300px",
    },
    greeting: {
        fontSize: "32px",
        fontWeight: 600,
        color: "#191919",
        marginBottom: "8px",
    },
    subGreeting: {
        fontSize: "16px",
        color: "#666",
        marginBottom: "16px",
    },
    welcomeAvatar: {
        width: "80px",
        height: "80px",
        background: "linear-gradient(135deg, #0073b1, #00a0dc)",
        color: "white",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: 700,
        border: "4px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 12px rgba(0, 115, 177, 0.2)",
    },

    // Stats Grid
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginBottom: "24px",
    },
    statCard: {
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.3s ease",
    },
    statIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    statContent: {
        flex: 1,
    },
    statValue: {
        fontSize: "28px",
        fontWeight: 700,
        color: "#191919",
        marginBottom: "4px",
        lineHeight: 1,
    },
    statLabel: {
        fontSize: "14px",
        color: "#666",
        fontWeight: 500,
    },

    // Tabs (LinkedIn Style)
    tabs: {
        display: "flex",
        gap: "8px",
        marginBottom: "24px",
        background: "white",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        padding: "8px",
        overflowX: "auto",
    },
    tab: {
        padding: "12px 24px",
        background: "none",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
        color: "#666",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    activeTab: {
        background: "#0073b1",
        color: "white",
    },

    // Content Grid
    contentGrid: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "16px",
    },

    // Card Styles
    card: {
        background: "white",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        overflow: "hidden",
    },
    cardHeader: {
        padding: "20px",
        borderBottom: "1px solid #e0e0e0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px",
    },
    cardTitle: {
        fontSize: "18px",
        fontWeight: 600,
        color: "#191919",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    filterBar: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
    },
    filterSelect: {
        padding: "8px 16px",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        fontSize: "14px",
        background: "white",
        color: "#4a5568",
        cursor: "pointer",
        transition: "all 0.2s ease",
        minWidth: "150px",
    },
    refreshButton: {
        padding: "8px 16px",
        background: "#0073b1",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    // Table Styles
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    tableHeader: {
        background: "#f8fafc",
        borderBottom: "2px solid #e0e0e0",
    },
    th: {
        padding: "16px",
        textAlign: "left",
        fontSize: "12px",
        fontWeight: 600,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    td: {
        padding: "16px",
        borderBottom: "1px solid #f1f5f9",
        fontSize: "14px",
        color: "#334155",
    },

    // User Avatar in Table
    userAvatarSmall: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #0073b1, #00a0dc)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: 600,
    },
    userInfo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    userName: {
        fontWeight: 600,
        color: "#191919",
    },
    userEmail: {
        fontSize: "12px",
        color: "#666",
        marginTop: "2px",
    },

    // Action Buttons
    actionButtons: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
    },
    button: {
        padding: "6px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "1px solid transparent",
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    approveButton: {
        background: "#10b981",
        color: "white",
        border: "1px solid #10b981",
    },
    rejectButton: {
        background: "white",
        color: "#ef4444",
        border: "1px solid #ef4444",
    },
    viewButton: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 16px",
        background: "#f0f7ff",
        color: "#0073b1",
        border: "1px solid #0073b1",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
    },
    suspendButton: {
        background: "white",
        color: "#dc2626",
        border: "1px solid #dc2626",
    },
    activateButton: {
        background: "#10b981",
        color: "white",
        border: "1px solid #10b981",
    },

    // Status Badge
    customBadge: {
        padding: "4px 12px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 600,
        display: "inline-block",
        border: "1px solid transparent",
    },

    // Empty State
    emptyState: {
        padding: "48px 20px",
        textAlign: "center",
        color: "#94a3b8",
    },
    emptyIcon: {
        width: "48px",
        height: "48px",
        margin: "0 auto 16px",
        opacity: 0.5,
    },
    emptyText: {
        fontSize: "14px",
        color: "#64748b",
    },

    // Loading State
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f3f2ef",
    },
    spinner: {
        width: "48px",
        height: "48px",
        border: "4px solid #e0e0e0",
        borderTopColor: "#0073b1",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },

    // Company Avatar
    companyAvatar: {
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: 600,
    },
    
};