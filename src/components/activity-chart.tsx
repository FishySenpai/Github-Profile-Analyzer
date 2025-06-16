"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

const activityData = [
  { day: "Mon", commits: 12, prs: 3, issues: 1 },
  { day: "Tue", commits: 8, prs: 2, issues: 2 },
  { day: "Wed", commits: 15, prs: 4, issues: 0 },
  { day: "Thu", commits: 10, prs: 1, issues: 3 },
  { day: "Fri", commits: 18, prs: 5, issues: 1 },
  { day: "Sat", commits: 5, prs: 1, issues: 0 },
  { day: "Sun", commits: 3, prs: 0, issues: 1 },
]

export function ActivityChart() {
  return (
    <ChartContainer
      config={{
        commits: {
          label: "Commits",
          color: "hsl(var(--chart-1))",
        },
        prs: {
          label: "Pull Requests",
          color: "hsl(var(--chart-2))",
        },
        issues: {
          label: "Issues",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="commits" fill="var(--color-commits)" />
          <Bar dataKey="prs" fill="var(--color-prs)" />
          <Bar dataKey="issues" fill="var(--color-issues)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
