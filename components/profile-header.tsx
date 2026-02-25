"use client";

import { useState } from "react";
import Link from "next/link";
import { Company } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  ExternalLink,
  Copy,
  Check,
  BookmarkPlus,
  ChevronLeft,
  Plus,
} from "lucide-react";
import {
  cn,
  stageColor,
  sectorIcon,
  formatDateAbsolute,
  scoreColor,
} from "@/lib/utils";

interface ProfileHeaderProps {
  company: Company;
}

export function ProfileHeader({ company }: ProfileHeaderProps) {
  const { lists, addToList, createList } = useStore();
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(company.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAndAdd = () => {
    const name = window.prompt("List name:");
    if (name) {
      createList(name);
      // Note: Would need to get the new list ID to add company
      // For now, just create the list
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-5">
      {/* Row 1 - Breadcrumb */}
      <Link
        href="/companies"
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4 w-fit"
      >
        <ChevronLeft size={12} />
        Back to Companies
      </Link>

      {/* Row 2 - Main header */}
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Logo and Info */}
        <div className="flex items-start gap-4">
          {/* Logo container */}
          <div className="w-14 h-14 rounded-xl border border-gray-100 bg-white flex items-center justify-center overflow-hidden shadow-sm shrink-0">
            {imgError ? (
              <Building2 size={24} className="text-gray-300" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logoUrl}
                alt={company.name}
                className="object-contain p-1 w-full h-full"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          {/* Info block */}
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>

            {/* URL link */}
            <Link
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline w-fit"
            >
              <ExternalLink size={12} />
              {company.url.replace("https://", "")}
            </Link>

            {/* Badges row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={stageColor(company.stage)}>
                {company.stage}
              </Badge>
              <Badge variant="outline">
                {sectorIcon(company.sector)} {company.sector}
              </Badge>
              <Badge variant="outline">📍 {company.hq}</Badge>
              <Badge variant="outline">Est. {company.founded}</Badge>
            </div>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Copy URL button */}
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check size={14} className="text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy URL
              </>
            )}
          </Button>

          {/* Save to List dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <BookmarkPlus size={14} />
                Save to List
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Your Lists</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {lists.length === 0 ? (
                <DropdownMenuItem disabled>No lists yet</DropdownMenuItem>
              ) : (
                lists.map((list) => (
                  <DropdownMenuItem
                    key={list.id}
                    onClick={() => addToList(list.id, company.id)}
                  >
                    {list.name}
                    <span className="ml-auto text-xs text-gray-400">
                      {list.companyIds.length}
                    </span>
                  </DropdownMenuItem>
                ))
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCreateAndAdd}>
                <Plus size={12} />
                Create new list
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 3 - Stats strip */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50 flex-wrap">
        {/* Thesis Score */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Thesis Score</span>
          <span className={cn("font-bold text-sm", scoreColor(company.thesisScore))}>
            {company.thesisScore}/100
          </span>
        </div>

        {/* Employees */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Employees</span>
          <span className="text-sm font-semibold text-gray-900">
            {company.employees}
          </span>
        </div>

        {/* Last Signal */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Last Signal</span>
          <span className="text-sm font-semibold text-gray-900">
            {formatDateAbsolute(company.lastSignalDate)}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Tags</span>
          <div className="flex items-center gap-1 flex-wrap">
            {company.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
