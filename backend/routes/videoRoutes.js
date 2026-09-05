import express from "express";

import {
  createVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo
} from "../controllers/videoController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVideos);

router.get("/:id", getVideo);

router.post("/", authMiddleware, createVideo);

router.put("/:id", authMiddleware, updateVideo);

router.delete("/:id", authMiddleware, deleteVideo);

router.post("/:id/like", authMiddleware, likeVideo);

router.post("/:id/dislike", authMiddleware, dislikeVideo);

export default router;