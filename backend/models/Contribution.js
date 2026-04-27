const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
    {
        fighter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fighter",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        suggestion: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        adminFeedback: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Contribution", contributionSchema);
