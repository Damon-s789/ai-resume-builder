const keywords = [
  'react',
  'javascript',
  'typescript',
  'html',
  'css',
  'api',
  'responsive',
  'accessibility',
  'performance',
  'git',
]

const actionVerb =
  /^(built|created|developed|implemented|designed|improved|optimized|integrated|collaborated|launched|reduced|increased|automated|delivered|structured)/i

const stopWords = new Set(
  'and the for with from that this your you are will have has using into our can their plus team work role able across about more than then also such each need needs needed looking seek seeking experience experienced engineer developer candidate'.split(
    ' ',
  ),
)

export function lines(value = '') {
  return String(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function comma(value = '') {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function resumeText(resume) {
  return [
    resume.profile.name,
    resume.profile.role,
    resume.profile.summary,
    resume.skills,
    resume.certifications,
    resume.achievements,
    ...resume.experience.flatMap((item) => [item.title, item.company, item.bullets]),
    ...resume.projects.flatMap((item) => [item.name, item.stack, item.bullets]),
    ...resume.education.flatMap((item) => [item.degree, item.school, item.details]),
  ]
    .join(' ')
    .toLowerCase()
}

export function analyzeResume(resume) {
  const text = resumeText(resume)
  const bulletLines = [
    ...resume.experience.flatMap((item) => lines(item.bullets)),
    ...resume.projects.flatMap((item) => lines(item.bullets)),
  ]

  const structure = [
    resume.profile.name,
    resume.profile.email,
    resume.profile.summary,
    resume.skills,
    resume.projects.length,
    resume.education.length,
  ].filter(Boolean).length

  const keywordHits = keywords.filter((keyword) => text.includes(keyword)).length
  const metricLines = bulletLines.filter((line) => /\d|%|\+|reduced|increased|improved|optimized/i.test(line)).length
  const actionLines = bulletLines.filter((line) => actionVerb.test(line)).length

  const scores = {
    structure: Math.round((structure / 6) * 100),
    keywords: Math.round((keywordHits / keywords.length) * 100),
    impact: Math.round((metricLines / Math.max(1, bulletLines.length)) * 100),
    clarity: Math.round((actionLines / Math.max(1, bulletLines.length)) * 100),
  }

  const total = Math.round(
    scores.structure * 0.28 +
      scores.keywords * 0.28 +
      scores.impact * 0.24 +
      scores.clarity * 0.2,
  )

  return {
    total,
    scores,
    checklist: [
      ['Professional summary clearly states role, stack, and value', Boolean(resume.profile.summary) && resume.profile.summary.length >= 110],
      ['Portfolio, GitHub, or LinkedIn links are added', Boolean(resume.profile.links.trim())],
      ['Projects show frontend depth with stack and links', resume.projects.length >= 2 && resume.projects.every((project) => project.stack && project.link)],
      ['Impact bullets include numbers or measurable results', scores.impact >= 55],
      ['Bullets start with strong action verbs', scores.clarity >= 70],
      ['Skills align with frontend job keywords', scores.keywords >= 70],
    ],
  }
}

function extractKeywords(text) {
  const words = text.toLowerCase().match(/[a-z][a-z+#]{2,}/g) || []
  const counts = new Map()

  words.forEach((word) => {
    if (!stopWords.has(word)) counts.set(word, (counts.get(word) || 0) + 1)
  })

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([word]) => word)
}

export function matchJob(resume, description) {
  if (!description.trim()) return { matched: [], missing: [], percent: 0 }

  const text = resumeText(resume)
  const jobKeywords = extractKeywords(description)
  const matched = jobKeywords.filter((word) => text.includes(word))
  const missing = jobKeywords.filter((word) => !text.includes(word))

  return {
    matched,
    missing,
    percent: Math.round((matched.length / Math.max(1, jobKeywords.length)) * 100),
  }
}
