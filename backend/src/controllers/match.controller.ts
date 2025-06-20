import { Request, Response } from "express";
import { User } from "../models/User.js";
import { AuthenticatedRequest } from "../types/express/index.js";

export const searchProfiles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      religion,
      caste,
      education,
      profession,
      income,
      location,
      gender,
      minAge,
      maxAge,
    } = req.query;

    const query: any = {};

    // Add filters conditionally
    if (name) query.name = { $regex: name, $options: "i" };
    if (religion) query.religion = religion;
    if (caste) query.caste = caste;
    if (education) query.education = education;
    if (profession) query.profession = profession;
    if (income) query.income = income;
    if (location) query.location = location;
    if (gender) query.gender = gender;

    // Filter by age using dateOfBirth
    if (minAge || maxAge) {
      const currentDate = new Date();
      const ageFilter: any = {};

      if (minAge) {
        const maxDob = new Date(currentDate);
        maxDob.setFullYear(currentDate.getFullYear() - Number(minAge));
        ageFilter.$lte = maxDob;
      }

      if (maxAge) {
        const minDob = new Date(currentDate);
        minDob.setFullYear(currentDate.getFullYear() - Number(maxAge));
        ageFilter.$gte = minDob;
      }

      query.dateOfBirth = ageFilter;
    }

    const matchedProfiles = await User.find(query).select("-password");

    res.status(200).json({ results: matchedProfiles });
  } catch (error) {
    res.status(500).json({ message: "Failed to search profiles", error });
  }
};

export const getMatchSuggestions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const currentUser = await User.findById(req.user?.id);

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { preferences } = currentUser;

    if (!preferences) {
      res.status(400).json({ message: "No preferences found in profile" });
      return;
    }

    const query: any = {
      _id: { $ne: currentUser._id },
    };

    if (preferences.religion) query.religion = preferences.religion;
    if (preferences.location) query.location = preferences.location;

    if (preferences.ageRange && Array.isArray(preferences.ageRange)) {
      const [minAge, maxAge] = preferences.ageRange;
      const currentDate = new Date();

      const minDob = new Date(currentDate);
      minDob.setFullYear(currentDate.getFullYear() - maxAge);

      const maxDob = new Date(currentDate);
      maxDob.setFullYear(currentDate.getFullYear() - minAge);

      query.dateOfBirth = {
        $gte: minDob,
        $lte: maxDob,
      };
    }

    const matches = await User.find(query).select("-password");
    res.status(200).json({ matches });
  } catch (error) {
    console.error("Match suggestion error:", error);
    res.status(500).json({ message: "Failed to fetch suggestions", error });
  }
};
