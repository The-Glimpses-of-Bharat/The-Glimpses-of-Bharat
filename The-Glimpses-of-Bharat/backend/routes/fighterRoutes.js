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

module.exports = router;