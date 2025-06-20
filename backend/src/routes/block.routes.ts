import { Router } from "express";
import { blockUser, getBlockedUsers } from "../controllers/block.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyToken, blockUser);
router.get("/view", verifyToken, getBlockedUsers);

export default router;
