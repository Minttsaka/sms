"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const trendData = [
  { week: "Week 1", score: 68.2, target: 70 },
  { week: "Week 2", score: 70.5, target: 70 },
  { week: "Week 3", score: 71.2, target: 72 },
  { week: "Week 4", score: 72.8, target: 72 },
  { week: "Week 5", score: 74.1, target: 75 },
  { week: "Week 6", score: 75.6, target: 75 },
]

export function PerformanceChart() {
  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Performance Trend</CardTitle>
        <CardDescription>Class average score progression over 6 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} domain={[60, 80]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)" }}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
