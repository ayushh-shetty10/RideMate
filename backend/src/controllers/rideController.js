const Ride = require("../models/Ride");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");
const { 
  getJoinRideTemplate, 
  getLeaveRideTemplate, 
  getCancelRideTemplate 
} = require("../utils/emailTemplates");

// Create a new ride
const createRide = async (req, res) => {
  const { from, destination, dateTime, transportMode, totalSeats } = req.body;

  try {
    const ride = await Ride.create({
      creator: req.user._id,
      from,
      destination,
      dateTime,
      transportMode,
      totalSeats,
      participants: [req.user._id], // Creator is the first participant
    });

    res.status(201).json(ride);
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(400).json({ message: "Failed to create ride" });
  }
};

// Get all rides with filters and time window matching
const getRides = async (req, res) => {
  const { destination, date, transportMode, status } = req.query;
  let query = {};

  if (status) {
    query.status = status;
  } else {
    // Default view: only show future OPEN/FULL rides
    query.status = { $in: ["OPEN", "FULL"] };
    query.dateTime = { $gte: new Date() };
  }

  if (destination) {
    query.destination = { $regex: destination, $options: "i" };
  }

  if (transportMode) {
    query.transportMode = transportMode;
  }

  if (date) {
    const searchDate = new Date(date);
    const startTime = new Date(searchDate.getTime() - 60 * 60 * 1000);
    const endTime = new Date(searchDate.getTime() + 60 * 60 * 1000);
    query.dateTime = { $gte: startTime, $lte: endTime };
  }

  try {
    const rides = await Ride.find(query)
      .populate("creator", "name profilePicture email department")
      .populate("participants", "name profilePicture email department")
      .sort({ dateTime: 1 })
      .lean();
    res.json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
};

// Get user's rides (created or joined)
const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { creator: req.user._id },
        { participants: req.user._id }
      ]
    })
      .populate("creator", "name profilePicture email")
      .populate("participants", "name profilePicture email")
      .sort({ dateTime: 1 });
    res.json(rides);
  } catch (error) {
    console.error("Error fetching my rides:", error);
    res.status(500).json({ message: "Failed to fetch your rides" });
  }
};

// Join a ride
const joinRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("creator", "name email");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Prevent joining cancelled or completed rides
    if (ride.status === "CANCELLED" || ride.status === "COMPLETED" || new Date(ride.dateTime) < new Date()) {
      const currentStatus = (new Date(ride.dateTime) < new Date()) ? "COMPLETED" : ride.status;
      return res.status(400).json({ 
        message: `This ride cannot be joined because it is ${currentStatus.toLowerCase()}.` 
      });
    }



    if (ride.participants.length >= ride.totalSeats) {
      return res.status(400).json({ message: "This ride is already full" });
    }

    if (ride.participants.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already a participant in this ride" });
    }

    ride.participants.push(req.user._id);
    
    // Update status to FULL if capacity reached
    if (ride.participants.length >= ride.totalSeats) {
      ride.status = "FULL";
    }

    await ride.save();

    const updatedRide = await Ride.findById(req.params.id)
      .populate("creator", "name profilePicture email")
      .populate("participants", "name profilePicture email");

    // Send response immediately
    res.json(updatedRide);

    // Send email asynchronously in the background
    User.findById(req.user._id).then(joiner => {
      if (joiner) {
        sendEmail({
          to: ride.creator.email,
          subject: `New Travel Mate for your ride to ${ride.destination}!`,
          html: getJoinRideTemplate(ride.creator.name, joiner.name, ride),
        }).catch(err => console.error("Background email error:", err));
      }
    }).catch(err => console.error("Background user fetch error:", err));
  } catch (error) {
    console.error("Error joining ride:", error);
    res.status(500).json({ message: "Failed to join ride" });
  }
};

// Leave a ride
const leaveRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("creator", "name email");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Prevent leaving cancelled or completed rides
    if (ride.status === "CANCELLED" || ride.status === "COMPLETED" || new Date(ride.dateTime) < new Date()) {
      const currentStatus = (new Date(ride.dateTime) < new Date()) ? "COMPLETED" : ride.status;
      return res.status(400).json({ 
        message: `Cannot leave a ${currentStatus.toLowerCase()} ride.` 
      });
    }

    if (ride.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "As the host, you cannot leave your own ride. Please cancel it instead if you can't go." });
    }

    const wasFull = ride.status === "FULL";
    
    ride.participants = ride.participants.filter(
      (p) => p.toString() !== req.user._id.toString()
    );

    // If ride was full, set it back to OPEN
    if (wasFull && ride.participants.length < ride.totalSeats) {
      ride.status = "OPEN";
    }

    await ride.save();

    const updatedRide = await Ride.findById(req.params.id)
      .populate("creator", "name profilePicture email")
      .populate("participants", "name profilePicture email");

    // Send response immediately
    res.json(updatedRide);

    // Send email asynchronously in the background
    User.findById(req.user._id).then(leaver => {
      if (leaver) {
        sendEmail({
          to: ride.creator.email,
          subject: `Participant update: Ride to ${ride.destination}`,
          html: getLeaveRideTemplate(ride.creator.name, leaver.name, ride),
        }).catch(err => console.error("Background email error:", err));
      }
    }).catch(err => console.error("Background user fetch error:", err));
  } catch (error) {
    console.error("Error leaving ride:", error);
    res.status(500).json({ message: "Failed to leave ride" });
  }
};

// Cancel a ride
const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("creator", "name email")
      .populate("participants", "name email");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.creator._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the host can cancel this ride" });
    }

    // Prevent cancelling completed rides
    if (ride.status === "COMPLETED" || new Date(ride.dateTime) < new Date()) {
      return res.status(400).json({ message: "Ride is already completed and cannot be cancelled" });
    }

    ride.status = "CANCELLED";
    await ride.save();

    // Send response immediately
    res.json({ message: "Ride cancelled and participants will be notified" });

    // Notify all participants except the creator asynchronously in the background
    const notificationPromises = ride.participants
      .filter(p => p._id.toString() !== req.user._id.toString())
      .map(participant => 
        sendEmail({
          to: participant.email,
          subject: `Urgent: Ride to ${ride.destination} Cancelled`,
          html: getCancelRideTemplate(participant.name, ride),
        }).catch(err => console.error("Background email error:", err))
      );

    Promise.allSettled(notificationPromises).catch(err => console.error("Background notifications error:", err));
  } catch (error) {
    console.error("Error cancelling ride:", error);
    res.status(500).json({ message: "Failed to cancel ride" });
  }
};

module.exports = {
  createRide,
  getRides,
  getMyRides,
  joinRide,
  leaveRide,
  cancelRide,
};
