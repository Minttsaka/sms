"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <Link href="/" className="text-xl font-semibold" style={{ fontFamily: "Cambria, serif" }}>
              DCTFUSION
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8" style={{ fontFamily: "Cambria, serif" }}>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">
              About us
            </a>
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
             <Link href={"/dashboard"} className="px-8 py-2 rounded-full relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600">
                  <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                  <span className="relative z-20">
                    Get started
                  </span>
                </Link>

                <Link href={"/register"} className="px-8 py-2 rounded-full relative bg-blue-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600">
                  <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                  <span className="relative z-20">
                    Register
                  </span>
                </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
