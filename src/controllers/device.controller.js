import mongoose from "mongoose";
import * as deviceService from "../services/device.services.js"; // Import the service
import { clearDeviceCache } from "../services/cache.service.js";

async function createDevice(req, res) {
  try {
    const device = await deviceService.createDevice({ ...req.body, owner_id: req.user.id });
    await clearDeviceCache(req.user.id);
    return res.status(201).json({ success: true, device });
  } catch (err) {
    // ... error handling
  }
}

async function getDevices(req, res) {
  try {
    const devices = await deviceService.getUserDevices(req.user.id, req.query);
    return res.json({ success: true, devices });
  } catch (err) {
    // ... error handling
  }
}

async function updateDevice(req, res) {
  try {
    const device = await deviceService.updateDeviceDetails(req.params.id, req.user.id, req.body);
    return res.json({ success: true, device });
  } catch (err) {
    // ... error handling
  }
}

async function deleteDevice(req, res) {
  try {
    await deviceService.deleteDevice(req.params.id, req.user.id);
    return res.json({ success: true, message: "Device deleted" });
  } catch (err) {
    // ... error handling
  }
}


/**
 * POST /devices/:id/heartbeat
 * Update last_active_at
 */
async function heartbeat(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const device = await deviceService.recordDeviceHeartbeat(id, req.user.id, status);

    return res.json({
      success: true,
      message: "Device heartbeat recorded",
      last_active_at: device.last_active_at.toISOString(),
    });
  } catch (err) {
    console.error("heartbeat error:", err);
    // A proper error handler would be better here
    if (err.message.includes("not found")) {
        return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

export { createDevice, getDevices, updateDevice, deleteDevice, heartbeat };
