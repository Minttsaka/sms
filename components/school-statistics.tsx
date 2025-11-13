"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const classPerformance = [
  { class: "Form 4A", avgScore: 74.3, passRate: 88 },
  { class: "Form 4B", avgScore: 71.8, passRate: 82 },
  { class: "Form 2A", avgScore: 68.9, passRate: 78 },
  { class: "Form 2B", avgScore: 70.2, passRate: 80 },
]

export function institutionStatistics() {
  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">institution Performance</CardTitle>
        <CardDescription>Average scores and pass rates by class</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="class" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} yAxisId="left" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--muted-foreground)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgScore"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  name="Avg Score"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="passRate"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  name="Pass Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {classPerformance.map((cls) => (
              <div key={cls.class} className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="font-semibold text-foreground">{cls.class}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                    <p className="text-xl font-bold text-primary">{cls.avgScore}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pass Rate</p>
                    <p className="text-xl font-bold text-accent">{cls.passRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
