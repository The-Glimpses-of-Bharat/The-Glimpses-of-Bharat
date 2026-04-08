const Fighter = require("../models/Fighter");

class FighterService {
  static async createFighter(data, user) {
    return await Fighter.create({
      ...data,
      createdBy: user.id,
      status: "pending",
    });
  }

  static async getAllFighters() {
    return await Fighter.find();
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
}

module.exports = FighterService;