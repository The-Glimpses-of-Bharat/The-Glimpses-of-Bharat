// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { protect } = require("./middleware/authMiddleware");
// Load env variables
dotenv.config();

// Initialize app
const app = express();

// Connect to DB (non-fatal — quiz/trivia/locations work without DB)
connectDB().catch((err) => {
  console.warn("⚠️  MongoDB not connected. DB-dependent routes won't work, but quiz/trivia/locations will.");
});

// Middleware
app.use(morgan("dev"));

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "https://the-glimpse-of-bharat-code.vercel.app",
        "https://the-glimpses-of-bharat-sdse.vercel.app",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ];
      
      // Allow if no origin (e.g. mobile apps, curl) or if it's in the list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else if (origin.endsWith('.vercel.app')) {
        // Allow any vercel deployment for this project
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/scans", require("./routes/scanRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/fighters", require("./routes/fighterRoutes"));
app.use("/api/contributions", require("./routes/contributionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/quiz", require("./routes/quizRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/concerns", require("./routes/concernRoutes"));
// Health check route
app.get("/", (req, res) => {
  res.send("Glimpse of Bharat API running...");
});

// Optional: Health endpoint for deployment
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Global error handler (important)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

app.get("/test-protected", protect, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
  });
// Port config (IMPORTANT)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
