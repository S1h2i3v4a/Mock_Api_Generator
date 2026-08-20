const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  // Jab response client ko successfully deliver ho jaye
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    console.log(
      `[${new Date().toISOString()}] ${method} ${originalUrl} -> Status: ${statusCode} (${duration}ms)`,
    );
  });

  next(); // Express pipeline mein agle middleware ya route par control pass karo
};

module.exports = requestLogger;
