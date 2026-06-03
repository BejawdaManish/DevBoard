import { useEffect, useState } from "react";
import API from "../services/api";

import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [title, setTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const [selectedProject, setSelectedProject] = useState(null);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progress =
    tasks.length > 0
      ? (completedTasks / tasks.length) * 100
      : 0;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();

    try {
      await API.post("/projects", {
        name,
        description,
      });

      setName("");
      setDescription("");

      fetchProjects();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`);

      if (selectedProject === id) {
        setSelectedProject(null);
        setTasks([]);
      }

      fetchProjects();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await API.get(
        `/projects/${projectId}/tasks`
      );

      setTasks(res.data);
      setSelectedProject(projectId);
    } catch (err) {
      console.log(err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title,
        description: taskDescription,
        project_id: selectedProject,
      });

      setTitle("");
      setTaskDescription("");

      fetchTasks(selectedProject);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks(selectedProject);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}`, {
        status,
      });

      fetchTasks(selectedProject);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Dashboard 🚀</h1>

        {/* Statistics Section */}

        <div className="stats">
          <div className="stat-card">
            <h3>{projects.length}</h3>
            <p>Total Projects</p>
          </div>

          <div className="stat-card">
            <h3>{tasks.length}</h3>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card">
            <h3>{completedTasks}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>

        {/* Progress Bar */}

        <div className="progress-section">
          <h3>Project Progress</h3>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>

          <p>{Math.round(progress)}% Completed</p>
        </div>

        <hr />

        {/* Create Project */}

        <h2>Create Project</h2>

        <form onSubmit={createProject}>
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <br />
          <br />

          <button type="submit">
            Create Project
          </button>
        </form>

        <hr />

        {/* Projects */}

        <h2>Projects</h2>

        {projects.length === 0 ? (
          <p>No Projects Found</p>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              fetchTasks={fetchTasks}
              deleteProject={deleteProject}
            />
          ))
        )}

        {/* Tasks */}

        {selectedProject && (
          <>
            <hr />

            <h2>Tasks</h2>

            <form onSubmit={createTask}>
              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <br />
              <br />

              <input
                type="text"
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) =>
                  setTaskDescription(
                    e.target.value
                  )
                }
              />

              <br />
              <br />

              <button type="submit">
                Add Task
              </button>
            </form>

            <hr />

            {tasks.length === 0 ? (
              <p>No Tasks Found</p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  updateStatus={updateStatus}
                  deleteTask={deleteTask}
                />
              ))
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;