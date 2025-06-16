"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Language {
  name: string
  percentage: number
  color: string
}

interface LanguageChartProps {
  languages: Language[]
}

export function LanguageChart({ languages }: LanguageChartProps) {
  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          percentage: {
            label: "Percentage",
          },
        }}
        className="h-[200px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={languages}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="percentage"
            >
              {languages.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="space-y-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lang.color }} />
            <span className="flex-1">{lang.name}</span>
            <span className="text-slate-600 dark:text-slate-300">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
