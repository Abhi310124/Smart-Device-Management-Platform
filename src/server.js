import app from './app.js';
import { connectDB } from './config/db.js';
import config from './config/env.js';
import cron from 'node-cron';
import { deactivateInactiveDevices } from './services/device.services.js';
import { initializeWebSocket } from './websockets.js'; // Import the WebSocket initializer
import http from 'http'; // Import the native http module

const startServer = async () => {
  await connectDB();

  // Create an HTTP server from the Express app
  const server = http.createServer(app);

  // Initialize the WebSocket server and attach it to the HTTP server
  initializeWebSocket(server);

  cron.schedule('0 * * * *', async () => {
    console.log('Running background job: Deactivating inactive devices...');
    try {
      await deactivateInactiveDevices();
    } catch (error) {
      console.error('Error running background job:', error);
    }
  });

  server.listen(config.port, () => {
    console.log(`🚀 Server (and WebSocket) is running on port ${config.port}`);
  });
};

startServer();
