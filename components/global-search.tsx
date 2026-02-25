"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useStore } from "@/lib/store";
import { scoreBgColor } from "@/lib/utils";
import type { Company } from "@/lib/types";

export function GlobalSearch() {
  const router = useRouter();
  const { companies } = useStore();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search logic
  const results: Company[] = companies
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        c.tags.some((t) =>
          t.toLowerCase().includes(searchValue.toLowerCase())
        )
    )
    .slice(0, 8);

  const handleSelect = (companyId: string) => {
    router.push(`/companies/${companyId}`);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-400 hover:bg-gray-100 transition-colors w-64"
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search companies...</span>
        <kbd className="text-xs text-gray-300">⌘K</kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search companies, sectors, tags..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>No companies found.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Companies">
              {results.map((company) => (
                <CommandItem
                  key={company.id}
                  onSelect={() => handleSelect(company.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Logo or fallback icon */}
                    {company.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-5 h-5 rounded object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : null}
                    <Building2 size={16} className="text-gray-400 shrink-0" />

                    {/* Company info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{company.name}</p>
                      <p className="text-xs text-gray-400">{company.sector}</p>
                    </div>

                    {/* Score badge */}
                    <div
                      className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${scoreBgColor(
                        company.thesisScore
                      )}`}
                    >
                      {company.thesisScore}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
