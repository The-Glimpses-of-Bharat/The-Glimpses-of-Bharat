const express = require("express");
const router = express.Router();

router.get("/ff", (req, res) => {
  res.send("List of Freedom Fighters");
});

module.exports = router;