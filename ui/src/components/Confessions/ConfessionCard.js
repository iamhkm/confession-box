import React from "react";
import "./Confessions.css";

const ConfessionCard = ({ confession, onDelete, onEdit, showActions }) => {
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      DRAFT: "status-draft",
      ACTIVE: "status-active",
      INACTIVE: "status-inactive",
      INACTIVE_BY_ADMIN: "status-inactive-admin",
      BLOCKED_BY_ADMIN: "status-blocked",
    };
    return statusMap[status] || "";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="confession-card">
      <div className="confession-header">
        <div className="confession-meta">
          <span className="confession-author">
            {confession.anonymous
              ? "🎭 Anonymous"
              : `👤 ${confession.username}`}
          </span>
          <span
            className={`status-badge ${getStatusBadgeClass(confession.status)}`}
          >
            {confession.status}
          </span>
        </div>
        {showActions && (
          <div className="confession-actions">
            <button
              className="btn-icon btn-edit"
              onClick={() => onEdit(confession)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => onDelete(confession.id)}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="confession-content">
        <p>{confession.confesion}</p>
      </div>

      <div className="confession-footer">
        <span className="confession-date">
          {formatDate(confession.createdAt)}
        </span>
        {confession.updatedAt !== confession.createdAt && (
          <span className="confession-edited">(edited)</span>
        )}
      </div>
    </div>
  );
};

export default ConfessionCard;
