"use client"

import type React from "react"

import type { GradeEntry } from "@/lib/types"
import { GradeStudentCard } from "./grade-student-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Upload, Trash2 } from "lucide-react"
import { exportGradesToCSV } from "@/lib/utils"

interface GradeManualProps {
  grades: GradeEntry[]
  maxGrade: number
  assessmentName: string
  onGradeChange: (studentId: string, grade: number | null) => void
  onCommentChange: (studentId: string, comment: string) => void
  onClearAll: () => void
}

export function GradeManual({
  grades,
  maxGrade,
  assessmentName,
  onGradeChange,
  onCommentChange,
  onClearAll,
}: GradeManualProps) {
  const handleExport = () => {
    const csv = exportGradesToCSV(grades, assessmentName)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${assessmentName.replace(/\s+/g, "_")}_grades.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const csv = event.target?.result as string
      // Parse CSV and update grades
      // Implementation would parse CSV and call onGradeChange for each row
      console.log("[v0] CSV import:", csv)
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
              <Input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={onClearAll}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Student Cards */}
      <div className="space-y-3">
        {grades.map((grade) => (
          <GradeStudentCard
            key={grade.studentId}
            grade={grade}
            studentPhoto={`/placeholder.svg?height=48&width=48&query=${grade.studentName}`}
            studentNumber={grade.studentId}
            maxGrade={maxGrade}
            onGradeChange={(g) => onGradeChange(grade.studentId, g)}
            onCommentChange={(c) => onCommentChange(grade.studentId, c)}
          />
        ))}
      </div>
    </div>
  )
}
