import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";

const CareerPaths = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("internships");
  const [activeFilters, setActiveFilters] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [aiResults, setAiResults] = useState([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const API_BASE = "http://localhost:5001";

  // State for real user data
  const [userData, setUserData] = useState({
    name: "",
    currentRole: "",
    skills: [],
    experienceLevel: "",
    goals: [],
  });

  // State for dynamic data from backend
  const [internships, setInternships] = useState([]);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Mock AI recommendations for roadmap and skills
  const [mockRecommendations, setMockRecommendations] = useState({
    skills: {
      current: [],
      recommended: [
        { skill: "TypeScript", priority: "high", reason: "Industry standard for large codebases" },
        { skill: "Next.js", priority: "high", reason: "Popular framework for React apps" },
        { skill: "GraphQL", priority: "medium", reason: "Modern API technology" },
        { skill: "AWS", priority: "medium", reason: "Cloud infrastructure skills" },
        { skill: "Testing (Jest, Cypress)", priority: "medium", reason: "Essential for quality code" },
        { skill: "System Design", priority: "low", reason: "For senior roles" },
      ],
    },
    roadmap: {
      "short-term": [
        { month: "Month 1-3", goal: "Master TypeScript", activities: ["Complete TS course", "Convert 2 projects to TS"] },
        { month: "Month 4-6", goal: "Learn Next.js", activities: ["Build portfolio with Next.js", "Deploy 3 projects"] },
        { month: "Month 7-9", goal: "Improve Testing", activities: ["Learn Jest & Cypress", "Add tests to existing projects"] },
      ],
      "mid-term": [
        { month: "Year 1", goal: "Senior Frontend Developer", activities: ["Lead small projects", "Mentor juniors", "System design"] },
        { month: "Year 2", goal: "Full Stack Transition", activities: ["Learn backend (Node.js)", "Database design", "DevOps basics"] },
        { month: "Year 3", goal: "Tech Lead", activities: ["Architecture decisions", "Team leadership", "Project management"] },
      ],
    },
  });

  // Helper functions for data transformation
  const calculateMatch = (internshipSkills, userSkills) => {
    if (!internshipSkills || !internshipSkills.length || !userSkills || !userSkills.length) {
      return Math.floor(Math.random() * (85 - 70 + 1)) + 70; // Random between 70-85
    }

    const commonSkills = internshipSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    const matchPercentage = (commonSkills.length / internshipSkills.length) * 100;
    return Math.min(98, Math.max(65, Math.round(matchPercentage)));
  };

  const formatStipend = (stipend) => {
    if (!stipend || !stipend.isPaid || stipend.amount === 0) {
      return "Unpaid";
    }

    const periodMap = {
      'month': 'month',
      'week': 'week',
      'lump-sum': 'total'
    };

    return `$${stipend.amount}/${periodMap[stipend.period] || 'month'}`;
  };

  const getCommonSkills = (internshipSkills, userSkills) => {
    if (!internshipSkills || !userSkills) return ["JavaScript", "React"];

    const common = internshipSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    return common.length > 0 ? common.slice(0, 3) : ["Communication", "Problem Solving"];
  };

  const getSkillsToLearn = (internshipSkills, userSkills) => {
    if (!internshipSkills || !userSkills) return ["TypeScript", "AWS"];

    const toLearn = internshipSkills.filter(skill =>
      !userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    return toLearn.length > 0 ? toLearn.slice(0, 3) : ["Advanced Concepts", "Industry Tools"];
  };

  const formatTimeline = (startDate, duration) => {
    if (!startDate) return "Flexible Start";

    const date = new Date(startDate);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${month} ${year}`;
  };

  const formatEligibility = (requirements) => {
    if (!requirements) return "Open to all";

    if (requirements.toLowerCase().includes("student")) return "Current Students";
    if (requirements.toLowerCase().includes("graduate")) return "Recent Graduates";
    if (requirements.toLowerCase().includes("experience")) return "With Experience";

    return "Check Requirements";
  };

  // Fetch internships from backend
  const fetchInternships = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/internships`);

      if (response.data.success) {
        const transformedInternships = response.data.data.map(internship => ({
          id: internship._id,
          title: internship.title,
          company: internship.companyName || "Tech Company",
          match: calculateMatch(internship.skills, userData.skills),
          duration: internship.duration,
          stipend: formatStipend(internship.stipend),
          salary: formatStipend(internship.stipend), // Alias for consistency
          skillsMatch: getCommonSkills(internship.skills, userData.skills),
          skillsToLearn: getSkillsToLearn(internship.skills, userData.skills),
          timeline: formatTimeline(internship.startDate, internship.duration),
          description: internship.description,
          location: internship.location,
          eligibility: formatEligibility(internship.requirements),
          experience: formatEligibility(internship.requirements),
          applicationDeadline: internship.applicationDeadline,
          type: internship.type,
          experienceLevel: internship.experienceLevel,
          department: internship.department,
          rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
          postedDate: new Date(internship.postedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        }));

        setInternships(transformedInternships);
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      // Fallback to mock internships
      setInternships([
        {
          id: 1,
          title: "Software Engineering Intern",
          company: "Google",
          match: 95,
          duration: "12 weeks",
          stipend: "$8k/month",
          skillsMatch: ["JavaScript", "React"],
          skillsToLearn: ["Angular", "Go"],
          timeline: "Summer 2024",
          description: "Work on real projects with mentorship from senior engineers",
          location: "Mountain View, CA",
          eligibility: "Current students",
          experience: "Beginner",
          rating: 4.9
        },
        {
          id: 2,
          title: "Frontend Intern",
          company: "Spotify",
          match: 88,
          duration: "16 weeks",
          stipend: "$7k/month",
          skillsMatch: ["React", "CSS", "JavaScript"],
          skillsToLearn: ["Redux", "Web Audio API"],
          timeline: "Fall 2024",
          description: "Build features for music streaming platform",
          location: "Remote",
          eligibility: "Recent graduates",
          experience: "Beginner",
          rating: 4.8
        },
        {
          id: 3,
          title: "Web Development Intern",
          company: "Adobe",
          match: 82,
          duration: "10 weeks",
          stipend: "$6.5k/month",
          skillsMatch: ["HTML", "CSS", "JavaScript"],
          skillsToLearn: ["Design Systems", "AEM"],
          timeline: "Summer 2024",
          description: "Develop creative tools and platforms",
          location: "San Jose, CA",
          eligibility: "Current students",
          experience: "Beginner",
          rating: 4.7
        },
      ]);
    }
  };
  const fetchCareerPaths = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/career-paths"
      );

      if (response.data.success) {
        const transformed = response.data.data.map((path) => ({
          id: path._id,
          title: path.title,
          company: path.category, // reuse UI field
          match: 85 + Math.floor(Math.random() * 10),
          description: path.description,
          skillsMatch: path.requiredSkills?.slice(0, 4) || [],
          skillsToLearn: path.recommendedSkills?.slice(0, 4) || [],
          timeline: path.duration || "6–12 months",
          experience: path.level || "Beginner",
          rating: 4.6,
          location: "Flexible",
        }));

        setCareerPaths(transformed);
      }
    } catch (error) {
      console.error("Error fetching career paths:", error);
    }
  };


  // Fetch courses (mock for now)
  const fetchCourses = async () => {
    try {
      // In future, you can replace this with real API call
      setCourses([
        {
          id: 1,
          title: "Advanced React Patterns",
          platform: "Frontend Masters",
          match: 94,
          duration: "12 hours",
          level: "Intermediate",
          skillsGained: ["React Hooks", "Performance", "Testing"],
          cost: "$39/month",
          rating: 4.9,
          description: "Master advanced React concepts and patterns used in production applications",
          certificate: true,
        },
        {
          id: 2,
          title: "Full Stack Open",
          platform: "University of Helsinki",
          match: 89,
          duration: "150 hours",
          level: "Intermediate",
          skillsGained: ["React", "Node.js", "MongoDB", "GraphQL"],
          cost: "Free",
          rating: 4.8,
          description: "Comprehensive full-stack development course with modern technologies",
          certificate: true,
        },
        {
          id: 3,
          title: "System Design Interview",
          platform: "Educative",
          match: 76,
          duration: "30 hours",
          level: "Advanced",
          skillsGained: ["System Architecture", "Scalability", "Design Patterns"],
          cost: "$79",
          rating: 4.7,
          description: "Prepare for senior level interviews with system design concepts",
          certificate: true,
        },
        {
          id: 4,
          title: "TypeScript Fundamentals",
          platform: "Pluralsight",
          match: 91,
          duration: "8 hours",
          level: "Beginner",
          skillsGained: ["TypeScript", "Type Safety", "Advanced Types"],
          cost: "$29/month",
          rating: 4.6,
          description: "Learn TypeScript from basics to advanced concepts",
          certificate: true,
        },
      ]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch jobs (mock for now)
  const fetchJobs = async () => {
    try {
      setJobs([
        {
          id: 1,
          title: "Senior Frontend Developer",
          company: "Google",
          match: 92,
          salary: "$140k - $180k",
          skillsMatch: ["React", "JavaScript", "TypeScript"],
          skillsToLearn: ["GraphQL", "AWS"],
          timeline: "3-6 months",
          description: "Lead frontend development for core products with a team of engineers",
          location: "Remote/Hybrid",
          experience: "5+ years",
          rating: 4.9
        },
        {
          id: 2,
          title: "Full Stack Developer",
          company: "Microsoft",
          match: 85,
          salary: "$120k - $160k",
          skillsMatch: ["React", "Node.js", "JavaScript"],
          skillsToLearn: ["Azure", "C#"],
          timeline: "2-4 months",
          description: "Build end-to-end features for enterprise solutions",
          location: "Seattle, WA",
          experience: "3+ years",
          rating: 4.8
        },
        {
          id: 3,
          title: "React Developer",
          company: "Meta",
          match: 88,
          salary: "$130k - $170k",
          skillsMatch: ["React", "JavaScript", "CSS"],
          skillsToLearn: ["React Native", "Next.js"],
          timeline: "1-3 months",
          description: "Create immersive user experiences for social platforms",
          location: "Remote",
          experience: "2+ years",
          rating: 4.7
        },
        {
          id: 4,
          title: "Frontend Tech Lead",
          company: "Amazon",
          match: 78,
          salary: "$160k - $220k",
          skillsMatch: ["React", "JavaScript", "Leadership"],
          skillsToLearn: ["System Design", "Microservices"],
          timeline: "6-12 months",
          description: "Lead frontend architecture and mentor junior developers",
          location: "New York, NY",
          experience: "7+ years",
          rating: 4.9
        },
      ]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  const openCareerModal = (career) => {
    setSelectedCareerPath(career);
    setIsModalOpen(true);
  };
  const getCareerSuggestions = async () => {
    if (!userData.skills || userData.skills.length === 0) {
      alert("Add skills to your profile to get AI suggestions");
      return;
    }

    try {
      setAiLoading(true);

      const res = await axios.post("${API_BASE}/api/career-suggest", {
        skills: userData.skills
      });

      // Take top 3 suggestions
      setAiResults(res.data.slice(0, 3));
      setShowAiModal(true);
    } catch (err) {
      console.error("Error fetching AI career suggestions:", err);
      alert("Failed to fetch suggestions. Try again later.");
    } finally {
      setAiLoading(false);
    }
  };


  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.warn("No token or userId found");
          // Use default data
          const defaultData = {
            name: "Alex Johnson",
            currentRole: "Frontend Developer",
            skills: ["JavaScript", "React", "HTML", "CSS", "Node.js", "Git"],
            experienceLevel: "Intermediate",
            goals: ["Senior Developer", "Tech Lead", "Full Stack Developer"],
          };

          setUserData(defaultData);

          // Update mock recommendations with default skills
          setMockRecommendations(prev => ({
            ...prev,
            skills: {
              ...prev.skills,
              current: defaultData.skills
            }
          }));

          // Fetch data
          await fetchInternships();
          await fetchCourses();
          await fetchJobs();
          await fetchCareerPaths();

          setLoading(false);
          return;
        }

        // Fetch profile data from backend
        const profileResponse = await axios.get(
          `http://localhost:5000/api/profile/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileResponse.data && profileResponse.data.data) {
          const profile = profileResponse.data.data;

          // Update userData with real profile data
          const updatedUserData = {
            name: profile.fullName || "User",
            currentRole: profile.experience?.[0]?.title || "Professional",
            skills: profile.skills || [],
            experienceLevel: "Intermediate",
            goals: ["Career Growth", "Skill Development", "Professional Advancement"],
          };

          setUserData(updatedUserData);

          // Update mock recommendations with real skills
          setMockRecommendations(prev => ({
            ...prev,
            skills: {
              ...prev.skills,
              current: profile.skills || []
            }
          }));

          // Fetch data
          await fetchInternships();
          await fetchCourses();
          await fetchJobs();
        }

        // Simulate AI loading
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error fetching profile:", error);

        // Fallback to mock data if API fails
        const defaultData = {
          name: "Alex Johnson",
          currentRole: "Frontend Developer",
          skills: ["JavaScript", "React", "HTML", "CSS", "Node.js", "Git"],
          experienceLevel: "Intermediate",
          goals: ["Senior Developer", "Tech Lead", "Full Stack Developer"],
        };

        setUserData(defaultData);

        // Update mock recommendations with default skills
        setMockRecommendations(prev => ({
          ...prev,
          skills: {
            ...prev.skills,
            current: defaultData.skills
          }
        }));

        // Fetch data with fallback
        await fetchInternships();
        await fetchCourses();
        await fetchJobs();

        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = (item) => {
    alert(`Saved: ${item.title} at ${item.company || item.platform}`);
    // In production, you would call API to save to user's saved items
  };

  const handleApply = (item) => {
    if (selectedCategory === "internships") {
      alert(`Applying to: ${item.title} at ${item.company}`);
      // In production: navigate to application page or open modal
      // navigate(`/apply/internship/${item.id}`);
    } else if (selectedCategory === "courses") {
      alert(`Enrolling in: ${item.title} on ${item.platform}`);
      // In production: redirect to course platform
    } else {
      alert(`Applying to: ${item.title} at ${item.company}`);
      // In production: navigate to job application
    }
  };

  const categories = [
    { id: "internships", label: "Internships", icon: "🎓", count: internships.length },
    { id: "courses", label: "Courses", icon: "📚", count: courses.length },
    { id: "career-paths", label: "Career Paths", icon: "🧭", count: careerPaths.length },
  ];

  const skillFilters = ["React", "JavaScript", "Node.js", "TypeScript", "Remote", "High Salary"];

  // Get recommendations based on selected category
  // const getRecommendations = () => {
  //   if (selectedCategory === "internships") {
  //     return internships;
  //   } else if (selectedCategory === "courses") {
  //     return courses;
  //   } else if (selectedCategory === "jobs") {
  //     return jobs;
  //   }
  //   return [];
  // };
  // const getRecommendations = () => {
  //   if (selectedCategory === "internships") return internships;
  //   if (selectedCategory === "courses") return courses;
  //   if (selectedCategory === "career-paths") return careerPaths;
  //   return [];
  // };
  const getRecommendations = () => {
  if (showAiModal && selectedCategory === "career-paths") {
    return getAiCareerCards();
  }

  if (selectedCategory === "internships") return internships;
  if (selectedCategory === "courses") return courses;
  if (selectedCategory === "career-paths") return careerPaths;

  return [];
};

  const getAiCareerCards = () => {
  return aiResults.map((career, index) => ({
    id: `ai-${index}`,
    title: career.title,
    company: "AI Recommended",
    match: career.match,
    description: career.reason,
    skillsMatch: userData.skills.slice(0, 3),
    skillsToLearn: career.missingSkills,
    timeline: "6–12 months",
    experience: userData.experienceLevel,
    rating: 4.8,
    location: "Flexible",
  }));
};


  // Filter recommendations based on active filters
  const getFilteredRecommendations = () => {
    let filtered = getRecommendations();

    if (activeFilters.length > 0) {
      filtered = filtered.filter(item => {
        return activeFilters.some(filter => {
          const filterLower = filter.toLowerCase();

          // Check skills
          if (item.skillsMatch) {
            const hasSkill = item.skillsMatch.some(skill =>
              skill.toLowerCase().includes(filterLower)
            );
            if (hasSkill) return true;
          }

          // Check title and company
          if (item.title.toLowerCase().includes(filterLower) ||
            (item.company && item.company.toLowerCase().includes(filterLower))) {
            return true;
          }

          // Check location for remote filter
          if (filter === "Remote" && item.location &&
            item.location.toLowerCase().includes("remote")) {
            return true;
          }

          // Check for high salary
          if (filter === "High Salary") {
            if (item.stipend && item.stipend !== "Unpaid") {
              const amount = parseFloat(item.stipend.replace(/[^0-9.]/g, ''));
              if (amount > 5000) return true;
            }
            if (item.salary && item.salary !== "Unpaid") {
              const amountMatch = item.salary.match(/\$(\d+)k/);
              if (amountMatch && parseInt(amountMatch[1]) > 100) return true;
            }
          }

          return false;
        });
      });
    }

    return filtered;
  };

  const toggleFilter = (filter) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-8px)";
      e.currentTarget.style.boxShadow = "0 20px 40px rgba(102, 126, 234, 0.15)";
    } else {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.05)";
    }
  };

  const handleButtonHover = (e, isHover, isPrimary) => {
    if (isPrimary) {
      e.currentTarget.style.transform = isHover ? "translateY(-2px)" : "translateY(0)";
      e.currentTarget.style.boxShadow = isHover ? "0 8px 20px rgba(102, 126, 234, 0.3)" : "none";
    } else {
      e.currentTarget.style.background = isHover ? "#e2e8f0" : "#f1f5f9";
    }
  };

  const filteredRecommendations = getFilteredRecommendations();

  // CSS Styles (same as before)
  const styles = {
    container: {
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      background: "#f8fafc",
      minHeight: "100vh",
      padding: "2rem",
      maxWidth: "1400px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "2rem",
    },
    title: {
      fontSize: "clamp(2rem, 4vw, 3rem)",
      fontWeight: 800,
      color: "#2d3748",
      marginBottom: "0.5rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    subtitle: {
      fontSize: "1.125rem",
      color: "#718096",
      marginBottom: "2rem",
    },
    aiBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: 600,
      marginBottom: "1rem",
    },
    profileSection: {
      background: "white",
      padding: "2rem",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      marginBottom: "2rem",
    },
    profileHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    profileInfo: {
      flex: 1,
    },
    userName: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "0.5rem",
    },
    userRole: {
      fontSize: "1.125rem",
      color: "#718096",
      marginBottom: "1rem",
    },
    skillTags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginTop: "1rem",
    },
    skillTag: {
      background: "#e0e7ff",
      color: "#3730a3",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    aiAnalysis: {
      background: "#f0f9ff",
      padding: "1.5rem",
      borderRadius: "16px",
      borderLeft: "4px solid #3b82f6",
    },
    analysisTitle: {
      fontWeight: 600,
      color: "#1e40af",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    analysisText: {
      color: "#374151",
      lineHeight: 1.6,
    },
    controlsSection: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      marginBottom: "2rem",
    },
    tabs: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "2rem",
      flexWrap: "wrap",
    },
    tab: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "1rem 1.5rem",
      background: "none",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 500,
      color: "#718096",
      transition: "all 0.3s ease",
      flex: 1,
      minWidth: "200px",
      justifyContent: "center",
    },
    activeTab: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    },
    filters: {
      display: "flex",
      gap: "1.5rem",
      flexWrap: "wrap",
      marginBottom: "1.5rem",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    filterLabel: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#4a5568",
    },
    select: {
      padding: "0.75rem 1rem",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      background: "white",
      fontSize: "0.95rem",
      color: "#2d3748",
      minWidth: "200px",
      cursor: "pointer",
    },
    skillFilters: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginTop: "1rem",
    },
    skillFilter: {
      padding: "0.5rem 1rem",
      background: "#f1f5f9",
      border: "none",
      borderRadius: "20px",
      fontSize: "0.875rem",
      color: "#64748b",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    activeSkillFilter: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
    },
    recommendationsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: "1.5rem",
      marginBottom: "3rem",
    },
    recommendationCard: {
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      position: "relative",
    },
    matchBadge: {
      position: "absolute",
      top: "1rem",
      right: "1rem",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: 600,
      zIndex: 2,
    },
    cardContent: {
      padding: "1.5rem",
    },
    cardHeader: {
      marginBottom: "1rem",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "0.5rem",
    },
    cardSubtitle: {
      fontSize: "1rem",
      color: "#667eea",
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
    cardDescription: {
      fontSize: "0.875rem",
      color: "#718096",
      marginBottom: "1rem",
      lineHeight: 1.6,
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    detailItem: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    detailLabel: {
      fontSize: "0.75rem",
      color: "#94a3b8",
      fontWeight: 500,
    },
    detailValue: {
      fontSize: "0.95rem",
      color: "#2d3748",
      fontWeight: 600,
    },
    skillsSection: {
      marginBottom: "1.5rem",
    },
    skillsTitle: {
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#4a5568",
      marginBottom: "0.5rem",
    },
    skillMatchTags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
    },
    skillMatchTag: {
      background: "#d1fae5",
      color: "#065f46",
      padding: "0.375rem 0.75rem",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    skillLearnTag: {
      background: "#fef3c7",
      color: "#92400e",
      padding: "0.375rem 0.75rem",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: 500,
    },
    cardActions: {
      display: "flex",
      gap: "0.75rem",
    },
    primaryButton: {
      flex: 2,
      padding: "0.75rem 1rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    secondaryButton: {
      flex: 1,
      padding: "0.75rem 1rem",
      background: "#f1f5f9",
      color: "#4a5568",
      border: "none",
      borderRadius: "10px",
      fontSize: "0.95rem",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    roadmapSection: {
      background: "white",
      padding: "2rem",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      marginBottom: "3rem",
    },
    roadmapHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    roadmapTitle: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#2d3748",
    },
    roadmapTabs: {
      display: "flex",
      gap: "0.5rem",
      background: "#f1f5f9",
      padding: "0.25rem",
      borderRadius: "10px",
    },
    roadmapTab: {
      padding: "0.5rem 1rem",
      background: "none",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#64748b",
      transition: "all 0.2s ease",
    },
    activeRoadmapTab: {
      background: "white",
      color: "#667eea",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    roadmapSteps: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    roadmapStep: {
      display: "flex",
      gap: "1.5rem",
      padding: "1.5rem",
      background: "#f8fafc",
      borderRadius: "12px",
      borderLeft: "4px solid #667eea",
    },
    stepMonth: {
      minWidth: "120px",
      fontWeight: 700,
      color: "#667eea",
      fontSize: "1rem",
    },
    stepContent: {
      flex: 1,
    },
    stepGoal: {
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "0.5rem",
      fontSize: "1.125rem",
    },
    stepActivities: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    stepActivity: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.5rem",
      color: "#4a5568",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      gap: "1rem",
    },
    loadingSpinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #f3f3f3",
      borderTop: "5px solid #667eea",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      color: "#718096",
      fontSize: "1rem",
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
    aiThinking: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      color: "#667eea",
      fontSize: "0.875rem",
      marginBottom: "1rem",
    },
  };

  const styleTag = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .recommendation-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
    }
    
    .primary-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .secondary-button:hover {
      background: #e2e8f0;
    }
    
    .tab:hover:not(.active) {
      background: #f1f5f9;
    }
    
    .skill-filter:hover {
      background: #e2e8f0;
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleTag}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>🤖 AI is analyzing your profile...</div>
          <div style={styles.aiThinking}>
            <span>Matching skills with opportunities</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styleTag}</style>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>AI Career Path</h1>
        <p style={styles.subtitle}>
          Personalized recommendations for {userData.name}
        </p>
        <div style={styles.aiBadge}>
          🤖 Powered by CareerSync AI
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={getCareerSuggestions}
            style={{
              padding: "0.5rem 1rem",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {aiLoading ? "Analyzing..." : "Get AI Career Suggestions"}
          </button>
        </div>

      </div>

      {/* Profile Section */}
      <div style={styles.profileSection}>
        <div style={styles.profileHeader}>
          <div style={styles.profileInfo}>
            <h2 style={styles.userName}>{userData.name}</h2>
            <p style={styles.userRole}>
              {userData.currentRole} • {userData.experienceLevel}
              {userData.skills.length > 0 && ` • ${userData.skills.length} skills`}
            </p>
            <div style={styles.skillTags}>
              {userData.skills.slice(0, 6).map((skill, index) => (
                <span key={index} style={styles.skillTag}>{skill}</span>
              ))}
              {userData.skills.length > 6 && (
                <span style={styles.skillTag}>+{userData.skills.length - 6} more</span>
              )}
              {userData.skills.length === 0 && (
                <span style={{ ...styles.skillTag, background: "#f1f5f9", color: "#64748b" }}>
                  Add skills in your profile
                </span>
              )}
            </div>
          </div>
          <div style={{ width: "300px" }}>
            <div style={styles.aiAnalysis}>
              <h3 style={styles.analysisTitle}>🎯 AI Analysis</h3>
              <p style={styles.analysisText}>
                {userData.skills.length > 0 ? (
                  <>
                    Based on your skills in <strong>{userData.skills.slice(0, 3).join(", ")}</strong>,
                    the AI recommends focusing on <strong>TypeScript</strong> and <strong>Next.js</strong>
                    to advance your career as a {userData.currentRole}.
                  </>
                ) : (
                  <>
                    Complete your profile by adding your skills and experience to get
                    personalized career recommendations tailored to your background.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Career Goals */}
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontWeight: 600, color: "#2d3748", marginBottom: "1rem" }}>🎯 Career Goals</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {userData.goals.map((goal, index) => (
              <div key={index} style={{
                padding: "1rem 1.5rem",
                background: index === 0 ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f1f5f9",
                color: index === 0 ? "white" : "#4a5568",
                borderRadius: "12px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                {index === 0 ? "🎯" : "⭐"} {goal}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div style={styles.controlsSection}>
        {/* Category Tabs */}
        <div style={styles.tabs}>
          {categories.map((category) => (
            <button
              key={category.id}
              style={{
                ...styles.tab,
                ...(selectedCategory === category.id && styles.activeTab),
              }}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "active" : ""}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
              <span style={{
                background: selectedCategory === category.id ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                color: selectedCategory === category.id ? "white" : "#64748b",
                padding: "0.25rem 0.75rem",
                borderRadius: "12px",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={{ flex: 1 }}>
            <label style={styles.filterLabel}>Filter by Skills & Preferences</label>
            <div style={styles.skillFilters}>
              {skillFilters.map((filter) => (
                <button
                  key={filter}
                  style={{
                    ...styles.skillFilter,
                    ...(activeFilters.includes(filter) && styles.activeSkillFilter),
                  }}
                  onClick={() => toggleFilter(filter)}
                  className="skill-filter"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div style={styles.recommendationsGrid}>
        {filteredRecommendations.length > 0 ? (
          filteredRecommendations.map((item) => (
            <div
              key={item.id}
              style={styles.recommendationCard}
              onClick={() => {
                if (selectedCategory === "career-paths") {
                  openCareerModal(item);
                }
              }}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
              className="recommendation-card"
            >
              <div style={styles.matchBadge}>
                {item.match}% Match
              </div>

              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{item.title}</h3>
                  <p style={styles.cardSubtitle}>
                    {item.company || item.platform}
                    {item.rating && ` • ⭐ ${item.rating.toFixed(1)}/5`}
                  </p>
                  {item.description && (
                    <p style={styles.cardDescription}>{item.description}</p>
                  )}
                </div>

                <div style={styles.detailsGrid}>
                  {selectedCategory === "courses" ? (
                    <>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Duration</span>
                        <span style={styles.detailValue}>{item.duration}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Level</span>
                        <span style={styles.detailValue}>{item.level}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Cost</span>
                        <span style={styles.detailValue}>{item.cost}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Certificate</span>
                        <span style={styles.detailValue}>{item.certificate ? "✅ Yes" : "❌ No"}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>
                          {selectedCategory === "internships" ? "Stipend" : "Salary"}
                        </span>
                        <span style={styles.detailValue}>{item.salary || item.stipend}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Location</span>
                        <span style={styles.detailValue}>{item.location}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Timeline</span>
                        <span style={styles.detailValue}>{item.timeline}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Experience</span>
                        <span style={styles.detailValue}>{item.experience || item.eligibility}</span>
                      </div>
                    </>
                  )}
                </div>

                <div style={styles.skillsSection}>
                  <div style={styles.skillsTitle}>🎯 Skills Match</div>
                  <div style={styles.skillMatchTags}>
                    {item.skillsMatch?.map((skill, index) => (
                      <span key={index} style={styles.skillMatchTag}>{skill}</span>
                    ))}
                  </div>
                </div>

                {item.skillsToLearn && (
                  <div style={styles.skillsSection}>
                    <div style={styles.skillsTitle}>📚 Skills to Learn</div>
                    <div style={styles.skillMatchTags}>
                      {item.skillsToLearn.map((skill, index) => (
                        <span key={index} style={styles.skillLearnTag}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={styles.cardActions}>
                  <button
                    style={styles.primaryButton}
                    onClick={() => handleApply(item)}
                    onMouseEnter={(e) => handleButtonHover(e, true, true)}
                    onMouseLeave={(e) => handleButtonHover(e, false, true)}
                    className="primary-button"
                  >
                    {selectedCategory === "courses" ? "Enroll Now" : "Apply Now"}
                  </button>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => handleSave(item)}
                    onMouseEnter={(e) => handleButtonHover(e, true, false)}
                    onMouseLeave={(e) => handleButtonHover(e, false, false)}
                    className="secondary-button"
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: "1 / -1",
            textAlign: "center",
            padding: "4rem",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}>
            <div style={{ fontSize: "3remS", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ color: "#2d3748", marginBottom: "0.5rem" }}>
              No {selectedCategory} found
            </h3>
            <p style={{ color: "#718096" }}>
              Try adjusting your filters or check back later for new opportunities.
            </p>
          </div>
        )}
      </div>

      {/* Skill Recommendations */}
      <div style={{
        ...styles.roadmapSection,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}>
        <h2 style={{ ...styles.roadmapTitle, color: "white", marginBottom: "1.5rem" }}>
          🔧 Recommended Skills Development
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
          {mockRecommendations.skills.recommended.map((skill, index) => (
            <div key={index} style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1.5rem",
              borderRadius: "12px",
              borderLeft: `4px solid ${skill.priority === "high" ? "#ef4444" :
                skill.priority === "medium" ? "#f59e0b" : "#10b981"
                }`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h4 style={{ fontWeight: 600, fontSize: "1.125rem" }}>{skill.skill}</h4>
                <span style={{
                  padding: "0.25rem 0.75rem",
                  background: skill.priority === "high" ? "#ef4444" :
                    skill.priority === "medium" ? "#f59e0b" : "#10b981",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}>
                  {skill.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <p style={{ opacity: 0.9, fontSize: "0.875rem" }}>{skill.reason}</p>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedCareerPath && (
          <div style={{ padding: "1.5rem" }}>
            <h2 style={{ marginBottom: "0.75rem" }}>
              {selectedCareerPath.title}
            </h2>

            <p style={{ marginBottom: "1rem", color: "#64748b" }}>
              {selectedCareerPath.description}
            </p>

            <h4>🎯 Skills Required</h4>
            <ul>
              {selectedCareerPath.skillsMatch?.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>

            <h4 style={{ marginTop: "1rem" }}>📚 Skills to Learn</h4>
            <ul>
              {selectedCareerPath.skillsToLearn?.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
      {/* AI Suggestions Modal */}
      {/* {showAiModal && (
        <Modal onClose={() => setShowAiModal(false)}>
          <h2>Top Career Matches</h2>
          {aiResults.map((career) => (
            <div key={career._id} style={{ marginBottom: "1rem" }}>
              <h3>{career.name}</h3>
              <p><strong>Matched Skills:</strong> {career.matchedSkills.join(", ")}</p>
              <p><strong>Missing Skills:</strong> {career.missingSkills.join(", ")}</p>
              <p><strong>Score:</strong> {career.matchScore}</p>
            </div>
          ))}
        </Modal>
      )} */}
      {/* AI Suggestions Modal */}
      {showAiModal && (
        <Modal onClose={() => setShowAiModal(false)}>
          <h2 style={{ marginBottom: "1rem", color: "#2d3748" }}>Top Career Suggestions</h2>
          {aiResults.length > 0 ? (
            aiResults.map((career, index) => (
              <div key={index} style={{
                padding: "1rem",
                borderBottom: index !== aiResults.length - 1 ? "1px solid #e2e8f0" : "none"
              }}>
                <h3 style={{ fontWeight: 600, color: "#667eea" }}>{career.title}</h3>
                {career.company && <p><strong>Company:</strong> {career.company}</p>}
                {career.skillsMatch && (
                  <p>
                    <strong>Matched Skills:</strong> {career.skillsMatch.join(", ")}
                  </p>
                )}
                {career.skillsToLearn && (
                  <p>
                    <strong>Skills to Learn:</strong> {career.skillsToLearn.join(", ")}
                  </p>
                )}
                {career.matchScore && (
                  <p><strong>Match Score:</strong> {career.matchScore}%</p>
                )}
              </div>
            ))
          ) : (
            <p>No AI suggestions available yet.</p>
          )}
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <button
              onClick={() => setShowAiModal(false)}
              style={{
                padding: "0.5rem 1rem",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CareerPaths;