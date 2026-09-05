import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/videos/${id}`
      );

      setVideo(
        response.data.video || response.data
      );
    } catch (error) {
      console.error(error);
      setError("Unable to load video.");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/${id}`
      );

      setComments(
        response.data.comments ||
          response.data
      );
    } catch (error) {
      console.error(error);
      setComments([]);
    }
  };

  useEffect(() => {
    const loadVideo = async () => {
      setLoading(true);

      await fetchVideo();
      await fetchComments();

      setLoading(false);
    };

    loadVideo();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      alert("Please sign in to like this video.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/videos/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchVideo();
    } catch (error) {
      console.error(error);
      alert("Unable to like video.");
    }
  };

  const handleDislike = async () => {
    if (!token) {
      alert("Please sign in to dislike this video.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/videos/${id}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchVideo();
    } catch (error) {
      console.error(error);
      alert("Unable to dislike video.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

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
          text: commentText.trim(),
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

  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleEditComment = async (commentId) => {
    if (!token) {
      alert("Please sign in.");
      return;
    }

    if (!editingText.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          text: editingText.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      cancelEditing();

      await fetchComments();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to edit comment."
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      alert("Please sign in.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await fetchComments();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to delete comment."
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
        <h2>Video not found.</h2>
      </div>
    );
  }

  const channelId =
    typeof video.channel === "object"
      ? video.channel?._id
      : video.channel;

  return (
    <div className="video-player-page">

      {/* VIDEO */}
      <div className="video-player-container">
        <video
          controls
          className="main-video"
          src={video.videoUrl}
        >
          Your browser does not support video playback.
        </video>
      </div>

      {/* TITLE */}
      <h1 className="video-title">
        {video.title}
      </h1>

      {/* VIDEO INFO */}
      <div className="video-meta">

        <div>
          <p>
            {video.views || 0} views
          </p>

          <p>
            Category:{" "}
            {video.category || "Other"}
          </p>
        </div>

        <div className="video-actions">

          <button onClick={handleLike}>
            👍 {video.likes || 0}
          </button>

          <button onClick={handleDislike}>
            👎 {video.dislikes || 0}
          </button>

        </div>

      </div>

      {/* CHANNEL */}
      <div className="video-channel">

        <div className="channel-mini-avatar">
          {video.channel?.name
            ? video.channel.name
                .charAt(0)
                .toUpperCase()
            : "C"}
        </div>

        <div>
          <strong>
            {video.channel?.name ||
              "Unknown Channel"}
          </strong>

          {channelId && (
            <Link
              to={`/channel/${channelId}`}
            >
              <p>View Channel</p>
            </Link>
          )}
        </div>

      </div>

      {/* DESCRIPTION */}
      <div className="video-description">

        <h3>Description</h3>

        <p>
          {video.description ||
            "No description available."}
        </p>

      </div>

      {/* COMMENTS */}
      <div className="comments-section">

        <h2>
          Comments ({comments.length})
        </h2>

        <form
          onSubmit={handleAddComment}
          className="comment-form"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) =>
              setCommentText(e.target.value)
            }
          />

          <button type="submit">
            Comment
          </button>
        </form>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="comments-list">

            {comments.map((comment) => {

              const commentUserId =
                typeof comment.user === "object"
                  ? comment.user?._id
                  : comment.user;

              const currentUserId =
                user?.id ||
                user?._id ||
                user?.userId;

              const isOwner =
                user &&
                String(commentUserId) ===
                  String(currentUserId);

              return (
                <div
                  className="comment-card"
                  key={comment._id}
                >

                  <strong>
                    {comment.user?.username ||
                      "User"}
                  </strong>

                  {editingId ===
                  comment._id ? (
                    <div className="comment-edit">

                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) =>
                          setEditingText(
                            e.target.value
                          )
                        }
                      />

                      <button
                        onClick={() =>
                          handleEditComment(
                            comment._id
                          )
                        }
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>

                    </div>
                  ) : (
                    <>
                      <p>{comment.text}</p>

                      {isOwner && (
                        <div className="comment-buttons">

                          <button
                            onClick={() =>
                              startEditing(
                                comment
                              )
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteComment(
                                comment._id
                              )
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>
                      )}
                    </>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default VideoPlayer;