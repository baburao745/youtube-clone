import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios.js";

function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
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

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError("");

        const [videoResponse, commentsResponse] = await Promise.all([
          api.get(`/videos/${id}`),
          api.get(`/comments/${id}`),
        ]);

        setVideo(videoResponse.data.video || videoResponse.data);
        setComments(
          commentsResponse.data.comments || commentsResponse.data || []
        );
      } catch (error) {
        console.error("VIDEO PAGE ERROR:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load this video."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      alert("Please sign in to like videos.");
      return;
    }

    try {
      const response = await api.post(`/videos/${id}/like`);

      setVideo(response.data.video || response.data);
    } catch (error) {
      console.error("LIKE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to like this video."
      );
    }
  };

  const handleDislike = async () => {
    if (!token) {
      alert("Please sign in to dislike videos.");
      return;
    }

    try {
      const response = await api.post(`/videos/${id}/dislike`);

      setVideo(response.data.video || response.data);
    } catch (error) {
      console.error("DISLIKE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to dislike this video."
      );
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please sign in to comment.");
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      const response = await api.post("/comments", {
        videoId: id,
        text: commentText.trim(),
      });

      const newComment = response.data.comment || response.data;

      setComments((previousComments) => [
        newComment,
        ...previousComments,
      ]);

      setCommentText("");
    } catch (error) {
      console.error("ADD COMMENT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to add comment."
      );
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) {
      return;
    }

    try {
      const response = await api.put(`/comments/${commentId}`, {
        text: editText.trim(),
      });

      const updatedComment =
        response.data.comment || response.data;

      setComments((previousComments) =>
        previousComments.map((comment) =>
          comment._id === commentId
            ? updatedComment
            : comment
        )
      );

      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.error("UPDATE COMMENT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update comment."
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/comments/${commentId}`);

      setComments((previousComments) =>
        previousComments.filter(
          (comment) => comment._id !== commentId
        )
      );
    } catch (error) {
      console.error("DELETE COMMENT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete comment."
      );
    }
  };

  if (loading) {
    return (
      <div className="video-player-container">
        <div className="loading-message">
          Loading video...
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="video-player-container">
        <div className="empty-message">
          <h2>Video Not Available</h2>
          <p>
            {error || "This video could not be found."}
          </p>

          <Link to="/" className="home-button">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const channelId = getId(video.channel);

  return (
    <main className="video-player-container">
      <div className="main-video">
        <video
          controls
          width="100%"
          poster={video.thumbnailUrl}
        >
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </div>

      <h1 className="video-title">
        {video.title}
      </h1>

      <div className="video-meta">
        <span>{video.views || 0} views</span>
        <span>•</span>
        <span>
          {video.category || "Other"}
        </span>
      </div>

      <div className="video-actions">
        <button type="button" onClick={handleLike}>
          👍 {video.likes || 0}
        </button>

        <button type="button" onClick={handleDislike}>
          👎 {video.dislikes || 0}
        </button>
      </div>

      {channelId && (
        <div className="video-channel">
          <div className="channel-mini-avatar">
            {video.channel?.name?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div>
            <Link to={`/channel/${channelId}`}>
              <strong>
                {video.channel?.name || "Unknown Channel"}
              </strong>
            </Link>
          </div>
        </div>
      )}

      <div className="video-description">
        <h3>Description</h3>
        <p>
          {video.description ||
            "No description available for this video."}
        </p>
      </div>

      <section className="comments-section">
        <h2>
          Comments ({comments.length})
        </h2>

        <form
          className="comment-form"
          onSubmit={handleAddComment}
        >
          <input
            type="text"
            placeholder={
              token
                ? "Add a comment..."
                : "Sign in to comment"
            }
            value={commentText}
            onChange={(e) =>
              setCommentText(e.target.value)
            }
            disabled={!token || commentLoading}
          />

          <button
            type="submit"
            disabled={!token || commentLoading}
          >
            {commentLoading ? "Adding..." : "Comment"}
          </button>
        </form>

        {comments.length === 0 && (
          <p className="empty-message">
            No comments yet. Be the first to comment!
          </p>
        )}

        {comments.map((comment) => {
          const commentUserId = getId(comment.user);
          const currentUserId = getId(user);

          const isOwner =
            commentUserId &&
            currentUserId &&
            String(commentUserId) ===
              String(currentUserId);

          return (
            <div
              key={comment._id}
              className="comment-card"
            >
              <strong>
                {comment.user?.username || "User"}
              </strong>

              {editingComment === comment._id ? (
                <div className="comment-edit">
                  <input
                    value={editText}
                    onChange={(e) =>
                      setEditText(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateComment(comment._id)
                    }
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingComment(null);
                      setEditText("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p>{comment.text}</p>
              )}

              {isOwner && editingComment !== comment._id && (
                <div className="comment-buttons">
                  <button
                    type="button"
                    onClick={() =>
                      handleEditComment(comment)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteComment(comment._id)
                    }
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

export default VideoPlayer;