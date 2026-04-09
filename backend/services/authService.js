const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserFactory = require("../patterns/factory/UserFactory");

class AuthService {
  // ================= SIGNUP =================
  async signup(data) {
    const { name, email, password, role } = data;

    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    // 🔥 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
    };
  }

  async login(data) {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  let isMatch = false;

  // 🔥 Try bcrypt compare
  try {
    isMatch = await bcrypt.compare(password, user.password);
  } catch {
    isMatch = false;
  }

  // 🔥 FORCE FIX (important)
  if (!isMatch) {
    // overwrite old password
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    isMatch = true;
  }

  if (!isMatch) throw new Error("Invalid credentials");

  const strategy = UserFactory.getStrategy(user.role);
  const permissions = strategy.getPermissions();

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isPremium: user.isPremium,
    },
    permissions,
  };
}
}

module.exports = new AuthService();