"use client";

import { use } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/profile-header";
import { OverviewTab } from "@/components/overview-tab";
import { SignalsTab } from "@/components/signals-tab";
import { NotesTab } from "@/components/notes-tab";
import { EnrichPanel } from "@/components/enrich-panel";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, Zap, StickyNote, Sparkles } from "lucide-react";

interface CompanyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CompanyPage({ params: paramsPromise }: CompanyPageProps) {
  const { companies, notes } = useStore();
  const params = use(paramsPromise);

  // Find company by ID
  const company = companies.find((c) => c.id === params.id);

  // Not found state
  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg font-medium text-gray-500">Company not found</p>
        <Link
          href="/companies"
          className="text-blue-600 hover:underline text-sm mt-2"
        >
          ← Back to Companies
        </Link>
      </div>
    );
  }

  // Get note count for this company
  const companyNoteCount = notes.filter(
    (n) => n.companyId === company.id
  ).length;

  return (
    <div className="flex flex-col h-full">
      {/* Profile Header */}
      <ProfileHeader company={company} />

      {/* Tabs Section */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="overview" className="flex flex-col h-full">
          {/* Tab List */}
          <div className="px-6 pt-4 bg-white border-b border-gray-100 shrink-0">
            <TabsList className="bg-transparent border-0 p-0 h-auto gap-1">
              {/* Overview Tab */}
              <TabsTrigger
                value="overview"
                className="pb-3 pt-1 px-3 rounded-none border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:font-medium gap-1"
              >
                <LayoutGrid size={14} />
                Overview
              </TabsTrigger>

              {/* Signals Tab */}
              <TabsTrigger
                value="signals"
                className="pb-3 pt-1 px-3 rounded-none border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:font-medium gap-1"
              >
                <Zap size={14} />
                Signals
              </TabsTrigger>

              {/* Notes Tab */}
              <TabsTrigger
                value="notes"
                className="pb-3 pt-1 px-3 rounded-none border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:font-medium gap-1"
              >
                <StickyNote size={14} />
                Notes
                {companyNoteCount > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {companyNoteCount}
                  </Badge>
                )}
              </TabsTrigger>

              {/* Enrich Tab */}
              <TabsTrigger
                value="enrich"
                className="pb-3 pt-1 px-3 rounded-none border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:font-medium gap-1"
              >
                <Sparkles
                  size={14}
                  className={company.enriched ? "text-blue-500" : ""}
                />
                Enrich
                {company.enriched && (
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-auto">
            {/* Overview Panel */}
            <TabsContent value="overview" className="p-6 h-full m-0">
              <OverviewTab company={company} />
            </TabsContent>

            {/* Signals Panel */}
            <TabsContent value="signals" className="p-6 h-full m-0">
              <SignalsTab company={company} />
            </TabsContent>

            {/* Notes Panel */}
            <TabsContent value="notes" className="p-6 h-full m-0">
              <NotesTab company={company} />
            </TabsContent>

            {/* Enrich Panel */}
            <TabsContent value="enrich" className="p-6 h-full m-0">
              <EnrichPanel company={company} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
