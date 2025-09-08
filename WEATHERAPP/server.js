require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const fs = require("fs");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const rateLimit = require('express-rate-limit'); // For API rate limiting
const { body, validationResult } = require('express-validator'); // For input validation and sanitization
const bcrypt = require('bcrypt'); // For password hashing

// Middleware setup
app.use(express.static("."));
app.use(express.urlencoded({ extended: true })); // Ensure extended is true for nested objects
app.use(cookieParser());

const oneDay = 60 * 60 * 24 * 1000;

// Configure rate limiter for all requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(apiLimiter);

// Session setup
app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.SESSION_SECRET || "sdfs@#$df4%121", // Use environment variable for secret
    cookie: { maxAge: oneDay },
  })
);

// Routes

app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./style.css"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./login.html"));
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
};

// Apply authentication middleware to protected routes
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.post("/login", (req, res) => {
  fs.readFile("users.json", "utf-8", async (err, data) => { // Make this async to use await bcrypt.compare
    if (err) {
      console.error("[FILE_READ_ERROR] Error reading users file for login:", err);
      return res.status(500).send("Internal Server Error");
    }

    let results = JSON.parse(data);
    let user = results.find(
      (item) => item.username === req.body.username
    );

    // Compare hashed password
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      res.sendFile(path.join(__dirname, "./invalid.html"));
    } else {
      req.session.username = req.body.username;
      res.redirect("/dashboard");
    }
  });
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "./signup.html"));
});

app.post("/signup",
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long').escape(),
    body('email').trim().isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => { // Make this async to use await bcrypt.hash
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    let users = [];
    try {
      users = JSON.parse(fs.readFileSync("users.json"));
    } catch (err) {
      // If file doesn't exist or is empty, start with an empty array.
      // ENOENT means "Error NO ENTry", i.e., file not found.
      if (err.code !== 'ENOENT') {
        console.error("[FILE_READ_ERROR] Error reading users file during signup:", err);
        return res.status(500).send("Internal Server Error");
      }
    }

    // Check if username or email already exists
    if (users.some(u => u.username === username)) {
      return res.status(409).send("Username already taken.");
    }
    if (users.some(u => u.email === email)) {
      return res.status(409).send("Email already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = { username, email, password: hashedPassword }; // Store hashed password

    users.push(user);

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    res.redirect("/login");
  });

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("[LOGOUT_ERROR] Error destroying session:", err);
      return res.status(500).send("Error logging out.");
    }
    res.redirect("/login");
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`[SERVER_START_ERROR] Failed to start server: ${err.message}`, err);
  } else {
    console.log(`[SERVER_START] Server Started on port ${PORT}`);
  }
});

// Centralized error handling middleware (add at the end of your routes)
app.use((err, req, res, next) => {
  console.error(`[APP_ERROR] ${err.stack}`);
  res.status(500).send('Something broke!');
});