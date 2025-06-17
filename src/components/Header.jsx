import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "http://localhost:8000/api/v1";

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, null, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        <span
          className="navbar-brand mb-0 h1"
          style={{ cursor: "pointer", fontFamily: "'Pacifico', cursive", fontSize: "1.8rem" }}
          onClick={() => navigate("/")}
        >
          StoryNest
        </span>
        <div className="d-flex gap-2">
          {!isLoggedIn ? (
            <button className="btn btn-outline-primary" onClick={() => navigate("/login")}>
              Login / Signup
            </button>
          ) : (
            <>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/users/me")}>
                My Page
              </button>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Log Out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

