import { Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/User.js";
import { AuthenticatedRequest } from "../types/express/index.js";

export const blockUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { targetUserId } = req.body;

    if (!userId || !targetUserId) {
      res.status(400).json({ message: "Missing user ID(s)" });
      return;
    }

    if (userId === targetUserId) {
      res.status(400).json({ message: "Cannot block yourself" });
      return;
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.blockedUsers?.includes(targetUser._id as Types.ObjectId)) {
      res.status(400).json({ message: "User already blocked" });
      return;
    }

    user.blockedUsers?.push(targetUser._id as Types.ObjectId);
    await user.save();

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to block user", error });
  }
};

export const getBlockedUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate(
      "blockedUsers",
      "-password"
    );
    res.status(200).json({ blocked: user?.blockedUsers || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blocked users", error });
  }
};
