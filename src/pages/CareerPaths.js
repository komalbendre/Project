import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";

const CareerPaths = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("internships");
  const [activeFilters, setActiveFilters] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [aiResults, setAiResults] = useState([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    location: "",
    experienceLevel: "",
    stipendType: "all",
    jobType: "",
    searchTerm: ""
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false
  });

  // State for real user data
  const [userData, setUserData] = useState({
    name: "",
    currentRole: "",
    skills: [],
    experienceLevel: "",
    email: "",
    phone: "",
  });

  // State for dynamic data from backend
  const [internships, setInternships] = useState([]);
  const [courses, setCourses] = useState([]);

  // State for selected item details
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Keep only the skills recommendations mock data
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
    }
  });

  // Helper functions for data transformation
  const calculateMatch = (internshipSkills, userSkills) => {
    if (!internshipSkills || !internshipSkills.length || !userSkills || !userSkills.length) {
      return Math.floor(Math.random() * (85 - 70 + 1)) + 70;
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

  // Fetch internships from backend with pagination
  const fetchInternships = async (page = pagination.currentPage) => {
    try {
      setFetchError("");

      // Build query params based on active filters
      const params = new URLSearchParams();

      // Add pagination
      params.append('page', page);
      params.append('limit', pagination.itemsPerPage);

      // Search term
      if (filterOptions.searchTerm) {
        params.append('search', filterOptions.searchTerm);
      }

      // Location filter
      if (filterOptions.location) {
        params.append('location', filterOptions.location);
      }

      // Experience level filter
      if (filterOptions.experienceLevel) {
        params.append('experienceLevel', filterOptions.experienceLevel);
      }

      // Type filter (remote/hybrid/onsite)
      if (activeFilters.includes('Remote')) {
        params.append('type', 'remote');
      } else if (activeFilters.includes('Hybrid')) {
        params.append('type', 'hybrid');
      } else if (activeFilters.includes('Onsite')) {
        params.append('type', 'onsite');
      }

      // Department/Skills filter - pass as search
      const skillFilters = activeFilters.filter(f =>
        ['React', 'JavaScript', 'Node.js', 'TypeScript', 'Python', 'Java'].includes(f)
      );
      if (skillFilters.length > 0) {
        if (params.has('search')) {
          params.set('search', `${params.get('search')} ${skillFilters.join(' ')}`);
        } else {
          params.append('search', skillFilters.join(' '));
        }
      }

      const response = await axios.get(`http://localhost:5000/api/internships?${params.toString()}`);

      if (response.data.success) {
        // Filter paid/unpaid on frontend
        let filteredData = response.data.data;

        if (filterOptions.stipendType === "paid") {
          filteredData = filteredData.filter(internship =>
            internship.stipend && internship.stipend.isPaid === true
          );
        } else if (filterOptions.stipendType === "unpaid") {
          filteredData = filteredData.filter(internship =>
            !internship.stipend || !internship.stipend.isPaid || internship.stipend.amount === 0
          );
        }

        const transformedInternships = filteredData.map(internship => ({
          id: internship._id,
          title: internship.title,
          company: internship.companyName || "Tech Company",
          match: calculateMatch(internship.skills, userData.skills),
          duration: internship.duration,
          stipend: formatStipend(internship.stipend),
          salary: formatStipend(internship.stipend),
          timeline: formatTimeline(internship.startDate, internship.duration),
          description: internship.description,
          location: internship.location,
          eligibility: formatEligibility(internship.requirements),
          experience: internship.experienceLevel || formatEligibility(internship.requirements),
          applicationDeadline: internship.applicationDeadline,
          type: internship.type,
          experienceLevel: internship.experienceLevel,
          department: internship.department,
          postedDate: new Date(internship.postedDate || internship.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          }),
          requirements: internship.requirements,
          responsibilities: internship.responsibilities,
          benefits: internship.benefits,
          applicationProcess: internship.applicationProcess,
          skills: internship.skills || [],
          contactEmail: internship.contactEmail,
          contactPhone: internship.contactPhone,
          positions: internship.positions
        }));

        setInternships(transformedInternships);
        
        // Update pagination info from response headers or data
        if (response.data.pagination) {
          setPagination({
            currentPage: response.data.pagination.currentPage || page,
            totalPages: response.data.pagination.totalPages || 1,
            totalItems: response.data.pagination.totalItems || transformedInternships.length,
            itemsPerPage: pagination.itemsPerPage,
            hasNextPage: response.data.pagination.hasNextPage || false,
            hasPrevPage: response.data.pagination.hasPrevPage || false
          });
        } else {
          // If no pagination info from backend, set based on data length
          setPagination(prev => ({
            ...prev,
            currentPage: page,
            totalPages: Math.ceil(transformedInternships.length / prev.itemsPerPage) || 1,
            totalItems: transformedInternships.length,
            hasNextPage: transformedInternships.length === prev.itemsPerPage,
            hasPrevPage: page > 1
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      setInternships([]);
      setFetchError("Failed to load internships. Please try again later.");
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
          company: path.category,
          match: 85 + Math.floor(Math.random() * 10),
          description: path.description,
          skillsMatch: path.requiredSkills?.slice(0, 4) || [],
          skillsToLearn: path.recommendedSkills?.slice(0, 4) || [],
          timeline: path.duration || "6–12 months",
          experience: path.level || "Beginner",
          location: "Flexible",
        }));

        setCareerPaths(transformed);
      }
    } catch (error) {
      console.error("Error fetching career paths:", error);
    }
  };

  // Keep courses as mock data (as requested)
  const fetchCourses = async () => {
    try {
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
          description: "Learn TypeScript from basics to advanced concepts",
          certificate: true,
        },
      ]);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const openCareerModal = (career) => {
    setSelectedCareerPath(career);
    setIsModalOpen(true);
  };

  const openDetailsModal = (item) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedItem(null);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      const nextPage = pagination.currentPage + 1;
      setPagination(prev => ({ ...prev, currentPage: nextPage }));
      fetchInternships(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      const prevPage = pagination.currentPage - 1;
      setPagination(prev => ({ ...prev, currentPage: prevPage }));
      fetchInternships(prevPage);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchInternships(page);
  };

  const getCareerSuggestions = async () => {
    // Check if user has skills
    const hasSkills = userData.skills && userData.skills.length > 0;

    if (!hasSkills) {
      alert("Please add skills to your profile to get AI-powered career suggestions");
      return;
    }

    try {
      setAiLoading(true);
      setFetchError("");

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in to get AI career suggestions");
        return;
      }

      // Call the AI endpoint
      const response = await axios.post(
        "http://localhost:5000/api/ai/career-suggestions",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Full API Response:", response.data);

      if (response.data.success) {
        const aiData = response.data.data;
        console.log("AI Data received:", aiData);
        
        setAiResults(aiData);
        setShowAiModal(true);
      } else {
        throw new Error(response.data.message || "Failed to get suggestions");
      }

    } catch (err) {
      console.error("Error fetching AI career suggestions:", err);
      alert("Failed to get AI suggestions. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔥 aiResults changed:", aiResults);
    console.log("🔥 aiResults length:", aiResults?.length);
    console.log("🔥 First result if exists:", aiResults?.[0]);
  }, [aiResults]);

  useEffect(() => {
    console.log("🔴 showAiModal changed to:", showAiModal);
  }, [showAiModal]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          console.warn("No token or userId found");
          const defaultData = {
            name: "Alex Johnson",
            currentRole: "Frontend Developer",
            skills: ["JavaScript", "React", "HTML", "CSS", "Node.js", "Git"],
            experienceLevel: "Intermediate",
            email: "alex.johnson@example.com",
            phone: "+1 (555) 123-4567"
          };

          setUserData(defaultData);
          setMockRecommendations(prev => ({
            ...prev,
            skills: { ...prev.skills, current: defaultData.skills }
          }));

          await fetchInternships(1);
          await fetchCourses();
          await fetchCareerPaths();
          setLoading(false);
          return;
        }

        const profileResponse = await axios.get(
          `http://localhost:5000/api/profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (profileResponse.data && profileResponse.data.data) {
          const profile = profileResponse.data.data;
          const updatedUserData = {
            name: profile.fullName || "User",
            currentRole: profile.experience?.[0]?.title || "Professional",
            skills: profile.technicalSkills || [],
            experienceLevel: "Intermediate",
            email: profile.email || "",
            phone: profile.phone || ""
          };

          setUserData(updatedUserData);
          setMockRecommendations(prev => ({
            ...prev,
            skills: { ...prev.skills, current: profile.technicalSkills || [] }
          }));

          await fetchInternships(1);
          await fetchCourses();
          await fetchCareerPaths();
        }

        setTimeout(() => setLoading(false), 1500);
      } catch (error) {
        console.error("Error fetching profile:", error);
        const defaultData = {
          name: "Alex Johnson",
          currentRole: "Frontend Developer",
          skills: ["JavaScript", "React", "HTML", "CSS", "Node.js", "Git"],
          experienceLevel: "Intermediate",
          email: "alex.johnson@example.com",
          phone: "+1 (555) 123-4567"
        };

        setUserData(defaultData);
        setMockRecommendations(prev => ({
          ...prev,
          skills: { ...prev.skills, current: defaultData.skills }
        }));

        await fetchInternships(1);
        await fetchCourses();
        await fetchCareerPaths();
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchUserProfile();
  }, []);

  // Refetch internships when filters change
  useEffect(() => {
    if (selectedCategory === "internships" && !loading) {
      fetchInternships(1); // Reset to first page when filters change
    }
  }, [
    filterOptions.searchTerm,
    filterOptions.location,
    filterOptions.experienceLevel,
    filterOptions.stipendType,
    activeFilters,
    selectedCategory,
    userData.skills
  ]);

  const handleSave = (item) => {
    alert(`Saved: ${item.title} at ${item.company || item.platform}`);
    closeDetailsModal();
  };

  const handleApply = (item) => {
    closeDetailsModal();
    navigate(`/apply/${item.id}`);
  };

  const categories = [
    { id: "internships", label: "Internships", count: internships.length },
    { id: "courses", label: "Courses", count: courses.length },
  ];

  const skillFilters = [
    "React",
    "JavaScript",
    "Node.js",
    "TypeScript",
    "Python",
    "Java",
    "Remote",
    "Hybrid",
    "Onsite",
    "Paid",
    "High Salary",
    "Beginner",
    "Intermediate",
    "Advanced",
    "Full-time",
    "Part-time"
  ];

  const getRecommendations = () => {
    if (selectedCategory === "internships") return internships;
    if (selectedCategory === "courses") return courses;
    if (selectedCategory === "career-paths") return careerPaths;
    return [];
  };

  const getFilteredRecommendations = () => {
    let filtered = getRecommendations();

    if (selectedCategory === "internships") {
      if (activeFilters.length > 0) {
        filtered = filtered.filter(item => {
          return activeFilters.some(filter => {
            const filterLower = filter.toLowerCase();

            if (item.title.toLowerCase().includes(filterLower) ||
              (item.company && item.company.toLowerCase().includes(filterLower))) {
              return true;
            }

            if (filter === "Remote" && item.location &&
              item.location.toLowerCase().includes("remote")) {
              return true;
            }
            if (filter === "Hybrid" && item.location &&
              item.location.toLowerCase().includes("hybrid")) {
              return true;
            }
            if (filter === "Onsite" && item.location &&
              !item.location.toLowerCase().includes("remote") &&
              !item.location.toLowerCase().includes("hybrid")) {
              return true;
            }

            if (filter === "Paid") {
              return item.stipend && item.stipend !== "Unpaid";
            }
            if (filter === "High Salary") {
              if (item.stipend && item.stipend !== "Unpaid") {
                const amount = parseFloat(item.stipend.replace(/[^0-9.]/g, ''));
                if (amount > 5000) return true;
              }
            }

            if (filter === "Beginner" && item.experienceLevel === "Beginner") return true;
            if (filter === "Intermediate" && item.experienceLevel === "Intermediate") return true;
            if (filter === "Advanced" && item.experienceLevel === "Advanced") return true;

            return false;
          });
        });
      }

      if (filterOptions.experienceLevel) {
        filtered = filtered.filter(item =>
          item.experienceLevel === filterOptions.experienceLevel
        );
      }

      if (filterOptions.stipendType === "paid") {
        filtered = filtered.filter(item =>
          item.stipend && item.stipend !== "Unpaid"
        );
      } else if (filterOptions.stipendType === "unpaid") {
        filtered = filtered.filter(item =>
          item.stipend === "Unpaid"
        );
      }

      if (filterOptions.location) {
        filtered = filtered.filter(item =>
          item.location.toLowerCase().includes(filterOptions.location.toLowerCase())
        );
      }

      if (filterOptions.searchTerm) {
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
          item.company.toLowerCase().includes(filterOptions.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(filterOptions.searchTerm.toLowerCase())
        );
      }
    } else {
      if (activeFilters.length > 0) {
        filtered = filtered.filter(item => {
          return activeFilters.some(filter => {
            const filterLower = filter.toLowerCase();
            if (item.skillsMatch) {
              const hasSkill = item.skillsMatch.some(skill =>
                skill.toLowerCase().includes(filterLower)
              );
              if (hasSkill) return true;
            }
            if (item.title.toLowerCase().includes(filterLower) ||
              (item.company && item.company.toLowerCase().includes(filterLower))) {
              return true;
            }
            return false;
          });
        });
      }
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
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 24px rgba(102, 126, 234, 0.12)";
    } else {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
    }
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.background = "linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)";
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.25)";
    } else {
      e.currentTarget.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }
  };

  const filteredRecommendations = getFilteredRecommendations();

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
    mainSection: {
      background: "white",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      marginBottom: "2rem",
      overflow: "hidden",
    },
    controlsSection: {
      background: "white",
      padding: "1.5rem",
      borderBottom: "1px solid #edf2f7",
    },
    tabs: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
    },
    tab: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      padding: "0.875rem 1.25rem",
      background: "none",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: 500,
      color: "#718096",
      transition: "all 0.3s ease",
      flex: 1,
      minWidth: "180px",
      justifyContent: "center",
    },
    activeTab: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.25)",
    },
    filters: {
      display: "flex",
      gap: "1.5rem",
      flexWrap: "wrap",
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
      padding: "0.625rem 1rem",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      background: "white",
      fontSize: "0.9rem",
      color: "#2d3748",
      minWidth: "180px",
      cursor: "pointer",
    },
    skillFilters: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginTop: "0.75rem",
    },
    skillFilter: {
      padding: "0.375rem 0.875rem",
      background: "#f1f5f9",
      border: "none",
      borderRadius: "16px",
      fontSize: "0.8125rem",
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
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1.25rem",
      padding: "1.5rem",
    },
    recommendationCard: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
      overflow: "hidden",
      transition: "all 0.25s ease",
      position: "relative",
      border: "1px solid #edf2f7",
      display: "flex",
      flexDirection: "column",
    },
    matchBadge: {
      position: "absolute",
      top: "0.75rem",
      right: "0.75rem",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      padding: "0.25rem 0.75rem",
      borderRadius: "16px",
      fontSize: "0.75rem",
      fontWeight: 600,
      zIndex: 2,
    },
    cardContent: {
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    cardHeader: {
      marginBottom: "0.75rem",
    },
    cardTitle: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "0.25rem",
      lineHeight: 1.3,
    },
    cardSubtitle: {
      fontSize: "0.875rem",
      color: "#667eea",
      fontWeight: 500,
    },
    cardDescription: {
      fontSize: "0.8125rem",
      color: "#718096",
      marginBottom: "0.75rem",
      lineHeight: 1.5,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "0.75rem",
      marginBottom: "1rem",
    },
    detailItem: {
      display: "flex",
      flexDirection: "column",
      gap: "0.125rem",
    },
    detailLabel: {
      fontSize: "0.6875rem",
      color: "#94a3b8",
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    detailValue: {
      fontSize: "0.875rem",
      color: "#2d3748",
      fontWeight: 600,
    },
    cardActions: {
      marginTop: "auto",
      paddingTop: "0.75rem",
    },
    viewButton: {
      width: "100%",
      padding: "0.625rem 1rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.875rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    // Pagination styles
    paginationContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      padding: "1.5rem",
      borderTop: "1px solid #edf2f7",
    },
    paginationButton: {
      padding: "0.5rem 1rem",
      background: "#f1f5f9",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.875rem",
      color: "#4a5568",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontWeight: 500,
    },
    paginationButtonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    paginationInfo: {
      fontSize: "0.875rem",
      color: "#4a5568",
      fontWeight: 500,
    },
    paginationPages: {
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
    },
    paginationPageButton: {
      padding: "0.5rem 0.75rem",
      background: "#f1f5f9",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.875rem",
      color: "#4a5568",
      cursor: "pointer",
      transition: "all 0.2s ease",
      minWidth: "36px",
    },
    paginationActivePage: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
    },
    roadmapSection: {
      background: "white",
      padding: "2rem",
      borderRadius: "20px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      marginBottom: "3rem",
    },
    roadmapTitle: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "#2d3748",
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
    // Modal styles
    modalContent: {
      padding: "2rem",
      maxWidth: "700px",
      width: "100%",
    },
    modalTitle: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "#2d3748",
      marginBottom: "0.5rem",
    },
    modalSubtitle: {
      fontSize: "1.125rem",
      color: "#667eea",
      fontWeight: 600,
      marginBottom: "1.5rem",
    },
    modalSection: {
      marginBottom: "1.5rem",
    },
    modalSectionTitle: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "#2d3748",
      marginBottom: "0.75rem",
      borderBottom: "2px solid #e2e8f0",
      paddingBottom: "0.5rem",
    },
    modalGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
      marginBottom: "1rem",
    },
    modalDetailItem: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    modalDetailLabel: {
      fontSize: "0.75rem",
      color: "#94a3b8",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    modalDetailValue: {
      fontSize: "1rem",
      color: "#2d3748",
      fontWeight: 500,
    },
    modalDescription: {
      fontSize: "0.95rem",
      color: "#4a5568",
      lineHeight: 1.6,
      marginBottom: "1rem",
    },
    modalSkillsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      marginTop: "0.5rem",
    },
    modalSkillTag: {
      background: "#e0e7ff",
      color: "#3730a3",
      padding: "0.375rem 0.875rem",
      borderRadius: "20px",
      fontSize: "0.8125rem",
      fontWeight: 500,
    },
    modalActions: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
      justifyContent: "flex-end",
    },
    modalPrimaryButton: {
      padding: "0.75rem 1.5rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    modalSecondaryButton: {
      padding: "0.75rem 1.5rem",
      background: "#f1f5f9",
      color: "#4a5568",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    modalCloseButton: {
      padding: "0.75rem 1.5rem",
      background: "#f1f5f9",
      color: "#4a5568",
      border: "none",
      borderRadius: "8px",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  };

  const styleTag = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .recommendation-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(102, 126, 234, 0.12);
      border-color: #c3dafe;
    }
    
    .view-button:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
    }
    
    .tab:hover:not(.active) {
      background: #f1f5f9;
    }
    
    .skill-filter:hover {
      background: #e2e8f0;
    }
    
    .skill-filter.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .modal-primary-button:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
    }
    
    .modal-secondary-button:hover, .modal-close-button:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }
    
    .pagination-button:hover:not(:disabled) {
      background: #e2e8f0;
      transform: translateY(-1px);
    }
    
    .pagination-page-button:hover:not(.active) {
      background: #e2e8f0;
      transform: translateY(-1px);
    }
  `;

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{styleTag}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>AI is analyzing your profile...</div>
          <div style={styles.aiThinking}>
            <span>Matching skills with opportunities</span>
          </div>
        </div>
      </div>
    );
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

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
          Powered by CareerSync AI
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
        </div>
      </div>

      {/* Main Section - Controls + Cards Combined */}
      <div style={styles.mainSection}>
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
                <span>{category.label}</span>
                <span style={{
                  background: selectedCategory === category.id ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                  color: selectedCategory === category.id ? "white" : "#64748b",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
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
              <label style={styles.filterLabel}>Search</label>
              <input
                type="text"
                placeholder="Search by title, company, or description..."
                style={{
                  ...styles.select,
                  marginBottom: "0.75rem",
                  width: "100%"
                }}
                value={filterOptions.searchTerm}
                onChange={(e) => setFilterOptions({ ...filterOptions, searchTerm: e.target.value })}
              />

              {selectedCategory === "internships" && (
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={styles.filterLabel}>Experience Level</label>
                    <select
                      style={styles.select}
                      value={filterOptions.experienceLevel}
                      onChange={(e) => setFilterOptions({ ...filterOptions, experienceLevel: e.target.value })}
                    >
                      <option value="">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={styles.filterLabel}>Stipend</label>
                    <select
                      style={styles.select}
                      value={filterOptions.stipendType}
                      onChange={(e) => setFilterOptions({ ...filterOptions, stipendType: e.target.value })}
                    >
                      <option value="all">All Internships</option>
                      <option value="paid">Paid Only</option>
                      <option value="unpaid">Unpaid Only</option>
                    </select>
                  </div>

                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <label style={styles.filterLabel}>Location</label>
                    <input
                      type="text"
                      placeholder="City, State, or Remote"
                      style={styles.select}
                      value={filterOptions.location}
                      onChange={(e) => setFilterOptions({ ...filterOptions, location: e.target.value })}
                    />
                  </div>
                </div>
              )}

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
                    className={`skill-filter ${activeFilters.includes(filter) ? 'active' : ''}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Clear Filters Button */}
              {(activeFilters.length > 0 || filterOptions.searchTerm || filterOptions.experienceLevel ||
                filterOptions.stipendType !== "all" || filterOptions.location) && (
                  <button
                    onClick={() => {
                      setActiveFilters([]);
                      setFilterOptions({
                        location: "",
                        experienceLevel: "",
                        stipendType: "all",
                        jobType: "",
                        searchTerm: ""
                      });
                    }}
                    style={{
                      marginTop: "1rem",
                      padding: "0.5rem 1rem",
                      background: "#f1f5f9",
                      border: "none",
                      borderRadius: "20px",
                      fontSize: "0.8125rem",
                      color: "#64748b",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <span>✕</span> Clear All Filters
                  </button>
                )}
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
                    </p>
                    {item.description && (
                      <p style={styles.cardDescription}>{item.description.substring(0, 100)}...</p>
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
                          <span style={styles.detailValue}>{item.certificate ? "Yes" : "No"}</span>
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

                  <div style={styles.cardActions}>
                    <button
                      style={styles.viewButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailsModal(item);
                      }}
                      onMouseEnter={(e) => handleButtonHover(e, true)}
                      onMouseLeave={(e) => handleButtonHover(e, false)}
                      className="view-button"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "3rem",
              background: "white",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                {fetchError ? "❌" : "🔍"}
              </div>
              <h3 style={{ color: "#2d3748", marginBottom: "0.5rem", fontSize: "1.25rem" }}>
                {fetchError ? "Error Loading Internships" : `No ${selectedCategory} found`}
              </h3>
              <p style={{ color: "#718096", fontSize: "0.875rem" }}>
                {fetchError || "Try adjusting your filters or check back later for new opportunities."}
              </p>
              {fetchError && (
                <button
                  onClick={() => {
                    setFetchError("");
                    fetchInternships(1);
                  }}
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1.25rem",
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination - Only show for internships tab */}
        {selectedCategory === "internships" && internships.length > 0 && (
          <div style={styles.paginationContainer}>
            <button
              onClick={handlePrevPage}
              disabled={!pagination.hasPrevPage}
              style={{
                ...styles.paginationButton,
                ...(!pagination.hasPrevPage && styles.paginationButtonDisabled)
              }}
              className="pagination-button"
            >
              ← Previous
            </button>
            
            <div style={styles.paginationPages}>
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} style={styles.paginationInfo}>...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => handlePageChange(page)}
                    style={{
                      ...styles.paginationPageButton,
                      ...(pagination.currentPage === page && styles.paginationActivePage)
                    }}
                    className={`pagination-page-button ${pagination.currentPage === page ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
              style={{
                ...styles.paginationButton,
                ...(!pagination.hasNextPage && styles.paginationButtonDisabled)
              }}
              className="pagination-button"
            >
              Next →
            </button>
          </div>
        )}

        {/* Items per page and total count info */}
        {selectedCategory === "internships" && internships.length > 0 && (
          <div style={{
            textAlign: "center",
            padding: "0 1.5rem 1.5rem",
            fontSize: "0.875rem",
            color: "#94a3b8"
          }}>
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} internships
          </div>
        )}
      </div>

      {/* Skill Recommendations - Keep this mock data */}
      <div style={{
        ...styles.roadmapSection,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}>
        <h2 style={{ ...styles.roadmapTitle, color: "white", marginBottom: "1.5rem", fontSize: "1.35rem" }}>
          Recommended Skills Development
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
          {mockRecommendations.skills.recommended.map((skill, index) => (
            <div key={index} style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "1.25rem",
              borderRadius: "10px",
              borderLeft: `4px solid ${skill.priority === "high" ? "#ef4444" :
                skill.priority === "medium" ? "#f59e0b" : "#10b981"
                }`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h4 style={{ fontWeight: 600, fontSize: "1rem" }}>{skill.skill}</h4>
                <span style={{
                  padding: "0.25rem 0.625rem",
                  background: skill.priority === "high" ? "#ef4444" :
                    skill.priority === "medium" ? "#f59e0b" : "#10b981",
                  borderRadius: "12px",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                }}>
                  {skill.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <p style={{ opacity: 0.9, fontSize: "0.8125rem" }}>{skill.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Career Path Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedCareerPath && (
          <div style={{ padding: "1.5rem" }}>
            <h2 style={{ marginBottom: "0.75rem", fontSize: "1.5rem" }}>
              {selectedCareerPath.title}
            </h2>
            <p style={{ marginBottom: "1rem", color: "#64748b", fontSize: "0.875rem" }}>
              {selectedCareerPath.description}
            </p>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Skills Required</h4>
            <ul style={{ marginBottom: "1rem", paddingLeft: "1.25rem" }}>
              {selectedCareerPath.skillsMatch?.map((skill, i) => (
                <li key={i} style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>{skill}</li>
              ))}
            </ul>
            <h4 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>📚 Skills to Learn</h4>
            <ul style={{ paddingLeft: "1.25rem" }}>
              {selectedCareerPath.skillsToLearn?.map((skill, i) => (
                <li key={i} style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* Internship Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={closeDetailsModal}>
        {selectedItem && (
          <div style={styles.modalContent}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h2 style={styles.modalTitle}>{selectedItem.title}</h2>
                <p style={styles.modalSubtitle}>{selectedItem.company}</p>
              </div>
              <div style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}>
                {selectedItem.match}% Match
              </div>
            </div>

            <div style={styles.modalGrid}>
              <div style={styles.modalDetailItem}>
                <span style={styles.modalDetailLabel}>Stipend</span>
                <span style={styles.modalDetailValue}>{selectedItem.stipend}</span>
              </div>
              <div style={styles.modalDetailItem}>
                <span style={styles.modalDetailLabel}>Location</span>
                <span style={styles.modalDetailValue}>{selectedItem.location}</span>
              </div>
              <div style={styles.modalDetailItem}>
                <span style={styles.modalDetailLabel}>Timeline</span>
                <span style={styles.modalDetailValue}>{selectedItem.timeline}</span>
              </div>
              <div style={styles.modalDetailItem}>
                <span style={styles.modalDetailLabel}>Experience</span>
                <span style={styles.modalDetailValue}>{selectedItem.experience}</span>
              </div>
              <div style={styles.modalDetailItem}>
                <span style={styles.modalDetailLabel}>Duration</span>
                <span style={styles.modalDetailValue}>{selectedItem.duration}</span>
              </div>
              <div style={styles.modalDetailItem}>
                <span style={styles.modalDetailLabel}>Posted</span>
                <span style={styles.modalDetailValue}>{selectedItem.postedDate}</span>
              </div>
            </div>

            <div style={styles.modalSection}>
              <h3 style={styles.modalSectionTitle}>Description</h3>
              <p style={styles.modalDescription}>{selectedItem.description}</p>
            </div>

            {selectedItem.responsibilities && (
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Responsibilities</h3>
                <p style={styles.modalDescription}>{selectedItem.responsibilities}</p>
              </div>
            )}

            {selectedItem.requirements && (
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Requirements</h3>
                <p style={styles.modalDescription}>{selectedItem.requirements}</p>
              </div>
            )}

            {selectedItem.skills && selectedItem.skills.length > 0 && (
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Required Skills</h3>
                <div style={styles.modalSkillsContainer}>
                  {selectedItem.skills.map((skill, index) => (
                    <span key={index} style={styles.modalSkillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedItem.benefits && (
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Benefits & Perks</h3>
                <p style={styles.modalDescription}>{selectedItem.benefits}</p>
              </div>
            )}

            {selectedItem.applicationProcess && (
              <div style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>Application Process</h3>
                <p style={styles.modalDescription}>{selectedItem.applicationProcess}</p>
              </div>
            )}

            <div style={styles.modalActions}>
              <button
                style={styles.modalSecondaryButton}
                onClick={() => handleSave(selectedItem)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                className="modal-secondary-button"
              >
                Save
              </button>
              <button
                style={styles.modalPrimaryButton}
                onClick={() => handleApply(selectedItem)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                className="modal-primary-button"
              >
                Apply Now
              </button>
              <button
                style={styles.modalCloseButton}
                onClick={closeDetailsModal}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e2e8f0";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                className="modal-close-button"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* AI Suggestions Modal */}
      <Modal 
        isOpen={showAiModal === true}
        onClose={() => setShowAiModal(false)}
      >
        <div style={{ padding: "2rem", maxWidth: "900px", width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "1.5rem",
            borderBottom: "2px solid #e0e7ff",
            paddingBottom: "1rem"
          }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: 700,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0
            }}>
              AI Career Suggestions
            </h2>
            <span style={{
              background: "#e0e7ff",
              color: "#3730a3",
              padding: "0.35rem 1rem",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 600
            }}>
              {aiResults?.length || 0} matches found
            </span>
          </div>

          {aiLoading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{
                width: "50px",
                height: "50px",
                border: "5px solid #f3f3f3",
                borderTop: "5px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem"
              }}></div>
              <p>AI is analyzing your skills...</p>
            </div>
          ) : aiResults && aiResults.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {aiResults.map((career, index) => (
                <div
                  key={index}
                  style={{
                    padding: "1.5rem",
                    background: index === 0 ? "#f5f3ff" : "white",
                    borderRadius: "12px",
                    border: index === 0 ? "2px solid #667eea" : "1px solid #e2e8f0",
                    position: "relative",
                    transition: "all 0.2s ease"
                  }}
                >
                  {index === 0 && (
                    <span style={{
                      position: "absolute",
                      top: "-12px",
                      left: "20px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      padding: "0.25rem 1.2rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      letterSpacing: "0.5px"
                    }}>
                      🏆 BEST MATCH
                    </span>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#2d3748", marginBottom: "0.5rem" }}>
                        {career.title}
                      </h3>
                      <p style={{ fontSize: "1rem", color: "#4a5568", lineHeight: "1.5" }}>
                        {career.reason}
                      </p>
                    </div>
                    <div style={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "40px",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      minWidth: "100px",
                      textAlign: "center",
                      marginLeft: "1.5rem"
                    }}>
                      {career.match}%
                    </div>
                  </div>

                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
                    gap: "1rem", 
                    marginBottom: "1.5rem",
                    background: "#f8fafc",
                    padding: "1rem",
                    borderRadius: "8px"
                  }}>
                    {career.salary && (
                      <div>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block", fontWeight: 600 }}>💰 SALARY</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2d3748" }}>{career.salary}</span>
                      </div>
                    )}
                    {career.growth && (
                      <div>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block", fontWeight: 600 }}>📈 GROWTH</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2d3748" }}>{career.growth}</span>
                      </div>
                    )}
                    {career.timeline && (
                      <div>
                        <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block", fontWeight: 600 }}>⏱️ TIMELINE</span>
                        <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2d3748" }}>{career.timeline}</span>
                      </div>
                    )}
                  </div>

                  {career.missingSkills && career.missingSkills.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <p style={{ fontSize: "1rem", fontWeight: 600, color: "#2d3748", marginBottom: "0.75rem" }}>
                        🎯 Skills to Learn:
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                        {career.missingSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: "#fee2e2",
                              color: "#b91c1c",
                              padding: "0.5rem 1rem",
                              borderRadius: "30px",
                              fontSize: "0.9rem",
                              fontWeight: 500,
                              border: "1px solid #fecaca"
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {career.recommendedCourses && career.recommendedCourses.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <p style={{ fontSize: "1rem", fontWeight: 600, color: "#2d3748", marginBottom: "0.75rem" }}>
                        📚 Recommended Courses:
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                        {career.recommendedCourses.map((course, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: "#dbeafe",
                              color: "#1e40af",
                              padding: "0.5rem 1rem",
                              borderRadius: "30px",
                              fontSize: "0.9rem",
                              fontWeight: 500,
                              border: "1px solid #bfdbfe"
                            }}
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      alert(`Saving ${career.title} to your career path...`);
                    }}
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem 1.5rem",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Save This Career Path
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
              <h3 style={{ color: "#2d3748", marginBottom: "0.5rem" }}>No Suggestions Found</h3>
              <p style={{ color: "#718096" }}>
                Try adding more skills to your profile for better recommendations.
              </p>
            </div>
          )}

          <div style={{ 
            marginTop: "2rem", 
            display: "flex", 
            justifyContent: "flex-end",
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1.5rem"
          }}>
            <button
              onClick={() => setShowAiModal(false)}
              style={{
                padding: "0.75rem 2rem",
                background: "#f1f5f9",
                color: "#4a5568",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CareerPaths;