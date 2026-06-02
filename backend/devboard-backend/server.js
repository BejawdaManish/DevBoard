require("dotenv").config();
 

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
  })
);
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
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks(title, description)
       VALUES($1,$2)
       RETURNING *`,
      [title, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.delete("/tasks/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM tasks WHERE id=$1",
      [req.params.id]
    );

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.put("/tasks/:id", async (req, res) => {
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

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});