const express = require("express");
const router = express.Router();

const {
  createFighter,
  getAllFighters,
  getFighter,
  updateFighter,
  deleteFighter,
  approveFighter,   
  rejectFighter     
} = require("../controllers/fighterController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllFighters);
router.get("/:id", getFighter);

router.post(
"/",
  protect,
  authorize("admin", "contributor", "user"),
  createFighter
);


router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateFighter
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteFighter
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

const {
  getApprovedFighters,
  getPendingFighters,
  approveFighter,
  rejectFighter,
} = require("../controllers/fighterController");

// Replace public GET
router.get("/", getApprovedFighters);

// Admin workflow
router.get("/pending", protect, authorize("admin"), getPendingFighters);
router.put("/:id/approve", protect, authorize("admin"), approveFighter);
router.put("/:id/reject", protect, authorize("admin"), rejectFighter);

module.exports = router;
