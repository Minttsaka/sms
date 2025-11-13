"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { signIn } from "next-auth/react"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        })

        if (!result?.ok) {
        toast.error(result?.error)
        return;
      }

      if(result.error === "Configuration"){
        console.error(result.error)
        toast("Please verify your email first.")
        return
      }

      if(result.ok){

        window.location.reload()
      }

      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="h-12 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
          style={{ fontFamily: "Cambria, serif" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-sm font-semibold text-gray-900"
            style={{ fontFamily: "Cambria, serif" }}
          >
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            style={{ fontFamily: "Cambria, serif" }}
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="h-12 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600 pr-12"
            style={{ fontFamily: "Cambria, serif" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember"
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <Label
          htmlFor="remember"
          className="text-sm text-gray-700 cursor-pointer"
          style={{ fontFamily: "Cambria, serif" }}
        >
          Remember me for 30 days
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-semibold group"
        style={{ fontFamily: "Cambria, serif" }}
        disabled={isLoading}
      >
        {isLoading ? "loging in..." : "Sign in"}
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  )
}