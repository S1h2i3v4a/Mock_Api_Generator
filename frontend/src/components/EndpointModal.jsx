import React, { useState, useEffect } from "react";
import { X, Code, Clock, Sliders, AlertCircle, Check, Plus, Trash2 } from "lucide-react";

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const STATUS_PRESETS = [
  { code: 200, label: "200 OK" },
  { code: 201, label: "201 Created" },
  { code: 400, label: "400 Bad Request" },
  { code: 401, label: "401 Unauthorized" },
  { code: 404, label: "404 Not Found" },
  { code: 500, label: "500 Server Error" },
];

const EndpointModal = ({ isOpen, onClose, onSave, initialData = null, isSaving = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    path: "",
    method: "GET",
    statusCode: 200,
    delay: 0,
    responseBody: '{\n  "status": "success",\n  "message": "Mock API Response"\n}',
    headers: [],
  });

  const [jsonError, setJsonError] = useState(null);

  useEffect(() => {
    if (initialData) {
      // Edit Mode
      let formattedBody = "{}";
      try {
        formattedBody =
          typeof initialData.responseBody === "object"
            ? JSON.stringify(initialData.responseBody, null, 2)
            : initialData.responseBody || "{}";
      } catch (e) {
        formattedBody = "{}";
      }

      // Format Headers Map/Object into Array
      let headerArray = [];
      if (initialData.headers) {
        if (initialData.headers instanceof Map) {
          initialData.headers.forEach((value, key) => headerArray.push({ key, value }));
        } else if (typeof initialData.headers === "object") {
          headerArray = Object.entries(initialData.headers).map(([key, value]) => ({ key, value }));
        }
      }

      setFormData({
        name: initialData.name || "",
        path: initialData.path || "",
        method: initialData.method || "GET",
        statusCode: initialData.statusCode || 200,
        delay: initialData.delay || 0,
        responseBody: formattedBody,
        headers: headerArray,
      });
    } else {
      // Create Mode (Reset to defaults)
      setFormData({
        name: "",
        path: "",
        method: "GET",
        statusCode: 200,
        delay: 0,
        responseBody: '{\n  "status": "success",\n  "data": {\n    "message": "Hello from Mock-Craft!"\n  }\n}',
        headers: [{ key: "X-Powered-By", value: "Mock-Craft Engine" }],
      });
    }
    setJsonError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddHeader = () => {
    setFormData((prev) => ({
      ...prev,
      headers: [...prev.headers, { key: "", value: "" }],
    }));
  };

  const handleHeaderChange = (index, field, val) => {
    const updated = [...formData.headers];
    updated[index][field] = val;
    setFormData((prev) => ({ ...prev, headers: updated }));
  };

  const handleRemoveHeader = (index) => {
    setFormData((prev) => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Validate JSON
    let parsedBody = {};
    try {
      parsedBody = JSON.parse(formData.responseBody);
      setJsonError(null);
    } catch (err) {
      setJsonError(`Invalid JSON: ${err.message}`);
      return;
    }

    // 2. Format Headers Object
    const headersObj = {};
    formData.headers.forEach((h) => {
      if (h.key.trim()) {
        headersObj[h.key.trim()] = h.value.trim();
      }
    });

    // 3. Format Payload
    const payload = {
      name: formData.name.trim(),
      path: formData.path.trim().startsWith("/") ? formData.path.trim() : `/${formData.path.trim()}`,
      method: formData.method.toUpperCase(),
      statusCode: Number(formData.statusCode),
      delay: Number(formData.delay),
      responseBody: parsedBody,
      headers: headersObj,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div>
            <h3 className="text-lg font-bold text-white">
              {initialData ? "Edit Mock Endpoint" : "Create New Mock Endpoint"}
            </h3>
            <p className="text-xs text-slate-400">Configure route, latency, and custom JSON payload</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Row 1: Name & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Endpoint Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Get User Profile"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">HTTP Method</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m} className="bg-slate-900">
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: URL Path */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">URL Endpoint Path</label>
            <div className="flex items-center rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <span className="px-3.5 py-2.5 text-xs font-mono text-slate-500 bg-slate-900/80 border-r border-slate-800 select-none">
                /mock
              </span>
              <input
                type="text"
                required
                placeholder="/api/v1/users"
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-transparent text-sm font-mono text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Row 3: Status Code Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Response Status Code</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STATUS_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.code}
                  onClick={() => setFormData({ ...formData, statusCode: preset.code })}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    formData.statusCode === preset.code
                      ? "bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-sm"
                      : "bg-slate-950/40 text-slate-400 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {preset.code}
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Simulated Latency (Delay Slider) */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Network Delay Simulation:
              </span>
              <span className="font-mono font-bold text-amber-400">{formData.delay} ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="50"
              value={formData.delay}
              onChange={(e) => setFormData({ ...formData, delay: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0ms (Instant)</span>
              <span>1000ms</span>
              <span>2500ms</span>
              <span>5000ms (Slow 3G)</span>
            </div>
          </div>

          {/* Row 5: JSON Response Body */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-indigo-400" />
                Response Body (JSON)
              </label>
              <button
                type="button"
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(formData.responseBody), null, 2);
                    setFormData({ ...formData, responseBody: formatted });
                    setJsonError(null);
                  } catch (e) {
                    setJsonError("Cannot format: Invalid JSON");
                  }
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Beautify JSON
              </button>
            </div>

            <textarea
              rows="6"
              required
              value={formData.responseBody}
              onChange={(e) => {
                setFormData({ ...formData, responseBody: e.target.value });
                setJsonError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />

            {jsonError && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{jsonError}</span>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSaving ? "Saving..." : initialData ? "Update Endpoint" : "Create Endpoint"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EndpointModal;