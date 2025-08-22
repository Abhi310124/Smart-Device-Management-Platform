import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import config from './config/env.js';
import url from 'url';

// This will store all active, authenticated client connections
const clients = new Map();

const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const parameters = new url.URL(req.url, `http://${req.headers.host}`).searchParams;
    const token = parameters.get('token');

    if (!token) {
      console.log('WebSocket connection rejected: No token provided.');
      ws.close(1008, 'Token required');
      return;
    }

    // Authenticate the connection
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const userId = decoded.id;

      // Store the connection
      clients.set(userId, ws);
      console.log(`WebSocket client connected and authenticated for user: ${userId}`);

      ws.on('close', () => {
        clients.delete(userId);
        console.log(`WebSocket client disconnected for user: ${userId}`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
        clients.delete(userId);
      });

    } catch (err) {
      console.log('WebSocket connection rejected: Invalid token.');
      ws.close(1008, 'Invalid token');
    }
  });

  console.log('WebSocket server initialized.');
};


const broadcastToUser = (userId, message) => {
  const client = clients.get(userId);
  if (client && client.readyState === client.OPEN) {
    client.send(JSON.stringify(message));
  }
};

export { initializeWebSocket, broadcastToUser };
