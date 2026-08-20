const express = require("express");
const { checkHealth } = require("../controllers/healthController");

const router = express.Router();

// GET /api/v1/health
router.get("/", checkHealth);
console.log("Health route is set up and ready to handle requests.");

module.exports = router;
