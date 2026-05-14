import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import ConfessionCard from "./ConfessionCard";
import CreateConfession from "./CreateConfession";
import "./Confessions.css";

const ConfessionList = ({
  userId = null,
  showActiveOnly = false,
  isAdmin = false,
  onRequestUnblock = null,
}) => {
  const [confessions, setConfessions] = useState([]);
  const [filteredConfessions, setFilteredConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingConfession, setEditingConfession] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedConfession, setSelectedConfession] = useState(null);
  const [blockingReason, setBlockingReason] = useState("");

  useEffect(() => {
    loadConfessions();
  }, [userId, showActiveOnly]);

  useEffect(() => {
    filterAndSortConfessions();
  }, [confessions, statusFilter, sortOrder]);

  const loadConfessions = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      if (userId) {
        response = await apiService.getConfessionsByUserId(userId);
      } else if (showActiveOnly) {
        response = await apiService.getActiveConfessions();
      } else {
        response = await apiService.getAllConfessions();
      }
      setConfessions(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load confessions");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortConfessions = () => {
    let filtered = [...confessions];

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredConfessions(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this confession?")) {
      return;
    }

    try {
      await apiService.deleteConfession(id);
      setConfessions(confessions.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete confession");
    }
  };

  const handleEdit = (confession) => {
    setEditingConfession(confession);
    setShowCreateForm(true);
  };

  const handleConfessionCreated = () => {
    setShowCreateForm(false);
    setEditingConfession(null);
    loadConfessions();
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingConfession(null);
  };

  const handleViewConfession = (confession) => {
    setSelectedConfession(confession);
    setBlockingReason(confession.blockingReason || "");
  };

  const handleCloseConfessionModal = () => {
    setSelectedConfession(null);
    setBlockingReason("");
  };

  const handleConfessionStatusChange = async (confessionId, newStatus) => {
    try {
      await apiService.updateConfessionStatus(confessionId, newStatus);

      // Update local state
      const updatedConfessions = filteredConfessions.map((c) =>
        c.id === confessionId ? { ...c, status: newStatus } : c,
      );
      setFilteredConfessions(updatedConfessions);

      if (selectedConfession?.id === confessionId) {
        setSelectedConfession({ ...selectedConfession, status: newStatus });
      }

      setError(null);
    } catch (err) {
      setError("Failed to update confession status");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading confessions...</div>;
  }

  return (
    <div className="confession-list-container">
      <div className="confession-list-header">
        <h2>
          {userId
            ? "My Confessions"
            : showActiveOnly
              ? "Active Confessions"
              : "All Confessions"}
        </h2>
        {userId && (
          <button
            className="btn-create"
            onClick={() => setShowCreateForm(true)}
          >
            + New Confession
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="confession-filters">
          <div className="filter-group">
            <label htmlFor="statusFilter">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="INACTIVE_BY_ADMIN">Inactive by Admin</option>
              <option value="BLOCKED_BY_ADMIN">Blocked by Admin</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="sortOrder">Sort by Time:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CreateConfession
              confession={editingConfession}
              onSuccess={handleConfessionCreated}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {filteredConfessions.length === 0 ? (
        <div className="empty-state">
          <p>
            {userId
              ? "No confessions yet. Create your first confession!"
              : showActiveOnly
                ? "No active confessions at the moment."
                : "No confessions found."}
          </p>
        </div>
      ) : (
        <div className="confessions-grid">
          {filteredConfessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleViewConfession}
              onRequestUnblock={onRequestUnblock}
              showActions={userId !== null}
              isAdmin={isAdmin}
              currentUserId={userId}
            />
          ))}
        </div>
      )}

      {/* Confession Detail Modal */}
      {selectedConfession && (
        <div className="modal-overlay" onClick={handleCloseConfessionModal}>
          <div
            className="modal-content confession-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Confession Details</h3>
              <button
                className="btn-close"
                onClick={handleCloseConfessionModal}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="confession-detail">
                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{selectedConfession.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Author:</span>
                  <span className="detail-value">
                    {selectedConfession.anonymous
                      ? "Anonymous"
                      : selectedConfession.name || selectedConfession.username}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Anonymous:</span>
                  <span className="detail-value">
                    {selectedConfession.anonymous ? "Yes" : "No"}
                  </span>
                </div>
                {selectedConfession.status === "BLOCKED_BY_ADMIN" &&
                  selectedConfession.blockingReason && (
                    <div className="detail-row">
                      <span className="detail-label">Blocking Reason:</span>
                      <span className="detail-value">
                        {selectedConfession.blockingReason}
                      </span>
                    </div>
                  )}
                {selectedConfession.status === "BLOCKED_BY_ADMIN" && isAdmin && (
                  <div className="detail-row">
                    <span className="detail-label">Update Reason:</span>
                    <textarea
                      className="blocking-reason-input"
                      value={blockingReason}
                      onChange={(e) => setBlockingReason(e.target.value)}
                      placeholder="Provide or update the reason for blocking..."
                      rows="3"
                    />
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <div className="status-change-group">
                    <span
                      className={`detail-value status-badge ${selectedConfession.status?.toLowerCase()}`}
                    >
                      {selectedConfession.status}
                    </span>
                    <select
                      value={selectedConfession.status}
                      onChange={(e) =>
                        handleConfessionStatusChange(
                          selectedConfession.id,
                          e.target.value,
                        )
                      }
                      className="status-select"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE_BY_ADMIN">
                        Inactive by Admin
                      </option>
                      <option value="BLOCKED_BY_ADMIN">Blocked by Admin</option>
                    </select>
                  </div>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">
                    {new Date(selectedConfession.createdAt).toLocaleString()}
                  </span>
                </div>
                {selectedConfession.updatedAt &&
                  selectedConfession.updatedAt !==
                    selectedConfession.createdAt && (
                    <div className="detail-row">
                      <span className="detail-label">Updated:</span>
                      <span className="detail-value">
                        {new Date(
                          selectedConfession.updatedAt,
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                <div className="detail-row full-width">
                  <span className="detail-label">Content:</span>
                  <div className="confession-full-content">
                    {selectedConfession.confesion}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ConfessionList;
