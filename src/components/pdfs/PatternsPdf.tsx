'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type DesignPattern = {
  name: string
  category?: string
  intent: string
  whenToUse: string[]
  whenToAvoid?: string[]
  participants?: string[]
  code: string
  realWorldExample?: string
}

export interface PatternsPdfOpts {
  patterns: DesignPattern[]
  skillName: string
  accentColor: string
  stackLabel: string
  coverTitle?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildPatternsPdf(opts: PatternsPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    patterns,
    skillName,
    accentColor,
    stackLabel,
    coverTitle,
    date,
  } = opts

  const today = date ?? (() => {
    const d = new Date()
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${months[d.getMonth()]}/${d.getFullYear()}`
  })()

  const s = StyleSheet.create({
    page:          { backgroundColor: '#0f172a', padding: 36, fontFamily: 'Helvetica' },
    header:        { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:       { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:       { fontSize: 8, color: '#475569' },
    indexTitle:    { fontSize: 14, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 12 },
    indexCatTitle: { fontSize: 10, color: accentColor, fontFamily: 'Helvetica-Bold', marginTop: 10, marginBottom: 4 },
    indexRow:      { flexDirection: 'row' as const, marginBottom: 3, paddingLeft: 8 },
    indexDot:      { fontSize: 9, color: '#475569', width: 10 },
    indexName:     { fontSize: 9, color: '#94a3b8', flex: 1 },
    indexIntent:   { fontSize: 8, color: '#475569', flex: 2 },
    patBlock:      { marginBottom: 20, padding: 14, backgroundColor: '#1e293b', borderRadius: 8 },
    patTopRow:     { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 6 },
    patName:       { fontSize: 15, color: '#e2e8f0', fontFamily: 'Helvetica-Bold' },
    catBadge:      { fontSize: 7, color: accentColor, backgroundColor: '#0a1628', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    intentBox:     { padding: 8, backgroundColor: '#0a1628', borderLeftWidth: 3, borderLeftColor: accentColor, borderRadius: 3, marginBottom: 10 },
    intentText:    { fontSize: 9.5, color: accentColor, lineHeight: 1.5 },
    sectionLabel:  { fontSize: 7, color: '#64748b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4, marginTop: 8 },
    checkRow:      { flexDirection: 'row' as const, marginBottom: 3 },
    checkDot:      { fontSize: 9, color: '#4ade80', width: 10 },
    checkText:     { fontSize: 8.5, color: '#94a3b8', flex: 1, lineHeight: 1.5 },
    avoidRow:      { flexDirection: 'row' as const, marginBottom: 3 },
    avoidDot:      { fontSize: 9, color: '#f87171', width: 10 },
    avoidText:     { fontSize: 8.5, color: '#94a3b8', flex: 1, lineHeight: 1.5 },
    participantsRow:{ flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 6, marginTop: 4 },
    partBadge:     { fontSize: 7.5, color: '#e2e8f0', backgroundColor: '#334155', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
    codeBlock:     { marginTop: 8, padding: 8, backgroundColor: '#0a1628', borderRadius: 4 },
    codeLabel:     { fontSize: 7, color: '#475569', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' as const },
    codeText:      { fontSize: 7.5, color: '#a3e635', fontFamily: 'Courier', lineHeight: 1.4 },
    realWorldBox:  { marginTop: 8, padding: 8, backgroundColor: '#0c2233', borderRadius: 4 },
    realWorldLabel:{ fontSize: 7, color: '#38bdf8', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' as const },
    realWorldText: { fontSize: 8.5, color: '#7dd3fc', lineHeight: 1.5 },
    footer:        { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const categories = Array.from(new Set(patterns.map(p => p.category ?? 'Geral')))

  const cover = await buildCoverPage({
    badge: 'Catálogo de Padrões',
    title: coverTitle ?? `${skillName} — Design Patterns`,
    subtitle: `${patterns.length} padrões de design com intent, quando usar, participantes e código de implementação.`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: `${patterns.length} padrões`,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Design Patterns</Text>
          <Text style={s.headerR}>{patterns.length} padrões · {categories.length} categorias</Text>
        </View>
        <Text style={s.indexTitle}>Índice de Padrões</Text>
        {categories.map(cat => {
          const catPats = patterns.filter(p => (p.category ?? 'Geral') === cat)
          return (
            <View key={cat}>
              <Text style={s.indexCatTitle}>{cat}</Text>
              {catPats.map((p, i) => (
                <View key={i} style={s.indexRow}>
                  <Text style={s.indexDot}>›</Text>
                  <Text style={s.indexName}>{p.name}</Text>
                  <Text style={s.indexIntent}>{p.intent}</Text>
                </View>
              ))}
            </View>
          )
        })}
      </Page>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Padrões</Text>
          <Text style={s.headerR}></Text>
        </View>
        {patterns.map((pat, i) => (
          <View key={i} style={s.patBlock} wrap={false}>
            <View style={s.patTopRow}>
              <Text style={s.patName}>{pat.name}</Text>
              {pat.category && <Text style={s.catBadge}>{pat.category.toUpperCase()}</Text>}
            </View>
            <View style={s.intentBox}>
              <Text style={s.intentText}>{pat.intent}</Text>
            </View>
            <Text style={s.sectionLabel}>Quando Usar</Text>
            {pat.whenToUse.map((w, wi) => (
              <View key={wi} style={s.checkRow}>
                <Text style={s.checkDot}>✓</Text>
                <Text style={s.checkText}>{w}</Text>
              </View>
            ))}
            {pat.whenToAvoid && pat.whenToAvoid.length > 0 && (
              <View>
                <Text style={s.sectionLabel}>Quando Evitar</Text>
                {pat.whenToAvoid.map((a, ai) => (
                  <View key={ai} style={s.avoidRow}>
                    <Text style={s.avoidDot}>✗</Text>
                    <Text style={s.avoidText}>{a}</Text>
                  </View>
                ))}
              </View>
            )}
            {pat.participants && pat.participants.length > 0 && (
              <View>
                <Text style={s.sectionLabel}>Participantes</Text>
                <View style={s.participantsRow}>
                  {pat.participants.map((p, pi) => (
                    <Text key={pi} style={s.partBadge}>{p}</Text>
                  ))}
                </View>
              </View>
            )}
            <View style={s.codeBlock}>
              <Text style={s.codeLabel}>Implementação</Text>
              <Text style={s.codeText}>{pat.code}</Text>
            </View>
            {pat.realWorldExample && (
              <View style={s.realWorldBox}>
                <Text style={s.realWorldLabel}>Exemplo Real</Text>
                <Text style={s.realWorldText}>{pat.realWorldExample}</Text>
              </View>
            )}
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{skillName} · Design Patterns · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
