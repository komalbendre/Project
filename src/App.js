import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import CompanySidebar from "./components/CompanySidebar";
import CompanyNavbar from "./components/CompanyNavbar"; // You can remove this or keep for reference
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
import ApplyPage from "./pages/ApplyPage"; // Import the ApplyPage component
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
// import ResumeOne from './pages/resumes/resumeOne'; 
// import openaiRouter from "./routes/openai.js";

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if we're on a company route
  const isCompanyRoute = location.pathname.startsWith('/company/');

  // Check if we should hide all navbars (login, signup pages)
  const hideAllNavbars = ['/login', '/signup'].includes(location.pathname);

  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin/');

  // Adjust sidebar based on screen size
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      {/* Show appropriate navbar based on route */}
      {!hideAllNavbars && !isCompanyRoute && !isAdminRoute && (
        <Navbar />
      )}

      {/* Show sidebar for company routes */}
      {isCompanyRoute && !hideAllNavbars && (
        <CompanySidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      )}

      {/* Main content with sidebar margin */}
      <div style={{
        marginLeft: isCompanyRoute && !hideAllNavbars ? (sidebarOpen ? '260px' : '80px') : '0',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        background: '#f8fafc'
      }}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/profile-form" element={<ProfileForm />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/career-paths" element={<CareerPaths />} />
          <Route path="/apply/:internshipId" element={
            <ProtectedRoute>
              <ApplyPage />
            </ProtectedRoute>
          } />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/companies/:companyId" element={
            <ProtectedRoute>
              <CompanyDetails />
            </ProtectedRoute>
          } />


          {/* Company Routes */}
          <Route path="/company/dashboard" element={
            <ProtectedRoute>
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/company/applications" element={
            <ProtectedRoute>
              <CompanyApplications />
            </ProtectedRoute>
          } />
          <Route path="/company/analytics" element={
            <ProtectedRoute>
              <CompanyAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/company/edit-profile" element={
            <ProtectedRoute>
              <EditCompanyProfile />
            </ProtectedRoute>
          } />

          {/* Internship Routes - IMPORTANT: Order matters! */}
          <Route path="/company/internships" element={
            <ProtectedRoute>
              <CompanyInternships />
            </ProtectedRoute>
          } />
          <Route path="/company/internships/create" element={
            <ProtectedRoute>
              <CreateInternship />  {/* This should be CreateInternship, not EditInternship */}
            </ProtectedRoute>
          } />
          <Route path="/company/internships/:id" element={
            <ProtectedRoute>
              <CompanyInternshipView />
            </ProtectedRoute>
          } />
          <Route path="/company/internships/:id/edit" element={
            <ProtectedRoute>
              <CreateInternship />  {/* Use CreateInternship for edit mode too */}
            </ProtectedRoute>
          } />

          {/* Add other company routes */}
          <Route path="/company/internships/manage" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem' }}>Manage Internships</div>
            </ProtectedRoute>
          } />
          <Route path="/company/interviews" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem' }}>Interviews Page</div>
            </ProtectedRoute>
          } />
          <Route path="/company/interviews/schedule" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem' }}>Schedule Interview</div>
            </ProtectedRoute>
          } />
          <Route path="/company/messages" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem' }}>Messages Page</div>
            </ProtectedRoute>
          } />
          <Route path="/company/candidates" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem' }}>Candidates Page</div>
            </ProtectedRoute>
          } />
          <Route path="/company/team" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem' }}>Team Management</div>
            </ProtectedRoute>
          } />
          <Route path="/company/billing" element={
            <ProtectedRoute>
              <div style={{ padding: '2rem' }}>Billing Page</div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;