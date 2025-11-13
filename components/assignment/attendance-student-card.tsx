"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, X, Clock, FileText } from "lucide-react"
import type { Student, AttendanceStatus } from "@/lib/types"
import { getStatusColor } from "@/lib/utils"
import { useState } from "react"

interface AttendanceStudentCardProps {
  student: Student
  status?: AttendanceStatus
  onStatusChange: (status: AttendanceStatus) => void
  onNotesChange?: (notes: string) => void
}

export function AttendanceStudentCard({ student, status, onStatusChange, onNotesChange }: AttendanceStudentCardProps) {
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState("")

  const handleNotesChange = (value: string) => {
    setNotes(value)
    onNotesChange?.(value)
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={student.photo || "/placeholder.svg"} alt={student.name} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{student.name}</h4>
          <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={status === "present" ? "default" : "outline"}
            className={status === "present" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
            onClick={() => onStatusChange("present")}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={status === "late" ? "default" : "outline"}
            className={status === "late" ? "bg-amber-500 hover:bg-amber-600" : ""}
            onClick={() => onStatusChange("late")}
          >
            <Clock className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={status === "excused" ? "default" : "outline"}
            className={status === "excused" ? "bg-blue-500 hover:bg-blue-600" : ""}
            onClick={() => onStatusChange("excused")}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={status === "absent" ? "default" : "outline"}
            className={status === "absent" ? "bg-red-500 hover:bg-red-600" : ""}
            onClick={() => onStatusChange("absent")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {status && <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />}
      </div>

      {showNotes && (
        <div className="mt-3">
          <Input
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="text-sm"
          />
        </div>
      )}

      <button
        onClick={() => setShowNotes(!showNotes)}
        className="text-xs text-muted-foreground hover:text-foreground mt-2"
      >
        {showNotes ? "Hide notes" : "Add notes"}
      </button>
    </Card>
  )
}
