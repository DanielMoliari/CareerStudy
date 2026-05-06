'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type StudyWeek = {
  week: number
  theme: string
  goals: string[]
  resources: Array<{
    title: string
    type: 'video' | 'artigo' | 'docs' | 'pratica' | 'livro'
    duration?: string
    url?: string
  }>
  exercises?: string[]
  checkpoint?: string
}

export interface StudyPlanPdfOpts {
  weeks: StudyWeek[]
  skillName: string
  accentColor: string
  stackLabel: string
  prerequisitesNote?: string
  totalHours?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildStudyPlanPdf(opts: StudyPlanPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    weeks,
    skillName,
    accentColor,
    stackLabel,
    prerequisitesNote,
    totalHours,
    date,
  } = opts

  const today = date ?? (() => {
    const d = new Date()
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${months[d.getMonth()]}/${d.getFullYear()}`
  })()

  const resourceTypeIcon: Record<string, string> = {
    video:   '▶',
    artigo:  '✦',
    docs:    '📄',
    pratica: '⚙',
    livro:   '📖',
  }

  const resourceTypeColor: Record<string, string> = {
    video:   '#f87171',
    artigo:  '#38bdf8',
    docs:    '#a78bfa',
    pratica: '#4ade80',
    livro:   '#fb923c',
  }

  const s = StyleSheet.create({
    page:          { backgroundColor: '#0f172a', padding: 36, fontFamily: 'Helvetica' },
    header:        { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:       { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:       { fontSize: 8, color: '#475569' },
    overviewBox:   { padding: 12, backgroundColor: '#1e293b', borderRadius: 6, marginBottom: 20 },
    overviewTitle: { fontSize: 11, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 8 },
    overviewRow:   { flexDirection: 'row' as const, gap: 20 },
    overviewItem:  {},
    overviewLabel: { fontSize: 7, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: 2, marginBottom: 2 },
    overviewValue: { fontSize: 11, color: '#e2e8f0', fontFamily: 'Helvetica-Bold' },
    prereqBox:     { marginTop: 10, padding: 8, backgroundColor: '#0a1628', borderLeftWidth: 3, borderLeftColor: '#f59e0b', borderRadius: 3 },
    prereqLabel:   { fontSize: 7, color: '#f59e0b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' as const },
    prereqText:    { fontSize: 8, color: '#fcd34d', lineHeight: 1.5 },
    weekBlock:     { marginBottom: 16, padding: 14, backgroundColor: '#1e293b', borderRadius: 8 },
    weekHeader:    { flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 10, gap: 10 },
    weekNumBox:    { width: 40, height: 40, borderRadius: 20, backgroundColor: accentColor, alignItems: 'center' as const, justifyContent: 'center' as const },
    weekNumText:   { fontSize: 14, color: '#fff', fontFamily: 'Helvetica-Bold' },
    weekTheme:     { fontSize: 13, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', flex: 1 },
    sectionLabel:  { fontSize: 7, color: '#64748b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4, marginTop: 8 },
    goalRow:       { flexDirection: 'row' as const, marginBottom: 3 },
    checkbox:      { width: 10, height: 10, borderWidth: 1, borderColor: '#475569', borderRadius: 2, marginRight: 6, marginTop: 1 },
    goalText:      { fontSize: 8.5, color: '#cbd5e1', flex: 1, lineHeight: 1.5 },
    resourceRow:   { flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 4, gap: 6 },
    resourceIcon:  { fontSize: 9, width: 14 },
    resourceTitle: { fontSize: 8.5, color: '#94a3b8', flex: 1 },
    resourceDur:   { fontSize: 7, color: '#475569' },
    exerciseRow:   { flexDirection: 'row' as const, marginBottom: 3 },
    exerciseDot:   { fontSize: 9, color: accentColor, width: 10 },
    exerciseText:  { fontSize: 8.5, color: '#94a3b8', flex: 1, lineHeight: 1.5 },
    checkpointBox: { marginTop: 8, padding: 8, backgroundColor: '#0c2233', borderLeftWidth: 3, borderLeftColor: accentColor, borderRadius: 3 },
    checkpointLbl: { fontSize: 7, color: accentColor, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' as const },
    checkpointText:{ fontSize: 8.5, color: '#7dd3fc', lineHeight: 1.5 },
    footer:        { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const cover = await buildCoverPage({
    badge: 'Plano de Estudos',
    title: `${skillName} — Plano de ${weeks.length} Semanas`,
    subtitle: `Roteiro estruturado com metas semanais, recursos curados e checkpoints de validação.${totalHours ? ` Estimativa: ${totalHours} de estudo.` : ''}`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: `${weeks.length} semanas`,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Plano de Estudos</Text>
          <Text style={s.headerR}>{weeks.length} semanas{totalHours ? ` · ${totalHours}` : ''}</Text>
        </View>
        <View style={s.overviewBox}>
          <Text style={s.overviewTitle}>Visão Geral</Text>
          <View style={s.overviewRow}>
            <View style={s.overviewItem}>
              <Text style={s.overviewLabel}>Semanas</Text>
              <Text style={s.overviewValue}>{weeks.length}</Text>
            </View>
            {totalHours && (
              <View style={s.overviewItem}>
                <Text style={s.overviewLabel}>Carga Estimada</Text>
                <Text style={s.overviewValue}>{totalHours}</Text>
              </View>
            )}
            <View style={s.overviewItem}>
              <Text style={s.overviewLabel}>Recursos</Text>
              <Text style={s.overviewValue}>{weeks.reduce((acc, w) => acc + w.resources.length, 0)}</Text>
            </View>
          </View>
          {prerequisitesNote && (
            <View style={s.prereqBox}>
              <Text style={s.prereqLabel}>Pré-requisitos</Text>
              <Text style={s.prereqText}>{prerequisitesNote}</Text>
            </View>
          )}
        </View>
        {weeks.map((week, wi) => (
          <View key={wi} style={s.weekBlock} wrap={false}>
            <View style={s.weekHeader}>
              <View style={s.weekNumBox}>
                <Text style={s.weekNumText}>{week.week}</Text>
              </View>
              <Text style={s.weekTheme}>{week.theme}</Text>
            </View>
            <Text style={s.sectionLabel}>Metas da semana</Text>
            {week.goals.map((g, gi) => (
              <View key={gi} style={s.goalRow}>
                <View style={s.checkbox} />
                <Text style={s.goalText}>{g}</Text>
              </View>
            ))}
            <Text style={s.sectionLabel}>Recursos</Text>
            {week.resources.map((r, ri) => (
              <View key={ri} style={s.resourceRow}>
                <Text style={[s.resourceIcon, { color: resourceTypeColor[r.type] ?? '#94a3b8' }]}>
                  {resourceTypeIcon[r.type] ?? '›'}
                </Text>
                <Text style={s.resourceTitle}>{r.title}</Text>
                {r.duration && <Text style={s.resourceDur}>{r.duration}</Text>}
              </View>
            ))}
            {week.exercises && week.exercises.length > 0 && (
              <View>
                <Text style={s.sectionLabel}>Exercícios</Text>
                {week.exercises.map((e, ei) => (
                  <View key={ei} style={s.exerciseRow}>
                    <Text style={s.exerciseDot}>›</Text>
                    <Text style={s.exerciseText}>{e}</Text>
                  </View>
                ))}
              </View>
            )}
            {week.checkpoint && (
              <View style={s.checkpointBox}>
                <Text style={s.checkpointLbl}>Checkpoint</Text>
                <Text style={s.checkpointText}>{week.checkpoint}</Text>
              </View>
            )}
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{skillName} · Plano de Estudos · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
