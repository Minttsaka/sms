"use client"

import { BarChart3, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReportHeaderProps {
  selectedClass?: string
  onClassChange?: (classId: string) => void
  isinstitutionReport?: boolean
}

export function ReportHeader({ selectedClass, onClassChange, isinstitutionReport = false }: ReportHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isinstitutionReport ? "institution Reports" : "Class Reports"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isinstitutionReport
                  ? "Performance analytics across all classes"
                  : "Comprehensive performance metrics and insights"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {!isinstitutionReport && (
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedClass} onValueChange={onClassChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Form 4A</SelectItem>
                <SelectItem value="2">Form 4B</SelectItem>
                <SelectItem value="3">Form 2A</SelectItem>
                <SelectItem value="4">Form 2B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
