import { Router } from "express";
import authRoutes from "./authRoutes.js";
import deviceRoutes from "./deviceRoutes.js";
import logRoutes from "./logRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "Healthy" });
});


router.use("/auth", authRoutes);
router.use("/devices", deviceRoutes);
router.use("/devices", logRoutes);

export default router;
