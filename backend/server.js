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

// Connect to DB
connectDB();

// Middleware
app.use(morgan("dev"));

app.use(
  cors({
    origin: ["https://the-glimpse-of-bharat-code.vercel.app"],
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