import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// SVG Icons Component (same as before)
const Icons = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Email: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Tag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Building: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  GraduationCap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Tool: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  Link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  GitHub: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Award: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Save: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const subjectsCoursesOptions = [
  "Algorithms",
  "Data Structures",
  "Database Management",
  "Computer Networks",
  "Operating Systems",
  "Software Engineering",
  "Full Stack Development",
  "FSD",
  "Object-Oriented Programming",
  "Web Development",
  "Mobile App Development",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Computer Vision",
  "Natural Language Processing",
  "Cybersecurity",
  "Cloud Computing",
  "Distributed Systems",
  "Computer Architecture",
  "Compiler Design",
  "Theory of Computation",
  "Discrete Mathematics",
  "Calculus",
  "Linear Algebra",
  "Probability & Statistics",
  "Differential Equations",
  "Physics",
  "Chemistry",
  "Biology",
  "Environmental Science",
  "Economics",
  "Accounting",
  "Marketing",
  "Finance",
  "Human Resource Management",
  "Business Administration",
  "Project Management",
  "Organizational Behavior",
  "Strategic Management",
  "Digital Marketing",
  "Supply Chain Management",
  "Microeconomics",
  "Macroeconomics",
  "International Business",
  "Entrepreneurship",
  "Business Ethics",
  "Corporate Finance",
  "Investment Analysis",
  "Financial Accounting",
  "Managerial Accounting",
  "Auditing",
  "Taxation",
  "Business Law",
  "Constitutional Law",
  "Criminal Law",
  "Civil Law",
  "International Law",
  "Environmental Law",
  "Intellectual Property Law",
  "Human Rights Law",
  "Legal Writing",
  "Contract Law",
  "Tort Law",
  "Family Law",
  "Property Law",
  "Labor Law",
  "Administrative Law",
  "Clinical Psychology",
  "Cognitive Psychology",
  "Developmental Psychology",
  "Social Psychology",
  "Abnormal Psychology",
  "Personality Psychology",
  "Biological Psychology",
  "Industrial-Organizational Psychology",
  "Educational Psychology",
  "Health Psychology",
  "Forensic Psychology",
  "Counseling Psychology",
  "Positive Psychology",
  "Research Methods in Psychology",
  "Statistics for Psychology",
  "Sociological Theory",
  "Social Research Methods",
  "Criminology",
  "Gender Studies",
  "Race and Ethnicity",
  "Social Stratification",
  "Urban Sociology",
  "Rural Sociology",
  "Medical Sociology",
  "Political Sociology",
  "Sociology of Education",
  "Sociology of Family",
  "Sociology of Religion",
  "Globalization and Society",
  "Social Movements",
  "Deviance and Social Control",
  "Environmental Sociology",
  "Digital Sociology",
  "English Literature",
  "American Literature",
  "British Literature",
  "World Literature",
  "Creative Writing",
  "Technical Writing",
  "Journalism",
  "Mass Communication",
  "Public Relations",
  "Advertising",
  "Film Studies",
  "Media Studies",
  "Cultural Studies",
  "Linguistics",
  "Rhetoric and Composition",
  "Literary Theory",
  "Poetry",
  "Drama",
  "Fiction",
  "Non-fiction",
  "Children's Literature",
  "Young Adult Literature",
  "Science Fiction",
  "Fantasy Literature",
  "Mystery and Detective Fiction",
  "Historical Fiction",
  "Biography and Autobiography",
  "Memoir Writing",
  "Travel Writing",
  "Food Writing",
  "Nature Writing",
  "Sports Writing",
  "Business Writing",
  "Academic Writing",
  "Grant Writing",
  "Screenwriting",
  "Playwriting",
  "Songwriting",
  "Copywriting",
  "Content Strategy",
  "Editing and Publishing",
  "Literary Criticism",
  "Comparative Literature",
  "Postcolonial Literature",
  "Feminist Literature",
  "Queer Literature",
  "Disability Studies",
  "Indigenous Literature",
  "Diaspora Literature",
  "Translation Studies",
  "Digital Humanities",
  "Book History",
  "Print Culture",
  "Manuscript Studies",
  "Archival Research",
  "Oral History",
  "Folklore Studies",
  "Mythology",
  "Religious Studies",
  "Philosophy",
  "Ethics",
  "Logic",
  "Metaphysics",
  "Epistemology",
  "Aesthetics",
  "Political Philosophy",
  "Philosophy of Science",
  "Philosophy of Mind",
  "Philosophy of Language",
  "Ancient Philosophy",
  "Medieval Philosophy",
  "Modern Philosophy",
  "Contemporary Philosophy",
  "Eastern Philosophy",
  "African Philosophy",
  "Latin American Philosophy",
  "Environmental Philosophy",
  "Bioethics",
  "Neuroethics",
  "Computer Ethics",
  "Business Ethics",
  "Medical Ethics",
  "Legal Ethics",
  "Journalism Ethics",
  "Research Ethics",
  "Animal Ethics",
  "Climate Ethics",
  "Technology Ethics",
  "AI Ethics",
  "Robot Ethics",
  "Cybersecurity Ethics",
  "Data Ethics",
  "Privacy Ethics",
  "Surveillance Ethics",
  "Digital Ethics",
  "Internet Ethics",
  "Social Media Ethics",
  "Gaming Ethics",
  "Virtual Reality Ethics",
  "Augmented Reality Ethics",
  "Space Ethics",
  "Future Ethics",
  "Other"
];

// Add field of study options
const fieldOfStudyOptions = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Computer Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity",
  "Information Systems",
  "Web Development",
  "Mobile App Development",
  "Cloud Computing",
  "Network Engineering",
  "Database Management",
  "Business Administration",
  "Marketing",
  "Finance",
  "Accounting",
  "Economics",
  "Human Resources",
  "Psychology",
  "Sociology",
  "Political Science",
  "International Relations",
  "English Literature",
  "History",
  "Philosophy",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Biotechnology",
  "Biochemistry",
  "Environmental Science",
  "Geology",
  "Astronomy",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biomedical Engineering",
  "Industrial Engineering",
  "Architecture",
  "Urban Planning",
  "Graphic Design",
  "Fine Arts",
  "Music",
  "Film Studies",
  "Journalism",
  "Communication Studies",
  "Public Relations",
  "Education",
  "Early Childhood Education",
  "Special Education",
  "Nursing",
  "Medicine",
  "Pharmacy",
  "Dentistry",
  "Physical Therapy",
  "Nutrition & Dietetics",
  "Sports Science",
  "Hospitality Management",
  "Tourism Management",
  "Culinary Arts",
  "Law",
  "Criminal Justice",
  "Social Work",
  "Agriculture",
  "Veterinary Science",
  "Other"
];

// Generate years from 1980 to current year + 10
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear + 10 - 1980 + 1 }, (_, i) => 1980 + i).reverse();

