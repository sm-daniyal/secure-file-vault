// ============================================================
// components/FileCard.jsx — Displays a single file with actions
// ============================================================

import "./FileCard.css";

// Map MIME types to readable labels and emoji icons
const FILE_TYPES = {
  "application/pdf": { label: "PDF", icon: "📄" },
  "image/jpeg": { label: "JPG", icon: "🖼️" },
  "image/png": { label: "PNG", icon: "🖼️" },
  "image/gif": { label: "GIF", icon: "🖼️" },
  "image/webp": { label: "WEBP", icon: "🖼️" },
  "text/plain": { label: "TXT", icon: "📝" },
  "application/msword": { label: "DOC", icon: "📝" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { label: "DOCX", icon: "📝" },
  "application/vnd.ms-excel": { label: "XLS", icon: "📊" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { label: "XLSX", icon: "📊" },
  "application/zip": { label: "ZIP", icon: "🗜️" },
  "video/mp4": { label: "MP4", icon: "🎬" },
};

const DEFAULT_TYPE = { label: "FILE", icon: "📁" };

// Format bytes → readable size string
const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Format ISO date → "Apr 15, 2024"
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const FileCard = ({ file, onDelete, onDownload }) => {
  const typeInfo = FILE_TYPES[file.mimeType] || DEFAULT_TYPE;

  return (
    <div className="file-card fade-in">
      {/* Icon + name */}
      <div className="file-top">
        <span className="file-icon">{typeInfo.icon}</span>
        <div className="file-info">
          <p className="file-name" title={file.originalName}>
            {file.originalName}
          </p>
          <div className="file-meta">
            <span className="badge">{typeInfo.label}</span>
            <span className="file-size">{formatSize(file.size)}</span>
          </div>
        </div>
      </div>

      {/* Date */}
      <p className="file-date">Uploaded {formatDate(file.createdAt)}</p>

      {/* Actions */}
      <div className="file-actions">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onDownload(file._id, file.originalName)}
          title="Download file"
        >
          ↓ Download
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(file._id)}
          title="Delete file"
        >
          ✕ Delete
        </button>
      </div>
    </div>
  );
};

export default FileCard;
