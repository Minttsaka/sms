import { Grid3x3 } from "lucide-react"

export default function TopNavigation() {
  const products = [
    { icon: "🔴", label: "Adobe Home", short: "Home" },
    { icon: "👨‍👩‍👧‍👦", label: "Family", short: "Family" },
    { icon: "✨", label: "Express", short: "Express" },
    { icon: "🎨", label: "Photoshop", short: "Photoshop" },
    { icon: "🌙", label: "Lightroom", short: "Lightroom" },
    { icon: "📄", label: "Acrobat", short: "Acrobat" },
    { icon: "📦", label: "Stock", short: "Stock" },
    { icon: "🔤", label: "Fonts", short: "Fonts" },
  ]

  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-800 border-b border-red-800 px-4 py-3">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded transition">
            <Grid3x3 size={20} className="text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-6">
          {products.map((product) => (
            <div
              key={product.short}
              className="flex flex-col items-center gap-1 hover:opacity-80 transition cursor-pointer"
            >
              <span className="text-base">{product.icon}</span>
              <span className="text-xs text-white font-medium">{product.short}</span>
            </div>
          ))}
        </div>
        <div className="w-16"></div>
      </div>
    </div>
  )
}
