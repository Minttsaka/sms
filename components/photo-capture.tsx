"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, RotateCcw, Check, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PhotoCaptureProps {
  currentPhoto?: string
  onPhotoCapture: (photoData: string) => void
}

export function PhotoCapture({ currentPhoto, onPhotoCapture }: PhotoCaptureProps) {
  const [mode, setMode] = useState<"capture" | "upload">("capture")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(currentPhoto || null)
  const [photoQuality, setPhotoQuality] = useState<"good" | "poor" | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("[v0] Camera access error:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoData = canvas.toDataURL("image/jpeg", 0.9)
        setCapturedPhoto(photoData)

        // Simulate photo quality check
        const quality = Math.random() > 0.3 ? "good" : "poor"
        setPhotoQuality(quality)

        if (quality === "good") {
          onPhotoCapture(photoData)
        }

        stopCamera()
      }
    }
  }, [onPhotoCapture, stopCamera])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const photoData = e.target?.result as string
          setCapturedPhoto(photoData)
          setPhotoQuality("good")
          onPhotoCapture(photoData)
        }
        reader.readAsDataURL(file)
      }
    },
    [onPhotoCapture],
  )

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null)
    setPhotoQuality(null)
    if (mode === "capture") {
      startCamera()
    }
  }, [mode, startCamera])

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-blue-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Student Photo</h3>
          <div className="flex gap-2">
            <Button
              variant={mode === "capture" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("capture")
                stopCamera()
              }}
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture
            </Button>
            <Button
              variant={mode === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMode("upload")
                stopCamera()
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>

        {mode === "capture" && !capturedPhoto && (
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={startCamera} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Camera className="w-5 h-5 mr-2" />
                    Start Camera
                  </Button>
                </div>
              )}
            </div>
            {stream && (
              <Button onClick={capturePhoto} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </Button>
            )}
          </div>
        )}

        {mode === "upload" && !capturedPhoto && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 mb-4">Click to upload or drag and drop</p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="photo-upload" />
            <label htmlFor="photo-upload">
              <Button asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>
        )}

        {capturedPhoto && (
          <div className="space-y-4">
            <div className="relative">
              <img src={capturedPhoto || "/placeholder.svg"} alt="Student" className="w-full rounded-xl" />
              {photoQuality && (
                <Badge
                  className={`absolute top-4 right-4 ${
                    photoQuality === "good"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  {photoQuality === "good" ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Good Quality
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Poor Quality
                    </>
                  )}
                </Badge>
              )}
            </div>
            <Button onClick={retakePhoto} variant="outline" className="w-full bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Photo
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
