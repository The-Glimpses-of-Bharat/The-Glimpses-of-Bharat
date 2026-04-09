const authService = require("../services/authService");

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