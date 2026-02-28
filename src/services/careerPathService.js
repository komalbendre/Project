export const getCareerPaths = async () => {
  const response = await fetch("http://localhost:5000/api/career-paths");
  return response.json();
};
