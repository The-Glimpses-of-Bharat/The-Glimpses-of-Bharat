const Concern = require("../models/Concern");

// @desc    Submit a new concern (Premium user)
// @route   POST /api/concerns
// @access  Private
const submitConcern = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const concern = await Concern.create({
      user: req.user._id,
      message,
    });

    res.status(201).json(concern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get concerns for logged in user
// @route   GET /api/concerns/my
// @access  Private
const getMyConcerns = async (req, res) => {
  try {
    const concerns = await Concern.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(concerns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all concerns (Admin)
// @route   GET /api/concerns
// @access  Private/Admin
const getAllConcerns = async (req, res) => {
  try {
    const concerns = await Concern.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(concerns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Address/Reply to a concern (Admin)
// @route   PUT /api/concerns/:id/address
// @access  Private/Admin
const addressConcern = async (req, res) => {
  try {
    const { response } = req.body;
    if (!response) {
      return res.status(400).json({ message: "Response is required" });
    }

    const concern = await Concern.findById(req.params.id);
    if (!concern) {
      return res.status(404).json({ message: "Concern not found" });
    }

    concern.response = response;
    concern.status = "addressed";
    await concern.save();

    res.json(concern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitConcern,
  getMyConcerns,
  getAllConcerns,
  addressConcern,
};
