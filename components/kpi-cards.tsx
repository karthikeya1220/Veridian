"use client";

import { useStore } from "@/lib/store";
import {
  TrendingUp,
  Building2,
  Sparkles,
  ListFilter,
  BookmarkCheck,
  Target,
} from "lucide-react";

export function KpiCards() {
  const { companies, lists, notes } = useStore();

  // Compute KPIs
  const totalCompanies = companies.length;
  const avgScore = Math.round(
    companies.reduce((s, c) => s + c.thesisScore, 0) / companies.length
  );
  const enrichedCount = companies.filter((c) => c.enriched).length;
  const highSignal = companies.filter((c) => c.thesisScore >= 80).length;
  const totalLists = lists.length;
  const totalNotes = notes.length;

  const kpiCards = [
    {
      label: "Total Companies",
      value: totalCompanies,
      icon: Building2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      trend: "+3 this week",
      trendUp: true,
    },
    {
      label: "Avg Thesis Score",
      value: `${avgScore}`,
      suffix: "/100",
      icon: Target,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      trend: "across all companies",
      trendUp: null,
    },
    {
      label: "AI Enriched",
      value: enrichedCount,
      icon: Sparkles,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
      trend: `${totalCompanies - enrichedCount} remaining`,
      trendUp: null,
    },
    {
      label: "High Signal",
      value: highSignal,
      icon: TrendingUp,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      trend: "score ≥ 80",
      trendUp: true,
    },
    {
      label: "Watchlists",
      value: totalLists,
      icon: ListFilter,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      trend: "active lists",
      trendUp: null,
    },
    {
      label: "Notes Written",
      value: totalNotes,
      icon: BookmarkCheck,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
      trend: "across all companies",
      trendUp: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {kpiCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all duration-200 hover:border-gray-200"
          >
            {/* Header: Label + Icon */}
            <div className="flex items-start justify-between mb-3">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {card.label}
              </label>
              <div
                className={`${card.iconBg} w-9 h-9 rounded-lg flex items-center justify-center`}
              >
                <Icon size={16} className={card.iconColor} />
              </div>
            </div>

            {/* Value Row */}
            <div className="flex items-baseline gap-0.5 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {card.value}
              </span>
              {card.suffix && (
                <span className="text-lg text-gray-400 ml-0.5">
                  {card.suffix}
                </span>
              )}
            </div>

            {/* Trend Row */}
            <div className="flex items-center gap-1">
              {card.trendUp === true && (
                <TrendingUp size={11} className="text-emerald-500" />
              )}
              <span
                className={`text-xs ${
                  card.trendUp === true
                    ? "text-emerald-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
