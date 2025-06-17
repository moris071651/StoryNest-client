import { useState, useEffect } from "react";

export default function StoryForm({
  initialData = {},
  onSubmit,
  onCancel,
  buttonLabel = "Submit",
  loading = false,
}) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    content: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    setForm({
      title: initialData.title || "",
      subtitle: initialData.subtitle || "",
      content: initialData.content || "",
    });
  }, [initialData]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    setError(null);
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    onSubmit(form, setError);
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Title *</label>
        <input
          type="text"
          className="form-control"
          value={form.title}
          onChange={handleChange("title")}
          placeholder="Enter title"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Subtitle</label>
        <input
          type="text"
          className="form-control"
          value={form.subtitle}
          onChange={handleChange("subtitle")}
          placeholder="Enter subtitle"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Content *</label>
        <textarea
          className="form-control"
          rows={10}
          value={form.content}
          onChange={handleChange("content")}
          placeholder="Write your story..."
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : buttonLabel}
        </button>
        {onCancel && (
          <button className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
