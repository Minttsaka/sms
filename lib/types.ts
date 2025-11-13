export type GradeStatus = "entered" | "pending" | "verified" | "flagged"
export type AssessmentType = "quiz" | "test" | "exam" | "assignment" | "project" | "practical"
export type GradeScale = "percentage" | "letter" | "points" | "gpa"

export type AttendanceStatus = "present" | "absent" | "late" | "excused"

export type EnrollmentStep =
  | "basic-info"
  | "photo"
  | "documents"
  | "guardian"
  | "biometric"
  | "class-assignment"
  | "review"
export type DocumentType =
  | "birth-certificate"
  | "transfer-certificate"
  | "medical-records"
  | "previous-report"
  | "id-proof"
export type EnrollmentStatus = "draft" | "pending-review" | "approved" | "rejected" | "active"

export interface StudentEnrollmentData {
  // Basic Information
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: Date
  gender: "male" | "female" | "other"
  bloodGroup?: string
  nationality?: string
  religion?: string

  // Contact Information
  email?: string
  phone?: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string

  // Academic Information
  previousinstitution?: string
  previousGrade?: string
  gradeApplying: string
  academicYear: string

  // Medical Information
  medicalConditions?: string
  allergies?: string
  emergencyContact?: string

  // Documents
  photo?: string
  documents: EnrollmentDocument[]

  // Biometric
  fingerprintData?: string
  fingerprintEnrolled: boolean

  // Guardian Information
  guardians: GuardianInfo[]

  // System Generated
  studentId?: string
  admissionNumber?: string
  qrCode?: string
  status: EnrollmentStatus
}

export interface EnrollmentDocument {
  id: string
  type: DocumentType
  name: string
  url: string
  uploadedAt: Date
  verified: boolean
  extractedData?: Record<string, any>
}

export interface GuardianInfo {
  id?: string
  firstName: string
  lastName: string
  relationship: "father" | "mother" | "guardian" | "other"
  occupation?: string
  email: string
  phone: string
  address?: string
  isEmergencyContact: boolean
  isPrimaryContact: boolean
}

export interface ClassAssignment {
  classId: string
  className: string
  grade: string
  section: string
  capacity: number
  enrolled: number
  available: number
  academicYear: string
}

export interface EnrollmentStatistics {
  totalEnrollments: number
  pendingReview: number
  approved: number
  rejected: number
  activeStudents: number
  byGrade: Record<string, number>
  byMonth: Array<{ month: string; count: number }>
}

export interface BulkEnrollmentData {
  students: Partial<StudentEnrollmentData>[]
  errors: Array<{ row: number; field: string; message: string }>
  validCount: number
  errorCount: number
}


export interface Student {
  id: string
  name: string
  rollNumber: string
  photo?: string
  fingerprintId?: string
  qrCode?: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  classId: string
  date: string
  status: AttendanceStatus
  recordedAt: string
  recordedBy: string
  method: "manual" | "fingerprint" | "qr" | "face"
  notes?: string
  latitude?: number
  longitude?: number
}

export interface ClassInfo {
  id: string
  name: string
  grade: string
  section: string
  subject: string
  totalStudents: number
}

export interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  percentage: number
}

export interface Student {
  id: string
  name: string
  studentNumber: string
  photo?: string
  previousGrades?: number[]
  averageGrade?: number
}

export interface GradeEntry {
  studentId: string
  studentName: string
  grade: number | null
  maxGrade: number
  percentage: number
  letterGrade: string
  status: GradeStatus
  comments?: string
  entryMethod: "manual" | "voice" | "scan" | "import"
  enteredAt?: Date
  flagReason?: string
}

export interface Assessment {
  id: string
  name: string
  type: AssessmentType
  maxGrade: number
  weight: number
  date: Date
  classId: string
  subjectId: string
}

export interface GradeDistribution {
  range: string
  count: number
  percentage: number
  students: string[]
}

export interface GradeStatistics {
  average: number
  median: number
  highest: number
  lowest: number
  passRate: number
  totalStudents: number
  enteredCount: number
  pendingCount: number
  distribution: GradeDistribution[]
}

