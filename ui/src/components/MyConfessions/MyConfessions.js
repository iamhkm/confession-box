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
      // Fetch the actual user profile from the API
      const response = await apiService.getMyProfile();
      const userProfile = response.data;

      if (userProfile) {
        setUserId(userProfile.id);
        setUserDetails(userProfile);
      }
    } catch (err) {
      console.error("Failed to load user details:", err);
      // Fallback to localStorage if API call fails
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUserDetails(currentUser);
      }
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
