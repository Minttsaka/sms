"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Fingerprint, Wifi, WifiOff, CheckCircle2 } from "lucide-react"
import type { Student } from "@/lib/types"

interface AttendanceBiometricProps {
  students: Student[]
  onAttendanceRecorded: (studentId: string) => void
  recordedStudents: Set<string>
}

export function AttendanceBiometric({ students, onAttendanceRecorded, recordedStudents }: AttendanceBiometricProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [lastScanned, setLastScanned] = useState<Student | null>(null)

  // Simulate fingerprint scanner connection
  useEffect(() => {
    const connectScanner = async () => {
      console.log("[v0] Attempting to connect to fingerprint scanner...")
      // In production, this would connect to actual hardware via WebUSB or native bridge
      setTimeout(() => {
        setIsConnected(true)
        console.log("[v0] Fingerprint scanner connected")
      }, 1000)
    }

    connectScanner()
  }, [])

  const startScanning = () => {
    setIsScanning(true)
    console.log("[v0] Fingerprint scanning started")

    // Simulate fingerprint scan
    // In production, this would interface with actual biometric hardware
    setTimeout(() => {
      // Simulate random student fingerprint match
      const unrecordedStudents = students.filter((s) => !recordedStudents.has(s.id))
      if (unrecordedStudents.length > 0) {
        const randomStudent = unrecordedStudents[Math.floor(Math.random() * unrecordedStudents.length)]
        setLastScanned(randomStudent)
        onAttendanceRecorded(randomStudent.id)
        console.log("[v0] Fingerprint matched:", randomStudent.name)
      }
      setIsScanning(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Fingerprint className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Biometric Scanner</h3>
              <p className="text-sm text-muted-foreground">{isConnected ? "Scanner ready" : "Connecting..."}</p>
            </div>
          </div>
          {isConnected ? <Wifi className="h-5 w-5 text-emerald-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          <div className={`relative ${isScanning ? "animate-pulse" : ""}`}>
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Fingerprint className="h-16 w-16 text-white" />
            </div>
            {isScanning && <div className="absolute inset-0 rounded-full border-4 border-purple-500 animate-ping" />}
          </div>

          <Button
            onClick={startScanning}
            disabled={!isConnected || isScanning}
            className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size="lg"
          >
            {isScanning ? "Scanning..." : "Start Scanning"}
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
            <strong>Instructions:</strong> Students should place their registered finger on the scanner. The system will
            automatically record their attendance.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-foreground">Recorded Today</h3>
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
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
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
