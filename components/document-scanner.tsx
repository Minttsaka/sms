"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scan, Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react"
import type { EnrollmentDocument, DocumentType } from "@/lib/types"

interface DocumentScannerProps {
  documents: EnrollmentDocument[]
  onDocumentAdd: (document: EnrollmentDocument) => void
  onDocumentRemove: (documentId: string) => void
}

const documentTypes: { value: DocumentType; label: string; required: boolean }[] = [
  { value: "birth-certificate", label: "Birth Certificate", required: true },
  { value: "transfer-certificate", label: "Transfer Certificate", required: false },
  { value: "medical-records", label: "Medical Records", required: false },
  { value: "previous-report", label: "Previous Report Card", required: false },
  { value: "id-proof", label: "ID Proof", required: true },
]

export function DocumentScanner({ documents, onDocumentAdd, onDocumentRemove }: DocumentScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [selectedType, setSelectedType] = useState<DocumentType>("birth-certificate")

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setScanning(true)

      try {
        // Simulate OCR processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const reader = new FileReader()
        reader.onload = (e) => {
          const newDocument: EnrollmentDocument = {
            id: Math.random().toString(36).substr(2, 9),
            type: selectedType,
            name: file.name,
            url: e.target?.result as string,
            uploadedAt: new Date(),
            verified: false,
            extractedData: {
              // Simulated OCR data
              documentNumber: "DOC-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              issueDate: new Date().toISOString(),
              confidence: Math.random() * 0.3 + 0.7, // 70-100%
            },
          }

          onDocumentAdd(newDocument)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("[v0] Document scan error:", error)
      } finally {
        setScanning(false)
      }
    },
    [selectedType, onDocumentAdd],
  )

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Document Upload & Scanning</h3>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            {documents.length} / {documentTypes.filter((d) => d.required).length} Required
          </Badge>
        </div>

        {/* Document Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {documentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`p-3 rounded-xl border-2 transition-all text-left ${
                selectedType === type.value
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white"
                  : "bg-white border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <FileText className={`w-4 h-4 ${selectedType === type.value ? "text-white" : "text-gray-600"}`} />
                {type.required && (
                  <Badge
                    className={
                      selectedType === type.value
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-red-100 text-red-700 border-red-200"
                    }
                  >
                    Required
                  </Badge>
                )}
              </div>
              <p className={`text-sm font-medium ${selectedType === type.value ? "text-white" : "text-gray-900"}`}>
                {type.label}
              </p>
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
          {scanning ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
              <div>
                <p className="text-sm font-medium text-gray-900">Scanning Document...</p>
                <p className="text-xs text-gray-600 mt-1">Extracting information using OCR</p>
              </div>
            </div>
          ) : (
            <>
              <Scan className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-4">
                Upload {documentTypes.find((d) => d.value === selectedType)?.label}
              </p>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload"
              />
              <label htmlFor="document-upload">
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
              <p className="text-xs text-gray-500 mt-2">Supports: JPG, PNG, PDF (Max 5MB)</p>
            </>
          )}
        </div>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Uploaded Documents</h4>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-600">{documentTypes.find((t) => t.value === doc.type)?.label}</p>
                    {doc.extractedData && (
                      <p className="text-xs text-green-600 mt-1">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" />
                        Data extracted ({Math.round((doc.extractedData.confidence as number) * 100)}% confidence)
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onDocumentRemove(doc.id)}>
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
