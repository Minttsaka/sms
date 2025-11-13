"use client"

import { useState, useCallback } from "react"
import type { AttendanceRecord, AttendanceStatus } from "@/lib/types"

export function useAttendance(classId: string, date: string) {
  const [records, setRecords] = useState<Map<string, AttendanceRecord>>(new Map())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const recordAttendance = useCallback(
    (studentId: string, status: AttendanceStatus, method: AttendanceRecord["method"], notes?: string) => {
      const record: AttendanceRecord = {
        id: `${studentId}-${date}`,
        studentId,
        classId,
        date,
        status,
        recordedAt: new Date().toISOString(),
        recordedBy: "teacher-id", // Would come from auth context
        method,
        notes,
      }

      setRecords((prev) => new Map(prev).set(studentId, record))
    },
    [classId, date],
  )

  const bulkRecord = useCallback(
    (studentIds: string[], status: AttendanceStatus) => {
      studentIds.forEach((id) => {
        recordAttendance(id, status, "manual")
      })
    },
    [recordAttendance],
  )

  const submitAttendance = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/attendance/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId,
          date,
          records: Array.from(records.values()),
        }),
      })

      if (!response.ok) throw new Error("Failed to submit attendance")

      return true
    } catch (error) {
      console.error("[v0] Error submitting attendance:", error)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [classId, date, records])

  return {
    records,
    recordAttendance,
    bulkRecord,
    submitAttendance,
    isSubmitting,
  }
}
