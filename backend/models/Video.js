import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },

    description: {
      type: String,
      default: ""
    },

    videoUrl: {
      type: String,
      required: true
    },

    thumbnailUrl: {
      type: String,
      required: true
    },

    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: String,
      default: "Other"
    },

    views: {
      type: Number,
      default: 0
    },

    likes: {
      type: Number,
      default: 0
    },

    dislikes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;