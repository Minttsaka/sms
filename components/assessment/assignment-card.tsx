"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileText, Clock, TrendingUp } from "lucide-react"
import type { Assignment } from "@/lib/types"
import { formatDueDate, getDaysUntilDue, getTypeIcon } from "@/lib/utils"

interface AssignmentCardProps {
  assignment: Assignment
  submissionRate?: number
  onView: (assignment: Assignment) => void
}

export function AssignmentCard({ assignment, submissionRate = 0, onView }: AssignmentCardProps) {
  const daysUntilDue = getDaysUntilDue(assignment.dueDate)
  const isOverdue = daysUntilDue < 0
  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 2

  return (
    <Card
      className={`p-6 bg-gradient-to-br ${
        isOverdue
          ? "from-red-50 to-orange-50 border-red-200"
          : isDueSoon
            ? "from-amber-50 to-yellow-50 border-amber-200"
            : "from-blue-50 to-purple-50 border-blue-200"
      } border-2 hover:shadow-lg transition-all cursor-pointer`}
      onClick={() => onView(assignment)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">{getTypeIcon(assignment.type)}</div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{assignment.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assignment.description}</p>
          </div>
        </div>
        <Badge
          variant={isOverdue ? "destructive" : isDueSoon ? "default" : "secondary"}
          className={isDueSoon ? "bg-amber-500" : ""}
        >
          {assignment.type}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className={isOverdue ? "text-red-600 font-semibold" : isDueSoon ? "text-amber-600 font-semibold" : ""}>
            {formatDueDate(assignment.dueDate)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{assignment.className}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>{assignment.maxGrade} points</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{submissionRate}% submitted</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">
            Assigned {new Date(assignment.assignedDate).toLocaleDateString()}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation()
            onView(assignment)
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  )
}
