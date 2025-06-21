import { Response } from "express";
import { User } from "../models/User.js";
import { AuthenticatedRequest } from "../types/express/index.js";

// ✅ Upgrade to Premium
export const upgradeToPremium = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isPremium) {
      res.status(400).json({ message: "User is already a premium member" });
      return;
    }

    user.isPremium = true;
    await user.save();

    res.status(200).json({ message: "Successfully upgraded to premium" });
  } catch (error) {
    res.status(500).json({ message: "Upgrade failed", error });
  }
};

// ✅ Get Premium Status
export const getPremiumStatus = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ isPremium: user.isPremium });
  } catch (error) {
    res.status(500).json({ message: "Failed to get premium status", error });
  }
};
