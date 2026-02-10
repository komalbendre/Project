import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditInternship = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
        contactPhone: "",
        status: "Open"
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (id) {
            fetchInternshipData();
        } else {
            // Set default values for new internship
            setFormData(prev => ({
                ...prev,
                contactEmail: userData.email || "",
                contactPhone: userData.phone || ""
            }));
            setLoading(false);
        }
    }, [token, navigate, id, userData]);

    const fetchInternshipData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5000/api/companies/internships/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                const internship = response.data.data;
                
                // Format dates for input fields
                const formatDate = (dateString) => {
                    if (!dateString) return "";
                    const date = new Date(dateString);
                    return date.toISOString().split('T')[0];
                };

                setFormData({
                    title: internship.title || "",
                    department: internship.department || "",
                    location: internship.location || "",
                    type: internship.type || "remote",
                    duration: internship.duration || "3",
                    startDate: formatDate(internship.startDate),
                    applicationDeadline: formatDate(internship.applicationDeadline),
                    positions: internship.positions || 1,
                    stipend: internship.stipend || "",
                    description: internship.description || "",
                    responsibilities: internship.responsibilities || "",
                    requirements: internship.requirements || "",
                    skills: Array.isArray(internship.skills) ? internship.skills : [],
                    benefits: internship.benefits || "",
                    applicationProcess: internship.applicationProcess || "",
                    contactEmail: internship.contactEmail || userData.email || "",
                    contactPhone: internship.contactPhone || userData.phone || "",
                    status: internship.status || "Open"
                });
            }
        } catch (error) {
            console.error("Error fetching internship:", error);
            if (error.response?.status === 404) {
                alert("Internship not found");
                navigate("/company/internships");
            } else {
                alert("Failed to load internship data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSkillsChange = (skill) => {
        setFormData(prev => {
            const newSkills = prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill];
            return { ...prev, skills: newSkills };
        });
    };

    const handleSkillsInput = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const skill = e.target.value.trim();
            if (skill && !formData.skills.includes(skill)) {
                setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, skill]
                }));
                e.target.value = '';
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
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
            newErrors.skills = "Please add at least one required skill";
        }

        if (formData.startDate && formData.applicationDeadline) {
            const startDate = new Date(formData.startDate);
            const deadline = new Date(formData.applicationDeadline);
            
            if (deadline >= startDate) {
                newErrors.applicationDeadline = "Application deadline must be before the start date";
            }
        }

        if (formData.positions < 1) {
            newErrors.positions = "Number of positions must be at least 1";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            
            const internshipData = {
                ...formData,
                positions: parseInt(formData.positions),
                skills: formData.skills.join(',')
            };
            
            let response;
            
            if (id) {
                // Update existing internship
                response = await axios.put(
                    `http://localhost:5000/api/companies/internships/${id}`,
                    internshipData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Create new internship
                response = await axios.post(
                    "http://localhost:5000/api/companies/internships",
                    internshipData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            
            if (response.data.success) {
                alert(`Internship ${id ? 'updated' : 'created'} successfully!`);
                navigate("/company/internships");
            }
            
        } catch (error) {
            console.error("Error saving internship:", error);
            const message = error.response?.data?.message || `Failed to ${id ? 'update' : 'create'} internship. Please try again.`;
            
            if (error.response?.data?.errors) {
                const errorMessages = error.response.data.errors.join('\n');
                alert(`Validation errors:\n${errorMessages}`);
            } else {
                alert(message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this internship? This action cannot be undone.")) {
            try {
                await axios.delete(
                    `http://localhost:5000/api/companies/internships/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                alert("Internship deleted successfully!");
                navigate("/company/internships");
                
            } catch (error) {
                console.error("Error deleting internship:", error);
                const message = error.response?.data?.message || "Failed to delete internship. Please try again.";
                alert(message);
            }
        }
    };

    const handleCancel = () => {
        if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
            navigate("/company/internships");
        }
    };

    const commonSkills = [
        "React", "JavaScript", "Python", "Node.js", "HTML/CSS", "UI/UX Design",
        "Data Analysis", "SQL", "MongoDB", "AWS", "Git", "Agile Methodologies",
        "SEO", "Content Marketing", "Social Media", "Figma", "Adobe Creative Suite",
        "Java", "C++", "PHP", "Ruby", "Swift", "Kotlin", "Flutter", "React Native",
        "Machine Learning", "Data Science", "Cloud Computing", "DevOps", "Docker",
        "Communication", "Teamwork", "Problem Solving", "Leadership", "Project Management"
    ];

    const styles = {
        container: {
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            background: "#f8fafc",
            minHeight: "100vh",
            padding: "2rem",
            maxWidth: "1200px",
            margin: "0 auto",
        },
        header: {
            marginBottom: "2rem",
        },
        title: {
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: 800,
            color: "#2d3748",
            marginBottom: "0.5rem",
        },
        subtitle: {
            color: "#718096",
            fontSize: "1.125rem",
        },
        formContainer: {
            background: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        formGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
        },
        formGroup: {
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
        },
        label: {
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#374151",
            display: "flex",
            alignItems: "center",
            gap: "4px",
        },
        required: {
            color: "#ef4444",
        },
        input: {
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.875rem",
            fontFamily: "inherit",
        },
        errorInput: {
            borderColor: "#ef4444",
        },
        select: {
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.875rem",
            background: "white",
            fontFamily: "inherit",
        },
        textArea: {
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "0.875rem",
            minHeight: "120px",
            resize: "vertical",
            fontFamily: "inherit",
        },
        sectionTitle: {
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#2d3748",
            marginTop: "2rem",
            marginBottom: "1rem",
            paddingBottom: "0.5rem",
            borderBottom: "2px solid #e5e7eb",
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
        },
        selectedSkill: {
            background: "#10b981",
            color: "white",
            borderColor: "#10b981",
        },
        buttonContainer: {
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            marginTop: "2rem",
            paddingTop: "2rem",
            borderTop: "1px solid #e5e7eb",
        },
        deleteButton: {
            padding: "0.75rem 1.5rem",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease",
        },
        cancelButton: {
            padding: "0.75rem 1.5rem",
            background: "white",
            color: "#4b5563",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
        },
        submitButton: {
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease",
        },
        disabledButton: {
            opacity: 0.5,
            cursor: "not-allowed",
        },
        loadingContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
        },
        loadingSpinner: {
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #10b981",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },
        errorText: {
            color: "#ef4444",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
        },
        helpText: {
            color: "#6b7280",
            fontSize: "0.75rem",
            marginTop: "0.25rem",
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
                    <p style={{ marginLeft: "1rem", color: "#6b7280" }}>
                        {id ? "Loading internship..." : "Loading..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .submit-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }
                
                .cancel-button:hover, .delete-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .skill-chip:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: #10b981;
                    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
                }
            `}</style>

            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>
                    {id ? 'Edit Internship' : 'Create New Internship'}
                </h1>
                <p style={styles.subtitle}>
                    {id ? 'Update your internship details' : 'Create a new internship position to attract talented candidates'}
                </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div style={styles.formContainer}>
                    {/* Basic Information */}
                    <h3 style={styles.sectionTitle}>Basic Information</h3>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Internship Title<span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                style={{
                                    ...styles.input,
                                    ...(errors.title && styles.errorInput)
                                }}
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Frontend Developer Intern"
                            />
                            {errors.title && <div style={styles.errorText}>{errors.title}</div>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Department<span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="department"
                                style={{
                                    ...styles.input,
                                    ...(errors.department && styles.errorInput)
                                }}
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g., Engineering, Marketing, Design"
                            />
                            {errors.department && <div style={styles.errorText}>{errors.department}</div>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Location<span style={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                style={styles.input}
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g., Remote, New York, Hybrid"
                            />
                            <div style={styles.helpText}>Specify city/country for onsite/hybrid positions</div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Internship Type<span style={styles.required}>*</span>
                            </label>
                            <select
                                name="type"
                                style={styles.select}
                                value={formData.type}
                                onChange={handleChange}
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
                                name="duration"
                                style={styles.select}
                                value={formData.duration}
                                onChange={handleChange}
                            >
                                <option value="1">1 Month</option>
                                <option value="2">2 Months</option>
                                <option value="3">3 Months</option>
                                <option value="6">6 Months</option>
                                <option value="12">12 Months</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Number of Positions<span style={styles.required}>*</span>
                            </label>
                            <input
                                type="number"
                                name="positions"
                                style={{
                                    ...styles.input,
                                    ...(errors.positions && styles.errorInput)
                                }}
                                value={formData.positions}
                                onChange={handleChange}
                                min="1"
                                max="100"
                            />
                            {errors.positions && <div style={styles.errorText}>{errors.positions}</div>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                style={styles.input}
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                            <div style={styles.helpText}>Optional - leave empty for "Immediate"</div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Application Deadline<span style={styles.required}>*</span>
                            </label>
                            <input
                                type="date"
                                name="applicationDeadline"
                                style={{
                                    ...styles.input,
                                    ...(errors.applicationDeadline && styles.errorInput)
                                }}
                                value={formData.applicationDeadline}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.applicationDeadline && <div style={styles.errorText}>{errors.applicationDeadline}</div>}
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Stipend/Month</label>
                            <input
                                type="text"
                                name="stipend"
                                style={styles.input}
                                value={formData.stipend}
                                onChange={handleChange}
                                placeholder="e.g., $1000, Unpaid, Competitive, Negotiable"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Status</label>
                            <select
                                name="status"
                                style={styles.select}
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                                <option value="Draft">Draft</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <h3 style={styles.sectionTitle}>
                        Internship Description<span style={styles.required}>*</span>
                    </h3>
                    <textarea
                        name="description"
                        style={{
                            ...styles.textArea,
                            ...(errors.description && styles.errorInput)
                        }}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the internship opportunity, what makes it exciting, and what the intern can expect..."
                        rows={6}
                    />
                    {errors.description && <div style={styles.errorText}>{errors.description}</div>}

                    {/* Responsibilities */}
                    <h3 style={styles.sectionTitle}>
                        Responsibilities<span style={styles.required}>*</span>
                    </h3>
                    <textarea
                        name="responsibilities"
                        style={{
                            ...styles.textArea,
                            ...(errors.responsibilities && styles.errorInput)
                        }}
                        value={formData.responsibilities}
                        onChange={handleChange}
                        placeholder="• Develop and maintain web applications
• Collaborate with cross-functional teams
• Write clean, maintainable code
• Participate in code reviews"
                        rows={6}
                    />
                    {errors.responsibilities && <div style={styles.errorText}>{errors.responsibilities}</div>}

                    {/* Requirements */}
                    <h3 style={styles.sectionTitle}>
                        Requirements<span style={styles.required}>*</span>
                    </h3>
                    <textarea
                        name="requirements"
                        style={{
                            ...styles.textArea,
                            ...(errors.requirements && styles.errorInput)
                        }}
                        value={formData.requirements}
                        onChange={handleChange}
                        placeholder="• Currently pursuing Bachelor's/Master's in Computer Science
• Basic understanding of web technologies
• Strong problem-solving skills
• Good communication skills"
                        rows={6}
                    />
                    {errors.requirements && <div style={styles.errorText}>{errors.requirements}</div>}

                    {/* Skills */}
                    <h3 style={styles.sectionTitle}>
                        Required Skills<span style={styles.required}>*</span>
                    </h3>
                    <div style={styles.formGroup}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                            {formData.skills.map((skill, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        background: "#10b981",
                                        color: "white",
                                        borderRadius: "20px",
                                        fontSize: "0.875rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem"
                                    }}
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "white",
                                            cursor: "pointer",
                                            fontSize: "0.875rem",
                                            padding: 0
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Type a skill and press Enter or comma"
                            style={styles.input}
                            onKeyDown={handleSkillsInput}
                        />
                        {errors.skills && <div style={styles.errorText}>{errors.skills}</div>}
                        
                        <div style={{ marginTop: "1rem" }}>
                            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                                Common skills (click to add):
                            </div>
                            <div style={styles.skillsContainer}>
                                {commonSkills.map(skill => (
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
                        </div>
                    </div>

                    {/* Benefits */}
                    <h3 style={styles.sectionTitle}>Benefits & Perks</h3>
                    <textarea
                        name="benefits"
                        style={styles.textArea}
                        value={formData.benefits}
                        onChange={handleChange}
                        placeholder="• Mentorship from industry experts
• Flexible work hours
• Certificate of completion
• Letter of recommendation
• Potential for full-time offer"
                        rows={4}
                    />

                    {/* Application Process */}
                    <h3 style={styles.sectionTitle}>Application Process</h3>
                    <textarea
                        name="applicationProcess"
                        style={styles.textArea}
                        value={formData.applicationProcess}
                        onChange={handleChange}
                        placeholder="1. Submit your application through this portal
2. Initial screening review
3. Technical assessment (if applicable)
4. Interview rounds
5. Final decision"
                        rows={4}
                    />

                    {/* Contact Information */}
                    <h3 style={styles.sectionTitle}>Contact Information</h3>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                style={styles.input}
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="hr@company.com"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Contact Phone</label>
                            <input
                                type="tel"
                                name="contactPhone"
                                style={styles.input}
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div style={styles.buttonContainer}>
                        <div>
                            {id && (
                                <button
                                    type="button"
                                    style={styles.deleteButton}
                                    onClick={handleDelete}
                                    className="delete-button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 6h18"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                    Delete Internship
                                </button>
                            )}
                        </div>
                        
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button
                                type="button"
                                style={styles.cancelButton}
                                onClick={handleCancel}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{
                                    ...styles.submitButton,
                                    ...(submitting && styles.disabledButton)
                                }}
                                disabled={submitting}
                                className="submit-button"
                            >
                                {submitting ? (
                                    <>
                                        <div style={{
                                            width: "16px",
                                            height: "16px",
                                            border: "2px solid white",
                                            borderTop: "2px solid transparent",
                                            borderRadius: "50%",
                                            animation: "spin 1s linear infinite"
                                        }}></div>
                                        {id ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    id ? 'Update Internship' : 'Create Internship'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditInternship;