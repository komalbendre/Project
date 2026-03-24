import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* Left Section */}
        <div style={styles.section}>
          <h3 style={styles.logo}>SOLO Network</h3>
          <p style={styles.text}>
            Empowering students and professionals with opportunities,
            internships, live projects, and career pathways.
          </p>
        </div>

        {/* Middle Section */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.list}>
            <li><a href="/dashboard" style={styles.link}>Dashboard</a></li>
            <li><a href="/jobs" style={styles.link}>Jobs</a></li>
            <li><a href="/courses" style={styles.link}>Courses</a></li>
            <li><a href="/career-paths" style={styles.link}>Career Paths</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div style={styles.section}>
          <h4 style={styles.heading}>Contact</h4>
          <p style={styles.text}>support@solonetwork.com</p>
          <div style={styles.socialContainer}>
            <a href="#" style={styles.social}>LinkedIn</a>
            <a href="#" style={styles.social}>Twitter</a>
            <a href="#" style={styles.social}>Instagram</a>
          </div>
        </div>
      </div>

      <div style={styles.bottom}>
        © {year} SOLO Network. All rights reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: "40px 20px 20px",
    marginTop: "50px",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1200px",
    margin: "auto",
  },
  section: {
    flex: "1",
    minWidth: "250px",
    marginBottom: "20px",
  },
  logo: {
    marginBottom: "10px",
  },
  heading: {
    marginBottom: "10px",
  },
  text: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#cbd5e1",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#cbd5e1",
    fontSize: "14px",
    display: "block",
    marginBottom: "6px",
  },
  socialContainer: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
  },
  social: {
    textDecoration: "none",
    color: "#38bdf8",
    fontSize: "14px",
  },
  bottom: {
    borderTop: "1px solid #1e293b",
    marginTop: "30px",
    paddingTop: "15px",
    textAlign: "center",
    fontSize: "13px",
    color: "#94a3b8",
  },
};

export default Footer;