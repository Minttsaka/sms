"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  Clock,
  CheckCircle2,
  TrendingUp,
  Calendar,
  FileText,
  Award,
  Sparkles,
  MessageSquare,
  ClipboardCheck,
  Bell,
  BookMarked,
  AlertCircle,
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart, Area, AreaChart } from "recharts"

import { useState } from "react"

// Mock data for the teacher - in production, this would come from the database
const teacherInfo = {
  name: "Dr. Sarah Johnson",
  employeeNumber: "TCH-2024-001",
  subjects: ["Mathematics", "Physics"],
}

// Classes the teacher teaches
const teacherClasses = [
  { id: "form-4", name: "Form 4", subject: "Mathematics", students: 32 },
  { id: "form-2", name: "Form 2", subject: "Physics", students: 28 },
  { id: "form-3", name: "Form 3", subject: "Mathematics", students: 27 },
]

const classData = {
  "form-4": {
    schedule: [
      { id: 1, time: "08:00 - 09:00", subject: "Mathematics", room: "Room 201", status: "completed" },
      { id: 2, time: "10:30 - 11:30", subject: "Mathematics", room: "Room 201", status: "current" },
      { id: 3, time: "14:15 - 15:15", subject: "Mathematics", room: "Room 201", status: "upcoming" },
    ],
    weeklyAttendance: [
      { day: "Mon", rate: 94, present: 30, absent: 2 },
      { day: "Tue", rate: 97, present: 31, absent: 1 },
      { day: "Wed", rate: 91, present: 29, absent: 3 },
      { day: "Thu", rate: 94, present: 30, absent: 2 },
      { day: "Fri", rate: 94, present: 30, absent: 2 },
    ],
    performanceTrend: [
      { week: "Week 1", avgScore: 72 },
      { week: "Week 2", avgScore: 75 },
      { week: "Week 3", avgScore: 79 },
      { week: "Week 4", avgScore: 82 },
      { week: "Week 5", avgScore: 80 },
      { week: "Week 6", avgScore: 85 },
    ],
    pendingTasks: [
      { id: 1, title: "Grade Mid-term Exams", count: 32, dueDate: "Tomorrow", priority: "high" },
      { id: 2, title: "Review Math Assignments", count: 32, dueDate: "In 3 days", priority: "medium" },
    ],
    topStudents: [
      { name: "Emily Chen", score: 98, avatar: "EC" },
      { name: "Sarah Williams", score: 95, avatar: "SW" },
      { name: "James Wilson", score: 93, avatar: "JW" },
    ],
    needsAttention: [
      { name: "Alex Johnson", issue: "Low attendance (65%)", severity: "high" },
      { name: "David Lee", issue: "Missing assignments", severity: "medium" },
    ],
    avgAttendance: 94,
    avgScore: 85,
  },
  "form-2": {
    schedule: [
      { id: 1, time: "09:15 - 10:15", subject: "Physics", room: "Lab 3", status: "completed" },
      { id: 2, time: "13:00 - 14:00", subject: "Physics", room: "Lab 3", status: "upcoming" },
    ],
    weeklyAttendance: [
      { day: "Mon", rate: 93, present: 26, absent: 2 },
      { day: "Tue", rate: 96, present: 27, absent: 1 },
      { day: "Wed", rate: 89, present: 25, absent: 3 },
      { day: "Thu", rate: 93, present: 26, absent: 2 },
      { day: "Fri", rate: 93, present: 26, absent: 2 },
    ],
    performanceTrend: [
      { week: "Week 1", avgScore: 78 },
      { week: "Week 2", avgScore: 80 },
      { week: "Week 3", avgScore: 83 },
      { week: "Week 4", avgScore: 86 },
      { week: "Week 5", avgScore: 84 },
      { week: "Week 6", avgScore: 88 },
    ],
    pendingTasks: [
      { id: 1, title: "Grade Physics Lab Reports", count: 28, dueDate: "In 2 days", priority: "medium" },
      { id: 2, title: "Prepare Quiz Questions", count: 1, dueDate: "Next Week", priority: "low" },
    ],
    topStudents: [
      { name: "Michael Brown", score: 96, avatar: "MB" },
      { name: "Jessica Lee", score: 94, avatar: "JL" },
      { name: "Robert Taylor", score: 92, avatar: "RT" },
    ],
    needsAttention: [
      { name: "Lisa Martinez", issue: "Declining grades", severity: "medium" },
      { name: "Tom Anderson", issue: "Low test scores", severity: "medium" },
    ],
    avgAttendance: 93,
    avgScore: 88,
  },
  "form-3": {
    schedule: [
      { id: 1, time: "11:45 - 12:45", subject: "Mathematics", room: "Room 203", status: "completed" },
      { id: 2, time: "15:30 - 16:30", subject: "Mathematics", room: "Room 203", status: "upcoming" },
    ],
    weeklyAttendance: [
      { day: "Mon", rate: 96, present: 26, absent: 1 },
      { day: "Tue", rate: 93, present: 25, absent: 2 },
      { day: "Wed", rate: 96, present: 26, absent: 1 },
      { day: "Thu", rate: 96, present: 26, absent: 1 },
      { day: "Fri", rate: 89, present: 24, absent: 3 },
    ],
    performanceTrend: [
      { week: "Week 1", avgScore: 76 },
      { week: "Week 2", avgScore: 79 },
      { week: "Week 3", avgScore: 81 },
      { week: "Week 4", avgScore: 84 },
      { week: "Week 5", avgScore: 86 },
      { week: "Week 6", avgScore: 89 },
    ],
    pendingTasks: [{ id: 1, title: "Grade Weekly Test", count: 27, dueDate: "Tomorrow", priority: "high" }],
    topStudents: [
      { name: "Sophia Martinez", score: 97, avatar: "SM" },
      { name: "Daniel Kim", score: 95, avatar: "DK" },
      { name: "Olivia Brown", score: 93, avatar: "OB" },
    ],
    needsAttention: [{ name: "Chris Johnson", issue: "Missing homework", severity: "medium" }],
    avgAttendance: 94,
    avgScore: 89,
  },
}

