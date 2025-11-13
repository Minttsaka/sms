"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Award, Target } from "lucide-react"
import type { FinalGradeCalculation } from "@/lib/types"

interface WeightedGradesProps {
  calculations: FinalGradeCalculation[]
}

export function WeightedGrades({ calculations }: WeightedGradesProps) {
  return (
    <div className="space-y-6">
      {calculations.map((calc) => (
        <Card key={calc.studentId} className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
          {/* Student Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{calc.studentName}</h3>
              <p className="text-sm text-gray-600">Final Grade Calculation</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {calc.finalPercentage.toFixed(1)}%
              </div>
              <Badge variant="secondary" className="mt-1">
                {calc.finalLetterGrade}
              </Badge>
            </div>
          </div>

          {/* Grade Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Assessment Breakdown
            </h4>

            {calc.breakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.assessmentType}
                    </Badge>
                    <span className="font-medium text-gray-700">{item.assessmentName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">
                      {item.grade.toFixed(1)}% × {item.weight}%
                    </span>
                    <span className="font-semibold text-blue-600 min-w-[60px] text-right">
                      = {item.contribution.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={item.grade} className="h-2" />
              </div>
            ))}
          </div>

          {/* Performance Indicator */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {calc.finalPercentage >= 70 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Strong Performance</span>
                  </>
                ) : calc.finalPercentage >= 50 ? (
                  <>
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Satisfactory Performance</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-600">Needs Improvement</span>
                  </>
                )}
              </div>
              <span className="text-xs text-gray-500">{calc.breakdown.length} assessments included</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
