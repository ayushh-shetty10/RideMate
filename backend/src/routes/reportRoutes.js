const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { 
  createReport, 
  getReports, 
  updateReportStatus 
} = require("../controllers/reportController");

router.post("/", protect, createReport);
router.get("/", protect, adminOnly, getReports);
router.patch("/:id/status", protect, adminOnly, updateReportStatus);

module.exports = router;
