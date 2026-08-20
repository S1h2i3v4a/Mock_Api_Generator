const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const requestLogger = require("./middlewares/loggerMiddleware");
const notFoundHandler = require("./middlewares/notFoundMiddleware");
const errorHandler = require("./middlewares/errorMiddleware");
const healthRoutes = require("./routes/healthRoutes");
const endpointRoutes = require("./routes/endpointRoutes");
const mockRoutes = require("./routes/mockRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();

// 1. Initialize Database Connection
connectDB();

const app = express();

// 2. Core Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Global Request Logger

// 3. Application Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/endpoints", endpointRoutes); // Endpoint Management CRUD
app.use("/api/v1/analytics", analyticsRoutes); // Real-time Analytics & Telemetry
app.use("/mock", mockRoutes); // Dynamic Mock Engine Catch-All

// Root Route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Mock-Craft Engine Backend is Running!",
  });
});

// 4. Fallback 404 Handler (Agar koi route match nahi hua)
app.use(notFoundHandler);

// 5. Global Error Handler (Saari unhandled exceptions ke liye)
app.use(errorHandler);

// 6. Port Configuration & Server Listener
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});