const express = require("express");
const router = express.Router();

const {
  createFighter,
  getAllFighters,
  getFighter,
  updateFighter,
  deleteFighter,
} = require("../controllers/fighterController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllFighters);
router.get("/:id", getFighter);

router.post("/", protect, authorize("admin", "contributor"), createFighter);
router.put("/:id", protect, authorize("admin"), updateFighter);
router.delete("/:id", protect, authorize("admin"), deleteFighter);

module.exports = router;