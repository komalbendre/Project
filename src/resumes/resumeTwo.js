// resumeTwo.js - Classic Resume Template
import React from 'react';
import './resumeTwo.css';

const ResumeTwo = ({ resumeData, isPreview = false }) => {
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
  const containerClass = isPreview ? "resume-two-preview-container" : "resume-two-container";

  return (
    <div className={containerClass}>
      {/* Header Section */}
      <header className="resume-two-header">
        <div className="header-content">
          <h1 className="resume-two-name">{profile.personalInfo?.name || "Your Name"}</h1>
          <h2 className="resume-two-title">{profile.personalInfo?.title || "Professional"}</h2>
          <div className="resume-two-contact-info">
            {profile.personalInfo?.email && (
              <div className="contact-item">
                <span className="contact-label">Email:</span> {profile.personalInfo.email}
              </div>
            )}
            {profile.personalInfo?.phone && (
              <div className="contact-item">
                <span className="contact-label">Phone:</span> {profile.personalInfo.phone}
              </div>
            )}
            {profile.personalInfo?.location && (
              <div className="contact-item">
                <span className="contact-label">Location:</span> {profile.personalInfo.location}
              </div>
            )}
            {profile.personalInfo?.linkedin && (
              <div className="contact-item">
                <span className="contact-label">LinkedIn:</span> {profile.personalInfo.linkedin}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="resume-two-main">
        {/* Summary Section */}
        {profile.summary && (
          <section className="resume-two-section">
            <h3 className="section-title">
              <span className="section-icon">📋</span>
              Professional Summary
            </h3>
            <div className="section-content">
              <p className="summary-text">{profile.summary}</p>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <section className="resume-two-section">
            <h3 className="section-title">
              <span className="section-icon">💼</span>
              Work Experience
            </h3>
            <div className="section-content">
              {profile.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <div className="experience-title-row">
                      <h4 className="job-title">{exp.title}</h4>
                      <span className="experience-date">{exp.duration}</span>
                    </div>
                    <div className="experience-subtitle-row">
                      <span className="company-name">{exp.company}</span>
                      {exp.location && <span className="company-location">{exp.location}</span>}
                    </div>
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

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <section className="resume-two-section">
            <h3 className="section-title">
              <span className="section-icon">🎓</span>
              Education
            </h3>
            <div className="section-content">
              {profile.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <div className="education-title-row">
                      <h4 className="degree-name">{edu.degree}</h4>
                      <span className="education-date">{edu.duration}</span>
                    </div>
                    <div className="education-subtitle-row">
                      <span className="institution-name">{edu.institution}</span>
                      {edu.location && <span className="institution-location">{edu.location}</span>}
                    </div>
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

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <section className="resume-two-section">
            <h3 className="section-title">
              <span className="section-icon">🛠️</span>
              Skills
            </h3>
            <div className="section-content">
              <div className="skills-grid">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <section className="resume-two-section">
            <h3 className="section-title">
              <span className="section-icon">🚀</span>
              Projects
            </h3>
            <div className="section-content">
              {profile.projects.map((project, index) => (
                <div key={index} className="project-item">
                  <div className="project-header">
                    <h4 className="project-name">{project.name}</h4>
                  </div>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="project-technologies">
                      <span className="tech-label">Technologies:</span>
                      <div className="tech-tags">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Section for Certifications & Languages */}
        {(profile.certifications || profile.languages) && (
          <div className="two-column-section">
            {/* Certifications Section */}
            {profile.certifications && profile.certifications.length > 0 && (
              <section className="resume-two-section half-width">
                <h3 className="section-title">
                  <span className="section-icon">🏆</span>
                  Certifications
                </h3>
                <div className="section-content">
                  {/* {profile.certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                      <div className="certification-name">{cert}</div>
                    </div>
                  ))} */}
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
                </div>
              </section>
            )}

            {/* Languages Section */}
            {profile.languages && profile.languages.length > 0 && (
              <section className="resume-two-section half-width">
                <h3 className="section-title">
                  <span className="section-icon">🌐</span>
                  Languages
                </h3>
                <div className="section-content">
                  {profile.languages.map((lang, index) => (
                    <div key={index} className="language-item">
                      <span className="language-name">{lang}</span>
                      <span className="language-proficiency">(Fluent)</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="resume-two-footer">
        <div className="footer-content">
          <p className="footer-text">References available upon request</p>
        </div>
      </footer>
    </div>
  );
};

export default ResumeTwo;