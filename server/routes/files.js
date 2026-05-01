// ============================================================
// routes/files.js — File management routes
// ============================================================

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const protect = require("../middleware/auth");
const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

// --------------- Multer Configuration ---------------

// Define where and how to store uploaded files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // store in /server/uploads/
  },
  filename: (req, file, cb) => {
    // Prefix with timestamp to avoid name collisions
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

// Allowed MIME types (whitelist approach — safer than blacklisting)
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "video/mp4",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true); // accept the file
  } else {
    cb(new Error(`File type "${file.mimetype}" is not allowed`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // default 10MB
  },
});

// --------------- Routes (all protected by JWT) ---------------

// GET  /api/files              — list all files for the logged-in user
router.get("/", protect, getFiles);

// POST /api/files/upload       — upload a single file
router.post(
  "/upload",
  protect,
  (req, res, next) => {
    // Wrap multer so we can return a clean JSON error instead of crashing
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadFile
);

// GET  /api/files/download/:id — download a specific file
router.get("/download/:id", protect, downloadFile);

// DELETE /api/files/:id        — delete a specific file
router.delete("/:id", protect, deleteFile);

module.exports = router;
