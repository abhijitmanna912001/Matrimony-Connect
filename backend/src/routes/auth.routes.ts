import { Response, Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { AuthenticatedRequest } from "../types/express/index.js"; // ✅

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", verifyToken, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ message: "Protected route accessed", user: req.user });
});

export default router;
