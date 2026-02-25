"use client";

import { useState } from "react";
import { Company, EnrichedData } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sparkles,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDateAbsolute, formatDate } from "@/lib/utils";

interface EnrichPanelProps {
  company: Company;
}

export function EnrichPanel({ company }: EnrichPanelProps) {
  const { setEnriched } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const enriched = company.enriched;

  // Enrich handler - calls /api/enrich endpoint
  const handleEnrich = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: company.url }),
      });
      if (!res.ok) throw new Error("Enrichment failed");
      const data: EnrichedData = await res.json();
      setEnriched(company.id, data);
    } catch (e: unknown) {
      const error = e instanceof Error ? e.message : "Something went wrong";
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Section 1 - Enrich Button Card */}
      <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  AI Enrichment
                </p>
                <p className="text-xs text-blue-600">
                  Pull live data from company website
                </p>
              </div>
            </div>

            {/* Right side - buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {enriched && !loading ? (
                <>
                  <Badge className="bg-green-100 text-green-700 text-xs gap-1">
                    <CheckCircle size={10} />
                    Enriched
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEnrich}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 gap-1"
                  >
                    <RefreshCw size={12} />
                    Re-run
                  </Button>
                </>
              ) : loading ? (
                <Button disabled size="sm" className="bg-blue-600 gap-1">
                  <RefreshCw size={12} className="animate-spin" />
                  Enriching...
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleEnrich}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
                >
                  <Sparkles size={12} />
                  Enrich
                </Button>
              )}
            </div>
          </div>

          {/* Cached badge */}
          {enriched && (
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-500">
              <Clock size={10} />
              Cached {formatDate(enriched.cachedAt)}
              <Badge
                variant="outline"
                className="text-xs border-blue-200 text-blue-500 ml-1"
              >
                Cached
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2 - Error State */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          <AlertCircle size={14} />
          {error}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-red-600 hover:text-red-700"
            onClick={handleEnrich}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Section 3 - Loading Skeleton */}
      {loading && !enriched && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-2 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 4 - Enriched Result */}
      {enriched && (
        <Card className="border-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Intelligence Report
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </Button>
            </div>
          </CardHeader>

          {expanded && (
            <CardContent className="space-y-4">
              {/* Summary */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Summary
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {enriched.summary}
                </p>
              </div>

              {/* What They Do */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  What They Do
                </p>
                <ul className="space-y-1">
                  {enriched.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="text-blue-400 mt-0.5 shrink-0">
                        ▸
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keywords */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Keywords
                </p>
                <div className="flex flex-wrap gap-1">
                  {enriched.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="text-xs"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Derived Signals */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Derived Signals
                </p>
                <div className="space-y-2">
                  {enriched.signals.map((signal, idx) => {
                    const dotColor =
                      signal.type === "positive"
                        ? "bg-green-400"
                        : signal.type === "warning"
                          ? "bg-amber-400"
                          : "bg-blue-400";

                    return (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}`}
                        />
                        <div>
                          <p className="font-medium text-gray-700">
                            {signal.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {signal.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sources */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Sources
                </p>
                <div className="space-y-1">
                  {enriched.sources.map((source, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-gray-400 py-1 border-b border-gray-50 last:border-0"
                    >
                      <ExternalLink size={10} />
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 hover:underline truncate"
                      >
                        {source.url}
                      </a>
                      <span className="ml-auto shrink-0 text-gray-400">
                        {formatDateAbsolute(source.scrapedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
