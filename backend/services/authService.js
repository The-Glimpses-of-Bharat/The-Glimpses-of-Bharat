const User = require("../models/User");
const jwt = require("jsonwebtoken");
const UserFactory = require("../patterns/factory/UserFactory");

class AuthService {
  async signup(data) {
    const { name, email, password, role } = data;

    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    if (!User.db || User.db.readyState !== 1) {
      throw new Error("Database not connected");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return user;
  }

  async login(data) {
    const { email, password } = data;

    if (!User.db || User.db.readyState !== 1) {
      throw new Error("Database not connected");
    }

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    // 🔥 Strategy Pattern applied here
    const strategy = UserFactory.getStrategy(user.role);
    const permissions = strategy.getPermissions();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user,
      token,
      permissions, // 👈 dynamic behavior
    };
  }
}

module.exports = new AuthService();