"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  // Generate page buttons with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPages = 5;

    if (totalPages <= maxPages) {
      // Show all pages if less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
      {/* Left side - Item count */}
      <div className="text-sm text-gray-500">
        Showing {start}–{end} of {totalItems} companies
      </div>

      {/* Right side - Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="gap-1"
        >
          <ChevronLeft size={14} />
          Prev
        </Button>

        {/* Page number buttons */}
        {pageNumbers.map((page, idx) => (
          <div key={idx}>
            {page === "..." ? (
              <span className="px-2 py-1 text-gray-500">...</span>
            ) : (
              <Button
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                className={`w-8 h-8 p-0 ${
                  page === currentPage
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : ""
                }`}
                disabled={page === currentPage}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )}
          </div>
        ))}

        {/* Next button */}
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="gap-1"
        >
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
