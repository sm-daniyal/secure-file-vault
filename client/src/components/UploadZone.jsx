// ============================================================
// components/UploadZone.jsx — Drag-and-drop file uploader
// ============================================================

import { useState, useRef } from "react";
import api from "../api";
import "./UploadZone.css";

// Allowed extensions shown in the UI hint
const HINT = "PDF, Images, Word, Excel, ZIP, MP4 — max 10 MB";

const UploadZone = ({ onUploadSuccess, onError }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    onError(""); // clear any previous error

    const formData = new FormData();
    formData.append("file", file); // key must match upload.single("file") in multer

    try {
      await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          // Show upload progress percentage
          const pct = Math.round((e.loaded * 100) / e.total);
          setProgress(pct);
        },
      });
      onUploadSuccess();
    } catch (err) {
      onError(err.response?.data?.message || "Upload failed. Check file type/size.");
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset file input so the same file can be re-uploaded if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // Drag events
  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    upload(file);
  };

  return (
    <div
      className={`upload-zone ${dragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      {/* Hidden real file input */}
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => upload(e.target.files[0])}
      />

      {uploading ? (
        <div className="upload-progress-wrap">
          <div className="upload-bar-track">
            <div className="upload-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="upload-pct">{progress}% uploading…</p>
        </div>
      ) : (
        <>
          <span className="upload-icon">↑</span>
          <p className="upload-text">
            <strong>Drop a file here</strong> or click to browse
          </p>
          <p className="upload-hint">{HINT}</p>
        </>
      )}
    </div>
  );
};

export default UploadZone;
