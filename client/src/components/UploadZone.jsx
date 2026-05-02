// components/UploadZone.jsx — v2 Corporate Clean

import { useState, useRef } from "react";
import api from "../api";
import "./UploadZone.css";

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
    onError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });
      onUploadSuccess();
    } catch (err) {
      onError(err.response?.data?.message || "Upload failed. Check file type/size.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files[0]);
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
          <p className="upload-pct">Uploading… {progress}%</p>
        </div>
      ) : (
        <>
          <div className="upload-icon-box">⬆</div>
          <p className="upload-text">
            <strong>Click to upload</strong> or drag and drop a file
          </p>
          <p className="upload-hint">{HINT}</p>
        </>
      )}
    </div>
  );
};

export default UploadZone;
