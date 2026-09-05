import express from "express";
import {
  createChannel,
  getChannel
} from "../controllers/channelController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChannel);
router.get("/:id", getChannel);

export default router;