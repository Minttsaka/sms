import jsPDF from "jspdf"
import "jspdf-autotable"
import type { institutionReportData } from "./report-generator"

export function generatePDF(reportData: institutionReportData, reportType: "individual" | "class" | "institution") {
  const doc = new jsPDF()

  doc.setFont("helvetica")

  // Header
  doc.setFontSize(20)
  doc.setTextColor(31, 41, 55) // Dark gray
  doc.text(reportData.institutionName, 14, 20)

  doc.setFontSize(14)
  doc.setTextColor(59, 130, 246) // Blue
  doc.text("institution Grade Report", 14, 28)

  doc.setFontSize(9)
  doc.setTextColor(75, 85, 99) // Medium gray
  doc.text(`Academic Year: ${reportData.academicYear}`, 14, 35)
  doc.text(`Report Date: ${reportData.reportDate}`, 14, 41)

  // Add separator line
  doc.setDrawColor(219, 234, 254) // Light blue
  doc.line(14, 44, 196, 44)

  let yPosition = 50

  if (reportType === "institution") {
    // institution-wide report
    doc.setFontSize(14)
    doc.setTextColor(31, 41, 55)
    doc.text("institution Performance Summary", 14, yPosition)
    yPosition += 12

    const summaryData = [
      ["Total Students", reportData.totalStudents.toString()],
      ["Overall Average", `${reportData.overallAverage}%`],
      ["Overall Pass Rate", `${reportData.overallPassRate}%`],
      ["Total Classes", reportData.classes.length.toString()],
    ]

    const summaryTable = (doc as any).autoTable({
      startY: yPosition,
      head: [["Metric", "Value"]],
      body: summaryData,
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
        halign: "left",
      },
      bodyStyles: {
        textColor: 0,
        fontSize: 9,
        cellPadding: 6,
      },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      margin: { left: 14, right: 14 },
      didDrawPage: (data: any) => {
        // Footer
        const pageSize = doc.internal.pageSize
        const pageHeight = pageSize.getHeight()
        const pageWidth = pageSize.getWidth()
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" })
      },
    })

    yPosition = summaryTable.lastAutoTable.finalY + 15

    // Class details
    reportData.classes.forEach((classData, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 15
      }

      doc.setFontSize(12)
      doc.setTextColor(31, 41, 55)
      doc.text(`${classData.className} - Performance`, 14, yPosition)
      yPosition += 8

      const classTableData = classData.students.map((student) => [
        student.studentNumber,
        student.studentName.substring(0, 25),
        `${student.finalPercentage}%`,
        student.finalLetterGrade,
        student.passedCount.toString(),
        student.failedCount.toString(),
      ])

      const classTable = (doc as any).autoTable({
        startY: yPosition,
        head: [["Std. No.", "Name", "Final %", "Grade", "Passed", "Failed"]],
        body: classTableData,
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          textColor: 0,
          fontSize: 8,
          cellPadding: 5,
        },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 65 },
          2: { cellWidth: 22 },
          3: { cellWidth: 18 },
          4: { cellWidth: 18 },
          5: { cellWidth: 18 },
        },
      })

      yPosition = classTable.lastAutoTable.finalY + 12
    })
  } else {
    // Class or individual report
    const allStudents = reportData.classes.flatMap((c) => c.students)

    allStudents.forEach((student, studentIndex) => {
      if (yPosition > 220) {
        doc.addPage()
        yPosition = 15
      }

      // Student header
      doc.setFontSize(12)
      doc.setTextColor(31, 41, 55)
      doc.text(`Student: ${student.studentName}`, 14, yPosition)
      yPosition += 6

      doc.setFontSize(9)
      doc.setTextColor(75, 85, 99)
      doc.text(`Student Number: ${student.studentNumber} | Class: ${student.className}`, 14, yPosition)
      yPosition += 8

      // Student stats
      const statsData = [
        ["Final Grade", `${student.finalPercentage}%`, student.finalLetterGrade],
        ["Average Score", `${student.average}%`, ""],
        ["Passed Assessments", student.passedCount.toString(), ""],
        ["Failed Assessments", student.failedCount.toString(), ""],
        ["Remarks", student.remarks, ""],
      ]

      const statsTable = (doc as any).autoTable({
        startY: yPosition,
        head: [["Metric", "Value", "Grade"]],
        body: statsData,
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          textColor: 0,
          fontSize: 8,
          cellPadding: 5,
        },
        alternateRowStyles: { fillColor: [240, 253, 244] },
        margin: { left: 14, right: 14 },
      })

      yPosition = statsTable.lastAutoTable.finalY + 10

      // Assessment details
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 15
      }

      doc.setFontSize(10)
      doc.setTextColor(31, 41, 55)
      doc.text("Assessment Details", 14, yPosition)
      yPosition += 6

      const assessmentData = student.assessments.map((a) => [
        a.assessmentName.substring(0, 20),
        `${a.score}/${a.maxScore}`,
        `${a.percentage}%`,
        a.letterGrade,
      ])

      const assessmentTable = (doc as any).autoTable({
        startY: yPosition,
        head: [["Assessment", "Score", "Percentage", "Grade"]],
        body: assessmentData,
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
          fontSize: 9,
        },
        bodyStyles: {
          textColor: 0,
          fontSize: 8,
          cellPadding: 5,
        },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        margin: { left: 14, right: 14 },
      })

      yPosition = assessmentTable.lastAutoTable.finalY + 15

      if (studentIndex < allStudents.length - 1) {
        doc.setDrawColor(200)
        doc.line(14, yPosition - 5, 196, yPosition - 5)
      }
    })
  }

  return doc
}

export function downloadPDF(doc: jsPDF, fileName: string) {
  doc.save(fileName)
}

export function printPDF(doc: jsPDF) {
  window.open(doc.output("bloburi"), "_blank")
}

export function generateFileName(reportType: string): string {
  const date = new Date().toISOString().split("T")[0]
  const timestamp = new Date().getTime()
  return `institution-report-${reportType}-${date}-${timestamp}.pdf`
}
