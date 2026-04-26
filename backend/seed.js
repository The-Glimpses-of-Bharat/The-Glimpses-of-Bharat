const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Fighter = require("./models/Fighter");

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 1. Create Admin User
    const adminExists = await User.findOne({ email: "admin@bharat.com" });
    if (!adminExists) {
      await User.create({
        name: "Super Admin",
        email: "admin@bharat.com",
        password: "password123",
        role: "admin"
      });
      console.log("Admin user created: admin@bharat.com / password123");
    } else {
      console.log("Admin user already exists.");
    }

    // 2. Create Sample Freedom Fighters
    await Fighter.deleteMany({}); // Clear existing to update with images
    
    const sampleFighters = [
      {
        name: "Mahatma Gandhi",
        description: "Leader of the Indian independence movement against British rule.",
        birthYear: 1869,
        deathYear: 1948,
        contributions: "Led the Dandi March, Quit India Movement, and advocated for Non-violence (Ahimsa).",
        status: "approved",
        image: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg"
      },
      {
        name: "Subhash Chandra Bose",
        description: "An Indian nationalist whose defiance of British authority in India made him a hero.",
        birthYear: 1897,
        deathYear: 1945,
        contributions: "Founded the Indian National Army (INA) and gave the slogan 'Jai Hind'.",
        status: "approved",
        image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Subhas_Chandra_Bose_NRB.jpg"
      },
      {
        name: "Bhagat Singh",
        description: "A charismatic Indian revolutionary who participated in the mistaken murder of a junior British police officer.",
        birthYear: 1907,
        deathYear: 1931,
        contributions: "Active member of the Hindustan Socialist Republican Association. Threw a bomb in the Central Legislative Assembly.",
        status: "approved",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Bhagat_Singh_1929.jpg"
      },
      {
          name: "Rani Lakshmibai",
          description: "The Rani of Jhansi and a leading figure in the Indian Rebellion of 1857.",
          birthYear: 1828,
          deathYear: 1858,
          contributions: "Fought valiantly against the British East India Company to protect her kingdom of Jhansi.",
          status: "approved",
          image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Rani_Lakshmibai.jpg"
      }
    ];

    await Fighter.insertMany(sampleFighters);
    console.log("Sample freedom fighters added to database with images.");

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
