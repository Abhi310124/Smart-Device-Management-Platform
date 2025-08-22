import tokenService from '../services/token.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

const signup = asyncHandler(async (req, res) => {
  await tokenService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, null, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken, user } = await tokenService.loginUser({ email, password });

  res.status(200).json(new ApiResponse(200, {
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  }, "Login successful"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'Refresh token is required');
  
  const tokens = await tokenService.refreshAuth(refreshToken);
  res.status(200).json(new ApiResponse(200, tokens, "Token refreshed successfully"));
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'Refresh token is required');

  await tokenService.logoutUser(refreshToken);
  res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

export default {
  signup,
  login,
  refreshToken,
  logout,
};
