import CareerPath from "../models/CareerPath.js";

// @desc    Get all career paths
// @route   GET /api/career-paths
// @access  Public
export const getAllCareerPaths = async (req, res) => {
  try {
    const careerPaths = await CareerPath.find();
    res.status(200).json(careerPaths);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch career paths" });
  }
};

// @desc    Get career path by ID
// @route   GET /api/career-paths/:id
// @access  Public
export const getCareerPathById = async (req, res) => {
  try {
    const careerPath = await CareerPath.findById(req.params.id);

    if (!careerPath) {
      return res.status(404).json({ message: "Career path not found" });
    }

    res.status(200).json(careerPath);
  } catch (error) {
    res.status(500).json({ message: "Error fetching career path" });
  }
};
