const express = require("express");
const router = express.Router();
const { completeProfile, getMe, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

router.put("/profile", protect, completeProfile);
router.get("/me", protect, getMe);
router.get("/:id", protect, getUserProfile);

module.exports = router;
