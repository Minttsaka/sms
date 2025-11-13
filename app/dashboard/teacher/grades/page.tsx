"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Calendar, Save, CheckCircle2, Mic, ScanLine, Edit3 } from "lucide-react"
import { useGrades } from "@/hooks/use-grades"
import { GradeManual } from "@/components/grade/grade-manual"
import { GradeVoiceInput } from "@/components/grade/grade-voice-input"
import { GradeScanner } from "@/components/grade/grade-scanner"
import { GradeAnalytics } from "@/components/grade/grade-analytics"
import type { Assessment, AssessmentType } from "@/lib/types"

export default function GradesPage() {
  const [selectedClass, setSelectedClass] = useState("form-4")
  const [selectedSubject, setSelectedSubject] = useState("mathematics")

  // Assessment details
  const [assessment, setAssessment] = useState<Assessment>({
    id: "ASSESS001",
    name: "Mid-Term Exam",
    type: "exam",
    maxGrade: 100,
    weight: 30,
    date: new Date(),
    classId: "form-4",
    subjectId: "mathematics",
  })

  const {
    grades,
    statistics,
    isLoading,
    isSaving,
    updateGrade,
    updateComment,
    bulkUpdateGrades,
    saveGrades,
    clearAllGrades,
  } = useGrades(selectedClass, assessment)

  const classes = [
    { id: "form-4", name: "Form 4 - Mathematics", students: 35 },
    { id: "form-2", name: "Form 2 - Mathematics", students: 32 },
    { id: "form-3", name: "Form 3 - Science", students: 28 },
  ]

  const subjects = [
    { id: "mathematics", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "english", name: "English" },
  ]

  const assessmentTypes: { value: AssessmentType; label: string }[] = [
    { value: "quiz", label: "Quiz" },
    { value: "test", label: "Test" },
    { value: "exam", label: "Exam" },
    { value: "assignment", label: "Assignment" },
    { value: "project", label: "Project" },
    { value: "practical", label: "Practical" },
  ]

  const handleSave = async () => {
    const success = await saveGrades()
    if (success) {
      alert("Grades saved successfully!")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-['Cambria']">Loading grades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 font-['Cambria']">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enter Grades
            </h1>
            <p className="text-gray-600 mt-1">Record and manage student grades with advanced tools</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Grades
              </>
            )}
          </Button>
        </div>

        {/* Class & Assessment Selection */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Class Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {cls.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assessment Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Assessment Type</Label>
              <Select
                value={assessment.type}
                onValueChange={(value) => setAssessment({ ...assessment, type: value as AssessmentType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assessment Name */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Assessment Name</Label>
              <Input
                value={assessment.name}
                onChange={(e) => setAssessment({ ...assessment, name: e.target.value })}
                placeholder="e.g., Mid-Term Exam"
              />
            </div>

            {/* Max Grade */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Max Grade</Label>
              <Input
                type="number"
                value={assessment.maxGrade}
                onChange={(e) => setAssessment({ ...assessment, maxGrade: Number.parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          {/* Quick Stats */}
          {statistics && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <Badge variant="secondary" className="text-sm">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                {statistics.enteredCount} / {statistics.totalStudents} entered
              </Badge>
              <Badge variant="outline" className="text-sm">
                Average: {statistics.average}%
              </Badge>
              <Badge variant="outline" className="text-sm">
                Pass Rate: {statistics.passRate}%
              </Badge>
            </div>
          )}
        </Card>

        {/* Grade Entry Methods */}
        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-1">
            <TabsTrigger
              value="manual"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger
              value="voice"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Mic className="w-4 h-4 mr-2" />
              Voice Input
            </TabsTrigger>
            <TabsTrigger
              value="scan"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <ScanLine className="w-4 h-4 mr-2" />
              Scan Papers
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <GradeManual
              grades={grades}
              maxGrade={assessment.maxGrade}
              assessmentName={assessment.name}
              onGradeChange={updateGrade}
              onCommentChange={updateComment}
              onClearAll={clearAllGrades}
            />
          </TabsContent>

          <TabsContent value="voice">
            <GradeVoiceInput grades={grades} maxGrade={assessment.maxGrade} onGradeChange={updateGrade} />
          </TabsContent>

          <TabsContent value="scan">
            <GradeScanner grades={grades} maxGrade={assessment.maxGrade} onBulkGradeChange={bulkUpdateGrades} />
          </TabsContent>

          <TabsContent value="analytics">{statistics && <GradeAnalytics statistics={statistics} />}</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
