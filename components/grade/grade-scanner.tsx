"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Camera, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import type { GradeEntry, ScannedGrade } from "@/lib/types"
import Image from "next/image"

interface GradeScannerProps {
  grades: GradeEntry[]
  maxGrade: number
  onBulkGradeChange: (updates: Array<{ studentId: string; grade: number }>, method: "scan") => void
}

export function GradeScanner({ grades, maxGrade, onBulkGradeChange }: GradeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedImage, setScannedImage] = useState<string | null>(null)
  const [scannedGrades, setScannedGrades] = useState<ScannedGrade[]>([])
  const [matchedGrades, setMatchedGrades] = useState<Array<{ studentId: string; grade: number }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setScannedGrades([])
    setMatchedGrades([])

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setScannedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock OCR results (in real app, call OCR API like Google Vision, Tesseract, etc.)
    const mockScannedGrades: ScannedGrade[] = [
      { studentName: "Alice Johnson", grade: 85, confidence: 0.95 },
      { studentName: "Bob Smith", grade: 92, confidence: 0.98 },
      { studentName: "Carol Williams", grade: 78, confidence: 0.89 },
      { studentName: "David Brown", grade: 88, confidence: 0.93 },
    ]

    setScannedGrades(mockScannedGrades)

    // Match scanned names with student records
    const matched = mockScannedGrades
      .map((scanned) => {
        const student = grades.find(
          (g) =>
            g.studentName.toLowerCase().includes(scanned.studentName.toLowerCase()) ||
            scanned.studentName.toLowerCase().includes(g.studentName.toLowerCase()),
        )
        return student ? { studentId: student.studentId, grade: scanned.grade } : null
      })
      .filter((m): m is { studentId: string; grade: number } => m !== null)

    setMatchedGrades(matched)
    setIsScanning(false)
  }

  const handleApplyGrades = () => {
    onBulkGradeChange(matchedGrades, "scan")
    // Reset
    setScannedImage(null)
    setScannedGrades([])
    setMatchedGrades([])
  }

  const handleReset = () => {
    setScannedImage(null)
    setScannedGrades([])
    setMatchedGrades([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!scannedImage && (
        <Card className="p-12 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Scan Exam Papers</h3>
              <p className="text-sm text-gray-500 mt-1">Upload a photo of exam papers with student names and grades</p>
            </div>
            <div className="flex justify-center gap-3">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>
      )}

      {/* Scanning Progress */}
      {isScanning && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Scanning Document...</h3>
              <p className="text-sm text-gray-500">Using OCR to extract grades</p>
            </div>
          </div>
        </Card>
      )}

      {/* Scanned Results */}
      {scannedImage && !isScanning && (
        <div className="space-y-4">
          {/* Preview */}
          <Card className="p-4">
            <div className="flex items-start gap-4">
              <Image
                src={scannedImage || "/placeholder.svg"}
                alt="Scanned document"
                width={200}
                height={200}
                className="rounded-lg border border-gray-200 object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-2">Scanned Results</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Found {scannedGrades.length} grades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Matched {matchedGrades.length} students</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Matched Grades */}
          <Card className="p-4">
            <h4 className="font-bold text-gray-900 mb-3">Detected Grades</h4>
            <div className="space-y-2">
              {scannedGrades.map((scanned, index) => {
                const matched = grades.find((g) =>
                  g.studentName.toLowerCase().includes(scanned.studentName.toLowerCase()),
                )
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      matched ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {matched ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {scanned.studentName}
                          {matched && matched.studentName !== scanned.studentName && (
                            <span className="text-sm text-gray-500 ml-2">→ {matched.studentName}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">Confidence: {Math.round(scanned.confidence * 100)}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{scanned.grade}</div>
                      <div className="text-xs text-gray-500">/{maxGrade}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleApplyGrades} disabled={matchedGrades.length === 0} className="flex-1">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Apply {matchedGrades.length} Grades
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Scan Another
            </Button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <h4 className="font-bold text-gray-900 mb-3">Tips for Best Results:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">
              1
            </Badge>
            <span>Ensure good lighting and clear text</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">
              2
            </Badge>
            <span>Student names should be clearly written</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">
              3
            </Badge>
            <span>Grades should be in numeric format</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">
              4
            </Badge>
            <span>Avoid shadows and glare on the paper</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
