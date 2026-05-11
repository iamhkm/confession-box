import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import ConfessionCard from "./ConfessionCard";
import CreateConfession from "./CreateConfession";
import "./Confessions.css";

const ConfessionList = ({ userId = null }) => {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingConfession, setEditingConfession] = useState(null);

  useEffect(() => {
    loadConfessions();
  }, [userId]);

  const loadConfessions = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      if (userId) {
        response = await apiService.getConfessionsByUserId(userId);
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

  if (loading) {
    return <div className="loading">Loading confessions...</div>;
  }

  return (
    <div className="confession-list-container">
      <div className="confession-list-header">
        <h2>{userId ? "My Confessions" : "All Confessions"}</h2>
        <button className="btn-create" onClick={() => setShowCreateForm(true)}>
          + New Confession
        </button>
      </div>

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

      {confessions.length === 0 ? (
        <div className="empty-state">
          <p>No confessions yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="confessions-grid">
          {confessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              onDelete={handleDelete}
              onEdit={handleEdit}
              showActions={userId !== null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfessionList;
