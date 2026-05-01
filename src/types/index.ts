export type Priority = 1 | 2 | 3
export type ProgressState = 'pendente' | 'lendo' | 'praticando' | 'domino' | 'revisar'

export interface Skill {
  name: string
  slug: string
  p: Priority
  cat: string
  catLabel: string
}

export interface Category {
  key: string
  label: string
  skills: [string, Priority][]
}

export interface SkillProgress {
  state: ProgressState
  updatedAt: string
  notes?: string
}

export type ProgressStore = Record<string, SkillProgress>

export interface SkillStats {
  total: number
  done: number
  active: number
  pct: number
  counts: Record<ProgressState, number>
}

export interface KeyPoint {
  title: string
  body: string
  code?: string
}

export interface InterviewQA {
  q: string
  a: string
  tip?: string
  level?: 'pleno' | 'senior'
}

export interface VideoRef {
  title: string
  channel: string
  url: string
  topic?: string
  note?: string
}

export interface CodeExample {
  title: string
  description?: string
  code: string
  language?: string
}

export interface Exercise {
  level: 'iniciante' | 'intermediario' | 'senior'
  title: string
  description: string
  concepts: string[]
  hint?: string
  relatedKeypoints?: number[]
}

export interface Resource {
  title: string
  url: string
  kind: 'docs' | 'video' | 'curso' | 'artigo' | 'livro' | 'pratica'
}

export interface DiagramBlock {
  title: string
  html: string
  caption?: string
}

export interface Mnemonic {
  label: string
  trick: string
  explanation: string
}

export interface SkillContent {
  tagline?: string
  why?: string
  prerequisite?: string
  summary?: string
  howToStudy?: string
  diagrams?: DiagramBlock[]
  keypoints?: KeyPoint[]
  cheatsheet?: DiagramBlock
  codeExamples?: CodeExample[]
  gotchas?: string[]
  interview?: InterviewQA[]
  videos?: VideoRef[]
  resources?: Resource[]
  mindmap?: DiagramBlock
  exercises?: Exercise[]
  diagram?: string
  mnemonics?: Mnemonic[]
}

export type SkillContentMap = Record<string, SkillContent>
