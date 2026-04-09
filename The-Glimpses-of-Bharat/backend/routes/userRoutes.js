const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

router.get("/premium", protect, authorize("premium"), (req, res) => {
  res.json({ message: "Premium content accessed" });
});

module.exports = router;