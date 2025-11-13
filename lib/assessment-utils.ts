import type { AssessmentComponent, ComponentGrade, WeightedAssessment, GradeBreakdown, GradingRubric } from "./types"

export function calculateComponentGrade(grade: number, maxGrade: number, weight: number): number {
  const percentage = (grade / maxGrade) * 100
  return (percentage * weight) / 100
}

export function calculateTotalWeightedGrade(componentGrades: ComponentGrade[]): number {
  return componentGrades.reduce((total, component) => {
    const weightedScore = (component.grade / component.maxGrade) * component.maxGrade
    return total + weightedScore
  }, 0)
}

export function calculateFinalGrade(assessments: WeightedAssessment[]): number {
  const totalWeight = assessments.reduce((sum, a) => sum + a.weight, 0)
  const weightedSum = assessments.reduce((sum, a) => sum + a.averageGrade * a.weight, 0)
  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

export function calculateRubricScore(rubric: GradingRubric, scores: Map<string, number>): number {
  let total = 0
  rubric.criteria.forEach((criterion) => {
    const score = scores.get(criterion.id) || 0
    total += score
  })
  return total
}

export function getRubricFeedback(rubric: GradingRubric, scores: Map<string, number>): string {
  const feedback: string[] = []
  rubric.criteria.forEach((criterion) => {
    const score = scores.get(criterion.id) || 0
    const level = criterion.levels.find((l) => l.points === score)
    if (level) {
      feedback.push(`${criterion.name}: ${level.name} - ${level.description}`)
    }
  })
  return feedback.join("\n")
}

export function generateGradeBreakdown(
  assessments: Array<{ name: string; type: string; grade: number; weight: number }>,
): GradeBreakdown[] {
  return assessments.map((assessment) => ({
    assessmentName: assessment.name,
    assessmentType: assessment.type as any,
    grade: assessment.grade,
    weight: assessment.weight,
    contribution: (assessment.grade * assessment.weight) / 100,
  }))
}

export function validateAssessmentWeights(components: AssessmentComponent[]): boolean {
  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0)
  return Math.abs(totalWeight - 100) < 0.01 // Allow for floating point errors
}

export function getAssessmentTemplates() {
  return [
    {
      id: "TEMP001",
      name: "Standard Exam (3 Parts)",
      type: "exam" as const,
      description: "Multiple choice, short answer, and essay sections",
      components: [
        {
          id: "COMP001",
          name: "Part A: Multiple Choice",
          description: "30 multiple choice questions",
          maxGrade: 30,
          weight: 30,
        },
        {
          id: "COMP002",
          name: "Part B: Short Answer",
          description: "5 short answer questions",
          maxGrade: 40,
          weight: 40,
        },
        {
          id: "COMP003",
          name: "Part C: Essay",
          description: "1 essay question",
          maxGrade: 30,
          weight: 30,
        },
      ],
      defaultMaxGrade: 100,
      defaultWeight: 40,
    },
    {
      id: "TEMP002",
      name: "Project Assessment",
      type: "project" as const,
      description: "Research, presentation, and documentation",
      components: [
        {
          id: "COMP004",
          name: "Research & Content",
          description: "Quality and depth of research",
          maxGrade: 40,
          weight: 40,
        },
        {
          id: "COMP005",
          name: "Presentation",
          description: "Oral presentation skills",
          maxGrade: 30,
          weight: 30,
        },
        {
          id: "COMP006",
          name: "Documentation",
          description: "Written report quality",
          maxGrade: 30,
          weight: 30,
        },
      ],
      defaultMaxGrade: 100,
      defaultWeight: 20,
    },
    {
      id: "TEMP003",
      name: "Practical Lab Work",
      type: "practical" as const,
      description: "Procedure, results, and analysis",
      components: [
        {
          id: "COMP007",
          name: "Procedure & Technique",
          description: "Following proper procedures",
          maxGrade: 30,
          weight: 30,
        },
        {
          id: "COMP008",
          name: "Results & Observations",
          description: "Accuracy of results",
          maxGrade: 40,
          weight: 40,
        },
        {
          id: "COMP009",
          name: "Analysis & Conclusion",
          description: "Data analysis and conclusions",
          maxGrade: 30,
          weight: 30,
        },
      ],
      defaultMaxGrade: 100,
      defaultWeight: 15,
    },
    {
      id: "TEMP004",
      name: "Quick Quiz",
      type: "quiz" as const,
      description: "Single component quick assessment",
      components: [
        {
          id: "COMP010",
          name: "Quiz Questions",
          description: "10-15 questions",
          maxGrade: 20,
          weight: 100,
        },
      ],
      defaultMaxGrade: 20,
      defaultWeight: 5,
    },
  ]
}

export function createDefaultRubric(): GradingRubric {
  return {
    id: "RUB001",
    name: "Standard Rubric",
    criteria: [
      {
        id: "CRIT001",
        name: "Understanding",
        description: "Demonstrates understanding of concepts",
        maxPoints: 25,
        levels: [
          { id: "L1", name: "Excellent", description: "Complete understanding", points: 25 },
          { id: "L2", name: "Good", description: "Strong understanding", points: 20 },
          { id: "L3", name: "Satisfactory", description: "Basic understanding", points: 15 },
          { id: "L4", name: "Needs Improvement", description: "Limited understanding", points: 10 },
        ],
      },
      {
        id: "CRIT002",
        name: "Application",
        description: "Applies concepts correctly",
        maxPoints: 25,
        levels: [
          { id: "L5", name: "Excellent", description: "Flawless application", points: 25 },
          { id: "L6", name: "Good", description: "Mostly correct application", points: 20 },
          { id: "L7", name: "Satisfactory", description: "Some correct application", points: 15 },
          { id: "L8", name: "Needs Improvement", description: "Minimal application", points: 10 },
        ],
      },
      {
        id: "CRIT003",
        name: "Presentation",
        description: "Quality of work presentation",
        maxPoints: 25,
        levels: [
          { id: "L9", name: "Excellent", description: "Professional presentation", points: 25 },
          { id: "L10", name: "Good", description: "Well organized", points: 20 },
          { id: "L11", name: "Satisfactory", description: "Adequate presentation", points: 15 },
          { id: "L12", name: "Needs Improvement", description: "Poor presentation", points: 10 },
        ],
      },
      {
        id: "CRIT004",
        name: "Completeness",
        description: "All requirements met",
        maxPoints: 25,
        levels: [
          { id: "L13", name: "Excellent", description: "All requirements exceeded", points: 25 },
          { id: "L14", name: "Good", description: "All requirements met", points: 20 },
          { id: "L15", name: "Satisfactory", description: "Most requirements met", points: 15 },
          { id: "L16", name: "Needs Improvement", description: "Many requirements missing", points: 10 },
        ],
      },
    ],
    totalPoints: 100,
  }
}
