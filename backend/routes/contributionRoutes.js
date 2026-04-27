const express = require("express");
const router = express.Router();

const {
  getMyFighters,
  getPending,
  getApproved,
  getRejected,
  getMyStats,
  submitContribution,
  editContribution,
  deleteContribution,
  submitSuggestion,
  getAllSuggestions,
  getMySuggestions,
  updateSuggestionStatus,
} = require("../controllers/contributionController");

const { protect, authorize } = require("../middleware/authMiddleware");

// --- USER/CONTRIBUTOR ROUTES (Tracking own contributions) ---

// Get current user's suggested edits (for existing fighters) - Public for all logged users
router.get("/my-suggestions", protect, getMySuggestions);

// Get current user's proposed new entries - Public for all logged users to avoid 403s in portal
router.get("/my", protect, getMyFighters);

// Get stats for current user - Public for all logged users
router.get("/my-stats", protect, getMyStats);

// Filtered views for current user
router.get("/pending", protect, getPending);
router.get("/approved", protect, getApproved);
router.get("/rejected", protect, getRejected);

// --- ACTIONS ---

// Propose a NEW fighter (Any registered user can propose)
router.post("/", protect, submitContribution);

// Suggest an update/info for an EXISTING fighter (Any registered user can suggest)
router.post("/suggest/:id", protect, submitSuggestion);

// Edit/Delete own pending entries
router.put("/:id", protect, editContribution);
router.delete("/:id", protect, deleteContribution);

// --- ADMIN ONLY ROUTES ---

// Admin: View all edit suggestions globally
router.get("/suggestions", protect, authorize("admin"), getAllSuggestions);

// Admin: Approve/Reject an edit suggestion
router.patch("/suggestions/:id/status", protect, authorize("admin"), updateSuggestionStatus);

module.exports = router;