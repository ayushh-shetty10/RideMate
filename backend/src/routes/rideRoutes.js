const express = require("express");
const router = express.Router();
const {
  createRide,
  getRides,
  getMyRides,
  joinRide,
  leaveRide,
  cancelRide,
} = require("../controllers/rideController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect); // All ride routes are protected

router.post("/", createRide);
router.get("/", getRides);
router.get("/my-rides", getMyRides);
router.post("/:id/join", joinRide);
router.post("/:id/leave", leaveRide);
router.patch("/:id/cancel", cancelRide);

module.exports = router;
