"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, QrCode, CreditCard } from "lucide-react"
import type { StudentEnrollmentData } from "@/lib/types"

interface StudentIdGeneratorProps {
  student: Partial<StudentEnrollmentData>
}

export function StudentIdGenerator({ student }: StudentIdGeneratorProps) {
  const handleDownload = () => {
    console.log("[v0] Downloading student ID card")
    // In production, generate and download actual ID card
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Student ID Card</h3>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <CreditCard className="w-3 h-3 mr-1" />
            Digital ID
          </Badge>
        </div>

        {/* ID Card Preview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
            <h4 className="text-lg font-bold">institution Name</h4>
            <p className="text-sm opacity-90">Student Identification Card</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {student.photo ? (
                  <img src={student.photo || "/placeholder.svg"} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <CreditCard className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Student Name</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Student ID</p>
                  <p className="text-sm font-mono font-semibold text-blue-600">{student.studentId || "---"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Admission Number</p>
                  <p className="text-sm font-mono text-gray-900">{student.admissionNumber || "---"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600">Grade</p>
                <p className="text-sm font-medium text-gray-900">{student.gradeApplying || "---"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Academic Year</p>
                <p className="text-sm font-medium text-gray-900">{student.academicYear || "---"}</p>
              </div>
            </div>

            {student.qrCode && (
              <div className="flex justify-center pt-4 border-t border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        <Button onClick={handleDownload} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
          <Download className="w-4 h-4 mr-2" />
          Download ID Card
        </Button>
      </div>
    </Card>
  )
}
