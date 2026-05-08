const express = require("express");
const router = express.Router();
const { googleLogin, logout } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/google", googleLogin);
router.post("/logout", protect, logout);

module.exports = router;
