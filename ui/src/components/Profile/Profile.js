import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import authService from "../../services/authService";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await apiService.getMyProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
      });
      setError("");
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await apiService.updateMyProfile(formData);
      setProfile(response.data);
      setSuccess("Profile updated successfully!");
      setEditMode(false);

      // Update localStorage with new user info
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...currentUser, name: response.data.name }),
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await apiService.changeMyPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      setSuccess("Password changed successfully!");
      setChangePasswordMode(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
    });
    setError("");
    setSuccess("");
  };

  const cancelPasswordChange = () => {
    setChangePasswordMode(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <p className="error-message">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>👤 My Profile</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Profile Information */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Profile Information</h3>
          {!editMode && (
            <button className="btn btn-edit" onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {!editMode ? (
          <div className="profile-info">
            <div className="info-item">
              <span className="label">Username:</span>
              <span className="value">{profile.username}</span>
            </div>
            <div className="info-item">
              <span className="label">Full Name:</span>
              <span className="value">{profile.name || "N/A"}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Role:</span>
              <span className="value">{profile.role}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`value status ${profile.status?.toLowerCase()}`}>
                {profile.status}
              </span>
            </div>
            {profile.createdAt && (
              <div className="info-item">
                <span className="label">Member Since:</span>
                <span className="value">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter your full name"
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
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-save">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Change Password</h3>
          {!changePasswordMode && (
            <button
              className="btn btn-edit"
              onClick={() => setChangePasswordMode(true)}
            >
              🔒 Change Password
            </button>
          )}
        </div>

        {changePasswordMode && (
          <form className="profile-form" onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-save">
                Change Password
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={cancelPasswordChange}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
