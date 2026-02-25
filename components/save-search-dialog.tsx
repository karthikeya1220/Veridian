"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchFilters } from "@/lib/types";

interface SaveSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: SearchFilters;
}

export function SaveSearchDialog({
  open,
  onOpenChange,
  filters,
}: SaveSearchDialogProps) {
  const { saveSearch } = useStore();
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!searchName.trim()) return;

    setIsLoading(true);
    try {
      saveSearch(searchName.trim(), filters);
      setSearchName("");
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchName.trim()) {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-gray-200 shadow-lg">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-base font-semibold text-gray-900">
            Save this search as:
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Input */}
          <Input
            placeholder="Enter search name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={isLoading}
            className="border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearchName("");
                onOpenChange(false);
              }}
              disabled={isLoading}
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!searchName.trim() || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isLoading ? "Saving..." : "OK"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
