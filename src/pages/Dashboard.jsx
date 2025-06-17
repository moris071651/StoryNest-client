import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StoryList from "../components/StoryList";

const API = "http://localhost:8000/api/v1";

export default function Dashboard({ isLoggedIn }) {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  const fetchPublicStories = async () => {
    try {
      const res = await axios.get(`${API}/stories/`);
      setStories(res.data);
    } catch (err) {
      console.error("Failed to fetch stories:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPublicStories();
  }, []);

  return (
    <div className="container my-4" style={{ fontFamily: "sans-serif" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Public Stories</h1>
        { isLoggedIn ? (
          <button className="btn btn-primary" onClick={() => navigate("/create")}>
          Create a Story
          </button>
        ) : (
          <></>
        )}
      </div>
      <StoryList stories={stories} setStories={setStories} isMe={false} />
    </div>
  );
}
