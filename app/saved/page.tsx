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
} from "lucide-react";
import { formatDate, sectorIcon } from "@/lib/utils";
import { SearchFilters } from "@/lib/types";

export default function SavedPage() {
  const router = useRouter();
  const { savedSearches, deleteSavedSearch, setFilters } = useStore();

  // Build human-readable filter summary
  const buildFilterSummary = (filters: SearchFilters): string[] => {
    const summary: string[] = [];

    if (filters.query) {
      summary.push(`Query: "${filters.query}"`);
    }

    if (filters.sector) {
      summary.push(`Sector: ${sectorIcon(filters.sector)} ${filters.sector}`);
    }

    if (filters.stage) {
      summary.push(`Stage: ${filters.stage}`);
    }

    if (filters.hq) {
      summary.push(`HQ: ${filters.hq}`);
    }

    if (filters.minScore !== 0 || filters.maxScore !== 100) {
      summary.push(`Score: ${filters.minScore}–${filters.maxScore}`);
    }

    if (filters.tags && filters.tags.length > 0) {
      summary.push(`Tags: ${filters.tags.join(", ")}`);
    }

    return summary;
  };

  // Handle re-running a saved search
  const handleRerun = (search: (typeof savedSearches)[0]) => {
    setFilters(search.filters);
    router.push("/companies");
  };

  // Sort by newest first
  const sortedSearches = [...savedSearches].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900">
            Saved Searches
          </h1>
          <span className="text-sm text-gray-400">{savedSearches.length} saved</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock size={12} />
          Filters are restored on re-run
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Empty State */}
        {savedSearches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Bookmark size={40} className="text-gray-200 mb-4" />
            <p className="text-lg font-medium text-gray-400">No saved searches</p>
            <p className="text-sm text-gray-300 mt-1">
              Save a search from the Companies page to find it here.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/companies")}
            >
              <Search size={14} />
              Go to Companies
            </Button>
          </div>
        ) : (
          // Saved Searches List
          <div className="space-y-3 max-w-2xl">
            {sortedSearches.map((search) => {
              const filterSummary = buildFilterSummary(search.filters);

              return (
                <Card
                  key={search.id}
                  className="border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Side */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Bookmark size={14} className="text-blue-500 shrink-0" />
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {search.name}
                          </span>
                        </div>

                        {/* Filter Tags */}
                        {filterSummary.length === 0 ? (
                          <span className="text-xs text-gray-400">
                            No filters applied
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {filterSummary.map((label, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs font-normal gap-1"
                              >
                                <Filter size={9} />
                                {label}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                          <Clock size={10} />
                          Saved {formatDate(search.createdAt)}
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleRerun(search)}
                          className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
                        >
                          <Play size={12} />
                          Re-run
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-gray-300 hover:text-red-500"
                          onClick={() => deleteSavedSearch(search.id)}
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