const countries = [
  "India",
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "Mexico",
  "Spain",
  "Italy",
  "South Korea",
  "Russia",
  "Singapore",
  "United Arab Emirates",
  "South Africa",
  "New Zealand",
  "Other"
];

const degreeOptions = [
  "Bachelor of Science - BS",
  "Bachelor's degree",
  "Bachelor of Applied Science - BASc",
  "Bachelor of Architecture - BArch",
  "Bachelor of Arts - BA",
  "Bachelor of Business Administration - BBA",
  "Bachelor of Commerce - BCom",
  "Bachelor of Education - BEd",
  "Bachelor of Engineering - BE",
  "Bachelor of Fine Arts - BFA",
  "Bachelor of Laws - LLB",
  "Bachelor of Medicine, Bachelor of Surgery - MBBS",
  "Bachelor of Pharmacy - BPharm",
  "Bachelor of Technology - BTech",
  "Doctor's Degree",
  "Doctor of Arts",
  "Doctor of Education - EdD",
  "Doctor of Law",
  "Doctor of Law - JD",
  "Doctor of Medicine - MD",
  "Doctor of Pharmacy - PharmD",
  "Doctor of Philosophy - PhD",
  "Doctor of Science",
  "Master's degree",
  "Master of Architecture - MArch",
  "Master of Arts - MA",
  "Master of Business Administration - MBA",
  "Master of Computer Applications - MCA",
  "Master of Divinity - MDiv",
  "Master of Education - MEd",
  "Master of Engineering - MEng",
  "Master of Fine Arts - MFA",
  "Master of Laws - LLM",
  "Master of Library & Information Science - MLIS",
  "Master of Philosphy - MPhil",
  "Master of Public Administeration - MPA",
  "Master of Public Health - MPH",
  "Master of Science - MS",
  "Master of Social Work - MSW",
  "Master of Technology - MTech",
  "Postgraduate Degree",
  "Other"
];

const technicalSkillsList = [
  "React", "JavaScript", "TypeScript", "Node.js", "Python", "Java", "C++", "HTML/CSS",
  "Vue.js", "Angular", "Express.js", "Django", "Flask", "Spring Boot", "MongoDB",
  "PostgreSQL", "MySQL", "Firebase", "AWS", "Docker", "Kubernetes", "Git", "GitHub",
  "REST APIs", "GraphQL", "Redux", "Next.js", "React Native", "Flutter", "Swift",
  "Kotlin", "Android Development", "iOS Development", "Machine Learning", "Data Science",
  "TensorFlow", "PyTorch", "SQL", "NoSQL", "Redis", "Elasticsearch", "Jenkins",
  "CI/CD", "Linux", "Shell Scripting", "Agile/Scrum", "JIRA", "Figma", "Adobe XD"
];

const softSkillsList = [
  "Communication", "Teamwork", "Problem Solving", "Leadership", "Time Management",
  "Adaptability", "Creativity", "Critical Thinking", "Emotional Intelligence",
  "Conflict Resolution", "Negotiation", "Public Speaking", "Presentation Skills",
  "Active Listening", "Collaboration", "Decision Making", "Strategic Thinking",
  "Mentoring", "Coaching", "Empathy", "Patience", "Resilience", "Work Ethic",
  "Attention to Detail", "Organization", "Multitasking", "Self-Motivation",
  "Networking", "Cultural Awareness", "Customer Service"
];

