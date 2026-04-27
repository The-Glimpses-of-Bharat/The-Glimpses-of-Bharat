const mongoose = require("mongoose");
require("dotenv").config();  

class Database {
  constructor() {
    if (!Database.instance) {
      this.isConnected = false;
      Database.instance = this;
    }
    return Database.instance;
  }

  async connect() {
    if (this.isConnected) {
      console.log("Using existing MongoDB connection (Singleton)");
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing in .env");
    }

    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      this.isConnected = true;
      console.log(` MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error("DB Error:", error.message);
      throw error;
    }
  }
}

const dbInstance = new Database();

const connectDB = async () => {
  await dbInstance.connect();
};

module.exports = connectDB;