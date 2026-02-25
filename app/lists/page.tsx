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
  ChevronDown,
  Check,
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
  const [copiedListId, setCopiedListId] = useState<string | null>(null);

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
      setCopiedListId(listId);
      setTimeout(() => setCopiedListId(null), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <ListFilter size={16} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Lists</h1>
            <p className="text-xs text-gray-400">{lists.length} {lists.length === 1 ? "list" : "lists"} created</p>
          </div>
        </div>

        {/* Create List Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Plus size={16} />
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
                className="focus:ring-blue-500"
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
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <ListFilter size={32} className="text-blue-200" />
            </div>
            <p className="text-lg font-semibold text-gray-900">No lists yet</p>
            <p className="text-sm text-gray-500 mt-1 max-w-sm text-center">
              Create a list to organize companies you&apos;re tracking by theme, fund, or investment thesis.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus size={16} />
              Create your first list
            </Button>
          </div>
        ) : (
          // Lists Grid
          <div className="grid grid-cols-1 gap-3 max-w-4xl">
            {lists.map((list, index) => {
              const companiesInList = getCompaniesForList(list.id);
              const isExpanded = activeListId === list.id;
              const isExported = copiedListId === list.id;

              return (
                <Card
                  key={list.id}
                  className={cn(
                    "border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:shadow-md hover:border-blue-100 animate-in fade-in slide-in-from-bottom-2",
                    isExpanded && "ring-1 ring-blue-200 shadow-lg"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() =>
                    setActiveListId(isExpanded ? null : list.id)
                  }
                >
                  {/* Card Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      {/* Left side */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 transition-all duration-300",
                          isExpanded && "bg-blue-100 scale-110"
                        )}>
                          <ListFilter size={16} className={cn(
                            "text-blue-600 transition-transform duration-300",
                            isExpanded && "rotate-180"
                          )} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                            {list.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {companiesInList.length} {companiesInList.length === 1 ? "company" : "companies"} • Created {formatDate(list.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <Badge variant="secondary" className="bg-gray-50 text-gray-700 font-medium">
                          {companiesInList.length}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExport(list.id);
                          }}
                          title={isExported ? "Downloaded!" : "Download as CSV"}
                        >
                          {isExported ? <Check size={14} /> : <Download size={14} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteList(list.id);
                            if (isExpanded) setActiveListId(null);
                          }}
                          title="Delete list"
                        >
                          <Trash2 size={14} />
                        </Button>
                        <ChevronDown size={16} className={cn(
                          "text-gray-400 transition-transform duration-300 ml-1",
                          isExpanded && "rotate-180"
                        )} />
                      </div>
                    </div>
                  </CardHeader>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <CardContent className="border-t border-gray-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {companiesInList.length === 0 ? (
                        <div className="text-center py-8">
                          <Building2 size={24} className="text-gray-200 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-600">
                            No companies in this list yet.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Add companies from their profile page.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-0 max-h-96 overflow-y-auto">
                          {companiesInList.map((company, companyIndex) => (
                            <div
                              key={company.id}
                              className={cn(
                                "flex items-center gap-3 py-3 px-2 border-b border-gray-50 last:border-0 group hover:bg-blue-50 rounded-md transition-colors duration-200 animate-in fade-in",
                                "slide-in-from-left-2"
                              )}
                              style={{ animationDelay: `${companyIndex * 30}ms` }}
                            >
                              {/* Logo */}
                              <div className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center shrink-0 bg-white overflow-hidden hover:border-blue-200 transition-colors duration-200">
                                {imgErrors[company.id] ? (
                                  <Building2
                                    size={13}
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
                                  className="text-sm font-medium text-gray-800 hover:text-blue-600 hover:underline transition-colors duration-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {company.name}
                                </Link>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge
                                    className={cn(
                                      "text-xs",
                                      stageColor(company.stage)
                                    )}
                                  >
                                    {company.stage}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {company.sector}
                                  </span>
                                </div>
                              </div>

                              {/* Right */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div
                                  className={cn(
                                    "text-xs font-bold px-2.5 py-1 rounded-full border transition-colors duration-200",
                                    scoreColor(company.thesisScore),
                                    "bg-white group-hover:shadow-sm"
                                  )}
                                >
                                  {company.thesisScore}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-7 h-7 text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromList(list.id, company.id);
                                  }}
                                  title="Remove from list"
                                >
                                  <X size={12} />
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
