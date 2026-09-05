import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

function Channel() {
  const { id } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("Technology");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const getId = (value) => {
    if (!value) return null;

    if (typeof value === "object") {
      return value._id || value.id || value.userId || null;
    }

    return value;
  };

  const loggedInUserId =
    user?.id || user?._id || user?.userId;

  const channelOwnerId = getId(channel?.owner);

  const isChannelOwner =
    Boolean(token) &&
    Boolean(loggedInUserId) &&
    Boolean(channelOwnerId) &&
    String(loggedInUserId) === String(channelOwnerId);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError("");

      const [channelResponse, videosResponse] =
        await Promise.all([
          api.get(`/channels/${id}`),
          api.get("/videos"),
        ]);

      const channelData =
        channelResponse.data.channel ||
        channelResponse.data;

      const allVideos =
        videosResponse.data.videos ||
        videosResponse.data ||
        [];

      const channelVideos = allVideos.filter(
        (video) =>
          String(getId(video.channel)) === String(id)
      );

      setChannel(channelData);
      setVideos(channelVideos);
    } catch (error) {
      console.error("CHANNEL ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load channel."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [id]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setThumbnailUrl("");
    setCategory("Technology");
    setEditingId(null);
  };

  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Video title is required.");
      return;
    }

    if (!videoUrl.trim()) {
      setError("Video URL is required.");
      return;
    }

    if (!thumbnailUrl.trim()) {
      setError("Thumbnail URL is required.");
      return;
    }

    try {
      setSaving(true);

      const videoData = {
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        category,
        channelId: id,
      };

      if (editingId) {
        await api.put(
          `/videos/${editingId}`,
          videoData
        );

        alert("Video updated successfully!");
      } else {
        await api.post("/videos", videoData);

        alert("Video created successfully!");
      }

      resetForm();
      await fetchChannelData();
    } catch (error) {
      console.error("VIDEO SAVE ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to save video."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video) => {
    setEditingId(video._id);
    setTitle(video.title || "");
    setDescription(video.description || "");
    setVideoUrl(video.videoUrl || "");
    setThumbnailUrl(video.thumbnailUrl || "");
    setCategory(video.category || "Technology");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (videoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/videos/${videoId}`);

      alert("Video deleted successfully!");

      await fetchChannelData();
    } catch (error) {
      console.error("DELETE VIDEO ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete video."
      );
    }
  };

  if (loading) {
    return (
      <main className="channel-page">
        <div className="loading-message">
          Loading channel...
        </div>
      </main>
    );
  }

  if (error && !channel) {
    return (
      <main className="channel-page">
        <div className="empty-message">
          <h2>Unable to load channel</h2>
          <p>{error}</p>
          <Link to="/" className="home-button">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="channel-page">
      <section className="channel-header">
        <h1>{channel?.name}</h1>

        <p>
          {channel?.description ||
            "Welcome to this channel."}
        </p>

        <p className="channel-owner">
          Channel owner:{" "}
          {channel?.owner?.username || "Unknown User"}
        </p>
      </section>

      {isChannelOwner && (
        <section className="channel-video-form">
          <h2>
            {editingId
              ? "Edit Your Video"
              : "Upload a New Video"}
          </h2>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmitVideo}>
            <div className="video-form-group">
              <label htmlFor="video-title">
                Video Title
              </label>

              <input
                id="video-title"
                type="text"
                placeholder="Enter video title"
                value={title}
                maxLength={100}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <span className="video-input-count">
                {title.length}/100
              </span>
            </div>

            <div className="video-form-group">
              <label htmlFor="video-description">
                Description
              </label>

              <textarea
                id="video-description"
                placeholder="Tell viewers about your video..."
                value={description}
                maxLength={1000}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <span className="video-input-count">
                {description.length}/1000
              </span>
            </div>

            <div className="video-form-group">
              <label htmlFor="video-url">
                Video URL
              </label>

              <input
                id="video-url"
                type="url"
                placeholder="https://example.com/video.mp4"
                value={videoUrl}
                onChange={(e) =>
                  setVideoUrl(e.target.value)
                }
              />
            </div>

            <div className="video-form-group">
              <label htmlFor="thumbnail-url">
                Thumbnail URL
              </label>

              <input
                id="thumbnail-url"
                type="url"
                placeholder="https://example.com/thumbnail.jpg"
                value={thumbnailUrl}
                onChange={(e) =>
                  setThumbnailUrl(e.target.value)
                }
              />
            </div>

            <div className="video-form-group">
              <label htmlFor="video-category">
                Category
              </label>

              <select
                id="video-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option value="Music">Music</option>
                <option value="Gaming">Gaming</option>
                <option value="Movies">Movies</option>
                <option value="News">News</option>
                <option value="Sports">Sports</option>
                <option value="Technology">
                  Technology
                </option>
                <option value="Education">
                  Education
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="video-form-buttons">
              <button
                type="submit"
                className="video-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Video"
                  : "Create Video"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="video-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <h2 className="channel-videos-title">
        Videos
      </h2>

      {videos.length === 0 ? (
        <div className="empty-message">
          <h2>No videos yet</h2>

          <p>
            {isChannelOwner
              ? "Create your first video above."
              : "This channel has not uploaded any videos yet."}
          </p>
        </div>
      ) : (
        <div className="channel-video-list">
          {videos.map((video) => (
            <div
              className="channel-video-item"
              key={video._id}
            >
              <Link to={`/video/${video._id}`}>
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                />
              </Link>

              <div className="channel-video-content">
                <h3>{video.title}</h3>

                <p>
                  {video.views || 0} views
                </p>

                <p>
                  {video.category || "Other"}
                </p>

                {isChannelOwner && (
                  <div className="channel-video-buttons">
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(video)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(video._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Channel;