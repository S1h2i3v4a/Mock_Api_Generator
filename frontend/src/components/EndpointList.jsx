import React, { useState } from "react";
import {
  Copy,
  Check,
  Play,
  Edit2,
  Trash2,
  Clock,
  Layers,
  Power,
  Search,
  Filter,
  X,
} from "lucide-react";
import { BASE_URL } from "../services/api";

const methodColors = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  PATCH: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  DELETE: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

const statusColors = {
  2: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  3: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  4: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  5: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const FILTER_METHODS = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

const EndpointList = ({
  endpoints = [],
  loading = false,
  onEdit,
  onDelete,
  onTest,
  onToggleActive,
  onOpenCreateModal,
}) => {
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("ALL");

  const handleCopy = (endpoint) => {
    const fullUrl = `${BASE_URL}/mock${endpoint.path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(endpoint._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Multi-Criteria Filtering (Search + Method)
  const filteredEndpoints = endpoints.filter((ep) => {
    // 1. Method Filter
    if (selectedMethod !== "ALL" && ep.method !== selectedMethod) {
      return false;
    }

    // 2. Search Query (matches Path or Name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPath = ep.path?.toLowerCase().includes(q);
      const matchName = ep.name?.toLowerCase().includes(q);
      if (!matchPath && !matchName) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (endpoints.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 my-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          No Mock Endpoints Created Yet
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Create your first custom mock REST API with instant status codes,
          simulated delays, and custom response bodies.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          Create First Endpoint
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar & Method Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80">
        {/* Search Input */}
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by path (/api/v1/...) or name..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Method Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {FILTER_METHODS.map((m) => {
            const isSelected = selectedMethod === m;
            return (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/30"
                    : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Results Counter */}
      {(searchQuery || selectedMethod !== "ALL") && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-400">
          <span>
            Showing{" "}
            <strong className="text-white">{filteredEndpoints.length}</strong>{" "}
            of {endpoints.length} endpoints
          </span>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedMethod("ALL");
            }}
            className="text-indigo-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Filtered Endpoints List */}
      {filteredEndpoints.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/30 border border-slate-800/60">
          <Filter className="w-7 h-7 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-300">
            No matching mock endpoints
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Try searching with a different path or method filter
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredEndpoints.map((ep) => {
            const methodClass =
              methodColors[ep.method] ||
              "bg-slate-500/10 text-slate-400 border-slate-500/30";
            const statusFirstDigit = Math.floor(ep.statusCode / 100);
            const statusBadgeClass =
              statusColors[statusFirstDigit] ||
              "text-slate-400 bg-slate-500/10";
            const fullUrl = `${BASE_URL}/mock${ep.path}`;

            return (
              <div
                key={ep._id}
                className={`group relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.005] ${
                  ep.isActive
                    ? "border-slate-800/80 hover:border-slate-700"
                    : "border-slate-800/40 opacity-60"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Method Badge & Path Details */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider border ${methodClass}`}
                      >
                        {ep.method}
                      </span>

                      <h4 className="text-base font-bold text-white font-mono truncate">
                        {ep.path}
                      </h4>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusBadgeClass}`}
                      >
                        {ep.statusCode}
                      </span>

                      {ep.delay > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-medium">
                          <Clock className="w-3 h-3" />
                          {ep.delay}ms
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-300">
                        {ep.name}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500 font-mono text-[11px] truncate max-w-xs sm:max-w-md">
                        {fullUrl}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Interactive Action Buttons */}
                  <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                    {/* 1-Click Copy URL Button */}
                    <button
                      onClick={() => handleCopy(ep)}
                      title="Copy Mock URL"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        copiedId === ep._id
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {copiedId === ep._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    {/* Quick Test Button */}
                    <button
                      onClick={() => onTest(ep)}
                      title="Open in Test Studio"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Test</span>
                    </button>

                    {/* Active/Inactive Toggle */}
                    <button
                      onClick={() => onToggleActive(ep)}
                      title={ep.isActive ? "Deactivate Mock" : "Activate Mock"}
                      className={`p-1.5 rounded-lg border transition-all ${
                        ep.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300"
                      }`}
                    >
                      <Power className="w-4 h-4" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(ep)}
                      title="Edit Mock Config"
                      className="p-1.5 rounded-lg bg-slate-800/70 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(ep._id)}
                      title="Delete Mock API"
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EndpointList;
