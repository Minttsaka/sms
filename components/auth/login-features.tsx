"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, BookOpen, TrendingUp, Users } from "lucide-react"

interface loginFeaturesProps {
  mounted: boolean
}

export function LoginFeatures({ mounted }: loginFeaturesProps) {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-12">
        {/* Quote/Testimonial */}
        <div
          className={`space-y-6 transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          }`}
        >
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
              Trusted by 500+ institutions
            </span>
          </div>

          <h2 className="text-5xl font-bold leading-tight" style={{ fontFamily: "Cambria, serif" }}>
            Transform your institution into a digital powerhouse
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed" style={{ fontFamily: "Cambria, serif" }}>
            Join thousands of educators who have revolutionized their workflow with our comprehensive education
            management platform.
          </p>
        </div>

        {/* Feature Cards */}
        <div
          className={`grid gap-6 transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
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
            <img src="/team.jpg" alt="Our Team" className="w-full h-32 object-cover rounded-lg" />
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
      </div>

      {/* Bottom Stats */}
      <div
        className={`relative z-10 grid grid-cols-3 gap-8 transition-all duration-1000 delay-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div>
          <div className="text-4xl font-bold mb-2" style={{ fontFamily: "Cambria, serif" }}>
            500+
          </div>
          <div className="text-gray-400 text-sm" style={{ fontFamily: "Cambria, serif" }}>
            institutions Trust Us
          </div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2" style={{ fontFamily: "Cambria, serif" }}>
            50K+
          </div>
          <div className="text-gray-400 text-sm" style={{ fontFamily: "Cambria, serif" }}>
            Active Students
          </div>
        </div>
        <div>
          <div className="text-4xl font-bold mb-2" style={{ fontFamily: "Cambria, serif" }}>
            99.9%
          </div>
          <div className="text-gray-400 text-sm" style={{ fontFamily: "Cambria, serif" }}>
            Uptime Guarantee
          </div>
        </div>
      </div>
    </div>
  )
}
