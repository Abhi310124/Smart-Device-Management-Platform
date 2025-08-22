// src/services/cache.service.js
import redisClient from '../config/redis.js';

// Use the same predictable key generation function
const generateDeviceCacheKey = (userId) => `user:${userId}:devices`;

const clearDeviceCache = async (userId) => {
  if (!userId) return;
  const key = generateDeviceCacheKey(userId);
  await redisClient.del(key);
  console.log(`CACHE INVALIDATED: Cleared cache for key ${key}`);
};

export { clearDeviceCache };
