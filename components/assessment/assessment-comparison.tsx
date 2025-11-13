"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { AssessmentComparison } from "@/lib/types"

interface AssessmentComparisonProps {
  comparisons: AssessmentComparison[]
}

export function AssessmentComparisonView({ comparisons }: AssessmentComparisonProps) {
  // Prepare data for charts
  const chartData = comparisons.map((comp) => ({
    name: comp.assessmentName,
    average: comp.average,
    median: comp.median,
    highest: comp.highest,
    lowest: comp.lowest,
    passRate: comp.passRate,
  }))

  // Calculate trends
  const getTrend = (current: number, previous: number) => {
    if (current > previous + 5) return "up"
    if (current < previous - 5) return "down"
    return "stable"
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparisons.slice(0, 3).map((comp, index) => {
          const prevComp = index > 0 ? comparisons[index - 1] : null
          const trend = prevComp ? getTrend(comp.average, prevComp.average) : "stable"

          return (
            <Card
              key={comp.assessmentId}
              className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {comp.type}
                  </Badge>
                  <h3 className="font-semibold text-gray-800">{comp.assessmentName}</h3>
                  <p className="text-xs text-gray-600">{comp.date.toLocaleDateString()}</p>
                </div>
                {trend === "up" && <TrendingUp className="w-5 h-5 text-green-600" />}
                {trend === "down" && <TrendingDown className="w-5 h-5 text-red-600" />}
                {trend === "stable" && <Minus className="w-5 h-5 text-gray-400" />}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="text-2xl font-bold text-blue-600">{comp.average.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pass Rate</span>
                  <span className="font-semibold text-green-600">{comp.passRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Range</span>
                  <span className="font-semibold text-gray-700">
                    {comp.lowest.toFixed(0)} - {comp.highest.toFixed(0)}
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Average Comparison Chart */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Performance Across Assessments</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="average" fill="url(#colorAverage)" name="Average" radius={[8, 8, 0, 0]} />
            <Bar dataKey="median" fill="url(#colorMedian)" name="Median" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Trend Line Chart */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={3} name="Average" dot={{ r: 6 }} />
            <Line type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={3} name="Pass Rate" dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Detailed Comparison Table */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assessment</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Average</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Median</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Highest</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Lowest</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Pass Rate</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comp) => (
                <tr key={comp.assessmentId} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{comp.assessmentName}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs">
                      {comp.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-blue-600">{comp.average.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right text-gray-700">{comp.median.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right text-green-600">{comp.highest.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right text-red-600">{comp.lowest.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-700">{comp.passRate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
