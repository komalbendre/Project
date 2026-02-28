export const getCareerAdvice = async (skills) => {
  const res = await fetch("http://localhost:5000/api/ai/career-advice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ skills })
  });

  return res.json();
};
