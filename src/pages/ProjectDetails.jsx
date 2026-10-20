import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      setLoading(true);
      setError("");
      setProject(null);

      try {
        const response = await fetch(`/api/projects/${id}`);

        if (!response.ok) {
          const result = await response.json();
          throw new Error(
            result.message || "Project not found"
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setProject(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="container">Loading project...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <h2>Unable to load project</h2>
        <p>{error}</p>
        <Link to="/">Back to Project List</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>{project.name}</h1>

      <div className="details-card">
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Category:</strong> {project.category}</p>
        <p><strong>Status:</strong> {project.status}</p>
        <p>
          <strong>Deadline:</strong>{" "}
          {project.deadline
            ? project.deadline.slice(0, 10)
            : "Not specified"}
        </p>
      </div>

      <Link to="/">Back to Project List</Link>
    </div>
  );
}

export default ProjectDetails;