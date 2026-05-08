const User = require("../models/User");

const completeProfile = async (req, res) => {
  try {
    const { department, studyYear, usn } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.department = department || user.department;
      user.studyYear = studyYear || user.studyYear;
      user.usn = usn || user.usn;
      user.isProfileComplete = true;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        department: updatedUser.department,
        studyYear: updatedUser.studyYear,
        usn: updatedUser.usn,
        isProfileComplete: updatedUser.isProfileComplete,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-googleId");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { completeProfile, getMe, getUserProfile };
