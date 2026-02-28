import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";

const SavedCareerPathsModal = ({ isOpen, onClose }) => {
  const [savedCareerPaths, setSavedCareerPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [careerDetails, setCareerDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Load saved career paths from localStorage
  const loadSavedCareerPaths = () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem("savedCareerPaths");
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        setSavedCareerPaths(parsedSaved);
      } else {
        setSavedCareerPaths([]);
      }
    } catch (error) {
      console.error("Error loading saved career paths:", error);
      setSavedCareerPaths([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove a career path from saved list
  const removeCareerPath = (careerId) => {
    try {
      const updatedPaths = savedCareerPaths.filter(path => path.id !== careerId);
      setSavedCareerPaths(updatedPaths);
      localStorage.setItem("savedCareerPaths", JSON.stringify(updatedPaths));
      
      // Dispatch event to update dashboard
      window.dispatchEvent(new Event('savedCareerPathsUpdated'));
    } catch (error) {
      console.error("Error removing career path:", error);
    }
  };

  // Clear all saved career paths
  const clearAllPaths = () => {
    if (window.confirm("Are you sure you want to remove all saved career paths?")) {
      setSavedCareerPaths([]);
      localStorage.removeItem("savedCareerPaths");
      window.dispatchEvent(new Event('savedCareerPathsUpdated'));
    }
  };

  // View career path details
  const viewCareerDetails = async (career) => {
    setSelectedCareer(career);
    setDetailsLoading(true);
    setShowDetailsModal(true);

    try {
      // If we have the full career ID, fetch from API
      if (career.id && career.id.length > 10) { // Assuming MongoDB IDs are longer than 10 chars
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/career-paths/${career.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data) {
          setCareerDetails(response.data);
        } else {
          // If API fails, use the saved data
          setCareerDetails(career);
        }
      } else {
        // If no valid ID, use the saved data
        setCareerDetails(career);
      }
    } catch (error) {
      console.error("Error fetching career details:", error);
      // Fallback to saved data
      setCareerDetails(career);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSavedCareerPaths();
    }
  }, [isOpen]);

  // Styles
  const styles = {
    modalContent: {
      padding: "24px",
      maxWidth: "800px",
      width: "100%",
      maxHeight: "80vh",
      overflowY: "auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
      borderBottom: "2px solid #e2e8f0",
      paddingBottom: "16px",
    },
    title: {
      fontSize: "24px",
      fontWeight: 700,
      color: "#0f172a",
      margin: 0,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "24px",
      cursor: "pointer",
      color: "#64748b",
      padding: "4px 8px",
      borderRadius: "8px",
    },
    actionsBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    count: {
      fontSize: "14px",
      color: "#64748b",
      background: "#f1f5f9",
      padding: "4px 12px",
      borderRadius: "20px",
    },
    clearButton: {
      padding: "8px 16px",
      background: "#fee2e2",
      color: "#dc2626",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    loadingContainer: {
      textAlign: "center",
      padding: "40px",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #667eea",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      margin: "0 auto 16px",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 24px",
      background: "#f8fafc",
      borderRadius: "12px",
    },
    emptyIcon: {
      fontSize: "48px",
      marginBottom: "16px",
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#334155",
      marginBottom: "8px",
    },
    emptyText: {
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "20px",
    },
    exploreButton: {
      padding: "10px 20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    careerGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "16px",
    },
    careerCard: {
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "20px",
      transition: "all 0.3s ease",
      cursor: "pointer",
      position: "relative",
    },
    matchBadge: {
      position: "absolute",
      top: "12px",
      right: "12px",
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 600,
    },
    careerTitle: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#0f172a",
      marginBottom: "8px",
      paddingRight: "60px",
    },
    careerCompany: {
      fontSize: "14px",
      color: "#667eea",
      fontWeight: 500,
      marginBottom: "12px",
    },
    careerDescription: {
      fontSize: "13px",
      color: "#64748b",
      marginBottom: "16px",
      lineHeight: 1.5,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
    skillsContainer: {
      marginBottom: "16px",
    },
    skillsLabel: {
      fontSize: "12px",
      color: "#94a3b8",
      marginBottom: "6px",
      fontWeight: 500,
    },
    skillsList: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
    },
    skillTag: {
      background: "#f1f5f9",
      color: "#475569",
      padding: "4px 10px",
      borderRadius: "16px",
      fontSize: "11px",
      fontWeight: 500,
    },
    cardFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #f1f5f9",
    },
    salaryInfo: {
      fontSize: "13px",
      color: "#10b981",
      fontWeight: 600,
    },
    removeButton: {
      padding: "6px 12px",
      background: "#fee2e2",
      color: "#dc2626",
      border: "none",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
    },
    // Details Modal Styles
    detailsModalContent: {
      padding: "32px",
      maxWidth: "700px",
      width: "100%",
      maxHeight: "80vh",
      overflowY: "auto",
    },
    detailsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "24px",
    },
    detailsTitle: {
      fontSize: "28px",
      fontWeight: 700,
      color: "#0f172a",
      marginBottom: "8px",
    },
    detailsMatch: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      padding: "8px 16px",
      borderRadius: "30px",
      fontSize: "16px",
      fontWeight: 700,
    },
    detailsSection: {
      marginBottom: "24px",
    },
    detailsSectionTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: "#334155",
      marginBottom: "12px",
      borderBottom: "2px solid #e2e8f0",
      paddingBottom: "8px",
    },
    detailsText: {
      fontSize: "15px",
      color: "#4b5563",
      lineHeight: 1.6,
    },
    detailsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "16px",
      marginBottom: "20px",
    },
    detailsItem: {
      background: "#f8fafc",
      padding: "16px",
      borderRadius: "10px",
    },
    detailsItemLabel: {
      fontSize: "12px",
      color: "#94a3b8",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginBottom: "4px",
    },
    detailsItemValue: {
      fontSize: "16px",
      color: "#0f172a",
      fontWeight: 600,
    },
  };

  // Add keyframe animation
  const styleTag = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .career-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(102, 126, 234, 0.12);
      border-color: #c3dafe;
    }
    
    .remove-button:hover {
      background: #fecaca;
    }
    
    .clear-button:hover {
      background: #fecaca;
    }
    
    .explore-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  `;

  return (
    <>
      <style>{styleTag}</style>
      
      <Modal isOpen={isOpen} onClose={onClose}>
        <div style={styles.modalContent}>
          <div style={styles.header}>
            <h2 style={styles.title}>Saved Career Paths</h2>
            <button 
              style={styles.closeButton}
              onClick={onClose}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              ✕
            </button>
          </div>

          {savedCareerPaths.length > 0 && (
            <div style={styles.actionsBar}>
              <span style={styles.count}>
                {savedCareerPaths.length} {savedCareerPaths.length === 1 ? 'career path' : 'career paths'} saved
              </span>
              <button
                style={styles.clearButton}
                onClick={clearAllPaths}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fecaca";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fee2e2";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                className="clear-button"
              >
                Clear All
              </button>
            </div>
          )}

          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={{ color: "#64748b" }}>Loading saved career paths...</p>
            </div>
          ) : savedCareerPaths.length > 0 ? (
            <div style={styles.careerGrid}>
              {savedCareerPaths.map((career, index) => (
                <div
                  key={index}
                  style={styles.careerCard}
                  className="career-card"
                  onClick={() => viewCareerDetails(career)}
                >
                  {career.match && (
                    <div style={styles.matchBadge}>
                      {career.match}% Match
                    </div>
                  )}
                  
                  <h3 style={styles.careerTitle}>{career.title}</h3>
                  <p style={styles.careerCompany}>{career.company || career.category || "Career Path"}</p>
                  
                  {career.description && (
                    <p style={styles.careerDescription}>{career.description}</p>
                  )}

                  {career.skillsMatch && career.skillsMatch.length > 0 && (
                    <div style={styles.skillsContainer}>
                      <div style={styles.skillsLabel}>Required Skills</div>
                      <div style={styles.skillsList}>
                        {career.skillsMatch.slice(0, 3).map((skill, idx) => (
                          <span key={idx} style={styles.skillTag}>{skill}</span>
                        ))}
                        {career.skillsMatch.length > 3 && (
                          <span style={styles.skillTag}>+{career.skillsMatch.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={styles.cardFooter}>
                    {career.salary && (
                      <span style={styles.salaryInfo}>{career.salary}</span>
                    )}
                    {career.averageSalary && !career.salary && (
                      <span style={styles.salaryInfo}>{career.averageSalary}</span>
                    )}
                    <button
                      style={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCareerPath(career.id);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fecaca";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fee2e2";
                      }}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🗺️</div>
              <h3 style={styles.emptyTitle}>No saved career paths</h3>
              <p style={styles.emptyText}>
                Explore career paths and save them to track your progress!
              </p>
              <button
                style={styles.exploreButton}
                onClick={() => {
                  onClose();
                  window.location.href = "/career-paths";
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
                className="explore-button"
              >
                Explore Career Paths
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Career Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <div style={styles.detailsModalContent}>
          {detailsLoading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p>Loading career details...</p>
            </div>
          ) : careerDetails && (
            <>
              <div style={styles.detailsHeader}>
                <div>
                  <h2 style={styles.detailsTitle}>{careerDetails.title}</h2>
                  <p style={{ color: "#667eea", fontSize: "16px", fontWeight: 500 }}>
                    {careerDetails.company || careerDetails.category || "Career Path"}
                  </p>
                </div>
                {careerDetails.match && (
                  <div style={styles.detailsMatch}>
                    {careerDetails.match}% Match
                  </div>
                )}
              </div>

              <div style={styles.detailsGrid}>
                {careerDetails.salary && (
                  <div style={styles.detailsItem}>
                    <div style={styles.detailsItemLabel}>Salary</div>
                    <div style={styles.detailsItemValue}>{careerDetails.salary}</div>
                  </div>
                )}
                {careerDetails.averageSalary && !careerDetails.salary && (
                  <div style={styles.detailsItem}>
                    <div style={styles.detailsItemLabel}>Average Salary</div>
                    <div style={styles.detailsItemValue}>{careerDetails.averageSalary}</div>
                  </div>
                )}
                {careerDetails.timeline && (
                  <div style={styles.detailsItem}>
                    <div style={styles.detailsItemLabel}>Timeline</div>
                    <div style={styles.detailsItemValue}>{careerDetails.timeline}</div>
                  </div>
                )}
                {careerDetails.experience && (
                  <div style={styles.detailsItem}>
                    <div style={styles.detailsItemLabel}>Experience Level</div>
                    <div style={styles.detailsItemValue}>{careerDetails.experience}</div>
                  </div>
                )}
              </div>

              {careerDetails.description && (
                <div style={styles.detailsSection}>
                  <h3 style={styles.detailsSectionTitle}>Description</h3>
                  <p style={styles.detailsText}>{careerDetails.description}</p>
                </div>
              )}

              {careerDetails.skillsMatch && careerDetails.skillsMatch.length > 0 && (
                <div style={styles.detailsSection}>
                  <h3 style={styles.detailsSectionTitle}>Required Skills</h3>
                  <div style={styles.skillsList}>
                    {careerDetails.skillsMatch.map((skill, idx) => (
                      <span key={idx} style={{...styles.skillTag, fontSize: "13px", padding: "6px 14px"}}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {careerDetails.skillsToLearn && careerDetails.skillsToLearn.length > 0 && (
                <div style={styles.detailsSection}>
                  <h3 style={styles.detailsSectionTitle}>Skills to Learn</h3>
                  <div style={styles.skillsList}>
                    {careerDetails.skillsToLearn.map((skill, idx) => (
                      <span key={idx} style={{...styles.skillTag, fontSize: "13px", padding: "6px 14px", background: "#fef3c7", color: "#92400e"}}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {careerDetails.learningSteps && careerDetails.learningSteps.length > 0 && (
                <div style={styles.detailsSection}>
                  <h3 style={styles.detailsSectionTitle}>Learning Roadmap</h3>
                  <ol style={{ paddingLeft: "20px", color: "#4b5563" }}>
                    {careerDetails.learningSteps.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: "8px", fontSize: "15px" }}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                <button
                  style={{
                    padding: "10px 24px",
                    background: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setShowDetailsModal(false)}
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
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SavedCareerPathsModal;