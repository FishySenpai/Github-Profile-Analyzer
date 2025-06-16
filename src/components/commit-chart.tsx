"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"

const commitData = [
  { month: "Jan", commits: 45 },
  { month: "Feb", commits: 52 },
  { month: "Mar", commits: 48 },
  { month: "Apr", commits: 61 },
  { month: "May", commits: 55 },
  { month: "Jun", commits: 67 },
  { month: "Jul", commits: 72 },
  { month: "Aug", commits: 58 },
  { month: "Sep", commits: 63 },
  { month: "Oct", commits: 71 },
  { month: "Nov", commits: 69 },
  { month: "Dec", commits: 54 },
]

export function CommitChart() {
  return (
    <ChartContainer
      config={{
        commits: {
          label: "Commits",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[200px]"
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
  )
}
