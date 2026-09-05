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

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError("");

      const channelResponse = await axios.get(
        `http://localhost:5000/api/channels/${id}`
      );

      setChannel(
        channelResponse.data.channel ||
          channelResponse.data
      );

      const videosResponse = await axios.get(
        "http://localhost:5000/api/videos"
      );

      const allVideos =
        videosResponse.data.videos ||
        videosResponse.data;

      const channelVideos = allVideos.filter(
        (video) =>
          video.channel?._id === id ||
          video.channel === id
      );

      setVideos(channelVideos);
    } catch (error) {
      console.error(error);
      setError("Unable to load channel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [id]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please sign in to create a channel.");
      navigate("/login");
      return;
    }

    if (!channelName.trim()) {
      alert("Channel name is required.");
      return;
    }

    if (channelName.trim().length < 3) {
      alert("Channel name must be at least 3 characters.");
      return;
    }

    try {
      setCreating(true);

      const response = await axios.post(
        "http://localhost:5000/api/channels",
        {
          name: channelName,
          description: channelDescription
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newChannel =
        response.data.channel ||
        response.data;

      setChannel(newChannel);
      setChannelName("");
      setChannelDescription("");
      setShowCreateForm(false);

      alert("Channel created successfully!");

      if (newChannel._id) {
        navigate(`/channel/${newChannel._id}`);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to create channel."
      );
    } finally {
      setCreating(false);
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

  return (
    <div className="channel-page">
      {channel ? (
        <>
          <div className="channel-header">
            <div className="channel-avatar">
              {channel.name
                .charAt(0)
                .toUpperCase()}
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

          <div className="channel-videos">
            <h2>Videos</h2>

            {videos.length === 0 ? (
              <p>No videos uploaded yet.</p>
            ) : (
              <div className="channel-video-grid">
                {videos.map((video) => (
                  <Link
                    to={`/video/${video._id}`}
                    className="channel-video-card"
                    key={video._id}
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                    />

                    <h3>{video.title}</h3>

                    <p>{video.views} views</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <h1>Create Your Channel</h1>

          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
            >
              + Create Channel
            </button>
          )}

          {showCreateForm && (
            <form
              onSubmit={handleCreateChannel}
              className="channel-form"
            >
              <input
                type="text"
                placeholder="Channel name"
                value={channelName}
                onChange={(e) =>
                  setChannelName(e.target.value)
                }
              />

              <textarea
                placeholder="Channel description"
                value={channelDescription}
                onChange={(e) =>
                  setChannelDescription(
                    e.target.value
                  )
                }
              />

              <button
                type="submit"
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Channel"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(false)
                }
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Channel;