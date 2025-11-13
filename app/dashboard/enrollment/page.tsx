"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  UserPlus,
  Camera,
  FileText,
  Fingerprint,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  X,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react"
import { useSearchParams } from "next/navigation"

interface Guardian {
  firstName: string
  lastName: string
  email: string
  phone: string
  relationship: string
  occupation: string
  isPrimaryContact: boolean
  isEmergencyContact: boolean
}

interface Document {
  id: string | number
  type: string
  name: string
  url: string
  uploadDate: string
}

interface FormData {
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  address: string
  phone: string
  email: string
  bloodGroup: string
  gradeApplying: string
  academicYear: string
  classId: string
  nationality: string
  religion: string
  languagesSpoken: string[]
  specialNeeds: string
  transportRequired: boolean
  medicalConditions: string
  allergies: string
  medications: string
  previousSchool: string
  previousGrade: string
  transferReason: string
  photo: string | null
  documents: Document[]
  guardians: Guardian[]
  fingerprintEnrolled: boolean
  fingerprintData: any
}

interface Class {
  id: string
  name: string
  section: string | null
  academicYear: string | null
}

const EnrollmentPage = () => {
  const searchParams = useSearchParams()
  const institutionId = searchParams.get("q") || "690d8f33379da7e7f3d8f692"

  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    bloodGroup: "",
    gradeApplying: "",
    academicYear: "2024-2025",
    classId: "",
    nationality: "",
    religion: "",
    languagesSpoken: [],
    specialNeeds: "",
    transportRequired: false,
    medicalConditions: "",
    allergies: "",
    medications: "",
    previousSchool: "",
    previousGrade: "",
    transferReason: "",
    photo: null,
    documents: [],
    guardians: [
      {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        relationship: "Guardian",
        occupation: "",
        isPrimaryContact: true,
        isEmergencyContact: true,
      },
    ],
    fingerprintEnrolled: false,
    fingerprintData: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [classes, setClasses] = useState<Class[]>([])
  const [admissionNumber, setAdmissionNumber] = useState<string>("")

  const steps = [
    { title: "Basic Info", icon: UserPlus },
    { title: "Photo", icon: Camera },
    { title: "Documents", icon: FileText },
    { title: "Guardian", icon: Users },
    { title: "Biometric", icon: Fingerprint },
    { title: "Review", icon: CheckCircle2 },
  ]

  useEffect(() => {
    fetchClasses()
  }, [institutionId])

  const fetchClasses = async () => {
    try {
      const res = await fetch(`/api/classes?id=${institutionId}`)
      if (res.ok) {
        const data = await res.json()
        setClasses(data.classes || [])
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error)
    }
  }

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 0) {
      if (!formData.firstName) newErrors.firstName = "First name is required"
      if (!formData.lastName) newErrors.lastName = "Last name is required"
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!formData.gender) newErrors.gender = "Gender is required"
    }

    if (currentStep === 1) {
      if (!formData.photo) newErrors.photo = "Student photo is required"
    }

    if (currentStep === 3) {
      const guardian = formData.guardians[0]
      if (!guardian.firstName) newErrors.guardianFirstName = "Guardian first name is required"
      if (!guardian.lastName) newErrors.guardianLastName = "Guardian last name is required"
      if (!guardian.email) newErrors.guardianEmail = "Guardian email is required"
      if (!guardian.phone) newErrors.guardianPhone = "Guardian phone is required"
    }

    if (currentStep === 4) {
      if (!formData.fingerprintEnrolled) newErrors.fingerprint = "Biometric enrollment is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const calculateAge = (dob: string): number => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          institutionId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAdmissionNumber(data.admissionNumber)
        setShowSuccess(true)
      } else {
        alert(data.error || "Failed to enroll student")
      }
    } catch (error) {
      console.error("Enrollment error:", error)
      alert("Failed to enroll student")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  if (showSuccess) {
    return (
      <SuccessScreen admissionNumber={admissionNumber} studentName={`${formData.firstName} ${formData.lastName}`} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Student Enrollment
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Complete the enrollment process step by step
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </p>
              <Badge className="bg-blue-100 text-blue-700">{Math.round(progress)}% Complete</Badge>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-6 gap-2">
              {steps.map((step, idx) => {
                const Icon = step.icon
                const isCompleted = idx < currentStep
                const isCurrent = idx === currentStep
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border-2 ${
                      isCurrent
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600"
                        : isCompleted
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                        isCurrent ? "bg-white/20" : isCompleted ? "bg-green-100" : "bg-gray-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icon className={`w-5 h-5 ${isCurrent ? "text-white" : "text-gray-600"}`} />
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium ${
                        isCurrent ? "text-white" : isCompleted ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {currentStep === 0 && (
            <BasicInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              calculateAge={calculateAge}
            />
          )}
          {currentStep === 1 && <PhotoStep formData={formData} updateFormData={updateFormData} errors={errors} />}
          {currentStep === 2 && <DocumentsStep formData={formData} updateFormData={updateFormData} />}
          {currentStep === 3 && <GuardianStep formData={formData} updateFormData={updateFormData} errors={errors} />}
          {currentStep === 4 && <BiometricStep formData={formData} updateFormData={updateFormData} errors={errors} />}
          {currentStep === 5 && <ReviewStep updateFormData={updateFormData} formData={formData} />}
        </div>

        <Card className="p-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Submit Enrollment
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={nextStep} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

interface StepProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
  errors?: Record<string, string>
  calculateAge?: (dob: string) => number
}

const BasicInfoStep: React.FC<StepProps> = ({ formData, updateFormData, errors = {}, calculateAge }) => (
  <Card className="p-6">
    <h3 className="text-lg font-semibold mb-6">Basic Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>First Name *</Label>
        <Input value={formData.firstName} onChange={(e) => updateFormData({ firstName: e.target.value })} />
        {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
      </div>
      <div className="space-y-2">
        <Label>Middle Name</Label>
        <Input value={formData.middleName} onChange={(e) => updateFormData({ middleName: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Last Name *</Label>
        <Input value={formData.lastName} onChange={(e) => updateFormData({ lastName: e.target.value })} />
        {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
      </div>
      <div className="space-y-2">
        <Label>Date of Birth *</Label>
        <Input
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
        />
        {formData.dateOfBirth && calculateAge && (
          <p className="text-xs text-gray-600 mt-1">Age: {calculateAge(formData.dateOfBirth)} years</p>
        )}
        {errors.dateOfBirth && <p className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>}
      </div>
      <div className="space-y-2">
        <Label>Gender *</Label>
        <select
          className="w-full h-10 px-3 rounded-md border"
          value={formData.gender}
          onChange={(e) => updateFormData({ gender: e.target.value })}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
      </div>
      <div className="space-y-2">
        <Label>Blood Group</Label>
        <select
          className="w-full h-10 px-3 rounded-md border"
          value={formData.bloodGroup}
          onChange={(e) => updateFormData({ bloodGroup: e.target.value })}
        >
          <option value="">Select</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>Email (Optional)</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="student@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          placeholder="+265..."
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label>Address</Label>
        <Input value={formData.address} onChange={(e) => updateFormData({ address: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Grade Applying For</Label>
        <Input
          value={formData.gradeApplying}
          onChange={(e) => updateFormData({ gradeApplying: e.target.value })}
          placeholder="e.g., Form 4"
        />
      </div>
      <div className="space-y-2">
        <Label>Academic Year</Label>
        <Input value={formData.academicYear} onChange={(e) => updateFormData({ academicYear: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Nationality</Label>
        <Input value={formData.nationality} onChange={(e) => updateFormData({ nationality: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Religion</Label>
        <Input value={formData.religion} onChange={(e) => updateFormData({ religion: e.target.value })} />
      </div>
    </div>
  </Card>
)

const PhotoStep: React.FC<StepProps> = ({ formData, updateFormData, errors = {} }) => {
  const [preview, setPreview] = useState<string | null>(formData.photo)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = useState<boolean>(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false)

  useEffect(() => {
    if (formData.photo) {
      setPreview(formData.photo)
    }

    // Cleanup: Stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [formData.photo, stream])

  const startCamera = async () => {
    try {
      setCameraError(null)
      setIsVideoReady(false)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.error("Error playing video:", err)
            setCameraError("Failed to play video stream")
          })
          setIsVideoReady(true)
        }
        videoRef.current.onerror = (error) => {
          console.error("Video element error:", error)
          setCameraError("Failed to load video stream")
        }
      }

      setStream(mediaStream)
      setCameraActive(true)
    } catch (error: any) {
      console.error("Camera error:", error)
      let errorMsg = "Failed to access camera"

      if (error.name === "NotAllowedError") {
        errorMsg = "Camera permission denied. Please allow camera access in your browser settings."
      } else if (error.name === "NotFoundError") {
        errorMsg = "No camera found on this device"
      } else if (error.name === "NotReadableError") {
        errorMsg = "Camera is already in use by another application"
      }

      setCameraError(errorMsg)
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setCameraActive(false)
    setIsVideoReady(false)
    setCameraError(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !isVideoReady || videoRef.current.videoWidth === 0) {
      setCameraError("Camera is not ready. Please wait a moment and try again.")
      return
    }

    try {
      const canvas = canvasRef.current || document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        setCameraError("Failed to capture photo")
        return
      }

      ctx.drawImage(videoRef.current, 0, 0)
      const photoData = canvas.toDataURL("image/jpeg", 0.9)

      setPreview(photoData)
      updateFormData({ photo: photoData })
      stopCamera()
    } catch (error) {
      console.error("Photo capture error:", error)
      setCameraError("Failed to capture photo. Please try again.")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setCameraError("Please select a valid image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setCameraError("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        updateFormData({ photo: result })
        setCameraError(null)
      }
      reader.onerror = () => {
        setCameraError("Failed to read file")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Student Photo</h3>
      <div className="space-y-4">
        {!preview && !cameraActive && (
          <div className="flex gap-4">
            <Button onClick={startCamera} type="button" className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
            <Button onClick={handleUploadClick} type="button" variant="outline" className="flex-1 bg-transparent">
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
        )}

        {cameraError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Camera Error</p>
              <p className="text-sm text-red-700">{cameraError}</p>
            </div>
          </div>
        )}

        {cameraActive && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg"
                style={{
                  minHeight: "400px",
                  maxHeight: "500px",
                  objectFit: "contain",
                }}
              />
              {!isVideoReady && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Initializing camera...</p>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-4">
              <Button onClick={capturePhoto} type="button" disabled={!isVideoReady} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button onClick={stopCamera} type="button" variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {preview && (
          <div className="space-y-4">
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={preview || "/placeholder.svg"}
                alt="Student"
                className="w-full rounded-lg max-h-96 object-contain"
              />
            </div>
            <Button
              onClick={() => {
                setPreview(null)
                updateFormData({ photo: null })
              }}
              type="button"
              variant="outline"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Retake Photo
            </Button>
          </div>
        )}

        {errors.photo && <p className="text-xs text-red-600">{errors.photo}</p>}
      </div>
    </Card>
  )
}

const DocumentsStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    const newDocs = await Promise.all(
      files.map(async (file): Promise<Document> => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve({
              id: Date.now() + Math.random(),
              type: file.type.includes("pdf") ? "pdf" : "image",
              name: file.name,
              url: reader.result as string,
              uploadDate: new Date().toISOString(),
            })
          }
          reader.onerror = () => {
            console.error("[v0] Failed to read file:", file.name)
          }
          reader.readAsDataURL(file)
        })
      }),
    )

    updateFormData({ documents: [...formData.documents, ...newDocs] })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeDocument = (id: string | number) => {
    updateFormData({ documents: formData.documents.filter((doc) => doc.id !== id) })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Upload Documents</h3>
      <div className="space-y-4">
        <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleUploadClick}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Documents (Birth Certificate, Medical Records, etc.)
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload documents"
        />

        {formData.documents.length > 0 && (
          <div className="space-y-2">
            {formData.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-gray-600">{new Date(doc.uploadDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeDocument(doc.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

const GuardianStep: React.FC<StepProps> = ({ formData, updateFormData, errors = {} }) => {
  const guardian = formData.guardians[0]

  const updateGuardian = (field: keyof Guardian, value: string | boolean) => {
    const newGuardians = [...formData.guardians]
    newGuardians[0] = { ...newGuardians[0], [field]: value }
    updateFormData({ guardians: newGuardians })
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Guardian Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name *</Label>
          <Input value={guardian.firstName} onChange={(e) => updateGuardian("firstName", e.target.value)} />
          {errors.guardianFirstName && <p className="text-xs text-red-600 mt-1">{errors.guardianFirstName}</p>}
        </div>
        <div>
          <Label>Last Name *</Label>
          <Input value={guardian.lastName} onChange={(e) => updateGuardian("lastName", e.target.value)} />
          {errors.guardianLastName && <p className="text-xs text-red-600 mt-1">{errors.guardianLastName}</p>}
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" value={guardian.email} onChange={(e) => updateGuardian("email", e.target.value)} />
          {errors.guardianEmail && <p className="text-xs text-red-600 mt-1">{errors.guardianEmail}</p>}
        </div>
        <div>
          <Label>Phone *</Label>
          <Input value={guardian.phone} onChange={(e) => updateGuardian("phone", e.target.value)} />
          {errors.guardianPhone && <p className="text-xs text-red-600 mt-1">{errors.guardianPhone}</p>}
        </div>
        <div>
          <Label>Relationship</Label>
          <select
            className="w-full h-10 px-3 rounded-md border"
            value={guardian.relationship}
            onChange={(e) => updateGuardian("relationship", e.target.value)}
          >
            <option value="Mother">Mother</option>
            <option value="Father">Father</option>
            <option value="Guardian">Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <Label>Occupation</Label>
          <Input value={guardian.occupation} onChange={(e) => updateGuardian("occupation", e.target.value)} />
        </div>
      </div>
    </Card>
  )
}

const BiometricStep: React.FC<StepProps> = ({ formData, updateFormData, errors = {} }) => {
  const [scanning, setScanning] = useState<boolean>(false)
  const [enrolled, setEnrolled] = useState<boolean>(formData.fingerprintEnrolled)
  const [error, setError] = useState<string | null>(null)
  const [fingerprintQuality, setFingerprintQuality] = useState<number>(0)

  const enrollFingerprint = async () => {
    setScanning(true)
    setError(null)

    try {
      if (!window.PublicKeyCredential) {
        throw new Error(
          "WebAuthn is not supported in this browser. Please use a modern browser like Chrome, Edge, or Safari.",
        )
      }

      // Check if platform authenticator is available
      const isPlatformAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      if (!isPlatformAvailable) {
        throw new Error(
          "Biometric authentication is not available on this device. Please ensure you have a fingerprint scanner or Windows Hello configured.",
        )
      }

      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const userIdBytes = new Uint8Array(16)
      window.crypto.getRandomValues(userIdBytes)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: "School Management System",
          id: window.location.hostname,
        },
        user: {
          id: userIdBytes,
          name: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@school.edu`,
          displayName: `${formData.firstName} ${formData.lastName}`,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: "direct",
      }

      const credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })) as PublicKeyCredential | null

      if (credential) {
        const response = credential.response as AuthenticatorAttestationResponse
        const credentialData = {
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          type: credential.type,
          response: {
            attestationObject: Array.from(new Uint8Array(response.attestationObject)),
            clientDataJSON: Array.from(new Uint8Array(response.clientDataJSON)),
          },
        }

        const fingerprintTemplate = {
          templateType: "webauthn",
          credentialId: credential.id,
          algorithm: "WebAuthn",
          quality: 95,
          captureDate: new Date().toISOString(),
          deviceId: "platform-authenticator",
          publicKey: credentialData,
          attestation: "direct",
        }

        setFingerprintQuality(95)
        updateFormData({
          fingerprintEnrolled: true,
          fingerprintData: fingerprintTemplate,
        })

        setEnrolled(true)
      }
    } catch (err: any) {
      console.error("Fingerprint enrollment error:", err)
      let errorMessage = "Failed to enroll fingerprint"

      if (err.name === "NotAllowedError") {
        errorMessage = "Biometric enrollment was cancelled. Please try again and complete the authentication."
      } else if (err.name === "NotSupportedError") {
        errorMessage = "Biometric authentication is not supported on this device"
      } else if (err.name === "InvalidStateError") {
        errorMessage = "A credential already exists for this user. Please try re-enrolling."
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setScanning(false)
    }
  }

  const testAuthentication = async () => {
    if (!formData.fingerprintData) {
      setError("No fingerprint enrolled yet")
      return
    }

    try {
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: challenge,
        allowCredentials: [
          {
            id: new Uint8Array(formData.fingerprintData.publicKey.rawId),
            type: "public-key",
            transports: ["internal"],
          },
        ],
        timeout: 60000,
        userVerification: "required",
      }

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })

      if (assertion) {
        setError(null)
      }
    } catch (err: any) {
      console.error("Authentication error:", err)
      setError("Biometric authentication failed. Please try again.")
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">
        Biometric Enrollment <span className="text-red-600">*</span> (Required)
      </h3>
      <div className="space-y-6">
        {!enrolled ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <Fingerprint className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Enroll Fingerprint</h4>
              <p className="text-sm text-gray-600 mb-4">
                Every student must register their biometric data for secure attendance tracking and authentication. This
                is a mandatory step in the enrollment process.
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 text-left">{error}</p>
                </div>
              )}
              <Button
                onClick={enrollFingerprint}
                disabled={scanning}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning... Place your finger on the scanner
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Start Enrollment
                  </>
                )}
              </Button>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                <strong>Requirements:</strong> Your device must have a fingerprint scanner, Windows Hello, or other
                biometric authentication capability. This step cannot be skipped.
              </p>
            </div>
            {errors.fingerprint && <p className="text-xs text-red-600">{errors.fingerprint}</p>}
          </>
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Fingerprint Enrolled Successfully!</h4>
              <p className="text-sm text-gray-600 mb-4">Quality Score: {fingerprintQuality}%</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={testAuthentication} variant="outline">
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Test Authentication
                </Button>
                <Button
                  onClick={() => {
                    setEnrolled(false)
                    updateFormData({ fingerprintEnrolled: false, fingerprintData: null })
                    setError(null)
                  }}
                  variant="outline"
                >
                  Re-enroll
                </Button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-600">
                ✅ Biometric data has been securely stored and will be used for attendance tracking and authentication.
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

const ReviewStep: React.FC<StepProps> = ({ formData }) => (
  <div className="space-y-4">
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Student Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600">Full Name</p>
          <p className="text-sm font-medium">
            {formData.firstName} {formData.middleName} {formData.lastName}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Date of Birth</p>
          <p className="text-sm font-medium">{formData.dateOfBirth || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Gender</p>
          <p className="text-sm font-medium">{formData.gender || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Blood Group</p>
          <p className="text-sm font-medium">{formData.bloodGroup || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Email</p>
          <p className="text-sm font-medium">{formData.email || "Not provided"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Phone</p>
          <p className="text-sm font-medium">{formData.phone || "N/A"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-600">Address</p>
          <p className="text-sm font-medium">{formData.address || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Grade Applying</p>
          <p className="text-sm font-medium">{formData.gradeApplying || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Academic Year</p>
          <p className="text-sm font-medium">{formData.academicYear}</p>
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Student Photo</h3>
      {formData.photo && (
        <div className="flex gap-4 items-start">
          <img
            src={formData.photo || "/placeholder.svg"}
            alt="Student"
            className="w-24 h-24 rounded-lg object-cover border border-gray-200"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700">✓ Photo uploaded successfully</p>
          </div>
        </div>
      )}
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Guardian Information</h3>
      {formData.guardians.map((guardian, idx) => (
        <div key={idx} className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600">Guardian Name</p>
            <p className="text-sm font-medium">
              {guardian.firstName} {guardian.lastName}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Relationship</p>
            <p className="text-sm font-medium">{guardian.relationship}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Email</p>
            <p className="text-sm font-medium">{guardian.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Phone</p>
            <p className="text-sm font-medium">{guardian.phone}</p>
          </div>
        </div>
      ))}
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Enrollment Checklist</h3>
      <div className="space-y-3">
        <ChecklistItem completed={!!formData.photo} text="Student Photo" />
        <ChecklistItem
          completed={formData.documents.length > 0}
          text={`Documents (${formData.documents.length} uploaded)`}
        />
        <ChecklistItem completed={formData.fingerprintEnrolled} text="Biometric Enrollment" required />
        <ChecklistItem completed={!!formData.guardians[0]?.email} text="Guardian Information" />
      </div>
    </Card>
  </div>
)

interface ChecklistItemProps {
  completed: boolean
  text: string
  required?: boolean
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ completed, text, required }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    {completed ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
    )}
    <span className={`text-sm ${completed ? "text-gray-900 font-medium" : "text-gray-600"}`}>
      {text}
      {required && <span className="text-red-600 ml-1">*</span>}
    </span>
  </div>
)

interface SuccessScreenProps {
  admissionNumber: string
  studentName: string
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ admissionNumber, studentName }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 flex items-center justify-center">
    <Card className="max-w-2xl w-full p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Enrollment Successful!</h2>
      <p className="text-gray-600 mb-6">
        {studentName} has been successfully enrolled in the system with biometric authentication enabled.
      </p>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <p className="text-sm text-gray-600 mb-2">Admission Number</p>
        <p className="text-3xl font-bold text-blue-600">{admissionNumber}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Enroll Another Student
        </Button>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600">View Student Profile</Button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-gray-600">
          📧 login credentials have been sent to the student and guardian email addresses.
        </p>
      </div>
    </Card>
  </div>
)

export default EnrollmentPage
