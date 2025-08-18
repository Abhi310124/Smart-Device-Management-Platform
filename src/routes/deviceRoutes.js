import { Router } from "express";
import {
  createDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  heartbeat,
} from "../controllers/device.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// all /devices routes require auth
router.use(authMiddleware);

router.post("/", createDevice);            // POST /devices
router.get("/", getDevices);               // GET /devices
router.patch("/:id", updateDevice);        // PATCH /devices/:id
router.delete("/:id", deleteDevice);       // DELETE /devices/:id
router.post("/:id/heartbeat", heartbeat);  // POST /devices/:id/heartbeat

export default router;
