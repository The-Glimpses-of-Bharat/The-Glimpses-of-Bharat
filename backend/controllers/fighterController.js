const FighterService = require("../services/fighterService");


exports.createFighter = async (req, res) => {
  try {
    const fighter = await FighterService.createFighter(req.body, req.user);
    res.status(201).json(fighter);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to create fighter",
    });
  }
};


exports.getAllFighters = async (req, res) => {
  try {
    const fighters = await FighterService.getAllFighters();
    res.json(fighters);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch fighters",
    });
  }
};


exports.getFighter = async (req, res) => {
  try {
    const fighter = await FighterService.getFighterById(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    res.json(fighter);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch fighter",
    });
  }
};


exports.updateFighter = async (req, res) => {
  try {
    const fighter = await FighterService.updateFighter(
      req.params.id,
      req.body
    );

    if (!fighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    res.json(fighter);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to update fighter",
    });
  }
};


exports.deleteFighter = async (req, res) => {
  try {
    const fighter = await FighterService.deleteFighter(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    res.json({ message: "Fighter deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete fighter",
    });
  }
};


exports.approveFighter = async (req, res) => {
  try {
    const fighter = await FighterService.approveFighter(req.params.id);
    res.json(fighter);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


exports.rejectFighter = async (req, res) => {
  try {
    const fighter = await FighterService.rejectFighter(req.params.id);
    res.json(fighter);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};