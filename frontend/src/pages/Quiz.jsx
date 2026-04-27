import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axios";
import "./Quiz.css";

const LETTERS = ["A", "B", "C", "D"];
const TIMER_SECONDS = 15;

// Simple confetti component
function Confetti() {
  const colors = ["#ff9933", "#ffffff", "#138808", "#f97316", "#3b82f6", "#8b5cf6"];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 6,
    duration: Math.random() * 2 + 2,
    delay: Math.random() * 1.5,
    shape: Math.random() > 0.5 ? "50%" : "2px",
  }));

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.shape,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Quiz() {
  // Phase: start | playing | result
  const [phase, setPhase] = useState("start");
  const [playerName, setPlayerName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [trivia, setTrivia] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const timerRef = useRef(null);

  // Fetch trivia for start screen
  useEffect(() => {
    api.get("/quiz/trivia?count=3").then((res) => {
      if (res.data?.facts) setTrivia(res.data.facts);
    }).catch(() => {});
  }, []);

  // Timer logic
  useEffect(() => {
    if (phase !== "playing" || answered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, currentIndex, answered]);

  const handleTimeout = useCallback(() => {
    setAnswered(true);
    setSelectedAnswer(-1); // no answer
    // Auto advance after showing correct answer
    setTimeout(() => advanceQuestion(), 2000);
  }, [currentIndex, questions]);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const res = await api.get("/quiz/questions?count=10");
      if (res.data?.questions?.length) {
        setQuestions(res.data.questions);
        setPhase("playing");
        setCurrentIndex(0);
        setScore(0);
        setTimeLeft(TIMER_SECONDS);
        setStartTime(Date.now());
        setAnswered(false);
        setSelectedAnswer(null);
      }
    } catch (err) {
      console.error("Failed to load quiz", err);
    }
    setLoading(false);
  };

  const handleAnswer = (optionIndex) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelectedAnswer(optionIndex);
    setAnswered(true);

    const isCorrect = optionIndex === questions[currentIndex].correct;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => advanceQuestion(), 2000);
  };

  const advanceQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setTimeLeft(TIMER_SECONDS);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const end = Date.now();
    setEndTime(end);
    setPhase("result");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);

    // Save to localStorage leaderboard
    const entry = {
      id: Date.now().toString(),
      playerName: playerName || "Anonymous",
      score: score + (selectedAnswer === questions[currentIndex]?.correct ? 1 : 0),
      totalQuestions: questions.length,
      percentage: Math.round(((score + (selectedAnswer === questions[currentIndex]?.correct ? 1 : 0)) / questions.length) * 100),
      timeTaken: Math.round((end - startTime) / 1000),
      date: new Date().toISOString(),
      difficulty: "mixed",
    };

    const existing = JSON.parse(localStorage.getItem("bharat_leaderboard") || "[]");
    existing.push(entry);
    existing.sort((a, b) => b.percentage - a.percentage || a.timeTaken - b.timeTaken);
    localStorage.setItem("bharat_leaderboard", JSON.stringify(existing.slice(0, 50)));
  };

  const resetQuiz = () => {
    setPhase("start");
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setTimeLeft(TIMER_SECONDS);
    setStartTime(null);
    setEndTime(null);
  };

  const currentQ = questions[currentIndex];
  const finalScore = phase === "result"
    ? (score)
    : score;
  const timeTaken = startTime && endTime
    ? Math.round((endTime - startTime) / 1000)
    : 0;

  // ─── Start Screen ──────────────────────────
  if (phase === "start") {
    return (
      <div className="quiz-container">
        <div className="quiz-start">
          <div className="quiz-start-icon">🏛️</div>
          <h1>Bharat Knowledge Quiz</h1>
          <p>
            Test your knowledge about India's freedom fighters and the
            independence movement. 10 questions, 15 seconds each.
          </p>
          <div className="quiz-name-input">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              id="quiz-name-input"
            />
            <button
              className="quiz-start-btn"
              onClick={startQuiz}
              disabled={loading || !playerName.trim()}
              id="quiz-start-btn"
            >
              {loading ? (
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              ) : (
                <>▶ Start Quiz</>
              )}
            </button>
          </div>

          {trivia.length > 0 && (
            <div className="quiz-trivia-strip">
              <div className="section-title" style={{ justifyContent: "center" }}>
                💡 Did you know?
              </div>
              {trivia.map((t) => (
                <div key={t.id} className="trivia-card">
                  <span className="trivia-icon">{t.icon}</span>
                  <div>
                    <div className="trivia-text">{t.fact}</div>
                    <span className="trivia-category">{t.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Playing Screen ─────────────────────────
  if (phase === "playing" && currentQ) {
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <div className="quiz-progress">
            <div className="quiz-progress-label">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div
            className={`quiz-timer ${timeLeft <= 5 ? "danger" : timeLeft <= 10 ? "warning" : ""}`}
          >
            {timeLeft}
          </div>
        </div>

        <div className="quiz-question-card">
          <span className={`quiz-difficulty ${currentQ.difficulty}`}>
            {currentQ.difficulty}
          </span>
          <h2 className="quiz-question-text">{currentQ.question}</h2>

          <div className="quiz-options">
            {currentQ.options.map((opt, i) => {
              let optionClass = "quiz-option";
              if (answered) {
                if (i === currentQ.correct) optionClass += " correct";
                else if (i === selectedAnswer && i !== currentQ.correct) optionClass += " wrong";
              } else if (i === selectedAnswer) {
                optionClass += " selected";
              }

              return (
                <button
                  key={i}
                  className={optionClass}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  id={`quiz-option-${i}`}
                >
                  <span className="quiz-option-letter">{LETTERS[i]}</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && currentQ.explanation && (
            <div className="quiz-explanation">
              💡 {currentQ.explanation}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Result Screen ──────────────────────────
  if (phase === "result") {
    const pct = Math.round((finalScore / questions.length) * 100);
    let title = "Great effort!";
    let subtitle = "Keep learning about India's glorious history!";
    if (pct >= 90) { title = "🏆 Outstanding!"; subtitle = "You're a true patriot and history buff!"; }
    else if (pct >= 70) { title = "🎯 Well Done!"; subtitle = "Your knowledge of India's history is impressive!"; }
    else if (pct >= 50) { title = "📚 Good Try!"; subtitle = "You know quite a bit, but there's more to discover!"; }

    return (
      <div className="quiz-container">
        {showConfetti && <Confetti />}
        <div className="quiz-result">
          <div className="result-score-ring">
            <span className="result-score-value">{pct}%</span>
            <span className="result-score-label">{finalScore}/{questions.length}</span>
          </div>
          <h2 className="result-title">{title}</h2>
          <p className="result-subtitle">{subtitle}</p>

          <div className="result-stats">
            <div className="result-stat correct">
              <div className="result-stat-value">{finalScore}</div>
              <div className="result-stat-label">Correct</div>
            </div>
            <div className="result-stat wrong">
              <div className="result-stat-value">{questions.length - finalScore}</div>
              <div className="result-stat-label">Wrong</div>
            </div>
            <div className="result-stat time">
              <div className="result-stat-value">{timeTaken}s</div>
              <div className="result-stat-label">Time Taken</div>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={resetQuiz} id="quiz-retry-btn">
              🔄 Try Again
            </button>
            <a href="/leaderboard" className="btn btn-secondary" id="quiz-leaderboard-link">
              🏆 Leaderboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
