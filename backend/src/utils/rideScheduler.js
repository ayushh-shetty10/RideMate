const Ride = require("../models/Ride");

/**
 * Periodically checks for OPEN/FULL rides that have passed their scheduled time
 * and marks them as COMPLETED.
 */
const startRideScheduler = (intervalMs = 10 * 60 * 1000) => { // Default 10 mins
  console.log("🚀 Ride completion scheduler started");
  
  const checkRides = async () => {
    try {
      const now = new Date();
      const result = await Ride.updateMany(
        {
          status: { $in: ["OPEN", "FULL"] },
          dateTime: { $lt: now }
        },
        {
          $set: { status: "COMPLETED" }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Auto-completed ${result.modifiedCount} overdue rides.`);
      }
    } catch (error) {
      console.error("❌ Error in ride completion scheduler:", error);
    }
  };

  // Run immediately on start
  checkRides();
  
  // Schedule periodic runs
  return setInterval(checkRides, intervalMs);
};

module.exports = { startRideScheduler };
