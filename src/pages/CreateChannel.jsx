import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateChannel() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleCreateChannel = async (e) => {
    e.preventDefault();

    setError("");

    if (!token) {
      alert("Please sign in first.");
      navigate("/login");
      return;
    }

    if (!name.trim()) {
      setError("Channel name is required.");
      return;
    }

    if (name.trim().length < 3) {
      setError("Channel name must be at least 3 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/channels",
        {
          name: name.trim(),
          description: description.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Channel created successfully!");

      const channel =
        response.data.channel || response.data;

      navigate(`/channel/${channel._id}`);
    } catch (error) {
      console.error("CREATE CHANNEL ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create channel."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-channel-page">

      <div className="create-channel-box">

        <h1>Create Your Channel</h1>

        <p>
          Create your own YouTube Clone channel
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateChannel}>

          <input
            type="text"
            placeholder="Channel name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <textarea
            placeholder="Channel description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Channel..."
              : "Create Channel"}
          </button>

        </form>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </div>

    </div>
  );
}

export default CreateChannel;