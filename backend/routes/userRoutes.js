const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

const { getPremiumDashboardData, getProfileStats } = require("../controllers/userController");

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

router.get("/premium-dashboard", protect, authorize("premium", "admin"), getPremiumDashboardData);
router.get("/profile-stats", protect, getProfileStats);

module.exports = router;