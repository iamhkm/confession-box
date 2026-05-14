import React, { useState } from "react";
import apiService from "../../services/apiService";
import "./Notifications.css";

const UnblockRequestModal = ({ confession, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiService.createUnblockRequest(confession.id, reason);
      alert(
        "Unblock request submitted successfully. An admin will review your request.",
      );
      onSuccess();
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to submit unblock request",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unblock-modal-overlay" onClick={onClose}>
      <div className="unblock-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Request Unblock</h2>
        <p>
          Your confession has been blocked by an admin. Please provide a reason
          why you believe it should be unblocked.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for unblock request *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this confession should be unblocked (minimum 10 characters)..."
              required
              minLength={10}
              maxLength={1000}
            />
            <small>{reason.length}/1000 characters</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="unblock-modal-actions">
            <button
              type="button"
              className="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              disabled={loading || reason.trim().length < 10}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnblockRequestModal;
