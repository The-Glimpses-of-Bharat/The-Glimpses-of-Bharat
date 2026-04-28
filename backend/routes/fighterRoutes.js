const express = require("express");
const router = express.Router();

const {
  createFighter,
  getFighter,
  updateFighter,
  deleteFighter,
  approveFighter,
  rejectFighter,
  getApprovedFighters,
  getPendingFighters,
  readFighter,
  likeFighter,
  toggleWatchLater
} = require("../controllers/fighterController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ✅ Public (only approved fighters)
router.get("/", getApprovedFighters);

// Get single fighter
router.get("/:id", getFighter);

// Read fighter (increment view, add to history)
router.post("/:id/read", protect, readFighter);

// Like fighter
router.post("/:id/like", protect, likeFighter);

// Toggle watch later
router.post("/:id/watch-later", protect, toggleWatchLater);

// Create fighter
router.post(
  "/",
  protect,
  authorize("admin", "contributor", "user", "premium"),
  createFighter
);

// Update fighter
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFighter
);

// Delete fighter
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFighter
);

// Admin workflow
router.get(
  "/pending",
  protect,
  authorize("admin"),
  getPendingFighters
);

router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveFighter
);

router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectFighter
);

module.exports = router;