import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getConversation,
} from "../controllers/message.controller.js";

const router = Router();

// ✅ Send a message (POST /api/messages)
router.post("/", verifyToken, sendMessage);

// ✅ Get conversation with a specific user (GET /api/messages/:withUserId)
router.get("/:withUserId", verifyToken, getConversation);

export default router;
