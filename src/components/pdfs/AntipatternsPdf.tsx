'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CodeToken = { t: string; c?: string }

export type AntiPatternItem = {
  title: string
  badDesc: string
  badCode: CodeToken[]
  goodDesc: string
  goodCode: CodeToken[]
  why: string
}

export interface AntipatternsPdfOpts {
  antipatterns: AntiPatternItem[]
  accentColor: string
  skillName: string
  stackLabel: string
  coverTitle?: string
  coverSubtitle?: string
  headerLeft?: string
  headerRight?: string
  footerLeft?: string
  date?: string
  levelLabel?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildAntipatternsPdf(opts: AntipatternsPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    antipatterns,
    accentColor,
    skillName,
    stackLabel,
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
    page:      { backgroundColor: '#0f172a', padding: 28, fontFamily: 'Helvetica' },
    header:    { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:   { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:   { fontSize: 8, color: '#475569' },
    apBlock:   { marginBottom: 14, backgroundColor: '#1e293b', borderRadius: 8, overflow: 'hidden' as const },
    apHeader:  { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, padding: 10, borderBottomWidth: 1, borderBottomColor: '#0f172a' },
    apNum:     { fontSize: 9, color: '#64748b', fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    apTitle:   { fontSize: 12, color: accentColor, fontFamily: 'Helvetica-Bold' },
    badBlock:  { padding: 11, borderLeftWidth: 3, borderLeftColor: '#f87171', backgroundColor: '#1a0a0a' },
    goodBlock: { padding: 11, borderLeftWidth: 3, borderLeftColor: '#4ade80', backgroundColor: '#0a1a0a' },
    blockLbl:  { fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 5 },
    desc:      { fontSize: 9, color: '#cbd5e1', lineHeight: 1.55, marginBottom: 6 },
    code:      { fontSize: 8.5, fontFamily: 'Courier', lineHeight: 1.55, marginBottom: 4 },
    whyBlock:  { padding: 9, backgroundColor: '#1a1200', borderTopWidth: 1, borderTopColor: '#3d2e00' },
    whyLabel:  { fontSize: 7, color: '#f59e0b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3 },
    whyText:   { fontSize: 8.5, color: '#fcd34d', lineHeight: 1.55 },
    footer:    { position: 'absolute' as const, bottom: 16, left: 28, right: 28, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  // Inline Code component (JSX must be defined here due to async context)
  const Code = ({ tokens, base }: { tokens: CodeToken[]; base: string }) => (
    <Text style={[s.code, { color: base }]}>
      {tokens.map((tk, i) => <Text key={i} style={tk.c ? { color: tk.c } : undefined}>{tk.t}</Text>)}
    </Text>
  )

  const cover = await buildCoverPage({
    badge: 'Anti-patterns',
    title: coverTitle ?? `Os ${antipatterns.length} erros que aparecem em code review de ${skillName}`,
    subtitle: coverSubtitle ?? 'Cada anti-pattern com código errado x correto e explicação técnica. Reconhecimento de padrão é mais rápido que pensar do zero.',
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
          <Text style={s.headerL}>{headerLeft ?? `${skillName} · Anti-patterns`}</Text>
          <Text style={s.headerR}>{headerRight ?? `${antipatterns.length} erros comuns · errado x correto`}</Text>
        </View>
        {antipatterns.map((ap, i) => (
          <View key={i} style={s.apBlock} wrap={false}>
            <View style={s.apHeader}>
              <Text style={s.apNum}>#{String(i + 1).padStart(2, '0')}</Text>
              <Text style={s.apTitle}>{ap.title}</Text>
            </View>
            <View style={s.badBlock}>
              <Text style={[s.blockLbl, { color: '#f87171' }]}>✗ ERRADO</Text>
              <Text style={s.desc}>{ap.badDesc}</Text>
              <Code tokens={ap.badCode} base="#fda4af" />
            </View>
            <View style={s.goodBlock}>
              <Text style={[s.blockLbl, { color: '#4ade80' }]}>✓ CORRETO</Text>
              <Text style={s.desc}>{ap.goodDesc}</Text>
              <Code tokens={ap.goodCode} base="#86efac" />
            </View>
            <View style={s.whyBlock}>
              <Text style={s.whyLabel}>POR QUE ISSO QUEBRA</Text>
              <Text style={s.whyText}>{ap.why}</Text>
            </View>
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{footerLeft ?? `${skillName} Anti-patterns · CareerStudy`}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
