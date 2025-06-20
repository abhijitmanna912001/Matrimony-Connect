import { Request, Response } from "express";
import { User } from "../models/User.js";

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
