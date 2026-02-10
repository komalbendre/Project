// frontend/src/pages/MyProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfilePreview from "../components/ProfilePreview";

const MyProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    skills: "",
    linkedin: "",
    github: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = res.data;

        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          skills: data.skills ? data.skills.join(", ") : "",
          linkedin: data.linkedin || "",
          github: data.github || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        setMessage("Error loading profile.");
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
        My Profile
      </h2>

      {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}

      <ProfilePreview profile={profile} />

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1rem",
          }}
          onClick={() => navigate("/profile-form")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
