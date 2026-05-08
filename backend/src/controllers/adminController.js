const User = require("../models/User");
const Ride = require("../models/Ride");
const Report = require("../models/Report");

// Get platform statistics
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRides = await Ride.countDocuments();
    const activeRides = await Ride.countDocuments({ status: { $ne: "CANCELLED" }, dateTime: { $gte: new Date() } });
    const cancelledRides = await Ride.countDocuments({ status: "CANCELLED" });
    const pendingReports = await Report.countDocuments({ status: "PENDING" });

    res.json({
      totalUsers,
      totalRides,
      activeRides,
      cancelledRides,
      pendingReports,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch platform stats" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Toggle user block status
const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "ADMIN") {
      return res.status(403).json({ message: "Cannot block an admin user" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`, isBlocked: user.isBlocked });
  } catch (error) {
    console.error("Error toggling user block:", error);
    res.status(400).json({ message: "Failed to update user status" });
  }
};

// Delete a ride
const deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    await Ride.findByIdAndDelete(req.params.id);
    res.json({ message: "Ride deleted successfully by admin" });
  } catch (error) {
    console.error("Error deleting ride:", error);
    res.status(400).json({ message: "Failed to delete ride" });
  }
};

module.exports = {
  getStats,
  getUsers,
  toggleUserBlock,
  deleteRide,
};
