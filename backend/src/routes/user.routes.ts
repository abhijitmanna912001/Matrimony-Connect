import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// User routes
router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, updateMyProfile);

export default router;
