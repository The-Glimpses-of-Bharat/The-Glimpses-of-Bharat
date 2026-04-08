const express = require("express");
const router = express.Router();

const {
  getMyFighters,
  getPending,
  getApproved,
  getRejected,
} = require("../controllers/contributorController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/my", protect, authorize("contributor"), getMyFighters);
router.get("/pending", protect, authorize("contributor"), getPending);
router.get("/approved", protect, authorize("contributor"), getApproved);
router.get("/rejected", protect, authorize("contributor"), getRejected);

module.exports = router;