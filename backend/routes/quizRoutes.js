const express = require("express");
const router = express.Router();
const {
  getQuiz,
  getTrivia,
  getLocations
} = require("../controllers/quizController");

// GET /api/quiz/questions — Fetch randomized quiz questions
router.get("/questions", getQuiz);

// GET /api/quiz/trivia — Fetch random trivia facts
router.get("/trivia", getTrivia);

// GET /api/quiz/locations — Fetch freedom fighter locations for map
router.get("/locations", getLocations);

module.exports = router;
