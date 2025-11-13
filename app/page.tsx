"use client"

import { Footer } from "@/components/footer"
import HelloSection from "@/components/hero-section"
import { Navigation } from "@/components/navigation/navigation"
import { StatsSection } from "@/components/stats-section"

export default function Home() {
  return (
    <main className="w-full">
      <Navigation />
      <HelloSection />
      <StatsSection />
      <Footer />
    </main>
  )
}