export interface ScannedGrade {
  studentName: string
  grade: number
  confidence: number
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export type AssignmentStatus = "assigned" | "submitted" | "graded" | "returned" | "missing" | "late"
export type AssignmentType = "homework" | "project" | "essay" | "research" | "practical" | "reading" | "problem-set"
export type SubmissionStatus = "not-started" | "in-progress" | "submitted" | "late" | "graded"

export interface Assignment {
  id: string
  title: string
  description: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  type: AssignmentType
  dueDate: Date
  assignedDate: Date
  maxGrade: number
  weight: number
  attachments?: AssignmentAttachment[]
  rubricId?: string
  instructions?: string
  allowLateSubmission: boolean
  latePenalty?: number
}

export interface AssignmentAttachment {
  id: string
  name: string
  url: string
  type: "pdf" | "doc" | "image" | "link" | "video"
  size?: number
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  studentName: string
  status: SubmissionStatus
  submittedAt?: Date
  grade?: number
  feedback?: string
  attachments?: AssignmentAttachment[]
  isLate: boolean
  daysLate?: number
}

export interface AssignmentStatistics {
  totalStudents: number
  submitted: number
  notSubmitted: number
  graded: number
  pending: number
  late: number
  submissionRate: number
  averageGrade: number
  onTimeRate: number
}

export interface AssignmentDashboardData {
  totalAssignments: number
  activeAssignments: number
  pendingGrading: number
  upcomingDue: number
  recentAssignments: Assignment[]
  submissionStats: AssignmentStatistics
}


export interface Student {
  id: string
  name: string
  studentNumber: string
  photo?: string
  previousGrades?: number[]
  averageGrade?: number
}

export interface GradeEntry {
  studentId: string
  studentName: string
  grade: number | null
  maxGrade: number
  percentage: number
  letterGrade: string
  status: GradeStatus
  comments?: string
  entryMethod: "manual" | "voice" | "scan" | "import"
  enteredAt?: Date
  flagReason?: string
}

export interface Assessment {
  id: string
  name: string
  type: AssessmentType
  maxGrade: number
  weight: number
  date: Date
  classId: string
  subjectId: string
}

export interface GradeDistribution {
  range: string
  count: number
  percentage: number
  students: string[]
}

export interface GradeStatistics {
  average: number
  median: number
  highest: number
  lowest: number
  passRate: number
  totalStudents: number
  enteredCount: number
  pendingCount: number
  distribution: GradeDistribution[]
}

export interface ScannedGrade {
  studentName: string
  grade: number
  confidence: number
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface AssessmentComponent {
  id: string
  name: string
  description?: string
  maxGrade: number
  weight: number // percentage of total assessment
  rubric?: GradingRubric
}

export interface GradingRubric {
  id: string
  name: string
  criteria: RubricCriterion[]
  totalPoints: number
}

export interface RubricCriterion {
  id: string
  name: string
  description: string
  maxPoints: number
  levels: RubricLevel[]
}

export interface RubricLevel {
  id: string
  name: string
  description: string
  points: number
}

export interface ComponentGrade {
  componentId: string
  componentName: string
  grade: number
  maxGrade: number
  percentage: number
  rubricScores?: Map<string, number> // criterionId -> points
}

export interface DetailedGradeEntry extends GradeEntry {
  componentGrades?: ComponentGrade[]
  totalWeightedGrade?: number
  rubricFeedback?: string
}

export interface AssessmentTemplate {
  id: string
  name: string
  type: AssessmentType
  description: string
  components: AssessmentComponent[]
  defaultMaxGrade: number
  defaultWeight: number
}

export interface WeightedAssessment {
  assessment: Assessment
  components: AssessmentComponent[]
  weight: number // contribution to final grade
  averageGrade: number
}

export interface FinalGradeCalculation {
  studentId: string
  studentName: string
  assessmentGrades: Map<string, number> // assessmentId -> weighted grade
  finalGrade: number
  finalPercentage: number
  finalLetterGrade: string
  breakdown: GradeBreakdown[]
}

export interface GradeBreakdown {
  assessmentName: string
  assessmentType: AssessmentType
  grade: number
  weight: number
  contribution: number
}

export interface AssessmentComparison {
  assessmentId: string
  assessmentName: string
  type: AssessmentType
  date: Date
  average: number
  median: number
  highest: number
  lowest: number
  passRate: number
}

