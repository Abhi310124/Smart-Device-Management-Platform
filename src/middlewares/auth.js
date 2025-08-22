import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Find the user from the token's ID
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      throw new ApiError(401, 'User belonging to this token does no longer exist.');
    }

    next();
  } catch (error) {
    // This will catch expired tokens or any other verification errors
    throw new ApiError(401, 'Not authorized, token failed or expired');
  }
});

// This makes sure 'protect' is a named export
export { protect };
