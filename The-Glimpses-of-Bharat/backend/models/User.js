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

    role: {
      type: String,
      enum: ["user", "admin", "contributor", "premium"],
      default: "user",
    },

    isPremium: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.loadClass(UserClass);

module.exports = mongoose.model("User", userSchema);