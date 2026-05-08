const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
  },
  reason: {
    type: String,
    enum: ["SPAM", "FAKE_RIDE", "MISCONDUCT", "HARASSMENT", "UNSAFE_BEHAVIOR", "OTHER"],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"],
    default: "PENDING",
  },
  statusHistory: [{
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
    comment: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
