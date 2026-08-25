const mongoose = require("mongoose");

const checkHealth = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  }[dbState] || "Unknown";

  res.status(200).json({
    status: "success",
    message: "Mock-Craft Engine API is healthy and operational!",
    database: {
      status: dbStatus,
      connected: dbState === 1,
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

module.exports = {
  checkHealth,
};
