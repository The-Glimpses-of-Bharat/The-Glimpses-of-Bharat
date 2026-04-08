const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getDashboardStats,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Admin-only routes
router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);
router.put("/users/:id/role", protect, authorize("admin"), updateUserRole);
router.get("/stats", protect, authorize("admin"), getDashboardStats);

module.exports = router;