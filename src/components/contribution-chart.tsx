"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

const contributionData = [
  { date: "Jan", contributions: 23 },
  { date: "Feb", contributions: 45 },
  { date: "Mar", contributions: 67 },
  { date: "Apr", contributions: 34 },
  { date: "May", contributions: 89 },
  { date: "Jun", contributions: 56 },
  { date: "Jul", contributions: 78 },
  { date: "Aug", contributions: 92 },
  { date: "Sep", contributions: 43 },
  { date: "Oct", contributions: 65 },
  { date: "Nov", contributions: 87 },
  { date: "Dec", contributions: 54 },
]

export function ContributionChart() {
  return (
    <ChartContainer
      config={{
        contributions: {
          label: "Contributions",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={contributionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="contributions"
            stroke="var(--color-contributions)"
            strokeWidth={2}
            dot={{ fill: "var(--color-contributions)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
