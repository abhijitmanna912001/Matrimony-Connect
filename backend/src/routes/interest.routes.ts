import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { sendInterest } from "../controllers/interest.controller.js";

const router = Router();

router.post("/send", verifyToken, sendInterest);

export default router;
