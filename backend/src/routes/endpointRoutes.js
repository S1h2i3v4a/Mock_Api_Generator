const express = require("express");
const {
  createEndpoint,
  getAllEndpoints,
  getEndpointById,
  updateEndpoint,
  deleteEndpoint,
} = require("../controllers/endpointController");

const router = express.Router();

// Routes for /api/v1/endpoints
router.route("/").post(createEndpoint).get(getAllEndpoints);

// Routes for /api/v1/endpoints/:id
router
  .route("/:id")
  .get(getEndpointById)
  .put(updateEndpoint)
  .delete(deleteEndpoint);

module.exports = router;