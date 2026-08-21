import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import EndpointList from "./components/EndpointList";
import EndpointModal from "./components/EndpointModal";
import MockTester from "./components/MockTester";
import LogViewer from "./components/LogViewer";
import AnalyticsCharts from "./components/AnalyticsCharts";
import {
  getEndpoints,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  getAnalyticsSummary,
  getRecentLogs,
} from "./services/api";
import axios from "axios";

function App() {
  const [activeTab, setActiveTab] = useState("endpoints");
  const [endpoints, setEndpoints] = useState([]);
  const [stats, setStats] = useState({
    totalEndpoints: 0,
    totalRequests: 0,
    avgLatency: 0,
    successRate: 100,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendLive, setIsBackendLive] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Quick Test Prefill State
  const [testingEndpoint, setTestingEndpoint] = useState(null);

  // 1. Fetch All Data from Backend
  const fetchDashboardData = async () => {
    try {
      await axios.get("http://localhost:5000/api/v1/health", { timeout: 3000 });
      setIsBackendLive(true);

      const [endpointsRes, statsRes, logsRes] = await Promise.all([
        getEndpoints().catch(() => ({ data: [] })),
        getAnalyticsSummary().catch(() => ({ data: {} })),
        getRecentLogs(30).catch(() => ({ data: [] })),
      ]);

      setEndpoints(endpointsRes.data || []);
      setStats(statsRes.data || {});
      setLogs(logsRes.data || []);
    } catch (err) {
      setIsBackendLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. Handle Create or Update Endpoint
  const handleSaveEndpoint = async (payload) => {
    setIsSaving(true);
    try {
      if (editingEndpoint) {
        await updateEndpoint(editingEndpoint._id, payload);
      } else {
        await createEndpoint(payload);
      }
      setIsModalOpen(false);
      setEditingEndpoint(null);
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save endpoint");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Handle Delete Endpoint
  const handleDeleteEndpoint = async (id) => {
    if (window.confirm("Are you sure you want to delete this mock endpoint?")) {
      try {
        await deleteEndpoint(id);
        await fetchDashboardData();
      } catch (err) {
        alert("Failed to delete endpoint");
      }
    }
  };

  // 4. Handle Toggle Active Status
  const handleToggleActive = async (endpoint) => {
    try {
      await updateEndpoint(endpoint._id, { isActive: !endpoint.isActive });
      await fetchDashboardData();
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  // 5. Handle Quick Test Action
  const handleQuickTest = (endpoint) => {
    setTestingEndpoint(endpoint);
    setActiveTab("tester");
  };

  // 6. Handle Client-Side Export JSON
  const handleExportJSON = () => {
    if (endpoints.length === 0) {
      alert("No endpoints available to export!");
      return;
    }
    const cleanData = endpoints.map(
      ({ name, path, method, statusCode, delay, responseBody, headers }) => ({
        name,
        path,
        method,
        statusCode,
        delay,
        responseBody,
        headers,
      }),
    );

    const blob = new Blob([JSON.stringify(cleanData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mockcraft-endpoints-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 7. Handle Client-Side Import JSON
  const handleImportJSON = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (!Array.isArray(importedData)) {
          throw new Error(
            "Invalid format: JSON file must contain an array of endpoints.",
          );
        }

        let successCount = 0;
        for (const ep of importedData) {
          if (ep.path && ep.method) {
            try {
              await createEndpoint(ep);
              successCount++;
            } catch (err) {
              console.error("Failed to import endpoint:", ep.path);
            }
          }
        }

        alert(`Successfully imported ${successCount} mock endpoints!`);
        await fetchDashboardData();
      } catch (err) {
        alert(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => {
          setEditingEndpoint(null);
          setIsModalOpen(true);
        }}
        isBackendLive={isBackendLive}
        onExport={handleExportJSON}
        onImport={handleImportJSON}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {/* Backend Down Alert Banner */}
        {!isBackendLive && !loading && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>
                <strong>Backend Offline:</strong> Ensure your Express server is
                running on{" "}
                <code className="bg-rose-950/60 px-1.5 py-0.5 rounded text-rose-200">
                  http://localhost:5000
                </code>
              </span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 font-semibold"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* TAB 1: Mock Endpoints Management */}
        {activeTab === "endpoints" && (
          <div className="space-y-6">
            <StatCards stats={stats} loading={loading} />

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">
                  Configured Mock APIs
                </h2>
                <p className="text-xs text-slate-400">
                  All dynamic mock routes currently registered in MongoDB
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                {endpoints.length} Active Endpoints
              </span>
            </div>

            <EndpointList
              endpoints={endpoints}
              loading={loading}
              onEdit={(ep) => {
                setEditingEndpoint(ep);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteEndpoint}
              onTest={handleQuickTest}
              onToggleActive={handleToggleActive}
              onOpenCreateModal={() => {
                setEditingEndpoint(null);
                setIsModalOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 2: Live Mock Testing Studio */}
        {activeTab === "tester" && (
          <MockTester initialEndpoint={testingEndpoint} endpoints={endpoints} />
        )}

        {/* TAB 3: Analytics & Live Telemetry Feed */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <StatCards stats={stats} loading={loading} />
            <AnalyticsCharts logs={logs} />
            <LogViewer
              logs={logs}
              loading={loading}
              onRefresh={fetchDashboardData}
            />
          </div>
        )}
      </main>

      {/* Create / Edit Modal Dialog */}
      <EndpointModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEndpoint(null);
        }}
        onSave={handleSaveEndpoint}
        initialData={editingEndpoint}
        isSaving={isSaving}
      />
    </div>
  );
}

export default App;
