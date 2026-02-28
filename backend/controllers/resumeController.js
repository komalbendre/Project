import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import axios from "axios";

import Profile from "../models/Profile.js";
import User from "../models/User.js";

/**
 * Generate and download resume PDF
 */
export const generateResumePDF = async (req, res) => {
  try {
    const { resumeData, templateId } = req.body; // Get data from request
    const userId = req.user.id;

    console.log("Received resume data:", resumeData);
    console.log("Template ID:", templateId);

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
      bufferPages: true,
    });

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resumeData.personalInfo.name || 'Resume'}_Resume.pdf"`
    );

    // Pipe to response
    doc.pipe(res);

    // Choose template
    switch (templateId || 1) {
      case 1:
        generateModernTemplate(doc, resumeData);
        break;
      case 2:
        generateCreativeTemplate(doc, resumeData);
        break;
      case 3:
        generateClassicTemplate(doc, resumeData);
        break;
      case 4:
        generateMinimalistTemplate(doc, resumeData);
        break;
      default:
        generateModernTemplate(doc, resumeData);
    }

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Don't send JSON response after setting headers
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error generating resume",
        error: error.message,
      });
    }
  }
};

/**
 * Generate resume DOCX (simple placeholder)
 */
export const generateResumeDOCX = async (req, res) => {
  try {
    const { resumeData, templateId } = req.body;
    const userId = req.user.id;

    console.log("Received DOCX request with data:", resumeData);

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    // Generate DOCX content
    const docxContent = generateDOCXContent(resumeData, templateId);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resumeData.personalInfo.name || 'Resume'}_Resume.docx"`
    );

    // For now, send as plain text - you might want to use a proper DOCX library
    res.send(docxContent);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    res.status(500).json({
      message: "Error generating DOCX resume",
      error: error.message,
    });
  }
};

/* ================= TEMPLATE FUNCTIONS ================= */

function generateModernTemplate(doc, data) {
  doc.fillColor("#667eea")
    .rect(0, 0, doc.page.width, 150)
    .fill();

  doc.fillColor("white")
    .fontSize(32)
    .font("Helvetica-Bold")
    .text(data.personalInfo.name, 50, 60);

  doc.fontSize(16).font("Helvetica").text(data.personalInfo.email, 50, 100);

  doc.moveDown(2);

  addSection(doc, "PROFESSIONAL SUMMARY", data.summary);
  addSection(doc, "SKILLS", data.skills.join(", "));

  if (data.experience.length) {
    doc.moveDown();
    doc.fontSize(18).font("Helvetica-Bold").text("EXPERIENCE", { underline: true });

    data.experience.forEach((exp) => {
      doc.moveDown(0.5);
      doc.fontSize(14).font("Helvetica-Bold").text(exp.title);
      doc.fontSize(12).font("Helvetica").text(`${exp.company} | ${exp.duration}`);
      doc.fontSize(11).text(exp.description, { width: 500 });
    });
  }
}

function generateCreativeTemplate(doc, data) {
  generateModernTemplate(doc, data); // placeholder
}

function generateClassicTemplate(doc, data) {
  generateModernTemplate(doc, data); // placeholder
}

function generateMinimalistTemplate(doc, data) {
  generateModernTemplate(doc, data); // placeholder
}

function addSection(doc, title, content) {
  doc.fontSize(18).font("Helvetica-Bold").text(title, { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).font("Helvetica").text(content || "—", { width: 500 });
  doc.moveDown();
}

function generateDOCXContent(data, templateId) {
  return `
RESUME - ${data.personalInfo.name || "Candidate"}

CONTACT INFORMATION:
Email: ${data.personalInfo.email || ""}
Phone: ${data.personalInfo.phone || ""}
Location: ${data.personalInfo.location || ""}
LinkedIn: ${data.personalInfo.linkedin || ""}
GitHub: ${data.personalInfo.github || ""}
Portfolio: ${data.personalInfo.portfolio || ""}

PROFESSIONAL SUMMARY:
${data.summary || ""}

TECHNICAL SKILLS:
${Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || ""}

EXPERIENCE:
${data.experience && data.experience.length > 0
    ? data.experience.map(exp => 
        `• ${exp.title} at ${exp.company} (${exp.duration || 'Not specified'})\n  ${exp.description || ''}`
      ).join('\n\n')
    : "No experience listed"
  }

EDUCATION:
${data.education && data.education.length > 0
    ? data.education.map(edu => 
        `• ${edu.degree} from ${edu.institution} (${edu.duration || 'Not specified'})\n  ${edu.description || ''}`
      ).join('\n\n')
    : "No education listed"
  }

PROJECTS:
${data.projects && data.projects.length > 0
    ? data.projects.map(proj => 
        `• ${proj.name}\n  ${proj.description || ''}\n  Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : ''}`
      ).join('\n\n')
    : "No projects listed"
  }

CERTIFICATIONS:
${Array.isArray(data.certifications) ? data.certifications.join(', ') : data.certifications || "None"}

LANGUAGES:
${Array.isArray(data.languages) ? data.languages.join(', ') : data.languages || "Not specified"}
`;
}