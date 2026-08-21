import React from "react";
import { Layers, Activity, Zap, CheckCircle2, TrendingUp } from "lucide-react";

const StatCards = ({ stats = {}, loading = false }) => {
  const {
    totalEndpoints = 0,
    totalRequests = 0,
    avgLatency = 0,
    successRate = 100,
  } = stats;

  const cardConfig = [
    {
      id: "endpoints",
      title: "Active Mock APIs",
      value: totalEndpoints,
      unit: "endpoints",
      icon: Layers,
      color: "from-indigo-500/20 to-purple-500/5",
      borderColor: "border-indigo-500/30",
      textColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    {
      id: "requests",
      title: "Total API Traffic",
      value: totalRequests,
      unit: "requests",
      icon: Activity,
      color: "from-blue-500/20 to-cyan-500/5",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      id: "latency",
      title: "Average Latency",
      value: `${avgLatency}`,
      unit: "ms roundtrip",
      icon: Zap,
      color: "from-amber-500/20 to-orange-500/5",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      id: "success",
      title: "Success Rate",
      value: `${successRate}%`,
      unit: "2xx responses",
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/5",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
      {cardConfig.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} bg-slate-900/60 backdrop-blur-xl border ${card.borderColor} p-5 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group`}
          >
            {/* Top Row: Title and Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`p-2 rounded-xl border ${card.iconBg} group-hover:rotate-6 transition-transform duration-300`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle Row: Big Stat Value */}
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {loading ? (
                  <span className="inline-block w-16 h-8 bg-slate-800 animate-pulse rounded-lg"></span>
                ) : (
                  card.value
                )}
              </h3>
              <span className="text-xs font-medium text-slate-500">
                {card.unit}
              </span>
            </div>

            {/* Bottom Subtle Indicator */}
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Live MongoDB Aggregation</span>
            </div>

            {/* Decorative Glow Orb in corner */}
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors"></div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
