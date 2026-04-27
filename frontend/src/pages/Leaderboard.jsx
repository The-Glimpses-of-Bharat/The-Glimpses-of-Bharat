import React, { useState, useMemo } from "react";
import "./Leaderboard.css";

const PODIUM_CLASSES = ["gold", "silver", "bronze"];

function getScoreClass(pct) {
  if (pct >= 80) return "excellent";
  if (pct >= 60) return "good";
  if (pct >= 40) return "average";
  return "poor";
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function Leaderboard() {
  const [filter, setFilter] = useState("all");

  const rawEntries = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("bharat_leaderboard") || "[]");
    } catch {
      return [];
    }
  }, []);

  const entries = useMemo(() => {
    const now = new Date();
    return rawEntries.filter((e) => {
      if (filter === "all") return true;
      const d = new Date(e.date);
      if (filter === "today") {
        return d.toDateString() === now.toDateString();
      }
      if (filter === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
      }
      return true;
    });
  }, [rawEntries, filter]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  if (entries.length === 0) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>🏆 Leaderboard</h1>
        </div>
        <div className="leaderboard-empty">
          <div className="leaderboard-empty-icon">🏅</div>
          <h3>No scores yet!</h3>
          <p>Take the quiz to see your name on the leaderboard.</p>
          <a href="/quiz" className="btn btn-primary" id="leaderboard-quiz-link">
            🧠 Start Quiz
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <div className="leaderboard-filters">
          {["all", "week", "today"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
              id={`filter-${f}`}
            >
              {f === "all" ? "All Time" : f === "week" ? "This Week" : "Today"}
            </button>
          ))}
        </div>
      </div>

      {/* Podium for top 3 */}
      {top3.length > 0 && (
        <div className="podium">
          {top3.map((entry, i) => (
            <div key={entry.id} className={`podium-card ${PODIUM_CLASSES[i]}`}>
              <div className="podium-rank">{i + 1}</div>
              <div className="podium-avatar">
                {entry.playerName?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="podium-name">{entry.playerName}</div>
              <div className="podium-score">{entry.percentage}%</div>
              <div className="podium-detail">
                {entry.score}/{entry.totalQuestions} · {formatTime(entry.timeTaken)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table for remaining */}
      {rest.length > 0 && (
        <div className="leaderboard-table-section">
          <div className="section-title">All Rankings</div>
          <div className="table-wrapper leaderboard-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Performance</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((entry, i) => {
                  const rank = i + 4;
                  const scoreClass = getScoreClass(entry.percentage);
                  return (
                    <tr key={entry.id}>
                      <td>
                        <div className="rank-cell">{rank}</div>
                      </td>
                      <td>
                        <div className="player-cell">
                          <div className="player-mini-avatar">
                            {entry.playerName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                            {entry.playerName}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {entry.score}/{entry.totalQuestions}
                      </td>
                      <td>
                        <div className="score-bar-wrap">
                          <div className="score-bar">
                            <div
                              className={`score-bar-fill ${scoreClass}`}
                              style={{ width: `${entry.percentage}%` }}
                            />
                          </div>
                          <span className={`score-pct ${scoreClass}`}>{entry.percentage}%</span>
                        </div>
                      </td>
                      <td>{formatTime(entry.timeTaken)}</td>
                      <td style={{ color: "var(--text-muted)" }}>{formatDate(entry.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
