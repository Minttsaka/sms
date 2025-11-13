"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, TrendingUp } from "lucide-react"

export function StatsSection() {

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="grid lg:grid-cols-3 gap-6 transition-all duration-1000 delay-300">
        {/* Testimonials Card */}
        <Card className="bg-gray-900 text-white p-8 space-y-6">
          <h3 className="text-sm font-semibold tracking-wider" style={{ fontFamily: "Cambria, serif" }}>
            SUCCESS METRICS
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span style={{ fontFamily: "Cambria, serif" }}>Student Engagement</span>
                <span className="font-bold" style={{ fontFamily: "Cambria, serif" }}>
                  95+
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "95%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span style={{ fontFamily: "Cambria, serif" }}>institutions Digitalized</span>
                <span className="font-bold" style={{ fontFamily: "Cambria, serif" }}>
                  80+
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span style={{ fontFamily: "Cambria, serif" }}>Time Saved</span>
                <span className="font-bold" style={{ fontFamily: "Cambria, serif" }}>
                  70+
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Experience Card */}
        <Card className="bg-[#e8e4f3] p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="text-7xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
              1+
            </div>
            <div className="space-y-1">
              <p
                className="text-sm font-semibold tracking-wider text-gray-900"
                style={{ fontFamily: "Cambria, serif" }}
              >
                YEARS EXPERIENCE
              </p>
              <p
                className="text-sm font-semibold tracking-wider text-gray-900"
                style={{ fontFamily: "Cambria, serif" }}
              >
                IN EDUCATION TECH
              </p>
            </div>
          </div>
          <ArrowRight className="absolute bottom-8 right-8 w-12 h-12 text-gray-900" />
        </Card>

        {/* Features Card */}
        <Card className="bg-[#e8f5a9] p-8 space-y-4 relative overflow-hidden">
          <div className="space-y-3">
            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <div>
                  <p className="font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                    STUDENT MANAGEMENT
                  </p>
                  <p className="text-sm text-gray-700" style={{ fontFamily: "Cambria, serif" }}>
                    Complete academic tracking
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                <div>
                  <p className="font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                    STAFF PORTAL
                  </p>
                  <p className="text-sm text-gray-700" style={{ fontFamily: "Cambria, serif" }}>
                    Streamlined operations
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5" />
                <div>
                  <p className="font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                    ANALYTICS
                  </p>
                  <p className="text-sm text-gray-700" style={{ fontFamily: "Cambria, serif" }}>
                    Data-driven insights
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="mt-6 relative">
            <img src="/team.jpg" alt="Our Team" className="w-full h-32 object-cover object-center rounded-lg" />
            <button className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white transition-colors">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-0.5" />
              </div>
              <span className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                Our Team
              </span>
            </button>
          </div>
        </Card>
      </div>
    </section>
  )
}
