"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BarChart3, Calculator, FileText } from "lucide-react"
import { AssessmentManager } from "@/components/assessment/assessment-manager"
import { WeightedGrades } from "@/components/weighted-grades"
import { AssessmentComparisonView } from "@/components/assessment/assessment-comparison"
import type { Assessment, AssessmentComponent, FinalGradeCalculation, AssessmentComparison } from "@/lib/types"

export default function AssessmentsPage() {
  const [showCreateAssessment, setShowCreateAssessment] = useState(false)
  const [assessments, setAssessments] = useState<Array<{ assessment: Assessment; components: AssessmentComponent[] }>>(
    [],
  )

  // Mock data for weighted grades
  const mockFinalGrades: FinalGradeCalculation[] = [
    {
      studentId: "STU001",
      studentName: "Alice Johnson",
      assessmentGrades: new Map([
        ["ASSESS001", 85],
        ["ASSESS002", 78],
        ["ASSESS003", 92],
      ]),
      finalGrade: 85,
      finalPercentage: 85,
      finalLetterGrade: "B+",
      breakdown: [
        { assessmentName: "Quiz 1", assessmentType: "quiz", grade: 85, weight: 10, contribution: 8.5 },
        { assessmentName: "Mid-Term Exam", assessmentType: "exam", grade: 78, weight: 30, contribution: 23.4 },
        { assessmentName: "Final Project", assessmentType: "project", grade: 92, weight: 25, contribution: 23 },
      ],
    },
    {
      studentId: "STU002",
      studentName: "Bob Smith",
      assessmentGrades: new Map([
        ["ASSESS001", 92],
        ["ASSESS002", 88],
        ["ASSESS003", 95],
      ]),
      finalGrade: 91,
      finalPercentage: 91,
      finalLetterGrade: "A",
      breakdown: [
        { assessmentName: "Quiz 1", assessmentType: "quiz", grade: 92, weight: 10, contribution: 9.2 },
        { assessmentName: "Mid-Term Exam", assessmentType: "exam", grade: 88, weight: 30, contribution: 26.4 },
        { assessmentName: "Final Project", assessmentType: "project", grade: 95, weight: 25, contribution: 23.75 },
      ],
    },
  ]

  // Mock data for assessment comparison
  const mockComparisons: AssessmentComparison[] = [
    {
      assessmentId: "ASSESS001",
      assessmentName: "Quiz 1",
      type: "quiz",
      date: new Date("2025-01-15"),
      average: 78.5,
      median: 80,
      highest: 95,
      lowest: 55,
      passRate: 85,
    },
    {
      assessmentId: "ASSESS002",
      assessmentName: "Mid-Term Exam",
      type: "exam",
      date: new Date("2025-02-20"),
      average: 72.3,
      median: 75,
      highest: 92,
      lowest: 48,
      passRate: 78,
    },
    {
      assessmentId: "ASSESS003",
      assessmentName: "Assignment 1",
      type: "assignment",
      date: new Date("2025-03-10"),
      average: 82.7,
      median: 85,
      highest: 98,
      lowest: 62,
      passRate: 92,
    },
    {
      assessmentId: "ASSESS004",
      assessmentName: "Final Project",
      type: "project",
      date: new Date("2025-04-15"),
      average: 85.2,
      median: 87,
      highest: 100,
      lowest: 65,
      passRate: 95,
    },
  ]

  const handleAssessmentCreated = (assessment: Assessment, components: AssessmentComponent[]) => {
    setAssessments([...assessments, { assessment, components }])
    setShowCreateAssessment(false)
    alert(`Assessment "${assessment.name}" created successfully!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 font-['Cambria']">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assessment Management
            </h1>
            <p className="text-gray-600 mt-1">Create, manage, and analyze different types of assessments</p>
          </div>
          <Button
            onClick={() => setShowCreateAssessment(!showCreateAssessment)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showCreateAssessment ? "Cancel" : "Create Assessment"}
          </Button>
        </div>

        {/* Create Assessment Form */}
        {showCreateAssessment && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
            <AssessmentManager onAssessmentCreated={handleAssessmentCreated} />
          </Card>
        )}

        {/* Assessment Views */}
        <Tabs defaultValue="weighted" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-1">
            <TabsTrigger
              value="weighted"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Weighted Grades
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Comparison
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              All Assessments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weighted">
            <WeightedGrades calculations={mockFinalGrades} />
          </TabsContent>

          <TabsContent value="comparison">
            <AssessmentComparisonView comparisons={mockComparisons} />
          </TabsContent>

          <TabsContent value="list">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Created Assessments</h3>
              {assessments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assessments created yet</p>
                  <p className="text-sm">Click "Create Assessment" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assessments.map(({ assessment, components }) => (
                    <Card
                      key={assessment.id}
                      className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800">{assessment.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {assessment.type} • {assessment.maxGrade} points • {assessment.weight}% of final grade
                          </p>
                          {components.length > 0 && (
                            <p className="text-xs text-gray-500 mt-2">{components.length} components</p>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
