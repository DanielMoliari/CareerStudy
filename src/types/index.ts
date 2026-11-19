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

/* ─── Log de tentativas: DSA & System Design ─── */

export type AttemptTrack = 'dsa' | 'sysdesign'
export type AttemptSource = 'js-basico' | 'leetcode' | 'system-design'
export type AttemptOutcome = 'resolvido' | 'resolvido-com-ajuda' | 'travou' | 'parcial' | 'estudo'

export interface AttemptGap {
  categoria: string
  descricao: string
}

export interface StudyTopic {
  titulo: string
  corpo: string
}

export interface Attempt {
  id: string
  date: string
  track: AttemptTrack
  source: AttemptSource
  title: string
  level?: 'facil' | 'medio' | 'dificil'
  timeSpent?: string
  outcome: AttemptOutcome
  /** Código ou desenho submetido — obrigatório para tentativas práticas, ausente em sessões de estudo puro. */
  submission?: string
  submissionLang?: string
  narrative: string
  /** Presente só quando outcome === 'estudo': tópicos/conceitos organizados da sessão. */
  studyTopics?: StudyTopic[]
  gaps: AttemptGap[]
  analysis: string
  nextStep?: string
}

/* ─── Currículo por blocos: DSA & System Design ─── */

export type CurriculumTrack = 'sysdesign' | 'livecoding' | 'narrativa'
export type CurriculumLevel = 'iniciante' | 'intermediario' | 'avancado'
export type TopicState = 'pendente' | 'estudando' | 'dominado'

export interface CurriculumTopic {
  slug: string
  title: string
  why: string
  /** Pontos de pesquisa dentro do tópico — não é passo a passo, é o que vale a pena estudar/buscar. */
  subtopics?: string[]
}

export interface PracticeQuestion {
  q_pt: string
  q_en: string
  /** Dica do que uma resposta forte cobre — não é gabarito fechado, é estrutura esperada. */
  hint: string
}

export interface CurriculumBlock {
  level: CurriculumLevel
  title: string
  goal: string
  topics: CurriculumTopic[]
  /** Só usado pela trilha de Narrativa Técnica: perguntas-modelo prontas para praticar. */
  practiceQuestions?: PracticeQuestion[]
  /** Referência leve de prazo, não cobrança de data (ex: "ideal até out/2026"). */
  paceRef?: string
}

export interface ExamQuestion {
  q_pt: string
  q_en: string
  answer_en: string
  score: number
  feedback: string
}

export interface BlockExam {
  id: string
  date: string
  track: CurriculumTrack
  level: CurriculumLevel
  questions: ExamQuestion[]
  overallScore: number
  verdict: 'aprovado' | 'revisar'
  summary: string
}
