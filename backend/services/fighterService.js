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
    const fighter = await Fighter.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    
    if (fighter) {
      const eventDispatcher = require("../patterns/observer/EventDispatcher");
      eventDispatcher.emit("fighterApproved", fighter);
    }
    
    return fighter;
  }

  static async rejectFighter(id) {
    return await Fighter.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );
  }

  static async getApprovedFighters() {
    const FighterQueryBuilder = require("../patterns/builder/FighterQueryBuilder");
    return await new FighterQueryBuilder().isApproved().execute();
  }

  static async getPendingFighters() {
    const FighterQueryBuilder = require("../patterns/builder/FighterQueryBuilder");
    return await new FighterQueryBuilder().isPending().execute();
  }
}

module.exports = FighterService;