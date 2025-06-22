import { Response } from "express";
import { User } from "../models/User";
import { AuthenticatedRequest } from "../types/express";

// User reports another user
export const reportUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const reporterId = req.user?.id;
    const { reason } = req.body;
    const reportedUserId = req.params.id;

    if (!reporterId || !reportedUserId || !reason) {
      res.status(400).json({ message: "Missing parameters" });
      return;
    }

    if (reporterId === reportedUserId) {
      res.status(400).json({ message: "Cannot report yourself" });
      return;
    }

    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    reportedUser.reports?.push({ reportedBy: reporterId, reason });
    await reportedUser.save();

    res.status(200).json({ message: "User reported successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to report user", error });
  }
};

// Admin views all reported users
export const getReportedUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const reportedUsers = await User.find({
      reports: { $exists: true, $not: { $size: 0 } },
    })
      .select("-password")
      .populate("reports.reportedBy", "name email");

    res.status(200).json({ reportedUsers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reported users", error });
  }
};
