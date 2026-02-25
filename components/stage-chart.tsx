"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StageChart() {
  const { companies } = useStore();

  const STAGES = ["Pre-seed", "Seed", "Series A", "Series B"];
  const STAGE_COLORS: Record<string, string> = {
    "Pre-seed": "#A78BFA",
    Seed: "#38BDF8",
    "Series A": "#2563EB",
    "Series B": "#7C3AED",
  };

  const data = STAGES.map((stage) => {
    const cos = companies.filter((c) => c.stage === stage);
    return {
      stage: stage.replace("Series ", "S."),
      fullStage: stage,
      count: cos.length,
      avgScore:
        cos.length > 0
          ? Math.round(cos.reduce((s, c) => s + c.thesisScore, 0) / cos.length)
          : 0,
    };
  });

  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-800">
          Stage Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={data}
            barSize={28}
            margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#F1F5F9"
              vertical={false}
            />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div
                    style={{
                      background: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: 8,
                      padding: "8px 12px",
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#0F172A",
                        marginBottom: 2,
                      }}
                    >
                      {d.fullStage}
                    </p>
                    <p style={{ color: "#475569" }}>{d.count} companies</p>
                    <p style={{ color: "#475569" }}>Avg score: {d.avgScore}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.stage}
                  fill={STAGE_COLORS[entry.fullStage]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
