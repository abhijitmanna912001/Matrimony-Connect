import { Response } from "express";
import { User } from "../models/User.js";
import { AuthenticatedRequest } from "../types/express/index.js";
import { Types } from "mongoose";

export const sendInterest = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const senderId = req.user?.id;
    const { recipientId } = req.body;

    if (!senderId || !recipientId) {
      res.status(400).json({ message: "Missing user IDs" });
      return;
    }

    if (senderId === recipientId) {
      res.status(400).json({ message: "Cannot send interest to yourself" });
      return;
    }

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (sender.interestsSent?.includes(recipient._id as Types.ObjectId)) {
      res.status(400).json({ message: "Interest already sent" });
      return;
    }

    sender.interestsSent?.push(recipient._id as Types.ObjectId);
    recipient.interestsReceived?.push(sender._id as Types.ObjectId);

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: "Interest sent successfully" });
  } catch (error) {
    console.error("Send Interest Error:", error);
    res.status(500).json({ message: "Failed to send interest", error });
  }
};


export const getSentInterests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).populate(
      "interestsSent",
      "-password"
    );
    res.status(200).json({ sent: user?.interestsSent || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sent interests", error });
  }
};

export const getReceivedInterests = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).populate(
      "interestsReceived",
      "-password"
    );
    res.status(200).json({ received: user?.interestsReceived || [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch received interests", error });
  }
};
