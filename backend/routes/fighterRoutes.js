const express = require("express");
const router = express.Router();

const {
  createFighter,
  getAllFighters,
  getFighter,
  updateFighter,
  deleteFighter,
  approveFighter,   // ✅ NEW
  rejectFighter     // ✅ NEW
} = require("../controllers/fighterController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ✅ Public routes
router.get("/", getAllFighters);
router.get("/:id", getFighter);

// ✅ Create (user allowed)
router.post(
  "/",
  protect,
  authorize("admin", "contributor", "user"),
  createFighter
);

// ✅ Update (admin only)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFighter
);

// ✅ Delete (admin only)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFighter
);

// 🔥 ADMIN ACTIONS
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