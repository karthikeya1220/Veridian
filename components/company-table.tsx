"use client";

import { useState } from "react";
import Link from "next/link";
import { Company } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Building2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import {
  cn,
  formatDate,
  scoreBgColor,
  stageColor,
  sectorIcon,
  truncate,
} from "@/lib/utils";

export type SortKey =
  | "name"
  | "sector"
  | "stage"
  | "hq"
  | "thesisScore"
  | "lastSignalDate";

interface CompanyTableProps {
  companies: Company[];
  onSort: (key: SortKey) => void;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
}

const SortIcon = ({
  sortKey,
  sortDir,
  column,
}: {
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  column: SortKey;
}) => {
  if (sortKey !== column) return <ArrowUpDown size={14} />;
  return sortDir === "asc" ? (
    <ArrowUp size={14} />
  ) : (
    <ArrowDown size={14} />
  );
};

const SortHeader = ({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}) => (
  <th
    onClick={() => onSort(column)}
    className="cursor-pointer hover:bg-gray-100 select-none transition-colors px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
  >
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <SortIcon sortKey={sortKey} sortDir={sortDir} column={column} />
    </div>
  </th>
);

export function CompanyTable({
  companies,
  onSort,
  sortKey,
  sortDir,
}: CompanyTableProps) {
  const {
    selectedCompanyIds,
    toggleSelected,
    clearSelected,
    lists,
    addManyToList,
    createList,
  } = useStore();
  const [showAddToList, setShowAddToList] = useState(false);

  const allSelected =
    companies.length > 0 &&
    companies.every((c) => selectedCompanyIds.includes(c.id));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      companies.forEach((c) => {
        if (!selectedCompanyIds.includes(c.id)) {
          toggleSelected(c.id);
        }
      });
    } else {
      clearSelected();
    }
  };

  const handleAddToList = (listId: string) => {
    addManyToList(listId, selectedCompanyIds);
    clearSelected();
    setShowAddToList(false);
  };

  const handleCreateAndAdd = () => {
    createList("New List");
    // Find the newly created list
    const newList = useStore.getState().lists.find((l) => l.name === "New List");
    if (newList) {
      addManyToList(newList.id, selectedCompanyIds);
      clearSelected();
      setShowAddToList(false);
    }
  };

  return (
    <div>
      {/* Bulk action bar */}
      {selectedCompanyIds.length > 0 && (
        <div className="bg-blue-600 text-white px-4 py-2 flex items-center gap-3 rounded-t-lg">
          <span className="text-sm font-medium">
            {selectedCompanyIds.length} selected
          </span>

          <div className="relative">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowAddToList(!showAddToList)}
              className="gap-2"
            >
              + Add to List
            </Button>
            {showAddToList && (
              <div className="absolute top-full left-0 mt-1 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 z-10 min-w-40">
                {lists.length === 0 ? (
                  <button
                    onClick={handleCreateAndAdd}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                  >
                    Create new list
                  </button>
                ) : (
                  <>
                    {lists.map((list) => (
                      <button
                        key={list.id}
                        onClick={() => handleAddToList(list.id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                      >
                        {list.name}
                      </button>
                    ))}
                    <button
                      onClick={handleCreateAndAdd}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-blue-600 font-medium"
                    >
                      + Create new list
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={clearSelected}
            className="text-white hover:bg-blue-700"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {/* Checkbox */}
              <th className="w-10 px-4 py-2">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
              </th>

              {/* Company */}
              <SortHeader
                label="Company"
                column="name"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />

              {/* Sector */}
              <SortHeader
                label="Sector"
                column="sector"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />

              {/* Stage */}
              <SortHeader
                label="Stage"
                column="stage"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />

              {/* HQ */}
              <SortHeader
                label="HQ"
                column="hq"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />

              {/* Score */}
              <SortHeader
                label="Score"
                column="thesisScore"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />

              {/* Last Signal */}
              <SortHeader
                label="Last Signal"
                column="lastSignalDate"
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
              />

              {/* Actions */}
              <th className="w-16 px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Building2 size={32} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      No companies found
                    </p>
                    <p className="text-xs text-gray-400">
                      Try adjusting your filters
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr
                  key={company.id}
                  className={cn(
                    "hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer",
                    selectedCompanyIds.includes(company.id) && "bg-blue-50"
                  )}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3 w-10">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedCompanyIds.includes(company.id)}
                        onCheckedChange={() => toggleSelected(company.id)}
                      />
                    </div>
                  </td>

                  {/* Company name + logo */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/companies/${company.id}`}
                      className="flex items-center gap-3 hover:text-blue-600"
                    >
                      {company.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="w-8 h-8 rounded border border-gray-100 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : null}
                      <Building2
                        size={16}
                        className="text-gray-400 shrink-0"
                        style={{
                          display: company.logoUrl ? "none" : "block",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {company.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {truncate(company.description, 50)}
                        </p>
                      </div>
                    </Link>
                  </td>

                  {/* Sector */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>{sectorIcon(company.sector)}</span>
                      <span>{company.sector}</span>
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="px-4 py-3">
                    <Badge className={stageColor(company.stage)}>
                      {company.stage}
                    </Badge>
                  </td>

                  {/* HQ */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {company.hq}
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full border",
                        scoreBgColor(company.thesisScore)
                      )}
                    >
                      {company.thesisScore}
                    </span>
                  </td>

                  {/* Last Signal */}
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {formatDate(company.lastSignalDate)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link href={`/companies/${company.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
