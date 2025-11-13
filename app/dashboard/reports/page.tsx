"use client"

import { useState } from "react"
import { ReportHeader } from "@/components/report-header"
import { StatsGrid } from "@/components/stats-grid"
import { AssessmentOverview } from "@/components/assessment/assessment-overview"
import { PerformanceChart } from "@/components/performance-chart"
import { GradeDistribution } from "@/components/grade/grade-distribution"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dummyAssessments, institutionStats, dummyClasses } from "@/lib/dummy-data"
import { calculateClassStats } from "@/lib/report-utils"
import { BarChart3, Users, TrendingUp, Award } from "lucide-react"

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState("1")
  const [reportType, setReportType] = useState<"class" | "institution">("class")

  const classAssessments = dummyAssessments.filter((a) => a.classId === selectedClass)
  const classStats = calculateClassStats(classAssessments)
  const selectedClassName = dummyClasses.find((c) => c.id === selectedClass)?.name || "Form 4A"

  return (
    <main className="min-h-screen bg-background">
      <ReportHeader
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        isinstitutionReport={reportType === "institution"}
      />

      <div className="space-y-6 p-6">
        <Tabs defaultValue="class" onValueChange={(v) => setReportType(v as "class" | "institution")} className="w-full">
          <TabsList className="border-b border-border bg-transparent">
            <TabsTrigger value="class" className="border-b-2 border-transparent data-[state=active]:border-primary">
              Class Report
            </TabsTrigger>
            <TabsTrigger value="institution" className="border-b-2 border-transparent data-[state=active]:border-primary">
              institution Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="class" className="space-y-6">
            <StatsGrid
              stats={[
                {
                  label: "Average Score",
                  value: classStats.averageScore,
                  icon: <TrendingUp className="h-5 w-5" />,
                  trend: 2.5,
                },
                {
                  label: "Pass Rate",
                  value: `${classStats.averagePassRate}%`,
                  icon: <Award className="h-5 w-5" />,
                  trend: 3.2,
                },
                {
                  label: "Total Assessments",
                  value: classStats.totalAssessments,
                  icon: <BarChart3 className="h-5 w-5" />,
                },
                {
                  label: "Class",
                  value: selectedClassName,
                  icon: <Users className="h-5 w-5" />,
                },
              ]}
            />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AssessmentOverview assessments={classAssessments} />
              </div>
              <div>
                <GradeDistribution />
              </div>
            </div>

            <PerformanceChart />
          </TabsContent>

          <TabsContent value="institution" className="space-y-6">
            <StatsGrid
              stats={[
                {
                  label: "Total Students",
                  value: institutionStats.totalStudents,
                  icon: <Users className="h-5 w-5" />,
                },
                {
                  label: "Average Pass Rate",
                  value: `${institutionStats.averagePassRate}%`,
                  icon: <Award className="h-5 w-5" />,
                  trend: 2.1,
                },
                {
                  label: "Average Score",
                  value: institutionStats.averageScore,
                  icon: <TrendingUp className="h-5 w-5" />,
                  trend: 1.8,
                },
                {
                  label: "Attendance",
                  value: `${institutionStats.attendance}%`,
                  icon: <BarChart3 className="h-5 w-5" />,
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
