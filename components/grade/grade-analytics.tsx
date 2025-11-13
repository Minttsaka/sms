"use client"

import type { GradeStatistics } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, Target, Award, AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface GradeAnalyticsProps {
  statistics: GradeStatistics
}

export function GradeAnalytics({ statistics }: GradeAnalyticsProps) {
  const chartData = statistics.distribution.map((d) => ({
    range: d.range,
    count: d.count,
    percentage: d.percentage,
  }))

  const getBarColor = (range: string) => {
    if (range.startsWith("90")) return "#10b981" // green
    if (range.startsWith("80")) return "#3b82f6" // blue
    if (range.startsWith("70")) return "#8b5cf6" // purple
    if (range.startsWith("60")) return "#f59e0b" // yellow
    if (range.startsWith("50")) return "#f97316" // orange
    return "#ef4444" // red
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Average</p>
              <p className="text-2xl font-bold text-blue-900">{statistics.average}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Median</p>
              <p className="text-2xl font-bold text-purple-900">{statistics.median}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Highest</p>
              <p className="text-2xl font-bold text-green-900">{statistics.highest}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-700 font-medium">Lowest</p>
              <p className="text-2xl font-bold text-orange-900">{statistics.lowest}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Distribution Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="range" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{ value: "Number of Students", angle: -90, position: "insideLeft", style: { fill: "#6b7280" } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontFamily: "Cambria, serif",
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-xl font-bold text-gray-900">{statistics.totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-xl font-bold text-gray-900">{statistics.passRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">{statistics.pendingCount}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
