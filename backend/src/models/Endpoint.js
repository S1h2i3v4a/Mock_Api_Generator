const mongoose = require("mongoose");

const endpointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Endpoint name is required"],
      trim: true,
    },
    path: {
      type: String,
      required: [true, "Endpoint path is required"],
      trim: true,
    },
    method: {
      type: String,
      required: [true, "HTTP method is required"],
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      uppercase: true,
    },
    statusCode: {
      type: Number,
      required: true,
      default: 200,
      min: [100, "Status code must be at least 100"],
      max: [599, "Status code cannot exceed 599"],
    },
    responseBody: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    delay: {
      type: Number,
      default: 0, // In milliseconds (simulated latency)
      min: [0, "Delay cannot be negative"],
      max: [10000, "Delay cannot exceed 10000ms (10 seconds)"],
    },
    headers: {
      type: Map,
      of: String,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Compound Index: Path aur Method ka combination unique hona chahiye
endpointSchema.index({ path: 1, method: 1 }, { unique: true });

const Endpoint = mongoose.model("Endpoint", endpointSchema);

module.exports = Endpoint;