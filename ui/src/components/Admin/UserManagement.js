import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userConfessions, setUserConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    role: "USER",
    status: "ACTIVE",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    try {
      const response = await apiService.getConfessionsByUserId(user.id);
      setUserConfessions(response.data);
    } catch (err) {
      console.error("Failed to load user confessions:", err);
      setUserConfessions([]);
    }
  };

  const handleUserStatusChange = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      await apiService.updateUserStatus(userId, newStatus);
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err) {
      setError("Failed to update user status");
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiService.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
          setUserConfessions([]);
        }
      } catch (err) {
        setError("Failed to delete user");
        console.error(err);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password || !formData.name) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await apiService.createUser(formData);
      setUsers([...users, response.data]);
      setFormData({ username: "", email: "", password: "", name: "", role: "USER", status: "ACTIVE" });
      setShowCreateForm(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
      console.error(err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="user-management-container"><p>Loading users...</p></div>;

  return (
    <div className="user-management-container">
      <h2>👥 User Management</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="user-management-content">
        {/* Users List */}
        <div className="users-list-section">
          <div className="users-list-header">
            <h3>Users ({users.length})</h3>
            <button
              className="btn btn-create"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? "✕ Cancel" : "+ New User"}
            </button>
          </div>

          {showCreateForm && (
            <form className="create-user-form" onSubmit={handleCreateUser}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <button type="submit" className="btn btn-submit">
                Create User
              </button>
            </form>
          )}

          <div className="users-list">
            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              users.map(user => (
                <div
                  key={user.id}
                  className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-info">
                    <div className="user-name">{user.username}</div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-role">{user.role}</div>
                  </div>
                  <div className={`user-status ${user.status?.toLowerCase()}`}>
                    {user.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Details & Confessions */}
        {selectedUser && (
          <div className="user-details-section">
            <div className="user-details-header">
              <h3>User Details: {selectedUser.username}</h3>
              <div className="user-details-actions">
                <button
                  className={`btn btn-status ${selectedUser.status?.toLowerCase()}`}
                  onClick={() => handleUserStatusChange(selectedUser.id, selectedUser.status)}
                >
                  {selectedUser.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteUser(selectedUser.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="user-meta">
              <div className="meta-item">
                <span className="label">Email:</span>
                <span className="value">{selectedUser.email}</span>
              </div>
              <div className="meta-item">
                <span className="label">Role:</span>
                <span className="value">{selectedUser.role}</span>
              </div>
              <div className="meta-item">
                <span className="label">Status:</span>
                <span className={`value status ${selectedUser.status?.toLowerCase()}`}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="meta-item">
                <span className="label">Created:</span>
                <span className="value">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>

            <div className="user-confessions">
              <h4>Confessions ({userConfessions.length})</h4>
              {userConfessions.length === 0 ? (
                <p className="no-data">No confessions from this user</p>
              ) : (
                <div className="confessions-list">
                  {userConfessions.map(confession => (
                    <div key={confession.id} className="confession-item">
                      <div className="confession-header">
                        <span className="confession-title">{confession.title}</span>
                        <span className={`confession-status status-${confession.status?.toLowerCase()}`}>
                          {confession.status}
                        </span>
                      </div>
                      <div className="confession-content">{confession.content}</div>
                      <div className="confession-date">
                        {new Date(confession.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedUser && (
          <div className="user-details-section empty">
            <p>Select a user to view details and confessions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
