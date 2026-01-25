"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A line chart";

// const chartData = [
//   { date: "Jan", contributions: 23 },
//   { date: "Feb", contributions: 45 },
//   { date: "Mar", contributions: 67 },
//   { date: "Apr", contributions: 34 },
//   { date: "May", contributions: 89 },
//   { date: "Jun", contributions: 56 },
//   { date: "Jul", contributions: 78 },
//   { date: "Aug", contributions: 92 },
//   { date: "Sep", contributions: 43 },
//   { date: "Oct", contributions: 65 },
//   { date: "Nov", contributions: 87 },
//   { date: "Dec", contributions: 54 },
// ];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
export interface ContributionDataPoint {
  date: string;
  contributions: number;
}

export function ContributionChart({
  chartData,
}: {
  chartData: ContributionDataPoint[];
}) {
  console.log("ContributionChart", chartData);
  return (
    <Card>
      <CardContent className="flex max-h-[300px] items-center justify-center">
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {/* Add Cartesian Grid */}
            <CartesianGrid
              strokeDasharray="5 5" // Dashed grid lines
              stroke="#e8e4e3" // Grid line color
              horizontal={true} // Show horizontal grid lines
              vertical={true} // Show vertical grid lines
            />

            {/* Add X-Axis */}
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            {/* Add Y-Axis */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]} // Set the range of the y-axis
              tickCount={6}
            />

            {/* Tooltip */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            {/* Line */}
            <Line
              dataKey="contributions"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
