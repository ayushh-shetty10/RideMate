const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { 
  getStats, 
  getUsers, 
  toggleUserBlock, 
  deleteRide 
} = require("../controllers/adminController");

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/toggle-block", toggleUserBlock);
router.delete("/rides/:id", deleteRide);

module.exports = router;
