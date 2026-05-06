'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type InterviewQuestion = {
  question: string
  level: 'Pleno' | 'Senior'
  hint?: string
  category?: string
  timeTarget?: string
}

export interface InterviewSimPdfOpts {
  questions: InterviewQuestion[]
  skillName: string
  accentColor: string
  stackLabel: string
  coverTitle?: string
  instructions?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildInterviewSimPdf(opts: InterviewSimPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    questions,
    skillName,
    accentColor,
    stackLabel,
    coverTitle,
    instructions,
    date,
  } = opts

  const today = date ?? (() => {
    const d = new Date()
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${months[d.getMonth()]}/${d.getFullYear()}`
  })()

  const defaultInstructions =
    'Leia cada pergunta em voz alta. Responda de cabeça ou escreva abaixo. ' +
    'Quando terminar, compare com o gabarito do Q&A Review. ' +
    'Marque um ✓ se acertou, ✗ se errou — sem julgamento, apenas aprendizado.'

  const s = StyleSheet.create({
    page:          { backgroundColor: '#0f172a', padding: 36, fontFamily: 'Helvetica' },
    header:        { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:       { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:       { fontSize: 8, color: '#475569' },
    instrBox:      { padding: 12, backgroundColor: '#1e293b', borderRadius: 6, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: accentColor },
    instrLabel:    { fontSize: 8, color: accentColor, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' as const },
    instrText:     { fontSize: 9, color: '#94a3b8', lineHeight: 1.6 },
    catTitle:      { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    qBlock:        { marginBottom: 16, padding: 12, backgroundColor: '#1e293b', borderRadius: 6 },
    qTopRow:       { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 8 },
    qNumBadge:     { fontSize: 8, color: '#475569', fontFamily: 'Helvetica-Bold' },
    badgeRow:      { flexDirection: 'row' as const, gap: 6 },
    levelPleno:    { fontSize: 7, color: '#38bdf8', backgroundColor: '#0c2233', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    levelSenior:   { fontSize: 7, color: '#f87171', backgroundColor: '#3f1d2a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    timeBadge:     { fontSize: 7, color: '#64748b', backgroundColor: '#0f172a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
    qText:         { fontSize: 11, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', lineHeight: 1.45, marginBottom: 12 },
    answerBox:     { height: 72, borderWidth: 1, borderColor: '#334155', borderRadius: 4, borderStyle: 'dashed' as const },
    hintText:      { fontSize: 7, color: '#334155', marginTop: 4, fontStyle: 'italic' as const },
    footer:        { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const categories = Array.from(new Set(questions.map(q => q.category ?? 'Geral')))

  const cover = await buildCoverPage({
    badge: 'Simulado de Entrevista',
    title: coverTitle ?? `${skillName} — Simulado`,
    subtitle: `${questions.length} perguntas para praticar antes da entrevista real. Responda de cabeça ou escreva no espaço abaixo de cada questão.`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: 'Pleno e Sênior',
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Simulado</Text>
          <Text style={s.headerR}>{questions.length} perguntas</Text>
        </View>
        <View style={s.instrBox}>
          <Text style={s.instrLabel}>Instruções</Text>
          <Text style={s.instrText}>{instructions ?? defaultInstructions}</Text>
        </View>
        {categories.map(cat => {
          const catQs = questions.filter(q => (q.category ?? 'Geral') === cat)
          return (
            <View key={cat}>
              <Text style={s.catTitle}>{cat}</Text>
              {catQs.map((q, i) => {
                const globalIdx = questions.indexOf(q)
                return (
                  <View key={i} style={s.qBlock} wrap={false}>
                    <View style={s.qTopRow}>
                      <Text style={s.qNumBadge}>Questão {String(globalIdx + 1).padStart(2, '0')}</Text>
                      <View style={s.badgeRow}>
                        {q.timeTarget && <Text style={s.timeBadge}>{q.timeTarget}</Text>}
                        <Text style={q.level === 'Senior' ? s.levelSenior : s.levelPleno}>
                          {q.level === 'Senior' ? 'SÊNIOR' : 'PLENO'}
                        </Text>
                      </View>
                    </View>
                    <Text style={s.qText}>{q.question}</Text>
                    <View style={s.answerBox} />
                    {q.hint && <Text style={s.hintText}>Dica: {q.hint}</Text>}
                  </View>
                )
              })}
            </View>
          )
        })}
        <View style={s.footer} fixed>
          <Text>{skillName} · Simulado · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
