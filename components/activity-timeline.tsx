"use client"

import Link from "next/link"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, StickyNote, ListPlus, Bookmark, Activity } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type ActivityItem = {
  id: string
  label: string
  sub: string
  timestamp: string
  href?: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
  dotColor: string
}

export function ActivityTimeline() {
  const { companies, notes, lists, savedSearches } = useStore()

  const activities: ActivityItem[] = []

  // Enriched companies
  companies.forEach((company) => {
    if (company.enriched) {
      activities.push({
        id: `enrich-${company.id}`,
        label: `Enriched ${company.name}`,
        sub: company.sector,
        timestamp: company.enriched.cachedAt,
        href: `/companies/${company.id}`,
        icon: Sparkles,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
        dotColor: "bg-blue-500",
      })
    }
  })

  // Notes
  notes.forEach((note) => {
    const company = companies.find((c) => c.id === note.companyId)
    if (company) {
      activities.push({
        id: `note-${note.id}`,
        label: `Added note to ${company.name}`,
        sub: note.content.substring(0, 60),
        timestamp: note.createdAt,
        href: `/companies/${note.companyId}`,
        icon: StickyNote,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50",
        dotColor: "bg-amber-500",
      })
    }
  })

  // Lists
  lists.forEach((list) => {
    activities.push({
      id: `list-${list.id}`,
      label: `Created list "${list.name}"`,
      sub: `${list.companyIds.length} companies`,
      timestamp: list.createdAt,
      href: "/lists",
      icon: ListPlus,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      dotColor: "bg-purple-500",
    })
  })

  // Saved searches
  savedSearches.forEach((search) => {
    activities.push({
      id: `search-${search.id}`,
      label: `Saved search "${search.name}"`,
      sub: `${search.filters.query || "all companies"}`,
      timestamp: search.createdAt,
      href: "/saved",
      icon: Bookmark,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      dotColor: "bg-green-500",
    })
  })

  // Sort by timestamp desc and take first 8
  const sortedActivities = activities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 8)

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Activity size={14} className="text-gray-500" />
            Activity Timeline
          </CardTitle>
          <span className="text-xs text-gray-400">{sortedActivities.length} events</span>
        </div>
      </CardHeader>

      <CardContent>
        {sortedActivities.length === 0 ? (
          <div className="py-8 text-center">
            <Activity size={24} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No activity yet</p>
            <p className="text-xs text-gray-300 mt-1 max-w-48 mx-auto">
              Enrich companies, add notes, and save searches to see activity
              here.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline vertical line */}
            <div
              className="absolute left-4.75 top-2 bottom-2 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #E2E8F0 10%, #E2E8F0 90%, transparent)",
              }}
            />

            {/* Activity items */}
            <div>
              {sortedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-4 last:pb-0 relative"
                >
                  {/* Icon circle */}
                  <div
                    className={`w-9 h-9 rounded-full ${activity.iconBg} border-2 border-white flex items-center justify-center shrink-0 shadow-sm relative z-10`}
                  >
                    <activity.icon size={13} className={activity.iconColor} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    {activity.href ? (
                      <Link href={activity.href}>
                        <div className="flex items-start justify-between gap-2 group">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                              {activity.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                              {activity.sub}
                            </p>
                          </div>
                          <span className="text-xs text-gray-300 shrink-0">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">
                            {activity.label}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            {activity.sub}
                          </p>
                        </div>
                        <span className="text-xs text-gray-300 shrink-0">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
