"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight, Sparkles } from "lucide-react"
import { cn, scoreBgColor, stageColor } from "@/lib/utils"

export function TopCompanies() {
  const { companies } = useStore()
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const topCompanies = [...companies]
    .sort((a, b) => b.thesisScore - a.thesisScore)
    .slice(0, 8)

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇"
    if (index === 1) return "🥈"
    if (index === 2) return "🥉"
    return null
  }

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-800">
            Top Companies by Score
          </CardTitle>
          <Link href="/companies">
            <Button variant="ghost" size="sm" className="text-xs text-gray-400 h-7">
              View all <ArrowRight size={11} className="ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {topCompanies.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
            No companies added yet
          </div>
        ) : (
          topCompanies.map((company, index) => (
            <Link
              href={`/companies/${company.id}`}
              key={company.id}
            >
              <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                {/* Rank */}
                <div className="w-6 text-center shrink-0">
                  {getRankEmoji(index) ? (
                    <span className="text-base">{getRankEmoji(index)}</span>
                  ) : (
                    <span className="text-xs text-gray-300 font-mono">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Logo */}
                <div className="w-7 h-7 rounded border border-gray-100 shrink-0 overflow-hidden bg-white">
                  {imgErrors[company.id] || !company.logoUrl ? (
                    <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center">
                      <Building2 size={12} className="text-gray-300" />
                    </div>
                  ) : (
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      width={28}
                      height={28}
                      className="object-contain p-0.5 w-full h-full"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [company.id]: true }))
                      }
                    />
                  )}
                </div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {company.name}
                    </span>
                    {company.enriched && (
                      <Sparkles
                        size={10}
                        className="text-blue-400 shrink-0"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {company.sector}
                  </p>
                </div>

                {/* Stage + Score */}
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    className={cn("text-xs h-5", stageColor(company.stage))}
                  >
                    {company.stage}
                  </Badge>
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full border",
                      scoreBgColor(company.thesisScore)
                    )}
                  >
                    {company.thesisScore}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  )
}
