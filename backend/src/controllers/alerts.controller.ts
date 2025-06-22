import { Response } from "express";
import { IUser, User } from "../models/User.js";
import { AuthenticatedRequest } from "../types/express/index.js";

export const getMatchAlerts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const currentUser = (await User.findById(userId)) as IUser;

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const preferences = currentUser.preferences;

    const matches = await User.find({
      _id: { $ne: userId },
      gender: { $ne: currentUser.gender },
      dateOfBirth: {
        $gte: new Date(
          new Date().setFullYear(
            new Date().getFullYear() - (preferences?.ageRange?.[1] ?? 35)
          )
        ),
        $lte: new Date(
          new Date().setFullYear(
            new Date().getFullYear() - (preferences?.ageRange?.[0] ?? 20)
          )
        ),
      },
      ...(preferences?.religion && { religion: preferences.religion }),
      ...(preferences?.caste && { caste: preferences.caste }),
    }).select("-password -blockedUsers -interestsSent -interestsReceived");

    res.status(200).json({ matches });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch match alerts", error });
  }
};
