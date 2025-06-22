// routes/report.route.ts
import { Router } from "express";
import {
  reportUser,
  getReportedUsers,
} from "../controllers/report.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

router.post("/:id/report", verifyToken, reportUser);
router.get("/admin/reports", verifyToken, isAdmin, getReportedUsers);

export default router;
