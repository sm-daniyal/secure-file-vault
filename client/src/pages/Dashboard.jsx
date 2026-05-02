// pages/Dashboard.jsx — v2 Corporate Clean

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

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `/files${search ? `?search=${encodeURIComponent(search)}` : ""}`
      );
      setFiles(data);
    } catch (err) {
      setError("Failed to load files. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchFiles, 300);
    return () => clearTimeout(timer);
  }, [fetchFiles]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleUploadSuccess = () => {
    showSuccess("File uploaded successfully.");
    fetchFiles();
  };

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

  const handleDownload = async (fileId, originalName) => {
    try {
      const response = await api.get(`/files/download/${fileId}`, {
        responseType: "blob",
      });
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

  // Calculate total storage used
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="dashboard-layout">
      <Navbar username={user?.username} />

      <main className="dashboard-main container">

        {/* Header */}
        <div className="dash-header fade-in">
          <div>
            <h2 className="dash-title">My Files</h2>
            <p className="dash-meta">
              {loading ? "Loading…" : `${files.length} file${files.length !== 1 ? "s" : ""} · ${formatSize(totalSize)} used`}
            </p>
          </div>
          <div className="dash-stats">
            <div className="stat-pill"><span>{files.length}</span> files</div>
            <div className="stat-pill"><span>{formatSize(totalSize)}</span> stored</div>
          </div>
        </div>

        {/* Notifications */}
        {error      && <div className="alert alert-error fade-in">{error}</div>}
        {successMsg && <div className="alert alert-success fade-in">{successMsg}</div>}

        {/* Upload zone */}
        <UploadZone onUploadSuccess={handleUploadSuccess} onError={setError} />

        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon-left">🔍</span>
          <input
            type="text"
            placeholder="Search files by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        {/* File list */}
        {files.length > 0 && !loading && (
          <p className="section-label">
            {search ? `Results for "${search}"` : "All files"}
          </p>
        )}

        {loading ? (
          <div className="state-box">
            <span className="spinner" style={{ width: 24, height: 24 }} />
            <p>Loading your files…</p>
          </div>
        ) : files.length === 0 ? (
          <div className="state-box fade-in">
            <span className="state-icon">📂</span>
            <p>
              {search
                ? `No files match "${search}"`
                : "No files yet — upload something to get started"}
            </p>
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
