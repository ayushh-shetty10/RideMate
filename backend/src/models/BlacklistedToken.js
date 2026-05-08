const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "24h", // Tokens expire after 24 hours (matching JWT expiry)
  },
});

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
