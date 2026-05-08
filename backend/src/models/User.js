const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  department: {
    type: String,
  },
  studyYear: {
    type: String,
  },
  usn: {
    type: String,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
