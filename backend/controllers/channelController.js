import Channel from "../models/Channel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Channel name is required"
      });
    }

    const existingChannel = await Channel.findOne({
      owner: req.user.userId
    });

    if (existingChannel) {
      return res.status(409).json({
        message: "You already have a channel"
      });
    }

    const channel = await Channel.create({
      name,
      description,
      owner: req.user.userId
    });

    res.status(201).json({
      message: "Channel created successfully",
      channel
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create channel",
      error: error.message
    });
  }
};

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username email");

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found"
      });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch channel",
      error: error.message
    });
  }
};