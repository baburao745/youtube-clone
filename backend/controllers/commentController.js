import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const createComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;

    if (!text || !videoId) {
      return res.status(400).json({
        message: "Comment text and video ID are required"
      });
    }

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    const comment = await Comment.create({
      text,
      video: videoId,
      user: req.user.userId
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "username");

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      video: req.params.videoId
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required"
      });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only edit your own comment"
      });
    }

    comment.text = text;

    await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update comment",
      error: error.message
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found"
      });
    }

    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own comment"
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message
    });
  }
};