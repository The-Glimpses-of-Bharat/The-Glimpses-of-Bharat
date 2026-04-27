const Fighter = require("../../models/Fighter");

class FighterQueryBuilder {
  constructor() {
    this.query = {};
    this.sortOption = { createdAt: -1 };
    this.limitOption = 0;
  }

  isApproved() {
    this.query.status = "approved";
    return this;
  }

  isPending() {
    this.query.status = "pending";
    return this;
  }

  search(keyword) {
    if (keyword) {
      this.query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];
    }
    return this;
  }

  sortByViews() {
    this.sortOption = { views: -1 };
    return this;
  }

  limit(count) {
    this.limitOption = count;
    return this;
  }

  async execute() {
    let result = Fighter.find(this.query).sort(this.sortOption);
    if (this.limitOption > 0) {
      result = result.limit(this.limitOption);
    }
    return await result;
  }
}

module.exports = FighterQueryBuilder;
