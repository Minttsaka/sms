"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Users, Building2, User, Printer } from "lucide-react"
import { ClassGradesTable } from "@/components/class-grades-table"
import { StudentSearch } from "@/components/student-search"
import { SubjectGradesDetail } from "@/components/subject-grades-detail"
import { generateinstitutionReport } from "@/lib/report-generator"
import { generatePDF, downloadPDF, printPDF, generateFileName } from "@/lib/pdf-generator"
import {
  dummyGradesForReport,
  dummyClassesForReport,
  dummyAssessmentsForReport,
  dummyGradesWithSubjects,
} from "@/lib/dummy-grades-data"

export default function GenerateReportPage() {
  const [reportType, setReportType] = useState<"individual" | "class" | "institution">("class")
  const [selectedClass, setSelectedClass] = useState("1")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [currentPDF, setCurrentPDF] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"summary" | "subjects">("summary")

  // Get all unique students in selected class
  const studentsInClass = Array.from(
    new Map(
      dummyGradesForReport
        .filter((g) => g.classId === selectedClass)
        .map((g) => [g.studentId, { studentId: g.studentId, studentName: g.studentName, studentNumber: g.studentNumber }]),
    ).values(),
  )

  // Get enhanced student data for subjects view
  const enhancedStudentsInClass = dummyGradesWithSubjects.filter((s) => s.classId === selectedClass)
  const selectedEnhancedStudent = enhancedStudentsInClass.find((s) => s.studentId === selectedStudent)

  // Generate reports based on selection
  const getReportData = () => {
    if (reportType === "institution") {
      return generateinstitutionReport(dummyClassesForReport, dummyGradesForReport, dummyAssessmentsForReport)
    } else {
      const classData = dummyClassesForReport.find((c) => c.id === selectedClass)
      return generateinstitutionReport([classData!], dummyGradesForReport, dummyAssessmentsForReport)
    }
  }

  const reportData = getReportData()

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      console.log("[v0] Starting PDF generation for report type:", reportType)
      const doc = generatePDF(reportData, reportType)
      setCurrentPDF(doc)

      const fileName = generateFileName(reportType)
      console.log("[v0] PDF generated successfully, initiating download:", fileName)

      downloadPDF(doc, fileName)
      console.log("[v0] PDF download completed")
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handlePrintPDF = () => {
    if (!currentPDF) {
      const doc = generatePDF(reportData, reportType)
      setCurrentPDF(doc)
      printPDF(doc)
    } else {
      printPDF(currentPDF)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generate institution Reports
            </h1>
            <p className="text-gray-600 mt-2">Export student grades and performance data as PDF</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handlePrintPDF}
              disabled={isGeneratingPDF || !currentPDF}
              size="lg"
              variant="outline"
              className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              <Printer className="w-5 h-5" />
              Print
            </Button>

            <Button
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF}
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Report Type Selection */}
        <Card className="border-0 bg-white shadow-sm">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* institution Report */}
              <div
                onClick={() => {
                  setReportType("institution")
                  setSelectedStudent(null)
                  setCurrentPDF(null)
                  setViewMode("summary")
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  reportType === "institution"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">institution Report</p>
                    <p className="text-sm text-gray-600">All classes</p>
                  </div>
                </div>
              </div>

              {/* Class Report */}
              <div
                onClick={() => {
                  setReportType("class")
                  setSelectedStudent(null)
                  setCurrentPDF(null)
                  setViewMode("summary")
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  reportType === "class"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Class Report</p>
                    <p className="text-sm text-gray-600">Select a class</p>
                  </div>
                </div>
              </div>

              {/* Individual Report */}
              <div
                onClick={() => {
                  setReportType("individual")
                  setCurrentPDF(null)
                  setViewMode("subjects")
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  reportType === "individual"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Student Report</p>
                    <p className="text-sm text-gray-600">Individual student</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Class & Student Selection */}
            {reportType !== "institution" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Select Class</label>
                  <Select
                    value={selectedClass}
                    onValueChange={(value) => {
                      setSelectedClass(value)
                      setSelectedStudent(null)
                      setCurrentPDF(null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyClassesForReport.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {reportType === "individual" && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Search & Select Student</label>
                    <StudentSearch
                      students={studentsInClass}
                      onSelect={(studentId) => {
                        setSelectedStudent(studentId)
                        setCurrentPDF(null)
                      }}
                      onClear={() => {
                        setSelectedStudent(null)
                        setCurrentPDF(null)
                      }}
                      selectedStudent={selectedStudent}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Report Preview */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-6">
          <TabsList className="border-b-2 border-gray-200 bg-transparent">
            {reportType !== "individual" && (
              <TabsTrigger
                value="summary"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <FileText className="w-4 h-4 mr-2" />
                Summary
              </TabsTrigger>
            )}
            {reportType === "individual" && selectedStudent && (
              <TabsTrigger
                value="subjects"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <FileText className="w-4 h-4 mr-2" />
                Subject Grades
              </TabsTrigger>
            )}
            {reportType !== "individual" && (
              <TabsTrigger
                value="detailed"
                className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <Users className="w-4 h-4 mr-2" />
                Detailed
              </TabsTrigger>
            )}
          </TabsList>

          {reportType === "individual" && selectedStudent && selectedEnhancedStudent ? (
            <TabsContent value="subjects" className="space-y-6">
              <SubjectGradesDetail student={selectedEnhancedStudent} />
            </TabsContent>
          ) : (
            <>
              <TabsContent value="summary" className="space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-0 bg-white">
                    <div className="p-4">
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{reportData.totalStudents}</p>
                    </div>
                  </Card>
                  <Card className="border-0 bg-white">
                    <div className="p-4">
                      <p className="text-sm text-gray-600">Overall Average</p>
                      <p className="text-3xl font-bold text-purple-600 mt-2">{reportData.overallAverage}%</p>
                    </div>
                  </Card>
                  <Card className="border-0 bg-white">
                    <div className="p-4">
                      <p className="text-sm text-gray-600">Pass Rate</p>
                      <p className="text-3xl font-bold text-emerald-600 mt-2">{reportData.overallPassRate}%</p>
                    </div>
                  </Card>
                  <Card className="border-0 bg-white">
                    <div className="p-4">
                      <p className="text-sm text-gray-600">Classes</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{reportData.classes.length}</p>
                    </div>
                  </Card>
                </div>

                {/* Class Summary Table */}
                <Card className="border-0 bg-white">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Class Performance Summary</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-blue-200 bg-blue-50">
                            <th className="px-4 py-3 text-left font-semibold">Class</th>
                            <th className="px-4 py-3 text-center font-semibold">Students</th>
                            <th className="px-4 py-3 text-center font-semibold">Avg %</th>
                            <th className="px-4 py-3 text-center font-semibold">Pass Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.classes.map((cls) => (
                            <tr key={cls.classId} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium">{cls.className}</td>
                              <td className="px-4 py-3 text-center">{cls.totalStudents}</td>
                              <td className="px-4 py-3 text-center text-blue-600 font-semibold">{cls.classAverage}%</td>
                              <td className="px-4 py-3 text-center">
                                <Badge className="bg-green-100 text-green-700">{cls.passRate}%</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-6">
                {reportType === "institution" ? (
                  reportData.classes.map((classData) => (
                    <ClassGradesTable
                      key={classData.classId}
                      students={classData.students}
                      className={classData.className}
                    />
                  ))
                ) : (
                  <ClassGradesTable
                    students={reportData.classes[0].students}
                    className={reportData.classes[0].className}
                  />
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  )
}