const ProfileForm = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [technicalSearch, setTechnicalSearch] = useState("");
  const [softSearch, setSoftSearch] = useState("");
  const [showTechnicalDropdown, setShowTechnicalDropdown] = useState(false);
  const [showSoftDropdown, setShowSoftDropdown] = useState(false);
  const technicalInputRef = useRef(null);
  const softInputRef = useRef(null);
  
  // State for field of study search
  const [fieldOfStudySearch, setFieldOfStudySearch] = useState("");
  const [showFieldOfStudyDropdown, setShowFieldOfStudyDropdown] = useState(false);
  const fieldOfStudyInputRefs = useRef([]);
  
  // State for subjects/courses search
  const [subjectsSearch, setSubjectsSearch] = useState("");
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const subjectsInputRefs = useRef([]);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "India",
    cityState: "",
    bio: "",
    technicalSkills: [],
    softSkills: [],
    linkedin: "",
    github: "",
    experience: [{ title: "", company: "", description: "" }],
    education: [{
      institution: "",
      degree: "Bachelor of Science - BS", // Set as default
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      currentlyStudying: false,
      gradeCGPA: "",
      subjectsCourses: ""
    }],
    projects: [{ name: "", description: "" }],
    certifications: [{ name: "", issuer: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Custom debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
    
    return debouncedValue;
  };

  // Debounce profile changes
  const debouncedProfile = useDebounce(profile, 1000);

  // Auto-save to localStorage
  useEffect(() => {
    const saveToLocalStorage = () => {
      if (debouncedProfile.fullName || debouncedProfile.email || debouncedProfile.phone || 
          debouncedProfile.bio || debouncedProfile.technicalSkills.length > 0 || 
          debouncedProfile.softSkills.length > 0) {
        localStorage.setItem(`profile_draft_${userId}`, JSON.stringify(debouncedProfile));
        setHasUnsavedChanges(true);
        console.log("Auto-saved draft to localStorage");
      }
    };

    saveToLocalStorage();
  }, [debouncedProfile, userId]);

  // Load existing profile data
  useEffect(() => {
    if (!userId) {
      setMessage({ text: "User ID missing. Please login again.", type: "error" });
      return;
    }

    const fetchProfile = async () => {
      try {
        // Check for draft in localStorage first
        const savedDraft = localStorage.getItem(`profile_draft_${userId}`);
        
        if (savedDraft) {
          try {
            const draftData = JSON.parse(savedDraft);
            console.log("Loading draft from localStorage:", draftData);
            
            // Ensure all arrays are properly initialized
            const educationData = draftData.education?.length ? 
              draftData.education.map(edu => ({
                institution: edu.institution || "",
                degree: edu.degree || "Bachelor of Science - BS",
                fieldOfStudy: edu.fieldOfStudy || "",
                startYear: edu.startYear || "",
                endYear: edu.endYear || "",
                currentlyStudying: edu.currentlyStudying || false,
                gradeCGPA: edu.gradeCGPA || "",
                subjectsCourses: edu.subjectsCourses || ""
              })) : [{
                institution: "",
                degree: "Bachelor of Science - BS",
                fieldOfStudy: "",
                startYear: "",
                endYear: "",
                currentlyStudying: false,
                gradeCGPA: "",
                subjectsCourses: ""
              }];

            setProfile({
              fullName: draftData.fullName || "",
              email: draftData.email || "",
              phone: draftData.phone || "",
              country: draftData.country || "India",
              cityState: draftData.cityState || "",
              bio: draftData.bio || "",
              technicalSkills: draftData.technicalSkills || [],
              softSkills: draftData.softSkills || [],
              linkedin: draftData.linkedin || "",
              github: draftData.github || "",
              experience: draftData.experience?.length ? draftData.experience : [{ title: "", company: "", description: "" }],
              education: educationData,
              projects: draftData.projects?.length ? draftData.projects : [{ name: "", description: "" }],
              certifications: draftData.certifications?.length ? draftData.certifications : [{ name: "", issuer: "" }],
            });
            
            setHasUnsavedChanges(true);
            setMessage({ text: "Draft data loaded from your previous session", type: "success" });
            setTimeout(() => setMessage({ text: "", type: "" }), 3000);
            
            return; // Don't fetch from server if we have a draft
          } catch (parseError) {
            console.error("Error parsing saved draft:", parseError);
            localStorage.removeItem(`profile_draft_${userId}`);
          }
        }

        // First, get user info
        const userResponse = await axios.get(`http://localhost:5000/api/users/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        
        const userData = userResponse.data.data || userResponse.data;
        console.log("User data:", userData);
        
        // Try to get profile data
        try {
          const profileResponse = await axios.get(`http://localhost:5000/api/profile/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });

          if (profileResponse.data && profileResponse.data.data) {
            const profileData = profileResponse.data.data;
            const skillsArray = Array.isArray(profileData.skills) ? profileData.skills : [];
            const technicalSkills = [];
            const softSkills = [];
            let country = "";
            let cityState = "";

            if (profileData.location) {
              const locationParts = profileData.location.split(',').map(part => part.trim());
              if (locationParts.length > 1) {
                cityState = locationParts[0];
                country = locationParts.slice(1).join(', ');
              } else {
                cityState = profileData.location;
              }
            }

            skillsArray.forEach(skill => {
              const normalizedSkill = skill.trim();
              if (technicalSkillsList.includes(normalizedSkill)) {
                technicalSkills.push(normalizedSkill);
              } else if (softSkillsList.includes(normalizedSkill)) {
                softSkills.push(normalizedSkill);
              } else {
                technicalSkills.push(normalizedSkill);
              }
            });

            // Also check for separate technical/soft skills fields
            if (profileData.technicalSkills && Array.isArray(profileData.technicalSkills)) {
              profileData.technicalSkills.forEach(skill => {
                if (!technicalSkills.includes(skill)) {
                  technicalSkills.push(skill);
                }
              });
            }
            
            if (profileData.softSkills && Array.isArray(profileData.softSkills)) {
              profileData.softSkills.forEach(skill => {
                if (!softSkills.includes(skill)) {
                  softSkills.push(skill);
                }
              });
            }

            // Transform education data to new structure
            let educationData = [{
              institution: "",
              degree: "Bachelor of Science - BS",
              fieldOfStudy: "",
              startYear: "",
              endYear: "",
              currentlyStudying: false,
              gradeCGPA: "",
              subjectsCourses: ""
            }];
            
            if (profileData.education?.length) {
              educationData = profileData.education.map(edu => ({
                institution: edu.institution || "",
                degree: edu.degree || "Bachelor of Science - BS",
                fieldOfStudy: edu.fieldOfStudy || edu.field || "",
                startYear: edu.startYear || "",
                endYear: edu.endYear || "",
                currentlyStudying: edu.currentlyStudying || false,
                gradeCGPA: edu.gradeCGPA || "",
                subjectsCourses: edu.subjectsCourses || ""
              }));
            }

            setProfile({
              fullName: profileData.fullName || `${userData.fname} ${userData.lname}`.trim(),
              email: profileData.email || userData.email || "",
              phone: profileData.phone || "",
              country: country || "India",
              cityState: cityState,
              bio: profileData.bio || "",
              technicalSkills: technicalSkills,
              softSkills: softSkills,
              linkedin: profileData.linkedin || "",
              github: profileData.github || "",
              experience: profileData.experience?.length ? profileData.experience : [{ title: "", company: "", description: "" }],
              education: educationData,
              projects: profileData.projects?.length ? profileData.projects : [{ name: "", description: "" }],
              certifications: profileData.certifications?.length ? profileData.certifications : [{ name: "", issuer: "" }],
            });
          }
        } catch (profileError) {
          // If profile doesn't exist, set basic user info
          console.log("Profile not found, using user data");
          setProfile({
            fullName: `${userData.fname} ${userData.lname}`.trim(),
            email: userData.email || "",
            phone: "",
            country: "India",
            cityState: "",
            bio: "",
            technicalSkills: [],
            softSkills: [],
            linkedin: "",
            github: "",
            experience: [{ title: "", company: "", description: "" }],
            education: [{
              institution: "",
              degree: "Bachelor of Science - BS",
              fieldOfStudy: "",
              startYear: "",
              endYear: "",
              currentlyStudying: false,
              gradeCGPA: "",
              subjectsCourses: ""
            }],
            projects: [{ name: "", description: "" }],
            certifications: [{ name: "", issuer: "" }],
          });
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        // Set empty profile as fallback
        setProfile({
          fullName: "",
          email: "",
          phone: "",
          country: "India",
          cityState: "",
          bio: "",
          technicalSkills: [],
          softSkills: [],
          linkedin: "",
          github: "",
          experience: [{ title: "", company: "", description: "" }],
          education: [{
            institution: "",
            degree: "Bachelor of Science - BS",
            fieldOfStudy: "",
            startYear: "",
            endYear: "",
            currentlyStudying: false,
            gradeCGPA: "",
            subjectsCourses: ""
          }],
          projects: [{ name: "", description: "" }],
          certifications: [{ name: "", issuer: "" }],
        });
      }
    };

    fetchProfile();
  }, [userId]);

  // Warn user before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (profile.linkedin && !profile.linkedin.includes("linkedin.com")) newErrors.linkedin = "Please enter a valid LinkedIn URL";
    if (profile.github && !profile.github.includes("github.com")) newErrors.github = "Please enter a valid GitHub URL";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== "fullName" && name !== "email") {
      setProfile(prev => ({ ...prev, [name]: value }));
      setHasUnsavedChanges(true);
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handlers for dynamic array fields
  const handleArrayChange = (section, index, field, value) => {
    const updated = [...profile[section]];
    updated[index][field] = value;
    
    // If currentlyStudying is checked, clear end year
    if (field === 'currentlyStudying' && value === true) {
      updated[index].endYear = '';
    }
    
    setProfile(prev => ({ ...prev, [section]: updated }));
    setHasUnsavedChanges(true);
  };

  const handleAddItem = (section, defaultObj) => {
    setProfile(prev => ({ ...prev, [section]: [...prev[section], defaultObj] }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveItem = (section, index) => {
    const updated = [...profile[section]];
    updated.splice(index, 1);
    setProfile(prev => ({ ...prev, [section]: updated.length ? updated : [defaultObjects[section]] }));
    setHasUnsavedChanges(true);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({ text: "Please fix the errors below", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let location = "";
      if (profile.cityState || profile.country) {
        if (profile.cityState && profile.country) {
          location = `${profile.cityState}, ${profile.country}`;
        } else {
          location = profile.cityState || profile.country;
        }
      }
      const allSkills = [...profile.technicalSkills, ...profile.softSkills];

      const profileData = {
        ...profile,
        location: location,
        skills: allSkills,
      };

      delete profileData.country;
      delete profileData.cityState;
      delete profileData.technicalSkills;
      delete profileData.softSkills;

      await axios.post(`http://localhost:5000/api/profile/${userId}`, profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // Clear draft from localStorage after successful save
      localStorage.removeItem(`profile_draft_${userId}`);
      setHasUnsavedChanges(false);
      
      setMessage({ text: "Profile saved successfully!", type: "success" });
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage({ text: "Failed to save profile. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Save draft manually
  const handleSaveDraft = () => {
    localStorage.setItem(`profile_draft_${userId}`, JSON.stringify(profile));
    setMessage({ text: "Draft saved locally! Your changes will persist even if you close the page.", type: "success" });
    setHasUnsavedChanges(true);
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  // Clear draft
  const handleClearDraft = () => {
    if (window.confirm("Are you sure you want to clear your draft? This cannot be undone.")) {
      localStorage.removeItem(`profile_draft_${userId}`);
      setMessage({ text: "Draft cleared!", type: "success" });
      setHasUnsavedChanges(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    }
  };

  const handleAddSkill = (skill, category) => {
    const normalizedSkill = skill.trim();
    if (!normalizedSkill) return;

    if (category === 'technical') {
      if (!profile.technicalSkills.includes(normalizedSkill)) {
        setProfile(prev => ({
          ...prev,
          technicalSkills: [...prev.technicalSkills, normalizedSkill]
        }));
        setHasUnsavedChanges(true);
      }
    } else {
      if (!profile.softSkills.includes(normalizedSkill)) {
        setProfile(prev => ({
          ...prev,
          softSkills: [...prev.softSkills, normalizedSkill]
        }));
        setHasUnsavedChanges(true);
      }
    }
  };

  // Remove skill from category
  const handleRemoveSkill = (skill, category) => {
    if (category === 'technical') {
      setProfile(prev => ({
        ...prev,
        technicalSkills: prev.technicalSkills.filter(s => s !== skill)
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        softSkills: prev.softSkills.filter(s => s !== skill)
      }));
    }
    setHasUnsavedChanges(true);
  };

  // Handle technical search input change
  const handleTechnicalSearchChange = (e) => {
    const value = e.target.value;
    setTechnicalSearch(value);
    setShowTechnicalDropdown(value.length > 0);
    setShowSoftDropdown(false);
    setShowFieldOfStudyDropdown(false);
    setShowSubjectsDropdown(false);
  };

  // Handle soft search input change
  const handleSoftSearchChange = (e) => {
    const value = e.target.value;
    setSoftSearch(value);
    setShowSoftDropdown(value.length > 0);
    setShowTechnicalDropdown(false);
    setShowFieldOfStudyDropdown(false);
    setShowSubjectsDropdown(false);
  };

  // Handle field of study search input change
  const handleFieldOfStudySearchChange = (e, index) => {
    const value = e.target.value;
    const updated = [...profile.education];
    updated[index].fieldOfStudy = value;
    setProfile(prev => ({ ...prev, education: updated }));
    
    // Show dropdown if there's text
    setShowFieldOfStudyDropdown(value.length > 0);
    setShowTechnicalDropdown(false);
    setShowSoftDropdown(false);
    setShowSubjectsDropdown(false);
  };

  // Handle subjects/courses search input change
  const handleSubjectsSearchChange = (e, index) => {
    const value = e.target.value;
    const updated = [...profile.education];
    updated[index].subjectsCourses = value;
    setProfile(prev => ({ ...prev, education: updated }));
    
    // Show dropdown if there's text
    setShowSubjectsDropdown(value.length > 0);
    setShowTechnicalDropdown(false);
    setShowSoftDropdown(false);
    setShowFieldOfStudyDropdown(false);
  };

  // Handle Enter key for adding skills
  const handleTechnicalKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputValue = e.target.value.trim();
      
      if (inputValue) {
        handleAddSkill(inputValue, 'technical');
        setTechnicalSearch("");
        setShowTechnicalDropdown(false);
      }
    }
  };

  const handleSoftKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputValue = e.target.value.trim();
      
      if (inputValue) {
        handleAddSkill(inputValue, 'soft');
        setSoftSearch("");
        setShowSoftDropdown(false);
      }
    }
  };

  // Handle Enter key for subjects/courses
  const handleSubjectsKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputValue = e.target.value.trim();
      
      if (inputValue) {
        // Add the custom subject
        const updated = [...profile.education];
        updated[index].subjectsCourses = inputValue;
        setProfile(prev => ({ ...prev, education: updated }));
        setShowSubjectsDropdown(false);
      }
    }
  };

  // Handle dropdown item click
  const handleDropdownItemClick = (skill, category) => {
    handleAddSkill(skill, category);
    if (category === 'technical') {
      setTechnicalSearch("");
      setShowTechnicalDropdown(false);
      if (technicalInputRef.current) {
        technicalInputRef.current.focus();
      }
    } else {
      setSoftSearch("");
      setShowSoftDropdown(false);
      if (softInputRef.current) {
        softInputRef.current.focus();
      }
    }
  };

  // Handle field of study dropdown item click
  const handleFieldOfStudyItemClick = (field, index) => {
    const updated = [...profile.education];
    updated[index].fieldOfStudy = field;
    setProfile(prev => ({ ...prev, education: updated }));
    setShowFieldOfStudyDropdown(false);
    
    // Focus back on the input
    if (fieldOfStudyInputRefs.current[index]) {
      fieldOfStudyInputRefs.current[index].focus();
    }
  };

  // Handle subjects/courses dropdown item click
  const handleSubjectsItemClick = (subject, index) => {
    const updated = [...profile.education];
    updated[index].subjectsCourses = subject;
    setProfile(prev => ({ ...prev, education: updated }));
    setShowSubjectsDropdown(false);
    
    // Focus back on the input
    if (subjectsInputRefs.current[index]) {
      subjectsInputRefs.current[index].focus();
    }
  };

  // Get filtered technical skills (not already selected)
  const filteredTechnicalSkills = technicalSkillsList
    .filter(skill => !profile.technicalSkills.includes(skill))
    .filter(skill => 
      technicalSearch === "" || 
      skill.toLowerCase().includes(technicalSearch.toLowerCase())
    );

  // Get filtered soft skills (not already selected)
  const filteredSoftSkills = softSkillsList
    .filter(skill => !profile.softSkills.includes(skill))
    .filter(skill => 
      softSearch === "" || 
      skill.toLowerCase().includes(softSearch.toLowerCase())
    );

  // Get filtered field of study options
  const getFilteredFieldOfStudyOptions = (searchValue) => {
    return fieldOfStudyOptions.filter(field => 
      searchValue === "" || 
      field.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  // Get filtered subjects/courses options
  const getFilteredSubjectsOptions = (searchValue) => {
    return subjectsCoursesOptions.filter(subject => 
      searchValue === "" || 
      subject.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  // Default objects for each section
  const defaultObjects = {
    experience: { title: "", company: "", description: "" },
    education: { 
      institution: "", 
      degree: "Bachelor of Science - BS", // Set as default
      fieldOfStudy: "", 
      startYear: "", 
      endYear: "", 
      currentlyStudying: false, 
      gradeCGPA: "", 
      subjectsCourses: "" 
    },
    projects: { name: "", description: "" },
    certifications: { name: "", issuer: "" }
  };

  // Update tabs order - Education before Experience
  const tabs = [
    { id: "basic", label: "Basic Info", icon: <Icons.User /> },
    { id: "about", label: "About & Skills", icon: <Icons.FileText /> },
    { id: "education", label: "Education", icon: <Icons.GraduationCap /> },
    { id: "experience", label: "Experience", icon: <Icons.Building /> },
    { id: "projects", label: "Projects", icon: <Icons.Tool /> },
    { id: "additional", label: "Additional", icon: <Icons.Tag /> },
  ];

  // Inline CSS Styles
  const styles = {
    // Global styles
    global: `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Tab styles */
  .profile-tab {
    padding: 0.75rem 1rem;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: #666;
    transition: all 0.2s ease;
    position: relative;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    white-space: nowrap;
    flex: 1;
    justify-content: center;
    min-width: 0;
  }
  
  .profile-tab:hover {
    background-color: #f1f5f9;
  }
  
  .profile-tab.active {
    color: #0073b1;
    font-weight: 600;
    background-color: #f0f7ff;
  }
  
  .active-tab-indicator {
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #0073b1;
  }
`,
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      padding: "20px",
      width: "100%",
      maxWidth: "950px",
      margin: "0 auto",
    },

    header: {
      marginBottom: "1.5rem",
    },

    backButton: {
      background: "transparent",
      border: "none",
      color: "#0073b1",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.95rem",
      marginBottom: "1.5rem",
      padding: "0.5rem 0",
      borderRadius: "6px",
      transition: "all 0.2s ease",
      fontWeight: 500,
      fontFamily: "'Inter', sans-serif",
      position: "relative",
      overflow: "hidden",
    },

    title: {
      fontSize: "2rem",
      fontWeight: 700,
      color: "#191919",
      marginBottom: "0.5rem",
      background: "linear-gradient(135deg, #0073b1 0%, #00a0dc 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },

    subtitle: {
      fontSize: "1rem",
      color: "#666",
      marginBottom: "1.5rem",
    },

    // Form card
    formCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      border: "1px solid #e0e0e0",
      overflow: "hidden",
      marginBottom: "1rem",
    },

    // Tabs
    tabsContainer: {
      display: "flex",
      borderBottom: "1px solid #e0e0e0",
      backgroundColor: "#f9fafb",
      flexWrap: "nowrap",
    },

    tab: {
      padding: "0.75rem 1.5rem",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: 500,
      color: "#666",
      transition: "all 0.2s ease",
      position: "relative",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },

    activeTab: {
      color: "#0073b1",
      fontWeight: 600,
    },

    activeTabIndicator: {
      position: "absolute",
      bottom: "-1px",
      left: 0,
      right: 0,
      height: "2px",
      backgroundColor: "#0073b1",
    },

    // Form content
    formContent: {
      padding: "2rem",
    },

    // Form sections
    formSection: {
      marginBottom: "2rem",
    },

    sectionTitle: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "#191919",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      paddingBottom: "0.5rem",
      borderBottom: "1px solid #e5e7eb",
    },

    sectionIcon: {
      width: "28px",
      height: "28px",
      background: "#f0f7ff",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#0073b1",
    },

    // Form groups
    formGroup: {
      marginBottom: "1.15rem",
    },

    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#374151",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },

    labelIcon: {
      opacity: 0.7,
    },

    requiredLabel: {
      color: "#dc2626",
      marginLeft: "2px",
    },

    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "0.95rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      transition: "all 0.2s ease",
      backgroundColor: "white",
    },

    inputFocus: {
      outline: "none",
      borderColor: "#0073b1",
      boxShadow: "0 0 0 3px rgba(0, 115, 177, 0.1)",
    },

    textarea: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "0.95rem",
      fontFamily: "'Inter', sans-serif",
      transition: "all 0.2s ease",
      minHeight: "100px",
      resize: "vertical",
    },

    errorInput: {
      borderColor: "#dc2626",
    },

    errorText: {
      fontSize: "0.8125rem",
      color: "#dc2626",
      marginTop: "0.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },

    // Array items
    arrayItem: {
      backgroundColor: "#f9fafb",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
      border: "1px solid #e5e7eb",
    },

    arrayItemHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "0.75rem",
    },

    arrayItemTitle: {
      fontWeight: 600,
      color: "#374151",
      fontSize: "0.875rem",
    },

    removeButton: {
      background: "#fee2e2",
      border: "none",
      color: "#dc2626",
      width: "28px",
      height: "28px",
      borderRadius: "6px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.75rem",
      transition: "all 0.2s ease",
    },

    removeButtonHover: {
      background: "#fecaca",
    },

    arrayFields: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "0.75rem",
    },

    // Checkbox styles
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "0.5rem",
    },

    checkbox: {
      width: "16px",
      height: "16px",
      cursor: "pointer",
    },

    checkboxLabel: {
      fontSize: "0.875rem",
      color: "#374151",
      cursor: "pointer",
    },

    // Buttons
    addButton: {
      backgroundColor: "#f0f7ff",
      color: "#0073b1",
      border: "1px dashed #0073b1",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: 600,
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "0.5rem",
      fontFamily: "'Inter', sans-serif",
    },

    addButtonHover: {
      backgroundColor: "#e6f7ff",
      borderColor: "#006097",
    },

    submitButton: {
      backgroundColor: "#0073b1",
      color: "white",
      border: "none",
      padding: "0.875rem 2rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 600,
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      fontFamily: "'Inter', sans-serif",
    },

    submitButtonHover: {
      backgroundColor: "#006097",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 115, 177, 0.3)",
    },

    submitButtonLoading: {
      opacity: 0.7,
      cursor: "not-allowed",
    },

    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginTop: "2rem",
      flexWrap: "wrap",
    },

    secondaryButton: {
      backgroundColor: "white",
      color: "#374151",
      border: "1px solid #d1d5db",
      padding: "0.875rem 1.5rem",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.95rem",
      fontWeight: 500,
      transition: "all 0.2s ease",
      fontFamily: "'Inter', sans-serif",
    },

    secondaryButtonHover: {
      backgroundColor: "#f9fafb",
    },

    // Message
    message: {
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      fontSize: "0.95rem",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },

    successMessage: {
      backgroundColor: "#d1fae5",
      color: "#065f46",
      border: "1px solid #a7f3d0",
    },

    errorMessage: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },

    // Helper text
    helperText: {
      fontSize: "0.8125rem",
      color: "#6b7280",
      marginTop: "0.25rem",
      display: "flex",
      alignItems: "center",
      gap: "0.25rem",
    },

    readOnlyInput: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      fontSize: "0.95rem",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#f9fafb",
      color: "#6b7280",
      cursor: "not-allowed",
    },

    readOnlyLabel: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: 600,
      color: "#6b7280",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },

    select: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "0.95rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      transition: "all 0.2s ease",
      backgroundColor: "white",
      cursor: "pointer",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "16px",
      paddingRight: "2.5rem",
    },

    skillTag: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "#f0f7ff",
      color: "#0073b1",
      padding: "0.375rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.875rem",
      fontWeight: 500,
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
      border: "1px solid #dbeafe",
    },

    skillTagRemove: {
      background: "none",
      border: "none",
      color: "#0073b1",
      cursor: "pointer",
      marginLeft: "0.375rem",
      fontSize: "1rem",
      lineHeight: 1,
      opacity: 0.7,
      transition: "opacity 0.2s ease",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    skillTagRemoveHover: {
      opacity: 1,
    },

    skillTagsContainer: {
      display: "flex",
      flexWrap: "wrap",
      marginTop: "0.5rem",
      minHeight: "2.5rem",
      backgroundColor: "#f9fafb",
      padding: "0.75rem",
      borderRadius: "8px",
      border: "1px dashed #d1d5db",
    },

    searchableDropdown: {
      position: "relative",
      width: "100%",
    },

    searchInput: {
      width: "100%",
      padding: "0.625rem 1rem 0.625rem 2.5rem",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "0.9rem",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "white",
      transition: "all 0.2s ease",
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left 1rem center",
      backgroundSize: "14px",
    },

    dropdownList: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      marginTop: "0.25rem",
      maxHeight: "200px",
      overflowY: "auto",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
    },

    dropdownItem: {
      padding: "0.75rem 1rem",
      cursor: "pointer",
      fontSize: "0.9rem",
      transition: "all 0.2s ease",
      borderBottom: "1px solid #f3f4f6",
    },

    dropdownItemHover: {
      backgroundColor: "#f3f4f6",
    },

    dropdownItemLast: {
      borderBottom: "none",
    },

    dropdownEmpty: {
      padding: "0.75rem 1rem",
      color: "#6b7280",
      fontStyle: "italic",
      fontSize: "0.9rem",
    },

    // Education specific styles
    educationGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "1rem",
    },

    currentlyStudyingContainer: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "0.5rem",
    },

    gradeContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "1rem",
      marginTop: "1rem",
    },
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}><Icons.User /></span>
                Personal Information
              </h3>

              <div style={styles.formGroup}>
                <label style={styles.readOnlyLabel}>
                  <span style={styles.labelIcon}><Icons.User /></span>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  readOnly
                  style={styles.readOnlyInput}
                  placeholder="John Doe"
                />
                <div style={styles.helperText}>
                  <Icons.Info />
                  Your name as registered in the system
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.readOnlyLabel}>
                  <span style={styles.labelIcon}><Icons.Email /></span>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  readOnly
                  style={styles.readOnlyInput}
                  placeholder="john.doe@example.com"
                />
                <div style={styles.helperText}>
                  <Icons.Info />
                  Your registered email address
                </div>
              </div>

              {/* Editable Phone Field */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}><Icons.Phone /></span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="(123) 456-7890"
                />
                <div style={styles.helperText}>
                  <Icons.Info />
                  Optional - Your contact number
                </div>
              </div>

              {/* Location Fields */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.25rem"
              }}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.MapPin /></span>
                    Country
                  </label>
                  <select
                    name="country"
                    value={profile.country}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <div style={styles.helperText}>
                    <Icons.Info />
                    Country of residence
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.MapPin /></span>
                    City / State
                  </label>
                  <input
                    type="text"
                    name="cityState"
                    value={profile.cityState}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Mumbai, Maharashtra"
                  />
                  <div style={styles.helperText}>
                    <Icons.Info />
                    City and state
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "about":
        return (
          <>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}><Icons.FileText /></span>
                About & Bio
              </h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}><Icons.FileText /></span>
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Describe your professional background, expertise, and career goals..."
                />
                <div style={styles.helperText}>
                  <Icons.Info />
                  Write a brief summary of your professional experience and goals
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}><Icons.Tag /></span>
                Technical Skills
              </h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}><Icons.Tag /></span>
                  Add Technical Skills
                </label>

                <div style={styles.searchableDropdown}>
                  <input
                    ref={technicalInputRef}
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    value={technicalSearch}
                    onChange={handleTechnicalSearchChange}
                    onKeyDown={handleTechnicalKeyDown}
                    style={styles.searchInput}
                  />
                  
                  {showTechnicalDropdown && filteredTechnicalSkills.length > 0 && (
                    <div style={styles.dropdownList}>
                      {filteredTechnicalSkills.map((skill, index) => (
                        <div
                          key={skill}
                          style={{
                            ...styles.dropdownItem,
                            ...(index === filteredTechnicalSkills.length - 1 && styles.dropdownItemLast)
                          }}
                          onClick={() => handleDropdownItemClick(skill, 'technical')}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showTechnicalDropdown && filteredTechnicalSkills.length === 0 && technicalSearch && (
                    <div style={styles.dropdownList}>
                      <div 
                        style={{
                          ...styles.dropdownItem,
                          borderBottom: "none",
                          backgroundColor: "#f0f9ff",
                          color: "#0369a1",
                          fontWeight: "500"
                        }}
                        onClick={() => handleDropdownItemClick(technicalSearch, 'technical')}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0f2fe"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0f9ff"}
                      >
                        Add "{technicalSearch}" as custom skill
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Skills Tags */}
                <div style={styles.skillTagsContainer}>
                  {profile.technicalSkills.length > 0 ? (
                    profile.technicalSkills.map((skill, index) => (
                      <div key={index} style={styles.skillTag}>
                        {skill}
                        <button
                          type="button"
                          style={styles.skillTagRemove}
                          onClick={() => handleRemoveSkill(skill, 'technical')}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                      No technical skills added yet
                    </div>
                  )}
                </div>

                <div style={styles.helperText}>
                  <Icons.Info />
                  Type a skill and press Enter to add. Click on skills in dropdown to add them.
                </div>
              </div>
            </div>

            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}><Icons.Tag /></span>
                Soft Skills
              </h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}><Icons.Tag /></span>
                  Add Soft Skills
                </label>

                <div style={styles.searchableDropdown}>
                  <input
                    ref={softInputRef}
                    type="text"
                    placeholder="Type a skill and press Enter..."
                    value={softSearch}
                    onChange={handleSoftSearchChange}
                    onKeyDown={handleSoftKeyDown}
                    style={styles.searchInput}
                  />
                  
                  {showSoftDropdown && filteredSoftSkills.length > 0 && (
                    <div style={styles.dropdownList}>
                      {filteredSoftSkills.map((skill, index) => (
                        <div
                          key={skill}
                          style={{
                            ...styles.dropdownItem,
                            ...(index === filteredSoftSkills.length - 1 && styles.dropdownItemLast)
                          }}
                          onClick={() => handleDropdownItemClick(skill, 'soft')}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showSoftDropdown && filteredSoftSkills.length === 0 && softSearch && (
                    <div style={styles.dropdownList}>
                      <div 
                        style={{
                          ...styles.dropdownItem,
                          borderBottom: "none",
                          backgroundColor: "#f0f9ff",
                          color: "#0369a1",
                          fontWeight: "500"
                        }}
                        onClick={() => handleDropdownItemClick(softSearch, 'soft')}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0f2fe"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0f9ff"}
                      >
                        Add "{softSearch}" as custom skill
                      </div>
                    </div>
                  )}
                </div>

                {/* Soft Skills Tags */}
                <div style={styles.skillTagsContainer}>
                  {profile.softSkills.length > 0 ? (
                    profile.softSkills.map((skill, index) => (
                      <div key={index} style={{ ...styles.skillTag, backgroundColor: "#f0f9ff", color: "#0369a1", borderColor: "#bae6fd" }}>
                        {skill}
                        <button
                          type="button"
                          style={{ ...styles.skillTagRemove, color: "#0369a1" }}
                          onClick={() => handleRemoveSkill(skill, 'soft')}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                      No soft skills added yet
                    </div>
                  )}
                </div>

                <div style={styles.helperText}>
                  <Icons.Info />
                  Type a skill and press Enter to add. Click on skills in dropdown to add them.
                </div>
              </div>
            </div>
          </>
        );

      case "education":
        return (
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}><Icons.GraduationCap /></span>
              Education
            </h3>

            {profile.education.map((edu, index) => (
              <div key={index} style={styles.arrayItem}>
                <div style={styles.arrayItemHeader}>
                  <div style={styles.arrayItemTitle}>
                    Education #{index + 1}
                  </div>
                  {profile.education.length > 1 && (
                    <button
                      type="button"
                      style={styles.removeButton}
                      onClick={() => handleRemoveItem("education", index)}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                    >
                      <Icons.X />
                    </button>
                  )}
                </div>

                {/* Institution and Degree */}
                <div style={styles.educationGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}><Icons.Building /></span>
                      Institution
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)}
                      style={styles.input}
                      placeholder="University of Technology"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}><Icons.Tag /></span>
                      Degree
                    </label>
                    <select
                      value={edu.degree}
                      onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Select a degree</option>
                      {degreeOptions.map((degree) => (
                        <option key={degree} value={degree} selected={degree === "Bachelor of Science - BS"}>
                          {degree}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Field of Study with Searchable Dropdown */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.Tag /></span>
                    Field of Study
                  </label>
                  <div style={styles.searchableDropdown}>
                    <input
                      ref={el => fieldOfStudyInputRefs.current[index] = el}
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => handleFieldOfStudySearchChange(e, index)}
                      style={styles.searchInput}
                      placeholder="Search or type your field of study..."
                    />
                    
                    {showFieldOfStudyDropdown && edu.fieldOfStudy && getFilteredFieldOfStudyOptions(edu.fieldOfStudy).length > 0 && (
                      <div style={styles.dropdownList}>
                        {getFilteredFieldOfStudyOptions(edu.fieldOfStudy).map((field, fieldIndex) => (
                          <div
                            key={field}
                            style={{
                              ...styles.dropdownItem,
                              ...(fieldIndex === getFilteredFieldOfStudyOptions(edu.fieldOfStudy).length - 1 && styles.dropdownItemLast)
                            }}
                            onClick={() => handleFieldOfStudyItemClick(field, index)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                          >
                            {field}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Year, End Year, and Currently Studying */}
                <div style={styles.educationGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}><Icons.Calendar /></span>
                      Start Year
                    </label>
                    <select
                      value={edu.startYear}
                      onChange={(e) => handleArrayChange("education", index, "startYear", e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Select start year</option>
                      {years.map((year) => (
                        <option key={`start-${year}`} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}><Icons.Calendar /></span>
                      End Year
                    </label>
                    <select
                      value={edu.endYear}
                      onChange={(e) => handleArrayChange("education", index, "endYear", e.target.value)}
                      style={{
                        ...styles.select,
                        ...(edu.currentlyStudying && { backgroundColor: "#f3f4f6", color: "#6b7280", cursor: "not-allowed" })
                      }}
                      disabled={edu.currentlyStudying}
                    >
                      <option value="">Select end year</option>
                      {years.map((year) => (
                        <option key={`end-${year}`} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Currently Studying Checkbox */}
                <div style={styles.currentlyStudyingContainer}>
                  <input
                    type="checkbox"
                    id={`currentlyStudying-${index}`}
                    checked={edu.currentlyStudying}
                    onChange={(e) => handleArrayChange("education", index, "currentlyStudying", e.target.checked)}
                    style={styles.checkbox}
                  />
                  <label htmlFor={`currentlyStudying-${index}`} style={styles.checkboxLabel}>
                    I am currently studying here
                  </label>
                </div>

                {/* Grade/CGPA and Subjects/Courses */}
                <div style={styles.gradeContainer}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}><Icons.Award /></span>
                      Grade / CGPA
                    </label>
                    <input
                      type="text"
                      value={edu.gradeCGPA}
                      onChange={(e) => handleArrayChange("education", index, "gradeCGPA", e.target.value)}
                      style={styles.input}
                      placeholder="e.g., 3.8/4.0, 8.5/10, First Class"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}><Icons.FileText /></span>
                      Subjects / Courses (Optional)
                    </label>
                    <div style={styles.searchableDropdown}>
                      <input
                        ref={el => subjectsInputRefs.current[index] = el}
                        type="text"
                        value={edu.subjectsCourses}
                        onChange={(e) => handleSubjectsSearchChange(e, index)}
                        onKeyDown={(e) => handleSubjectsKeyDown(e, index)}
                        style={styles.searchInput}
                        placeholder="Search or type subjects/courses..."
                      />
                      
                      {showSubjectsDropdown && edu.subjectsCourses && getFilteredSubjectsOptions(edu.subjectsCourses).length > 0 && (
                        <div style={styles.dropdownList}>
                          {getFilteredSubjectsOptions(edu.subjectsCourses).map((subject, subjectIndex) => (
                            <div
                              key={subject}
                              style={{
                                ...styles.dropdownItem,
                                ...(subjectIndex === getFilteredSubjectsOptions(edu.subjectsCourses).length - 1 && styles.dropdownItemLast)
                              }}
                              onClick={() => handleSubjectsItemClick(subject, index)}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                            >
                              {subject}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {showSubjectsDropdown && getFilteredSubjectsOptions(edu.subjectsCourses).length === 0 && edu.subjectsCourses && (
                        <div style={styles.dropdownList}>
                          <div 
                            style={{
                              ...styles.dropdownItem,
                              borderBottom: "none",
                              backgroundColor: "#f0f9ff",
                              color: "#0369a1",
                              fontWeight: "500"
                            }}
                            onClick={() => handleSubjectsItemClick(edu.subjectsCourses, index)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0f2fe"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f0f9ff"}
                          >
                            Add "{edu.subjectsCourses}" as custom subject
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              style={styles.addButton}
              onClick={() => handleAddItem("education", defaultObjects.education)}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e6f7ff"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f0f7ff"}
            >
              <Icons.Plus />
              Add Education
            </button>
          </div>
        );

      case "experience":
        return (
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}><Icons.Building /></span>
              Work Experience
            </h3>

            {profile.experience.map((exp, index) => (
              <div key={index} style={styles.arrayItem}>
                <div style={styles.arrayItemHeader}>
                  <div style={styles.arrayItemTitle}>
                    Experience #{index + 1}
                  </div>
                  {profile.experience.length > 1 && (
                    <button
                      type="button"
                      style={styles.removeButton}
                      onClick={() => handleRemoveItem("experience", index)}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                    >
                      <Icons.X />
                    </button>
                  )}
                </div>

                <div style={styles.arrayFields}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}><Icons.Tag /></span>
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleArrayChange("experience", index, "title", e.target.value)}
                      style={styles.input}
                      placeholder="Senior Software Engineer"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      <span style={styles.labelIcon}><Icons.Building /></span>
                      Company
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                      style={styles.input}
                      placeholder="Tech Company Inc."
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.FileText /></span>
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)}
                    style={{ ...styles.textarea, minHeight: "80px" }}
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              style={styles.addButton}
              onClick={() => handleAddItem("experience", defaultObjects.experience)}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e6f7ff"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f0f7ff"}
            >
              <Icons.Plus />
              Add Experience
            </button>
          </div>
        );

      case "projects":
        return (
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}><Icons.Tool /></span>
              Projects
            </h3>

            {profile.projects.map((project, index) => (
              <div key={index} style={styles.arrayItem}>
                <div style={styles.arrayItemHeader}>
                  <div style={styles.arrayItemTitle}>
                    Project #{index + 1}
                  </div>
                  {profile.projects.length > 1 && (
                    <button
                      type="button"
                      style={styles.removeButton}
                      onClick={() => handleRemoveItem("projects", index)}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                    >
                      <Icons.X />
                    </button>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.Tag /></span>
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)}
                    style={styles.input}
                    placeholder="E-commerce Platform"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <span style={styles.labelIcon}><Icons.FileText /></span>
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)}
                    style={{ ...styles.textarea, minHeight: "80px" }}
                    placeholder="Describe the project, your role, and technologies used..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              style={styles.addButton}
              onClick={() => handleAddItem("projects", defaultObjects.projects)}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e6f7ff"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f0f7ff"}
            >
              <Icons.Plus />
              Add Project
            </button>
          </div>
        );

      case "additional":
        return (
          <>
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}><Icons.Tag /></span>
                Social Profiles
              </h3>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}><Icons.Linkedin /></span>
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={profile.linkedin}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.linkedin && styles.errorInput)
                  }}
                  placeholder="https://linkedin.com/in/username"
                />
                {errors.linkedin && (
                  <div style={styles.errorText}>
                    <Icons.AlertCircle />
                    {errors.linkedin}
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}><Icons.GitHub /></span>
                  GitHub
                </label>
                <input
                  type="url"
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.github && styles.errorInput)
                  }}
                  placeholder="https://github.com/username"
                />
                {errors.github && (
                  <div style={styles.errorText}>
                    <Icons.AlertCircle />
                    {errors.github}
                  </div>
                )}
              </div>
            </div>

            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>
                <span style={styles.sectionIcon}><Icons.Award /></span>
                Certifications
              </h3>

              {profile.certifications.map((cert, index) => (
                <div key={index} style={styles.arrayItem}>
                  <div style={styles.arrayItemHeader}>
                    <div style={styles.arrayItemTitle}>
                      Certification #{index + 1}
                    </div>
                    {profile.certifications.length > 1 && (
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() => handleRemoveItem("certifications", index)}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#fecaca"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#fee2e2"}
                      >
                        <Icons.X />
                      </button>
                    )}
                  </div>

                  <div style={styles.arrayFields}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        <span style={styles.labelIcon}><Icons.Tag /></span>
                        Certification Name
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleArrayChange("certifications", index, "name", e.target.value)}
                        style={styles.input}
                        placeholder="AWS Certified Developer"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        <span style={styles.labelIcon}><Icons.Tag /></span>
                        Issuer
                      </label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => handleArrayChange("certifications", index, "issuer", e.target.value)}
                        style={styles.input}
                        placeholder="Amazon Web Services"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                style={styles.addButton}
                onClick={() => handleAddItem("certifications", defaultObjects.certifications)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e6f7ff"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f0f7ff"}
              >
                <Icons.Plus />
                Add Certification
              </button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <style>{styles.global}</style>

      {/* Back Button & Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "0.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => navigate("/profile")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "8px",
              color: "#0073b1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f0f7ff";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Icons.ArrowLeft />
          </button>

          <h1 style={styles.title}>Edit Your Profile</h1>
        </div>
        
        {hasUnsavedChanges && (
          <div style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#fef3c7",
            color: "#92400e",
            borderRadius: "6px",
            fontSize: "0.875rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <Icons.Info />
            Draft auto-saved locally
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          ...styles.message,
          ...(message.type === "success" ? styles.successMessage : styles.errorMessage)
        }}>
          {message.type === "success" ? <Icons.Check /> : <Icons.AlertCircle />}
          {message.text}
        </div>
      )}

      {/* Form Card */}
      <div style={styles.formCard}>
        {/* Tabs */}
        <div style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <div className="active-tab-indicator" />}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div style={styles.formContent}>
            {renderTabContent()}

            {/* Form Actions */}
            <div style={styles.buttonGroup}>
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(loading && styles.submitButtonLoading)
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#006097";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 115, 177, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#0073b1";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icons.Save />
                    Save Profile to Server
                  </>
                )}
              </button>

              {/* Save Draft Button */}
              <button
                type="button"
                style={{
                  ...styles.secondaryButton,
                  backgroundColor: "#f0f9ff",
                  color: "#0369a1",
                  borderColor: "#bae6fd"
                }}
                onClick={handleSaveDraft}
                onMouseEnter={(e) => e.currentTarget.style.background = "#e0f2fe"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#f0f9ff"}
              >
                <Icons.Save />
                Save Draft Locally
              </button>

              {/* Clear Draft Button */}
              <button
                type="button"
                style={{
                  ...styles.secondaryButton,
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  borderColor: "#fecaca"
                }}
                onClick={handleClearDraft}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
              >
                <Icons.X />
                Clear Draft
              </button>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => navigate("/profile")}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={(e) => e.currentTarget.style.background = "white"}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Style for spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileForm;