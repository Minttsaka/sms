"use client"

import { AttendanceStudentCard } from "./attendance-student-card"
import { Button } from "@/components/ui/button"
import { UserCheck, UserX } from "lucide-react"
import type { Student, AttendanceStatus } from "@/lib/types"

interface AttendanceManualProps {
  students: Student[]
  records: Map<string, { status: AttendanceStatus; notes?: string }>
  onStatusChange: (studentId: string, status: AttendanceStatus) => void
  onNotesChange: (studentId: string, notes: string) => void
  onBulkAction: (studentIds: string[], status: AttendanceStatus) => void
}

export function AttendanceManual({
  students,
  records,
  onStatusChange,
  onNotesChange,
  onBulkAction,
}: AttendanceManualProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() =>
            onBulkAction(
              students.map((s) => s.id),
              "present",
            )
          }
          className="flex-1"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Mark All Present
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            onBulkAction(
              students.map((s) => s.id),
              "absent",
            )
          }
          className="flex-1"
        >
          <UserX className="h-4 w-4 mr-2" />
          Mark All Absent
        </Button>
      </div>

      <div className="space-y-3">
        {students.map((student) => (
          <AttendanceStudentCard
            key={student.id}
            student={student}
            status={records.get(student.id)?.status}
            onStatusChange={(status) => onStatusChange(student.id, status)}
            onNotesChange={(notes) => onNotesChange(student.id, notes)}
          />
        ))}
      </div>
    </div>
  )
}
