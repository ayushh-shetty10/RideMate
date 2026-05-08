const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  from: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  transportMode: {
    type: String,
    enum: ["AUTO", "CAB"],
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  status: {
    type: String,
    enum: ["OPEN", "FULL", "CANCELLED"],
    default: "OPEN",
    index: true,
  },
}, { timestamps: true });

// Add composite indexes for common search patterns
rideSchema.index({ destination: "text", status: 1 });
rideSchema.index({ dateTime: 1, status: 1 });

// Ensure totalSeats is at least 1 and participants don't exceed it
rideSchema.pre("save", async function() {
  if (this.participants.length >= this.totalSeats) {
    this.status = "FULL";
  } else if (this.status === "FULL" && this.participants.length < this.totalSeats) {
    this.status = "OPEN";
  }
});

module.exports = mongoose.model("Ride", rideSchema);
