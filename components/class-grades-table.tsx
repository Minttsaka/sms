"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StudentGradeReport } from "@/lib/report-generator"

interface ClassGradesTableProps {
  students: StudentGradeReport[]
  className: string
}

export function ClassGradesTable({ students, className }: ClassGradesTableProps) {
  return (
    <Card className="border-0 bg-white">
      <CardHeader>
        <CardTitle className="text-lg">{className} - Student Grades</CardTitle>
        <CardDescription>{students.length} students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-blue-200 bg-blue-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Std. No.</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Final %</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Grade</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Avg</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Pass/Fail</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{student.studentNumber}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{student.studentName}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-blue-600">{student.finalPercentage}%</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {student.finalLetterGrade}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{student.average}%</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {student.passedCount}
                      </Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        {student.failedCount}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.finalPercentage >= 70
                          ? "bg-green-100 text-green-700"
                          : student.finalPercentage >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.remarks}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
