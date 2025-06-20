import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getReceivedInterests, getSentInterests, sendInterest } from "../controllers/interest.controller.js";

const router = Router();

router.post("/send", verifyToken, sendInterest);
router.get("/sent", verifyToken, getSentInterests);
router.get("/received", verifyToken, getReceivedInterests);

export default router;
