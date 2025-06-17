import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StoryList from "../components/StoryList";

const API = "http://localhost:8000/api/v1";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const isMe = id === "me";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${API}/users/${id}`, {
          withCredentials: true,
        });
        setUser(userRes.data);

        const storiesRes = await axios.get(`${API}/users/${id}/stories`, {
          withCredentials: true,
        });
        setStories(storiesRes.data);
      } catch (err) {
        console.error("Error fetching user/stories:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, [id]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <h2>{user.name}'s Profile</h2>
        <p><strong>Email:</strong> {user.email}</p>

        <StoryList stories={stories} setStories={setStories} isMe={isMe} />
      </div>
    </>
  );
}
