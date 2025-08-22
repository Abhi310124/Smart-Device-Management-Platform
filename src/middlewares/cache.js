// src/middlewares/cache.js
import redisClient from '../config/redis.js';

// Use a simple, predictable key for the user's device list
const generateDeviceCacheKey = (userId) => `user:${userId}:devices`;

const cacheMiddleware = (duration = 1800) => async (req, res, next) => {
  // **FIX 1: Use the reliable key generation function**
  const key = generateDeviceCacheKey(req.user.id);

  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(`CACHE HIT for key: ${key}`);
      const devices = JSON.parse(cachedData);
      // Send the cached data directly, in the format the controller uses
      return res.status(200).json({ success: true, devices });
    }

    console.log(`CACHE MISS for key: ${key}`);
    const originalSend = res.send;
    res.send = function (body) {
      try {
        const parsedBody = JSON.parse(body);
        // **FIX 2: Look for the 'devices' property from your controller**
        // and ensure it's an array before caching.
        if (res.statusCode === 200 && Array.isArray(parsedBody.devices)) {
          redisClient.setEx(key, duration, JSON.stringify(parsedBody.devices));
          console.log(`CACHED data for key: ${key}`);
        }
      } catch (e) {
        // Do not cache if response is not valid JSON
      }
      originalSend.apply(res, arguments);
    };
    next();
  } catch (error) {
    console.error("Redis error:", error);
    next();
  }
};

export default cacheMiddleware;
