import { Router } from "express";
import { approveProfile, getAllUsers, updatePhotoStatus } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.patch("/approve/:userId", verifyToken, isAdmin, approveProfile);
router.patch("/photo-status/:userId", verifyToken, isAdmin, updatePhotoStatus);

export default router;
