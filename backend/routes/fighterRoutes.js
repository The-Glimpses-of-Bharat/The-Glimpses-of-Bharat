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
  getPendingFighters
} = require("../controllers/fighterController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ✅ Public (only approved fighters)
router.get("/", getApprovedFighters);

// Get single fighter
router.get("/:id", getFighter);

// Create fighter
router.post(
  "/",
  protect,
  authorize("admin", "contributor", "user"),
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