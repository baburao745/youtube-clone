import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function CreateChannel() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [existingChannel, setExistingChannel] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkExistingChannel = async () => {
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const response = await api.get("/channels/my-channel");

        if (response.data.channel) {
          setExistingChannel(response.data.channel);
        }
      } catch (error) {
        // 404 means the user does not have a channel yet.
        if (error.response?.status !== 404) {
          console.error("CHECK CHANNEL ERROR:", error);
        }
      } finally {
        setChecking(false);
      }
    };

    checkExistingChannel();
  }, [token]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      alert("Please sign in first.");
      navigate("/login");
      return;
    }

    if (existingChannel) {
      setError("You already have a channel.");
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

    if (name.trim().length > 50) {
      setError("Channel name cannot exceed 50 characters.");
      return;
    }

    if (description.trim().length > 500) {
      setError("Description cannot exceed 500 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/channels", {
        name: name.trim(),
        description: description.trim(),
      });

      alert("Channel created successfully!");

      const channel = response.data.channel || response.data;

      navigate(`/channel/${channel._id}`);
    } catch (error) {
      console.error("CREATE CHANNEL ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create channel. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const previewLetter = name.trim()
    ? name.trim().charAt(0).toUpperCase()
    : "C";

  if (checking) {
    return (
      <div className="create-channel-page">
        <div className="create-channel-card">
          <div className="loading-message">
            Checking your channel...
          </div>
        </div>
      </div>
    );
  }

  if (existingChannel) {
    return (
      <div className="create-channel-page">
        <div className="create-channel-card">
          <div className="create-channel-header">
            <h1>You Already Have a Channel</h1>
            <p>
              You can manage your existing channel from here.
            </p>
          </div>

          <div className="channel-preview">
            <div className="preview-avatar">
              {existingChannel.name
                ?.charAt(0)
                ?.toUpperCase() || "C"}
            </div>

            <div className="preview-info">
              <span className="preview-label">
                Your Channel
              </span>

              <h2>{existingChannel.name}</h2>

              <p>
                {existingChannel.description ||
                  "No channel description yet."}
              </p>
            </div>
          </div>

          <div className="channel-form-buttons">
            <button
              type="button"
              className="cancel-channel-btn"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>

            <button
              type="button"
              className="create-channel-submit"
              onClick={() =>
                navigate(`/channel/${existingChannel._id}`)
              }
            >
              Manage Channel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-channel-page">
      <div className="create-channel-card">
        <div className="create-channel-header">
          <h1>Create Your Channel</h1>

          <p>
            Build your own space and start sharing videos.
          </p>
        </div>

        <div className="channel-preview">
          <div className="preview-avatar">
            {previewLetter}
          </div>

          <div className="preview-info">
            <span className="preview-label">
              Channel Preview
            </span>

            <h2>
              {name.trim() || "Your Channel Name"}
            </h2>

            <p>
              {description.trim() ||
                "Your channel description will appear here."}
            </p>
          </div>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form
          className="channel-create-form"
          onSubmit={handleCreateChannel}
        >
          <div className="form-group">
            <label htmlFor="channel-name">
              Channel Name
            </label>

            <input
              id="channel-name"
              type="text"
              placeholder="Enter your channel name"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
            />

            <span className="input-count">
              {name.length}/50
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="channel-description">
              Channel Description
            </label>

            <textarea
              id="channel-description"
              placeholder="Tell viewers what your channel is about..."
              value={description}
              maxLength={500}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <span className="input-count">
              {description.length}/500
            </span>
          </div>

          <div className="channel-form-buttons">
            <button
              type="button"
              className="cancel-channel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-channel-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Channel..."
                : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChannel;