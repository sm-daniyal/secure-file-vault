// ============================================================
// models/File.js — Mongoose schema for uploaded file metadata
// ============================================================
// Note: We store file METADATA here; the actual file bytes live
// on disk inside the /uploads folder.
// ============================================================

const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    // Reference to the user who uploaded this file
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: {
      type: String,
      required: true, // e.g. "resume.pdf"
    },
    storedName: {
      type: String,
      required: true, // e.g. "1687000000000-resume.pdf" (unique on disk)
    },
    mimeType: {
      type: String,
      required: true, // e.g. "application/pdf"
    },
    size: {
      type: Number,
      required: true, // file size in bytes
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
