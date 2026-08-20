const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    endpointId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Endpoint",
      default: null,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    method: {
      type: String,
      required: true,
      uppercase: true,
    },
    statusCode: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true, // In milliseconds
    },
    ip: {
      type: String,
      default: "Unknown",
    },
    userAgent: {
      type: String,
      default: "Unknown",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Telemetry logs are immutable (never updated)
  }
);

// Performance Indexes for fast chart queries
logSchema.index({ createdAt: -1 });
logSchema.index({ endpointId: 1, createdAt: -1 });

const Log = mongoose.model("Log", logSchema);

module.exports = Log;