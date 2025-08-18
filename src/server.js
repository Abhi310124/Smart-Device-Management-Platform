import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import { scheduleDeviceCleanup } from "./services/background.js";

(async () => {
  try {
    await connectDB();
    scheduleDeviceCleanup();
    app.listen(ENV.PORT, () => {
      console.log(`🚀 Server running on : ${ENV.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
