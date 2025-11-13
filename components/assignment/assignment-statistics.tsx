"use client"

import { Card } from "@/components/ui/card"
import { Users, CheckCircle2, Clock, AlertCircle, TrendingUp, Award } from "lucide-react"
import type { AssignmentStatistics } from "@/lib/types"

interface AssignmentStatisticsProps {
  stats: AssignmentStatistics
}

export function AssignmentStatisticsComponent({ stats }: AssignmentStatisticsProps) {
  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Submitted",
      value: stats.submitted,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      percentage: stats.submissionRate,
    },
    {
      label: "Not Submitted",
      value: stats.notSubmitted,
      icon: AlertCircle,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
    },
    {
      label: "Graded",
      value: stats.graded,
      icon: Award,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
    {
      label: "Pending Grading",
      value: stats.pending,
      icon: Clock,
      color: "from-amber-500 to-yellow-500",
      bgColor: "bg-amber-50",
    },
    {
      label: "Late Submissions",
      value: stats.late,
      icon: AlertCircle,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className={`p-6 ${stat.bgColor} border-2 border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  {stat.percentage !== undefined && (
                    <span className="text-sm font-semibold text-gray-600">({stat.percentage}%)</span>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Submission Rate</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overall</span>
              <span className="font-semibold text-gray-800">{stats.submissionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${stats.submissionRate}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-800">Average Grade</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Class Average</span>
              <span className="font-semibold text-gray-800">{stats.averageGrade}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all"
                style={{ width: `${stats.averageGrade}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
