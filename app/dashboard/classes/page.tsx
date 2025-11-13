"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { BookOpen, Plus, Users, Calendar, Edit, Trash2, Search, Filter, GraduationCap, MapPin } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Class {
  id: string
  name: string
  section: string
  academicYear: string
  capacity: number
  roomNumber: string
  studentCount: number
  teacherCount: number
}

export default function ClassesPage() {
  const searchParams = useSearchParams();
  const institutionId = searchParams.get('q');
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [newClass, setNewClass] = useState({
    name: "",
    section: "",
    academicYear: "2024-2025",
    capacity: 30,
    roomNumber: "",
  })

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch(`/api/classes?id=${institutionId}`)
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error("[v0] Fetch classes error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateClass = async () => {
    try {
      const response = await fetch(`/api/classes?id=${institutionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newClass,
          institutionId,
        }),
      })

      if (response.ok) {
        toast.success("Class created successfully")
        setIsDialogOpen(false)
        setNewClass({
          name: "",
          section: "",
          academicYear: "2024-2025",
          capacity: 30,
          roomNumber: "",
        })
        fetchClasses()
      } else {
        throw new Error("Failed to create class")
      }
    } catch (error) {
      console.error("[v0] Create class error:", error)
      toast.error("Failed to create class")
    }
  }

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: "Cambria, serif" }}
          >
            Classes
          </h1>
          <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
            Manage your institution classes and sections
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "Cambria, serif" }}>Create New Class</DialogTitle>
              <DialogDescription style={{ fontFamily: "Cambria, serif" }}>
                Add a new class to your institution
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ fontFamily: "Cambria, serif" }}>
                    Class Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Grade 10"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    style={{ fontFamily: "Cambria, serif" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section" style={{ fontFamily: "Cambria, serif" }}>
                    Section *
                  </Label>
                  <Input
                    id="section"
                    placeholder="e.g., A"
                    value={newClass.section}
                    onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                    style={{ fontFamily: "Cambria, serif" }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear" style={{ fontFamily: "Cambria, serif" }}>
                  Academic Year *
                </Label>
                <Input
                  id="academicYear"
                  placeholder="2024-2025"
                  value={newClass.academicYear}
                  onChange={(e) => setNewClass({ ...newClass, academicYear: e.target.value })}
                  style={{ fontFamily: "Cambria, serif" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity" style={{ fontFamily: "Cambria, serif" }}>
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({ ...newClass, capacity: Number.parseInt(e.target.value) })}
                    style={{ fontFamily: "Cambria, serif" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomNumber" style={{ fontFamily: "Cambria, serif" }}>
                    Room Number
                  </Label>
                  <Input
                    id="roomNumber"
                    placeholder="e.g., 101"
                    value={newClass.roomNumber}
                    onChange={(e) => setNewClass({ ...newClass, roomNumber: e.target.value })}
                    style={{ fontFamily: "Cambria, serif" }}
                  />
                </div>
              </div>
              <Button
                onClick={handleCreateClass}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Create Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300"
              style={{ fontFamily: "Cambria, serif" }}
            />
          </div>
          <Button variant="outline" className="border-gray-300 bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
            Loading classes...
          </p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <Card className="bg-white border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
            No classes found
          </h3>
          <p className="text-gray-600 mb-6" style={{ fontFamily: "Cambria, serif" }}>
            Get started by creating your first class
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Class
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <Card key={cls.id} className="bg-white border-gray-200 p-6 hover:shadow-xl transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {cls.name}
                    </h3>
                    <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                      Section {cls.section}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span style={{ fontFamily: "Cambria, serif" }}>{cls.academicYear}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span style={{ fontFamily: "Cambria, serif" }}>Room {cls.roomNumber || "TBA"}</span>
                </div>
                <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {cls.studentCount || 0}/{cls.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                      {cls.teacherCount || 0} Teachers
                    </span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
