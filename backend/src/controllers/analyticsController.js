const Log = require("../models/Log");
const Endpoint = require("../models/Endpoint");

// @desc    Get Overall Analytics KPI Summary (Total Requests, Latency, Success Rate)
// @route   GET /api/v1/analytics/summary
const getOverviewStats = async (req, res, next) => {
  try {
    const totalEndpoints = await Endpoint.countDocuments();
    const totalRequests = await Log.countDocuments();

    // Agar abhi tak koi request nahi aayi hai
    if (totalRequests === 0) {
      return res.status(200).json({
        status: "success",
        data: {
          totalRequests: 0,
          totalEndpoints,
          avgLatency: 0,
          successRate: 100,
        },
      });
    }

    // MongoDB Aggregation Pipeline for fast calculation
    const stats = await Log.aggregate([
      {
        $group: {
          _id: null,
          avgLatency: { $avg: "$responseTime" },
          successCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$statusCode", 200] },
                    { $lt: ["$statusCode", 300] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const avgLatency = Math.round(stats[0]?.avgLatency || 0);
    const successCount = stats[0]?.successCount || 0;
    const successRate = Number(
      ((successCount / totalRequests) * 100).toFixed(2)
    );

    res.status(200).json({
      status: "success",
      data: {
        totalRequests,
        totalEndpoints,
        avgLatency,
        successRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recent Request Telemetry Logs (Paginated list for Live Dashboard Table)
// @route   GET /api/v1/analytics/logs
const getRecentLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const logs = await Log.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("endpointId", "name path method");

    res.status(200).json({
      status: "success",
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewStats,
  getRecentLogs,
};