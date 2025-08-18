import rateLimit from "express-rate-limit";
import { ENV } from "../config/env.js";

export const apiLimiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS, // 1 minute
  max: ENV.RATE_LIMIT_MAX,            // 100 requests
  standardHeaders: true,
  legacyHeaders: false,
});
