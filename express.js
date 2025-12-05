const express = require("express");
const { Pool } = require("pg");

// const getUsers = (request, response) => {
//   pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
//     if (error) {
//       throw error
//     }
//     response.status(200).json(results.rows)
//   })
// }

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle OPTIONS request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

require("dotenv").config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/logs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM logs");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).send("Missing id or name in request body");
  }
  pool.query(
    "INSERT INTO users (id, name) VALUES ($1, $2)",
    [id, name],
    (error, results) => {
      if (error) {
        return res.status(500).send(`Error: ${error.message}`);
      }
      res.status(201).send(`User added with ID: ${id}`);
    }
  );

  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/logs", async (req, res) => {
  const {
    id,
    entity_type,
    entity_id,
    user_name,
    old_value,
    new_value,
    change_by_id,
    change_type,
    changed_by,
    changed_at,
    change_reason,
    request_id,
    ip_address,
    column_name,
  } = req.body;
  if (
    (!id || !entity_type,
    !entity_id ||
      !user_name ||
      !old_value ||
      !new_value ||
      !change_by_id ||
      !change_type ||
      !changed_by ||
      !changed_at ||
      !change_reason ||
      !request_id ||
      !ip_address ||
      !column_name)
  ) {
    return res.status(400).send("Missing params in request body");
  }
  pool.query(
    "INSERT INTO logs (id, entity_type, entity_id, user_name, old_value, new_value, change_by_id, change_type, changed_by, changed_at, change_reason, request_id, ip_address, column_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
    [
      id,
      entity_type,
      entity_id,
      user_name,
      old_value,
      new_value,
      change_by_id,
      change_type,
      changed_by,
      changed_at,
      change_reason,
      request_id,
      ip_address,
      column_name,
    ],
    (error, results) => {
      if (error) {
        return res.status(500).send(`Error: ${error.message}`);
      }
      res.status(201).send(`Log added with ID: ${id}`);
    }
  );

  try {
    const result = await pool.query("SELECT * FROM logs");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
