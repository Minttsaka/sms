"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const gradeData = [
  { name: "A (80-100)", value: 28, color: "var(--chart-1)" },
  { name: "B (70-79)", value: 32, color: "var(--chart-2)" },
  { name: "C (60-69)", value: 22, color: "var(--chart-3)" },
  { name: "D (0-59)", value: 8, color: "var(--destructive)" },
]

export function GradeDistribution() {
  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Grade Distribution</CardTitle>
        <CardDescription>Student performance by grade level</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
