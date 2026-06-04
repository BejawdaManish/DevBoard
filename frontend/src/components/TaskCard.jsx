function TaskCard({
  task,
  onUpdate,
  onDelete,
}) {

  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "Completed";

  return (
    <div
      className={
        isOverdue
          ? "task-card overdue"
          : "task-card"
      }
    >
      <h3>{task.title}</h3>

      <p>{task.description}</p>

      <p>
        📅 Due:
        {task.due_date
          ? new Date(
              task.due_date
            ).toLocaleDateString()
          : " No Date"}
      </p>
       <p>
        Priority:
        {task.priority === "High"
          ? " 🔴 High"
          : task.priority === "Medium"
          ? " 🟡 Medium"
          : " 🟢 Low"}
      </p>

      <span
        className={
          task.status === "Completed"
            ? "completed"
            : "pending"
        }
      >
        {task.status}
      </span>

      <div className="btn-group">

        {task.status !== "todo" && (
          <button
            onClick={() =>
              onUpdate(task.id, "todo")
            }
          >
            Todo
          </button>
        )}

        {task.status !== "In Progress" && (
          <button
            onClick={() =>
              onUpdate(
                task.id,
                "In Progress"
              )
            }
          >
            Progress
          </button>
        )}

        {task.status !== "Completed" && (
          <button
            onClick={() =>
              onUpdate(
                task.id,
                "Completed"
              )
            }
          >
            Complete
          </button>
        )}

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