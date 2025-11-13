export function calculateClassStats(assessments: any[]) {
  return {
    averageScore: (assessments.reduce((sum, a) => sum + a.averageScore, 0) / assessments.length).toFixed(1),
    averagePassRate: (assessments.reduce((sum, a) => sum + a.passRate, 0) / assessments.length).toFixed(1),
    totalAssessments: assessments.length,
  }
}

export function getGradeDistribution(assessments: any[]) {
  const distribution = { A: 0, B: 0, C: 0, D: 0 }
  assessments.forEach((assessment) => {
    const score = assessment.averageScore
    if (score >= 80) distribution.A++
    else if (score >= 70) distribution.B++
    else if (score >= 60) distribution.C++
    else distribution.D++
  })
  return distribution
}

export function getPerformanceTrend(data: any[]) {
  return data.map((item, index) => ({
    period: `Week ${index + 1}`,
    average: item.averageScore,
  }))
}
