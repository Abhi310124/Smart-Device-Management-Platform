import rateLimit from "express-rate-limit";
import  config  from "../config/env.js";

export const apiLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS, // 1 minute
  max: config.RATE_LIMIT_MAX,            // 100 requests
  standardHeaders: true,
  legacyHeaders: false,
});
