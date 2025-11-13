"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Save, Check, Fingerprint, QrCode, Hand } from "lucide-react"
import { AttendanceManual } from "@/components/attendance-manual"
import { AttendanceBiometric } from "@/components/attendance-biometric"
import { AttendanceQRScanner } from "@/components/attendance-qr-scanner"
import { AttendanceSummary } from "@/components/attendance-summary"
import { useAttendance } from "@/hooks/use-attendance"
import { calculateAttendanceStats, formatDate, exportToCSV } from "@/lib/utils"
import type { Student, ClassInfo, AttendanceStatus } from "@/lib/types"

// Mock data - in production, this would come from API/database
const mockClasses: ClassInfo[] = [
  { id: "1", name: "Form 4A", grade: "Form 4", section: "A", subject: "Mathematics", totalStudents: 35 },
  { id: "2", name: "Form 2B", grade: "Form 2", section: "B", subject: "Science", totalStudents: 32 },
  { id: "3", name: "Form 3C", grade: "Form 3", section: "C", subject: "Mathematics", totalStudents: 30 },
]

const mockStudents: Student[] = [
  { id: "1", name: "John Doe", rollNumber: "F4A001", studentNumber: "F4A001", photo: "/student-boy.png", fingerprintId: "FP001" },
  { id: "2", name: "Jane Smith", rollNumber: "F4A002", studentNumber: "F4A002", photo: "/diverse-student-girl.png", fingerprintId: "FP002" },
  {
    id: "3",
    name: "Michael Johnson",
    rollNumber: "F4A003",
    studentNumber: "F4A003",
    photo: "/student-boy-2.jpg",
    fingerprintId: "FP003",
  },
  { id: "4", name: "Emily Brown", rollNumber: "F4A004", studentNumber: "F4A004", photo: "/student-girl-2.jpg", fingerprintId: "FP004" },
  { id: "5", name: "David Wilson", rollNumber: "F4A005", studentNumber: "F4A005", photo: "/student-boy-3.jpg", fingerprintId: "FP005" },
  { id: "6", name: "Sarah Davis", rollNumber: "F4A006", studentNumber: "F4A006", photo: "/student-girl-3.jpg", fingerprintId: "FP006" },
  {
    id: "7",
    name: "James Martinez",
    rollNumber: "F4A007",
    studentNumber: "F4A007",
    photo: "/student-boy-4.jpg",
    fingerprintId: "FP007",
  },
  { id: "8", name: "Lisa Anderson", rollNumber: "F4A008", studentNumber: "F4A008", photo: "/student-girl-4.jpg", fingerprintId: "FP008" },
]

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(mockClasses[0])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendanceMethod, setAttendanceMethod] = useState<"manual" | "biometric" | "qr">("manual")

  const dateString = selectedDate.toISOString().split("T")[0]
  const { records, recordAttendance, bulkRecord, submitAttendance, isSubmitting } = useAttendance(
    selectedClass.id,
    dateString,
  )

  const stats = useMemo(() => {
    const recordsArray = Array.from(records.values())
    return calculateAttendanceStats(recordsArray)
  }, [records])

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    recordAttendance(studentId, status, "manual")
  }

  const handleNotesChange = (studentId: string, notes: string) => {
    const existingRecord = records.get(studentId)
    if (existingRecord) {
      recordAttendance(studentId, existingRecord.status, "manual", notes)
    }
  }

  const handleBiometricRecord = (studentId: string) => {
    recordAttendance(studentId, "present", "fingerprint")
  }

  const handleQRRecord = (studentId: string) => {
    recordAttendance(studentId, "present", "qr")
  }

  const handleSubmit = async () => {
    const success = await submitAttendance()
    if (success) {
      alert("Attendance submitted successfully!")
    } else {
      alert("Failed to submit attendance. Please try again.")
    }
  }

  const handleExport = () => {
    exportToCSV(Array.from(records.values()), selectedClass.name, dateString)
  }

  const recordedStudents = useMemo(() => {
    return new Set(Array.from(records.keys()))
  }, [records])

  const recordsMap = useMemo(() => {
    const map = new Map<string, { status: AttendanceStatus; notes?: string }>()
    records.forEach((record, studentId) => {
      map.set(studentId, { status: record.status, notes: record.notes })
    })
    return map
  }, [records])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Record Attendance
            </h1>
            <p className="text-muted-foreground mt-1">Track student attendance with multiple recording methods</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || records.size === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Attendance"}
            </Button>
          </div>
        </div>

        {/* Class Selection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Select Class</h2>
          <div className="flex flex-wrap gap-3">
            {mockClasses.map((classInfo) => (
              <button
                key={classInfo.id}
                onClick={() => setSelectedClass(classInfo)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedClass.id === classInfo.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{classInfo.name}</span>
                  {selectedClass.id === classInfo.id && <Check className="h-4 w-4" />}
                </div>
                <div className="text-xs opacity-80 mt-1">{classInfo.subject}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Date Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Date</h2>
              <p className="text-sm text-muted-foreground">{formatDate(selectedDate)}</p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Change Date
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} />
              </PopoverContent>
            </Popover>
          </div>
        </Card>

        {/* Statistics Summary */}
        <AttendanceSummary stats={stats} />

        {/* Attendance Recording Methods */}
        <Card className="p-6">
          <Tabs value={attendanceMethod} onValueChange={(v) => setAttendanceMethod(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Hand className="h-4 w-4" />
                Manual
              </TabsTrigger>
              <TabsTrigger value="biometric" className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                Fingerprint
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
              <AttendanceManual
                students={mockStudents}
                records={recordsMap}
                onStatusChange={handleStatusChange}
                onNotesChange={handleNotesChange}
                onBulkAction={bulkRecord}
              />
            </TabsContent>

            <TabsContent value="biometric" className="mt-6">
              <AttendanceBiometric
                students={mockStudents}
                onAttendanceRecorded={handleBiometricRecord}
                recordedStudents={recordedStudents}
              />
            </TabsContent>

            <TabsContent value="qr" className="mt-6">
              <AttendanceQRScanner
                students={mockStudents}
                onAttendanceRecorded={handleQRRecord}
                recordedStudents={recordedStudents}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
