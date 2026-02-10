import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditCompanyProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [companyData, setCompanyData] = useState(null);
    const [formData, setFormData] = useState({
        description: "",
        websiteUrl: "",
        linkedinUrl: "",
        address: "",
        city: "",
        state: "",
        country: ""
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [errors, setErrors] = useState({});
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

        fetchCompanyData();
    }, [token, userRole, navigate]);

    const fetchCompanyData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://localhost:5000/api/companies/my-company",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                const data = response.data.data;
                setCompanyData(data);
                setFormData({
                    description: data.description || "",
                    websiteUrl: data.websiteUrl || "",
                    linkedinUrl: data.linkedinUrl || "",
                    address: data.address || "",
                    city: data.city || "",
                    state: data.state || "",
                    country: data.country || ""
                });
            }
        } catch (error) {
            console.error("Error fetching company data:", error);
            setMessage({
                text: "Failed to load company data. Please try again.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Website URL validation
        if (formData.websiteUrl && !isValidUrl(formData.websiteUrl)) {
            newErrors.websiteUrl = "Please enter a valid URL (e.g., https://example.com)";
        }
        
        // LinkedIn URL validation
        if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
            newErrors.linkedinUrl = "Please enter a valid LinkedIn URL";
        }
        
        // Description length validation
        if (formData.description.length > 2000) {
            newErrors.description = "Description cannot exceed 2000 characters";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setSaving(true);
            setMessage({ text: "", type: "" });
            
            const response = await axios.put(
                `http://localhost:5000/api/companies/${companyData._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setMessage({
                    text: "Company profile updated successfully!",
                    type: "success"
                });
                
                // Update local company data
                setCompanyData(prev => ({
                    ...prev,
                    ...formData,
                    updatedAt: new Date().toISOString()
                }));
                
                // Show success message for 3 seconds
                setTimeout(() => {
                    setMessage({ text: "", type: "" });
                }, 3000);
            }
        } catch (error) {
            console.error("Error updating company profile:", error);
            setMessage({
                text: error.response?.data?.message || "Failed to update profile. Please try again.",
                type: "error"
            });
        } finally {
            setSaving(false);
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
        readOnlyInfo: {
            backgroundColor: "#f3f4f6",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1rem",
        },
        readOnlyField: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem 0",
            borderBottom: "1px solid #e5e7eb",
        },
        readOnlyLabel: {
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#6b7280",
        },
        readOnlyValue: {
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#374151",
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
            minHeight: "150px",
            resize: "vertical",
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
        locationGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
            marginTop: "1rem",
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
                input:focus, textarea:focus {
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
                
                * {
                    box-sizing: border-box;
                }
            `}</style>

            {/* Header with buttons in top right */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <h1 style={styles.title}>Edit Company Profile</h1>
                    <p style={styles.subtitle}>
                        Update your company information. Changes will be reflected immediately.
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
                            ...(saving && styles.loadingButton)
                        }}
                        disabled={saving}
                        className="save-button"
                        onClick={handleSubmit}
                    >
                        {saving ? (
                            <>
                                <div style={{
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
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                                    <polyline points="17 21 17 13 7 13 7 21"/>
                                    <polyline points="7 3 7 8 15 8"/>
                                </svg>
                                Save Changes
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
            <form style={styles.form} onSubmit={handleSubmit}>
                {/* Company Registration Details - Full width as before */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
                        </svg>
                        Company Registration Details
                    </div>
                    <div style={styles.readOnlyInfo}>
                        <div style={styles.readOnlyField}>
                            <span style={styles.readOnlyLabel}>Company Name</span>
                            <span style={styles.readOnlyValue}>{companyData.companyName}</span>
                        </div>
                        <div style={styles.readOnlyField}>
                            <span style={styles.readOnlyLabel}>Contact Email</span>
                            <span style={styles.readOnlyValue}>{companyData.contactEmail}</span>
                        </div>
                        <div style={styles.readOnlyField}>
                            <span style={styles.readOnlyLabel}>Phone Number</span>
                            <span style={styles.readOnlyValue}>{companyData.phoneNo}</span>
                        </div>
                        <div style={styles.readOnlyField}>
                            <span style={styles.readOnlyLabel}>Industry</span>
                            <span style={styles.readOnlyValue}>{companyData.industry}</span>
                        </div>
                        <div style={styles.readOnlyField}>
                            <span style={styles.readOnlyLabel}>Status</span>
                            <span style={{
                                ...styles.readOnlyValue,
                                color: companyData.status === 'approved' ? '#10b981' : 
                                       companyData.status === 'rejected' ? '#ef4444' : 
                                       '#f59e0b',
                                fontWeight: 600
                            }}>
                                {companyData.status === 'approved' ? 'Verified' : 
                                 companyData.status === 'rejected' ? 'Not Verified' : 
                                 'Pending Verification'}
                            </span>
                        </div>
                    </div>
                    <div style={styles.helpText}>
                        These details cannot be changed as they are part of your company registration. 
                        Contact support if you need to update these fields.
                    </div>
                </div>

                {/* Company Description and Online Presence side by side in 2 halves */}
                <div style={styles.halfSectionContainer}>
                    {/* Left Half - Company Description */}
                    <div style={styles.halfSection}>
                        <div style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            Company Description
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                About Your Company
                            </label>
                            <textarea
                                style={styles.textarea}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your company, mission, values, and what makes you unique..."
                                maxLength="2000"
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
                            <div style={styles.charCount}>
                                {formData.description.length}/2000 characters
                            </div>
                        </div>
                    </div>

                    {/* Right Half - Online Presence */}
                    <div style={styles.halfSection}>
                        <div style={styles.sectionTitle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="2" y1="12" x2="22" y2="12"/>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            Online Presence
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Website URL
                            </label>
                            <input
                                style={{...styles.input, ...(errors.websiteUrl && { borderColor: "#dc2626" })}}
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleInputChange}
                                placeholder="https://example.com"
                            />
                            {errors.websiteUrl && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.websiteUrl}
                                </div>
                            )}
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                LinkedIn URL
                            </label>
                            <input
                                style={{...styles.input, ...(errors.linkedinUrl && { borderColor: "#dc2626" })}}
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleInputChange}
                                placeholder="https://linkedin.com/company/..."
                            />
                            {errors.linkedinUrl && (
                                <div style={styles.error}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="12" y1="8" x2="12" y2="12"/>
                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {errors.linkedinUrl}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Location Information - Full width below */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        Location Information
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Address
                        </label>
                        <input
                            style={styles.input}
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Street address"
                        />
                    </div>
                    <div style={styles.locationGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                City
                            </label>
                            <input
                                style={styles.input}
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                State/Province
                            </label>
                            <input
                                style={styles.input}
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Country
                            </label>
                            <input
                                style={styles.input}
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder="Country"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditCompanyProfile;