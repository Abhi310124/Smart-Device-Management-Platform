import express from 'express';
import authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.js';
import { userSchema, loginSchema, refreshTokenSchema } from '../validators/auth.schemas.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// --- Public Routes ---
router.post('/signup', validate(userSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// --- Token Management ---
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', validate(refreshTokenSchema), authController.logout);

// --- Protected Test Route ---
// This route is useful for quickly verifying if an access token is valid.
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user,
  });
});

export default router;
