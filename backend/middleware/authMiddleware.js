const jwt = require("jsonwebtoken");

// 🔹 Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// 🔹 Protect middleware
exports.protect = (req, res, next) => {
  console.log("HEADERS:", req.headers);

  const token = req.headers.authorization;

  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  // 🔥 TEMP TEST (important for now)
  if (token === "test") {
    req.user = { role: "admin" };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};


