import mongoose from "mongoose";
import Log from "../models/log.model.js";
import Device from "../models/device.model.js";

/**
 * POST /devices/:id/logs
 */
async function createLog(req, res) {
  try {
    const { id } = req.params;
    const { event, value } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid device id" });
    }

    const device = await Device.findById(id);
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    // owner or admin only
    if (device.owner_id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const log = await Log.create({ device_id: id, event, value });

    res.status(201).json({ success: true, log });
  } catch (err) {
    console.error("createLog error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * GET /devices/:id/logs?limit=10
 */
async function getLogs(req, res) {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid device id" });
    }

    const logs = await Log.find({ device_id: id })
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({ success: true, logs });
  } catch (err) {
    console.error("getLogs error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

/**
 * GET /devices/:id/usage?range=24h
 */
async function getUsage(req, res) {
  try {
    const { id } = req.params;
    const { range = "24h" } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid device id" });
    }

    // calculate range in ms
    let msRange = 24 * 60 * 60 * 1000; // default = 24h
    if (range.endsWith("h")) {
      msRange = parseInt(range) * 60 * 60 * 1000;
    }

    const since = new Date(Date.now() - msRange);

    const result = await Log.aggregate([
      { $match: { device_id: new mongoose.Types.ObjectId(id), timestamp: { $gte: since } } },
      {
        $group: {
          _id: null,
          total_units: { $sum: "$value" }, // works if logs are "units_consumed"
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      device_id: id,
      total_units: result[0]?.total_units || 0,
      log_count: result[0]?.count || 0,
    });
  } catch (err) {
    console.error("getUsage error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

export { createLog, getLogs, getUsage };
