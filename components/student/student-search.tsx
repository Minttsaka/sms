"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"

interface StudentSearchProps {
  students: Array<{ studentId: string; studentName: string; studentNumber: string }>
  onSelect: (studentId: string) => void
  onClear: () => void
  selectedStudent: string | null
}

export function StudentSearch({ students, onSelect, onClear, selectedStudent }: StudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredStudents, setFilteredStudents] = useState(students)

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students)
      return
    }

    const term = searchTerm.toLowerCase()
    const filtered = students.filter(
      (student) =>
        student.studentName.toLowerCase().includes(term) || student.studentNumber.toLowerCase().includes(term),
    )
    setFilteredStudents(filtered)
  }, [searchTerm, students])

  const selectedStudentName = students.find((s) => s.studentId === selectedStudent)?.studentName

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search student by name or number..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {selectedStudent && (
          <button
            onClick={() => {
              setSearchTerm("")
              onClear()
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && searchTerm && filteredStudents.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredStudents.map((student) => (
            <button
              key={student.studentId}
              onClick={() => {
                onSelect(student.studentId)
                setSearchTerm("")
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
            >
              <div className="font-medium text-gray-800">{student.studentName}</div>
              <div className="text-sm text-gray-500">{student.studentNumber}</div>
            </button>
          ))}
        </div>
      )}

      {selectedStudent && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-blue-700">{selectedStudentName}</span>
          </p>
        </div>
      )}
    </div>
  )
}
