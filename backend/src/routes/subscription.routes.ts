import { Router } from "express";
import {
  upgradeToPremium,
  getPremiumStatus,
} from "../controllers/subscription.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/upgrade", verifyToken, upgradeToPremium);
router.get("/status", verifyToken, getPremiumStatus);

export default router;
