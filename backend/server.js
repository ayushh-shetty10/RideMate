require("dotenv").config();
const app = require("./src/app");
const mongoose = require("mongoose");
const connectDB = require("./src/db/db");
const { startRideScheduler } = require("./src/utils/rideScheduler");

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    // Start the background scheduler for ride completion
    startRideScheduler();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
