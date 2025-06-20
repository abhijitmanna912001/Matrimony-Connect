import { Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/User.js";
import { AuthenticatedRequest } from "../types/express/index.js";

export const addToShortlist = async (
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
      res.status(400).json({ message: "Cannot shortlist yourself" });
      return;
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.shortlistedUsers?.includes(targetUser._id as Types.ObjectId)) {
      res.status(400).json({ message: "User already shortlisted" });
      return;
    }

    user.shortlistedUsers?.push(targetUser._id as Types.ObjectId);
    await user.save();

    res.status(200).json({ message: "User shortlisted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to shortlist user", error });
  }
};

export const getShortlistedUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).populate(
      "shortlistedUsers",
      "-password"
    );
    res.status(200).json({ shortlist: user?.shortlistedUsers || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shortlist", error });
  }
};
