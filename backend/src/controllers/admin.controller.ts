import { Request, Response } from "express";
import { User } from "../models/User.js";

// Get all users for admin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// ✅ Approve User Profile
export const approveProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User profile approved", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve profile", error });
  }
};

// ✅ Update Photo Status
export const updatePhotoStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      res.status(400).json({ message: "Invalid photo status" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { photoStatus: status },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: `Photo ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update photo status", error });
  }
};

// ✅ Get Admin Analytics
export const getAdminAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPremiumUsers = await User.countDocuments({ isPremium: true });
    const totalApprovedProfiles = await User.countDocuments({
      isPhotoVerified: true,
    });

    const users = await User.find();

    const totalInterests = users.reduce(
      (acc, user) => acc + (user.interestsSent?.length ?? 0),
      0
    );
    const totalShortlisted = users.reduce(
      (acc, user) => acc + (user.shortlistedUsers?.length ?? 0),
      0
    );
    const totalBlocked = users.reduce(
      (acc, user) => acc + (user.blockedUsers?.length ?? 0),
      0
    );

    res.status(200).json({
      totalUsers,
      totalPremiumUsers,
      totalApprovedProfiles,
      totalInterests,
      totalShortlisted,
      totalBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics", error });
  }
};