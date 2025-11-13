"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, Plus, X } from "lucide-react"
import type { Assignment, AssignmentType } from "@/lib/types"

interface AssignmentCreatorProps {
  onAssignmentCreated: (assignment: Omit<Assignment, "id">) => void
  onCancel: () => void
}

export function AssignmentCreator({ onAssignmentCreated, onCancel }: AssignmentCreatorProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [classId, setClassId] = useState("")
  const [type, setType] = useState<AssignmentType>("homework")
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  const [maxGrade, setMaxGrade] = useState(100)
  const [weight, setWeight] = useState(10)
  const [allowLateSubmission, setAllowLateSubmission] = useState(true)
  const [latePenalty, setLatePenalty] = useState(10)
  const [instructions, setInstructions] = useState("")

  const classes = [
    { id: "1", name: "Form 4A - Mathematics" },
    { id: "2", name: "Form 2B - Science" },
    { id: "3", name: "Form 3C - English" },
  ]

  const assignmentTypes: { value: AssignmentType; label: string }[] = [
    { value: "homework", label: "Homework" },
    { value: "project", label: "Project" },
    { value: "essay", label: "Essay" },
    { value: "research", label: "Research" },
    { value: "practical", label: "Practical" },
    { value: "reading", label: "Reading" },
    { value: "problem-set", label: "Problem Set" },
  ]

  const handleSubmit = () => {
    const selectedClass = classes.find((c) => c.id === classId)
    if (!selectedClass) return

    const assignment: Omit<Assignment, "id"> = {
      title,
      description,
      classId,
      className: selectedClass.name,
      subjectId: "math",
      subjectName: "Mathematics",
      type,
      dueDate,
      assignedDate: new Date(),
      maxGrade,
      weight,
      allowLateSubmission,
      latePenalty: allowLateSubmission ? latePenalty : undefined,
      instructions,
    }

    onAssignmentCreated(assignment)
  }

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create New Assignment
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Assignment Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Quadratic Equations Problem Set"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a brief description of the assignment"
            rows={3}
          />
        </div>

        {/* Class and Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Class *</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assignment Type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as AssignmentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assignmentTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label>Due Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {dueDate.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dueDate} onSelect={(date) => date && setDueDate(date)} />
            </PopoverContent>
          </Popover>
        </div>

        {/* Max Grade and Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxGrade">Maximum Grade *</Label>
            <Input
              id="maxGrade"
              type="number"
              value={maxGrade}
              onChange={(e) => setMaxGrade(Number.parseInt(e.target.value))}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (%) *</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number.parseInt(e.target.value))}
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* Late Submission */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="late-submission">Allow Late Submission</Label>
            <Switch id="late-submission" checked={allowLateSubmission} onCheckedChange={setAllowLateSubmission} />
          </div>

          {allowLateSubmission && (
            <div className="space-y-2">
              <Label htmlFor="latePenalty">Late Penalty (% per day)</Label>
              <Input
                id="latePenalty"
                type="number"
                value={latePenalty}
                onChange={(e) => setLatePenalty(Number.parseInt(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <Label htmlFor="instructions">Additional Instructions</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Provide detailed instructions for students"
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || !description || !classId}
            className="bg-gradient-to-r from-blue-500 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </div>
      </div>
    </Card>
  )
}
