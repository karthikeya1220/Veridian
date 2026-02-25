"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { FilterBar } from "@/components/filter-bar";
import { CompanyTable, SortKey } from "@/components/company-table";
import { Pagination } from "@/components/pagination";
import { SaveSearchDialog } from "@/components/save-search-dialog";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

const PAGE_SIZE = 10;

export default function CompaniesPage() {
  const { companies, filters } = useStore();
  const [sortKey, setSortKey] = useState<SortKey>("thesisScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Filter companies based on search filters
  const filtered = useMemo(() => {
    let result = [...companies];

    // 1. Query filter (name, description, tags)
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (company) =>
          company.name.toLowerCase().includes(q) ||
          company.description.toLowerCase().includes(q) ||
          company.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // 2. Sector filter
    if (filters.sector) {
      result = result.filter((company) => company.sector === filters.sector);
    }

    // 3. Stage filter
    if (filters.stage) {
      result = result.filter((company) => company.stage === filters.stage);
    }

    // 4. HQ filter
    if (filters.hq) {
      result = result.filter((company) => company.hq === filters.hq);
    }

    // 5. Score range filter
    result = result.filter(
      (company) =>
        company.thesisScore >= filters.minScore &&
        company.thesisScore <= filters.maxScore
    );

    // 6. Tags filter (must have ALL tags)
    if (filters.tags.length > 0) {
      result = result.filter((company) =>
        filters.tags.every((tag) => company.tags.includes(tag))
      );
    }

    return result;
  }, [companies, filters]);

  // Reset page to 1 if current page is out of bounds after filtering
  const validPage = useMemo(() => {
    const maxPage = Math.ceil(filtered.length / PAGE_SIZE);
    return currentPage > maxPage ? 1 : currentPage;
  }, [filtered.length, currentPage]);

  // Sort filtered companies
  const sorted = useMemo(() => {
    const copy = [...filtered];

    copy.sort((a, b) => {
      let aVal: string | number | Date;
      let bVal: string | number | Date;

      if (sortKey === "name") {
        aVal = a.name;
        bVal = b.name;
        const cmp = (aVal as string).localeCompare(bVal as string);
        return sortDir === "asc" ? cmp : -cmp;
      } else if (sortKey === "sector") {
        aVal = a.sector;
        bVal = b.sector;
        const cmp = (aVal as string).localeCompare(bVal as string);
        return sortDir === "asc" ? cmp : -cmp;
      } else if (sortKey === "stage") {
        aVal = a.stage;
        bVal = b.stage;
        const cmp = (aVal as string).localeCompare(bVal as string);
        return sortDir === "asc" ? cmp : -cmp;
      } else if (sortKey === "hq") {
        aVal = a.hq;
        bVal = b.hq;
        const cmp = (aVal as string).localeCompare(bVal as string);
        return sortDir === "asc" ? cmp : -cmp;
      } else if (sortKey === "thesisScore") {
        aVal = a.thesisScore;
        bVal = b.thesisScore;
        const cmp = (aVal as number) - (bVal as number);
        return sortDir === "asc" ? cmp : -cmp;
      } else if (sortKey === "lastSignalDate") {
        aVal = new Date(a.lastSignalDate);
        bVal = new Date(b.lastSignalDate);
        const cmp = (aVal as Date).getTime() - (bVal as Date).getTime();
        return sortDir === "asc" ? cmp : -cmp;
      }

      return 0;
    });

    return copy;
  }, [filtered, sortKey, sortDir]);

  // Paginate sorted results
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(
    (validPage - 1) * PAGE_SIZE,
    validPage * PAGE_SIZE
  );

  // Handle sort changes
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      // Toggle direction if same key
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      // New key, default to desc
      setSortKey(key);
      setSortDir("desc");
    }
  };

  // Handle save search
  const handleSaveSearch = () => {
    setSaveDialogOpen(true);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.query !== "" ||
      filters.sector !== "" ||
      filters.stage !== "" ||
      filters.hq !== "" ||
      filters.minScore !== 0 ||
      filters.maxScore !== 100 ||
      filters.tags.length > 0
    );
  }, [filters]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900">Companies</h1>
          <span className="text-sm text-gray-400">{sorted.length} results</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!hasActiveFilters}
          onClick={handleSaveSearch}
          className="gap-1"
        >
          <Bookmark size={14} />
          Save Search
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Table Area */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
          <CompanyTable
            companies={paginated}
            onSort={handleSort}
            sortKey={sortKey}
            sortDir={sortDir}
          />
          <Pagination
            currentPage={validPage}
            totalPages={totalPages}
            totalItems={sorted.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Save Search Dialog */}
      <SaveSearchDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        filters={filters}
      />
    </div>
  );
}
