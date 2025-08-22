import { Router } from "express";
import authRoutes from "./authRoutes.js";
import deviceRoutes from "./deviceRoutes.js";
import logRoutes from "./logRoutes.js";
import exportRoutes from './export.route.js';

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "Healthy" });
});


router.use("/auth", authRoutes);
router.use("/devices", deviceRoutes);
router.use("/devices", logRoutes);
router.use('/export', exportRoutes);


export default router;
