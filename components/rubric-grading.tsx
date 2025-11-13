"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Circle } from "lucide-react"
import type { GradingRubric, DetailedGradeEntry } from "@/lib/types"
import { calculateRubricScore, getRubricFeedback } from "@/lib/assessment-utils"

interface RubricGradingProps {
  student: DetailedGradeEntry
  rubric: GradingRubric
  onGradeUpdate: (studentId: string, score: number, feedback: string) => void
}

export function RubricGrading({ student, rubric, onGradeUpdate }: RubricGradingProps) {
  const [selectedScores, setSelectedScores] = useState<Map<string, number>>(new Map())
  const [additionalFeedback, setAdditionalFeedback] = useState("")

  const handleLevelSelect = (criterionId: string, points: number) => {
    const newScores = new Map(selectedScores)
    newScores.set(criterionId, points)
    setSelectedScores(newScores)
  }

  const handleSave = () => {
    const totalScore = calculateRubricScore(rubric, selectedScores)
    const feedback = getRubricFeedback(rubric, selectedScores)
    const fullFeedback = additionalFeedback ? `${feedback}\n\nAdditional Comments:\n${additionalFeedback}` : feedback

    onGradeUpdate(student.studentId, totalScore, fullFeedback)
  }

  const totalScore = calculateRubricScore(rubric, selectedScores)
  const percentage = (totalScore / rubric.totalPoints) * 100

  return (
    <div className="space-y-6">
      {/* Student Info */}
      <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{student.studentName}</h3>
            <p className="text-sm opacity-90">Rubric-Based Grading</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalScore}</div>
            <div className="text-sm opacity-90">/ {rubric.totalPoints} points</div>
          </div>
        </div>
      </Card>

      {/* Rubric Criteria */}
      <div className="space-y-4">
        {rubric.criteria.map((criterion) => (
          <Card key={criterion.id} className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-800">{criterion.name}</h4>
                <Badge variant="secondary">{criterion.maxPoints} points</Badge>
              </div>
              <p className="text-sm text-gray-600">{criterion.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {criterion.levels.map((level) => {
                const isSelected = selectedScores.get(criterion.id) === level.points

                return (
                  <button
                    key={level.id}
                    onClick={() => handleLevelSelect(criterion.id, level.points)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">{level.name}</div>
                        <div className="text-2xl font-bold text-blue-600">{level.points}</div>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{level.description}</p>
                  </button>
                )
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Feedback */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Feedback</h4>
        <Textarea
          value={additionalFeedback}
          onChange={(e) => setAdditionalFeedback(e.target.value)}
          placeholder="Add any additional comments or feedback for the student..."
          rows={4}
          className="resize-none"
        />
      </Card>

      {/* Summary & Save */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-800">Total Score</h4>
            <p className="text-sm text-gray-600">
              {selectedScores.size} of {rubric.criteria.length} criteria graded
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">{percentage.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">
              {totalScore} / {rubric.totalPoints} points
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={selectedScores.size !== rubric.criteria.length}
          size="lg"
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600"
        >
          Save Grade & Feedback
        </Button>
      </Card>
    </div>
  )
}
