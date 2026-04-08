const User = require("../models/User");

class AdminService {
  static async getAllUsers() {
    return await User.find().select("-password");
  }

  static async deleteUser(userId) {
    return await User.findByIdAndDelete(userId);
  }

  static async updateUserRole(userId, role) {
    return await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );
  }

  static async getStats() {
    const totalUsers = await User.countDocuments();
    const admins = await User.countDocuments({ role: "admin" });
    const contributors = await User.countDocuments({ role: "contributor" });
    const premium = await User.countDocuments({ role: "premium" });

    return {
      totalUsers,
      admins,
      contributors,
      premium,
    };
  }
}

module.exports = AdminService;