const Fighter = require("../models/Fighter");
const Contribution = require("../models/Contribution");

// GET all my contributions
exports.getMyFighters = async (req, res) => {
  try {
    const fighters = await Fighter.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET pending
exports.getPending = async (req, res) => {
  try {
    const fighters = await Fighter.find({ createdBy: req.user.id, status: "pending" });
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET approved
exports.getApproved = async (req, res) => {
  try {
    const fighters = await Fighter.find({ createdBy: req.user.id, status: "approved" });
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET rejected
exports.getRejected = async (req, res) => {
  try {
    const fighters = await Fighter.find({ createdBy: req.user.id, status: "rejected" });
    res.json(fighters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET stats
exports.getMyStats = async (req, res) => {
  try {
    const pending = await Fighter.countDocuments({ createdBy: req.user.id, status: "pending" });
    const approved = await Fighter.countDocuments({ createdBy: req.user.id, status: "approved" });
    const rejected = await Fighter.countDocuments({ createdBy: req.user.id, status: "rejected" });
    res.json({ pending, approved, rejected });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /contribute — submit a new Freedom Fighter entry
exports.submitContribution = async (req, res) => {
  try {
    const { name, description, birthYear, deathYear, image, contributions } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const fighter = await Fighter.create({
      name: name.trim(),
      description: description?.trim(),
      birthYear: birthYear ? Number(birthYear) : undefined,
      deathYear: deathYear ? Number(deathYear) : undefined,
      image: image?.trim(),
      contributions: contributions?.trim(),
      status: "pending",
      createdBy: req.user.id,
    });

    res.status(201).json(fighter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /contribute/:id — edit own PENDING entry only
exports.editContribution = async (req, res) => {
  try {
    const fighter = await Fighter.findById(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Ownership check
    if (fighter.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own submissions" });
    }

    // Only pending entries can be edited
    if (fighter.status !== "pending") {
      return res.status(400).json({ message: "Only pending submissions can be edited" });
    }

    const { name, description, birthYear, deathYear, image, contributions } = req.body;

    if (name !== undefined) fighter.name = name.trim();
    if (description !== undefined) fighter.description = description.trim();
    if (birthYear !== undefined) fighter.birthYear = Number(birthYear) || undefined;
    if (deathYear !== undefined) fighter.deathYear = Number(deathYear) || undefined;
    if (image !== undefined) fighter.image = image.trim();
    if (contributions !== undefined) fighter.contributions = contributions.trim();

    await fighter.save();
    res.json(fighter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /contribute/:id — withdraw own PENDING entry only
exports.deleteContribution = async (req, res) => {
  try {
    const fighter = await Fighter.findById(req.params.id);

    if (!fighter) {
      return res.status(404).json({ message: "Entry not found" });
    }

    // Ownership check
    if (fighter.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own submissions" });
    }

    // Only pending entries can be withdrawn
    if (fighter.status !== "pending") {
      return res.status(400).json({ message: "Only pending submissions can be withdrawn" });
    }

    await fighter.deleteOne();
    res.json({ message: "Submission withdrawn successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /contribute/suggest/:id — suggest an edit/addition for a fighter
exports.submitSuggestion = async (req, res) => {
  try {
    const { suggestion } = req.body;
    const fighterId = req.params.id;

    if (!suggestion || !suggestion.trim()) {
      return res.status(400).json({ message: "Suggestion content is required" });
    }

    const fighter = await Fighter.findById(fighterId);
    if (!fighter) {
      return res.status(404).json({ message: "Fighter not found" });
    }

    const newContribution = await Contribution.create({
      fighter: fighterId,
      user: req.user.id,
      suggestion: suggestion.trim(),
    });

    res.status(201).json({
      message: "Suggestion sent to admin successfully! Thank you for your contribution.",
      data: newContribution,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /contribute/suggestions — for admin to view all suggestions (might need separate admin controller but adding here for now)
exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Contribution.find()
      .populate("fighter", "name")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /contribute/suggestions/:id/status — for admin to approve/reject
exports.updateSuggestionStatus = async (req, res) => {
  try {
    const { status, adminFeedback } = req.body;
    const { id } = req.params;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const suggestion = await Contribution.findById(id);
    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    suggestion.status = status;
    if (adminFeedback !== undefined) suggestion.adminFeedback = adminFeedback;

    await suggestion.save();
    res.json({ message: `Suggestion ${status} successfully`, data: suggestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /contribute/suggestions/:id — for admin to remove record
exports.deleteSuggestion = async (req, res) => {
  try {
    const suggestion = await Contribution.findById(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }
    await suggestion.deleteOne();
    res.json({ message: "Suggestion deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /contribute/my-suggestions — for users to track their suggested edits
exports.getMySuggestions = async (req, res) => {
  try {
    const suggestions = await Contribution.find({ user: req.user.id })
      .populate("fighter", "name image")
      .sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};