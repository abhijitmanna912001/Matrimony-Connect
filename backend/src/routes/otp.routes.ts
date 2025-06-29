import { Router } from "express";
import { requestOtp, verifyOtp } from "../controllers/otp.controller.js";

const router = Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

export default router;
