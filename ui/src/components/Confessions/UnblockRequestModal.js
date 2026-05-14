import React, { useState } from "react";
import apiService from "../../services/apiService";
import "./Confessions.css";

const UnblockRequestModal = ({ confession, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!reason.trim()) {
      setError("Please provide a reason for the unblock request");
      return;
    }

    setLoading(true);

    try {
      await apiService.createUnblockRequest(confession.id, reason);
      onSuccess("Unblock request submitted successfully!");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit unblock request. You may have already submitted a pending request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content unblock-request-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Request to Unblock Confession</h3>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="confession-info">
            <p>
              <strong>Confession:</strong>{" "}
              {confession.confesion.substring(0, 100)}...
            </p>
            {confession.blockingReason && (
              <p>
                <strong>Admin's Reason:</strong> {confession.blockingReason}
              </p>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reason">
                Why should this confession be unblocked?
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why you believe this confession should be unblocked..."
                rows="5"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnblockRequestModal;
