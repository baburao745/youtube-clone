import Channel from "../models/Channel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Channel name is required.",
      });
    }

    if (name.trim().length < 3) {
      return res.status(400).json({
        message: "Channel name must be at least 3 characters.",
      });
    }

    const existingChannel = await Channel.findOne({
      owner: req.user.userId,
    });

    if (existingChannel) {
      return res.status(409).json({
        message: "You already have a channel.",
      });
    }

    const channel = await Channel.create({
      name: name.trim(),
      description: description?.trim() || "",
      owner: req.user.userId,
    });

    res.status(201).json({
      message: "Channel created successfully.",
      channel,
    });
  } catch (error) {
    console.error("CREATE CHANNEL ERROR:", error);

    res.status(500).json({
      message: "Server error while creating channel.",
    });
  }
};

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username email");

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found.",
      });
    }

    res.status(200).json(channel);
  } catch (error) {
    console.error("GET CHANNEL ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching channel.",
    });
  }
};

export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({
      owner: req.user.userId,
    }).populate("owner", "username email");

    if (!channel) {
      return res.status(404).json({
        message: "Channel not found.",
      });
    }

    res.status(200).json({
      channel,
    });
  } catch (error) {
    console.error("GET MY CHANNEL ERROR:", error);

    res.status(500).json({
      message: "Server error while fetching your channel.",
    });
  }
};