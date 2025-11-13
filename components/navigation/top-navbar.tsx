"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, Menu, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { signOut } from "next-auth/react"

interface TopNavbarProps {
  onMenuClick: () => void
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search students, teachers, classes..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            style={{ fontFamily: "Cambria, serif" }}
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Quick stats */}
        <div className="hidden xl:flex items-center gap-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="text-right">
            <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              Today's Attendance
            </p>
            <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              94.2%
            </p>
          </div>
          <div className="w-px h-8 bg-gray-300" />
          <div className="text-right">
            <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              Active Classes
            </p>
            <p className="text-sm font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              38/42
            </p>
          </div>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white border-gray-200">
            <DropdownMenuLabel className="text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            <div className="p-4 text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2">
              <Avatar className="w-10 h-10 border-2 border-blue-200">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                  Admin User
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                  institution Admin
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
            <DropdownMenuLabel className="text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <User className="w-4 h-4 mr-2" />
              <span style={{ fontFamily: "Cambria, serif" }}>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Settings className="w-4 h-4 mr-2" />
              <span style={{ fontFamily: "Cambria, serif" }}>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem onClick={()=>signOut()} className="text-red-600 hover:text-red-700 hover:bg-gray-100">
              <LogOut className="w-4 h-4 mr-2" />
              <span style={{ fontFamily: "Cambria, serif" }}>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
