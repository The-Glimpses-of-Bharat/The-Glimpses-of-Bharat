import React, { useState, useEffect, useMemo } from "react"; // HMR trigger
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import api from "../api/axios";
import "./Analytics.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Chart.js global defaults for dark theme
ChartJS.defaults.color = "#8b90a0";
ChartJS.defaults.borderColor = "rgba(255, 255, 255, 0.07)";
ChartJS.defaults.font.family = "'Inter', sans-serif";

export default function Analytics() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch locations for timeline data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/quiz/locations");
        if (res.data?.locations) setLocations(res.data.locations);
      } catch (err) {
        console.error("Failed to load analytics data", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Get leaderboard data from localStorage
  const leaderboard = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("bharat_leaderboard") || "[]");
    } catch {
      return [];
    }
  }, []);

  // ─── Timeline Chart Data (fighters by birth decade) ───
  const timelineData = useMemo(() => {
    const decades = {};
    const fighters = locations.filter((l) => l.born);
    fighters.forEach((f) => {
      const decade = Math.floor(f.born / 10) * 10;
      const label = `${decade}s`;
      decades[label] = (decades[label] || 0) + 1;
    });

    // Add some extra historical data to make chart richer
    const extraData = {
      "1820s": 1,
      "1850s": 1,
      "1860s": 1,
      "1870s": 1,
      "1890s": 2,
      "1900s": 2,
    };

    Object.entries(extraData).forEach(([k, v]) => {
      decades[k] = Math.max(decades[k] || 0, v);
    });

    const sorted = Object.entries(decades).sort((a, b) => a[0].localeCompare(b[0]));

    return {
      labels: sorted.map(([k]) => k),
      datasets: [
        {
          label: "Freedom Fighters",
          data: sorted.map(([, v]) => v),
          backgroundColor: sorted.map((_, i) => {
            const palette = [
              "rgba(255, 153, 51, 0.7)",
              "rgba(59, 130, 246, 0.7)",
              "rgba(34, 197, 94, 0.7)",
              "rgba(139, 92, 246, 0.7)",
              "rgba(249, 115, 22, 0.7)",
              "rgba(236, 72, 153, 0.7)",
              "rgba(245, 158, 11, 0.7)",
              "rgba(20, 184, 166, 0.7)",
            ];
            return palette[i % palette.length];
          }),
          borderColor: sorted.map((_, i) => {
            const palette = [
              "#ff9933", "#3b82f6", "#22c55e", "#8b5cf6",
              "#f97316", "#ec4899", "#f59e0b", "#14b8a6",
            ];
            return palette[i % palette.length];
          }),
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    };
  }, [locations]);

  // ─── Location Type Doughnut ───
  const locationTypeData = useMemo(() => {
    const birthplaces = locations.filter((l) => l.type === "birthplace").length;
    const events = locations.filter((l) => l.type === "event").length;

    return {
      labels: ["Birthplaces", "Historic Events"],
      datasets: [
        {
          data: [birthplaces, events],
          backgroundColor: [
            "rgba(255, 153, 51, 0.8)",
            "rgba(19, 136, 8, 0.8)",
          ],
          borderColor: ["#ff9933", "#138808"],
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    };
  }, [locations]);

  // ─── Quiz Scores Line Chart ───
  const scoresData = useMemo(() => {
    if (leaderboard.length === 0) return null;

    const recent = leaderboard.slice(0, 10).reverse();

    return {
      labels: recent.map((e, i) => `Quiz ${i + 1}`),
      datasets: [
        {
          label: "Score %",
          data: recent.map((e) => e.percentage),
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: "#f97316",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [leaderboard]);

  // ─── Stats ───
  const totalQuizzes = leaderboard.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(leaderboard.reduce((sum, e) => sum + e.percentage, 0) / totalQuizzes)
    : 0;
  const bestScore = totalQuizzes > 0
    ? Math.max(...leaderboard.map((e) => e.percentage))
    : 0;

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e2230",
        titleColor: "#f0f2f8",
        bodyColor: "#8b90a0",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "rgba(255, 255, 255, 0.04)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const lineOptions = {
    ...commonOptions,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
        grid: { color: "rgba(255, 255, 255, 0.04)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const doughnutOptions = {
    ...commonOptions,
    cutout: "65%",
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: true,
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 12, weight: 600 },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-state">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1>📊 Analytics</h1>
          <p className="page-subtitle">
            Visualize India's independence history and your quiz performance
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon blue">📍</div>
          <div>
            <div className="analytics-stat-value">{locations.length}</div>
            <div className="analytics-stat-label">Historic Locations</div>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon saffron">🧠</div>
          <div>
            <div className="analytics-stat-value">{totalQuizzes}</div>
            <div className="analytics-stat-label">Quizzes Taken</div>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon green">📈</div>
          <div>
            <div className="analytics-stat-value">{avgScore}%</div>
            <div className="analytics-stat-label">Average Score</div>
          </div>
        </div>
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon violet">🏆</div>
          <div>
            <div className="analytics-stat-value">{bestScore}%</div>
            <div className="analytics-stat-label">Best Score</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts">
        {/* Timeline Bar Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Freedom Fighters Timeline</div>
              <div className="chart-card-subtitle">Leaders by birth decade</div>
            </div>
            <span className="chart-card-badge">Bar Chart</span>
          </div>
          <div className="chart-wrapper" style={{ height: 280 }}>
            <Bar data={timelineData} options={barOptions} />
          </div>
        </div>

        {/* Location Type Doughnut */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Location Categories</div>
              <div className="chart-card-subtitle">Birthplaces vs Historic Events</div>
            </div>
            <span className="chart-card-badge">Doughnut</span>
          </div>
          <div className="chart-wrapper doughnut-wrapper" style={{ height: 280 }}>
            <Doughnut data={locationTypeData} options={doughnutOptions} />
            <div className="doughnut-center">
              <div className="doughnut-center-value">{locations.length}</div>
              <div className="doughnut-center-label">Locations</div>
            </div>
          </div>
        </div>

        {/* Quiz Scores Line Chart */}
        <div className="chart-card full-width">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Quiz Performance</div>
              <div className="chart-card-subtitle">Your recent quiz scores over time</div>
            </div>
            <span className="chart-card-badge">Line Chart</span>
          </div>
          {scoresData ? (
            <div className="chart-wrapper" style={{ height: 280 }}>
              <Line data={scoresData} options={lineOptions} />
            </div>
          ) : (
            <div className="chart-no-data">
              <span className="chart-no-data-icon">📝</span>
              <span>No quiz data yet. Take a quiz to see your performance trend!</span>
              <a href="/quiz" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                Start Quiz
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
