const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const BlacklistedToken = require("../models/BlacklistedToken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential || typeof credential !== "string") {
    console.error("Missing or invalid credential in request body:", req.body);
    return res.status(400).json({ message: "Valid Google ID Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Empty payload from Google token");
    }

    const { email, name, sub, picture } = payload;

    // Restrict domain strictly to @bmsce.ac.in, but allow whitelisted emails for testing
    const emailLower = email.toLowerCase().trim();
    const domain = emailLower.split("@").pop();
    
    const allowedEmails = process.env.ALLOWED_EMAILS 
      ? process.env.ALLOWED_EMAILS.split(",").map(e => e.trim().toLowerCase()) 
      : [];

    const isWhitelisted = allowedEmails.includes(emailLower);

    if (domain !== "bmsce.ac.in" && !isWhitelisted) {
      return res.status(403).json({ message: "Only @bmsce.ac.in emails are allowed." });
    }

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",").map(e => e.trim().toLowerCase())
      : [];
    const isAdmin = adminEmails.includes(emailLower);

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        profilePicture: picture,
        role: isAdmin ? "ADMIN" : "USER",
      });
    } else {
      // If user exists, update their role if they are now an admin (or no longer one)
      const newRole = isAdmin ? "ADMIN" : "USER";
      if (user.role !== newRole) {
        user.role = newRole;
        await user.save();
      }
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account has been suspended. Please contact support." });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      isProfileComplete: user.isProfileComplete,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      await BlacklistedToken.create({ token });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};

module.exports = { googleLogin, logout };
