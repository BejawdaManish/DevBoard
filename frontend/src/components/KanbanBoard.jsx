function KanbanBoard({ tasks }) {
  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  );

  const progressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  );

  return (
    <div className="kanban-board">

      <div className="kanban-column">
        <h3>📝 Todo</h3>

        {todoTasks.map((task) => (
          <div
            key={task.id}
            className="kanban-task"
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>
          </div>
        ))}
      </div>

      <div className="kanban-column">
        <h3>🟡 In Progress</h3>

        {progressTasks.map((task) => (
          <div
            key={task.id}
            className="kanban-task"
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>
          </div>
        ))}
      </div>

      <div className="kanban-column">
        <h3>✅ Completed</h3>

        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="kanban-task"
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default KanbanBoard;