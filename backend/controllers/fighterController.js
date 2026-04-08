const FighterService = require("../services/fighterService");

exports.createFighter = async (req, res) => {
  const fighter = await FighterService.createFighter(req.body, req.user);
  res.status(201).json(fighter);
};

exports.getAllFighters = async (req, res) => {
  const fighters = await FighterService.getAllFighters();
  res.json(fighters);
};

exports.getFighter = async (req, res) => {
  const fighter = await FighterService.getFighterById(req.params.id);
  res.json(fighter);
};

exports.updateFighter = async (req, res) => {
  const fighter = await FighterService.updateFighter(
    req.params.id,
    req.body
  );
  res.json(fighter);
};

exports.deleteFighter = async (req, res) => {
  await FighterService.deleteFighter(req.params.id);
  res.json({ message: "Deleted" });
};