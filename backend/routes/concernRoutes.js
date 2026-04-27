const express = require("express");
const router = express.Router();
const {
  submitConcern,
  getMyConcerns,
  getAllConcerns,
  addressConcern,
} = require("../controllers/concernController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Premium user routes
router.post("/", protect, submitConcern);
router.get("/my", protect, getMyConcerns);

// Admin routes
router.get("/", protect, authorize("admin"), getAllConcerns);
router.put("/:id/address", protect, authorize("admin"), addressConcern);

module.exports = router;
