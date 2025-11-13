"use client"

import { useState, useCallback } from "react"
import type { StudentEnrollmentData, EnrollmentStep } from "@/lib/types"
import {
  validateEnrollmentData,
  generateStudentId,
  generateAdmissionNumber,
  generateQRCode,
} from "@/lib/utils"

export function useEnrollment(institutionId: string, institutionCode: string) {
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>("basic-info")
  const [enrollmentData, setEnrollmentData] = useState<Partial<StudentEnrollmentData>>({
    status: "draft",
    documents: [],
    guardians: [],
    fingerprintEnrolled: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps: EnrollmentStep[] = [
    "basic-info",
    "photo",
    "documents",
    "guardian",
    "biometric",
    "class-assignment",
    "review",
  ]

  const updateEnrollmentData = useCallback((updates: Partial<StudentEnrollmentData>) => {
    setEnrollmentData((prev) => ({ ...prev, ...updates }))
  }, [])

  const nextStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }, [currentStep, steps])

  const previousStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }, [currentStep, steps])

  const goToStep = useCallback((step: EnrollmentStep) => {
    setCurrentStep(step)
  }, [])

  const validateCurrentStep = useCallback((): boolean => {
    const validation = validateEnrollmentData(enrollmentData)
    setErrors(validation.errors)
    return validation.isValid
  }, [enrollmentData])

  const submitEnrollment = useCallback(async () => {
    setIsSubmitting(true)
    try {
      // Generate system fields
      const studentId = generateStudentId(institutionCode, new Date().getFullYear())
      const admissionNumber = generateAdmissionNumber(
        enrollmentData.gradeApplying || "",
        new Date().getFullYear(),
        Math.floor(Math.random() * 1000),
      )
      const qrCode = generateQRCode(studentId, institutionId)

      const completeData: StudentEnrollmentData = {
        ...enrollmentData,
        studentId,
        admissionNumber,
        qrCode,
        status: "pending-review",
      } as StudentEnrollmentData

      // In production, send to API
      console.log("[v0] Submitting enrollment:", completeData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return { success: true, data: completeData }
    } catch (error) {
      console.error("[v0] Enrollment submission error:", error)
      return { success: false, error: "Failed to submit enrollment" }
    } finally {
      setIsSubmitting(false)
    }
  }, [enrollmentData, institutionId, institutionCode])

  return {
    currentStep,
    enrollmentData,
    errors,
    isSubmitting,
    steps,
    updateEnrollmentData,
    nextStep,
    previousStep,
    goToStep,
    validateCurrentStep,
    submitEnrollment,
  }
}
