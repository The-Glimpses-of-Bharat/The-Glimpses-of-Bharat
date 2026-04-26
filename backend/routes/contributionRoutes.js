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
} = require("../controllers/contributionController");

const { protect, authorize } = require("../middleware/authMiddleware");

// GET — dashboard views (contributor role)
router.get("/my", protect, authorize("contributor"), getMyFighters);
router.get("/my-stats", protect, authorize("contributor"), getMyStats);
router.get("/pending", protect, authorize("contributor"), getPending);
router.get("/approved", protect, authorize("contributor"), getApproved);
router.get("/rejected", protect, authorize("contributor"), getRejected);

// POST — submit a new entry (contributor)
router.post("/", protect, authorize("contributor"), submitContribution);

// PUT — edit own pending entry (contributor)
router.put("/:id", protect, authorize("contributor"), editContribution);

module.exports = router;