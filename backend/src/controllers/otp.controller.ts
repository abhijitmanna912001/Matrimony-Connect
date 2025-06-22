import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Otp } from "../models/Otp.js";
import { User } from "../models/User.js";

export const requestOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      res.status(400).json({ message: "Email or phone is required" });
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any previous OTPs for this email or phone
    await Otp.deleteMany({
      $or: [{ email: email ?? null }, { phone: phone ?? null }],
    });

    const newOtp = new Otp({
      email: email ?? null,
      phone: phone ?? null,
      code: generatedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newOtp.save();

    res.status(200).json({
      message: "OTP sent successfully",
      otp: generatedOtp, // for testing only
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp, name, password } = req.body;

    if (!identifier || !otp) {
      res.status(400).json({ message: "Identifier and OTP are required" });
      return;
    }

    const existingOtp = await Otp.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (
      !existingOtp ||
      existingOtp.code !== otp ||
      existingOtp.expiresAt < new Date()
    ) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id, role: existingUser.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "OTP verified, logged in successfully",
        token,
        user: existingUser,
      });
      return;
    }

    // Signup flow
    if (!name || !password) {
      res
        .status(400)
        .json({ message: "Name and password required for signup" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
      email: identifier.includes("@") ? identifier : undefined,
      phone: !identifier.includes("@") ? identifier : undefined,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created and logged in successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error });
  }
};
