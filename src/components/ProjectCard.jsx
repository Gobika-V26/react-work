import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>

      <p>{project.description}</p>
      <p><strong>Category:</strong> {project.category}</p>
      <p><strong>Status:</strong> {project.status}</p>

      <p>
        <strong>Deadline:</strong>{" "}
        {project.deadline
          ? project.deadline.slice(0, 10)
          : "Not specified"}
      </p>

      <Link to={`/projects/${project._id}`}>
        View Details
      </Link>
    </div>
  );
}

export default ProjectCard;