import { Router } from "express";
import { approveProfile, getAdminAnalytics, getAllUsers, updatePhotoStatus } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/users", verifyToken, isAdmin, getAllUsers);
router.patch("/approve/:userId", verifyToken, isAdmin, approveProfile);
router.patch("/photo-status/:userId", verifyToken, isAdmin, updatePhotoStatus);
router.get("/analytics", verifyToken, isAdmin, getAdminAnalytics); 

export default router;
