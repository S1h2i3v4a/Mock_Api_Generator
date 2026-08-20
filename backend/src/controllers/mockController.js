const Endpoint = require("../models/Endpoint");
const Log = require("../models/Log");

// Asynchronous Non-blocking Sleep Utility Helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// @desc    Dynamic Mock Request Handler Engine (with Logging, Delay & Headers)
// @route   ALL /mock/*
const handleMockRequest = async (req, res, next) => {
  const startTime = Date.now();
  const method = req.method.toUpperCase();
  const ip = req.ip || req.connection?.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "Unknown";

  let targetPath = req.originalUrl.split("?")[0];
  targetPath = targetPath.replace(/^\/mock/, "");

  if (!targetPath.startsWith("/")) {
    targetPath = `/${targetPath}`;
  }

  try {
    // 1. Query MongoDB for matching configured endpoint
    const endpoint = await Endpoint.findOne({
      path: targetPath,
      method: method,
      isActive: true,
    });

    // 2. If Mock Endpoint Not Found in DB (404 Log & Response)
    if (!endpoint) {
      const responseTime = Date.now() - startTime;

      // Fire-and-forget background log
      Log.create({
        endpointId: null,
        path: targetPath,
        method,
        statusCode: 404,
        responseTime,
        ip,
        userAgent,
      }).catch((err) => console.error("Telemetry Logging Error:", err.message));

      return res.status(404).json({
        status: "fail",
        error: "Mock Endpoint Not Found",
        message: `No active mock configuration found for [${method}] ${targetPath}`,
        help: "Create this endpoint first via POST /api/v1/endpoints or from dashboard",
      });
    }

    // 3. Inject Custom Response Headers
    if (endpoint.headers) {
      if (endpoint.headers instanceof Map) {
        endpoint.headers.forEach((val, key) => {
          res.setHeader(key, val);
        });
      } else if (typeof endpoint.headers === "object") {
        Object.entries(endpoint.headers).forEach(([key, val]) => {
          res.setHeader(key, val);
        });
      }
    }

    // 4. Simulate Network Latency (Delay)
    if (endpoint.delay && endpoint.delay > 0) {
      await sleep(endpoint.delay);
    }

    const responseTime = Date.now() - startTime;

    // 5. Fire-and-forget background telemetry log (Zero latency impact)
    Log.create({
      endpointId: endpoint._id,
      path: targetPath,
      method,
      statusCode: endpoint.statusCode,
      responseTime,
      ip,
      userAgent,
    }).catch((err) => console.error("Telemetry Logging Error:", err.message));

    // 6. Return Configured Status Code & Response Body
    res.status(endpoint.statusCode).json(endpoint.responseBody);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleMockRequest,
};