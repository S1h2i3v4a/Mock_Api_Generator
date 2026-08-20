const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFoundHandler;
