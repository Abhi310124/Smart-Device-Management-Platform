import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import ApiError from '../utils/apiError.js';

const generateTokens = async (user) => {
  const accessToken = jwt.sign({ id: user._id, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  const refreshToken = jwt.sign({ id: user._id }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });

  // Save the refresh token to the database
  await Token.findOneAndUpdate(
    { userId: user._id },
    { token: refreshToken },
    { upsert: true, new: true }
  );

  return { accessToken, refreshToken };
};

const registerUser = async (userData) => {
  if (await User.findOne({ email: userData.email })) {
    throw new ApiError(400, 'User with this email already exists');
  }
  return User.create(userData);
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isValidPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  const tokens = await generateTokens(user);
  return { ...tokens, user };
};

const refreshAuth = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    const storedToken = await Token.findOne({ userId: decoded.id, token: refreshToken });

    if (!storedToken) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Token Rotation: Issue new tokens
    const tokens = await generateTokens(user);
    return tokens;
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};

const logoutUser = async (refreshToken) => {
  const storedToken = await Token.findOneAndDelete({ token: refreshToken });
  if (!storedToken) {
    throw new ApiError(400, 'Invalid refresh token');
  }
  return { message: 'Logged out successfully' };
};

export default{
  registerUser,
  loginUser,
  refreshAuth,
  logoutUser,
};

