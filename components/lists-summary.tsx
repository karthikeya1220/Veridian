"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListFilter, ArrowRight, Plus, Download } from "lucide-react"
import { exportToCSV, cn, scoreBgColor } from "@/lib/utils"

export function ListsSummary() {
  const router = useRouter()
  const { lists, companies } = useStore()

  const displayLists = lists.slice(0, 5)

  return (
    <Card className="border-gray-100 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-800">
            Watchlists
          </CardTitle>
          <Link href="/lists">
            <Button variant="ghost" size="sm" className="text-xs text-gray-400 h-7">
              Manage <ArrowRight size={11} className="ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {lists.length === 0 ? (
          <div className="py-6 text-center">
            <ListFilter size={20} className="text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No watchlists yet</p>
            <Link href="/lists">
              <Button
                size="sm"
                variant="outline"
                className="mt-3 text-xs h-7"
              >
                <Plus size={11} className="mr-1" />
                Create list
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              {displayLists.map((list) => {
                const listCompanies = companies.filter((c) =>
                  list.companyIds.includes(c.id)
                )
                const avgScore =
                  listCompanies.length > 0
                    ? Math.round(
                        listCompanies.reduce((sum, c) => sum + c.thesisScore, 0) /
                          listCompanies.length
                      )
                    : 0

                return (
                  <div
                    key={list.id}
                    onClick={() => router.push("/lists")}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <ListFilter size={13} className="text-blue-600" />
                    </div>

                    {/* Middle */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {list.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {list.companyIds.length} companies
                      </p>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2 shrink-0">
                      {avgScore > 0 && (
                        <span
                          className={cn(
                            "text-xs font-bold px-1.5 py-0.5 rounded-full border",
                            scoreBgColor(avgScore)
                          )}
                        >
                          {avgScore}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          exportToCSV(listCompanies, `${list.name}.csv`)
                        }}
                      >
                        <Download size={10} />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {lists.length > 5 && (
              <p className="text-xs text-gray-400 text-center pt-2">
                +{lists.length - 5} more watchlists
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
