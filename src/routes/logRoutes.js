import { Router } from "express";
import { createLog, getLogs, getUsage } from "../controllers/log.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

router.post("/:id/logs", createLog);       // POST /devices/:id/logs
router.get("/:id/logs", getLogs);          // GET /devices/:id/logs?limit=10
router.get("/:id/usage", getUsage);        // GET /devices/:id/usage?range=24h

export default router;
