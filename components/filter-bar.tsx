"use client";

import { useMemo } from "react";
import { useStore, DEFAULT_FILTERS } from "@/lib/store";
import type { Sector, Stage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, Search, SlidersHorizontal } from "lucide-react";
import { sectorIcon } from "@/lib/utils";

const SECTORS: Sector[] = [
  "AI Infra",
  "DevTools",
  "FinTech",
  "HealthTech",
  "B2B SaaS",
  "Climate",
  "Security",
];

const STAGES: Stage[] = ["Pre-seed", "Seed", "Series A", "Series B"];

const HQ_LOCATIONS = [
  "San Francisco",
  "New York",
  "London",
  "Berlin",
  "Bangalore",
  "Tel Aviv",
];

export function FilterBar() {
  const { filters, setFilter, resetFilters } = useStore();

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query !== DEFAULT_FILTERS.query) count++;
    if (filters.sector !== DEFAULT_FILTERS.sector) count++;
    if (filters.stage !== DEFAULT_FILTERS.stage) count++;
    if (filters.hq !== DEFAULT_FILTERS.hq) count++;
    if (filters.minScore !== DEFAULT_FILTERS.minScore) count++;
    if (filters.maxScore !== DEFAULT_FILTERS.maxScore) count++;
    if (filters.tags.length !== DEFAULT_FILTERS.tags.length) count++;
    return count;
  }, [filters]);

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3">
      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input */}
        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            placeholder="Filter companies..."
            value={filters.query}
            onChange={(e) => setFilter("query", e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Sector select */}
        <Select
          value={filters.sector || "all"}
          onValueChange={(val: string) =>
            setFilter("sector", val === "all" ? "" : (val as Sector))
          }
        >
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="All Sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {SECTORS.map((sector) => (
              <SelectItem key={sector} value={sector}>
                <div className="flex items-center gap-2">
                  <span>{sectorIcon(sector)}</span>
                  <span>{sector}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stage select */}
        <Select
          value={filters.stage || "all"}
          onValueChange={(val: string) =>
            setFilter("stage", val === "all" ? "" : (val as Stage))
          }
        >
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* HQ select */}
        <Select
          value={filters.hq || "all"}
          onValueChange={(val: string) =>
            setFilter("hq", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {HQ_LOCATIONS.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Score range */}
        <div className="flex items-center gap-2 min-w-48">
          <label className="text-xs text-gray-500 whitespace-nowrap">
            Score
          </label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[filters.minScore, filters.maxScore]}
            onValueChange={([min, max]: [number, number]) => {
              setFilter("minScore", min);
              setFilter("maxScore", max);
            }}
            className="w-28"
          />
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {filters.minScore}–{filters.maxScore}
          </span>
        </div>

        {/* Reset button */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="gap-2"
          >
            <SlidersHorizontal size={14} />
            <Badge variant="secondary">{activeFilterCount}</Badge>
            <X size={14} />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
