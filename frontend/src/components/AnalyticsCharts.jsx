import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { TrendingUp, BarChart3, Clock, CheckCircle2, AlertCircle } from "lucide-react";

// Custom Dark Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-md text-xs font-mono">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-indigo-400 font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Latency: {payload[0].value} ms
        </p>
        {payload[0].payload.status && (
          <p className={`mt-0.5 font-semibold ${payload[0].payload.status < 300 ? 'text-emerald-400' : 'text-rose-400'}`}>
            Status: {payload[0].payload.status}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const AnalyticsCharts = ({ logs = [] }) => {
  if (logs.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 my-4">
        <TrendingUp className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-300">No chart telemetry available</p>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute mock API calls to generate latency and throughput graph trends
        </p>
      </div>
    );
  }

  // 1. Prepare Latency Trend Data (Reversed to chronological order)
  const latencyData = [...logs].reverse().map((log) => {
    const time = new Date(log.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return {
      time,
      latency: log.responseTime || 0,
      status: log.statusCode || 200,
      path: log.path,
    };
  });

  // 2. Prepare Status Distribution Data
  let successCount = 0;
  let clientErrorCount = 0;
  let serverErrorCount = 0;

  logs.forEach((log) => {
    if (log.statusCode >= 200 && log.statusCode < 300) successCount++;
    else if (log.statusCode >= 400 && log.statusCode < 500) clientErrorCount++;
    else if (log.statusCode >= 500) serverErrorCount++;
  });

  const statusDistribution = [
    { name: "2xx Success", count: successCount, color: "#10b981" },
    { name: "4xx Client Errors", count: clientErrorCount, color: "#f59e0b" },
    { name: "5xx Server Errors", count: serverErrorCount, color: "#f43f5e" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Left Chart: Response Latency Over Time (Area Chart) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Response Latency Trend</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Last {logs.length} Requests</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="ms" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="latency"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#latencyGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Status Code Distribution (Bar Chart) */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Status Breakdown</h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">{logs.length} Total</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistribution} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                          <p className="font-bold text-white">{payload[0].payload.name}</p>
                          <p className="text-slate-400">Count: {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsCharts;