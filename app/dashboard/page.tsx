"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserPlus,
  FileText,
  Calendar,
  AlertCircle,
  Clock,
  Award,
  Target,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  BarChart3,
} from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { useSearchParams } from "next/navigation"
import { use, useEffect, useState } from "react"
import { Institution } from "@prisma/client"

const attendanceData = [
  { day: "Mon", rate: 92 },
  { day: "Tue", rate: 95 },
  { day: "Wed", rate: 88 },
  { day: "Thu", rate: 94 },
  { day: "Fri", rate: 90 },
]

const performanceData = [
  { subject: "Math", score: 85 },
  { subject: "Science", score: 78 },
  { subject: "English", score: 92 },
  { subject: "History", score: 88 },
  { subject: "Arts", score: 95 },
]

const revenueData = [
  { month: "Jan", income: 45000, expenses: 32000 },
  { month: "Feb", income: 52000, expenses: 35000 },
  { month: "Mar", income: 48000, expenses: 33000 },
  { month: "Apr", income: 61000, expenses: 38000 },
  { month: "May", income: 55000, expenses: 36000 },
  { month: "Jun", income: 67000, expenses: 40000 },
]

const recentActivities = [
  { id: 1, type: "payment", message: "Fee payment received from John Doe", time: "2 hours ago" },
  { id: 2, type: "exam", message: "Mid-term exam scheduled for Grade 10", time: "5 hours ago" },
  { id: 3, type: "alert", message: "3 students absent today", time: "1 day ago" },
  { id: 4, type: "event", message: "Parent-teacher meeting on Friday", time: "2 days ago" },
]

const enrollmentTrend = [
  { month: "Jan", students: 1150 },
  { month: "Feb", students: 1180 },
  { month: "Mar", students: 1200 },
  { month: "Apr", students: 1220 },
  { month: "May", students: 1234 },
]

const classDistribution = [
  { grade: "Grade 1-3", count: 320, color: "#3b82f6" },
  { grade: "Grade 4-6", count: 380, color: "#8b5cf6" },
  { grade: "Grade 7-9", count: 290, color: "#10b981" },
  { grade: "Grade 10-12", count: 244, color: "#f59e0b" },
]

const upcomingEvents = [
  { id: 1, title: "Parent-Teacher Meeting", date: "Tomorrow, 10:00 AM", type: "meeting" },
  { id: 2, title: "Mid-term Exams Begin", date: "In 3 days", type: "exam" },
  { id: 3, title: "Sports Day", date: "Next Week", type: "event" },
]

const topPerformers = [
  { name: "Sarah Johnson", grade: "Grade 12", score: 98.5, avatar: "SJ" },
  { name: "Michael Chen", grade: "Grade 11", score: 97.8, avatar: "MC" },
  { name: "Emma Williams", grade: "Grade 10", score: 96.2, avatar: "EW" },
]

export default function AdminDashboard() {

  const searchParams = useSearchParams();
  const institutionId = searchParams.get('q');
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!institutionId) {
      setInstitution(null);
      return;
    }

    const fetchInstitution = async () => {
      setIsLoading(true);
      setError(null);
      try {
 
        const res = await fetch(`/api/institution?id=${institutionId}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch institution data');
        }
        
        const data: Institution = await res.json();

        console.log("institution",data)
        setInstitution(data);

      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitution();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: "Cambria, serif" }}
          >
            {institution?.name}
          </h1>
          <p className="text-gray-600 flex items-center gap-2" style={{ fontFamily: "Cambria, serif" }}>
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Welcome back! Here's what's happening in your institution today.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
              Total Students
            </p>
            <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
              1,234
            </p>
            <Progress value={85} className="h-2 bg-blue-200" />
            <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: "Cambria, serif" }}>
              85% capacity
            </p>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
              Total Teachers
            </p>
            <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
              87
            </p>
            <Progress value={92} className="h-2 bg-purple-200" />
            <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: "Cambria, serif" }}>
              92% active today
            </p>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/30">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Activity className="w-3 h-3 mr-1" />
                38 Active
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
              Total Classes
            </p>
            <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
              42
            </p>
            <Progress value={90} className="h-2 bg-green-200" />
            <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: "Cambria, serif" }}>
              Across 12 grades
            </p>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-600/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +23%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
              Fees Collected
            </p>
            <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
              $67K
            </p>
            <Progress value={78} className="h-2 bg-yellow-200" />
            <p className="text-xs text-gray-600 mt-2" style={{ fontFamily: "Cambria, serif" }}>
              78% collection rate
            </p>
          </div>
        </Card>
      </div>

      {/* Mini stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                94.2%
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Attendance
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                88.5
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Avg Score
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                12
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Events
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                23
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Absent
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                8
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Pending
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                45
              </p>
              <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Messages
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Weekly Attendance Rate
              </h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Average attendance across all classes
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
              <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fill="url(#colorRate)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Class distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "Cambria, serif" }}>
              Class Distribution
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              Students by grade level
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={classDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {classDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  fontFamily: "Cambria, serif",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {classDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700" style={{ fontFamily: "Cambria, serif" }}>
                    {item.grade}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance and Financial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Academic Performance
              </h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Average scores by subject
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.2%
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="subject" stroke="#6b7280" style={{ fontFamily: "Cambria, serif", fontSize: 12 }} />
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
              <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Financial summary */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Financial Overview
              </h3>
              <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Income vs Expenses (6 months)
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Profit
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontFamily: "Cambria, serif", fontSize: 12 }} />
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
              <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
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
              <UserPlus className="w-4 h-4 mr-2" />
              <span style={{ fontFamily: "Cambria, serif" }}>Add New Student</span>
            </Button>
            <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 border border-gray-200">
              <DollarSign className="w-4 h-4 mr-2" />
              <span style={{ fontFamily: "Cambria, serif" }}>Record Payment</span>
            </Button>
            <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 border border-gray-200">
              <FileText className="w-4 h-4 mr-2" />
              <span style={{ fontFamily: "Cambria, serif" }}>Create Exam</span>
            </Button>
            <Button className="w-full justify-start bg-white hover:bg-gray-50 text-gray-900 border border-gray-200">
              <Calendar className="w-4 h-4 mr-2" />
              <span style={{ fontFamily: "Cambria, serif" }}>Schedule Event</span>
            </Button>
          </div>
        </Card>

        {/* Top performers */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
          <h3
            className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
            style={{ fontFamily: "Cambria, serif" }}
          >
            <Award className="w-5 h-5 text-yellow-600" />
            Top Performers
          </h3>
          <div className="space-y-4">
            {topPerformers.map((student, index) => (
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
                    {student.grade}
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

        {/* Upcoming events */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
          <h3
            className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
            style={{ fontFamily: "Cambria, serif" }}
          >
            <Calendar className="w-5 h-5 text-purple-600" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      event.type === "meeting" ? "bg-blue-100" : event.type === "exam" ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {event.type === "meeting" ? (
                      <Users className="w-5 h-5 text-blue-600" />
                    ) : event.type === "exam" ? (
                      <FileText className="w-5 h-5 text-red-600" />
                    ) : (
                      <Calendar className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {event.title}
                    </p>
                    <p
                      className="text-xs text-gray-600 flex items-center gap-1 mt-1"
                      style={{ fontFamily: "Cambria, serif" }}
                    >
                      <Clock className="w-3 h-3" />
                      {event.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent activities */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all">
        <h3
          className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"
          style={{ fontFamily: "Cambria, serif" }}
        >
          <Activity className="w-5 h-5 text-blue-600" />
          Recent Activities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === "payment"
                      ? "bg-green-100"
                      : activity.type === "exam"
                        ? "bg-blue-100"
                        : activity.type === "alert"
                          ? "bg-red-100"
                          : "bg-purple-100"
                  }`}
                >
                  {activity.type === "payment" ? (
                    <DollarSign className="w-5 h-5 text-green-600" />
                  ) : activity.type === "exam" ? (
                    <FileText className="w-5 h-5 text-blue-600" />
                  ) : activity.type === "alert" ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Calendar className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium" style={{ fontFamily: "Cambria, serif" }}>
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "Cambria, serif" }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
