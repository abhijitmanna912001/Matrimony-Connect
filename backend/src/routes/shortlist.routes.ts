import { Router } from "express";
import {
    addToShortlist,
    getShortlistedUsers,
} from "../controllers/shortlist.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyToken, addToShortlist);
router.get("/view", verifyToken, getShortlistedUsers);

export default router;
