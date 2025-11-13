"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  Search,
  Filter,
  Grid3x3,
  List,
  Mail,
  Phone,
  Award,
  BookOpen,
  Calendar,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  GraduationCap,
  MoreVertical,
  Download,
  Upload,
  UserPlus,
  UserCog,
  Building,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

// Updated interfaces to match the API response structure
interface User {
  id: string
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  phone?: string | null
  dateOfBirth: string
  avatar?: string | null
}

interface Teacher {
  id: string
  userId?: string | null
  firstName: string
  middleName?: string | null
  lastName: string
  email?: string | null
  phone: string
  avatar?: string | null
  employeeNumber?: string | null
  subjects: string[]
  qualification?: string | null
  experience?: number | null
  salary?: number | null
  joinDate?: string | null
  user?: User | null
  classes?: any[]
}

interface TeacherOnInstitution {
  id: string
  teacherId: string
  institutionId: string
  teacher: Teacher
}

interface Class {
  id: string
  name: string
  section: string | null
  academicYear: string | null
}

export default function TeachersPage() {
  const searchParams = useSearchParams();
  const institutionId = searchParams.get('q');

  const [teachersData, setTeachersData] = useState<TeacherOnInstitution[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [newTeacher, setNewTeacher] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    employeeNumber: "",
    subjects: "",
    qualification: "",
    experience: 0,
    salary: 0,
    joinDate: "",
    role: "TEACHER" as const,
  })
  const [assignmentForm, setAssignmentForm] = useState({
    classIds: [] as string[],
    subjects: [] as string[],
  })

  useEffect(() => {
    if (institutionId) {
      fetchTeachers()
      fetchClasses()
    }
  }, [institutionId])

  const fetchTeachers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/teachers?id=${institutionId}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched teachers data:", data)
        // The API returns { teachers: TeacherOnInstitution[] }
        setTeachersData(data.teachers || [])
      } else {
        toast.error("Failed to fetch teachers")
      }
    } catch (error) {
      console.error("[v0] Fetch teachers error:", error)
      toast.error("Failed to fetch teachers")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch(`/api/classes?id=${institutionId}`)
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error("[v0] Fetch classes error:", error)
    }
  }

  const handleCreateTeacher = async () => {
    try {
      // Validate required fields
      if (!newTeacher.firstName || !newTeacher.lastName || !newTeacher.email || !newTeacher.dateOfBirth) {
        toast.error("Please fill in all required fields")
        return
      }

      const response = await fetch(`/api/teachers?id=${institutionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTeacher,
          institutionId,
          subjects: newTeacher.subjects
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      })

      if (response.ok) {
        toast.success("Teacher added successfully")
        setIsDialogOpen(false)
        // Reset form
        setNewTeacher({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          phone: "",
          employeeNumber: "",
          subjects: "",
          qualification: "",
          experience: 0,
          salary: 0,
          joinDate: "",
          role: "TEACHER",
        })
        fetchTeachers()
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to create teacher")
      }
    } catch (error: any) {
      console.error("[v0] Create teacher error:", error)
      toast.error(error.message || "Failed to add teacher")
    }
  }

  const handleOpenAssignment = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    // Pre-populate with existing assignments if available
    setAssignmentForm({
      classIds: teacher.classes?.map(c => c.classId) || [],
      subjects: teacher.subjects || [],
    })
    setIsAssignDialogOpen(true)
  }

  const handleSaveAssignment = async () => {
    if (!selectedTeacher) return

    try {
      const response = await fetch(`/api/teachers/${selectedTeacher.id}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentForm),
      })

      if (response.ok) {
        toast.success("Teacher assignments updated successfully")
        setIsAssignDialogOpen(false)
        setSelectedTeacher(null)
        setAssignmentForm({ classIds: [], subjects: [] })
        fetchTeachers()
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to update assignments")
      }
    } catch (error: any) {
      console.error("[v0] Update assignment error:", error)
      toast.error(error.message || "Failed to update assignments")
    }
  }

  const toggleClass = (classId: string) => {
    setAssignmentForm((prev) => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter((id) => id !== classId)
        : [...prev.classIds, classId],
    }))
  }

  const addSubject = (subject: string) => {
    const trimmedSubject = subject.trim()
    if (trimmedSubject && !assignmentForm.subjects.includes(trimmedSubject)) {
      setAssignmentForm((prev) => ({
        ...prev,
        subjects: [...prev.subjects, trimmedSubject],
      }))
    }
  }

  const removeSubject = (subject: string) => {
    setAssignmentForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subject),
    }))
  }

  // Extract teachers from the TeacherOnInstitution structure
  const teachers = teachersData.map(t => t.teacher)

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.middleName || ''} ${teacher.lastName}`.toLowerCase()
    const userEmail = teacher.user?.email?.toLowerCase() || teacher.email?.toLowerCase() || ''
    const employeeNum = teacher.employeeNumber?.toLowerCase() || ''
    
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      employeeNum.includes(searchQuery.toLowerCase()) ||
      userEmail.includes(searchQuery.toLowerCase())

    const matchesSubject =
      filterSubject === "all" || 
      teacher.subjects?.some((s) => s.toLowerCase().includes(filterSubject.toLowerCase()))

    return matchesSearch && matchesSubject
  })

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const getDisplayName = (teacher: Teacher) => {
    return `${teacher.firstName} ${teacher.middleName ? teacher.middleName + ' ' : ''}${teacher.lastName}`
  }

  const getDisplayEmail = (teacher: Teacher) => {
    return teacher.user?.email || teacher.email || 'No email'
  }

  const getDisplayPhone = (teacher: Teacher) => {
    return teacher.user?.phone || teacher.phone || null
  }

  const avgPerformance = teachers.length > 0 ? 93.5 : 0
  const avgAttendance = teachers.length > 0 ? 96.2 : 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: "Cambria, serif" }}
          >
            Teachers Management
          </h1>
          <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
            Manage all teaching staff, assignments, and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-gray-300 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="border-gray-300 bg-transparent">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle style={{ fontFamily: "Cambria, serif" }}>Add New Teacher</DialogTitle>
                <DialogDescription style={{ fontFamily: "Cambria, serif" }}>
                  Fill in the details to add a new teacher to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>First Name *</Label>
                    <Input
                      placeholder="Enter first name"
                      value={newTeacher.firstName}
                      onChange={(e) => setNewTeacher({ ...newTeacher, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Middle Name</Label>
                    <Input
                      placeholder="Enter middle name (if any)"
                      value={newTeacher.middleName}
                      onChange={(e) => setNewTeacher({ ...newTeacher, middleName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Last Name *</Label>
                    <Input
                      placeholder="Enter last name"
                      value={newTeacher.lastName}
                      onChange={(e) => setNewTeacher({ ...newTeacher, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Email *</Label>
                    <Input
                      type="email"
                      placeholder="email@institution.edu"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Date of Birth *</Label>
                    <Input
                      type="date"
                      value={newTeacher.dateOfBirth}
                      onChange={(e) => setNewTeacher({ ...newTeacher, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Phone</Label>
                    <Input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={newTeacher.phone}
                      onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Employee Number</Label>
                    <Input
                      placeholder="TCH###"
                      value={newTeacher.employeeNumber}
                      onChange={(e) => setNewTeacher({ ...newTeacher, employeeNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Join Date</Label>
                    <Input
                      type="date"
                      value={newTeacher.joinDate}
                      onChange={(e) => setNewTeacher({ ...newTeacher, joinDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label style={{ fontFamily: "Cambria, serif" }}>Subjects (comma-separated) *</Label>
                  <Input
                    placeholder="e.g., Mathematics, Physics"
                    value={newTeacher.subjects}
                    onChange={(e) => setNewTeacher({ ...newTeacher, subjects: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ fontFamily: "Cambria, serif" }}>Qualification</Label>
                  <Input
                    placeholder="e.g., MSc Mathematics"
                    value={newTeacher.qualification}
                    onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Experience (years)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newTeacher.experience}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, experience: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label style={{ fontFamily: "Cambria, serif" }}>Salary</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newTeacher.salary}
                      onChange={(e) => setNewTeacher({ ...newTeacher, salary: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTeacher}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  Save Teacher
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats cards */}
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
              Total Teachers
            </p>
            <p className="text-4xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              {teachers.length}
            </p>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/30">
                <Award className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Excellent</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
              Avg Performance
            </p>
            <p className="text-4xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              {avgPerformance}%
            </p>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
              Avg Attendance
            </p>
            <p className="text-4xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              {avgAttendance}%
            </p>
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-600/30">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Active</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
              Total Classes
            </p>
            <p className="text-4xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              {classes.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters and view toggle */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, employee number, or email..."
              className="pl-12 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="history">History</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-white shadow-sm" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Teachers display */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
            Loading teachers...
          </p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <Card className="bg-white border-gray-200 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
            No teachers found
          </h3>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "Cambria, serif" }}>
            {searchQuery || filterSubject !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first teacher"}
          </p>
          {!searchQuery && filterSubject === "all" && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Teacher
            </Button>
          )}
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="bg-white/80 backdrop-blur-sm border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14 border-2 border-blue-200">
                    <AvatarImage src={teacher.avatar || teacher.user?.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-lg font-bold">
                      {getInitials(teacher.firstName, teacher.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg" style={{ fontFamily: "Cambria, serif" }}>
                      {getDisplayName(teacher)}
                    </h3>
                    {teacher.employeeNumber && (
                      <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                        {teacher.employeeNumber}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenAssignment(teacher)}>
                      <UserCog className="w-4 h-4 mr-2" />
                      Assign Classes & Subjects
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span style={{ fontFamily: "Cambria, serif" }}>{getDisplayEmail(teacher)}</span>
                </div>
                {getDisplayPhone(teacher) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span style={{ fontFamily: "Cambria, serif" }}>{getDisplayPhone(teacher)}</span>
                  </div>
                )}
                {teacher.qualification && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span style={{ fontFamily: "Cambria, serif" }}>{teacher.qualification}</span>
                  </div>
                )}
                {teacher.experience !== null && teacher.experience !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span style={{ fontFamily: "Cambria, serif" }}>{teacher.experience} years experience</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {teacher.subjects && teacher.subjects.length > 0 ? (
                  teacher.subjects.map((subject, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-700 border-blue-200">
                      {subject}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500" style={{ fontFamily: "Cambria, serif" }}>
                    No subjects assigned
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                <span className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  {teacher.classes?.length || 0} classes assigned
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    Teacher
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    Contact
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    Subjects
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    Experience
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    Classes
                  </th>
                  <th
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-900"
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <TableRow
                    key={teacher.id}
                    teacher={teacher}
                    getInitials={getInitials}
                    getDisplayName={getDisplayName}
                    getDisplayEmail={getDisplayEmail}
                    getDisplayPhone={getDisplayPhone}
                    onAssign={handleOpenAssignment}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Cambria, serif" }}>Assign Classes & Subjects</DialogTitle>
            <DialogDescription style={{ fontFamily: "Cambria, serif" }}>
              {selectedTeacher && `Manage assignments for ${getDisplayName(selectedTeacher)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Classes Assignment */}
            <div className="space-y-3">
              <Label className="text-base font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                <Building className="w-4 h-4 inline mr-2" />
                Assign Classes
              </Label>
              {classes.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={`class-${cls.id}`}
                          checked={assignmentForm.classIds.includes(cls.id)}
                          onCheckedChange={() => toggleClass(cls.id)}
                        />
                        <label
                          htmlFor={`class-${cls.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          style={{ fontFamily: "Cambria, serif" }}
                        >
                          {cls.name} {cls.section && `- ${cls.section}`}
                          {cls.academicYear && <span className="text-xs text-gray-500 ml-1">({cls.academicYear})</span>}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                    {assignmentForm.classIds.length} class(es) selected
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500 p-4 border border-gray-200 rounded-lg" style={{ fontFamily: "Cambria, serif" }}>
                  No classes available. Please create classes first.
                </p>
              )}
            </div>

            {/* Subjects Assignment */}
            <div className="space-y-3">
              <Label className="text-base font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                <BookOpen className="w-4 h-4 inline mr-2" />
                Assign Subjects
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter subject name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSubject(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    if (input && input.value.trim()) {
                      addSubject(input.value)
                      input.value = ""
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px]">
                {assignmentForm.subjects.length === 0 ? (
                  <p className="text-sm text-gray-500" style={{ fontFamily: "Cambria, serif" }}>
                    No subjects assigned yet
                  </p>
                ) : (
                  assignmentForm.subjects.map((subject, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 cursor-pointer hover:bg-blue-200"
                      onClick={() => removeSubject(subject)}
                    >
                      {subject}
                      <span className="ml-2 text-blue-900">×</span>
                    </Badge>
                  ))
                )}
              </div>
              <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                Click on a subject to remove it
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setIsAssignDialogOpen(false)
              setSelectedTeacher(null)
              setAssignmentForm({ classIds: [], subjects: [] })
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignment} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Save Assignments
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TableRow({
  teacher,
  getInitials,
  getDisplayName,
  getDisplayEmail,
  getDisplayPhone,
  onAssign,
}: { 
  teacher: Teacher
  getInitials: (firstName: string, lastName: string) => string
  getDisplayName: (teacher: Teacher) => string
  getDisplayEmail: (teacher: Teacher) => string
  getDisplayPhone: (teacher: Teacher) => string | null
  onAssign: (teacher: Teacher) => void 
}) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-blue-200">
            <AvatarImage src={teacher.avatar || teacher.user?.avatar || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-bold">
              {getInitials(teacher.firstName, teacher.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              {getDisplayName(teacher)}
            </p>
            {teacher.employeeNumber && (
              <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                {teacher.employeeNumber}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
            {getDisplayEmail(teacher)}
          </p>
          {getDisplayPhone(teacher) && (
            <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              {getDisplayPhone(teacher)}
            </p>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1">
          {teacher.subjects && teacher.subjects.length > 0 ? (
            teacher.subjects.map((subject, index) => (
              <Badge key={index} className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                {subject}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-500" style={{ fontFamily: "Cambria, serif" }}>
              None
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
          {teacher.experience !== null && teacher.experience !== undefined ? `${teacher.experience} years` : "-"}
        </p>
      </td>
      <td className="px-6 py-4">
        <p className="text-sm text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
          {teacher.classes?.length || 0}
        </p>
      </td>
      <td className="px-6 py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssign(teacher)}>
              <UserCog className="w-4 h-4 mr-2" />
              Assign Classes & Subjects
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}