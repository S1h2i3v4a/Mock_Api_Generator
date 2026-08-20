const express = require("express");
const {
  getOverviewStats,
  getRecentLogs,
} = require("../controllers/analyticsController");

const router = express.Router();

// GET /api/v1/analytics/summary
router.get("/summary", getOverviewStats);

// GET /api/v1/analytics/logs
router.get("/logs", getRecentLogs);

module.exports = router;