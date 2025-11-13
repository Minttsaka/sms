"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/navigation/sidebar"
import { TopNavbar } from "@/components/navigation/top-navbar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Suspense } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-[#f5f1eb]">
        <Sidebar />
        <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-72">
          <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
