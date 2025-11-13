"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, LayoutDashboard, List, CalendarIcon, Download } from "lucide-react"
import { useAssignments } from "@/hooks/use-assignments"
import { AssignmentCard } from "@/components/assessment/assignment-card"
import { AssignmentCreator } from "@/components/assignment-creator"
import { AssignmentStatisticsComponent } from "@/components/assignment-statistics"
import type { Assignment } from "@/lib/types"
import { exportAssignmentsToCSV } from "@/lib/utils"

export default function AssignmentsPage() {
  const [showCreator, setShowCreator] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined)
  const { assignments, isLoading, createAssignment } = useAssignments(selectedClass)

  const classes = [
    { id: "all", name: "All Classes" },
    { id: "1", name: "Form 4A" },
    { id: "2", name: "Form 2B" },
    { id: "3", name: "Form 3C" },
  ]

  const handleCreateAssignment = async (assignment: Omit<Assignment, "id">) => {
    await createAssignment(assignment)
    setShowCreator(false)
  }

  const handleViewAssignment = (assignment: Assignment) => {
    alert(`Viewing assignment: ${assignment.title}`)
  }

  const handleExport = () => {
    const csv = exportAssignmentsToCSV(assignments)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `assignments-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  // Mock statistics
  const mockStats = {
    totalStudents: 35,
    submitted: 28,
    notSubmitted: 7,
    graded: 20,
    pending: 8,
    late: 3,
    submissionRate: 80,
    averageGrade: 78,
    onTimeRate: 89,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-['Cambria']">Loading assignments...</p>
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
              Assignments
            </h1>
            <p className="text-gray-600 mt-1">Create, manage, and track assignments across all classes</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => setShowCreator(!showCreator)}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              {showCreator ? "Cancel" : "Create Assignment"}
            </Button>
          </div>
        </div>

        {/* Class Filter */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter by Class</h2>
          <div className="flex flex-wrap gap-3">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id === "all" ? undefined : cls.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  (selectedClass === undefined && cls.id === "all") || selectedClass === cls.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Assignment Creator */}
        {showCreator && (
          <AssignmentCreator onAssignmentCreated={handleCreateAssignment} onCancel={() => setShowCreator(false)} />
        )}

        {/* Assignment Views */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-1">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* Dashboard View */}
          <TabsContent value="dashboard" className="space-y-6">
            <AssignmentStatisticsComponent stats={mockStats} />

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Assignments</h2>
              {assignments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assignments created yet</p>
                  <p className="text-sm">Click "Create Assignment" to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignments.slice(0, 6).map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      submissionRate={Math.floor(Math.random() * 40) + 60}
                      onView={handleViewAssignment}
                    />
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Assignments</h2>
              {assignments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No assignments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      submissionRate={Math.floor(Math.random() * 40) + 60}
                      onView={handleViewAssignment}
                    />
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignment Calendar</h2>
              <div className="text-center py-12 text-gray-500">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Calendar view coming soon</p>
                <p className="text-sm">View assignments organized by due date</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
