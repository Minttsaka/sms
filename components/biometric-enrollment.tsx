"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Fingerprint, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface BiometricEnrollmentProps {
  isEnrolled: boolean
  onEnrollmentComplete: (fingerprintData: string) => void
}

export function BiometricEnrollment({ isEnrolled, onEnrollmentComplete }: BiometricEnrollmentProps) {
  const [enrolling, setEnrolling] = useState(false)
  const [progress, setProgress] = useState(0)
  const [scans, setScans] = useState<number[]>([])

  const startEnrollment = async () => {
    setEnrolling(true)
    setProgress(0)
    setScans([])

    // Simulate fingerprint scanning process
    for (let i = 1; i <= 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setScans((prev) => [...prev, i])
      setProgress((i / 3) * 100)
    }

    // Generate mock fingerprint data
    const fingerprintData = `FP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    onEnrollmentComplete(fingerprintData)
    setEnrolling(false)
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-green-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Biometric Enrollment</h3>
          {isEnrolled && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Enrolled
            </Badge>
          )}
        </div>

        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isEnrolled
                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                  : enrolling
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"
                    : "bg-gradient-to-br from-gray-400 to-gray-500"
              }`}
            >
              {enrolling ? (
                <Loader2 className="w-16 h-16 text-white animate-spin" />
              ) : (
                <Fingerprint className="w-16 h-16 text-white" />
              )}
            </div>
            {isEnrolled && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {!isEnrolled && !enrolling && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-700">
                  Fingerprint enrollment enables automatic attendance tracking and secure identification.
                </p>
              </div>
              <Button onClick={startEnrollment} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Fingerprint className="w-5 h-5 mr-2" />
                Start Enrollment
              </Button>
            </div>
          )}

          {enrolling && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Scanning Fingerprint...</p>
                <p className="text-xs text-gray-600">Scan {scans.length} of 3 complete</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((scan) => (
                  <div
                    key={scan}
                    className={`w-3 h-3 rounded-full ${scans.includes(scan) ? "bg-green-500" : "bg-gray-300"}`}
                  />
                ))}
              </div>
            </div>
          )}

          {isEnrolled && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Fingerprint Successfully Enrolled</p>
              <p className="text-xs text-gray-600 mt-1">Student can now use fingerprint for attendance</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
