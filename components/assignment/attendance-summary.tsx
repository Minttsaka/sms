"use client"

import { Card } from "@/components/ui/card"
import { Users, UserCheck, UserX, Clock, FileText } from "lucide-react"
import type { AttendanceStats } from "@/lib/types"

interface AttendanceSummaryProps {
  stats: AttendanceStats
}

export function AttendanceSummary({ stats }: AttendanceSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
            <UserCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.present}</p>
            <p className="text-xs text-muted-foreground">Present</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500">
            <UserX className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.absent}</p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.late}</p>
            <p className="text-xs text-muted-foreground">Late</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.excused}</p>
            <p className="text-xs text-muted-foreground">Excused</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
