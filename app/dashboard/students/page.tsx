"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  GraduationCap,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  Users,
  BookOpen,
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  firstName: string
  middleName?: string | null
  lastName: string
  email: string
  phone?: string | null
  avatar?: string | null
  dateOfBirth?: string
}

interface Student {
  id: string
  userId?: string | null
  institutionId: string
  admissionNumber?: string | null
  classId?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  bloodGroup?: string | null
  address?: string | null
  guardianName?: string | null
  guardianPhone?: string | null
  guardianEmail?: string | null
  user?: User | null
  class?: {
    id: string
    name: string
    section: string | null
    academicYear?: string | null
  } | null
}

interface Class {
  id: string
  name: string
  section: string | null
  academicYear?: string | null
}

export default function StudentsPage() {
  const searchParams = useSearchParams()
  const institutionId = searchParams.get('q')

  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    admissionNumber: "",
    classId: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
  })

  useEffect(() => {
    if (institutionId) {
      fetchStudents()
      fetchClasses()
    }
  }, [institutionId])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/students?id=${institutionId}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched students:", data)
        setStudents(data.students || [])
      } else {
        toast.error("Failed to fetch students")
      }
    } catch (error) {
      console.error("[v0] Fetch students error:", error)
      toast.error("Failed to fetch students")
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

  const handleCreateStudent = async () => {
    try {
      // Validate required fields
      if (!newStudent.firstName || !newStudent.lastName) {
        toast.error("First name and last name are required")
        return
      }

      const response = await fetch(`/api/students?id=${institutionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStudent,
          institutionId,
        }),
      })

      console.log("Create student response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message || "Student added successfully")
        setIsDialogOpen(false)
        // Reset form
        setNewStudent({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phone: "",
          admissionNumber: "",
          classId: "",
          dateOfBirth: "",
          gender: "",
          bloodGroup: "",
          address: "",
          guardianName: "",
          guardianPhone: "",
          guardianEmail: "",
        })
        fetchStudents()
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to create student")
      }
    } catch (error: any) {
      console.error("[v0] Create student error:", error)
      toast.error(error.message || "Failed to add student")
    }
  }

  const getDisplayName = (student: Student) => {
    if (student.user) {
      return `${student.user.firstName} ${student.user.middleName ? student.user.middleName + ' ' : ''}${student.user.lastName}`
    }
    return "No Name"
  }

  const getDisplayEmail = (student: Student) => {
    return student.user?.email || "No email"
  }

  const getDisplayPhone = (student: Student) => {
    return student.user?.phone || null
  }

  const getInitials = (student: Student) => {
    if (student.user) {
      return `${student.user.firstName?.[0] || ''}${student.user.lastName?.[0] || ''}`.toUpperCase()
    }
    return "?"
  }

  const filteredStudents = students.filter((student) => {
    const name = getDisplayName(student).toLowerCase()
    const email = getDisplayEmail(student).toLowerCase()
    const admissionNum = student.admissionNumber?.toLowerCase() || ""
    
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      admissionNum.includes(searchQuery.toLowerCase())

    const matchesClass = selectedClass === "all" || student.classId === selectedClass

    return matchesSearch && matchesClass
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: "Cambria, serif" }}
          >
            Students
          </h1>
          <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
            Manage student records and information
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

          <Link href={`/dashboard/enrollment?q=${institutionId}`}>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </Link>          
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Total Students
              </p>
              <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                {students.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Active Today
              </p>
              <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                {Math.floor(students.length * 0.94)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                New This Month
              </p>
              <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                12
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: "Cambria, serif" }}>
                Classes
              </p>
              <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                {classes.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and filters */}
      <Card className="bg-white border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, email, or admission number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-10 px-3 rounded-md border border-gray-300 bg-white"
            style={{ fontFamily: "Cambria, serif" }}
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.section && `- ${cls.section}`}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-blue-600 text-white" : "border-gray-300 bg-transparent"}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? "bg-blue-600 text-white" : "border-gray-300 bg-transparent"}
            >
              Table
            </Button>
          </div>
        </div>
      </Card>

      {/* Students display */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
            Loading students...
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <Card className="bg-white border-gray-200 p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
            No students found
          </h3>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "Cambria, serif" }}>
            {searchQuery || selectedClass !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first student"}
          </p>
          {!searchQuery && selectedClass === "all" && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          )}
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="bg-white border-gray-200 p-6 hover:shadow-xl transition-all group">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 border-2 border-blue-200">
                  <AvatarImage src={student.user?.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-lg font-bold">
                    {getInitials(student)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                    {getDisplayName(student)}
                  </h3>
                  {student.admissionNumber && (
                    <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      ID: {student.admissionNumber}
                    </p>
                  )}
                  {student.class && (
                    <Badge className="mt-1 bg-blue-100 text-blue-700 border-blue-200">
                      {student.class.name} {student.class.section && `- ${student.class.section}`}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span style={{ fontFamily: "Cambria, serif" }}>{getDisplayEmail(student)}</span>
                </div>
                {getDisplayPhone(student) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span style={{ fontFamily: "Cambria, serif" }}>{getDisplayPhone(student)}</span>
                  </div>
                )}
                {student.guardianName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span style={{ fontFamily: "Cambria, serif" }}>Guardian: {student.guardianName}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="border-gray-300 bg-transparent">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 bg-transparent text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ fontFamily: "Cambria, serif" }}>Student</TableHead>
                <TableHead style={{ fontFamily: "Cambria, serif" }}>Admission No.</TableHead>
                <TableHead style={{ fontFamily: "Cambria, serif" }}>Class</TableHead>
                <TableHead style={{ fontFamily: "Cambria, serif" }}>Contact</TableHead>
                <TableHead style={{ fontFamily: "Cambria, serif" }}>Guardian</TableHead>
                <TableHead style={{ fontFamily: "Cambria, serif" }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-blue-200">
                        <AvatarImage src={student.user?.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-bold">
                          {getInitials(student)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                          {getDisplayName(student)}
                        </p>
                        <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                          {getDisplayEmail(student)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell style={{ fontFamily: "Cambria, serif" }}>{student.admissionNumber || "-"}</TableCell>
                  <TableCell>
                    {student.class ? (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                        {student.class.name} {student.class.section && `- ${student.class.section}`}
                      </Badge>
                    ) : (
                      <span className="text-gray-500" style={{ fontFamily: "Cambria, serif" }}>
                        -
                      </span>
                    )}
                  </TableCell>
                  <TableCell style={{ fontFamily: "Cambria, serif" }}>{getDisplayPhone(student) || "-"}</TableCell>
                  <TableCell style={{ fontFamily: "Cambria, serif" }}>{student.guardianName || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}