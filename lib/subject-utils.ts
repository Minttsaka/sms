export function calculateSubjectAverage(grades: number[]): number {
  if (grades.length === 0) return 0
  const sum = grades.reduce((acc, grade) => acc + grade, 0)
  return Math.round((sum / grades.length) * 100) / 100
}

export function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return "A"
  if (percentage >= 80) return "B"
  if (percentage >= 70) return "C"
  if (percentage >= 60) return "D"
  if (percentage >= 50) return "E"
  return "F"
}

export function getGradeColor(percentage: number): string {
  if (percentage >= 90) return "bg-emerald-100 text-emerald-700"
  if (percentage >= 80) return "bg-blue-100 text-blue-700"
  if (percentage >= 70) return "bg-amber-100 text-amber-700"
  if (percentage >= 60) return "bg-orange-100 text-orange-700"
  if (percentage >= 50) return "bg-red-100 text-red-700"
  return "bg-red-200 text-red-800"
}

export function filterStudentsBySearch(students: any[], searchTerm: string): any[] {
  if (!searchTerm.trim()) return students

  const term = searchTerm.toLowerCase()
  return students.filter(
    (student) => student.studentName.toLowerCase().includes(term) || student.studentNumber.toLowerCase().includes(term),
  )
}
