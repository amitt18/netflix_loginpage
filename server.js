const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Atripathi@18", // <-- use your actual password
  database: "netflix_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database!");
  }
});

// Signup route
app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  const query = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ message: "Email already exists" });
      } else {
        res.status(500).json({ message: "Database error", error: err });
      }
    } else {
      res.json({ message: "Signup successful!" });
    }
  });
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).json({ message: "Database error" });
    } else if (results.length > 0) {
      res.json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
