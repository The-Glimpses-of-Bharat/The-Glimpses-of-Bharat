const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI === "temporary_placeholder") {
    console.log("⚠️ MongoDB not connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;