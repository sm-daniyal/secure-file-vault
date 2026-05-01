// ============================================================
// pages/Dashboard.jsx — Main file management dashboard
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import FileCard from "../components/FileCard";
import UploadZone from "../components/UploadZone";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch files from the backend
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/files${search ? `?search=${encodeURIComponent(search)}` : ""}`);
      setFiles(data);
    } catch (err) {
      setError("Failed to load files. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Re-fetch whenever search changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(fetchFiles, 300); // wait 300ms after typing
    return () => clearTimeout(timer);
  }, [fetchFiles]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000); // auto-clear after 3s
  };

  // Called after a successful upload
  const handleUploadSuccess = () => {
    showSuccess("File uploaded successfully!");
    fetchFiles();
  };

  // Called when a file card triggers a delete
  const handleDelete = async (fileId) => {
    if (!window.confirm("Delete this file permanently?")) return;
    try {
      await api.delete(`/files/${fileId}`);
      showSuccess("File deleted.");
      fetchFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  // Download: redirect the browser to the protected download endpoint
  const handleDownload = async (fileId, originalName) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: "blob", // receive raw binary
      });
      // Create a temporary link and click it to trigger the browser download dialog
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Download failed. Please try again.");
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar username={user?.username} />

      <main className="dashboard-main container">
        {/* Welcome header */}
        <div className="dash-header fade-in">
          <div>
            <h2 className="dash-title">
              <span className="accent-prefix">$ </span>vault
            </h2>
            <p className="dash-subtitle">
              {files.length} file{files.length !== 1 ? "s" : ""} stored securely
            </p>
          </div>
        </div>

        {/* Notifications */}
        {error && <div className="alert alert-error fade-in">{error}</div>}
        {successMsg && <div className="alert alert-success fade-in">{successMsg}</div>}

        {/* Upload zone */}
        <UploadZone onUploadSuccess={handleUploadSuccess} onError={setError} />

        {/* Search bar */}
        <div className="search-bar">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        {/* File grid / states */}
        {loading ? (
          <div className="state-box">
            <span className="spinner" style={{ width: 28, height: 28 }} />
            <p>Loading vault…</p>
          </div>
        ) : files.length === 0 ? (
          <div className="state-box fade-in">
            <span className="state-icon">🗄️</span>
            <p>{search ? `No files match "${search}"` : "Your vault is empty — upload something!"}</p>
          </div>
        ) : (
          <div className="file-grid fade-in">
            {files.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
