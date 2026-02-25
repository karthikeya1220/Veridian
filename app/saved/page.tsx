"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bookmark,
  Trash2,
  Play,
  Search,
  Filter,
  Clock,
  Zap,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { SearchFilters } from "@/lib/types";

export default function SavedPage() {
  const router = useRouter();
  const { savedSearches, deleteSavedSearch, setFilters } = useStore();

  const buildFilterSummary = (filters: SearchFilters): string[] => {
    const summary: string[] = [];
    if (filters.query) summary.push(`"${filters.query}"`);
    if (filters.sector) summary.push(`${filters.sector}`);
    if (filters.stage) summary.push(`${filters.stage}`);
    if (filters.hq) summary.push(`📍 ${filters.hq}`);
    if (filters.minScore !== 0 || filters.maxScore !== 100) {
      summary.push(`Score: ${filters.minScore}–${filters.maxScore}`);
    }
    if (filters.tags?.length) summary.push(`#${filters.tags.join(" #")}`);
    return summary;
  };

  const handleRerun = (search: (typeof savedSearches)[0]) => {
    setFilters(search.filters);
    router.push("/companies");
  };

  const sortedSearches = [...savedSearches].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <Bookmark size={18} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Saved Searches</h1>
            <p className="text-xs text-gray-500">{savedSearches.length} {savedSearches.length === 1 ? "search" : "searches"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 px-3 py-1.5 bg-gray-50 rounded-lg">
          <Zap size={12} />
          Filters restored on re-run
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {savedSearches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <Bookmark size={32} className="text-green-200" />
            </div>
            <p className="text-lg font-semibold text-gray-900">No saved searches</p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
              Save a search from the Companies page to find it here and re-run it anytime with filters restored.
            </p>
            <Button
              variant="outline"
              className="mt-6 gap-2 transition-all duration-200 hover:bg-green-50"
              onClick={() => router.push("/companies")}
            >
              <Search size={16} />
              Go to Companies
            </Button>
          </div>
        ) : (
          <div className="space-y-3 max-w-3xl">
            {sortedSearches.map((search, index) => {
              const filterSummary = buildFilterSummary(search.filters);
              const filterCount = Object.values(search.filters).filter(v => 
                (typeof v === 'string' && v !== '') ||
                (Array.isArray(v) && v.length > 0) ||
                (typeof v === 'number' && (v !== 0 && v !== 100))
              ).length;

              return (
                <Card
                  key={search.id}
                  className={cn(
                    "border-gray-100 hover:border-green-100 hover:shadow-md transition-all duration-300 ease-out cursor-pointer group animate-in fade-in slide-in-from-bottom-2",
                    "hover:ring-1 hover:ring-green-100"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleRerun(search)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Side */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 group-hover:scale-110 transition-all duration-300">
                            <Bookmark size={14} className="text-green-600" />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm group-hover:text-green-600 transition-colors duration-200">
                            {search.name}
                          </span>
                          {filterCount > 0 && (
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs font-medium">
                              {filterCount} filter{filterCount !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>

                        {/* Filter Tags */}
                        {filterSummary.length === 0 ? (
                          <span className="text-xs text-gray-400 italic">No filters applied (all companies)</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {filterSummary.map((label, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs font-normal bg-gray-50 text-gray-700 group-hover:bg-gray-100 transition-colors duration-200 gap-0.5"
                              >
                                <Filter size={9} />
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={11} />
                          <span>Saved {formatDate(search.createdAt)}</span>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRerun(search);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white gap-1.5 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <Play size={13} />
                          Re-run
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSavedSearch(search.id);
                          }}
                          title="Delete search"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
