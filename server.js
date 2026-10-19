const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

// Validation: galat data ko reject karta hai
function validateJob(body) {
  const errors = [];
  if (!body.title || typeof body.title !== "string" || body.title.trim().length < 3) {
    errors.push("title is required (min 3 characters)");
  }
  if (!body.company || typeof body.company !== "string" || body.company.trim().length < 2) {
    errors.push("company is required (min 2 characters)");
  }
  if (body.deadline && isNaN(Date.parse(body.deadline))) {
    errors.push("deadline must be a valid date (YYYY-MM-DD)");
  }
  return errors;
}

// CREATE
app.post("/api/jobs", (req, res) => {
  const errors = validateJob(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const { title, company, description, deadline } = req.body;
  const result = db
    .prepare("INSERT INTO jobs (title, company, description, deadline) VALUES (?, ?, ?, ?)")
    .run(title.trim(), company.trim(), description || null, deadline || null);
  const job = db.prepare("SELECT * FROM jobs WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(job);
});

// READ all
app.get("/api/jobs", (req, res) => {
  res.json(db.prepare("SELECT * FROM jobs ORDER BY id DESC").all());
});

// READ one
app.get("/api/jobs/:id", (req, res) => {
  const job = db.prepare("SELECT * FROM jobs WHERE id = ?").get(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

// UPDATE
app.put("/api/jobs/:id", (req, res) => {
  const errors = validateJob(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const { title, company, description, deadline } = req.body;
  const result = db
    .prepare("UPDATE jobs SET title = ?, company = ?, description = ?, deadline = ? WHERE id = ?")
    .run(title.trim(), company.trim(), description || null, deadline || null, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Job not found" });
  res.json(db.prepare("SELECT * FROM jobs WHERE id = ?").get(req.params.id));
});

// DELETE
app.delete("/api/jobs/:id", (req, res) => {
  const result = db.prepare("DELETE FROM jobs WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Job not found" });
  res.json({ message: "Job deleted" });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));