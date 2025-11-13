"use client"

import { useState, useCallback, useEffect } from "react"
import type { Assignment, Submission, AssignmentStatistics } from "@/lib/types"
import { calculateAssignmentStats } from "@/lib/utils"

export function useAssignments(classId?: string) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Map<string, Submission[]>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadAssignments()
  }, [classId])

  const loadAssignments = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock data
    const mockAssignments: Assignment[] = [
      {
        id: "ASSIGN001",
        title: "Quadratic Equations Problem Set",
        description: "Solve 20 problems on quadratic equations covering all methods",
        classId: "1",
        className: "Form 4A",
        subjectId: "math",
        subjectName: "Mathematics",
        type: "problem-set",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        maxGrade: 100,
        weight: 10,
        allowLateSubmission: true,
        latePenalty: 10,
      },
      {
        id: "ASSIGN002",
        title: "Science Fair Project",
        description: "Design and conduct an experiment on renewable energy",
        classId: "2",
        className: "Form 2B",
        subjectId: "science",
        subjectName: "Science",
        type: "project",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        assignedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        maxGrade: 100,
        weight: 25,
        allowLateSubmission: false,
      },
      {
        id: "ASSIGN003",
        title: "Essay: Climate Change Impact",
        description: "Write a 1500-word essay on the impact of climate change",
        classId: "1",
        className: "Form 4A",
        subjectId: "english",
        subjectName: "English",
        type: "essay",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        maxGrade: 100,
        weight: 15,
        allowLateSubmission: true,
        latePenalty: 5,
      },
    ]

    setAssignments(mockAssignments)
    setIsLoading(false)
  }

  const createAssignment = useCallback(async (assignment: Omit<Assignment, "id">) => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newAssignment: Assignment = {
      ...assignment,
      id: `ASSIGN${Date.now()}`,
    }

    setAssignments((prev) => [...prev, newAssignment])
    setIsSaving(false)
    return newAssignment
  }, [])

  const updateAssignment = useCallback(async (id: string, updates: Partial<Assignment>) => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
    setIsSaving(false)
  }, [])

  const deleteAssignment = useCallback(async (id: string) => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setAssignments((prev) => prev.filter((a) => a.id !== id))
    setIsSaving(false)
  }, [])

  const getAssignmentStats = useCallback(
    (assignmentId: string): AssignmentStatistics | null => {
      const subs = submissions.get(assignmentId)
      if (!subs) return null
      return calculateAssignmentStats(subs)
    },
    [submissions],
  )

  return {
    assignments,
    submissions,
    isLoading,
    isSaving,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentStats,
  }
}
