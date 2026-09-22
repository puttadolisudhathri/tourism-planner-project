
const dns = require("dns");

// ==========================================
// MONGODB ATLAS DNS CONFIGURATION
// ==========================================

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// ==========================================
// IMPORT ROUTES
// ==========================================

const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const tripRoutes = require("./routes/tripRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();
const PORT = 5000;

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: [
  "http://localhost:5173",
  "https://tourism-planner-project.vercel.app"
],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// ==========================================
// HOME API
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Tourism Planner Backend is running!"
  });
});

// ==========================================
// SERVER TEST API
// ==========================================

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Correct server.js is running!"
  });
});

// ==========================================
// AUTHENTICATION APIs
// ==========================================

app.use("/api/auth", authRoutes);

// ==========================================
// DESTINATION APIs
// ==========================================

app.use("/api/destinations", destinationRoutes);

// ==========================================
// TRIP APIs
// ==========================================

app.use("/api/trips", tripRoutes);

// ==========================================
// REVIEW APIs
// ==========================================

app.use("/api/reviews", reviewRoutes);

// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `Backend server running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed!");
    console.error(error.message);
  });