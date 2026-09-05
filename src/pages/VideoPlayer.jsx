import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/videos/${id}`
      );

      const videoData = response.data.video || response.data;
      setVideo(videoData);
    } catch (error) {
      console.error(error);
      setError("Unable to load video");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/${id}`
      );

      setComments(response.data.comments || response.data);
    } catch (error) {
      console.error("Comments error:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await fetchVideo();
      await fetchComments();

      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please sign in to like this video.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/videos/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchVideo();
    } catch (error) {
      console.error(error);
      alert("Unable to like video.");
    }
  };

  const handleDislike = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please sign in to dislike this video.");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/videos/${id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchVideo();
    } catch (error) {
      console.error(error);
      alert("Unable to dislike video.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please sign in to comment.");
      return;
    }

    if (!commentText.trim()) {
      alert("Please enter a comment.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/comments",
        {
          text: commentText,
          videoId: id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCommentText("");

      await fetchComments();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to add comment."
      );
    }
  };

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

      <div className="video-actions">
        <button onClick={handleLike}>
          👍 Like {video.likes}
        </button>

        <button onClick={handleDislike}>
          👎 Dislike {video.dislikes}
        </button>
      </div>

      <div className="video-description">
        <h3>Description</h3>

        <p>
          {video.description || "No description available."}
        </p>
      </div>

      <div className="comments-section">
        <h2>Comments ({comments.length})</h2>

        <form onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <button type="submit">
            Comment
          </button>
        </form>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                className="comment-card"
                key={comment._id}
              >
                <strong>
                  {comment.user?.username || "User"}
                </strong>

                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;