"use client"

import type { GradeEntry } from "@/lib/types"
import { getGradeColor, getGradeBgColor } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"

interface GradeStudentCardProps {
  grade: GradeEntry
  studentPhoto?: string
  studentNumber: string
  previousAverage?: number
  onGradeChange: (grade: number | null) => void
  onCommentChange: (comment: string) => void
  maxGrade: number
}

export function GradeStudentCard({
  grade,
  studentPhoto,
  studentNumber,
  previousAverage,
  onGradeChange,
  onCommentChange,
  maxGrade,
}: GradeStudentCardProps) {
  const handleGradeInput = (value: string) => {
    if (value === "") {
      onGradeChange(null)
      return
    }
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= maxGrade) {
      onGradeChange(numValue)
    }
  }

  const getTrend = () => {
    if (!previousAverage || grade.grade === null) return null
    const diff = grade.percentage - previousAverage
    if (Math.abs(diff) < 5) return null
    return diff > 0 ? "up" : "down"
  }

  const trend = getTrend()

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        grade.status === "flagged"
          ? "border-red-300 bg-red-50"
          : grade.status === "entered"
            ? getGradeBgColor(grade.percentage)
            : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Student Info */}
        <div className="flex items-center gap-3 flex-1">
          <Image
            src={studentPhoto || "/placeholder.svg?height=48&width=48&query=student"}
            alt={grade.studentName}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{grade.studentName}</h4>
            <p className="text-sm text-gray-500">{studentNumber}</p>
            {previousAverage && <p className="text-xs text-gray-400">Avg: {previousAverage}%</p>}
          </div>
        </div>

        {/* Grade Input */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="number"
              min="0"
              max={maxGrade}
              step="0.5"
              value={grade.grade ?? ""}
              onChange={(e) => handleGradeInput(e.target.value)}
              placeholder="0"
              className="w-24 text-center text-lg font-semibold"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">/{maxGrade}</span>
          </div>

          {/* Grade Display */}
          {grade.grade !== null && (
            <div className="text-center min-w-[80px]">
              <div className={`text-2xl font-bold ${getGradeColor(grade.percentage)}`}>{grade.percentage}%</div>
              <div className={`text-sm font-semibold ${getGradeColor(grade.percentage)}`}>{grade.letterGrade}</div>
            </div>
          )}

          {/* Trend Indicator */}
          {trend && (
            <div className="flex items-center">
              {trend === "up" ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2 mt-3">
        <Badge variant={grade.status === "entered" ? "default" : "secondary"}>{grade.status}</Badge>
        <Badge variant="outline" className="text-xs">
          {grade.entryMethod}
        </Badge>
        {grade.status === "flagged" && (
          <div className="flex items-center gap-1 text-red-600 text-xs">
            <AlertCircle className="w-4 h-4" />
            <span>{grade.flagReason}</span>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="mt-3">
        <Textarea
          placeholder="Add comments or feedback..."
          value={grade.comments ?? ""}
          onChange={(e) => onCommentChange(e.target.value)}
          className="text-sm resize-none"
          rows={2}
        />
      </div>
    </div>
  )
}
