export const dummySubjects = [
  { id: "MATH", name: "Mathematics", code: "MATH101" },
  { id: "ENG", name: "English", code: "ENG101" },
  { id: "SCI", name: "Science", code: "SCI101" },
  { id: "HIS", name: "History", code: "HIS101" },
  { id: "GEO", name: "Geography", code: "GEO101" },
]

export interface StudentSubjectGrade {
  subjectId: string
  subjectName: string
  grades: {
    assessmentName: string
    score: number
    maxScore: number
    type: "exam" | "assignment" | "practical" | "test"
  }[]
  finalGrade: number
  average: number
  letterGrade: string
}

export interface EnhancedStudentGrade {
  studentId: string
  studentName: string
  studentNumber: string
  classId: string
  subjects: StudentSubjectGrade[]
  overallAverage: number
  overallFinalGrade: string
}

// Enhanced dummy data with multiple subjects per student
export const dummyGradesWithSubjects: EnhancedStudentGrade[] = [
  // Form 4A - Student 1
  {
    studentId: "STU-001",
    studentName: "Chiyembekezo Banda",
    studentNumber: "F4A001",
    classId: "1",
    subjects: [
      {
        subjectId: "MATH",
        subjectName: "Mathematics",
        grades: [
          { assessmentName: "Midterm Exam", score: 78, maxScore: 100, type: "exam" },
          { assessmentName: "Assignment 1", score: 85, maxScore: 100, type: "assignment" },
          { assessmentName: "Practical Test", score: 72, maxScore: 100, type: "practical" },
          { assessmentName: "Quiz", score: 80, maxScore: 100, type: "test" },
        ],
        finalGrade: 79,
        average: 78.75,
        letterGrade: "B",
      },
      {
        subjectId: "ENG",
        subjectName: "English",
        grades: [
          { assessmentName: "Essay", score: 82, maxScore: 100, type: "assignment" },
          { assessmentName: "Reading Comprehension", score: 75, maxScore: 100, type: "exam" },
          { assessmentName: "Speaking", score: 88, maxScore: 100, type: "test" },
          { assessmentName: "Grammar Test", score: 79, maxScore: 100, type: "test" },
        ],
        finalGrade: 81,
        average: 81,
        letterGrade: "B+",
      },
      {
        subjectId: "SCI",
        subjectName: "Science",
        grades: [
          { assessmentName: "Lab Practical", score: 74, maxScore: 100, type: "practical" },
          { assessmentName: "Theory Exam", score: 76, maxScore: 100, type: "exam" },
          { assessmentName: "Project", score: 80, maxScore: 100, type: "assignment" },
          { assessmentName: "Quiz", score: 75, maxScore: 100, type: "test" },
        ],
        finalGrade: 76,
        average: 76.25,
        letterGrade: "B",
      },
    ],
    overallAverage: 78.67,
    overallFinalGrade: "B",
  },
  // Form 4A - Student 2
  {
    studentId: "STU-002",
    studentName: "Themba Mwale",
    studentNumber: "F4A002",
    classId: "1",
    subjects: [
      {
        subjectId: "MATH",
        subjectName: "Mathematics",
        grades: [
          { assessmentName: "Midterm Exam", score: 92, maxScore: 100, type: "exam" },
          { assessmentName: "Assignment 1", score: 88, maxScore: 100, type: "assignment" },
          { assessmentName: "Practical Test", score: 95, maxScore: 100, type: "practical" },
          { assessmentName: "Quiz", score: 90, maxScore: 100, type: "test" },
        ],
        finalGrade: 91,
        average: 91.25,
        letterGrade: "A",
      },
      {
        subjectId: "ENG",
        subjectName: "English",
        grades: [
          { assessmentName: "Essay", score: 87, maxScore: 100, type: "assignment" },
          { assessmentName: "Reading Comprehension", score: 92, maxScore: 100, type: "exam" },
          { assessmentName: "Speaking", score: 89, maxScore: 100, type: "test" },
          { assessmentName: "Grammar Test", score: 90, maxScore: 100, type: "test" },
        ],
        finalGrade: 89,
        average: 89.5,
        letterGrade: "A",
      },
      {
        subjectId: "SCI",
        subjectName: "Science",
        grades: [
          { assessmentName: "Lab Practical", score: 94, maxScore: 100, type: "practical" },
          { assessmentName: "Theory Exam", score: 91, maxScore: 100, type: "exam" },
          { assessmentName: "Project", score: 93, maxScore: 100, type: "assignment" },
          { assessmentName: "Quiz", score: 92, maxScore: 100, type: "test" },
        ],
        finalGrade: 92,
        average: 92.5,
        letterGrade: "A",
      },
    ],
    overallAverage: 90.75,
    overallFinalGrade: "A",
  },
  // Form 4A - Student 3
  {
    studentId: "STU-003",
    studentName: "Amara Phiri",
    studentNumber: "F4A003",
    classId: "1",
    subjects: [
      {
        subjectId: "MATH",
        subjectName: "Mathematics",
        grades: [
          { assessmentName: "Midterm Exam", score: 65, maxScore: 100, type: "exam" },
          { assessmentName: "Assignment 1", score: 70, maxScore: 100, type: "assignment" },
          { assessmentName: "Practical Test", score: 68, maxScore: 100, type: "practical" },
          { assessmentName: "Quiz", score: 66, maxScore: 100, type: "test" },
        ],
        finalGrade: 67,
        average: 67.25,
        letterGrade: "C",
      },
      {
        subjectId: "ENG",
        subjectName: "English",
        grades: [
          { assessmentName: "Essay", score: 72, maxScore: 100, type: "assignment" },
          { assessmentName: "Reading Comprehension", score: 68, maxScore: 100, type: "exam" },
          { assessmentName: "Speaking", score: 74, maxScore: 100, type: "test" },
          { assessmentName: "Grammar Test", score: 70, maxScore: 100, type: "test" },
        ],
        finalGrade: 71,
        average: 71,
        letterGrade: "C+",
      },
      {
        subjectId: "SCI",
        subjectName: "Science",
        grades: [
          { assessmentName: "Lab Practical", score: 64, maxScore: 100, type: "practical" },
          { assessmentName: "Theory Exam", score: 69, maxScore: 100, type: "exam" },
          { assessmentName: "Project", score: 66, maxScore: 100, type: "assignment" },
          { assessmentName: "Quiz", score: 68, maxScore: 100, type: "test" },
        ],
        finalGrade: 66,
        average: 66.75,
        letterGrade: "C",
      },
    ],
    overallAverage: 68,
    overallFinalGrade: "C",
  },
  // Form 2A - Student 4
  {
    studentId: "STU-006",
    studentName: "Lusila Banda",
    studentNumber: "F2A001",
    classId: "3",
    subjects: [
      {
        subjectId: "MATH",
        subjectName: "Mathematics",
        grades: [
          { assessmentName: "Midterm Exam", score: 76, maxScore: 100, type: "exam" },
          { assessmentName: "Assignment 1", score: 81, maxScore: 100, type: "assignment" },
          { assessmentName: "Practical Test", score: 74, maxScore: 100, type: "practical" },
          { assessmentName: "Quiz", score: 77, maxScore: 100, type: "test" },
        ],
        finalGrade: 77,
        average: 77,
        letterGrade: "B",
      },
      {
        subjectId: "ENG",
        subjectName: "English",
        grades: [
          { assessmentName: "Essay", score: 80, maxScore: 100, type: "assignment" },
          { assessmentName: "Reading Comprehension", score: 78, maxScore: 100, type: "exam" },
          { assessmentName: "Speaking", score: 82, maxScore: 100, type: "test" },
          { assessmentName: "Grammar Test", score: 79, maxScore: 100, type: "test" },
        ],
        finalGrade: 80,
        average: 79.75,
        letterGrade: "B+",
      },
    ],
    overallAverage: 78.5,
    overallFinalGrade: "B",
  },
  // Form 2A - Student 5
  {
    studentId: "STU-007",
    studentName: "Mulenga Chitaba",
    studentNumber: "F2A002",
    classId: "3",
    subjects: [
      {
        subjectId: "MATH",
        subjectName: "Mathematics",
        grades: [
          { assessmentName: "Midterm Exam", score: 89, maxScore: 100, type: "exam" },
          { assessmentName: "Assignment 1", score: 91, maxScore: 100, type: "assignment" },
          { assessmentName: "Practical Test", score: 87, maxScore: 100, type: "practical" },
          { assessmentName: "Quiz", score: 88, maxScore: 100, type: "test" },
        ],
        finalGrade: 88,
        average: 88.75,
        letterGrade: "A",
      },
      {
        subjectId: "ENG",
        subjectName: "English",
        grades: [
          { assessmentName: "Essay", score: 85, maxScore: 100, type: "assignment" },
          { assessmentName: "Reading Comprehension", score: 90, maxScore: 100, type: "exam" },
          { assessmentName: "Speaking", score: 88, maxScore: 100, type: "test" },
          { assessmentName: "Grammar Test", score: 87, maxScore: 100, type: "test" },
        ],
        finalGrade: 87,
        average: 87.5,
        letterGrade: "A",
      },
    ],
    overallAverage: 88.13,
    overallFinalGrade: "A",
  },
]

