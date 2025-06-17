import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StoryForm from "../components/StoryForm";

const API = "http://localhost:8000/api/v1";

export default function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing story to populate form
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`${API}/stories/${id}`, {
          withCredentials: true,
        });
        setInitialData(res.data);
      } catch (err) {
        setError("Failed to load story.");
      } finally {
        setFetching(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleUpdate = async (formData, setFormError) => {
    try {
      setLoading(true);
      await axios.patch(`${API}/stories/${id}`, formData, {
        withCredentials: true,
      });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Error updating story.";
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="m-4">Loading story...</p>;
  if (error) return <p className="text-danger m-4">{error}</p>;

  return (
    <div className="container my-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Edit Story</h2>
      <StoryForm
        initialData={initialData}
        onSubmit={handleUpdate}
        buttonLabel="Update Story"
        loading={loading}
        onCancel={() => navigate("/dashboard")}
      />
    </div>
  );
}
