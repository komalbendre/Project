import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Signup from './forms/Signup';
import Login from './forms/Login';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProfileForm from "./forms/ProfileForm";
import MyProfile from "./pages/MyProfile";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard";
import CareerPaths from "./pages/CareerPaths";
import ResumeBuilder from "./pages/ResumeBuilder";
import ApplyPage from "./pages/ApplyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/Admin/dashboard/AdminDashboard";
import CompanyDashboard from './pages/Company/CompanyDashboard';
import CompanyApplications from './pages/Company/CompanyApplications';
import CompanyAnalytics from './pages/Company/CompanyAnalytics';
import EditCompanyProfile from './pages/Company/EditCompanyProfile';
import CompanyInternships from './pages/Company/CompanyInternships';
import CompanyInternshipView from './pages/Company/CompanyInternshipView';
import CreateInternship from './pages/Company/CreateInternship';
import CompanyDetails from "./pages/Admin/dashboard/CompanyDetails";
import Internships from "./pages/Internships";
import CompanyInterviews from './pages/Company/CompanyInterviews';
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import CompanySidebar from "./components/CompanySidebar";
import Footer from "./components/Footer";
import Settings from './pages/Settings';
import { ThemeProvider } from './context/ThemeContext';

const NAVBAR_HEIGHT = 64;

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAuthenticated = !!localStorage.getItem("token");

  const isCompanyRoute = location.pathname.startsWith('/company/');
  const isAdminRoute = location.pathname.startsWith('/admin/');
  const hideAllNavbars = ['/login', '/signup'].includes(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider>
      <div style={{ minHeight: "100vh", background: "var(--bg-secondary, #f8fafc)" }}>

        {/* User Navbar */}
        {!hideAllNavbars && !isCompanyRoute && !isAdminRoute && (
          <Navbar />
        )}

        {/* Company Sidebar */}
        {isCompanyRoute && !hideAllNavbars && (
          <CompanySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        )}

        {/* Admin Navbar */}
        {isAdminRoute && !hideAllNavbars && (
          <>
            <div
              style={{
                background: '#0F172A',
                color: 'white',
                padding: '0 2rem',
                height: `${NAVBAR_HEIGHT}px`,
                display: 'flex',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Admin Portal
            </div>
            <div style={{ height: `${NAVBAR_HEIGHT}px` }} />
          </>
        )}

        {/* Main Content */}
        <div
          style={{
            marginLeft: isCompanyRoute && !hideAllNavbars
              ? (sidebarOpen ? '260px' : '80px')
              : '0',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/career-paths" element={<CareerPaths />} />
            <Route path="/jobs" element={<Internships />} />
            <Route path="/resume" element={<ResumeBuilder />} />

            {/* Protected User Routes */}
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/my-profile" element={
              <ProtectedRoute><MyProfile /></ProtectedRoute>
            } />
            <Route path="/profile-form" element={
              <ProtectedRoute><ProfileForm /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />
            <Route path="/apply/:internshipId" element={
              <ProtectedRoute><ApplyPage /></ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/companies/:companyId" element={
              <ProtectedRoute><CompanyDetails /></ProtectedRoute>
            } />

            {/* Company Routes */}
            <Route path="/company/dashboard" element={
              <ProtectedRoute><CompanyDashboard /></ProtectedRoute>
            } />
            <Route path="/company/applications" element={
              <ProtectedRoute><CompanyApplications /></ProtectedRoute>
            } />
            <Route path="/company/analytics" element={
              <ProtectedRoute><CompanyAnalytics /></ProtectedRoute>
            } />
            <Route path="/company/edit-profile" element={
              <ProtectedRoute><EditCompanyProfile /></ProtectedRoute>
            } />
            <Route path="/company/interviews" element={
              <ProtectedRoute><CompanyInterviews /></ProtectedRoute>
            } />
            <Route path="/company/internships" element={
              <ProtectedRoute><CompanyInternships /></ProtectedRoute>
            } />
            <Route path="/company/internships/create" element={
              <ProtectedRoute><CreateInternship /></ProtectedRoute>
            } />
            <Route path="/company/internships/:id" element={
              <ProtectedRoute><CompanyInternshipView /></ProtectedRoute>
            } />
            <Route path="/company/internships/:id/edit" element={
              <ProtectedRoute><CreateInternship /></ProtectedRoute>
            } />

            {/* Placeholder Routes */}
            <Route path="/company/internships/manage" element={
              <ProtectedRoute><div style={{ padding: '2rem' }}>Manage Internships</div></ProtectedRoute>
            } />
            <Route path="/company/interviews/schedule" element={
              <ProtectedRoute><div style={{ padding: '2rem' }}>Schedule Interview</div></ProtectedRoute>
            } />
            <Route path="/company/messages" element={
              <ProtectedRoute><div style={{ padding: '2rem' }}>Messages</div></ProtectedRoute>
            } />
            <Route path="/company/candidates" element={
              <ProtectedRoute><div style={{ padding: '2rem' }}>Candidates</div></ProtectedRoute>
            } />
            <Route path="/company/team" element={
              <ProtectedRoute><div style={{ padding: '2rem' }}>Team Management</div></ProtectedRoute>
            } />
            <Route path="/company/billing" element={
              <ProtectedRoute><div style={{ padding: '2rem' }}>Billing</div></ProtectedRoute>
            } />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />

        {/* Chatbot (ONLY ONCE) */}
        {isAuthenticated && !isAdminRoute && !isCompanyRoute && (
          <ChatbotWidget />
        )}

      </div>
    </ThemeProvider>
  );
}

export default App;