import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostInternship = () => {
    const [loading, setLoading] = useState(true); // Changed to true initially
    const [submitting, setSubmitting] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        department: "",
        location: "",
        type: "remote",
        duration: "3",
        startDate: "",
        applicationDeadline: "",
        positions: 1,
        stipend: "",
        description: "",
        responsibilities: "",
        requirements: "",
        skills: [],
        benefits: "",
        applicationProcess: "",
        contactEmail: "",
        contactPhone: ""
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    useEffect(() => {
        if (!token || !userRole) {
            navigate("/login");
            return;
        }

        if (userRole !== "company_admin" && userRole !== "company") {
            alert("Access denied. Company account required.");
            navigate("/dashboard");
            return;
        }

        fetchDropdownData();
    }, [token, userRole, navigate]);

    const fetchDropdownData = async () => {
        try {
            setLoading(true);
            // Mock data
            const mockDepartments = [
                { id: 1, name: "Engineering" },
                { id: 2, name: "Marketing" },
                { id: 3, name: "Design" },
                { id: 4, name: "Analytics" },
                { id: 5, name: "Business" },
                { id: 6, name: "Human Resources" },
            ];

            const mockSkills = [
                "React", "JavaScript", "Python", "Node.js", "HTML/CSS", "UI/UX",
                "Data Analysis", "SQL", "MongoDB", "AWS", "Git", "Agile Methodologies",
                "SEO", "Content Marketing", "Social Media", "Figma", "Adobe Creative Suite"
            ];

            setDepartments(mockDepartments);
            setSkills(mockSkills);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
            setMessage({
                text: "Failed to load form data. Please try again.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ["title", "department", "description", "responsibilities", "requirements", "applicationDeadline"];
        
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].trim() === "") {
                newErrors[field] = "This field is required";
            }
        });

        if (formData.skills.length === 0) {
            newErrors.skills = "Please select at least one required skill";
        }

        if (formData.startDate && formData.applicationDeadline) {
            const startDate = new Date(formData.startDate);
            const deadline = new Date(formData.applicationDeadline);
            
            if (deadline > startDate) {
                newErrors.applicationDeadline = "Application deadline must be before the start date";
            }
        }

        if (formData.positions < 1) {
            newErrors.positions = "Number of positions must be at least 1";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSkillsChange = (skill) => {
        setFormData(prev => {
            const newSkills = prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill];
            return { ...prev, skills: newSkills };
        });
        
        // Clear error for skills if it exists
        if (errors.skills) {
            setErrors(prev => ({
                ...prev,
                skills: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setMessage({
                text: "Please fix the errors in the form before submitting.",
                type: "error"
            });
            return;
        }

        try {
            setSubmitting(true);
            setMessage({ text: "", type: "" });
            
            const internshipData = {
                ...formData,
                positions: parseInt(formData.positions),
                skills: formData.skills.join(',')
            };
            
            const response = await axios.post(
                "http://localhost:5000/api/companies/internships",
                internshipData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setMessage({
                    text: "Internship posted successfully! Redirecting...",
                    type: "success"
                });
                
                setTimeout(() => {
                    navigate("/company/internships");
                }, 2000);
            }
            
        } catch (error) {
            console.error("Error posting internship:", error);
            const errorMsg = error.response?.data?.message || "Failed to post internship. Please try again.";
            
            if (error.response?.data?.errors) {
                const errorMessages = error.response.data.errors.join('\n');
                setMessage({
                    text: `Validation errors:\n${errorMessages}`,
                    type: "error"
                });
            } else {
                setMessage({
                    text: errorMsg,
                    type: "error"
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/company/dashboard");
    };

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            background: "#f8fafc",
            minHeight: "100vh",
            padding: "2rem",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
        },
        headerContent: {
            flex: 1,
        },
        title: {
            fontSize: "2rem",
            fontWeight: 700,
            color: "#1f2937",
            marginBottom: "0.5rem",
        },
        subtitle: {
            color: "#6b7280",
            fontSize: "1rem",
            maxWidth: "600px",
        },
        headerButtons: {
            display: "flex",
            gap: "1rem",
        },
        backButton: {
            padding: "0.75rem 1.5rem",
            background: "white",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        saveButtonHeader: {
            padding: "0.75rem 1.5rem",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        form: {
            background: "white",
            padding: "2.5rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            maxWidth: "1200px",
            margin: "0 auto",
        },
        section: {
            background: "#f9fafb",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            marginBottom: "1.5rem",
        },
        sectionTitle: {
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        formGroup: {
            marginBottom: "1.5rem",
        },
        label: {
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "0.5rem",
        },
        input: {
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "0.875rem",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
        },
        textarea: {
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "0.875rem",
            minHeight: "120px",
            resize: "vertical",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
        },
        select: {
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "0.875rem",
            background: "white",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
            boxSizing: "border-box",
        },
        error: {
            color: "#dc2626",
            fontSize: "0.75rem",
            marginTop: "0.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
        },
        charCount: {
            fontSize: "0.75rem",
            color: "#6b7280",
            textAlign: "right",
            marginTop: "0.25rem",
        },
        message: {
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
        },
        successMessage: {
            background: "#d1fae5",
            color: "#065f46",
            border: "1px solid #a7f3d0",
        },
        errorMessage: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
        },
        loadingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
        },
        loadingSpinner: {
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #10b981",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },
        helpText: {
            fontSize: "0.75rem",
            color: "#6b7280",
            marginTop: "0.25rem",
            fontStyle: "italic",
        },
        halfSectionContainer: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "1.5rem",
        },
        halfSection: {
            background: "#f9fafb",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
        },
        gridContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            marginTop: "1rem",
        },
        skillsContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginTop: "0.5rem",
        },
        skillChip: {
            padding: "0.5rem 1rem",
            border: "1px solid #d1d5db",
            borderRadius: "20px",
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            backgroundColor: "white",
        },
        selectedSkill: {
            background: "#10b981",
            color: "white",
            borderColor: "#10b981",
        },
        required: {
            color: "#ef4444",
            marginLeft: "2px",
        },
        loadingButton: {
            opacity: 0.7,
            cursor: "not-allowed",
        },
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{`
                input:focus, textarea:focus, select:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }
                
                button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .back-button:hover {
                    background: #f9fafb;
                }
                
                .save-button:hover:not(:disabled) {
                    background: #059669;
                }
                
                .skill-chip:hover {
                    transform: translateY(-1px);
                }
                
                * {
                    box-sizing: border-box;
                }
            `}</style>

            {/* Header with buttons in top right */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.title}>Post New Internship</h1>
                    <p style={styles.subtitle}>
                        Create a new internship position to attract talented candidates
                    </p>
                </div>
                <div style={styles.headerButtons}>
                    <button
                        type="button"
                        style={styles.backButton}
                        onClick={handleCancel}
                        className="back-button"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        Back to Dashboard
                    </button>
                    <button
                        type="submit"
                        style={{
                            ...styles.saveButtonHeader,
                            ...(submitting && styles.loadingButton)
                        }}
                        disabled={submitting}
                        className="save-button"
                        onClick={handleSubmit}
                    >
                        {submitting ? (
                            <>
                                <div style={{
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTopColor: "white",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite"
                                }} />
                                Posting...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                                Post Internship
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Message Display */}
            {message.text && (
                <div style={{
                    ...styles.message,
                    ...(message.type === "success" ? styles.successMessage : styles.errorMessage)
                }}>
                    {message.type === "success" ? "✅" : "❌"} {message.text}
                </div>
            )}

            {/* Form */}
            <div style={styles.form}>
                {/* Basic Information */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
                        </svg>
                        Basic Information
                    </div>
                    <div style={styles.gridContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Internship Title<span style={styles.required}>*</span>
                            </label>
                            <input
                                style={{...styles.input, ...(errors.title && { borderColor: "#dc2626" })}}
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Frontend Developer Intern"
                            />
                            {errors.title && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.title}
                                </div>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Department<span style={styles.required}>*</span>
                            </label>
                            <select
                                style={{...styles.select, ...(errors.department && { borderColor: "#dc2626" })}}
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            {errors.department && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.department}
                                </div>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Location</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g., Remote, New York, Hybrid"
                            />
                            <div style={styles.helpText}>Leave empty for "Remote"</div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Internship Type<span style={styles.required}>*</span>
                            </label>
                            <select
                                style={styles.select}
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="remote">Remote</option>
                                <option value="onsite">On-site</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Duration (months)<span style={styles.required}>*</span>
                            </label>
                            <select
                                style={styles.select}
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                            >
                                <option value="1">1 Month</option>
                                <option value="2">2 Months</option>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12">12 Months</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Number of Positions<span style={styles.required}>*</span>
                            </label>
                            <input
                                style={{...styles.input, ...(errors.positions && { borderColor: "#dc2626" })}}
                                type="number"
                                name="positions"
                                value={formData.positions}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                            />
                            {errors.positions && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.positions}
                                </div>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Start Date</label>
                            <input
                                style={styles.input}
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                            />
                            <div style={styles.helpText}>Optional - leave empty for "Immediate"</div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Application Deadline<span style={styles.required}>*</span>
                            </label>
                            <input
                                style={{...styles.input, ...(errors.applicationDeadline && { borderColor: "#dc2626" })}}
                                type="date"
                                name="applicationDeadline"
                                value={formData.applicationDeadline}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.applicationDeadline && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.applicationDeadline}
                                </div>
                            )}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Stipend/Month</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="stipend"
                                value={formData.stipend}
                                onChange={handleInputChange}
                                placeholder="e.g., $1000, Unpaid, Competitive"
                            />
                        </div>
                    </div>
                </div>

                {/* Internship Details in 2 halves */}
                <div style={styles.halfSectionContainer}>
                    {/* Left Half - Description & Responsibilities */}
                    <div style={styles.halfSection}>
                        <div style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            Internship Description<span style={styles.required}>*</span>
                        </div>
                        <div style={styles.formGroup}>
                            <textarea
                                style={{...styles.textarea, ...(errors.description && { borderColor: "#dc2626" })}}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the internship opportunity, what makes it exciting, and what the intern can expect..."
                            />
                            {errors.description && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        <div style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/>
                            </svg>
                            Responsibilities<span style={styles.required}>*</span>
                        </div>
                        <div style={styles.formGroup}>
                            <textarea
                                style={{...styles.textarea, ...(errors.responsibilities && { borderColor: "#dc2626" })}}
                                name="responsibilities"
                                value={formData.responsibilities}
                                onChange={handleInputChange}
                                placeholder="• Develop and maintain web applications
• Collaborate with cross-functional teams
• Write clean, maintainable code
• Participate in code reviews"
                            />
                            {errors.responsibilities && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.responsibilities}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Half - Requirements & Skills */}
                    <div style={styles.halfSection}>
                        <div style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            Requirements<span style={styles.required}>*</span>
                        </div>
                        <div style={styles.formGroup}>
                            <textarea
                                style={{...styles.textarea, ...(errors.requirements && { borderColor: "#dc2626" })}}
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                placeholder="• Currently pursuing Bachelor's/Master's in Computer Science
• Basic understanding of web technologies
• Strong problem-solving skills
• Good communication skills"
                            />
                            {errors.requirements && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.requirements}
                                </div>
                            )}
                        </div>

                        <div style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                            </svg>
                            Required Skills<span style={styles.required}>*</span>
                        </div>
                        <div style={styles.formGroup}>
                            <div style={styles.skillsContainer}>
                                {skills.map(skill => (
                                    <div
                                        key={skill}
                                        style={{
                                            ...styles.skillChip,
                                            ...(formData.skills.includes(skill) && styles.selectedSkill)
                                        }}
                                        onClick={() => handleSkillsChange(skill)}
                                        className="skill-chip"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                            {errors.skills && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.skills}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Information - Full width */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Additional Information
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Benefits & Perks</label>
                        <textarea
                            style={styles.textarea}
                            name="benefits"
                            value={formData.benefits}
                            onChange={handleInputChange}
                            placeholder="• Mentorship from industry experts
• Flexible work hours
• Certificate of completion
• Letter of recommendation
• Potential for full-time offer"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Application Process</label>
                        <textarea
                            style={styles.textarea}
                            name="applicationProcess"
                            value={formData.applicationProcess}
                            onChange={handleInputChange}
                            placeholder="1. Submit your application through this portal
2. Initial screening review
3. Technical assessment (if applicable)
4. Interview rounds
5. Final decision"
                        />
                    </div>

                    <div style={styles.gridContainer}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Contact Email</label>
                            <input
                                style={styles.input}
                                type="email"
                                name="contactEmail"
                                value={formData.contactEmail}
                                onChange={handleInputChange}
                                placeholder="hr@company.com"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Contact Phone</label>
                            <input
                                style={styles.input}
                                type="tel"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostInternship;