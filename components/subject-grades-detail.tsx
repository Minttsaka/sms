"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EnhancedStudentGrade } from "@/lib/dummy-grades-data"
import { getGradeColor } from "@/lib/subject-utils"

interface SubjectGradesDetailProps {
  student: EnhancedStudentGrade
}

export function SubjectGradesDetail({ student }: SubjectGradesDetailProps) {
  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{student.studentName}</span>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {student.overallFinalGrade}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Overall Average</p>
              <p className="text-2xl font-bold text-blue-600">{student.overallAverage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Student Number</p>
              <p className="text-2xl font-bold text-purple-600">{student.studentNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects */}
      <div className="space-y-4">
        {student.subjects.map((subject) => (
          <Card key={subject.subjectId} className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{subject.subjectName}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Average: {subject.average}%</p>
                </div>
                <div className="text-right">
                  <Badge className={getGradeColor(subject.finalGrade)}>{subject.letterGrade}</Badge>
                  <p className="text-sm font-semibold text-gray-700 mt-2">{subject.finalGrade}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="px-3 py-2 text-left font-semibold text-gray-700">Assessment</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">Type</th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-700">Score</th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-700">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subject.grades.map((grade, idx) => {
                      const percentage = (grade.score / grade.maxScore) * 100
                      return (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 text-gray-700">{grade.assessmentName}</td>
                          <td className="px-3 py-3 text-center">
                            <Badge variant="outline" className="text-xs">
                              {grade.type}
                            </Badge>
                          </td>
                          <td className="px-3 py-3 text-right font-medium">
                            {grade.score}/{grade.maxScore}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(percentage)}`}
                            >
                              {Math.round(percentage)}%
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
