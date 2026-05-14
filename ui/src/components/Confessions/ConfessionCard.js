import React from "react";
import "./Confessions.css";

const ConfessionCard = ({
  confession,
  onDelete,
  onEdit,
  onView,
  showActions,
  isAdmin,
  onRequestUnblock,
  currentUserId,
}) => {
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

  const isBlocked =
    confession.status === "BLOCKED_BY_ADMIN" ||
    confession.status === "INACTIVE_BY_ADMIN";
  const canRequestUnblock =
    isBlocked && !isAdmin && currentUserId === confession.userId;

  return (
    <div className="confession-card">
      <div className="confession-header">
        <div className="confession-meta">
          <span className="confession-author">
            {confession.anonymous
              ? "🎭 Anonymous"
              : `👤 ${confession.name || confession.username}`}
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
              disabled={isBlocked}
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

      {canRequestUnblock && (
        <div className="confession-blocked-notice">
          <p>⚠️ This confession has been blocked by an admin.</p>
          <button
            className="btn-request-unblock"
            onClick={() => onRequestUnblock(confession)}
          >
            Request Unblock
          </button>
        </div>
      )}

      <div className="confession-footer">
        <span className="confession-date">
          {formatDate(confession.createdAt)}
        </span>
        {confession.updatedAt !== confession.createdAt && (
          <span className="confession-edited">(edited)</span>
        )}
        {isAdmin && (
          <button
            className="btn-icon btn-view"
            onClick={() => onView(confession)}
            title="View Details"
          >
            👁️
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfessionCard;