export const dummyGradesForReport = [
  // Form 4A grades
  {
    studentId: "STU-001",
    studentName: "Chiyembekezo Banda",
    studentNumber: "F4A001",
    classId: "1",
    assessmentId: "ASSESS001",
    score: 78,
    maxScore: 100,
  },
  {
    studentId: "STU-001",
    studentName: "Chiyembekezo Banda",
    studentNumber: "F4A001",
    classId: "1",
    assessmentId: "ASSESS002",
    score: 85,
    maxScore: 100,
  },
  {
    studentId: "STU-001",
    studentName: "Chiyembekezo Banda",
    studentNumber: "F4A001",
    classId: "1",
    assessmentId: "ASSESS003",
    score: 72,
    maxScore: 100,
  },
  {
    studentId: "STU-002",
    studentName: "Themba Mwale",
    studentNumber: "F4A002",
    classId: "1",
    assessmentId: "ASSESS001",
    score: 92,
    maxScore: 100,
  },
  {
    studentId: "STU-002",
    studentName: "Themba Mwale",
    studentNumber: "F4A002",
    classId: "1",
    assessmentId: "ASSESS002",
    score: 88,
    maxScore: 100,
  },
  {
    studentId: "STU-002",
    studentName: "Themba Mwale",
    studentNumber: "F4A002",
    classId: "1",
    assessmentId: "ASSESS003",
    score: 95,
    maxScore: 100,
  },
  {
    studentId: "STU-003",
    studentName: "Amara Phiri",
    studentNumber: "F4A003",
    classId: "1",
    assessmentId: "ASSESS001",
    score: 65,
    maxScore: 100,
  },
  {
    studentId: "STU-003",
    studentName: "Amara Phiri",
    studentNumber: "F4A003",
    classId: "1",
    assessmentId: "ASSESS002",
    score: 70,
    maxScore: 100,
  },
  {
    studentId: "STU-003",
    studentName: "Amara Phiri",
    studentNumber: "F4A003",
    classId: "1",
    assessmentId: "ASSESS003",
    score: 68,
    maxScore: 100,
  },
  {
    studentId: "STU-004",
    studentName: "Kabelo Dlamini",
    studentNumber: "F4A004",
    classId: "1",
    assessmentId: "ASSESS001",
    score: 82,
    maxScore: 100,
  },
  {
    studentId: "STU-004",
    studentName: "Kabelo Dlamini",
    studentNumber: "F4A004",
    classId: "1",
    assessmentId: "ASSESS002",
    score: 79,
    maxScore: 100,
  },
  {
    studentId: "STU-004",
    studentName: "Kabelo Dlamini",
    studentNumber: "F4A004",
    classId: "1",
    assessmentId: "ASSESS003",
    score: 85,
    maxScore: 100,
  },
  {
    studentId: "STU-005",
    studentName: "Zainab Hassan",
    studentNumber: "F4A005",
    classId: "1",
    assessmentId: "ASSESS001",
    score: 45,
    maxScore: 100,
  },
  {
    studentId: "STU-005",
    studentName: "Zainab Hassan",
    studentNumber: "F4A005",
    classId: "1",
    assessmentId: "ASSESS002",
    score: 52,
    maxScore: 100,
  },
  {
    studentId: "STU-005",
    studentName: "Zainab Hassan",
    studentNumber: "F4A005",
    classId: "1",
    assessmentId: "ASSESS003",
    score: 48,
    maxScore: 100,
  },

  // Form 2A grades
  {
    studentId: "STU-006",
    studentName: "Lusila Banda",
    studentNumber: "F2A001",
    classId: "3",
    assessmentId: "ASSESS001",
    score: 76,
    maxScore: 100,
  },
  {
    studentId: "STU-006",
    studentName: "Lusila Banda",
    studentNumber: "F2A001",
    classId: "3",
    assessmentId: "ASSESS002",
    score: 81,
    maxScore: 100,
  },
  {
    studentId: "STU-006",
    studentName: "Lusila Banda",
    studentNumber: "F2A001",
    classId: "3",
    assessmentId: "ASSESS003",
    score: 74,
    maxScore: 100,
  },
  {
    studentId: "STU-007",
    studentName: "Mulenga Chitaba",
    studentNumber: "F2A002",
    classId: "3",
    assessmentId: "ASSESS001",
    score: 89,
    maxScore: 100,
  },
  {
    studentId: "STU-007",
    studentName: "Mulenga Chitaba",
    studentNumber: "F2A002",
    classId: "3",
    assessmentId: "ASSESS002",
    score: 91,
    maxScore: 100,
  },
  {
    studentId: "STU-007",
    studentName: "Mulenga Chitaba",
    studentNumber: "F2A002",
    classId: "3",
    assessmentId: "ASSESS003",
    score: 87,
    maxScore: 100,
  },
  {
    studentId: "STU-008",
    studentName: "Grace Mvula",
    studentNumber: "F2A003",
    classId: "3",
    assessmentId: "ASSESS001",
    score: 58,
    maxScore: 100,
  },
  {
    studentId: "STU-008",
    studentName: "Grace Mvula",
    studentNumber: "F2A003",
    classId: "3",
    assessmentId: "ASSESS002",
    score: 62,
    maxScore: 100,
  },
  {
    studentId: "STU-008",
    studentName: "Grace Mvula",
    studentNumber: "F2A003",
    classId: "3",
    assessmentId: "ASSESS003",
    score: 61,
    maxScore: 100,
  },
]

export const dummyClassesForReport = [
  { id: "1", name: "Form 4A", level: "Form 4", students: 5 },
  { id: "3", name: "Form 2A", level: "Form 2", students: 3 },
]

export const dummyAssessmentsForReport = [
  { id: "ASSESS001", name: "Mathematics Midterm", type: "exam", date: "2024-08-15" },
  { id: "ASSESS002", name: "English Project", type: "assignment", date: "2024-08-20" },
  { id: "ASSESS003", name: "Science Practical", type: "practical", date: "2024-08-25" },
]
