"use client"

import { GraduationCap } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Sociallogin } from "@/components/social-login"
import { LoginFeatures } from "@/components/auth/login-features"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation/navigation"

export default function loginPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div>
      <Navigation />
      <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - login Form */}
      <div className="flex items-center justify-center p-8 bg-[#faf9f7]">
        <div
          className={`w-full max-w-md space-y-8 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "Cambria, serif" }}>
              DCTFUSION
            </span>
          </Link>

          {/* Welcome Text */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
              Welcome back
            </h1>
            <p className="text-gray-600 text-lg" style={{ fontFamily: "Cambria, serif" }}>
              Sign in to continue to your dashboard
            </p>
          </div>

          <LoginForm />
          <Sociallogin />

          {/* Sign Up Link */}
          <p className="text-center text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
            Don't have account?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Register your institution
            </Link>
          </p>
        </div>
      </div>

      <LoginFeatures mounted={mounted} />
    </div>
    <Footer />
    </div>
  )
}
