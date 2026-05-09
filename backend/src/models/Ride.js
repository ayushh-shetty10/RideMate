const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
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
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["OPEN", "FULL", "CANCELLED", "COMPLETED"],
      default: "OPEN",
      index: true,
    },
  },
  { timestamps: true }
);

// Add composite indexes for common search patterns
rideSchema.index({ destination: "text", status: 1 });
rideSchema.index({ dateTime: 1, status: 1 });

// Single pre-save hook: handles completion and seat capacity together
rideSchema.pre("save", async function () {
  console.log(`🛡️ Middleware: Processing ride ${this._id || 'new'} [Current Status: ${this.status}]`);

  try {
    // If already cancelled, don't touch the status
    if (this.status === "CANCELLED") {
      return;
    }

    // Auto-complete rides whose scheduled time has passed
    const now = new Date();
    if (this.dateTime && this.dateTime < now) {
      if (this.status !== "COMPLETED") {
        console.log(`✅ Lifecycle: Marking ride ${this._id} as COMPLETED (overdue)`);
        this.status = "COMPLETED";
      }
      return;
    }

    // Sync FULL / OPEN based on seat count
    const participantCount = this.participants.length;
    const previousStatus = this.status;

    if (participantCount >= this.totalSeats) {
      this.status = "FULL";
    } else {
      this.status = "OPEN";
    }

    if (previousStatus !== this.status) {
      console.log(`🔄 Lifecycle: Ride ${this._id} status changed: ${previousStatus} -> ${this.status} (${participantCount}/${this.totalSeats} seats)`);
    }
  } catch (error) {
    console.error(`❌ Middleware Error for ride ${this._id}:`, error);
    throw error; // Propagate error to prevent saving invalid state
  }
});

module.exports = mongoose.model("Ride", rideSchema);
