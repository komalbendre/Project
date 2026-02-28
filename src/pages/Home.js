import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // CSS Styles
  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      color: "#1a1a1a",
      lineHeight: 1.6,
    },
    hero: {
      background: "linear-gradient(135deg, #293e97 0%, #0d5469 100%)",
      color: "white",
      padding: "6rem 2rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    heroBg: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.1,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    },
    heroContent: {
      position: "relative",
      zIndex: 2,
      maxWidth: "800px",
      margin: "0 auto",
    },
    headline: {
      fontSize: "clamp(2.5rem, 5vw, 4rem)",
      fontWeight: 800,
      marginBottom: "1.5rem",
      lineHeight: 1.2,
      background: "linear-gradient(135deg, #fff 0%, #e2e8ff 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtext: {
      fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
      marginBottom: "2.5rem",
      opacity: 0.95,
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    primaryButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "1rem 2.5rem",
      background: "white",
      color: "#667eea",
      border: "none",
      borderRadius: "50px",
      fontSize: "1.125rem",
      fontWeight: 600,
      cursor: "pointer",
      textDecoration: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    },
    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "1rem 2.5rem",
      background: "transparent",
      color: "white",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50px",
      fontSize: "1.125rem",
      fontWeight: 600,
      cursor: "pointer",
      textDecoration: "none",
      transition: "all 0.3s ease",
    },
    section: {
      padding: "5rem 2rem",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    sectionTitle: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: 700,
      textAlign: "center",
      marginBottom: "3rem",
      color: "#1a1a1a",
      position: "relative",
    },
    sectionTitleUnderline: {
      content: '""',
      display: "block",
      width: "60px",
      height: "4px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      margin: "1rem auto",
      borderRadius: "2px",
    },
    features: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "2rem",
      marginTop: "3rem",
    },
    featureCard: {
      background: "white",
      padding: "2.5rem 2rem",
      borderRadius: "20px",
      textAlign: "center",
      transition: "all 0.3s ease",
      border: "1px solid #f0f0f0",
      position: "relative",
      overflow: "hidden",
    },
    featureIcon: {
      fontSize: "3rem",
      marginBottom: "1.5rem",
      display: "inline-block",
    },
    featureTitle: {
      fontSize: "1.5rem",
      fontWeight: 600,
      marginBottom: "1rem",
      color: "#2d3748",
    },
    featureText: {
      color: "#718096",
      fontSize: "1.1rem",
    },
    stepsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "2rem",
      marginTop: "3rem",
      flexWrap: "wrap",
      position: "relative",
    },
    stepConnector: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "calc(100% - 400px)",
      height: "2px",
      background: "linear-gradient(90deg, transparent, #667eea, transparent)",
      zIndex: 1,
    },
    step: {
      background: "white",
      padding: "2rem",
      borderRadius: "20px",
      textAlign: "center",
      width: "280px",
      position: "relative",
      zIndex: 2,
      transition: "all 0.3s ease",
      boxShadow: "0 10px 30px rgba(102, 126, 234, 0.1)",
    },
    stepNumber: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "60px",
      height: "60px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      borderRadius: "50%",
      fontSize: "1.5rem",
      fontWeight: 700,
      marginBottom: "1.5rem",
    },
    stepTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      marginBottom: "1rem",
      color: "#2d3748",
    },
    stepText: {
      color: "#718096",
    },
    cta: {
      background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
      color: "white",
      padding: "5rem 2rem",
      textAlign: "center",
      borderRadius: "30px",
      margin: "2rem auto",
      maxWidth: "1000px",
    },
    ctaTitle: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: 700,
      marginBottom: "1.5rem",
    },
    ctaText: {
      fontSize: "1.25rem",
      opacity: 0.9,
      marginBottom: "2.5rem",
      maxWidth: "600px",
      marginLeft: "auto",
      marginRight: "auto",
    },
    ctaButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "1rem 3rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "50px",
      fontSize: "1.125rem",
      fontWeight: 600,
      cursor: "pointer",
      textDecoration: "none",
      transition: "all 0.3s ease",
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "2rem",
      margin: "4rem auto",
      maxWidth: "800px",
    },
    stat: {
      textAlign: "center",
    },
    statNumber: {
      fontSize: "3rem",
      fontWeight: 700,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "0.5rem",
    },
    statLabel: {
      fontSize: "1.125rem",
      color: "#718096",
      fontWeight: 500,
    },
    footer: {
      textAlign: "center",
      padding: "3rem 2rem",
      color: "#718096",
      fontSize: "0.875rem",
      borderTop: "1px solid #e2e8f0",
    },
  };

  const styleTag = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
    }
    
    .step:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.2);
    }
    
    .button-hover:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    }
    
    .pulse {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }
  `;

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.2)";
    } else {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "";
    }
  };

  const handleCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-10px)";
      e.currentTarget.style.boxShadow = "0 20px 40px rgba(102, 126, 234, 0.15)";
    } else {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 10px 30px rgba(102, 126, 234, 0.1)";
    }
  };

  return (
    <div style={styles.container}>
      <style>{styleTag}</style>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBg}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.headline}>
            Find Your Best Career Path with AI
          </h1>
          <p style={styles.subtext}>
            Personalized career paths, resume optimization, and job tracking — 
            all powered by artificial intelligence to accelerate your success.
          </p>
          <div style={styles.buttonGroup}>
            <Link 
              to="/dashboard" 
              style={styles.primaryButton}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
              className="button-hover pulse"
            >
              🚀 Get Started Free
            </Link>
            <Link 
  to="/career-paths" 
  style={styles.secondaryButton}
  onMouseEnter={(e) => handleButtonHover(e, true)}
  onMouseLeave={(e) => handleButtonHover(e, false)}
  className="button-hover"
>
  📝 Learn More
</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ ...styles.section, paddingTop: "3rem" }}>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>10K+</div>
            <div style={styles.statLabel}>Career Transitions</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>95%</div>
            <div style={styles.statLabel}>Success Rate</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>50+</div>
            <div style={styles.statLabel}>Industries</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>24/7</div>
            <div style={styles.statLabel}>AI Support</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Powerful Features
          <span style={styles.sectionTitleUnderline}></span>
        </h2>
        <div style={styles.features}>
          {[
            {
              icon: "🤖",
              title: "AI Career Path Suggestions",
              text: "Smart recommendations for your unique journey with real-time market insights."
            },
            {
              icon: "📄",
              title: "Resume Builder",
              text: "Create professional resumes that stand out to recruiters with ATS optimization."
            },
            {
              icon: "📊",
              title: "Job Tracker",
              text: "Keep all your applications and interviews organized in one dashboard."
            },
            {
              icon: "🎓",
              title: "Learning Hub",
              text: "Upskill with tailored resources, certifications, and personalized courses."
            },
            {
              icon: "🎯",
              title: "Interview Prep",
              text: "Practice with AI-powered mock interviews and personalized feedback."
            },
            {
              icon: "🤝",
              title: "Networking",
              text: "Connect with mentors and professionals in your target industry."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              style={styles.featureCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              className="feature-card"
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...styles.section, background: "#f8fafc", borderRadius: "30px" }}>
        <h2 style={styles.sectionTitle}>
          How It Works
          <span style={styles.sectionTitleUnderline}></span>
        </h2>
        <div style={styles.stepsContainer}>
          <div style={styles.stepConnector}></div>
          {[
            {
              number: "1",
              title: "Create Your Profile",
              text: "Tell us about your skills, experience, and career goals."
            },
            {
              number: "2",
              title: "Get AI-Powered Suggestions",
              text: "Receive personalized career paths and skill recommendations."
            },
            {
              number: "3",
              title: "Apply, Learn & Grow",
              text: "Track applications, upskill, and land your dream job."
            }
          ].map((step, index) => (
            <div 
              key={index}
              style={styles.step}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              className="step"
            >
              <div style={styles.stepNumber}>{step.number}</div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepText}>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>
          Ready to Transform Your Career?
        </h2>
        <p style={styles.ctaText}>
          Join thousands of professionals who have accelerated their career growth 
          with our AI-powered platform.
        </p>
        <Link 
          to="/signup" 
          style={styles.ctaButton}
          onMouseEnter={(e) => handleButtonHover(e, true)}
          onMouseLeave={(e) => handleButtonHover(e, false)}
          className="button-hover pulse"
        >
          🚀 Start Your Free Trial
        </Link>
        <p style={{ marginTop: "2rem", opacity: 0.8 }}>
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} CareerSync. All rights reserved.</p>
        <p style={{ marginTop: "0.5rem" }}>
          Built with ❤️ to help you achieve your career dreams
        </p>
      </footer>
    </div>
  );
};

export default Home;