import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:8000/api/v1";

export default function StoryList({ stories, setStories, isMe }) {
    const navigate = useNavigate();
    const [usernames, setUsernames] = useState({});

    const handlePublish = async (storyId, currentlyPublished) => {
        try {
            if (!currentlyPublished) {
                await axios.post(`${API}/stories/${storyId}/publish`, null, {
                    withCredentials: true,
                });
            }
            else {
                await axios.delete(`${API}/stories/${storyId}/publish`, {
                    withCredentials: true,
                });
            }

            const res = await axios.get(`${API}/stories/${storyId}`, {
                withCredentials: true,
            });

            const updatedStory = { ...res.data, content: null };

            setStories((prev) =>
                prev.map((s) => (s.id === storyId ? updatedStory : s))
            );
        }
        catch (err) {
            console.error("Failed to update publish status:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        const fetchUsernames = async () => {
          const uniqueUserIds = [...new Set(stories.map((s) => s.author_id))];
      
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
      
        if (stories.length > 0) fetchUsernames();
      }, [stories]);
    

    if (!stories || stories.length === 0) {
        return <p className="text-muted">No stories to display.</p>;
    }

    return (
        <>
            <h4 className="mt-4 mb-3">{isMe ? "My Stories" : "Published Stories"}</h4>
            <div className="row">
                {stories.map((story) => (
                    <div className="col-md-6 mb-4" key={story.id}>
                        <div className="card shadow-sm h-100">
                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="card-title mb-0">{story.title}</h5>
                                    {isMe ? (
                                        <span
                                            className={`badge ${story.is_published ? "bg-success" : "bg-secondary"
                                                }`}
                                        >
                                            {story.is_published ? "Published" : "Private"}
                                        </span>
                                    ) : null}
                                </div>

                                {story.subtitle && (
                                    <h6 className="card-subtitle text-muted mb-2">{story.subtitle}</h6>
                                )}

                                <ul className="list-unstyled small mb-3">
                                    {isMe && (
                                        <>
                                            <li>
                                                <strong>Created:</strong>{" "}
                                                {new Date(story.created_at).toLocaleString()}
                                            </li>
                                            <li>
                                                <strong>Last Updated:</strong>{" "}
                                                {new Date(story.updated_at).toLocaleString()}
                                            </li>
                                        </>
                                    )}
                                    <li>
                                        <strong>Published:</strong>{" "}
                                        {story.published_at
                                            ? new Date(story.published_at).toLocaleString()
                                            : isMe
                                                ? "—"
                                                : "Not published"}
                                    </li>
                                    {!isMe && (
                                        <li>
                                            <strong>Author:</strong> {usernames[story.author_id] || "Loading..."}
                                        </li>
                                    )}
                                </ul>

                                <div className="mt-auto d-flex justify-content-between">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/story/${story.id}`)}
                                    >
                                        Read More
                                    </button>
                                    {isMe && (
                                        !story.is_published ? (
                                            <button
                                                className="btn btn-outline-success"
                                                onClick={() => handlePublish(story.id, story.is_published)}
                                            >
                                                Publish
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handlePublish(story.id, story.is_published)}
                                            >
                                                Unpublish
                                            </button>
                                        )
                                    )}

                                    {isMe && (
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate(`/edit/${story.id}`)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
