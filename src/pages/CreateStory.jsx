import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StoryForm from "../components/StoryForm";

const API = "http://localhost:8000/api/v1";

export default function CreateStory() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialData = useMemo(() => ({
    title: "",
    subtitle: null,
    content: null,
  }), []);

  const handleCreate = useCallback(async (formData, setError) => {
    console.log(formData)
    setError(null);
    setLoading(true);

    if (formData.subtitle == "") {
      formData.subtitle = null;
    }

    try {
      await axios.post(`${API}/stories/`, formData, { withCredentials: true });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Error submitting story.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <div className="container my-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Create a Story</h2>
      <StoryForm
        initialData={initialData}
        onSubmit={handleCreate}
        buttonLabel="Create Story"
        loading={loading}
        onCancel={() => navigate("/dashboard")}
      />
    </div>
  );
}
