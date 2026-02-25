"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sectorIcon } from "@/lib/utils";

export function SectorChart() {
  const { companies } = useStore();

  const SECTORS = [
    "AI Infra",
    "DevTools",
    "FinTech",
    "HealthTech",
    "B2B SaaS",
    "Climate",
    "Security",
  ];

  const COLORS = [
    "#2563EB",
    "#7C3AED",
    "#0891B2",
    "#059669",
    "#D97706",
    "#16A34A",
    "#DC2626",
  ];

  const data = SECTORS.map((sector) => ({
    name: sector,
    value: companies.filter((c) => c.sector === sector).length,
    icon: sectorIcon(sector as "AI Infra" | "DevTools" | "FinTech" | "HealthTech" | "B2B SaaS" | "Climate" | "Security"),
  })).filter((d) => d.value > 0);

  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-800">
            Sector Breakdown
          </CardTitle>
          <span className="text-xs text-gray-400">
            {companies.length} companies
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[i % COLORS.length]}
                      opacity={0.9}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  formatter={(value: number | undefined) => [
                    `${value ?? 0} companies`,
                    "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 min-w-32">
            {data.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: COLORS[i % COLORS.length] }}
                  ></div>
                  <span className="text-gray-600 text-xs">
                    {item.icon} {item.name}
                  </span>
                </div>
                <span className="font-semibold text-gray-800 text-xs">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
