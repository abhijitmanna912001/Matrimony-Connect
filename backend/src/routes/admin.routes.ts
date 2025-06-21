import { Router } from "express";
import { getAllUsers } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.get("/users", verifyToken, isAdmin, getAllUsers);

export default router;
