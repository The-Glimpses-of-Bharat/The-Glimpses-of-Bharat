const authService = require("../services/authService");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);

    res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Signup failed",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await authService.login(req.body);

    res.json({
      message: "Login successful",
      ...data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Login failed",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ user });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to fetch user data" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "No account found with that email address." });
    }

    // Since we have a pre-save hook that hashes the password, we just set the raw password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password has been successfully reset." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password." });
  }
};