"use client"

import Link from "next/link"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Clock } from "lucide-react"
import { formatDate, scoreBgColor, cn } from "@/lib/utils"

export function RecentEnrichments() {
  const { companies } = useStore()

  const enrichedCompanies = companies
    .filter((c) => c.enriched)
    .sort(
      (a, b) =>
        new Date(b.enriched!.cachedAt).getTime() -
        new Date(a.enriched!.cachedAt).getTime()
    )
    .slice(0, 6)

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <Sparkles size={14} className="text-blue-500" />
            Recent Enrichments
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {enrichedCompanies.length} enriched
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {enrichedCompanies.length === 0 ? (
          <div className="py-8 text-center">
            <Sparkles size={24} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No enrichments yet</p>
            <p className="text-xs text-gray-300 mt-1">
              Go to a company profile and click Enrich
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {enrichedCompanies.map((company) => (
              <Link href={`/companies/${company.id}`} key={company.id}>
                <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-1 rounded-lg transition-colors group">
                  {/* Icon dot */}
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Sparkles size={13} className="text-blue-500" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {company.name}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-bold px-1.5 py-0.5 rounded-full border",
                          scoreBgColor(company.thesisScore)
                        )}
                      >
                        {company.thesisScore}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                      {company.enriched?.summary?.substring(0, 80)}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatDate(company.enriched!.cachedAt)}
                      </div>
                      <span>{company.enriched!.sources.length} sources</span>
                      <span>
                        {company.enriched!.keywords.slice(0, 2).join(" · ")}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
