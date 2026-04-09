const Fighter = require("../models/Fighter");

class FighterService {
  static async createFighter(data, user) {
    return await Fighter.create({
      ...data,
      createdBy: user.id,
      status: "pending",
    });
  }

  static async getFighterById(id) {
    return await Fighter.findById(id);
  }

  static async updateFighter(id, data) {
    return await Fighter.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteFighter(id) {
    return await Fighter.findByIdAndDelete(id);
  }

  static async approveFighter(id) {
    return await Fighter.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
  }

  static async rejectFighter(id) {
    return await Fighter.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
  }

  static async getApprovedFighters() {
    return await Fighter.find({ status: "approved" });
  }

  static async getPendingFighters() {
    return await Fighter.find({ status: "pending" });
  }
}

module.exports = FighterService;