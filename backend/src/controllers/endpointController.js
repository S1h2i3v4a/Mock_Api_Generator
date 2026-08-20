const Endpoint = require("../models/Endpoint");

// @desc    Create a new mock endpoint
// @route   POST /api/v1/endpoints
const createEndpoint = async (req, res, next) => {
  try {
    const { name, path, method, statusCode, responseBody, delay, headers } =
      req.body;

    // Path normalization: ensure leading "/"
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    const newEndpoint = await Endpoint.create({
      name,
      path: normalizedPath,
      method,
      statusCode,
      responseBody,
      delay,
      headers,
    });

    res.status(201).json({
      status: "success",
      message: "Mock endpoint created successfully",
      data: newEndpoint,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: `An endpoint with Method '${req.body.method}' and Path '${req.body.path}' already exists.`,
      });
    }
    next(error);
  }
};

// @desc    Get all mock endpoints
// @route   GET /api/v1/endpoints
const getAllEndpoints = async (req, res, next) => {
  try {
    const endpoints = await Endpoint.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: endpoints.length,
      data: endpoints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single mock endpoint by ID
// @route   GET /api/v1/endpoints/:id
const getEndpointById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const endpoint = await Endpoint.findById(id);

    if (!endpoint) {
      return res.status(404).json({
        status: "fail",
        message: `Mock endpoint not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      status: "success",
      data: endpoint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a mock endpoint
// @route   PUT /api/v1/endpoints/:id
const updateEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Agar path update ho raha hai toh use normalize karo
    if (req.body.path) {
      req.body.path = req.body.path.startsWith("/")
        ? req.body.path
        : `/${req.body.path}`;
    }

    const updatedEndpoint = await Endpoint.findByIdAndUpdate(id, req.body, {
      new: true, // Returns updated document instead of old one
      runValidators: true, // Enforces Mongoose schema validations on update
    });

    if (!updatedEndpoint) {
      return res.status(404).json({
        status: "fail",
        message: `Mock endpoint not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Mock endpoint updated successfully",
      data: updatedEndpoint,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: "fail",
        message: `An endpoint with this Method and Path already exists.`,
      });
    }
    next(error);
  }
};

// @desc    Delete a mock endpoint
// @route   DELETE /api/v1/endpoints/:id
const deleteEndpoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEndpoint = await Endpoint.findByIdAndDelete(id);

    if (!deletedEndpoint) {
      return res.status(404).json({
        status: "fail",
        message: `Mock endpoint not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Mock endpoint deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEndpoint,
  getAllEndpoints,
  getEndpointById,
  updateEndpoint,
  deleteEndpoint,
};