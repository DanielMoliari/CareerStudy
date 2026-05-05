'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type QALevel = 'Senior' | 'Pleno'

export type QAItem = {
  level: QALevel
  q: string
  a: string
  bullets?: string[]
  tip: string
}

export interface QAReviewPdfOpts {
  qa: QAItem[]
  accentColor: string
  skillName: string
  stackLabel: string
  /** Label shown in the cover badge */
  badgeLabel?: string
  coverTitle?: string
  coverSubtitle?: string
  headerLeft?: string
  headerRight?: string
  footerLeft?: string
  date?: string
  levelLabel?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildQAReviewPdf(opts: QAReviewPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    qa,
    accentColor,
    skillName,
    stackLabel,
    badgeLabel = 'Q&A Review',
    coverTitle,
    coverSubtitle,
    headerLeft,
    headerRight,
    footerLeft,
    date,
    levelLabel = 'Pleno e Sênior',
  } = opts

  const today = date ?? (() => {
    const d = new Date()
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${months[d.getMonth()]}/${d.getFullYear()}`
  })()

  const s = StyleSheet.create({
    page:       { backgroundColor: '#0f172a', padding: 36, fontFamily: 'Helvetica' },
    header:     { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginBottom: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:    { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:    { fontSize: 8, color: '#475569' },
    qBlock:     { marginBottom: 14, padding: 14, backgroundColor: '#1e293b', borderRadius: 8, position: 'relative' as const },
    qNumLight:  { position: 'absolute' as const, top: 10, right: 14, fontSize: 32, color: '#334155', fontFamily: 'Helvetica-Bold' },
    levelRow:   { flexDirection: 'row' as const, gap: 6, marginBottom: 6 },
    levelBadge: { fontSize: 7, padding: '3 7', borderRadius: 3, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    qText:      { fontSize: 11.5, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 8, lineHeight: 1.45, paddingRight: 40 },
    aText:      { fontSize: 9.5, color: '#cbd5e1', lineHeight: 1.65, marginBottom: 6 },
    bullet:     { flexDirection: 'row' as const, marginBottom: 3, paddingLeft: 4 },
    bulletDot:  { fontSize: 9, color: accentColor, width: 10 },
    bulletText: { fontSize: 9, color: '#94a3b8', flex: 1, lineHeight: 1.55 },
    tipBox:     { marginTop: 8, padding: 9, backgroundColor: '#0a1628', borderLeftWidth: 3, borderLeftColor: '#f59e0b', borderRadius: 3 },
    tipLabel:   { fontSize: 7, color: '#f59e0b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3 },
    tipText:    { fontSize: 9, color: '#fcd34d', lineHeight: 1.55 },
    footer:     { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const levelStyle = (lvl: QALevel) => lvl === 'Senior'
    ? { color: '#f87171', backgroundColor: '#3f1d2a' }
    : { color: '#38bdf8', backgroundColor: '#0c2233' }

  const cover = await buildCoverPage({
    badge: badgeLabel,
    title: coverTitle ?? `As ${qa.length} perguntas mais cobradas em entrevista ${skillName}`,
    subtitle: coverSubtitle ?? 'Respostas estruturadas para nível pleno e sênior. Use para revisão ativa: leia a pergunta, tente responder de cabeça, depois confira.',
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{headerLeft ?? `${skillName} · Q&A Review`}</Text>
          <Text style={s.headerR}>{headerRight ?? `${qa.length} perguntas · pleno e sênior`}</Text>
        </View>
        {qa.map((item, i) => (
          <View key={i} style={s.qBlock} wrap={false}>
            <Text style={s.qNumLight}>{String(i + 1).padStart(2, '0')}</Text>
            <View style={s.levelRow}>
              <Text style={[s.levelBadge, levelStyle(item.level)]}>{item.level.toUpperCase()}</Text>
              <Text style={[s.levelBadge, { color: '#94a3b8', backgroundColor: '#0f172a' }]}>PERGUNTA {i + 1}</Text>
            </View>
            <Text style={s.qText}>{item.q}</Text>
            <Text style={s.aText}>{item.a}</Text>
            {item.bullets?.map((b, bi) => (
              <View key={bi} style={s.bullet}>
                <Text style={s.bulletDot}>›</Text>
                <Text style={s.bulletText}>{b}</Text>
              </View>
            ))}
            <View style={s.tipBox}>
              <Text style={s.tipLabel}>TIP DE ENTREVISTA</Text>
              <Text style={s.tipText}>{item.tip}</Text>
            </View>
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{footerLeft ?? `${skillName} Q&A Review · CareerStudy`}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
