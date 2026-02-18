const User = require("../model/User.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utils/sendEmail");

// ================= REGISTER =================
exports.registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "User Registered Successfully",
  });
});

// ================= FORGOT PASSWORD =================
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("Email not found in database");
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // FIXED

  await user.save();

  // const resetLink = `http://localhost:5173/reset-password/${token}`;
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;


  const htmlMessage = `
    <h2>Password Reset</h2>
    <p>You requested to reset your password.</p>
    <a href="${resetLink}" 
       style="padding:10px 20px; background:#007bff; color:white; text-decoration:none;">
       Reset Password
    </a>
    <p>This link expires in 10 minutes.</p>
  `;

  await sendEmail(user.email, "Password Reset Request", htmlMessage);

  res.json({
    message: "Reset link sent to your email",
  });
});

// ================= RESET PASSWORD =================
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() }, // FIXED
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({
    message: "Password updated successfully",
  });
});
