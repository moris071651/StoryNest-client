import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReadStory from "./pages/ReadStory";
import CreateStory from "./pages/CreateStory";
import UserPage from "./pages/User";
import EditStory from "./pages/EditStory";
import Header from "./components/Header";

import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const API = "http://localhost:8000/api/v1";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API}/auth/login/`, { withCredentials: true });
      setIsLoggedIn(res.data.is_logged_in)
      console.log(res.data.is_logged_in)
    } catch (err) {
      console.error("Failed to fetch stories:", err.response?.data || err.message);
    }
  }

  useEffect(() => {
    checkAuth()
  }, [isLoggedIn]);

  return (
    <>
      <Router>
        <Header user={isLoggedIn}/>
        <Routes>
        <Route path="/" element={<Dashboard />} />

        {isLoggedIn ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/story/:id" element={<ReadStory />} />
          {/* <Route path="/story/:id" element={<ReadStory />} /> */}
            <Route path="/edit/:id" element={<EditStory />} />

            <Route path="/create" element={<CreateStory />} />
            <Route path="/users/:id" element={<UserPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
          ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
          )
        }
        </Routes>
      </Router>
    </>
  );
}

export default App;
