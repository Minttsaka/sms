"use client"

import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  DollarSign,
  MessageSquare,
  Settings,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/dashboard/students", icon: GraduationCap },
  { name: "Teachers", href: "/dashboard/teachers", icon: Users },
  { name: "Classes", href: "/dashboard/classes", icon: BookOpen },
  { name: "Attendance", href: "/dashboard/attendance", icon: Calendar },
  { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-2xl">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                DCTFUSION
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-700 hover:text-gray-900">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={{ fontFamily: "Cambria, serif" }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </div>
  )
}
