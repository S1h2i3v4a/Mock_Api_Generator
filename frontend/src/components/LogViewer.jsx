import React, { useState } from "react";
import {
  Activity,
  Clock,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Monitor,
  Layers,
} from "lucide-react";

const methodColors = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  PATCH: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  DELETE: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

const LogViewer = ({ logs = [], loading = false, onRefresh }) => {
  const [filter, setFilter] = useState("all"); // 'all' | 'success' | 'error'
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter((log) => {
    // 1. Status Filter
    if (filter === "success" && (log.statusCode < 200 || log.statusCode >= 300)) return false;
    if (filter === "error" && log.statusCode < 400) return false;

    // 2. Search Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchPath = log.path?.toLowerCase().includes(q);
      const matchMethod = log.method?.toLowerCase().includes(q);
      const matchStatus = String(log.statusCode).includes(q);
      if (!matchPath && !matchMethod && !matchStatus) return false;
    }

    return true;
  });

  const formatTimestamp = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Real-Time Telemetry Feed</h3>
            <p className="text-xs text-slate-400">Live incoming request logs & latency tracking</p>
          </div>
        </div>

        {/* Filter Pills & Refresh Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === "all" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilter("success")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === "success" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-emerald-400"
              }`}
            >
              2xx Success
            </button>
            <button
              onClick={() => setFilter("error")}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === "error" ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-rose-400"
              }`}
            >
              4xx / 5xx Errors
            </button>
          </div>

          {/* Manual Refresh Trigger */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh Live Logs"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Logs Table / List Container */}
      <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 overflow-hidden shadow-xl">
        
        {loading && logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
            Loading telemetry logs from database...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No telemetry logs found</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Execute mock requests from the Live Tester tab to see incoming traffic logs
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 select-none">
                <tr>
                  <th className="py-3 px-4">Method & Path</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4 hidden md:table-cell">Client IP</th>
                  <th className="py-3 px-4 hidden lg:table-cell">User Agent</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLogs.map((log) => {
                  const methodClass = methodColors[log.method] || "bg-slate-500/10 text-slate-400";
                  const isSuccess = log.statusCode >= 200 && log.statusCode < 300;

                  return (
                    <tr key={log._id} className="hover:bg-slate-800/30 transition-colors group">
                      
                      {/* Method & Path */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${methodClass}`}>
                            {log.method}
                          </span>
                          <span className="font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                            {log.path}
                          </span>
                          {log.endpointId?.name && (
                            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-sans">
                              {log.endpointId.name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                            isSuccess
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {log.statusCode}
                        </span>
                      </td>

                      {/* Response Latency */}
                      <td className="py-3 px-4 text-slate-300">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {log.responseTime} ms
                        </span>
                      </td>

                      {/* Client IP */}
                      <td className="py-3 px-4 hidden md:table-cell text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-500" />
                          {log.ip || "127.0.0.1"}
                        </span>
                      </td>

                      {/* User Agent */}
                      <td className="py-3 px-4 hidden lg:table-cell text-slate-500 text-[11px] max-w-xs truncate font-sans">
                        {log.userAgent || "Unknown"}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                        {formatTimestamp(log.createdAt)}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default LogViewer;