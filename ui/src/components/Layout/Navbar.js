import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Layout.css";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🎭 Confession Box
        </Link>

        {user && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/my-confessions" className="nav-link">
              My Confessions
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            {isAdmin() && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}
            <div className="navbar-user">
              <span className="user-info">
                👤 {user.username} {isAdmin() && "(Admin)"}
              </span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
