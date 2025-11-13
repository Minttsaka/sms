"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { GraduationCap, ArrowRight, ArrowLeft, Check, Building2, User, Mail, Lock, MapPin, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    // institution Information
    institutionName: "",
    institutionType: "",
    address: "",
    city: "",
    country: "",
    phone: "",
    // Admin Information
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPassword: "",
    adminConfirmPassword: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalSteps = 3

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()

      try {
        const response = await fetch("/api/institution", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            formData
          ),
        })

        if (response.ok) {
          toast.success("Teacher added successfully")
          router.push("/login")
        } else {
          const data = await response.json()
          throw new Error(data.error || "Failed to create teacher")
        }
      } catch (error: any) {
        console.error("[v0] Create institution error:", error)
        toast.error(error.message || "Failed to add institution")
      }
    }

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "Cambria, serif" }}>
              DCTFUSION
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              Already have an account?
            </span>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-gray-300 bg-transparent"
                style={{ fontFamily: "Cambria, serif" }}
              >
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 shadow">
        {/* Progress Steps */}
        <div
          className={`mb-12 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      step < currentStep
                        ? "bg-blue-600 text-white"
                        : step === currentStep
                          ? "bg-blue-600 text-white ring-4 ring-blue-200"
                          : "bg-gray-200 text-gray-500"
                    }`}
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    {step < currentStep ? <Check className="w-6 h-6" /> : step}
                  </div>
                  <div className="hidden md:block">
                    <div
                      className={`text-sm font-semibold ${step <= currentStep ? "text-gray-900" : "text-gray-400"}`}
                      style={{ fontFamily: "Cambria, serif" }}
                    >
                      {step === 1 ? "institution Details" : step === 2 ? "Admin Information" : "Confirmation"}
                    </div>
                  </div>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card
          className={`bg-white border-gray-200 shadow-xl transition-all duration-1000 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="p-8 shadow md:p-12">
            <form onSubmit={handleSubmit}>
              {/* Step 1: institution Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="space-y-2 mb-8">
                    <div className=" bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 rounded-3xl flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "Cambria, serif" }}>
                          institution Information
                        </h2>
                        <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                          Tell us about your institution
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="institutionName"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        institution Name *
                      </Label>
                      <Input
                        id="institutionName"
                        placeholder="e.g., Miracle High institution"
                        className="h-12 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                        style={{ fontFamily: "Cambria, serif" }}
                        value={formData.institutionName}
                        onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="institutionType"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        institution Type *
                      </Label>
                      <select
                        id="institutionType"
                        className="w-full h-12 px-3 rounded-md border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 bg-white"
                        style={{ fontFamily: "Cambria, serif" }}
                        value={formData.institutionType}
                        onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                        required
                      >
                        <option value="">Select type</option>
                        <option value="PRIMARY">Primary institution</option>
                        <option value="SECONDARY">Secondary institution</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+265998970102"
                          className="h-12 pl-10 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                          style={{ fontFamily: "Cambria, serif" }}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        Street Address *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="address"
                          placeholder="123 Main Street"
                          className="h-12 pl-10 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                          style={{ fontFamily: "Cambria, serif" }}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold" style={{ fontFamily: "Cambria, serif" }}>
                        City *
                      </Label>
                      <Input
                        id="city"
                        placeholder="Miracle"
                        className="h-12 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                        style={{ fontFamily: "Cambria, serif" }}
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        Country *
                      </Label>
                      <Input
                        id="country"
                        placeholder="Malawi"
                        className="h-12 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                        style={{ fontFamily: "Cambria, serif" }}
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Admin Information */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                          Administrator Details
                        </h2>
                        <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                          Create your admin account
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="adminFirstName"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        First Name *
                      </Label>
                      <Input
                        id="adminFirstName"
                        placeholder="John"
                        className="h-12 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                        style={{ fontFamily: "Cambria, serif" }}
                        value={formData.adminFirstName}
                        onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="adminLastName"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        Last Name *
                      </Label>
                      <Input
                        id="adminLastName"
                        placeholder="Doe"
                        className="h-12 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                        style={{ fontFamily: "Cambria, serif" }}
                        value={formData.adminLastName}
                        onChange={(e) => setFormData({ ...formData, adminLastName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="adminEmail"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="adminEmail"
                          type="email"
                          placeholder="admin@institution.edu"
                          className="h-12 pl-10 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                          style={{ fontFamily: "Cambria, serif" }}
                          value={formData.adminEmail}
                          onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="adminPassword"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="adminPassword"
                          type="password"
                          placeholder="Create a strong password"
                          className="h-12 pl-10 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                          style={{ fontFamily: "Cambria, serif" }}
                          value={formData.adminPassword}
                          onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "Cambria, serif" }}>
                        Must be at least 8 characters with uppercase, lowercase, and numbers
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="adminConfirmPassword"
                        className="text-sm font-semibold"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="adminConfirmPassword"
                          type="password"
                          placeholder="Re-enter your password"
                          className="h-12 pl-10 bg-white border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                          style={{ fontFamily: "Cambria, serif" }}
                          value={formData.adminConfirmPassword}
                          onChange={(e) => setFormData({ ...formData, adminConfirmPassword: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                          Review & Confirm
                        </h2>
                        <p className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                          Please review your information
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* institution Information Summary */}
                    <Card className="bg-gray-50 border-gray-200 p-6">
                      <h3
                        className="text-lg font-bold mb-4 flex items-center gap-2"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        <Building2 className="w-5 h-5 text-blue-600" />
                        institution Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                            institution Name:
                          </span>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                            {formData.institutionName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                            Type:
                          </span>
                          <p
                            className="font-semibold text-gray-900 capitalize"
                            style={{ fontFamily: "Cambria, serif" }}
                          >
                            {formData.institutionType || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                            Phone:
                          </span>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                            {formData.phone || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                            Location:
                          </span>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                            {formData.city && formData.country
                              ? `${formData.city}, ${formData.country}`
                              : "Not provided"}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                            Address:
                          </span>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                            {formData.address || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Admin Information Summary */}
                    <Card className="bg-gray-50 border-gray-200 p-6">
                      <h3
                        className="text-lg font-bold mb-4 flex items-center gap-2"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        <User className="w-5 h-5 text-purple-600" />
                        Administrator
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                            Name:
                          </span>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                            {formData.adminFirstName && formData.adminLastName
                              ? `${formData.adminFirstName} ${formData.adminLastName}`
                              : "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
                            Email:
                          </span>
                          <p className="font-semibold text-gray-900" style={{ fontFamily: "Cambria, serif" }}>
                            {formData.adminEmail || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        required
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm text-gray-700 cursor-pointer"
                        style={{ fontFamily: "Cambria, serif" }}
                      >
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                          Privacy Policy
                        </Link>
                        . I understand that my institution data will be securely stored and processed according to these
                        terms.
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="h-12 px-6 border-gray-300 disabled:opacity-50 bg-transparent"
                  style={{ fontFamily: "Cambria, serif" }}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        step === currentStep ? "bg-blue-600 w-8" : step < currentStep ? "bg-blue-400" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-12 px-6 bg-gray-900 hover:bg-gray-800 text-white group"
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold group"
                    style={{ fontFamily: "Cambria, serif" }}
                  >
                    Create institution Account
                    <Check className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div
          className={`mt-12 grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-400 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Card className="bg-white border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
              Secure & Encrypted
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              Your data is protected with bank-level encryption
            </p>
          </Card>

          <Card className="bg-white border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
              Instant Setup
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              Get started in minutes, no technical knowledge required
            </p>
          </Card>

          <Card className="bg-white border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: "Cambria, serif" }}>
              24/7 Support
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: "Cambria, serif" }}>
              Our team is always here to help you succeed
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
