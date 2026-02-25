"use client";

import { Company, Signal } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  AlertCircle,
  Info,
  Zap,
  LucideIcon,
} from "lucide-react";
import { formatDate, formatDateAbsolute, cn } from "@/lib/utils";

interface SignalsTabProps {
  company: Company;
}

export function SignalsTab({ company }: SignalsTabProps) {
  // Generate placeholder signals if no enriched data
  const placeholderSignals: Signal[] = [
    {
      label: "Thesis Alignment",
      value: `Score of ${company.thesisScore}/100 based on sector and stage fit`,
      type: company.thesisScore >= 70 ? "positive" : "neutral",
    },
    {
      label: "Stage Match",
      value: `${company.stage} company — matches fund's target stage`,
      type: "positive",
    },
    {
      label: "Last Activity",
      value: `Signal detected ${formatDate(company.lastSignalDate)}`,
      type: "neutral",
    },
  ];

  const signals = company.enriched?.signals ?? placeholderSignals;

  // Signal type styling helper
  const getSignalStyle = (type: string) => {
    const styles: Record<
      string,
      {
        icon: LucideIcon;
        color: string;
        bg: string;
        border: string;
        badge: string;
      }
    > = {
      positive: {
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-100",
        badge: "bg-green-100 text-green-700",
      },
      neutral: {
        icon: Info,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100",
        badge: "bg-blue-100 text-blue-700",
      },
      warning: {
        icon: AlertCircle,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        badge: "bg-amber-100 text-amber-700",
      },
    };

    return styles[type] || styles.neutral;
  };

  return (
    <div className="space-y-3">
      {/* Header with title and enrichment badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Zap size={14} className="text-amber-500" />
          Signals
        </div>
        <Badge
          className={
            company.enriched
              ? "bg-blue-50 text-blue-700 text-xs"
              : "bg-gray-100 text-gray-500 text-xs"
          }
        >
          {company.enriched ? "AI Enriched" : "Mock Data"}
        </Badge>
      </div>

      {/* Signals timeline */}
      <Card>
        <CardContent className="p-3 space-y-2">
          {signals.map((signal, idx) => {
            const style = getSignalStyle(signal.type);
            const IconComponent = style.icon;

            return (
              <div
                key={idx}
                className={cn(
                  "flex gap-3 p-3 rounded-lg border",
                  style.bg,
                  style.border
                )}
              >
                {/* Icon circle */}
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                  <IconComponent size={14} className={style.color} />
                </div>

                {/* Content */}
                <div className="flex items-start justify-between gap-2 flex-1">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {signal.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {signal.value}
                    </p>
                  </div>

                  {/* Type badge */}
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0",
                      style.badge
                    )}
                  >
                    {signal.type}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Data Sources section (only if enriched) */}
      {company.enriched && company.enriched.sources.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 font-medium mb-2 uppercase">
            Data Sources
          </p>
          <div className="space-y-1">
            {company.enriched.sources.map((source, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-gray-500 py-1 border-b border-gray-50 last:border-b-0"
              >
                <span>🔗</span>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline truncate"
                >
                  {source.url}
                </a>
                <span className="text-gray-400 shrink-0">
                  — {formatDateAbsolute(source.scrapedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
