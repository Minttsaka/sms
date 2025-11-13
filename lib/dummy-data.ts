export const dummyTeachers = [
  { id: "1", name: "Mr. Kamau Mutua", email: "k.mutua@institution.edu" },
  { id: "2", name: "Ms. Esnart Banda", email: "e.banda@institution.edu" },
]

export const dummyClasses = [
  { id: "1", name: "Form 4A", level: "Form 4", students: 42 },
  { id: "2", name: "Form 4B", level: "Form 4", students: 39 },
  { id: "3", name: "Form 2A", level: "Form 2", students: 45 },
  { id: "4", name: "Form 2B", level: "Form 2", students: 41 },
]

export const dummyStudents = Array.from({ length: 42 }, (_, i) => ({
  id: `STU-${String(i + 1).padStart(3, "0")}`,
  name: ["Chiyembekezo Banda", "Themba Mwale", "Amara Phiri", "Kabelo Dlamini", "Zainab Hassan"][i % 5],
  classId: "1",
  avatarColor: ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"][i % 5],
}))

export const dummyAssessments = [
  {
    id: "1",
    name: "Mathematics Midterm",
    type: "exam",
    classId: "1",
    date: "2024-08-15",
    totalMarks: 100,
    averageScore: 72.4,
    passRate: 85,
    studentsAbsent: 2,
  },
  {
    id: "2",
    name: "English Project",
    type: "assignment",
    classId: "1",
    date: "2024-08-20",
    totalMarks: 50,
    averageScore: 68.9,
    passRate: 78,
    studentsAbsent: 0,
  },
  {
    id: "3",
    name: "Science Practical",
    type: "practical",
    classId: "1",
    date: "2024-08-25",
    totalMarks: 40,
    averageScore: 75.2,
    passRate: 92,
    studentsAbsent: 1,
  },
]

export const dummyGrades = Array.from({ length: 42 }, (_, i) => ({
  studentId: `STU-${String(i + 1).padStart(3, "0")}`,
  assessmentId: "1",
  score: Math.floor(Math.random() * 40) + 50,
  grade: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
  comment: "Good progress",
}))

export const institutionStats = {
  totalStudents: 167,
  totalClasses: 4,
  averagePassRate: 81.3,
  averageScore: 71.8,
  topClass: "Form 4A",
  attendance: 94.2,
}
