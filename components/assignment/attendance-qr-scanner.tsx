"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QrCode, Camera, CheckCircle2 } from "lucide-react"
import type { Student } from "@/lib/types"

interface AttendanceQRScannerProps {
  students: Student[]
  onAttendanceRecorded: (studentId: string) => void
  recordedStudents: Set<string>
}

export function AttendanceQRScanner({ students, onAttendanceRecorded, recordedStudents }: AttendanceQRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [lastScanned, setLastScanned] = useState<Student | null>(null)

  const startScanning = () => {
    setIsScanning(true)
    console.log("[v0] QR scanning started")

    // Simulate QR code scan
    // In production, this would use device camera and QR code library
    setTimeout(() => {
      const unrecordedStudents = students.filter((s) => !recordedStudents.has(s.id))
      if (unrecordedStudents.length > 0) {
        const randomStudent = unrecordedStudents[Math.floor(Math.random() * unrecordedStudents.length)]
        setLastScanned(randomStudent)
        onAttendanceRecorded(randomStudent.id)
        console.log("[v0] QR code scanned:", randomStudent.name)
      }
      setIsScanning(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
            <QrCode className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">QR Code Scanner</h3>
            <p className="text-sm text-muted-foreground">Scan student ID cards</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          <div className={`relative ${isScanning ? "animate-pulse" : ""}`}>
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              {isScanning ? <Camera className="h-20 w-20 text-white" /> : <QrCode className="h-20 w-20 text-white" />}
            </div>
            {isScanning && <div className="absolute inset-0 rounded-2xl border-4 border-blue-500 animate-ping" />}
          </div>

          <Button
            onClick={startScanning}
            disabled={isScanning}
            className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            size="lg"
          >
            {isScanning ? "Scanning..." : "Start Camera"}
          </Button>

          {lastScanned && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">{lastScanned.name} marked present</span>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Instructions:</strong> Students should show their QR code ID card to the camera. The system will
            automatically scan and record attendance.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-foreground">Scanned Today</h3>
        <div className="space-y-2">
          {students
            .filter((s) => recordedStudents.has(s.id))
            .map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground">Roll No: {student.rollNumber}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}
