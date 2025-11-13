export interface StudentGradeReport {
  studentId: string
  studentName: string
  studentNumber: string
  classId: string
  className: string
  assessments: {
    assessmentId: string
    assessmentName: string
    assessmentType: string
    score: number
    maxScore: number
    percentage: number
    letterGrade: string
    date: string
  }[]
  finalGrade: number
  finalPercentage: number
  finalLetterGrade: string
  average: number
  passedCount: number
  failedCount: number
  remarks: string
}

export interface institutionReportData {
  reportDate: string
  institutionName: string
  academicYear: string
  classes: {
    classId: string
    className: string
    totalStudents: number
    classAverage: number
    passRate: number
    students: StudentGradeReport[]
  }[]
  overallAverage: number
  overallPassRate: number
  totalStudents: number
}

export function generateStudentGradeReport(
  studentId: string,
  studentName: string,
  studentNumber: string,
  className: string,
  classId: string,
  grades: any[],
  assessments: any[],
): StudentGradeReport {
  const studentGrades = grades.filter((g) => g.studentId === studentId)

  const assessmentGrades = studentGrades.map((grade) => {
    const assessment = assessments.find((a) => a.id === grade.assessmentId)
    const percentage = Math.round((grade.score / grade.maxScore) * 100)
    const letterGrade = getLetterGradeFromPercentage(percentage)

    return {
      assessmentId: assessment?.id || "",
      assessmentName: assessment?.name || "Unknown",
      assessmentType: assessment?.type || "exam",
      score: grade.score,
      maxScore: grade.maxScore,
      percentage,
      letterGrade,
      date: assessment?.date || new Date().toISOString().split("T")[0],
    }
  })

  const finalGrade = calculateFinalGrade(assessmentGrades)
  const finalPercentage = Math.round(finalGrade)
  const finalLetterGrade = getLetterGradeFromPercentage(finalPercentage)
  const average =
    studentGrades.length > 0 ? studentGrades.reduce((sum, g) => sum + g.score, 0) / studentGrades.length : 0
  const passedCount = assessmentGrades.filter((g) => g.percentage >= 50).length
  const failedCount = assessmentGrades.filter((g) => g.percentage < 50).length

  let remarks = ""
  if (finalPercentage >= 80) remarks = "Excellent performance"
  else if (finalPercentage >= 70) remarks = "Good performance"
  else if (finalPercentage >= 60) remarks = "Satisfactory performance"
  else if (finalPercentage >= 50) remarks = "Needs improvement"
  else remarks = "Requires urgent intervention"

  return {
    studentId,
    studentName,
    studentNumber,
    classId,
    className,
    assessments: assessmentGrades,
    finalGrade,
    finalPercentage,
    finalLetterGrade,
    average: Math.round(average),
    passedCount,
    failedCount,
    remarks,
  }
}

export function generateinstitutionReport(classesData: any[], gradesData: any[], assessmentsData: any[]): institutionReportData {
  const institutionName = "Saint Theresia Academy"
  const academicYear = "2024-2025"
  const reportDate = new Date().toLocaleDateString()

  const classReports = classesData.map((cls) => {
    const classStudents = gradesData.filter((g) => g.classId === cls.id)
    const uniqueStudents = [...new Set(classStudents.map((g) => g.studentId))]

    const studentReports = uniqueStudents.map((studentId) => {
      const student = classStudents.find((g) => g.studentId === studentId)
      return generateStudentGradeReport(
        studentId,
        student?.studentName || "Unknown",
        student?.studentNumber || "N/A",
        cls.name,
        cls.id,
        gradesData.filter((g) => g.classId === cls.id),
        assessmentsData,
      )
    })

    const classAverage =
      studentReports.length > 0
        ? studentReports.reduce((sum, s) => sum + s.finalPercentage, 0) / studentReports.length
        : 0
    const passRate =
      studentReports.length > 0
        ? (studentReports.filter((s) => s.finalPercentage >= 50).length / studentReports.length) * 100
        : 0

    return {
      classId: cls.id,
      className: cls.name,
      totalStudents: studentReports.length,
      classAverage: Math.round(classAverage),
      passRate: Math.round(passRate),
      students: studentReports,
    }
  })

  const allStudents = classReports.reduce((sum, c) => sum + c.totalStudents, 0)
  const overallAverage =
    classReports.reduce((sum, c) => sum + c.classAverage * c.totalStudents, 0) / Math.max(allStudents, 1)
  const overallPassRate =
    classReports.reduce((sum, c) => sum + c.passRate * c.totalStudents, 0) / Math.max(allStudents, 1)

  return {
    reportDate,
    institutionName,
    academicYear,
    classes: classReports,
    overallAverage: Math.round(overallAverage),
    overallPassRate: Math.round(overallPassRate),
    totalStudents: allStudents,
  }
}

function calculateFinalGrade(assessmentGrades: any[]): number {
  if (assessmentGrades.length === 0) return 0
  return assessmentGrades.reduce((sum, g) => sum + g.percentage, 0) / assessmentGrades.length
}

function getLetterGradeFromPercentage(percentage: number): string {
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
