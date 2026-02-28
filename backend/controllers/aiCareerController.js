import Profile from '../models/Profile.js';
import User from '../models/User.js';
import { getCareerSuggestions, getFallbackCareerSuggestions } from '../services/aiService.js';

// @desc    Get AI-powered career suggestions based on user skills
// @route   POST /api/ai/career-suggestions
// @access  Private
export const getAICareerSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user profile to access skills
    const profile = await Profile.findOne({ userId });
    const user = await User.findById(userId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please complete your profile first.'
      });
    }
    
    // Extract skills from profile
    const technicalSkills = profile.technicalSkills || [];
    const softSkills = profile.softSkills || [];
    const allSkills = [...technicalSkills, ...softSkills];
    
    if (allSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No skills found in your profile. Please add skills to get career suggestions.'
      });
    }
    
    // Determine experience level
    let experienceLevel = 'entry';
    if (profile.experience && profile.experience.length > 0) {
      const yearsOfExperience = profile.experience.reduce((total, exp) => {
        // Simple calculation - could be improved
        return total + 1;
      }, 0);
      
      if (yearsOfExperience >= 5) experienceLevel = 'senior';
      else if (yearsOfExperience >= 2) experienceLevel = 'mid';
      else experienceLevel = 'entry';
    }
    
    // Prepare user data for AI
    const userProfile = {
      currentRole: profile.experience?.[0]?.title || '',
      education: profile.education || [],
      interests: profile.bio || ''
    };
    
    try {
      // Try to get AI-powered suggestions
      const aiSuggestions = await getCareerSuggestions(allSkills, experienceLevel, userProfile);
      
      // Calculate match scores based on skills overlap for each suggestion
      const suggestionsWithMatch = aiSuggestions.map(suggestion => {
        // Ensure match is between 0-100
        const matchScore = Math.min(100, Math.max(0, suggestion.match || 70));
        return {
          ...suggestion,
          match: matchScore,
          matchScore: matchScore // For compatibility
        };
      });
      
      return res.status(200).json({
        success: true,
        message: 'AI career suggestions generated successfully',
        data: suggestionsWithMatch,
        source: 'ai'
      });
      
    } // Inside the catch block where fallback is used:
catch (aiError) {
  console.error('AI service failed, using fallback:', aiError.message);
  
  // Log the skills being used for fallback
  console.log('Generating fallback suggestions for skills:', allSkills);
  
  // Fallback to rule-based suggestions
  const fallbackSuggestions = getFallbackCareerSuggestions(allSkills);
  
  // Log the generated fallback suggestions
  console.log('Fallback suggestions generated:', JSON.stringify(fallbackSuggestions, null, 2));
  
  return res.status(200).json({
    success: true,
    message: 'Career suggestions generated (fallback mode)',
    data: fallbackSuggestions,
    source: 'fallback'
  });
}
    
  } catch (error) {
    console.error('Error generating career suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate career suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get detailed career path with roadmap
// @route   POST /api/ai/career-roadmap
// @access  Private
export const getCareerRoadmap = async (req, res) => {
  try {
    const { careerTitle, currentSkills, targetRole } = req.body;
    const userId = req.user._id;
    
    if (!careerTitle) {
      return res.status(400).json({
        success: false,
        message: 'Career title is required'
      });
    }
    
    // Get user profile
    const profile = await Profile.findOne({ userId });
    
    const userSkills = currentSkills || (profile ? [...(profile.technicalSkills || []), ...(profile.softSkills || [])] : []);
    
    // In a production app, you would call Gemini here for a detailed roadmap
    // For now, return a structured roadmap
    const roadmap = {
      career: careerTitle,
      targetRole: targetRole || careerTitle,
      timeline: {
        "3 Months": {
          focus: "Foundation Building",
          skills: ["Master core technologies", "Build 2-3 projects", "Contribute to open source"],
          resources: ["Online courses", "Documentation", "Practice platforms"]
        },
        "6 Months": {
          focus: "Skill Deepening",
          skills: ["Learn advanced concepts", "System design basics", "Networking"],
          resources: ["Advanced tutorials", "Meetups/conferences", "Mentorship"]
        },
        "12 Months": {
          focus: "Specialization & Job Ready",
          skills: ["Portfolio development", "Interview preparation", "Apply for jobs"],
          resources: ["Mock interviews", "Resume optimization", "Job applications"]
        }
      },
      recommendedLearning: [
        { name: "TypeScript", priority: "high", reason: "Industry standard for large applications" },
        { name: "System Design", priority: "medium", reason: "Essential for senior roles" },
        { name: "Cloud Services", priority: "medium", reason: "Modern deployment requirements" }
      ],
      projects: [
        "Build a full-stack application",
        "Contribute to an open-source project",
        "Create a portfolio website"
      ]
    };
    
    res.status(200).json({
      success: true,
      message: 'Career roadmap generated',
      data: roadmap
    });
    
  } catch (error) {
    console.error('Error generating career roadmap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate career roadmap'
    });
  }
};

// @desc    Analyze skill gaps for a specific career
// @route   POST /api/ai/skill-gap-analysis
// @access  Private
export const analyzeSkillGap = async (req, res) => {
  try {
    const { careerTitle, targetSkills } = req.body;
    const userId = req.user._id;
    
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    const userSkills = [...(profile.technicalSkills || []), ...(profile.softSkills || [])];
    const targetSkillsArray = targetSkills || [];
    
    // Find skill gaps
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    const missingSkills = targetSkillsArray.filter(skill => 
      !userSkillsLower.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill)
      )
    );
    
    const matchedSkills = targetSkillsArray.filter(skill => 
      userSkillsLower.some(userSkill => 
        userSkill.includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill)
      )
    );
    
    const matchPercentage = targetSkillsArray.length > 0 
      ? Math.round((matchedSkills.length / targetSkillsArray.length) * 100)
      : 0;
    
    // Generate learning recommendations
    const learningResources = missingSkills.map(skill => ({
      skill,
      resources: [
        `Online course for ${skill}`,
        `Practice projects using ${skill}`,
        `Documentation and tutorials`
      ],
      estimatedTime: skill.length > 10 ? '2-3 weeks' : '1-2 weeks'
    }));
    
    res.status(200).json({
      success: true,
      message: 'Skill gap analysis completed',
      data: {
        careerTitle,
        matchPercentage,
        matchedSkills,
        missingSkills,
        learningResources,
        userSkillsCount: userSkills.length,
        targetSkillsCount: targetSkillsArray.length
      }
    });
    
  } catch (error) {
    console.error('Error analyzing skill gap:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze skill gap'
    });
  }
};