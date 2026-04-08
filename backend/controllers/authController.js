const authService = require("../services/authService");

// ✅ SIGNUP
exports.signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);

    // 🔒 Remove sensitive fields (like password)
    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Signup failed",
    });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { user, token, permissions } = await authService.login(req.body);

    
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      },
      permissions,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Login failed",
    });
  }
};