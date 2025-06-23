"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"


export function CommitChart({commitData}) {
  console.log("CommitChart data:", commitData);
  return (
    <ChartContainer
      config={{
        commits: {
          label: "Commits",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px] w-[650px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={commitData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="commits"
            stroke="var(--color-commits)"
            fill="var(--color-commits)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
