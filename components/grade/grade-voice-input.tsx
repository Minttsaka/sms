"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, CheckCircle2, XCircle } from "lucide-react"
import { parseVoiceInput } from "@/lib/utils"
import type { GradeEntry } from "@/lib/types"

interface GradeVoiceInputProps {
  grades: GradeEntry[]
  maxGrade: number
  onGradeChange: (studentId: string, grade: number | null, method: "voice") => void
}

export function GradeVoiceInput({ grades, maxGrade, onGradeChange }: GradeVoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [lastEntry, setLastEntry] = useState<{ student: string; grade: number; success: boolean } | null>(null)
  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = true
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex
        const transcriptText = event.results[current][0].transcript
        setTranscript(transcriptText)

        // Only process final results
        if (event.results[current].isFinal) {
          processVoiceInput(transcriptText)
        }
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("[v0] Speech recognition error:", event.error)
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  const processVoiceInput = (text: string) => {
    const parsed = parseVoiceInput(text)

    if (parsed.studentName && parsed.grade !== undefined) {
      // Find matching student
      const student = grades.find((g) => g.studentName.toLowerCase().includes(parsed.studentName!.toLowerCase()))

      if (student && parsed.grade <= maxGrade) {
        onGradeChange(student.studentId, parsed.grade, "voice")
        setLastEntry({ student: student.studentName, grade: parsed.grade, success: true })

        // Speak confirmation
        speakConfirmation(student.studentName, parsed.grade)
      } else {
        setLastEntry({
          student: parsed.studentName,
          grade: parsed.grade,
          success: false,
        })
      }
    }

    // Clear transcript after processing
    setTimeout(() => setTranscript(""), 2000)
  }

  const speakConfirmation = (studentName: string, grade: number) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(`Recorded ${grade} for ${studentName}`)
      utterance.rate = 1.2
      utterance.pitch = 1
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser")
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
      setTranscript("")
      setLastEntry(null)
    }
  }

  const enteredCount = grades.filter((g) => g.status === "entered").length

  return (
    <div className="space-y-6">
      {/* Voice Control */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={toggleListening}
              className={`w-32 h-32 rounded-full ${
                isListening
                  ? "bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 animate-pulse"
                  : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
            >
              {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
            </Button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900">{isListening ? "Listening..." : "Start Voice Input"}</h3>
            <p className="text-sm text-gray-500 mt-1">Say: "Student Name" followed by their grade</p>
          </div>

          {/* Live Transcript */}
          {transcript && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Volume2 className="w-5 h-5" />
                <span className="font-medium">{transcript}</span>
              </div>
            </div>
          )}

          {/* Last Entry Feedback */}
          {lastEntry && (
            <div
              className={`p-4 rounded-lg border ${
                lastEntry.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {lastEntry.success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">
                      Recorded {lastEntry.grade} for {lastEntry.student}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-medium">Could not find student or invalid grade</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <h4 className="font-bold text-gray-900 mb-3">Voice Input Examples:</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">
              1
            </Badge>
            <span>"Alice Johnson 85"</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">
              2
            </Badge>
            <span>"Bob Smith scored 92"</span>
          </li>
          <li className="flex items-start gap-2">
            <Badge variant="secondary" className="mt-0.5">
              3
            </Badge>
            <span>"78 for Carol Williams"</span>
          </li>
        </ul>
      </Card>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <Badge variant="secondary">
            {enteredCount} / {grades.length} entered
          </Badge>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${(enteredCount / grades.length) * 100}%` }}
          />
        </div>
      </Card>
    </div>
  )
}
