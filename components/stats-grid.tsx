import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsGridProps {
  stats: {
    label: string
    value: string | number
    icon: React.ReactNode
    trend?: number
  }[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                {stat.trend && (
                  <p className={`mt-1 text-xs font-semibold ${stat.trend > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {stat.trend > 0 ? "↑" : "↓"} {Math.abs(stat.trend)}% from last term
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-3 text-primary">
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
