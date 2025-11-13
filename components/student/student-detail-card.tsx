"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StudentGradeReport } from "@/lib/report-generator"

interface StudentDetailCardProps {
  student: StudentGradeReport
}

export function StudentDetailCard({ student }: StudentDetailCardProps) {
  return (
    <Card className="border-0 bg-gradient-to-br from-white to-blue-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{student.studentName}</CardTitle>
            <CardDescription>
              {student.studentNumber} • {student.className}
            </CardDescription>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-3 py-1">
            {student.finalLetterGrade}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Final %</p>
            <p className="text-2xl font-bold text-blue-600">{student.finalPercentage}%</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Average</p>
            <p className="text-2xl font-bold text-green-600">{student.average}%</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500">
            <p className="text-sm text-gray-600">Passed</p>
            <p className="text-2xl font-bold text-emerald-600">{student.passedCount}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">{student.failedCount}</p>
          </div>
        </div>

        {/* Assessment Breakdown */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Assessment Breakdown</h3>
          <div className="space-y-2">
            {student.assessments.map((assessment) => (
              <div
                key={assessment.assessmentId}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-700">{assessment.assessmentName}</p>
                  <p className="text-xs text-gray-500">{assessment.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">
                      {assessment.score}/{assessment.maxScore}
                    </p>
                    <p className="text-xs text-gray-500">{assessment.percentage}%</p>
                  </div>
                  <Badge
                    className={`${
                      assessment.percentage >= 70
                        ? "bg-green-100 text-green-700"
                        : assessment.percentage >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {assessment.letterGrade}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remarks */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-semibold text-gray-700 mb-1">Teacher's Remarks</p>
          <p className="text-gray-700">{student.remarks}</p>
        </div>
      </CardContent>
    </Card>
  )
}
