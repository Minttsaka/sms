"use client"

import { useState, useCallback, useEffect } from "react"
import type { GradeEntry, Student, GradeStatistics, Assessment, GradeStatus } from "@/lib/types"
import { calculatePercentage, getLetterGrade, calculateStatistics, flagAnomalousGrades } from "@/lib/utils"

export function useGrades(classId: string, assessment: Assessment) {
  const [grades, setGrades] = useState<GradeEntry[]>([])
  const [statistics, setStatistics] = useState<GradeStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Mock student averages (in real app, fetch from API)
  const studentAverages = new Map<string, number>([
    ["STU001", 78],
    ["STU002", 85],
    ["STU003", 72],
    ["STU004", 90],
    ["STU005", 68],
  ])

  // Load grades
  useEffect(() => {
    loadGrades()
  }, [classId, assessment.id])

  const loadGrades = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock data
    const mockStudents: Student[] = [
      {
        id: "STU001",
        name: "Alice Johnson",
        rollNumber: "F4-001",
        photo: "/diverse-student-girl.png",
        studentNumber: ""
      },
      {
        id: "STU002",
        name: "Bob Smith",
        rollNumber: "F4-002",
        photo: "/student-boy.png",
        studentNumber: ""
      },
      {
        id: "STU003",
        name: "Carol Williams",
        rollNumber: "F4-003",
        photo: "/student-girl-2.jpg",
        studentNumber: ""
      },
      {
        id: "STU004",
        name: "David Brown",
        rollNumber: "F4-004",
        photo: "/student-boy-2.jpg",
        studentNumber: ""
      },
      {
        id: "STU005",
        name: "Emma Davis",
        rollNumber: "F4-005",
        photo: "/student-girl-3.jpg",
        studentNumber: ""
      },
      {
        id: "STU006",
        name: "Frank Miller",
        rollNumber: "F4-006",
        photo: "/student-boy-3.jpg",
        studentNumber: ""
      },
      {
        id: "STU007",
        name: "Grace Wilson",
        rollNumber: "F4-007",
        photo: "/student-girl-4.jpg",
        studentNumber: ""
      },
      {
        id: "STU008",
        name: "Henry Moore",
        rollNumber: "F4-008",
        photo: "/student-boy-4.jpg",
        studentNumber: ""
      },
    ]

    const initialGrades: GradeEntry[] = mockStudents.map((student) => ({
      studentId: student.id,
      studentName: student.name,
      grade: null,
      maxGrade: assessment.maxGrade,
      percentage: 0,
      letterGrade: "-",
      status: ("pending" as GradeStatus),
      entryMethod: "manual",
    }))

    setGrades(initialGrades)
    setStatistics(calculateStatistics(initialGrades))
    setIsLoading(false)
  }

  const updateGrade = useCallback(
    (studentId: string, grade: number | null, method: "manual" | "voice" | "scan" | "import" = "manual") => {
      setGrades((prev) => {
        const updated = prev.map((g) => {
          if (g.studentId === studentId) {
            const percentage = grade !== null ? calculatePercentage(grade, assessment.maxGrade) : 0
            return {
              ...g,
              grade,
              percentage,
              letterGrade: grade !== null ? getLetterGrade(percentage) : "-",
              status: grade !== null ? ("entered" as GradeStatus) : ("pending" as GradeStatus),
              entryMethod: method,
              enteredAt: grade !== null ? new Date() : undefined,
            }
          }
          return g
        })

        // Flag anomalous grades
        const flagged = flagAnomalousGrades(updated, studentAverages)
        setStatistics(calculateStatistics(flagged))
        return flagged
      })
    },
    [assessment.maxGrade],
  )

  const updateComment = useCallback((studentId: string, comments: string) => {
    setGrades((prev) => prev.map((g) => (g.studentId === studentId ? { ...g, comments } : g)))
  }, [])

  const bulkUpdateGrades = useCallback(
    (
      updates: Array<{ studentId: string; grade: number }>,
      method: "manual" | "voice" | "scan" | "import" = "import",
    ) => {
      updates.forEach(({ studentId, grade }) => {
        updateGrade(studentId, grade, method)
      })
    },
    [updateGrade],
  )

  const saveGrades = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In real app: await fetch('/api/grades/record', { method: 'POST', body: JSON.stringify(grades) })

    setIsSaving(false)
    return true
  }

  const clearAllGrades = useCallback(() => {
    setGrades((prev) =>
      prev.map((g) => ({
        ...g,
        grade: null,
        percentage: 0,
        letterGrade: "-",
        status: ("pending" as GradeStatus),
        comments: undefined,
      })),
    )
  }, [])

  return {
    grades,
    statistics,
    isLoading,
    isSaving,
    updateGrade,
    updateComment,
    bulkUpdateGrades,
    saveGrades,
    clearAllGrades,
  }
}
