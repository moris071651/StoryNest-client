import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api/v1";

export default function ReadStory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchStoryAndComments = async () => {
      try {
        const storyRes = await axios.get(`${API}/stories/${id}`, {
          withCredentials: true,
        });
        setStory(storyRes.data);

        const commentRes = await axios.get(`${API}/stories/${id}/comments`, {
          withCredentials: true,
        });
        setComments(commentRes.data);

        if (storyRes.data.author_id) {
            const userRes = await axios.get(`${API}/users/${storyRes.data.author_id}`, {
                withCredentials: true,
            });
            setUser(userRes.data.name);  
        }
        else {
            const userRes = await axios.get(`${API}/users/me`, {
                withCredentials: true,
            });
            setUser(userRes.data.name);  
        }

      } catch (err) {
        setError("Failed to load story or comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoryAndComments();
  }, [id]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueUserIds = [...new Set(comments.map((c) => c.author_id))];
  
      const names = {};
      for (let id of uniqueUserIds) {
        try {
          const res = await axios.get(`${API}/users/${id}`, {
            withCredentials: true,
          });
          names[id] = res.data.name;
        } catch {
          names[id] = "Unknown User";
        }
      }
  
      setUsernames(names);
    };
  
    if (comments.length > 0) fetchUsernames();
  }, [comments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    try {
      setCommentError(null);
      const res = await axios.post(
        `${API}/stories/${id}/comments`,
        { content: newComment },
        { withCredentials: true }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      setCommentError("Failed to post comment.");
    }
  };

  if (loading) return <p>Loading story...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!story) return <p>No story found.</p>;

  return (
    <div className="container my-4" style={{ maxWidth: "800px", fontFamily: "sans-serif" }}>
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>← Back</button>
      <h1>{story.title}</h1>
      {story.subtitle && <h4 className="text-muted">{story.subtitle}</h4>}

      <div className="mb-3 text-muted small">
        <div>By {user || "Loading..."}</div>
        <div>
          Published:{" "}
          {story.published_at
            ? new Date(story.published_at).toLocaleString()
            : "Not published"}
        </div>
      </div>

      <hr />
      <div style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>{story.content}</div>

      <hr className="my-4" />
      <h5>Comments</h5>

      {comments.length === 0 ? (
        <p className="text-muted">No comments yet.</p>
      ) : (
        <ul className="list-group mb-3">
          {comments.map((c) => (
            <li key={c.id} className="list-group-item">
              <div className="mb-1 small text-muted">
                By User {usernames[c.author_id] || "Loading..."} — {new Date(c.created_at).toLocaleString()}
              </div>
              <div>{c.content}</div>
            </li>
          ))}
        </ul>
      )}

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Add a comment..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        {commentError && <div className="text-danger mt-1">{commentError}</div>}
      </div>
      <button className="btn btn-primary" onClick={handleCommentSubmit}>
        Post Comment
      </button>
    </div>
  );
}
