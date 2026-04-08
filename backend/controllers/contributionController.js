const Fighter = require("../models/Fighter");

exports.getMyFighters = async (req, res) => {
  const fighters = await Fighter.find({ createdBy: req.user.id });
  res.json(fighters);
};

exports.getPending = async (req, res) => {
  const fighters = await Fighter.find({
    createdBy: req.user.id,
    status: "pending",
  });
  res.json(fighters);
};

exports.getApproved = async (req, res) => {
  const fighters = await Fighter.find({
    createdBy: req.user.id,
    status: "approved",
  });
  res.json(fighters);
};

exports.getRejected = async (req, res) => {
  const fighters = await Fighter.find({
    createdBy: req.user.id,
    status: "rejected",
  });
  res.json(fighters);
};