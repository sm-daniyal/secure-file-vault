// ============================================================
// controllers/fileController.js — File CRUD operations
// ============================================================

const path = require("path");
const fs = require("fs");
const File = require("../models/File");

// ---------------------------------------------------------------
// POST /api/files/upload  (protected)
// Multer has already processed the file before this runs
// ---------------------------------------------------------------
const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file was uploaded" });
  }

  try {
    // Save file metadata to MongoDB
    const file = await File.create({
      owner: req.user._id,           // link to the logged-in user
      originalName: req.file.originalname,
      storedName: req.file.filename, // Multer-assigned unique name
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({ message: "File uploaded successfully", file });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// ---------------------------------------------------------------
// GET /api/files  (protected)
// Returns only the files owned by the logged-in user
// Optional query param: ?search=keyword
// ---------------------------------------------------------------
const getFiles = async (req, res) => {
  try {
    const { search } = req.query;

    // Build query — always filter by owner for security
    const query = { owner: req.user._id };

    // If a search term is provided, do a case-insensitive match on the original name
    if (search) {
      query.originalName = { $regex: search, $options: "i" };
    }

    const files = await File.find(query).sort({ createdAt: -1 }); // newest first
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files", error: err.message });
  }
};

// ---------------------------------------------------------------
// GET /api/files/download/:id  (protected)
// Streams the file to the browser as a download
// ---------------------------------------------------------------
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Security check: ensure the requester owns this file
    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const filePath = path.join(__dirname, "../uploads", file.storedName);

    // Trigger browser download dialog with the original filename
    res.download(filePath, file.originalName, (err) => {
      if (err) {
        res.status(500).json({ message: "Download failed" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------------------------------------------------------
// DELETE /api/files/:id  (protected)
// Removes the file from disk AND the DB record
// ---------------------------------------------------------------
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Security check: only the owner can delete their file
    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete from disk
    const filePath = path.join(__dirname, "../uploads", file.storedName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete metadata from DB
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = { uploadFile, getFiles, downloadFile, deleteFile };
