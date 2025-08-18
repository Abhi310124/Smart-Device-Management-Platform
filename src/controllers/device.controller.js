import mongoose from "mongoose";
import Device from "../models/device.model.js";

/**
 * POST /devices
 * Create device owned by the logged-in user
 */
async function createDevice(req, res) {
  try {
    const { name, type, status } = req.body;
    const ownerId = req.user && req.user.id;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!name || !type) {
      return res.status(400).json({ success: false, message: "name and type are required" });
    }

    const device = await Device.create({
      name,
      type,
      status: status || undefined,
      owner_id: ownerId,
    });

    return res.status(201).json({ success: true, device });
  } catch (err) {
    console.error("createDevice error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * GET /devices
 * List devices. By default returns devices owned by the user.
 * Query params: type, status, limit, page
 * Admins can optionally see all devices.
 */
async function getDevices(req, res) {
  try {
    const { type, status, limit = 20, page = 1 } = req.query;
    const filter = {};

    // by default restrict to user's devices
    if (req.user.role !== "admin") {
      filter.owner_id = req.user.id;
    }

    // apply filters if provided
    if (type) filter.type = type;
    if (status) filter.status = status;

    //Number of devices to skip based on page and limit
    const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit)); 

    
    //Fetch devices with applied filters, sorting, and pagination
    const devices = await Device.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.json({ success: true, devices });
  } catch (err) {
    console.error("getDevices error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * PATCH /devices/:id
 * Update device fields (name, type, status) if owner or admin
 */
async function updateDevice(req, res) {
  try {
    const { id } = req.params;

    // Validate device ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid device id" });
    }

    // Check if device exists
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    // Only owner or admin can update
    if (device.owner_id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Validate and update fields
    const allowed = ["name", "type", "status"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) device[field] = req.body[field];
    });

    await device.save();

    return res.json({ success: true, device });
  } catch (err) {
    console.error("updateDevice error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * DELETE /devices/:id
 * Delete device if owner or admin
 */
async function deleteDevice(req, res) {
  try {
    const { id } = req.params;
    // Validate device ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid device id" });
    }

    // Check if device exists
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    
    // Only owner or admin can delete
    if (device.owner_id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    await Device.findByIdAndDelete(id);

    return res.json({ success: true, message: "Device deleted" });
  } catch (err) {
    console.error("deleteDevice error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * POST /devices/:id/heartbeat
 * Update last_active_at (and optionally status)
 */
async function heartbeat(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate device ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid device id" });
    }

    // Check if device exists
    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    // owner or admin only
    if (device.owner_id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Update last_active_at and status if provided
    if (status) device.status = status;
    device.last_active_at = new Date();

    await device.save();

    return res.json({
      success: true,
      message: "Device heartbeat recorded",
      last_active_at: device.last_active_at.toISOString(),
    });
  } catch (err) {
    console.error("heartbeat error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

export { createDevice, getDevices, updateDevice, deleteDevice, heartbeat };
