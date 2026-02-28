// resumeThree.js - Minimalist Resume Template
import React from 'react';
import './resumeThree.css';

const ResumeThree = ({ resumeData, isPreview = false }) => {
  // If no resumeData is passed, use empty default
  const profile = resumeData || {
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: []
  };

  // For preview mode in ResumeBuilder
  const containerClass = isPreview ? "resume-three-preview-container" : "resume-three-container";

  return (
    <div className={containerClass}>
      {/* Header Section - Centered and minimal */}
      <header className="resume-three-header">
        <div className="header-content">
          <h1 className="resume-three-name">{profile.personalInfo?.name || "Your Name"}</h1>
          <div className="resume-three-title">{profile.personalInfo?.title || "Professional"}</div>
          <div className="contact-line">
            {profile.personalInfo?.email && <span className="contact-item">{profile.personalInfo.email}</span>}
            {profile.personalInfo?.phone && <span className="contact-divider">•</span>}
            {profile.personalInfo?.phone && <span className="contact-item">{profile.personalInfo.phone}</span>}
            {profile.personalInfo?.location && <span className="contact-divider">•</span>}
            {profile.personalInfo?.location && <span className="contact-item">{profile.personalInfo.location}</span>}
          </div>
        </div>
      </header>

      {/* Main Content with subtle separation */}
      <main className="resume-three-main">
        {/* Summary - Very brief */}
        {profile.summary && (
          <section className="resume-three-section summary-section">
            <div className="section-content">
              <p className="summary-text">{profile.summary}</p>
            </div>
          </section>
        )}

        <div className="content-columns">
          {/* Left Column - Experience & Education */}
          <div className="left-column">
            {/* Experience - Clean and minimal */}
            {profile.experience && profile.experience.length > 0 && (
              <section className="resume-three-section">
                <h3 className="section-title">EXPERIENCE</h3>
                <div className="section-content">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <div className="experience-header">
                        <div className="job-title">{exp.title}</div>
                        <div className="company-info">
                          <span className="company-name">{exp.company}</span>
                          {exp.location && <span className="company-location">{exp.location}</span>}
                        </div>
                        <div className="experience-date">{exp.duration}</div>
                      </div>
                      {exp.description && (
                        <div className="experience-description">
                          <p>{exp.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education - Simple layout */}
            {profile.education && profile.education.length > 0 && (
              <section className="resume-three-section">
                <h3 className="section-title">EDUCATION</h3>
                <div className="section-content">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <div className="education-header">
                        <div className="degree-name">{edu.degree}</div>
                        <div className="institution-info">
                          <span className="institution-name">{edu.institution}</span>
                          {edu.location && <span className="institution-location">{edu.location}</span>}
                        </div>
                        <div className="education-date">{edu.duration}</div>
                      </div>
                      {edu.description && (
                        <div className="education-description">
                          <p>{edu.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Skills, Projects, etc. */}
          <div className="right-column">
            {/* Skills - Clean list */}
            {profile.skills && profile.skills.length > 0 && (
              <section className="resume-three-section">
                <h3 className="section-title">SKILLS</h3>
                <div className="section-content">
                  <div className="skills-list">
                    {profile.skills.map((skill, index) => (
                      <div key={index} className="skill-item">
                        <span className="skill-dot">•</span>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Projects - Minimal details */}
            {profile.projects && profile.projects.length > 0 && (
              <section className="resume-three-section">
                <h3 className="section-title">PROJECTS</h3>
                <div className="section-content">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="project-item">
                      <div className="project-header">
                        <div className="project-name">{project.name}</div>
                      </div>
                      {project.description && (
                        <p className="project-description">{project.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications - Simple list */}
            {/* {profile.certifications && profile.certifications.length > 0 && (
              <section className="resume-three-section">
                <h3 className="section-title">CERTIFICATIONS</h3>
                <div className="section-content">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                      <span className="cert-dash">—</span>
                      {cert}
                    </div>
                  ))}
                </div>
              </section>
            )} */}
            {profile.certifications && profile.certifications.length > 0 && (
              <section className="resume-two-section half-width">
                <h3 className="section-title">
                  <span className="section-icon">🏆</span>
                  Certifications
                </h3>
                <div className="section-content">
                  {profile.certifications.map((cert, index) => {
                    // Handle both string and object certifications
                    const certName = typeof cert === 'string' ? cert : (cert.name || cert.title || JSON.stringify(cert));
                    return (
                      <div key={index} className="certification-item">
                        <div className="certification-name">{certName}</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Languages - Minimal */}
            {profile.languages && profile.languages.length > 0 && (
              <section className="resume-three-section">
                <h3 className="section-title">LANGUAGES</h3>
                <div className="section-content">
                  <div className="languages-list">
                    {profile.languages.map((lang, index) => (
                      <div key={index} className="language-item">
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Very minimal footer */}
      <footer className="resume-three-footer">
        <div className="footer-line"></div>
      </footer>
    </div>
  );
};

export default ResumeThree;