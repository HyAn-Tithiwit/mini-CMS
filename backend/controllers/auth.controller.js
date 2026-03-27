const User = require("../models/User.model");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateTokens } = require("../services/token.service");

// Register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  await User.create({
    email,
    username,
    password: await hashPassword(password)
  });

  res.status(201).json({message: "Register success"});
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await comparePassword(password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const tokens = await generateTokens(user);

  res.json(tokens);
};

const RefreshToken = require("../models/RefreshToken.model");
const { verifyRefreshToken } = require("../utils/jwt");

// Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored) return res.status(403).json({ message: "Invalid refresh token" });

  const payload = verifyRefreshToken(refreshToken);

  const accessToken = require("../utils/jwt")
    .signAccessToken({ userId: payload.userId });

  res.json({ accessToken });  
};

// Logout
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.json({ message: "Logged out" });
};

const crypto = require("crypto");


// Forgot Password
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!validator.validate(email)) {
    return res.status(400).json({
      message: "Email must be in pattern"
    })
  };

  if (!user) return res.json({ message: "If email exists, reset link sent" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save();

  // TODO: gửi email (link chứa token)
  res.json({ message: "Reset password email sent" });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await hashPassword(password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  res.json({ message: "Password reset success" });
};