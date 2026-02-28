import OpenAI from "openai";

// ===============================
// GROQ CONFIG
// ===============================
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// ===============================
// AI CAREER SUGGESTIONS (Groq)
// ===============================
export const getCareerSuggestions = async (
    skills,
    experience = "entry",
    userProfile = {}
) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("Groq API key is not configured");
        }

        const prompt = `
Generate 5 to 7 realistic career suggestions for this user.

USER INFORMATION:
Skills: ${skills.join(", ")}
Experience Level: ${experience}

Return strictly valid JSON in this format:

{
  "careers": [
    {
      "title": "string",
      "match": number,
      "reason": "string",
      "missingSkills": ["string"],
      "salary": "string",
      "growth": "string",
      "timeline": "string",
      "recommendedCourses": ["string"]
    }
  ]
}
`;

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a professional career advisor AI. Return strictly valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });
        console.log("Groq raw:", completion);
        const content = completion.choices[0].message.content;
        console.log("Groq content:", content);

        const parsed = JSON.parse(content);

        return parsed.careers;

    } catch (error) {
        console.error("Error getting career suggestions from Groq:", error.message);
        throw error;
    }
};

// ===============================
// FALLBACK SYSTEM (UNCHANGED)
// ===============================
export const getFallbackCareerSuggestions = (skills) => {
    const skillLower = skills.map((s) => s.toLowerCase());

    const hasCommunication = skillLower.some((s) =>
        s.includes("communication")
    );
    const hasTeamwork = skillLower.some((s) =>
        s.includes("team")
    );

    const careerDatabase = [
        {
            title: "Full Stack Developer",
            baseMatch: 85,
            reason:
                "Your MERN stack skills (React, Node.js, MongoDB) are perfect for full-stack development",
            requiredSkills: ["React", "Node.js", "MongoDB", "Express.js", "REST APIs"],
            missingSkills: ["Express.js", "REST APIs", "Authentication"],
            salary: "$70k - $120k",
            growth: "Very High",
            timeline: "3-6 months",
            recommendedCourses: [
                "MERN Stack Course",
                "Node.js API Masterclass",
                "MongoDB University",
            ],
        },
        {
            title: "Backend Developer",
            baseMatch: 80,
            reason:
                "Your Node.js and database skills provide a strong backend foundation",
            requiredSkills: [
                "Node.js",
                "MongoDB",
                "MySQL",
                "REST APIs",
                "Authentication",
            ],
            missingSkills: [
                "Express.js",
                "API Design",
                "Database Optimization",
            ],
            salary: "$75k - $125k",
            growth: "High",
            timeline: "4-8 months",
            recommendedCourses: [
                "Backend Development with Node.js",
                "Database Design",
                "System Design",
            ],
        },
        {
            title: "Frontend Developer",
            baseMatch: 75,
            reason:
                "Your React skills can lead to a specialized frontend career",
            requiredSkills: [
                "React",
                "JavaScript",
                "HTML/CSS",
                "TypeScript",
                "State Management",
            ],
            missingSkills: ["TypeScript", "Next.js", "Advanced State Management"],
            salary: "$65k - $110k",
            growth: "High",
            timeline: "2-4 months",
            recommendedCourses: [
                "Advanced React",
                "TypeScript Masterclass",
                "Modern CSS",
            ],
        },
    ];

    const enhancedSuggestions = careerDatabase.map((career) => {
        const requiredSkillsLower = career.requiredSkills.map((s) =>
            s.toLowerCase()
        );

        const matchedSkills = requiredSkillsLower.filter((requiredSkill) =>
            skillLower.some((userSkill) =>
                userSkill.includes(requiredSkill)
            )
        );

        const skillsMatchPercent =
            requiredSkillsLower.length > 0
                ? (matchedSkills.length / requiredSkillsLower.length) * 100
                : 50;

        const matchPercentage = Math.min(
            98,
            Math.max(
                40,
                Math.round((skillsMatchPercent * 0.7) + (career.baseMatch * 0.3))
            )
        );

        return {
            ...career,
            match: matchPercentage,
            matchScore: matchPercentage,
        };
    });

    return enhancedSuggestions
        .sort((a, b) => b.match - a.match)
        .slice(0, 5);
};
