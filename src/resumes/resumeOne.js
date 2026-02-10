// resumeOne.js
import React from 'react';
import './resumeOne.css';

const ResumeOne = ({ resumeData, isPreview = false }) => {
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

  // Format the data to match resumeOne's expected structure
  const formattedProfile = {
    personalInfo: {
      name: profile.personalInfo?.name || "Your Name",
      title: profile.personalInfo?.title || "",
      email: profile.personalInfo?.email || "",
      phone: profile.personalInfo?.phone || "",
      location: profile.personalInfo?.location || "",
      linkedin: profile.personalInfo?.linkedin || "",
      github: profile.personalInfo?.github || "",
      portfolio: profile.personalInfo?.portfolio || ""
    },
    summary: profile.summary || "",
    experience: profile.experience?.map(exp => ({
      id: exp.id || Date.now(),
      title: exp.title || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: exp.duration?.split(' - ')[0] || "",
      endDate: exp.duration?.split(' - ')[1] || "Present",
      current: !exp.duration?.includes('Present') ? false : true,
      description: exp.description ? [exp.description] : []
    })) || [],
    education: profile.education?.map(edu => ({
      id: edu.id || Date.now(),
      degree: edu.degree || "",
      institution: edu.institution || "",
      location: edu.location || "",
      graduationDate: edu.duration || "",
      gpa: edu.gpa || "",
      honors: edu.honors || []
    })) || [],
    skills: profile.skills?.length > 0 ? [{
      category: "Technical Skills",
      items: profile.skills
    }] : [],
    projects: profile.projects?.map(project => ({
      id: project.id || Date.now(),
      name: project.name || "",
      description: project.description || "",
      technologies: project.technologies || [],
      link: project.link || ""
    })) || [],
    certifications: profile.certifications?.map(cert => {
      if (typeof cert === 'string') {
        return {
          id: Date.now() + Math.random(),
          name: cert,
          issuer: "",
          date: "",
          credentialId: ""
        };
      } else if (cert && typeof cert === 'object') {
        return {
          id: cert.id || Date.now() + Math.random(),
          name: cert.name || cert.title || JSON.stringify(cert),
          issuer: cert.issuer || "",
          date: cert.date || cert.issueDate || "",
          credentialId: cert.credentialId || ""
        };
      }
      return {
        id: Date.now() + Math.random(),
        name: String(cert),
        issuer: "",
        date: "",
        credentialId: ""
      };
    }) || [],
    languages: profile.languages?.map(lang => ({
      language: lang,
      proficiency: "Professional Working Proficiency"
    })) || []
  };

  // For preview mode in ResumeBuilder, use a smaller container
  const containerClass = isPreview ? "resume-one-preview-container" : "resume-container";

  return (
    <div className={containerClass}>
      {/* Header Section */}
      <header className="resume-header">
        <h1 className="name">{formattedProfile.personalInfo.name}</h1>
        <div className="contact-info">
          {formattedProfile.personalInfo.email && <span>{formattedProfile.personalInfo.email}</span>}
          {formattedProfile.personalInfo.email && formattedProfile.personalInfo.phone && <span>•</span>}
          {formattedProfile.personalInfo.phone && <span>{formattedProfile.personalInfo.phone}</span>}
          {formattedProfile.personalInfo.linkedin && (
            <>
              <span>•</span>
              <a href={formattedProfile.personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </>
          )}
          {formattedProfile.personalInfo.github && (
            <>
              <span>•</span>
              <a href={formattedProfile.personalInfo.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </>
          )}
        </div>
      </header>

      {/* Summary Section - Only show if summary exists */}
      {formattedProfile.summary && (
        <section className="resume-section">
          <h3 className="section-title">Professional Summary</h3>
          <p className="summary">{formattedProfile.summary}</p>
        </section>
      )}

      {/* Experience Section - Only show if there are experiences */}
      {formattedProfile.experience.length > 0 && (
        <section className="resume-section">
          <h3 className="section-title">Work Experience</h3>
          {formattedProfile.experience.map((exp, index) => (
            <div key={exp.id || index} className="experience-item">
              <div className="experience-header">
                <div className="job-title">{exp.title}</div>
                <div className="company">{exp.company}</div>
                <div className="experience-details">
                  <span className="date">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
                  </span>
                </div>
              </div>
              {exp.description && exp.description.length > 0 && (
                <ul className="experience-description">
                  {exp.description.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education Section - Only show if there are educations */}
      {formattedProfile.education.length > 0 && (
        <section className="resume-section">
          <h3 className="section-title">Education</h3>
          {formattedProfile.education.map((edu, index) => (
            <div key={edu.id || index} className="education-item">
              <div className="education-header">
                <div className="degree">{edu.degree}</div>
                <div className="institution">{edu.institution}</div>
                <div className="education-details">
                  <span className="graduation-date">{edu.graduationDate}</span>
                  {edu.gpa && <span className="gpa">GPA: {edu.gpa}</span>}
                </div>
              </div>
              {edu.honors && edu.honors.length > 0 && (
                <div className="honors">
                  <strong>Honors:</strong> {edu.honors.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills Section - Only show if there are skills */}
      {formattedProfile.skills.length > 0 && (
        <section className="resume-section">
          <h3 className="section-title">Skills</h3>
          <div className="skills-container">
            {formattedProfile.skills.map((skillCategory, index) => (
              <div key={index} className="skill-category">
                <h4 className="skill-category-title">{skillCategory.category}</h4>
                <div className="skill-items">
                  {skillCategory.items.map((item, itemIndex) => (
                    <span key={itemIndex}>
                      {item}
                      {itemIndex < skillCategory.items.length - 1 && ' • '}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section - Only show if there are projects */}
      {formattedProfile.projects && formattedProfile.projects.length > 0 && (
        <section className="resume-section">
          <h3 className="section-title">Projects</h3>
          {formattedProfile.projects.map((project, index) => (
            <div key={project.id || index} className="project-item">
              <div className="project-header">
                <div className="project-name">{project.name}</div>
                {project.link && (
                  <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                    View Project
                  </a>
                )}
              </div>
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="project-technologies">
                  <strong>Technologies:</strong>{' '}
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="technology-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications Section - Only show if there are certifications */}
      {formattedProfile.certifications && formattedProfile.certifications.length > 0 && (
        <section className="resume-section">
          <h3 className="section-title">Certifications</h3>
          {formattedProfile.certifications.map((cert, index) => (
            <div key={cert.id || index} className="certification-item">
              <div className="certification-name">{cert.name}</div>
              <div className="certification-details">
                <span className="issuer">{cert.issuer}</span>
                <span className="date">{cert.date}</span>
                {cert.credentialId && (
                  <span className="credential-id">Credential ID: {cert.credentialId}</span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Empty State - Show message if no data at all */}
      {!formattedProfile.personalInfo.name && 
       !formattedProfile.summary && 
       formattedProfile.experience.length === 0 && 
       formattedProfile.education.length === 0 && 
       formattedProfile.skills.length === 0 && (
        <div className="empty-state">
          <h3>No Resume Data Found</h3>
          <p>Please fill in your profile information to generate a resume.</p>
          <button 
            onClick={() => window.location.href = '/edit-profile'}
            className="edit-profile-btn"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeOne;