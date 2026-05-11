import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import authService from "../../services/authService";
import ConfessionList from "../Confessions/ConfessionList";
import "./MyConfessions.css";

const MyConfessions = () => {
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // In a real app, you'd fetch the user details with ID from the API
        // For now, we'll use a placeholder
        setUserId(1); // Placeholder - would come from API
        setUserDetails(currentUser);
      }
    } catch (err) {
      console.error("Failed to load user details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="my-confessions-container">
      <div className="my-confessions-header">
        <h1>My Confessions</h1>
        <p className="subtitle">
          Manage all your confessions. You can create new ones, edit, or delete
          existing confessions.
        </p>
      </div>

      <div className="my-confessions-content">
        {userId ? (
          <ConfessionList userId={userId} />
        ) : (
          <div className="error-state">
            <p>Unable to load confessions. Please try logging in again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyConfessions;
