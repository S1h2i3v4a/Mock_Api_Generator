const express = require("express");
const { handleMockRequest } = require("../controllers/mockController");

const router = express.Router();

// Wildcard Catch-All: Saare HTTP methods aur sub-paths ko catch karta hai
router.all("/*splat", handleMockRequest);

module.exports = router;