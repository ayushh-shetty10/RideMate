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

    // Send response immediately
    res.status(201).json(report);

    // Send notification to admins asynchronously in the background
    Promise.all([
      User.findById(req.user._id),
      User.findById(reportedUserId)
    ]).then(([reporter, reportedUser]) => {
      const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : [];
      
      if (adminEmails.length > 0 && reporter && reportedUser) {
        const emailHtml = getReportAdminTemplate(reporter, reportedUser, report);
        
        // Send to all admins
        const emailPromises = adminEmails.map(email => 
          sendEmail({
            to: email.trim(),
            subject: `⚠️ URGENT: New Safety Report on RideMate`,
            html: emailHtml,
          }).catch(err => console.error("Background admin email error:", err))
        );
        
        Promise.allSettled(emailPromises).catch(err => console.error("Background admin notifications error:", err));
      }
    }).catch(err => console.error("Background report users fetch error:", err));
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
