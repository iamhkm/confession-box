import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import authService from "../../services/authService";
import "./Confessions.css";

const CreateConfession = ({ confession, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    confesion: "",
    anonymous: true,
    status: "DRAFT",
    userId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdminBlocked, setIsAdminBlocked] = useState(false);

  useEffect(() => {
    // Get current user ID
    const user = authService.getCurrentUser();
    if (user) {
      // Note: We need to fetch the user ID from the API since it's not in localStorage
      // For now, we'll use a placeholder. In a real app, you'd store the userId during login
      setFormData((prev) => ({ ...prev, userId: 1 })); // Placeholder
    }

    // If editing, populate form
    if (confession) {
      // Check if confession is admin-blocked
      const adminBlockedStatuses = ["INACTIVE_BY_ADMIN", "BLOCKED_BY_ADMIN"];
      setIsAdminBlocked(adminBlockedStatuses.includes(confession.status));

      setFormData({
        confesion: confession.confesion,
        anonymous: confession.anonymous,
        status: confession.status || "DRAFT",
        userId: confession.userId,
      });
    }
  }, [confession]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.confesion.trim()) {
      setError("Confession cannot be empty");
      return;
    }

    setLoading(true);

    try {
      if (confession) {
        // Update existing confession
        await apiService.updateConfession(confession.id, {
          confesion: formData.confesion,
          anonymous: formData.anonymous,
        });
        // Update status separately if it changed
        if (formData.status !== confession.status) {
          await apiService.updateConfessionStatus(
            confession.id,
            formData.status,
          );
        }
      } else {
        // Create new confession
        const response = await apiService.createConfession(formData);
        // Update status if not DRAFT
        if (formData.status !== "DRAFT") {
          await apiService.updateConfessionStatus(
            response.data.id,
            formData.status,
          );
        }
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save confession");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-confession-form">
      <h3>{confession ? "Edit Confession" : "Create New Confession"}</h3>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="confesion">Your Confession</label>
          <textarea
            id="confesion"
            name="confesion"
            value={formData.confesion}
            onChange={handleChange}
            rows="6"
            placeholder="Share your thoughts anonymously..."
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
            />
            <span>Post anonymously (hide my identity)</span>
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          {isAdminBlocked && (
            <p className="warning-message">
              ⚠️ This confession has been blocked by an admin. Status cannot be
              changed.
            </p>
          )}
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isAdminBlocked}
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            {isAdminBlocked && (
              <>
                <option value="INACTIVE_BY_ADMIN">Inactive by Admin</option>
                <option value="BLOCKED_BY_ADMIN">Blocked by Admin</option>
              </>
            )}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : confession ? "Update" : "Post Confession"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateConfession;
