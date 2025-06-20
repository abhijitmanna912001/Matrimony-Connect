import { Router } from "express";
import {
    getMatchSuggestions,
    searchProfiles,
} from "../controllers/match.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/search", verifyToken, searchProfiles);
router.get("/suggestions", verifyToken, getMatchSuggestions);

export default router;
