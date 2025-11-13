"use client"

import { Plus } from "lucide-react"

export default function MainContent() {
  const projects = [
    {
      id: 1,
      title: "Brand design project",
      creator: "Gizem Akdag",
      image: "/colorful-brand-design-with-geometric-shapes.jpg",
    },
    {
      id: 2,
      title: "Furniture design project",
      creator: "Vojtek Morszlyn",
      image: "/modern-furniture-design-in-earth-tones.jpg",
    },
    {
      id: 3,
      title: "Film project",
      creator: "Sam Finn",
      image: "/cinematic-film-poster-landscape.jpg",
    },
  ]

  return (
    <main className="flex-1 overflow-auto bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Background decorative element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-l from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-gradient-to-t from-pink-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-white mb-2">Visualize ideas together</h1>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
          <div className="lg:col-span-1 border-2 border-dashed border-white/30 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-white/5 transition cursor-pointer">
            <div className="text-center">
              <h3 className="text-white font-bold text-lg mb-2">Upload files</h3>
              <p className="text-white/70 text-sm mb-6">Drag and drop your stuff from scratch.</p>
              <button className="border border-white/50 hover:border-white text-white px-6 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 mx-auto">
                <Plus size={16} />
                Create a board
              </button>
            </div>
          </div>

          {/* Project Cards */}
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-xl hover:scale-105 transition cursor-pointer"
            >
              <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-40 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-4">
                <div>
                  <span className="text-xs text-gray-300 bg-black/30 px-3 py-1 rounded-full inline-block">📋</span>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">{project.title}</h4>
                  <p className="text-white/70 text-xs">{project.creator}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Boards */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Recent boards</h2>
          <a href="#" className="text-white/70 hover:text-white text-sm font-semibold transition">
            View all
          </a>
        </div>
      </div>
    </main>
  )
}
