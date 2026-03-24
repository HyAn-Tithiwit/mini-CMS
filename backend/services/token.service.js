const RefreshToken = require("../models/RefreshToken.model");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");

exports.generateTokens = async (user) => {
  const accessToken = signAccessToken({
    userId: user._id,
    role: user.role
  });

  const refreshToken = signRefreshToken({ userId: user._id });

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { accessToken, refreshToken };
};