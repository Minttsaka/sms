import type { GradeEntry, GradeDistribution, GradeStatistics } from "./types"

import type { AttendanceRecord, AttendanceStats, AttendanceStatus } from "./types"



import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import type { StudentEnrollmentData, ClassAssignment } from "./types"

export function generateStudentId(institutionCode: string, year: number): string {
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${institutionCode}-${year}-${randomNum}`
}

export function generateAdmissionNumber(grade: string, year: number, sequence: number): string {
  const gradeCode = grade.replace(/\s+/g, "").toUpperCase()
  return `ADM-${gradeCode}-${year}-${sequence.toString().padStart(4, "0")}`
}

export function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--
  }
  return age
}

export function suggestGradeByAge(age: number): string {
  if (age < 6) return "Kindergarten"
  if (age >= 6 && age <= 11) return `Grade ${age - 5}`
  if (age >= 12 && age <= 15) return `Form ${age - 11}`
  if (age >= 16 && age <= 18) return `Form ${age - 11}`
  return "Unknown"
}

export function validateEnrollmentData(data: Partial<StudentEnrollmentData>): {
  isValid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (!data.firstName?.trim()) errors.firstName = "First name is required"
  if (!data.lastName?.trim()) errors.lastName = "Last name is required"
  if (!data.dateOfBirth) errors.dateOfBirth = "Date of birth is required"
  if (!data.gender) errors.gender = "Gender is required"
  if (!data.address?.trim()) errors.address = "Address is required"
  if (!data.gradeApplying) errors.gradeApplying = "Grade applying for is required"
  if (!data.guardians || data.guardians.length === 0) errors.guardians = "At least one guardian is required"

  // Validate guardian information
  data.guardians?.forEach((guardian, index) => {
    if (!guardian.firstName?.trim()) errors[`guardian${index}FirstName`] = "Guardian first name is required"
    if (!guardian.lastName?.trim()) errors[`guardian${index}LastName`] = "Guardian last name is required"
    if (!guardian.email?.trim()) errors[`guardian${index}Email`] = "Guardian email is required"
    if (!guardian.phone?.trim()) errors[`guardian${index}Phone`] = "Guardian phone is required"
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function checkDuplicateStudent(
  newStudent: Partial<StudentEnrollmentData>,
  existingStudents: StudentEnrollmentData[],
): { isDuplicate: boolean; matches: StudentEnrollmentData[] } {
  const matches = existingStudents.filter((student) => {
    const nameMatch =
      student.firstName.toLowerCase() === newStudent.firstName?.toLowerCase() &&
      student.lastName.toLowerCase() === newStudent.lastName?.toLowerCase()

    const dobMatch = student.dateOfBirth.getTime() === newStudent.dateOfBirth?.getTime()

    return nameMatch && dobMatch
  })

  return {
    isDuplicate: matches.length > 0,
    matches,
  }
}

export function generateQRCode(studentId: string, institutionId: string): string {
  // In production, use a proper QR code library
  return `QR-${institutionId}-${studentId}`
}

export function getAvailableClasses(
  grade: string,
  academicYear: string,
  allClasses: ClassAssignment[],
): ClassAssignment[] {
  return allClasses
    .filter((cls) => cls.grade === grade && cls.academicYear === academicYear && cls.available > 0)
    .sort((a, b) => b.available - a.available)
}

/**
 * Utility function to merge Tailwind CSS class names conditionally.
 * Combines clsx and tailwind-merge for cleaner className handling.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function calculateAttendanceStats(records: AttendanceRecord[]): AttendanceStats {
  const total = records.length
  const present = records.filter((r) => r.status === "present").length
  const absent = records.filter((r) => r.status === "absent").length
  const late = records.filter((r) => r.status === "late").length
  const excused = records.filter((r) => r.status === "excused").length
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0

  return { total, present, absent, late, excused, percentage }
}

export function getStatusColor(status: AttendanceStatus): string {
  const colors = {
    present: "bg-emerald-500",
    absent: "bg-red-500",
    late: "bg-amber-500",
    excused: "bg-blue-500",
  }
  return colors[status]
}

export function getStatusTextColor(status: AttendanceStatus): string {
  const colors = {
    present: "text-emerald-600",
    absent: "text-red-600",
    late: "text-amber-600",
    excused: "text-blue-600",
  }
  return colors[status]
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function exportToCSV(records: AttendanceRecord[], className: string, date: string): void {
  const headers = ["Roll Number", "Student Name", "Status", "Time", "Method", "Notes"]
  const rows = records.map((r) => [
    r.studentId,
    "Student Name", // Would be fetched from student data
    r.status,
    new Date(r.recordedAt).toLocaleTimeString(),
    r.method,
    r.notes || "",
  ])

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `attendance-${className}-${date}.csv`
  a.click()
}

export function calculatePercentage(grade: number, maxGrade: number): number {
  return Math.round((grade / maxGrade) * 100)
}

export function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return "A+"
  if (percentage >= 85) return "A"
  if (percentage >= 80) return "A-"
  if (percentage >= 75) return "B+"
  if (percentage >= 70) return "B"
  if (percentage >= 65) return "B-"
  if (percentage >= 60) return "C+"
  if (percentage >= 55) return "C"
  if (percentage >= 50) return "C-"
  if (percentage >= 45) return "D"
  return "F"
}

export function getGradeColor(percentage: number): string {
  if (percentage >= 80) return "text-green-600"
  if (percentage >= 70) return "text-blue-600"
  if (percentage >= 60) return "text-yellow-600"
  if (percentage >= 50) return "text-orange-600"
  return "text-red-600"
}

export function getGradeBgColor(percentage: number): string {
  if (percentage >= 80) return "bg-green-50 border-green-200"
  if (percentage >= 70) return "bg-blue-50 border-blue-200"
  if (percentage >= 60) return "bg-yellow-50 border-yellow-200"
  if (percentage >= 50) return "bg-orange-50 border-orange-200"
  return "bg-red-50 border-red-200"
}

export function calculateStatistics(grades: GradeEntry[]): GradeStatistics {
  const validGrades = grades.filter((g) => g.grade !== null && g.status === "entered")
  const percentages = validGrades.map((g) => g.percentage)

  const average = percentages.length > 0 ? percentages.reduce((a, b) => a + b, 0) / percentages.length : 0

  const sorted = [...percentages].sort((a, b) => a - b)
  const median =
    sorted.length > 0
      ? sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]
      : 0

  const highest = percentages.length > 0 ? Math.max(...percentages) : 0
  const lowest = percentages.length > 0 ? Math.min(...percentages) : 0
  const passRate = percentages.length > 0 ? (percentages.filter((p) => p >= 50).length / percentages.length) * 100 : 0

  const distribution = calculateDistribution(validGrades)

  return {
    average: Math.round(average),
    median: Math.round(median),
    highest,
    lowest,
    passRate: Math.round(passRate),
    totalStudents: grades.length,
    enteredCount: validGrades.length,
    pendingCount: grades.filter((g) => g.status === "pending").length,
    distribution,
  }
}

export function calculateDistribution(grades: GradeEntry[]): GradeDistribution[] {
  const ranges = [
    { range: "90-100%", min: 90, max: 100 },
    { range: "80-89%", min: 80, max: 89 },
    { range: "70-79%", min: 70, max: 79 },
    { range: "60-69%", min: 60, max: 69 },
    { range: "50-59%", min: 50, max: 59 },
    { range: "0-49%", min: 0, max: 49 },
  ]

  return ranges.map(({ range, min, max }) => {
    const studentsInRange = grades.filter((g) => g.percentage >= min && g.percentage <= max)
    return {
      range,
      count: studentsInRange.length,
      percentage: grades.length > 0 ? Math.round((studentsInRange.length / grades.length) * 100) : 0,
      students: studentsInRange.map((g) => g.studentName),
    }
  })
}

export function flagAnomalousGrades(grades: GradeEntry[], studentAverages: Map<string, number>): GradeEntry[] {
  const stats = calculateStatistics(grades)

  return grades.map((grade) => {
    if (grade.grade === null) return grade

    const studentAvg = studentAverages.get(grade.studentId)
    let flagReason: string | undefined

    // Flag if significantly below student's average
    if (studentAvg && grade.percentage < studentAvg - 20) {
      flagReason = "Significantly below student average"
    }
    // Flag if outlier (too high or too low compared to class)
    else if (grade.percentage > stats.average + 30) {
      flagReason = "Unusually high compared to class average"
    } else if (grade.percentage < stats.average - 30 && grade.percentage < 40) {
      flagReason = "Unusually low - may need intervention"
    }

    return {
      ...grade,
      status: flagReason ? "flagged" : grade.status,
      flagReason,
    }
  })
}

export function parseVoiceInput(transcript: string): { studentName?: string; grade?: number } {
  // Parse patterns like "John Smith 85" or "85 for John Smith" or "John Smith scored 85"
  const patterns = [
    /^(.+?)\s+(\d+(?:\.\d+)?)$/, // "John Smith 85"
    /^(\d+(?:\.\d+)?)\s+(?:for|to)\s+(.+)$/i, // "85 for John Smith"
    /^(.+?)\s+(?:scored|got|received)\s+(\d+(?:\.\d+)?)$/i, // "John Smith scored 85"
  ]

  for (const pattern of patterns) {
    const match = transcript.trim().match(pattern)
    if (match) {
      if (pattern.source.startsWith("^\\d")) {
        // Grade comes first
        return { grade: Number.parseFloat(match[1]), studentName: match[2].trim() }
      } else {
        // Name comes first
        return { studentName: match[1].trim(), grade: Number.parseFloat(match[2]) }
      }
    }
  }

  return {}
}

export function exportGradesToCSV(grades: GradeEntry[], assessmentName: string): string {
  const headers = ["Student Number", "Student Name", "Grade", "Max Grade", "Percentage", "Letter Grade", "Comments"]
  const rows = grades.map((g) => [
    g.studentId,
    g.studentName,
    g.grade ?? "",
    g.maxGrade,
    g.percentage,
    g.letterGrade,
    g.comments ?? "",
  ])

  const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  return csv
}

import type { Assignment, Submission, AssignmentStatistics, AssignmentStatus, SubmissionStatus } from "./types"

export function calculateAssignmentStats(submissions: Submission[]): AssignmentStatistics {
  const totalStudents = submissions.length
  const submitted = submissions.filter((s) => s.status === "submitted" || s.status === "graded").length
  const notSubmitted = submissions.filter((s) => s.status === "not-started").length
  const graded = submissions.filter((s) => s.status === "graded").length
  const pending = submitted - graded
  const late = submissions.filter((s) => s.isLate).length

  const submissionRate = totalStudents > 0 ? Math.round((submitted / totalStudents) * 100) : 0
  const onTimeRate = submitted > 0 ? Math.round(((submitted - late) / submitted) * 100) : 0

  const gradedSubmissions = submissions.filter((s) => s.grade !== undefined && s.grade !== null)
  const averageGrade =
    gradedSubmissions.length > 0
      ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length)
      : 0

  return {
    totalStudents,
    submitted,
    notSubmitted,
    graded,
    pending,
    late,
    submissionRate,
    averageGrade,
    onTimeRate,
  }
}

export function getAssignmentStatus(assignment: Assignment, submissions: Submission[]): AssignmentStatus {
  const now = new Date()
  const dueDate = new Date(assignment.dueDate)
  const allSubmitted = submissions.every((s) => s.status === "submitted" || s.status === "graded")
  const allGraded = submissions.every((s) => s.status === "graded")

  if (allGraded) return "graded"
  if (allSubmitted) return "submitted"
  if (now > dueDate) return "missing"
  return "assigned"
}

export function getDaysUntilDue(dueDate: Date): number {
  const now = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function getDaysLate(submittedAt: Date, dueDate: Date): number {
  const submitted = new Date(submittedAt)
  const due = new Date(dueDate)
  const diffTime = submitted.getTime() - due.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

export function getTypeIcon(type: string): string {
  const icons = {
    homework: "📝",
    project: "🎯",
    essay: "✍️",
    research: "🔬",
    practical: "🧪",
    reading: "📚",
    "problem-set": "🧮",
  }
  return icons[type as keyof typeof icons] || "📄"
}

export function formatDueDate(dueDate: Date): string {
  const days = getDaysUntilDue(dueDate)
  if (days < 0) return `${Math.abs(days)} days overdue`
  if (days === 0) return "Due today"
  if (days === 1) return "Due tomorrow"
  return `Due in ${days} days`
}

export function exportAssignmentsToCSV(assignments: Assignment[]): string {
  const headers = ["Title", "Class", "Subject", "Type", "Due Date", "Max Grade", "Status"]
  const rows = assignments.map((a) => [
    a.title,
    a.className,
    a.subjectName,
    a.type,
    new Date(a.dueDate).toLocaleDateString(),
    a.maxGrade,
    "Active",
  ])

  return [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")
}

export function exportSubmissionsToCSV(submissions: Submission[], assignmentTitle: string): string {
  const headers = ["Student Name", "Status", "Submitted At", "Grade", "Days Late", "Feedback"]
  const rows = submissions.map((s) => [
    s.studentName,
    s.status,
    s.submittedAt ? new Date(s.submittedAt).toLocaleString() : "Not submitted",
    s.grade ?? "Not graded",
    s.daysLate ?? 0,
    s.feedback ?? "",
  ])

  return [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")
}

