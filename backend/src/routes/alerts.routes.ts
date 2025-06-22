import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getMatchAlerts } from "../controllers/alerts.controller.js";

const router = Router();

router.get("/weekly", verifyToken, getMatchAlerts);

export default router;
