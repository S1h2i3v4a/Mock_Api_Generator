import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL || "https://mock-api-generator-1-xys4.onrender.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15s timeout
});

// Health Check API
export const checkHealth = async () => {
  const response = await apiClient.get("/api/v1/health");
  return response.data;
};

// 1. Endpoint Management CRUD APIs
export const getEndpoints = async () => {
  const response = await apiClient.get("/api/v1/endpoints");
  return response.data;
};

export const getEndpointById = async (id) => {
  const response = await apiClient.get(`/api/v1/endpoints/${id}`);
  return response.data;
};

export const createEndpoint = async (endpointData) => {
  const response = await apiClient.post("/api/v1/endpoints", endpointData);
  return response.data;
};

export const updateEndpoint = async (id, endpointData) => {
  const response = await apiClient.put(`/api/v1/endpoints/${id}`, endpointData);
  return response.data;
};

export const deleteEndpoint = async (id) => {
  const response = await apiClient.delete(`/api/v1/endpoints/${id}`);
  return response.data;
};

// 2. Real-time Analytics & Telemetry APIs
export const getAnalyticsSummary = async () => {
  const response = await apiClient.get("/api/v1/analytics/summary");
  return response.data;
};

export const getRecentLogs = async (limit = 20) => {
  const response = await apiClient.get(`/api/v1/analytics/logs?limit=${limit}`);
  return response.data;
};

// 3. Dynamic Mock Endpoint Live Tester
export const executeMockRequest = async (method, path, body = null, customHeaders = {}) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}/mock${cleanPath}`;

  const config = {
    method: method.toUpperCase(),
    url: url,
    headers: { ...customHeaders },
    validateStatus: () => true, // Don't throw on 404/500 so we can inspect mock response
  };

  if (body && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    config.data = body;
  }

  const startTime = Date.now();
  const response = await axios(config);
  const latency = Date.now() - startTime;

  return {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    data: response.data,
    latency,
  };
};

export default apiClient;