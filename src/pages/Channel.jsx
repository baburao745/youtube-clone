import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Channel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("Technology");

  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Get logged-in user ID
  const loggedInUserId =
    user?.id ||
    user?._id ||
    user?.userId;

  const getId = (value) => {
    if (!value) return null;

    if (typeof value === "object") {
      return value._id || value.id || null;
    }

    return value;
  };

  // Fetch channel and videos
  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError("");

      const channelResponse = await axios.get(
        `http://localhost:5000/api/channels/${id}`
      );

      const channelData =
        channelResponse.data.channel ||
        channelResponse.data;

      setChannel(channelData);

      const videosResponse = await axios.get(
        "http://localhost:5000/api/videos"
      );

      const allVideos =
        videosResponse.data.videos ||
        videosResponse.data;

      const channelVideos = allVideos.filter((video) => {
        const videoChannelId = getId(video.channel);

        return (
          String(videoChannelId) === String(id)
        );
      });

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

  // Channel owner
  const channelOwnerId = getId(channel?.owner);

  // Check channel ownership
  const isChannelOwner =
    Boolean(token) &&
    Boolean(loggedInUserId) &&
    Boolean(channelOwnerId) &&
    String(loggedInUserId) ===
      String(channelOwnerId);

  // Clear form
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setThumbnailUrl("");
    setCategory("Technology");
    setEditingId(null);
    setShowVideoForm(false);
  };

  // Create form
  const openCreateForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setThumbnailUrl("");
    setCategory("Technology");
    setShowVideoForm(true);
  };

  // Create video
  const handleCreateVideo = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please sign in first.");
      navigate("/login");
      return;
    }

    if (!isChannelOwner) {
      alert("You can only create videos on your own channel.");
      return;
    }

    if (!title.trim()) {
      alert("Video title is required.");
      return;
    }

    if (!videoUrl.trim()) {
      alert("Video URL is required.");
      return;
    }

    if (!thumbnailUrl.trim()) {
      alert("Thumbnail URL is required.");
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        "http://localhost:5000/api/videos",
        {
          title: title.trim(),
          description: description.trim(),
          videoUrl: videoUrl.trim(),
          thumbnailUrl: thumbnailUrl.trim(),
          channelId: id,
          category
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Video created successfully!");

      clearForm();
      await fetchChannelData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to create video."
      );
    } finally {
      setSaving(false);
    }
  };

  // Edit video
  const startEditing = (video) => {
    setEditingId(video._id);

    setTitle(video.title || "");
    setDescription(video.description || "");
    setVideoUrl(video.videoUrl || "");
    setThumbnailUrl(video.thumbnailUrl || "");
    setCategory(video.category || "Technology");

    setShowVideoForm(true);
  };

  // Update video
  const handleUpdateVideo = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please sign in first.");
      navigate("/login");
      return;
    }

    if (!title.trim()) {
      alert("Video title is required.");
      return;
    }

    if (!videoUrl.trim()) {
      alert("Video URL is required.");
      return;
    }

    if (!thumbnailUrl.trim()) {
      alert("Thumbnail URL is required.");
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        `http://localhost:5000/api/videos/${editingId}`,
        {
          title: title.trim(),
          description: description.trim(),
          videoUrl: videoUrl.trim(),
          thumbnailUrl: thumbnailUrl.trim(),
          category
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Video updated successfully!");

      clearForm();
      await fetchChannelData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to update video."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    if (!token) {
      alert("Please sign in first.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/videos/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Video deleted successfully!");

      await fetchChannelData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to delete video."
      );
    }
  };

  if (loading) {
    return (
      <div className="channel-page">
        <h2>Loading channel...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="channel-page">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="channel-page">
        <h2>Channel not found</h2>
      </div>
    );
  }

  return (
    <div className="channel-page">

      {/* CHANNEL HEADER */}
      <div className="channel-header">

        <div className="channel-avatar">
          {channel.name
            ? channel.name.charAt(0).toUpperCase()
            : "C"}
        </div>

        <div className="channel-details">
          <h1>{channel.name}</h1>

          <p>
            {channel.description ||
              "Welcome to my channel!"}
          </p>

          <p>
            {channel.subscribers || 0} subscribers
          </p>
        </div>

      </div>

      {/* CREATE VIDEO */}
      {isChannelOwner && (
        <div className="channel-actions">

          <button onClick={openCreateForm}>
            + Create Video
          </button>

        </div>
      )}

      {/* CREATE / EDIT FORM */}
      {showVideoForm && isChannelOwner && (
        <form
          className="channel-form"
          onSubmit={
            editingId
              ? handleUpdateVideo
              : handleCreateVideo
          }
        >

          <h2>
            {editingId
              ? "Edit Video"
              : "Create New Video"}
          </h2>

          <input
            type="text"
            placeholder="Video title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Video description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Video URL"
            value={videoUrl}
            onChange={(e) =>
              setVideoUrl(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Thumbnail URL"
            value={thumbnailUrl}
            onChange={(e) =>
              setThumbnailUrl(e.target.value)
            }
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="Technology">Technology</option>
            <option value="Education">Education</option>
            <option value="Music">Music</option>
            <option value="Gaming">Gaming</option>
            <option value="Movies">Movies</option>
            <option value="News">News</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Video"
              : "Create Video"}
          </button>

          <button
            type="button"
            onClick={clearForm}
          >
            Cancel
          </button>

        </form>
      )}

      {/* VIDEOS */}
      <div className="channel-videos">

        <h2>Videos</h2>

        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          <div className="channel-video-grid">

            {videos.map((video) => (
              <div
                className="channel-video-card"
                key={video._id}
              >

                <Link
                  to={`/video/${video._id}`}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                  />

                  <h3>{video.title}</h3>

                  <p>
                    {video.views || 0} views
                  </p>
                </Link>

                {/* EDIT + DELETE */}
                {isChannelOwner && (
                  <div className="video-management-buttons">

                    <button
                      type="button"
                      onClick={() =>
                        startEditing(video)
                      }
                    >
                      ✏️ Edit Video
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteVideo(
                          video._id
                        )
                      }
                    >
                      🗑️ Delete Video
                    </button>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Channel;