const checkHealth = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Mock-Craft Engine API is healthy and operational!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

module.exports = {
  checkHealth,
};
