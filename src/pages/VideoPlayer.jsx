import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:5000/api/videos/${id}`
        );

        console.log("VIDEO RESPONSE:", response.data);

        // Supports both response.data and response.data.video
        const videoData = response.data.video || response.data;

        setVideo(videoData);
      } catch (error) {
        console.error("VIDEO ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load video"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="video-player-page">
        <h2>Loading video...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-player-page">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="video-player-page">
        <h2>Video not found</h2>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      <div className="video-player">
        <video
          controls
          width="100%"
          src={video.videoUrl}
        >
          Your browser does not support video playback.
        </video>
      </div>

      <h1>{video.title}</h1>

      <p>
        <strong>Channel:</strong>{" "}
        {video.channel?.name || "Unknown Channel"}
      </p>

      <p>
        <strong>Views:</strong> {video.views}
      </p>

      <div className="video-description">
        <h3>Description</h3>

        <p>
          {video.description || "No description available."}
        </p>
      </div>
    </div>
  );
}

export default VideoPlayer;