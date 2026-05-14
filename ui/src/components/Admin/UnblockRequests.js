import React, { useState, useEffect, useCallback } from "react";
import apiService from "../../services/apiService";
import "./UnblockRequests.css";

const UnblockRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [loading, setLoading] = useState(true);
  const [adminComments, setAdminComments] = useState({});

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (filter === "pending") {
        response = await apiService.getPendingUnblockRequests();
      } else {
        response = await apiService.getAllUnblockRequests();
      }

      let filteredRequests = response.data;
      if (filter !== "all" && filter !== "pending") {
        filteredRequests = response.data.filter(
          (req) => req.status === filter.toUpperCase(),
        );
      }

      setRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching unblock requests:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleReview = async (requestId, status) => {
    const adminComment = adminComments[requestId] || "";

    if (status === "REJECTED" && !adminComment.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      await apiService.reviewUnblockRequest(requestId, status, adminComment);
      alert(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (error) {
      console.error("Error reviewing request:", error);
      alert("Failed to review request");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading unblock requests...</div>;
  }

  return (
    <div className="unblock-requests-page">
      <div className="unblock-requests-header">
        <h1>Unblock Requests</h1>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === "approved" ? "active" : ""}`}
            onClick={() => setFilter("approved")}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="no-requests">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3>No {filter !== "all" ? filter : ""} unblock requests found</h3>
        </div>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="unblock-request-card">
            <div className="request-header">
              <div className="request-info">
                <h3>Request #{request.id}</h3>
                <div className="request-meta">
                  <span>By: {request.username}</span>
                  <span>•</span>
                  <span>Confession #{request.confessionId}</span>
                  <span>•</span>
                  <span>{formatDate(request.createdAt)}</span>
                </div>
              </div>
              <span className={`status-badge ${request.status.toLowerCase()}`}>
                {request.status}
              </span>
            </div>

            <div className="confession-preview">
              <h4>Blocked Confession:</h4>
              <p className="confession-text">{request.confessionText}</p>
            </div>

            <div className="request-reason">
              <h4>Reason for Unblock Request:</h4>
              <p className="reason-text">{request.reason}</p>
            </div>

            {request.status === "PENDING" && (
              <div className="review-form">
                <textarea
                  placeholder="Add a comment (required for rejection, optional for approval)..."
                  value={adminComments[request.id] || ""}
                  onChange={(e) =>
                    setAdminComments({
                      ...adminComments,
                      [request.id]: e.target.value,
                    })
                  }
                />
                <div className="review-actions">
                  <button
                    className="reject-btn"
                    onClick={() => handleReview(request.id, "REJECTED")}
                  >
                    Reject
                  </button>
                  <button
                    className="approve-btn"
                    onClick={() => handleReview(request.id, "APPROVED")}
                  >
                    Approve & Unblock
                  </button>
                </div>
              </div>
            )}

            {request.status !== "PENDING" && request.adminComment && (
              <div className="admin-response">
                <h4>Admin Response by {request.reviewedByUsername}:</h4>
                <p className="response-text">{request.adminComment}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UnblockRequests;
