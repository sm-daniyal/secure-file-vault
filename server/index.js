// ============================================================
// index.js — Entry point for the Secure File Vault server
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");

const app = express();

// --------------- Middleware ---------------

// Allow requests from the React frontend (CORS)
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Parse incoming JSON bodies
app.use(express.json());

// Serve uploaded files statically so the browser can download them
// (only the download route is protected; the raw path is /uploads/:filename)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------- Routes ---------------
app.use("/api/auth", authRoutes);   // /api/auth/register  /api/auth/login
app.use("/api/files", fileRoutes);  // /api/files/upload   /api/files  /api/files/:id

// --------------- Database + Server Start ---------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("!!MongoDB connection error:", err.message);
    process.exit(1);
  });
