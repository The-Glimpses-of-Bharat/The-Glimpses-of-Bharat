const mongoose = require("mongoose");

const fighterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: String,
    birthYear: Number,
    deathYear: Number,
    contributions: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isDuplicate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fighter", fighterSchema);