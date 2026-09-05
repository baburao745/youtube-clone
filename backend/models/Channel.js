import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },

    description: {
      type: String,
      default: ""
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    subscribers: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;