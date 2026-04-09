const Fighter = require("../models/Fighter");

class FighterService {
  //  CREATE (with duplicate detection)
  static async createFighter(data, user) {
    const existing = await Fighter.findOne({
      name: { $regex: `^${data.name}$`, $options: "i" },
    });

    return await Fighter.create({
      ...data,
      createdBy: user.id,
      status: "pending",
      isDuplicate: existing ? true : false,
    });
  }

  //  GET ALL
  static async getAllFighters() {
    return await Fighter.find();
  }

  //  GET ONE
  static async getFighterById(id) {
    return await Fighter.findById(id);
  }

  //  UPDATE
  static async updateFighter(id, data) {
    return await Fighter.findByIdAndUpdate(id, data, { new: true });
  }

  //  DELETE
  static async deleteFighter(id) {
    return await Fighter.findByIdAndDelete(id);
  }

  // APPROVE
  static async approveFighter(id) {
    const fighter = await Fighter.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!fighter) throw new Error("Fighter not found");

    return fighter;
  }

  //  REJECT
  static async rejectFighter(id) {
    const fighter = await Fighter.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!fighter) throw new Error("Fighter not found");

    return fighter;
  }
}

module.exports = FighterService;