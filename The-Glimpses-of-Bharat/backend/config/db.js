const mongoose = require("mongoose");
require("dotenv").config();  

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("MONGO_URI missing in .env");
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;