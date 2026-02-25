"use client"

import { KpiCards } from "@/components/kpi-cards"
import { SectorChart } from "@/components/sector-chart"
import { StageChart } from "@/components/stage-chart"
import { TopCompanies } from "@/components/top-companies"
import { RecentEnrichments } from "@/components/recent-enrichments"
import { ActivityTimeline } from "@/components/activity-timeline"
import { ListsSummary } from "@/components/lists-summary"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, LayoutDashboard } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} className="text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-400">
                Your sourcing intelligence at a glance
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link href="/companies">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs"
              >
                Scout Companies <ArrowRight size={13} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Row 1 — KPIs */}
        <KpiCards />

        {/* Row 2 — Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectorChart />
          <StageChart />
        </div>

        {/* Row 3 — Top companies + Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <TopCompanies />
          </div>
          <div className="lg:col-span-1">
            <ListsSummary />
          </div>
        </div>

        {/* Row 4 — Enrichments + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RecentEnrichments />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  )
}
