const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

class UserClass {
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { 
      type: String, 
      default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bharat" 
    },

    role: {
      type: String,
      enum: ["user", "admin", "contributor", "premium"],
      default: "user",
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    studyHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fighter"
    }],

    watchLater: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fighter"
    }],
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.loadClass(UserClass);

module.exports = mongoose.model("User", userSchema);