const Report = require("../models/Report");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");
const { getReportAdminTemplate } = require("../utils/emailTemplates");

// Create a new report
const createReport = async (req, res) => {
  const { reportedUser: reportedUserId, ride, reason, description } = req.body;

  try {
    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: reportedUserId,
      ride,
      reason,
      description,
    });

    // Send notification to admins
    const reporter = await User.findById(req.user._id);
    const reportedUser = await User.findById(reportedUserId);
    
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : [];
    
    if (adminEmails.length > 0 && reporter && reportedUser) {
      const emailHtml = getReportAdminTemplate(reporter, reportedUser, report);
      
      // Send to all admins
      for (const email of adminEmails) {
        await sendEmail({
          to: email.trim(),
          subject: `⚠️ URGENT: New Safety Report on RideMate`,
          html: emailHtml,
        });
      }
    }

    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(400).json({ message: "Failed to submit report" });
  }
};

// Get all reports (Admin only)
const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email profilePicture")
      .populate("reportedUser", "name email profilePicture")
      .populate("ride", "from destination dateTime")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// Update report status (Admin only)
const updateReportStatus = async (req, res) => {
  const { status, comment } = req.body;

  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    report.statusHistory.push({
      status,
      updatedBy: req.user._id,
      comment,
    });

    await report.save();
    res.json(report);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(400).json({ message: "Failed to update report status" });
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
};
