import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

export const createVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channelId,
      category
    } = req.body;

    if (!title || !videoUrl || !thumbnailUrl || !channelId) {
      return res.status(400).json({
        message:
          "Title, video URL, thumbnail URL and channel are required"
      });
    }

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found"
      });
    }

    if (channel.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only upload to your own channel"
      });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channel: channelId,
      owner: req.user.userId,
      category: category || "Other"
    });

    res.status(201).json({
      message: "Video created successfully",
      video
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create video",
      error: error.message
    });
  }
};

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "name")
      .populate("owner", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch videos",
      error: error.message
    });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "name description")
      .populate("owner", "username");

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    video.views += 1;
    await video.save();

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch video",
      error: error.message
    });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    if (video.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own video"
      });
    }

    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category
    } = req.body;

    video.title = title ?? video.title;
    video.description = description ?? video.description;
    video.videoUrl = videoUrl ?? video.videoUrl;
    video.thumbnailUrl = thumbnailUrl ?? video.thumbnailUrl;
    video.category = category ?? video.category;

    await video.save();

    res.status(200).json({
      message: "Video updated successfully",
      video
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update video",
      error: error.message
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    if (video.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own video"
      });
    }

    await video.deleteOne();

    res.status(200).json({
      message: "Video deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete video",
      error: error.message
    });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    video.likes += 1;

    await video.save();

    res.status(200).json({
      message: "Video liked",
      likes: video.likes,
      dislikes: video.dislikes
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to like video",
      error: error.message
    });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    video.dislikes += 1;

    await video.save();

    res.status(200).json({
      message: "Video disliked",
      likes: video.likes,
      dislikes: video.dislikes
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to dislike video",
      error: error.message
    });
  }
};