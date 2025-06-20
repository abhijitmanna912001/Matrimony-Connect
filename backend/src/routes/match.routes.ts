import { Router } from "express";
import { searchProfiles } from "../controllers/match.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/search", verifyToken, searchProfiles);

export default router;
