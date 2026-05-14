import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import ConfessionList from "../Confessions/ConfessionList";
import UserManagement from "../Admin/UserManagement";
import apiService from "../../services/apiService";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalConfessions: 0,
    activeConfessions: 0,
    draftConfessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState("confessions");

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      if (isAdmin()) {
        const response = await apiService.getAllConfessions();
        const confessions = response.data;
        setStats({
          totalConfessions: confessions.length,
          activeConfessions: confessions.filter((c) => c.status === "ACTIVE")
            .length,
          draftConfessions: confessions.filter((c) => c.status === "DRAFT")
            .length,
        });
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}! 👋</h1>
        <p className="dashboard-subtitle">
          {isAdmin()
            ? "Manage all confessions and users in the system"
            : "Share your thoughts anonymously or view all confessions"}
        </p>
      </div>

      {isAdmin() && !loading && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalConfessions}</div>
              <div className="stat-label">Total Confessions</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.activeConfessions}</div>
              <div className="stat-label">Active Confessions</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-value">{stats.draftConfessions}</div>
              <div className="stat-label">Draft Confessions</div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        {isAdmin() ? (
          <>
            <div className="admin-tabs">
              <button
                className={`tab-button ${adminTab === "confessions" ? "active" : ""}`}
                onClick={() => setAdminTab("confessions")}
              >
                📋 Confessions
              </button>
              <button
                className={`tab-button ${adminTab === "users" ? "active" : ""}`}
                onClick={() => setAdminTab("users")}
              >
                👥 Users
              </button>
            </div>
            {adminTab === "confessions" ? (
              <ConfessionList isAdmin={true} />
            ) : (
              <UserManagement />
            )}
          </>
        ) : (
          <div className="user-dashboard">
            <div className="welcome-card">
              <h2>🎭 Confession Box</h2>
              <p>
                This is a safe space where you can share your thoughts,
                feelings, and confessions anonymously. No judgment, just
                understanding.
              </p>
              <p>
                Navigate to <strong>My Confessions</strong> to create and manage
                your confessions, or view all active confessions below.
              </p>
            </div>
            <ConfessionList showActiveOnly={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
