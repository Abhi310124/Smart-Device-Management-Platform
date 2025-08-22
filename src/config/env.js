import dotenv from 'dotenv';

// This ensures that this is the first thing that runs
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  mongoURI: process.env.MONGO_URI, // Now this will have the correct value
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
};

// Add a check to ensure the secret is loaded. If not, the app will crash with a clear error.
if (!config.jwt.secret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined. Check your .env file.");
  process.exit(1);
}

export default config;
