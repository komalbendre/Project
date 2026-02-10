import React from "react";

const ProfilePreview = ({ profile }) => {
  const containerStyle = {
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    flex: 1,
    minWidth: "250px",
  };

  const itemStyle = { marginBottom: "0.5rem" };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginBottom: "1rem", color: "#333" }}>Profile Preview</h3>
      <p style={itemStyle}><strong>Full Name:</strong> {profile.fullName}</p>
      <p style={itemStyle}><strong>Email:</strong> {profile.email}</p>
      <p style={itemStyle}><strong>Phone:</strong> {profile.phone}</p>
      <p style={itemStyle}><strong>Bio:</strong> {profile.bio}</p>
      <p style={itemStyle}><strong>Skills:</strong> {profile.skills}</p>
      <p style={itemStyle}><strong>LinkedIn:</strong> {profile.linkedin}</p>
      <p style={itemStyle}><strong>GitHub:</strong> {profile.github}</p>
    </div>
  );
};

export default ProfilePreview;
