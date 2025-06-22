import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";


export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // ✅ Ensure decoded has expected fields
    if (!decoded.id) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    // ✅ Assign manually with correct typing
    req.user = {
      id: decoded.id,
      role: decoded.role ?? "user", // fallback to 'user' if role is not set
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error });
  }
};
