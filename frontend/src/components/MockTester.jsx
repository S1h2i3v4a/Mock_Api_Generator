import React, { useState, useEffect } from "react";
import {
  Play,
  Send,
  Clock,
  Check,
  Copy,
  Code2,
  AlertCircle,
  Terminal,
  Zap,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { executeMockRequest } from "../services/api";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const methodColors = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  PATCH: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  DELETE: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

const MockTester = ({ initialEndpoint = null, endpoints = [] }) => {
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("/api/v1/users");
  const [requestBody, setRequestBody] = useState('{\n  "test": true\n}');
  const [activeTab, setActiveTab] = useState("body"); // 'body' | 'headers'
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialEndpoint) {
      setMethod(initialEndpoint.method || "GET");
      setPath(initialEndpoint.path || "/api/v1/users");
    } else if (endpoints.length > 0 && !path) {
      setMethod(endpoints[0].method);
      setPath(endpoints[0].path);
    }
  }, [initialEndpoint, endpoints]);

  const handleSend = async () => {
    if (!path.trim()) return;

    setLoading(true);
    setResponse(null);

    let parsedBody = null;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        parsedBody = JSON.parse(requestBody);
      } catch (e) {
        parsedBody = requestBody; // fallback to raw string
      }
    }

    try {
      const result = await executeMockRequest(method, path.trim(), parsedBody);
      setResponse(result);
    } catch (err) {
      setResponse({
        status: err.response?.status || 500,
        statusText: err.response?.statusText || "Request Failed",
        data: err.response?.data || { error: err.message },
        latency: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!response?.data) return;
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Live Mock Testing Studio</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test and inspect your dynamic mock responses directly in the browser
          </p>
        </div>

        {/* Quick Select Preset Endpoint */}
        {endpoints.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Load Mock:</span>
            <select
              onChange={(e) => {
                const selected = endpoints.find((ep) => ep._id === e.target.value);
                if (selected) {
                  setMethod(selected.method);
                  setPath(selected.path);
                }
              }}
              value=""
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="" disabled>Select an endpoint...</option>
              {endpoints.map((ep) => (
                <option key={ep._id} value={ep._id}>
                  [{ep.method}] {ep.path} ({ep.name})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Request Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl focus-within:border-indigo-500/80 transition-colors">
        
        {/* Method Selector */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`px-3.5 py-2.5 rounded-xl font-bold text-xs border focus:outline-none transition-colors ${
            methodColors[method] || "bg-slate-800 text-white"
          }`}
        >
          {HTTP_METHODS.map((m) => (
            <option key={m} value={m} className="bg-slate-900 text-white">
              {m}
            </option>
          ))}
        </select>

        {/* URL Input Bar */}
        <div className="flex-1 flex items-center rounded-xl bg-slate-950/80 border border-slate-800/80 px-3.5 py-2">
          <span className="text-xs font-mono text-slate-500 select-none mr-1.5">
            http://localhost:5000/mock
          </span>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="/api/v1/users"
            className="flex-1 bg-transparent text-xs font-mono text-white focus:outline-none placeholder:text-slate-600"
          />
        </div>

        {/* Send Request Button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Executing...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Request Payload (Left) & Live Response Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: Request Body Configuration */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Request Payload Body (JSON)
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              {["POST", "PUT", "PATCH"].includes(method) ? "Active for " + method : "Ignored for GET/DELETE"}
            </span>
          </div>

          <textarea
            rows="10"
            disabled={!["POST", "PUT", "PATCH"].includes(method)}
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            placeholder="{\n  // Enter JSON Request Body here\n}"
            className="w-full p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800/80 focus:outline-none focus:border-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          />
        </div>

        {/* Right Column: Live Response Inspector */}
        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-4 space-y-3 flex flex-col justify-between">
          <div>
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Response Inspector
              </span>

              {response && (
                <button
                  onClick={handleCopyResponse}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Body</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Response Meta Stats Bar */}
            {response && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-3 text-xs">
                {/* Status Badge */}
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                    response.status >= 200 && response.status < 300
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {response.status} {response.statusText}
                </span>

                {/* Roundtrip Latency */}
                <span className="flex items-center gap-1 text-slate-400 font-mono text-xs">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {response.latency} ms
                </span>
              </div>
            )}

            {/* Response Body Text Display */}
            {response ? (
              <pre className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800/80 overflow-x-auto max-h-[260px] leading-relaxed">
                <code>{JSON.stringify(response.data, null, 2)}</code>
              </pre>
            ) : (
              <div className="h-[260px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800/80 rounded-xl">
                <Play className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">Ready to test!</p>
                <p className="text-[11px] text-slate-600">
                  Click "Send Request" to execute against the Mock Engine
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default MockTester;