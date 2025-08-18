import cron from "node-cron";
import Device from "../models/device.model.js";

function scheduleDeviceCleanup() {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    console.log("⏳ Running device auto-deactivate job...");

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago
    await Device.updateMany(
      { last_active_at: { $lt: cutoff }, status: "active" },
      { $set: { status: "inactive" } }
    );

    console.log("✅ Inactive devices updated");
  });
}

export { scheduleDeviceCleanup };
