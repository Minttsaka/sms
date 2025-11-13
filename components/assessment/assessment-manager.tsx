"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, Copy, AlertCircle } from "lucide-react"
import type { Assessment, AssessmentComponent, AssessmentType } from "@/lib/types"
import { validateAssessmentWeights, getAssessmentTemplates } from "@/lib/assessment-utils"

interface AssessmentManagerProps {
  onAssessmentCreated: (assessment: Assessment, components: AssessmentComponent[]) => void
}

export function AssessmentManager({ onAssessmentCreated }: AssessmentManagerProps) {
  const [assessment, setAssessment] = useState<Partial<Assessment>>({
    name: "",
    type: "exam",
    maxGrade: 100,
    weight: 30,
    date: new Date(),
  })

  const [components, setComponents] = useState<AssessmentComponent[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

  const templates = getAssessmentTemplates()

  const addComponent = () => {
    const newComponent: AssessmentComponent = {
      id: `COMP${Date.now()}`,
      name: `Component ${components.length + 1}`,
      maxGrade: 25,
      weight: 25,
    }
    setComponents([...components, newComponent])
  }

  const updateComponent = (id: string, updates: Partial<AssessmentComponent>) => {
    setComponents(components.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const removeComponent = (id: string) => {
    setComponents(components.filter((c) => c.id !== id))
  }

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setAssessment({
        ...assessment,
        name: template.name,
        type: template.type,
        maxGrade: template.defaultMaxGrade,
        weight: template.defaultWeight,
      })
      setComponents(template.components)
      setShowTemplates(false)
    }
  }

  const handleSave = () => {
    if (!assessment.name || !assessment.type) {
      alert("Please fill in all required fields")
      return
    }

    if (components.length > 0 && !validateAssessmentWeights(components)) {
      alert("Component weights must add up to 100%")
      return
    }

    const newAssessment: Assessment = {
      id: `ASSESS${Date.now()}`,
      name: assessment.name,
      type: assessment.type,
      maxGrade: assessment.maxGrade || 100,
      weight: assessment.weight || 30,
      date: assessment.date || new Date(),
      classId: "form-4",
      subjectId: "mathematics",
    }

    onAssessmentCreated(newAssessment, components)
  }

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0)
  const isWeightValid = Math.abs(totalWeight - 100) < 0.01

  return (
    <div className="space-y-6">
      {/* Templates */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Assessment Templates</h3>
          <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)}>
            {showTemplates ? "Hide" : "Show"} Templates
          </Button>
        </div>

        {showTemplates && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow border-2 border-purple-200"
                onClick={() => loadTemplate(template.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{template.name}</h4>
                    <Badge variant="secondary" className="mt-1">
                      {template.type}
                    </Badge>
                  </div>
                  <Copy className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <p className="text-xs text-gray-500">{template.components.length} components</p>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Assessment Details */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Assessment Name *</Label>
            <Input
              value={assessment.name}
              onChange={(e) => setAssessment({ ...assessment, name: e.target.value })}
              placeholder="e.g., Mid-Term Exam"
            />
          </div>

          <div className="space-y-2">
            <Label>Type *</Label>
            <Select
              value={assessment.type}
              onValueChange={(value) => setAssessment({ ...assessment, type: value as AssessmentType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="test">Test</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="practical">Practical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Maximum Grade</Label>
            <Input
              type="number"
              value={assessment.maxGrade}
              onChange={(e) => setAssessment({ ...assessment, maxGrade: Number.parseInt(e.target.value) })}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label>Weight (% of Final Grade)</Label>
            <Input
              type="number"
              value={assessment.weight}
              onChange={(e) => setAssessment({ ...assessment, weight: Number.parseInt(e.target.value) })}
              min="1"
              max="100"
            />
          </div>
        </div>
      </Card>

      {/* Components */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Assessment Components</h3>
            <p className="text-sm text-gray-600">Break down the assessment into sections (optional)</p>
          </div>
          <Button onClick={addComponent} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        </div>

        {components.length > 0 && (
          <>
            <div className="space-y-4 mb-4">
              {components.map((component, index) => (
                <Card
                  key={component.id}
                  className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs">Component Name</Label>
                        <Input
                          value={component.name}
                          onChange={(e) => updateComponent(component.id, { name: e.target.value })}
                          placeholder={`Part ${index + 1}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Max Grade</Label>
                        <Input
                          type="number"
                          value={component.maxGrade}
                          onChange={(e) => updateComponent(component.id, { maxGrade: Number.parseInt(e.target.value) })}
                          min="1"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs">Weight (%)</Label>
                        <Input
                          type="number"
                          value={component.weight}
                          onChange={(e) => updateComponent(component.id, { weight: Number.parseInt(e.target.value) })}
                          min="1"
                          max="100"
                        />
                      </div>

                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-xs">Description (Optional)</Label>
                        <Textarea
                          value={component.description || ""}
                          onChange={(e) => updateComponent(component.id, { description: e.target.value })}
                          placeholder="Describe this component..."
                          rows={2}
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeComponent(component.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Weight Validation */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
              {isWeightValid ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700">Total weight: {totalWeight.toFixed(1)}% ✓</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-amber-700">
                    Total weight: {totalWeight.toFixed(1)}% (must equal 100%)
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600">
          <Save className="w-5 h-5 mr-2" />
          Create Assessment
        </Button>
      </div>
    </div>
  )
}
