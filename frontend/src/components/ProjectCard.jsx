function ProjectCard({
  project,
  fetchTasks,
  deleteProject,
}) {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>

      <p>{project.description}</p>

      <div className="btn-group">
        <button
          onClick={() =>
            fetchTasks(project.id)
          }
        >
          View Tasks
        </button>

        <button
          onClick={() =>
            deleteProject(project.id)
          }
        >
          Delete
        </button>
        <button
  onClick={() =>
    editProject(
      project.id,
      project.name,
      project.description
    )
  }
>
  Edit
</button>
      </div>
    </div>
  );
}

export default ProjectCard;