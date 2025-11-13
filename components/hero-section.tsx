"use client"

import { Rocket, BarChart3, Briefcase } from "lucide-react"
import Link from "next/link"

export default function HelloSection() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="flex">
          {/* Left: Dark Blue Content */}
          <div className="w-full md:w-1/2 bg-[#003D6B] text-white px-8 md:px-12 py-16 md:py-24 flex flex-col justify-center">
            <div className="max-w-md">
              <p className="text-sm space-x-2 font-medium mb-8 tracking-wide">
                <span className="font-bold">DCTFUSION</span>
                <span className="font-bold">||</span>
                <span className="font-light">AI Powered</span>
              </p>
              <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-tight text-[#D4AF6A]">
                School Management Platform
              </h1>
              <p className="text-lg text-gray-200 leading-relaxed">
                Discover how our all-in-one system helps schools go digital, save time, and make smarter data-driven decisions.
              </p>
              <div className="my-5 flex gap-2 items-center">
                <Link href={"/dashboard"} className="px-8 py-2 rounded-full relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600">
                  <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                  <span className="relative z-20">
                    Get started
                  </span>
                </Link>

                <Link href={""} className="px-8 py-2 rounded-full relative bg-blue-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600">
                  <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-2xl  bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
                  <span className="relative z-20">
                    Register your institution
                  </span>
                </Link>

              </div>
            </div>
          </div>

          {/* Right: Tan/Gold Background with Image */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#C9A876] to-[#B89968] items-center justify-center relative overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Decorative background shapes */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF6A] opacity-20 rounded-full transform translate-x-24 -translate-y-24"></div>

              {/* Profile Image Container */}
              <div className="relative z-10 w-64 h-80 md:w-72 md:h-96 rounded-lg overflow-hidden shadow-2xl transform -skew-x-3">
                <img
                  src="/img1.jpeg"
                  alt="LinkedIn Sales Navigator Professional"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section Container */}
      <div className="bg-white">
        {/* Benefit 1 */}
        <section className="relative py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Image */}
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#ADD8E6] to-[#C5E3F6] rounded-lg opacity-50 -z-10 transform scale-105"></div>
                <img
                  src="/img2.jpeg"
                  alt="Sales Navigator Interface - Hidden Allies Feature"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Right: Content */}
              <div className="bg-gradient-to-br from-[#E6F2FF] to-[#C5E3F6] p-8 md:p-12 rounded-lg">
                <p className="text-sm font-bold text-[#003D6B] mb-4 tracking-widest uppercase">INNOVATION IN OUR FINGERTIP</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#003D6B] mb-6 leading-tight">
                  Digitize student enrollment and records effortlessly.
                </h2>
                <div className="flex gap-4">
                  <Rocket className="w-8 h-8 text-[#003D6B] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Schools can register students, capture fingerprints, and securely store academic records in one unified platform — reducing paperwork and errors while improving accessibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefit 2 */}
        <section className="relative py-20 md:py-32 bg-[#003D6B]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div>
                <p className="text-sm font-bold text-[#D4AF6A] mb-4 tracking-widest">REALTIME</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                 Track performance and attendance with real-time analytics.
                </h2>
                <div className="flex gap-4">
                  <BarChart3 className="w-8 h-8 text-[#D4AF6A] flex-shrink-0 mt-1" />
                  <p className="text-gray-100 text-lg leading-relaxed">
                    Our AI-driven dashboards provide insights into student progress, attendance, and grades, helping teachers and administrators make data-based decisions faster.
                  </p>
                </div>
              </div>

              {/* Right: Image */}
              <div className="relative">
                <img
                  src="/linkedin-sales-navigator-growth-insights-analytics.jpg"
                  alt="Sales Navigator Growth Insights"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Diagonal Shape */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{ height: "60px" }}
          >
            <polygon points="0,80 1440,0 1440,100 0,100" fill="white" />
          </svg>
        </section>

        {/* Benefit 3 */}
        <section className="relative py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Image */}
              <div className="relative">
                <img
                  src="/img4.jpeg"
                  alt="Sales Navigator Relationship Explorer"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Right: Content */}
              <div className="bg-gradient-to-br from-[#F5E6D3] to-[#E8D5C4] p-8 md:p-12 rounded-lg">
                <p className="text-sm font-bold text-[#A0754D] mb-4 tracking-widest">AUTOMATION</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#003D6B] mb-6 leading-tight">
                  Empower schools <span className="text-[#D4AF6A]">with</span> smart{" "}
                  <span className="text-[#D4AF6A]">automation</span> and reports.
                </h2>
                <div className="flex gap-4">
                  <Briefcase className="w-8 h-8 text-[#D4AF6A] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg leading-relaxed">
                   Automatically generate student report cards, analyze academic trends, and identify learning gaps — ensuring every learner gets the support they need.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Diagonal Shape */}
          <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[80px] border-t-[80px] border-r-white border-t-[#F5E6D3]"></div>
        </section>
      </div>
    </main>
  )
}
