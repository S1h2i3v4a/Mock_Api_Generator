import React, { useRef } from "react";
import {
  Layers,
  Activity,
  Play,
  Plus,
  Server,
  Sparkles,
  Download,
  Upload,
} from "lucide-react";

const Header = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  isBackendLive,
  onExport,
  onImport,
}) => {
  const fileInputRef = useRef(null);

  const navTabs = [
    { id: "endpoints", label: "Mock Endpoints", icon: Layers },
    { id: "tester", label: "Live Tester", icon: Play },
    { id: "analytics", label: "Analytics & Logs", icon: Activity },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Server Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Mock-Craft
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">Dynamic Mock API Generator</p>
            </div>
          </div>

          {/* Live Server Indicator */}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isBackendLive ? "bg-emerald-400" : "bg-rose-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isBackendLive ? "bg-emerald-500" : "bg-rose-500"
                }`}
              ></span>
            </span>
            <span className={isBackendLive ? "text-emerald-400 font-medium" : "text-rose-400 font-medium"}>
              {isBackendLive ? "Backend Live (5000)" : "Backend Offline"}
            </span>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
          
          {/* Nav Tabs */}
          <nav className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800/80">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Export Button */}
          <button
            onClick={onExport}
            title="Export all Mock Endpoints as JSON"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* Import Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Mock Endpoints from JSON"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">Import</span>
          </button>

          {/* Create Endpoint Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Endpoint</span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;