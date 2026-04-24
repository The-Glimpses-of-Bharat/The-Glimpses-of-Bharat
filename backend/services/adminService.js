const User = require("../models/User");
const Fighter = require("../models/Fighter");

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
    const pendingFighters = await Fighter.countDocuments({ status: "pending" });
    const approvedFighters = await Fighter.countDocuments({ status: "approved" });
    const rejectedFighters = await Fighter.countDocuments({ status: "rejected" });

    return {
      totalUsers,
      admins,
      contributors,
      premium,
      pendingFighters,
      approvedFighters,
      rejectedFighters,
    };
  }

  // --- Contribution Management ---

  static async getPendingContributions() {
    return await Fighter.find({ status: "pending" })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
  }

  static async approveContribution(id) {
    const fighter = await Fighter.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!fighter) throw new Error("Contribution not found");
    return fighter;
  }

  static async rejectContribution(id) {
    const fighter = await Fighter.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
    if (!fighter) throw new Error("Contribution not found");
    return fighter;
  }

  // --- Freedom Fighter CRUD ---

  static async getAllFighters() {
    return await Fighter.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
  }

  static async createFighter(data, userId) {
    return await Fighter.create({ ...data, createdBy: userId, status: "approved" });
  }

  static async updateFighter(id, data) {
    const fighter = await Fighter.findByIdAndUpdate(id, data, { new: true });
    if (!fighter) throw new Error("Fighter not found");
    return fighter;
  }

  static async deleteFighterById(id) {
    const fighter = await Fighter.findByIdAndDelete(id);
    if (!fighter) throw new Error("Fighter not found");
    return fighter;
  }
}

module.exports = AdminService;