"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Company } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, StickyNote, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NotesTabProps {
  company: Company;
}

export function NotesTab({ company }: NotesTabProps) {
  const { notes, addNote, deleteNote } = useStore();
  const [draft, setDraft] = useState("");

  // Filter and sort notes for this company
  const companyNotes = notes
    .filter((n) => n.companyId === company.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  // Handle note submission
  const handleSubmit = () => {
    if (!draft.trim()) return;
    addNote(company.id, draft.trim());
    setDraft("");
  };

  // Handle keyboard submit (Cmd+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Note Section */}
      <Card>
        <CardContent className="pt-4">
          <Textarea
            placeholder="Add a note about this company... (e.g. spoke with founder, strong team)"
            value={draft}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDraft(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="min-h-20 resize-none text-sm"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">⌘+Enter to submit</span>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!draft.trim()}
              className="gap-1"
            >
              <Send size={12} />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      {companyNotes.length === 0 ? (
        // Empty State
        <div className="py-8 text-center">
          <StickyNote size={24} className="text-gray-200 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No notes yet</p>
          <p className="text-xs text-gray-300">
            Add context, meeting notes, or reminders above.
          </p>
        </div>
      ) : (
        // Notes Cards
        <div className="space-y-3">
          {companyNotes.map((note) => (
            <Card key={note.id} className="border-gray-100">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Note Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap overflow-wrap-break-word">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDate(note.createdAt)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-gray-300 hover:text-red-500 shrink-0"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
