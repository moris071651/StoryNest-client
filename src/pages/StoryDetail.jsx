import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8000/api/v1";

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      const res = await axios.get(`${API}/stories/${id}`);
      setStory(res.data);
    };
    fetchStory();
  }, [id]);

  if (!story) return <div>Loading...</div>;

  return (
    <div>
      <h2>{story.title}</h2>
      <p><i>{story.subtitle}</i></p>
      <p>{story.content}</p>
    </div>
  );
}
