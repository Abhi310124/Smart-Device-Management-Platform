import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import {authMiddleware} from "../middlewares/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

// test protected route
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user, // contains { id, role, iat, exp }
  });
});


export default router;
