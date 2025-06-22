import { Response } from "express";
import { Message } from "../models/Message.js";
import { AuthenticatedRequest } from "../types/express/index.js";

// ✅ Send a new message
export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const senderId = req.user?.id;
    const { receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};
  
// ✅ Get conversation between two users
export const getConversation = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { withUserId } = req.params;

    if (!userId || !withUserId) {
      res.status(400).json({ message: "Missing user IDs" });
      return;
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: withUserId },
        { sender: withUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }); // sorted by timestamp ascending

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversation", error });
  }
};