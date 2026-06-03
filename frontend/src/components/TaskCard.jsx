function TaskCard({
  task,
  onComplete,
  onDelete,
}) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <span
        className={
          task.status === "Completed"
            ? "status completed"
            : "status pending"
        }
      >
        {task.status}
      </span>

      <div className="btn-group">
        <button
          onClick={() =>
            onComplete(task.id)
          }
        >
          Complete
        </button>

        <button
          onClick={() =>
            onDelete(task.id)
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;