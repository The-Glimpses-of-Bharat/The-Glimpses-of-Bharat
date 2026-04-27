const User = require("../models/User");
const Fighter = require("../models/Fighter");

exports.getPremiumDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("studyHistory")
      .populate("watchLater");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Recommendations logic: Find approved fighters not in user's history, limit 4
    const historyIds = user.studyHistory.map(f => f._id);
    const recommended = await Fighter.find({
      status: "approved",
      _id: { $nin: historyIds }
    }).sort({ views: -1 }).limit(4);

    res.json({
      history: user.studyHistory,
      watchLater: user.watchLater,
      recommended
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Contribution = require("../models/Contribution");

exports.getProfileStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Not found" });

    let stats = {
      joinedDate: user.createdAt
    };

    if (user.role === "contributor") {
      const contributions = await Contribution.countDocuments({ user: user._id });
      const approved = await Contribution.countDocuments({ user: user._id, status: "approved" });
      stats = { ...stats, totalContributions: contributions, approvedContributions: approved };
    } else if (user.role === "premium") {
      stats = {
        ...stats,
        documentsRead: user.studyHistory?.length || 0,
        savedForLater: user.watchLater?.length || 0,
      };
    } else if (user.role === "admin") {
      stats = {
        ...stats,
        accessLevel: "Supreme Administrator",
      };
    } else {
      stats = {
        ...stats,
        membershipStatus: "Free Tier",
        perks: "Limited Access to Historical Archives"
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
