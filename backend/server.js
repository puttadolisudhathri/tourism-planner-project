
const dns = require("dns");

// Use Google DNS for MongoDB Atlas SRV connection
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import route files
const authRoutes = require("./routes/authRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const tripRoutes = require("./routes/tripRoutes");

// Create Express application
const app = express();

// Port number
const PORT = 5000;

// ================================
// MIDDLEWARE
// ================================

app.use(cors());
app.use(express.json());

// ================================
// HOME API
// ================================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Tourism Planner Backend is running!"
    });
});

// ================================
// SERVER TEST API
// ================================

app.get("/test", (req, res) => {
    res.status(200).json({
        message: "Correct server.js is running!"
    });
});

// ================================
// AUTHENTICATION APIs
// ================================

app.use("/api/auth", authRoutes);

// ================================
// DESTINATION APIs
// ================================

app.use("/api/destinations", destinationRoutes);

// ================================
// TRIP APIs
// ================================

app.use("/api/trips", tripRoutes);

// ================================
// MONGODB CONNECTION
// ================================

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