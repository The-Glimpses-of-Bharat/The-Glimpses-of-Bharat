const FighterService = require("../services/fighterService");

// CREATE
exports.createFighter = async (req, res) => {
  try {
    const fighter = await FighterService.createFighter(req.body, req.user);
    res.status(201).json(fighter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET APPROVED (public)
exports.getApprovedFighters = async (req, res) => {
  try {
    const fighters = await FighterService.getApprovedFighters();
    res.json(fighters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PENDING (admin)
exports.getPendingFighters = async (req, res) => {
  try {
    const fighters = await FighterService.getPendingFighters();
    res.json(fighters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
exports.getFighter = async (req, res) => {
  try {
    const fighter = await FighterService.getFighterById(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    res.json(fighter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
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
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteFighter = async (req, res) => {
  try {
    const fighter = await FighterService.deleteFighter(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    res.json({ message: "Fighter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE
exports.approveFighter = async (req, res) => {
  try {
    const fighter = await FighterService.approveFighter(req.params.id);
    res.json(fighter);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// REJECT
exports.rejectFighter = async (req, res) => {
  try {
    const fighter = await FighterService.rejectFighter(req.params.id);
    res.json(fighter);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};