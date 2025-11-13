"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Assessment {
  id: string
  name: string
  type: string
  date: string
  totalMarks: number
  averageScore: number
  passRate: number
  studentsAbsent: number
}

interface AssessmentOverviewProps {
  assessments: Assessment[]
}

export function AssessmentOverview({ assessments }: AssessmentOverviewProps) {
  const data = assessments.map((a) => ({
    name: a.name.split(" ")[0],
    score: a.averageScore,
    passRate: a.passRate,
  }))

  const typeIcons = {
    exam: "📝",
    assignment: "📋",
    practical: "🔬",
  }

  return (
    <Card className="border-0 bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Assessment Overview</CardTitle>
        <CardDescription>Performance across all assessments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Legend />
              <Bar dataKey="score" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="passRate" fill="var(--accent)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{typeIcons[assessment.type as keyof typeof typeIcons] || "📊"}</div>
                <div>
                  <p className="font-semibold text-foreground">{assessment.name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(assessment.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-primary">{assessment.averageScore.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">{assessment.passRate}% Pass</Badge>
                {assessment.studentsAbsent > 0 && <Badge variant="outline">{assessment.studentsAbsent} Absent</Badge>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
