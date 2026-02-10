import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area
} from "recharts";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCompanyApproved, setIsCompanyApproved] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  // Enhanced Chart Data with more realistic numbers
  const applicationsFunnelData = [
    { stage: "Applied", value: 24, color: "#0073b1", fill: "rgba(0, 115, 177, 0.1)" },
    { stage: "Screen", value: 12, color: "#00a0dc", fill: "rgba(0, 160, 220, 0.1)" },
    { stage: "Interview", value: 6, color: "#8d6cab", fill: "rgba(141, 108, 171, 0.1)" },
    { stage: "Final", value: 4, color: "#10b981", fill: "rgba(16, 185, 129, 0.1)" },
    { stage: "Offer", value: 2, color: "#06c", fill: "rgba(0, 102, 204, 0.1)" },
  ];

  const applicationsOverTimeData = [
    { month: "Sep", applications: 3, trend: 0 },
    { month: "Oct", applications: 6, trend: 1 },
    { month: "Nov", applications: 8, trend: 1 },
    { month: "Dec", applications: 7, trend: -1 },
    { month: "Jan", applications: 10, trend: 1 },
    { month: "Feb", applications: 12, trend: 1 },
  ];

  const weeklyActivityData = [
    { day: "Mon", applications: 3, interviews: 1 },
    { day: "Tue", applications: 4, interviews: 2 },
    { day: "Wed", applications: 2, interviews: 1 },
    { day: "Thu", applications: 5, interviews: 0 },
    { day: "Fri", applications: 3, interviews: 1 },
    { day: "Sat", applications: 1, interviews: 0 },
    { day: "Sun", applications: 0, interviews: 0 },
  ];

  const skillsData = [
    { skill: "React", level: 85, category: "Frontend" },
    { skill: "JavaScript", level: 90, category: "Frontend" },
    { skill: "TypeScript", level: 75, category: "Frontend" },
    { skill: "Node.js", level: 70, category: "Backend" },
    { skill: "Python", level: 65, category: "Backend" },
    { skill: "AWS", level: 60, category: "DevOps" },
    { skill: "UI/UX", level: 80, category: "Design" },
  ];

  const savedVsAppliedData = [
    { name: "Applied", value: 24, color: "#0073b1" },
    { name: "Saved", value: 15, color: "#8d6cab" },
    { name: "Archived", value: 8, color: "#64748b" },
  ];

  // Profile completion items
  const profileSteps = [
    { id: 1, label: "Add Photo", completed: true, icon: "📸" },
    { id: 2, label: "Add Experience", completed: true, icon: "💼" },
    { id: 3, label: "Add Education", completed: true, icon: "🎓" },
    { id: 4, label: "Add Skills", completed: false, icon: "⚡" },
    { id: 5, label: "Build Resume", completed: false, icon: "📄" },
    { id: 6, label: "Add Projects", completed: false, icon: "🚀" },
  ];

  // Enhanced Quick Actions with better icons
  const quickActions = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      label: "Build Resume",
      description: "Create professional resume",
      color: "#0073b1",
      gradient: "linear-gradient(135deg, #0073b1, #00a0dc)",
      action: "build_resume",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <path d="M11 8v6M8 11h6"/>
        </svg>
      ),
      label: "Find Internships",
      description: "Browse opportunities",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
      action: "find_jobs",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      label: "Skill Test",
      description: "Assess your skills",
      color: "#8d6cab",
      gradient: "linear-gradient(135deg, #8d6cab, #a78bfa)",
      action: "skill_test",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 3v18h18"/>
          <path d="M19 9l-5 5-4-4-6 6"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="M21 15l-4 4-2-2-4 4"/>
        </svg>
      ),
      label: "Analytics",
      description: "Track your progress",
      color: "#dd5143",
      gradient: "linear-gradient(135deg, #dd5143, #f87171)",
      action: "progress",
    },
  ];

  // Enhanced notifications data
  const mockNotifications = [
    {
      id: 1,
      type: "application_approved",
      company: "Google",
      position: "Frontend Engineer Intern",
      message: "Your application has been approved!",
      time: "2 hours ago",
      read: false,
      icon: "✅",
      color: "#10b981",
      status: "success",
    },
    {
      id: 2,
      type: "interview_scheduled",
      company: "Microsoft",
      position: "Software Engineer Intern",
      message: "Interview scheduled for tomorrow",
      time: "1 day ago",
      read: false,
      icon: "📅",
      color: "#3b82f6",
      status: "info",
    },
    {
      id: 3,
      type: "new_application",
      company: "Meta",
      position: "React Native Intern",
      message: "Application submitted successfully",
      time: "2 days ago",
      read: true,
      icon: "📨",
      color: "#8b5cf6",
      status: "info",
    },
    {
      id: 4,
      type: "skill_match",
      company: "Amazon",
      position: "UI/UX Designer Intern",
      message: "Your skills match this position (95%)",
      time: "3 days ago",
      read: true,
      icon: "⭐",
      color: "#f59e0b",
      status: "warning",
    },
  ];

  // Mock data with enhanced user info
  const mockData = {
    user: {
      name: "Alex Johnson",
      role: "Frontend Developer | React Specialist",
      location: "San Francisco, CA",
      university: "Stanford University",
      graduation: "May 2024",
      connections: 543,
      profileViews: 128,
      avatarColor: "#0073b1",
      completion: 75,
      dailyGoal: 5,
      goalProgress: 3,
    },
    stats: {
      applications: { value: 24, trend: 12 },
      interviews: { value: 6, trend: 50 },
      offers: { value: 2, trend: 0 },
      responseRate: { value: 25, trend: 5 },
    },
    weeklyGoal: {
      target: 10,
      current: 7,
      progress: 70,
    },
  };

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const isApproved = localStorage.getItem("isApproved") === "true";
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userRole === "company" && !isApproved) {
      setIsCompanyApproved(false);
      setLoading(false);
      return;
    }

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/me/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            const userData = data.data;
            const userName =
              userData.fullName ||
              (userData.user && userData.user.name) ||
              localStorage.getItem("userName") ||
              "User";

            setUser({
              name: userName,
              role: userRole === "company_admin" ? "Company Admin" : "User",
              location: userData.location || "Location not set",
              university: userData.university || "Add your university",
              graduation: userData.graduation || "Add graduation date",
              connections: userData.connections || 0,
              profileViews: userData.profileViews || 0,
              avatarColor: "#0073b1",
              completion: userData.completion || 75,
              dailyGoal: userData.dailyGoal || 5,
              goalProgress: userData.goalProgress || 3,
            });

            localStorage.setItem("userName", userName);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        const userName = localStorage.getItem("userName") || "User";
        setUser({
          name: userName,
          role: userRole === "company_admin" ? "Company Admin" : "User",
          location: "Set your location",
          university: "Add your university",
          graduation: "Add graduation date",
          connections: 0,
          profileViews: 0,
          avatarColor: "#0073b1",
          completion: 75,
          dailyGoal: 5,
          goalProgress: 3,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications(mockNotifications);
      }
    };

    fetchUserData();
    fetchNotifications();
  }, [navigate]);

  const handleQuickAction = (action) => {
    switch (action) {
      case "build_resume":
        navigate("/resume");
        break;
      case "find_jobs":
        navigate("/jobs");
        break;
      case "skill_test":
        navigate("/skills-test");
        break;
      case "progress":
        navigate("/progress");
        break;
      default:
        break;
    }
  };

  const handleNotificationClick = (notification) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    
    switch (notification.type) {
      case "application_approved":
        navigate("/applications");
        break;
      case "interview_scheduled":
        navigate("/interviews");
        break;
      default:
        navigate("/applications");
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Custom Tooltip for Applications Funnel
  const CustomFunnelTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / applicationsFunnelData[0].value) * 100).toFixed(1);
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px 16px',
          border: '1px solid #e1e4e8',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          fontSize: '14px',
        }}>
          <div style={{ fontWeight: 600, color: '#191919', marginBottom: '4px' }}>
            {data.stage}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: data.color,
              borderRadius: '2px'
            }}></div>
            <span style={{ color: '#666' }}>{data.value} applications</span>
          </div>
          <div style={{ color: '#999', marginTop: '4px' }}>
            {percentage}% conversion
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Line Chart
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e1e4e8',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontWeight: 600, color: '#191919', marginBottom: '8px' }}>
            {label}
          </div>
          <div style={{ color: '#0073b1', fontWeight: 500 }}>
            {payload[0].value} applications
          </div>
        </div>
      );
    }
    return null;
  };

  // All CSS styles in a single object
  // All CSS styles in a single object
