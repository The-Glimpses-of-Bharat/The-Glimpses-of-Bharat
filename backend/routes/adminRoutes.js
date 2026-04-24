const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getDashboardStats,
  // Contribution Management
  getPendingContributions,
  approveContribution,
  rejectContribution,
  // Freedom Fighter CRUD
  getAllFighters,
  createFighterAdmin,
  updateFighterAdmin,
  deleteFighterAdmin,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

// All routes require admin role
const adminOnly = [protect, authorize("admin")];

// ─── Dashboard ──────────────────────────────────────────────────────────────
router.get("/stats", ...adminOnly, getDashboardStats);

// ─── User Management ────────────────────────────────────────────────────────
router.get("/users", ...adminOnly, getAllUsers);
router.delete("/users/:id", ...adminOnly, deleteUser);
router.put("/users/:id/role", ...adminOnly, updateUserRole);

// ─── Contribution Management ────────────────────────────────────────────────
// GET /api/admin/pending-contributions
router.get("/pending-contributions", ...adminOnly, getPendingContributions);

// POST /api/admin/approve/:id
router.post("/approve/:id", ...adminOnly, approveContribution);

// DELETE /api/admin/reject/:id
router.delete("/reject/:id", ...adminOnly, rejectContribution);

// ─── Freedom Fighters CRUD ──────────────────────────────────────────────────
router.get("/fighters", ...adminOnly, getAllFighters);
router.post("/fighters", ...adminOnly, createFighterAdmin);
router.put("/fighters/:id", ...adminOnly, updateFighterAdmin);
router.delete("/fighters/:id", ...adminOnly, deleteFighterAdmin);

module.exports = router;