// Recent messages (not class-specific)
const recentMessages = [
  { id: 1, from: "Admin Office", subject: "Staff Meeting Tomorrow", time: "1 hour ago", unread: true },
  { id: 2, from: "Parent - John Doe", subject: "Question about homework", time: "3 hours ago", unread: true },
  { id: 3, from: "Form 4 Class Rep", subject: "Field trip permission", time: "Yesterday", unread: false },
]

export default function TeacherDashboard() {
  const [selectedClassId, setSelectedClassId] = useState(teacherClasses[0].id)

  const currentClass = teacherClasses.find((c) => c.id === selectedClassId)!
  const currentData = classData[selectedClassId as keyof typeof classData]

  const totalStudents = teacherClasses.reduce((sum, cls) => sum + cls.students, 0)
  const totalPendingTasks = Object.values(classData).reduce(
    (sum, data) => sum + data.pendingTasks.reduce((taskSum, task) => taskSum + task.count, 0),
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: "Cambria, serif" }}
            >
              Instructor Dashboard
            </h1>
            <p className="text-gray-600 flex items-center gap-2" style={{ fontFamily: "Cambria, serif" }}>
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Welcome back, {teacherInfo.name}! Here's your teaching overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-300 bg-white">
              <Bell className="w-4 h-4 mr-2" />
              <Badge className="bg-red-500 text-white -ml-1 -mt-1 absolute">3</Badge>
              Notifications
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              Select Class
            </h3>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">{teacherClasses.length} Classes</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {teacherClasses.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedClassId === cls.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 shadow-lg shadow-blue-500/30"
                    : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className={`text-lg font-bold ${selectedClassId === cls.id ? "text-white" : "text-gray-900"}`}
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    {cls.name}
                  </p>
                  {selectedClassId === cls.id && <CheckCircle2 className="w-5 h-5 text-white" />}
                </div>
                <p
                  className={`text-sm ${selectedClassId === cls.id ? "text-blue-100" : "text-gray-600"}`}
                  style={{ fontFamily: "Cambria, serif" }}
                >
                  {cls.subject}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className={`w-4 h-4 ${selectedClassId === cls.id ? "text-blue-100" : "text-gray-500"}`} />
                  <p
                    className={`text-sm ${selectedClassId === cls.id ? "text-blue-100" : "text-gray-600"}`}
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    {cls.students} Students
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Students in {currentClass.name}
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
                {currentClass.students}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Total across all classes: {totalStudents}
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <BookMarked className="w-3 h-3 mr-1" />
                  {currentClass.subject}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Classes Today
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
                {currentData.schedule.length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                {currentClass.name} - {currentClass.subject}
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/30">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.5%
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Avg Attendance
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
                {currentData.avgAttendance}%
              </p>
              <Progress value={currentData.avgAttendance} className="h-2 bg-green-200" />
              <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: "Cambria, serif" }}>
                {currentClass.name} - This week
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-600/30">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Pending Tasks
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
                {currentData.pendingTasks.length}
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                {currentData.pendingTasks.reduce((sum, task) => sum + task.count, 0)} items for {currentClass.name}
              </p>
            </div>
          </Card>
        </div>

        {/* Today's Schedule and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Timetable */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                  Today's Schedule - {currentClass.name}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
            </div>
            <div className="space-y-3">
              {currentData.schedule.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    session.status === "current"
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md"
                      : session.status === "completed"
                        ? "bg-gray-50 border-gray-200 opacity-60"
                        : "bg-white border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          session.status === "current"
                            ? "bg-gradient-to-br from-blue-600 to-purple-600"
                            : session.status === "completed"
                              ? "bg-gray-400"
                              : "bg-gradient-to-br from-blue-500 to-purple-500"
                        }`}
                      >
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                          {session.subject}
                        </p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                          {currentClass.name} • {session.room}
                        </p>
                        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "Cambria, serif" }}>
                          {session.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.status === "current" && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>
                      )}
                      {session.status === "completed" && (
                        <Badge className="bg-gray-100 text-gray-700 border-gray-200">Completed</Badge>
                      )}
                      {session.status === "upcoming" && (
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          <ClipboardCheck className="w-4 h-4 mr-1" />
                          Take Attendance
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 p-6 hover:shadow-xl transition-all">
            <h3
              className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              style={{ fontFamily: "Cambria, serif" }}
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                <span style={{ fontFamily: "Cambria, serif" }}>Record Attendance</span>
              </Button>
              <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 border border-gray-200">
                <Award className="w-4 h-4 mr-2" />
                <span style={{ fontFamily: "Cambria, serif" }}>Enter Grades</span>
              </Button>
              <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 border border-gray-200">
                <FileText className="w-4 h-4 mr-2" />
                <span style={{ fontFamily: "Cambria, serif" }}>Create Assignment</span>
              </Button>
              <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 border border-gray-200">
                <Users className="w-4 h-4 mr-2" />
                <span style={{ fontFamily: "Cambria, serif" }}>View Students</span>
              </Button>
              <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 border border-gray-200">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span style={{ fontFamily: "Cambria, serif" }}>Send Message</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Attendance */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                  Weekly Attendance - {currentClass.name}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  Attendance rate for this class
                </p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.5%
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={currentData.weeklyAttendance}>
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontFamily: "Cambria, serif", fontSize: 12 }} />
                <YAxis stroke="#6b7280" style={{ fontFamily: "Cambria, serif", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    fontFamily: "Cambria, serif",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} fill="url(#colorAttendance)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Performance Trend */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                  Performance Trend - {currentClass.name}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  Average scores over time
                </p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                Improving
              </Badge>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={currentData.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" style={{ fontFamily: "Cambria, serif", fontSize: 12 }} />
                <YAxis stroke="#6b7280" style={{ fontFamily: "Cambria, serif", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    fontFamily: "Cambria, serif",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                  name="Average Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Tasks */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
            <h3
              className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              style={{ fontFamily: "Cambria, serif" }}
            >
              <ClipboardCheck className="w-5 h-5 text-yellow-600" />
              Pending Tasks - {currentClass.name}
            </h3>
            <div className="space-y-3">
              {currentData.pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border-2 ${
                    task.priority === "high"
                      ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
                      : task.priority === "medium"
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                        : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {task.title}
                    </p>
                    <Badge
                      className={
                        task.priority === "high"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                      }
                    >
                      {task.count}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xs text-gray-600 flex items-center gap-1"
                      style={{ fontFamily: "Cambria, serif" }}
                    >
                      <Clock className="w-3 h-3" />
                      Due: {task.dueDate}
                    </p>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performers */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
            <h3
              className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              style={{ fontFamily: "Cambria, serif" }}
            >
              <Award className="w-5 h-5 text-yellow-600" />
              Top Performers - {currentClass.name}
            </h3>
            <div className="space-y-4">
              {currentData.topStudents.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {student.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      {currentClass.name} • {currentClass.subject}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {student.score}
                    </p>
                    <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      Score
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Students Needing Attention */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
            <h3
              className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
              style={{ fontFamily: "Cambria, serif" }}
            >
              <AlertCircle className="w-5 h-5 text-red-600" />
              Needs Attention - {currentClass.name}
            </h3>
            <div className="space-y-3">
              {currentData.needsAttention.map((student, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl border-2 ${
                    student.severity === "high"
                      ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
                      : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        student.severity === "high" ? "bg-red-100" : "bg-yellow-100"
                      }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 ${student.severity === "high" ? "text-red-600" : "text-yellow-600"}`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                        {currentClass.name}
                      </p>
                      <p className="text-xs text-gray-700 mt-1" style={{ fontFamily: "Cambria, serif" }}>
                        {student.issue}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2 h-7 text-xs bg-transparent">
                    Contact Parent
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Messages */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
          <h3
            className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
            style={{ fontFamily: "Cambria, serif" }}
          >
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Recent Messages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                  message.unread
                    ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {message.from.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                        {message.from}
                      </p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "Cambria, serif" }}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                  {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                </div>
                <p className="text-sm text-gray-700" style={{ fontFamily: "Cambria, serif" }}>
                  {message.subject}
                </p>
                <Button size="sm" variant="outline" className="w-full mt-3 h-7 text-xs bg-transparent">
                  Read Message
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
