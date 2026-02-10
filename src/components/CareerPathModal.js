import { useEffect, useState } from "react";
import axios from "axios";

const CareerPathModal = ({ careerId }) => {
  const [career, setCareer] = useState(null);

  useEffect(() => {
    if (!careerId) return;

    axios
      .get(`http://localhost:5000/api/career-paths/${careerId}`)
      .then(res => setCareer(res.data))
      .catch(err => console.error(err));
  }, [careerId]);

  if (!career) return <p>Loading...</p>;

  return (
    <div>
      <h2>{career.title}</h2>
      <p>{career.description}</p>

      <h4>Required Skills</h4>
      <ul>
        {career.requiredSkills.map((skill, i) => (
          <li key={i}>{skill}</li>
        ))}
      </ul>

      <h4>Learning Roadmap</h4>
      <ol>
        {career.learningSteps?.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <h4>Average Salary</h4>
      <p>{career.averageSalary || "Varies by region"}</p>
    </div>
  );
};

export default CareerPathModal;