const styles = {
  global: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-size: 14px;
      color: #334155;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
      from { transform: translateX(-10px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .glass-effect {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .hover-lift {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #0073b1 0%, #00a0dc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `,
  
  // Main Layout
  dashboardContainer: {
    minHeight: "100vh",
    animation: "fadeIn 0.5s ease-out",
  },
  mainContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px 20px",
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "24px",
    alignItems: "start",
  },
  
  // Profile Card
  profileCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
    marginBottom: "20px",
    animation: "slideIn 0.3s ease-out",
  },
  profileHeader: {
    padding: "32px 24px 24px",
    textAlign: "center",
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    borderBottom: "1px solid #e0f2fe",
  },
  profileAvatar: {
    width: "88px",
    height: "88px",
    background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: 600,
    margin: "0 auto 20px",
    boxShadow: "0 4px 12px rgba(0, 115, 177, 0.3)",
  },
  profileName: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: "8px",
    fontFamily: "'Inter', sans-serif",
  },
  profileTitle: {
    fontSize: "16px",
    color: "#475569",
    marginBottom: "8px",
    fontWeight: 500,
    lineHeight: 1.4,
  },
  profileLocation: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  profileInfo: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    marginTop: "16px",
  },
  infoItem: {
    textAlign: "center",
  },
  infoValue: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0073b1",
  },
  infoLabel: {
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "4px",
  },
  profileCompletion: {
    padding: "24px",
    background: "white",
  },
  completionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    marginBottom: "16px",
    fontWeight: 600,
    color: "#0f172a",
  },
  progressBar: {
    height: "8px",
    background: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "16px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0073b1, #00a0dc)",
    borderRadius: "4px",
    transition: "width 0.6s ease",
    position: "relative",
    overflow: "hidden",
  },
  progressFillAnimated: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
    animation: "pulse 2s infinite",
  },
  profileSteps: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginTop: "20px",
  },
  stepItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    borderRadius: "8px",
    background: "#f8fafc",
    transition: "all 0.2s",
  },
  stepIcon: {
    fontSize: "16px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    background: "rgba(0, 115, 177, 0.1)",
    color: "#0073b1",
  },
  stepText: {
    fontSize: "13px",
    color: "#334155",
    fontWeight: 500,
  },
  
  // Main Feed
  mainFeed: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sectionCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "28px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
    animation: "fadeIn 0.4s ease-out",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "20px",
    color: "#0f172a",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  sectionSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
  },
  seeAll: {
    fontSize: "14px",
    color: "#0073b1",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "rgba(0, 115, 177, 0.1)",
    transition: "all 0.2s",
  },
  
  // Stats Cards
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "28px",
  },
  statCard: {
    padding: "22px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  statCardHover: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(0,115,177,0.1), rgba(0,160,220,0.05))",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  statMain: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: 800,
    color: "#0073b1",
    fontFamily: "'Inter', sans-serif",
  },
  statTrend: {
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  statCardLabel: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 500,
    marginBottom: "4px",
  },
  statCardDescription: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  
  // Quick Actions
  quickActionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    marginTop: "24px",
  },
  actionCard: {
    padding: "24px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "white",
  },
  actionIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: "16px",
    color: "#0f172a",
    marginBottom: "4px",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
  },
  actionDescription: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: 1.5,
    fontWeight: 400,
  },
  
  // Chart Styles
  chartContainer: {
    marginTop: "8px",
  },
  chartTitle: {
    fontSize: "16px",
    color: "#334155",
    marginBottom: "20px",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
  },
  chartWrapper: {
    height: "280px",
    width: "100%",
  },
  
  // Right Sidebar
  rightSidebar: {
    position: "sticky",
    top: "88px",
    height: "fit-content",
  },
  sidebarCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sidebarTitle: {
    fontSize: "18px",
    color: "#0f172a",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "24px",
    height: "24px",
    padding: "0 8px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    fontSize: "12px",
    fontWeight: 700,
  },
  notificationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  notificationItem: {
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "white",
    position: "relative",
  },
  unreadIndicator: {
    position: "absolute",
    left: "-6px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0073b1, #00a0dc)",
    boxShadow: "0 0 0 3px rgba(0, 115, 177, 0.1)",
  },
  notificationHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "12px",
  },
  notificationIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: 600,
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
  },
  notificationCompany: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: "4px",
    fontFamily: "'Inter', sans-serif",
  },
  notificationPosition: {
    fontSize: "13px",
    color: "#0073b1",
    fontWeight: 500,
    marginBottom: "8px",
  },
  notificationMessage: {
    fontSize: "14px",
    color: "#475569",
    fontWeight: 400,
    lineHeight: 1.5,
    marginBottom: "8px",
  },
  notificationFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },
  notificationTime: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: 400,
  },
  notificationStatus: {
    fontSize: "11px",
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: "12px",
  },
  markAllReadBtn: {
    fontSize: "14px",
    color: "#0073b1",
    background: "rgba(0, 115, 177, 0.1)",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.2s",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 24px",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: 0.2,
  },
  emptyText: {
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  
  // Weekly Goal Card
  goalCard: {
    background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #bae6fd",
    marginBottom: "20px",
  },
  goalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  goalTitle: {
    fontSize: "16px",
    color: "#0369a1",
    fontWeight: 600,
  },
  goalProgress: {
    fontSize: "14px",
    color: "#0369a1",
    fontWeight: 700,
  },
  goalBar: {
    height: "8px",
    background: "#e0f2fe",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  goalFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0ea5e9, #38bdf8)",
    borderRadius: "4px",
    transition: "width 0.6s ease",
  },
  goalStats: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#64748b",
  },
  
  // Loading State
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%)",
  },
  spinner: {
    width: "56px",
    height: "56px",
    border: "4px solid rgba(0, 115, 177, 0.1)",
    borderTopColor: "#0073b1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  
  // Company Approval Screen Styles (missing from your original)
  approvalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f3f2ef, #eef3f8)",
    padding: "24px",
  },
  approvalCard: {
    background: "white",
    padding: "44px",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "460px",
    width: "100%",
  },
  approvalIcon: {
    fontSize: "60px",
    color: "#f59e0b",
    marginBottom: "24px",
  },
  approvalTitle: {
    fontSize: "28px",
    color: "#191919",
    marginBottom: "16px",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
  },
  approvalText: {
    fontSize: "17px",
    color: "#666",
    lineHeight: 1.6,
    marginBottom: "30px",
    fontWeight: 400,
  },
  approvalActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  btnPrimary: {
    padding: "13px 26px",
    background: "#0073b1",
    color: "white",
    borderRadius: "4px",
    fontSize: "17px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
    fontFamily: "'Inter', sans-serif",
  },
  btnSecondary: {
    padding: "13px 26px",
    background: "white",
    color: "#0073b1",
    border: "1px solid #0073b1",
    borderRadius: "4px",
    fontSize: "17px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
};

  // Company Not Approved Screen (unchanged)
  if (!isCompanyApproved) {
    return (
      <div style={styles.approvalContainer}>
        <style>{styles.global}</style>
        <div style={styles.approvalCard}>
          <div style={styles.approvalIcon}>⏳</div>
          <h1 style={styles.approvalTitle}>Account Pending Approval</h1>
          <p style={styles.approvalText}>
            Your company account is currently under review. You'll receive an
            email notification once approved.
          </p>
          <div style={styles.approvalActions}>
            <button
              style={styles.btnPrimary}
              onClick={() => navigate("/contact")}
              onMouseEnter={(e) => {
                e.target.style.background = "#006097";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 115, 177, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#0073b1";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Contact Support
            </button>
            <button
              style={styles.btnSecondary}
              onClick={() => navigate("/")}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(0, 115, 177, 0.1)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0, 115, 177, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <style>{styles.global}</style>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      <style>{styles.global}</style>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Main Feed */}
        <div style={styles.mainFeed}>
          {/* Enhanced Profile Card */}
          <div style={styles.profileCard} className="hover-lift">
            <div style={styles.profileHeader}>
              <div style={styles.profileAvatar}>
                {getInitials(user?.name || "User")}
              </div>
              <h2 style={styles.profileName}>{user?.name || "User"}</h2>
              <p style={styles.profileTitle}>{user?.role || "Professional"}</p>
              <p style={styles.profileLocation}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {user?.location}
              </p>
              <div style={styles.profileInfo}>
                <div style={styles.infoItem}>
                  <div style={styles.infoValue}>{user?.connections || 0}</div>
                  <div style={styles.infoLabel}>Connections</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoValue}>{user?.profileViews || 0}</div>
                  <div style={styles.infoLabel}>Profile Views</div>
                </div>
              </div>
            </div>

            <div style={styles.profileCompletion}>
              <div style={styles.completionHeader}>
                <span>Profile Strength</span>
                <span style={{ color: "#0073b1", fontWeight: 700 }}>
                  {user?.completion || 0}%
                </span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${user?.completion || 0}%`,
                  }}
                >
                  <div style={styles.progressFillAnimated}></div>
                </div>
              </div>
              
              <div style={styles.profileSteps}>
                {profileSteps.map((step) => (
                  <div
                    key={step.id}
                    style={{
                      ...styles.stepItem,
                      opacity: step.completed ? 1 : 0.6,
                    }}
                  >
                    <div style={styles.stepIcon}>
                      {step.icon}
                    </div>
                    <span style={styles.stepText}>{step.label}</span>
                    {step.completed && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Applications Overview Card */}
          <div style={styles.sectionCard} className="hover-lift">
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.sectionTitle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0073b1" strokeWidth="2">
                    <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                  </svg>
                  Applications Overview
                </h3>
                <p style={styles.sectionSubtitle}>
                  Track your internship application progress
                </p>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div style={styles.statsGrid}>
              {Object.entries(mockData.stats).map(([key, value]) => (
                <div
                  key={key}
                  style={styles.statCard}
                  className="hover-lift"
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.stat-card-hover').style.opacity = 1;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.stat-card-hover').style.opacity = 0;
                  }}
                >
                  <div style={styles.statCardHover} className="stat-card-hover"></div>
                  <div style={styles.statMain}>
                    <span style={styles.statNumber}>{value.value}</span>
                    <div style={{
                      ...styles.statTrend,
                      background: value.trend > 0 
                        ? "rgba(16, 185, 129, 0.1)" 
                        : value.trend < 0 
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(148, 163, 184, 0.1)",
                      color: value.trend > 0 
                        ? "#10b981" 
                        : value.trend < 0 
                        ? "#ef4444"
                        : "#64748b",
                    }}>
                      {value.trend > 0 ? "↑" : value.trend < 0 ? "↓" : "→"}
                      {Math.abs(value.trend)}%
                    </div>
                  </div>
                  <div style={styles.statCardLabel}>
                    {key.split(/(?=[A-Z])/).join(" ")}
                  </div>
                  <div style={styles.statCardDescription}>
                    Total {key.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>

            {/* Applications Funnel Chart */}
            <div style={styles.chartContainer}>
              <div style={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={applicationsFunnelData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="stage" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                      height={40}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip content={<CustomFunnelTooltip />} />
                    <Bar 
                      dataKey="value" 
                      radius={[8, 8, 0, 0]}
                    >
                      {applicationsFunnelData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={entry.color}
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: "32px" }}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>Quick Actions</h3>
              </div>
              <div style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    style={styles.actionCard}
                    className="hover-lift"
                    onClick={() => handleQuickAction(action.action)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = action.color;
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 12px 32px rgba(${parseInt(action.color.slice(1, 3), 16)}, ${parseInt(action.color.slice(3, 5), 16)}, ${parseInt(action.color.slice(5, 7), 16)}, 0.15)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        ...styles.actionIcon,
                        background: action.gradient,
                        color: "white",
                      }}
                    >
                      {action.icon}
                    </div>
                    <div style={styles.actionContent}>
                      <h4 style={styles.actionTitle}>{action.label}</h4>
                      <p style={styles.actionDescription}>
                        {action.description}
                      </p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Applications Over Time Card */}
          <div style={styles.sectionCard} className="hover-lift">
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.sectionTitle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0073b1" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  Applications Timeline
                </h3>
                <p style={styles.sectionSubtitle}>
                  Monthly application trends
                </p>
              </div>
            </div>
            <div style={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={applicationsOverTimeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0073b1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0073b1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#0073b1"
                    strokeWidth={2}
                    fill="url(#colorApplications)"
                    activeDot={{ r: 6, fill: "#0073b1", stroke: "white", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={styles.rightSidebar}>
          {/* Weekly Goal Card */}
          <div style={styles.goalCard}>
            <div style={styles.goalHeader}>
              <h3 style={styles.goalTitle}>Weekly Goal</h3>
              <span style={styles.goalProgress}>
                {mockData.weeklyGoal.current}/{mockData.weeklyGoal.target}
              </span>
            </div>
            <div style={styles.goalBar}>
              <div 
                style={{
                  ...styles.goalFill,
                  width: `${mockData.weeklyGoal.progress}%`
                }}
              ></div>
            </div>
            <div style={styles.goalStats}>
              <span>Keep going!</span>
              <span>{mockData.weeklyGoal.progress}% complete</span>
            </div>
          </div>

          {/* Notifications Card */}
          <div style={styles.sidebarCard} className="hover-lift">
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                Recent Updates
                {getUnreadCount() > 0 && (
                  <span style={styles.badge}>
                    {getUnreadCount()}
                  </span>
                )}
              </h3>
              <button
                style={styles.markAllReadBtn}
                onClick={markAllAsRead}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(0, 115, 177, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(0, 115, 177, 0.1)";
                }}
              >
                Mark all read
              </button>
            </div>
            
            {notifications.length > 0 ? (
              <div style={styles.notificationsList}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={styles.notificationItem}
                    className="hover-lift"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {!notification.read && (
                      <div style={styles.unreadIndicator}></div>
                    )}
                    <div style={styles.notificationHeader}>
                      <div
                        style={{
                          ...styles.notificationIcon,
                          backgroundColor: `${notification.color}15`,
                          color: notification.color,
                          border: `2px solid ${notification.color}30`,
                        }}
                      >
                        {notification.icon}
                      </div>
                      <div style={styles.notificationContent}>
                        <div style={styles.notificationCompany}>
                          {notification.company}
                        </div>
                        <div style={styles.notificationPosition}>
                          {notification.position}
                        </div>
                        <div style={styles.notificationMessage}>
                          {notification.message}
                        </div>
                        <div style={styles.notificationFooter}>
                          <span style={styles.notificationTime}>
                            {notification.time}
                          </span>
                          <span style={{
                            ...styles.notificationStatus,
                            backgroundColor: `${notification.color}15`,
                            color: notification.color,
                          }}>
                            {notification.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🔔</div>
                <div style={styles.emptyText}>
                  No notifications yet.<br/>
                  Apply for internships to get updates!
                </div>
              </div>
            )}
          </div>

          {/* Skills Distribution Card */}
          <div style={styles.sidebarCard} className="hover-lift">
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Top Skills
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {skillsData.slice(0, 5).map((skill, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    marginBottom: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}>
                    <span style={{ color: "#334155" }}>{skill.skill}</span>
                    <span style={{ color: "#0073b1", fontWeight: 600 }}>{skill.level}%</span>
                  </div>
                  <div style={{
                    height: "6px",
                    background: "#e2e8f0",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${skill.level}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #0073b1, #00a0dc)",
                      borderRadius: "3px",
                      transition: "width 1s ease-out",
                      transitionDelay: `${index * 0.1}s`,
                    }}></div>
                  </div>
                  <div style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    marginTop: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}>
                    {skill.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;