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
import EditInternship from './pages/Company/EditInternship';
import CompanyInternshipView from './pages/Company/CompanyInternshipView';
import CreateInternship from './pages/Company/CreateInternship';
import CompanyDetails from "./pages/Admin/dashboard/CompanyDetails";
import Internships from "./pages/Internships";
import CompanyInterviews from './pages/Company/CompanyInterviews';
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import CompanyNavbar from "./components/CompanyNavbar";
import Footer from "./components/Footer";

// FIX: single source of truth for navbar height — matches Navbar.js
const NAVBAR_HEIGHT = 64;

function App() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("token");

  const isCompanyRoute = location.pathname.startsWith('/company/');
  const isAdminRoute = location.pathname.startsWith('/admin/');
  const hideAllNavbars = ['/login', '/signup'].includes(location.pathname);

  // FIX: App.js no longer applies paddingTop — the Navbar component
  // renders its own spacer div (height = NAVBAR_HEIGHT) right after
  // the fixed <nav> element, which naturally pushes all page content down.
  // Adding paddingTop here on top of that spacer was causing double gap.

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* User navbar — includes its own spacer, no extra paddingTop needed */}
      {!hideAllNavbars && !isCompanyRoute && !isAdminRoute && (
        <Navbar />
      )}

      {/* Company navbar */}
      {isCompanyRoute && !hideAllNavbars && (
        <CompanyNavbar />
      )}

      {/* Admin navbar placeholder — fixed height matches NAVBAR_HEIGHT */}
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
          {/* Spacer to push content below fixed admin navbar */}
          <div style={{ height: `${NAVBAR_HEIGHT}px` }} />
        </>
      )}

      {/* Page content — no paddingTop here, spacing handled by navbar spacers above */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/profile-form" element={<ProfileForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/career-paths" element={<CareerPaths />} />
        <Route path="/jobs" element={<Internships />} />
        <Route
          path="/apply/:internshipId"
          element={
            <ProtectedRoute>
              <ApplyPage />
            </ProtectedRoute>
          }
        />
        <Route path="/resume" element={<ResumeBuilder />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/:companyId"
          element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
          }
        />

        {/* Company Routes */}
        <Route path="/company/dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/applications" element={<ProtectedRoute><CompanyApplications /></ProtectedRoute>} />
        <Route path="/company/analytics" element={<ProtectedRoute><CompanyAnalytics /></ProtectedRoute>} />
        <Route path="/company/edit-profile" element={<ProtectedRoute><EditCompanyProfile /></ProtectedRoute>} />
        <Route path="/company/interviews" element={<ProtectedRoute><CompanyInterviews /></ProtectedRoute>} />
        <Route path="/company/internships" element={<ProtectedRoute><CompanyInternships /></ProtectedRoute>} />
        <Route path="/company/internships/create" element={<ProtectedRoute><CreateInternship /></ProtectedRoute>} />
        <Route path="/company/internships/:id" element={<ProtectedRoute><CompanyInternshipView /></ProtectedRoute>} />
        <Route path="/company/internships/:id/edit" element={<ProtectedRoute><CreateInternship /></ProtectedRoute>} />

        {/* Placeholder company routes */}
        <Route path="/company/internships/manage" element={<ProtectedRoute><div style={{ padding: '2rem' }}>Manage Internships</div></ProtectedRoute>} />
        <Route path="/company/interviews/schedule" element={<ProtectedRoute><div style={{ padding: '2rem' }}>Schedule Interview</div></ProtectedRoute>} />
        <Route path="/company/messages" element={<ProtectedRoute><div style={{ padding: '2rem' }}>Messages</div></ProtectedRoute>} />
        <Route path="/company/candidates" element={<ProtectedRoute><div style={{ padding: '2rem' }}>Candidates</div></ProtectedRoute>} />
        <Route path="/company/team" element={<ProtectedRoute><div style={{ padding: '2rem' }}>Team Management</div></ProtectedRoute>} />
        <Route path="/company/billing" element={<ProtectedRoute><div style={{ padding: '2rem' }}>Billing</div></ProtectedRoute>} />
      </Routes>

      {/* Chatbot — only on user routes when authenticated */}
      {isAuthenticated && !isAdminRoute && !isCompanyRoute && (
        <ChatbotWidget />
      )}

      <Footer />
    </div>
  );
}

export default App;