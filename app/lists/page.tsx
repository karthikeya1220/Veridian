"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Download,
  Building2,
  ListFilter,
  X,
} from "lucide-react";
import {
  exportToCSV,
  formatDate,
  scoreColor,
  stageColor,
  cn,
} from "@/lib/utils";

export default function ListsPage() {
  const { companies, lists, createList, deleteList, removeFromList } = useStore();
  const [newListName, setNewListName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Get companies for a specific list
  const getCompaniesForList = (listId: string) => {
    const list = lists.find((l) => l.id === listId);
    if (!list) return [];
    return list.companyIds
      .map((id) => companies.find((c) => c.id === id))
      .filter((c): c is typeof c & {} => Boolean(c));
  };

  // Handle create list
  const handleCreateList = () => {
    if (!newListName.trim()) return;
    createList(newListName.trim());
    setNewListName("");
    setDialogOpen(false);
  };

  // Handle export to CSV
  const handleExport = (listId: string) => {
    const cos = getCompaniesForList(listId);
    if (cos.length > 0) {
      exportToCSV(cos, `vc-scout-list-${listId}.csv`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-900">Lists</h1>
          <span className="text-sm text-gray-400">{lists.length} lists</span>
        </div>

        {/* Create List Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1"
            >
              <Plus size={14} />
              New List
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Create New List</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 pt-2">
              <Input
                placeholder="e.g. AI Infrastructure Watchlist"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleCreateList()
                }
                autoFocus
              />
              <Button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create List
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Empty State */}
        {lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <ListFilter size={40} className="text-gray-200 mb-4" />
            <p className="text-lg font-medium text-gray-400">No lists yet</p>
            <p className="text-sm text-gray-300 mt-1">
              Create a list to organize companies you&apos;re tracking.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white gap-1"
            >
              <Plus size={14} />
              Create your first list
            </Button>
          </div>
        ) : (
          // Lists Grid
          <div className="grid grid-cols-1 gap-4 max-w-4xl">
            {lists.map((list) => {
              const companiesInList = getCompaniesForList(list.id);
              const isExpanded = activeListId === list.id;

              return (
                <Card
                  key={list.id}
                  className="border-gray-100 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow"
                  onClick={() =>
                    setActiveListId(isExpanded ? null : list.id)
                  }
                >
                  {/* Card Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      {/* Left side */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <ListFilter size={14} className="text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {list.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {list.companyIds.length} companies · Created{" "}
                            {formatDate(list.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <Badge variant="secondary">
                          {list.companyIds.length}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(list.id);
                          }}
                        >
                          <Download size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 text-gray-300 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteList(list.id);
                            if (isExpanded) setActiveListId(null);
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <CardContent className="border-t border-gray-50 pt-3">
                      {companiesInList.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-400">
                            No companies in this list yet.
                          </p>
                          <p className="text-xs text-gray-300 mt-1">
                            Add companies from their profile page.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-0">
                          {companiesInList.map((company) => (
                            <div
                              key={company.id}
                              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 group"
                            >
                              {/* Logo */}
                              <div className="w-7 h-7 rounded border border-gray-100 flex items-center justify-center shrink-0 bg-white overflow-hidden">
                                {imgErrors[company.id] ? (
                                  <Building2
                                    size={12}
                                    className="text-gray-300"
                                  />
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={company.logoUrl}
                                    alt={company.name}
                                    className="w-full h-full object-contain p-0.5"
                                    onError={() =>
                                      setImgErrors((p) => ({
                                        ...p,
                                        [company.id]: true,
                                      }))
                                    }
                                  />
                                )}
                              </div>

                              {/* Middle */}
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/companies/${company.id}`}
                                  className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {company.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <Badge
                                    className={cn(
                                      "text-xs",
                                      stageColor(company.stage)
                                    )}
                                  >
                                    {company.stage}
                                  </Badge>
                                  <span className="text-xs text-gray-400">
                                    {company.sector}
                                  </span>
                                </div>
                              </div>

                              {/* Right */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div
                                  className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full border",
                                    scoreColor(company.thesisScore),
                                    "bg-white"
                                  )}
                                >
                                  {company.thesisScore}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-6 h-6 text-gray-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromList(list.id, company.id);
                                  }}
                                >
                                  <X size={10} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
