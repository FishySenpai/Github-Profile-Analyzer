"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Fallback data using months instead of days
const fallbackData = [
  { month: "Jan", commits: 0, prs: 0, issues: 0 },
  { month: "Feb", commits: 0, prs: 0, issues: 0 },
  { month: "Mar", commits: 0, prs: 0, issues: 0 },
  { month: "Apr", commits: 0, prs: 0, issues: 0 },
  { month: "May", commits: 0, prs: 0, issues: 0 },
  { month: "Jun", commits: 0, prs: 0, issues: 0 },
  { month: "Jul", commits: 0, prs: 0, issues: 0 },
  { month: "Aug", commits: 0, prs: 0, issues: 0 },
  { month: "Sep", commits: 0, prs: 0, issues: 0 },
  { month: "Oct", commits: 0, prs: 0, issues: 0 },
  { month: "Nov", commits: 0, prs: 0, issues: 0 },
  { month: "Dec", commits: 0, prs: 0, issues: 0 },
];

export function ActivityChart({ data = fallbackData }) {
  // Use provided data or fallback to default
  const chartData = data || fallbackData;

  return (
    <ChartContainer
      config={{
        commits: {
          label: "Commits",
          color: "#4e9aa3",
        },
        prs: {
          label: "Pull Requests",
          color: "#eb8c34",
        },
        issues: {
          label: "Issues",
          color: "#3c4d75",
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="commits" fill="var(--color-commits)" />
          <Bar dataKey="prs" fill="var(--color-prs)" />
          <Bar dataKey="issues" fill="var(--color-issues)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
