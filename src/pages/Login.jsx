import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api/v1";

export default function Login() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleAuth = async (endpoint) => {
    try {
      const res = await axios.post(`${API}/auth/${endpoint}`, form, {
        withCredentials: true,
      });
      console.log("User logged in:", res.data);
      navigate("/dashboard");
    } catch (err) {
      alert("Authentication failed.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login / Signup</h2>
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            className="form-control"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            className="form-control"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-group mb-4">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="d-grid gap-2">
          <button className="btn btn-primary" onClick={() => handleAuth("signup")}>
            Sign Up
          </button>
          <button className="btn btn-success" onClick={() => handleAuth("login")}>
            Log In
          </button>
          <button className="btn btn-success" onClick={() => handleAuth("logout")}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
