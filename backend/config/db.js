const mongoose = require("mongoose");
require("dotenv").config();  

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing in .env");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB Error:", error.message);
    throw error;
  }
};

module.exports = connectDB;