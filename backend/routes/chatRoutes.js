const express = require("express");
const router = express.Router();
const { askQuestion, getChatHistory } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

// Ask a question (Can be public or protected, but let's allow public for better UX with optional auth in controller)
router.post("/ask", askQuestion);

// Get chat history (Requires login)
router.get("/history", protect, getChatHistory);

module.exports = router;
