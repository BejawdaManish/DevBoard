require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const express = require("express");
const pool = require("./db");

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());
 
app.get("/", (req, res) => {
  res.send("DevBoard Backend Running 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});
app.get("/tasks", auth, async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM tasks
       WHERE user_id = $1
       ORDER BY id`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});
app.post("/tasks", auth, async (req, res) => {
  try {

    const {
      title,
      description,
      project_id,
      due_date
    } = req.body;

    if (!title.trim()) {
      return res.status(400).json({
        error: "Task title required",
      });
    }

    const result = await pool.query(
      `INSERT INTO tasks
      (
        title,
        description,
        status,
        project_id,
        user_id,
        due_date,
        priority
      )
      VALUES
      (
        $1,
        $2,
        'todo',
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *`,
      [
        title,
        description,
        req.user.id,
        project_id,
        due_date,
        priority
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});
app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    res.json({
      message: "Task deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
app.put("/tasks/:id",auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title=$1,
           description=$2,
           status=$3
       WHERE id=$4
       RETURNING *`,
      [title, description, status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET status = $1
       WHERE id = $2
       AND user_id = $3
       RETURNING *`,
      [
        status,
        req.params.id,
        req.user.id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});
app.delete("/tasks/:id", auth, async (req, res) => {
  try {

    await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       AND user_id = $2`,
      [
        req.params.id,
        req.user.id
      ]
    );

    res.json({
      message: "Task deleted"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});
app.put("/projects/:id", auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET name = $1,
           description = $2
       WHERE id = $3
       AND user_id = $4
       RETURNING *`,
      [
        name,
        description,
        req.params.id,
        req.user.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
});
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users(name, email, password)
       VALUES($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    console.log("LOGIN ROUTE HIT");

    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        email: user.rows[0].email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
});
app.post("/projects", auth, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      error: "Project name is required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO projects
       (name, description, user_id)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [
        name,
        description,
        req.user.id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});
app.get("/projects", auth, async (req, res) => {
  try {
    console.log("USER ID:", req.user.id);
    const result = await pool.query(
      `SELECT *
       FROM projects
       WHERE user_id = $1
       ORDER BY id`,
      [req.user.id]
    );

  console.log("PROJECTS FOUND:", result.rows);
  res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});
app.get("/projects/:id/tasks", auth, async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT *
       FROM tasks
       WHERE project_id = $1
       AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});
app.delete("/projects/:id", auth, async (req, res) => {
  try {

    await pool.query(
      `DELETE FROM projects
       WHERE id = $1
       AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    res.json({
      message: "Project deleted"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});
app.put("/tasks/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
  }
});
app.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET status = $1
       WHERE id = $2
       AND user_id = $3
       RETURNING *`,
      [status, req.params.id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
app.get("/hello", (req, res) => {
  console.log("HELLO ROUTE HIT");
  res.send("Hello from backend");
});
console.log("SERVER FILE LOADED");
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("SERVER OBJECT:", !!server);