// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const isApproved = localStorage.getItem("isApproved") === "true";
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If company and not approved, redirect to pending page or dashboard
  if (userRole === "company" && !isApproved) {
    // You can either redirect to a separate pending page
    // or let them go to dashboard which will show block screen
    return children; // Dashboard will handle the blocking
  }
  
  return children;
};

export default ProtectedRoute;