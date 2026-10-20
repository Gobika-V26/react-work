import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");

        if (!response.ok) {
          throw new Error("Unable to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects =
    category === "All"
      ? projects
      : projects.filter(
          (project) => project.category === category
        );

  if (loading) {
    return <p className="container">Loading projects...</p>;
  }

  if (error) {
    return <p className="container">Error: {error}</p>;
  }

  return (
    <div className="container">
      <h1>Project Management Application</h1>
      <p>View projects and explore their details.</p>

      <label htmlFor="category">Filter by category: </label>

      <select
        id="category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Web Development">Web Development</option>
        <option value="AI">AI</option>
        <option value="Mobile App">Mobile App</option>
      </select>

      <div className="project-list">
        {filteredProjects.length === 0 ? (
          <p>No projects available in this category.</p>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectList;