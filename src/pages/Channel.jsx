import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function Channel() {
  const { id } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchChannelData();
  }, [id]);

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
      <div className="channel-header">
        <div className="channel-avatar">
          {channel.name.charAt(0).toUpperCase()}
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
    </div>
  );
}

export default Channel;