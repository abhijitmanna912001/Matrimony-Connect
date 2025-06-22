import { Response } from "express";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../types/express";

// ✅ Send a new message
export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const senderId = req.user?.id;
    const { recipientId, content } = req.body;

    if (!senderId || !recipientId || !content) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // ✅ Restrict messaging to only premium users
    if (!sender.isPremium) {
      res.status(403).json({ message: "Upgrade to premium to send messages" });
      return;
    }

    const message = new Message({
      sender: senderId,
      recipient: recipientId, // ✅ renamed
      content,
    });

    await message.save();

    res
      .status(201)
      .json({ message: "Message sent successfully", data: message });
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
        { sender: userId, recipient: withUserId }, // ✅ updated
        { sender: withUserId, recipient: userId }, // ✅ updated
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conversation", error });
  }
};
