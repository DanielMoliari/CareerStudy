'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CompOption = {
  name: string
  color?: string
}

export type CompCriterion = {
  criterion: string
  category?: string
  values: Record<string, string>
  winner?: string
}

export type CompScenario = {
  scenario: string
  recommendation: string
  reason: string
}

export interface ComparativeRefPdfOpts {
  options: CompOption[]
  criteria: CompCriterion[]
  scenarios?: CompScenario[]
  skillName: string
  accentColor: string
  stackLabel: string
  coverTitle?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildComparativeRefPdf(opts: ComparativeRefPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    options,
    criteria,
    scenarios,
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

  const colWidth = Math.min(120, Math.floor(400 / options.length))

  const s = StyleSheet.create({
    page:          { backgroundColor: '#0f172a', padding: 36, fontFamily: 'Helvetica' },
    header:        { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:       { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:       { fontSize: 8, color: '#475569' },
    tableTitle:    { fontSize: 13, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 10 },
    tableHeadRow:  { flexDirection: 'row' as const, backgroundColor: '#1e293b', borderRadius: 4, marginBottom: 2 },
    tableHeadCell0:{ width: 140, padding: 8 },
    tableHeadCell: { width: colWidth, padding: 8, alignItems: 'center' as const },
    tableHeadText0:{ fontSize: 8, color: '#475569', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' as const, letterSpacing: 1 },
    tableHeadText: { fontSize: 9, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', textAlign: 'center' as const },
    catSepRow:     { flexDirection: 'row' as const, paddingVertical: 4, paddingHorizontal: 4, marginTop: 6 },
    catSepText:    { fontSize: 7, color: '#64748b', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' as const, letterSpacing: 1 },
    tableRow:      { flexDirection: 'row' as const, borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingVertical: 2 },
    tableCell0:    { width: 140, padding: 6 },
    tableCell:     { width: colWidth, padding: 6, alignItems: 'center' as const },
    criterionText: { fontSize: 8.5, color: '#cbd5e1' },
    cellText:      { fontSize: 8, color: '#94a3b8', textAlign: 'center' as const, lineHeight: 1.4 },
    cellWinner:    { fontSize: 8, color: '#4ade80', fontFamily: 'Helvetica-Bold', textAlign: 'center' as const },
    winnerDot:     { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ade80', marginTop: 2 },
    scenTitle:     { fontSize: 13, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginTop: 20, marginBottom: 10 },
    scenBlock:     { marginBottom: 10, padding: 10, backgroundColor: '#1e293b', borderRadius: 6 },
    scenScenario:  { fontSize: 9.5, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 4 },
    scenRec:       { fontSize: 9, color: accentColor, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
    scenReason:    { fontSize: 8.5, color: '#94a3b8', lineHeight: 1.55 },
    footer:        { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const categories = Array.from(new Set(criteria.map(c => c.category ?? '')))

  const cover = await buildCoverPage({
    badge: 'Comparativo',
    title: coverTitle ?? `${skillName} — Tabela Comparativa`,
    subtitle: `Comparação objetiva entre ${options.map(o => o.name).join(', ')} com ${criteria.length} critérios e cenários de uso recomendados.`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: `${options.length} opções · ${criteria.length} critérios`,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Comparativo</Text>
          <Text style={s.headerR}>{options.map(o => o.name).join(' vs ')}</Text>
        </View>
        <Text style={s.tableTitle}>Tabela Comparativa</Text>
        <View style={s.tableHeadRow}>
          <View style={s.tableHeadCell0}>
            <Text style={s.tableHeadText0}>Critério</Text>
          </View>
          {options.map((opt, oi) => (
            <View key={oi} style={s.tableHeadCell}>
              <Text style={[s.tableHeadText, { color: opt.color ?? accentColor }]}>{opt.name}</Text>
            </View>
          ))}
        </View>
        {categories.map(cat => {
          const catCriteria = criteria.filter(c => (c.category ?? '') === cat)
          return (
            <View key={cat}>
              {cat !== '' && (
                <View style={s.catSepRow}>
                  <Text style={s.catSepText}>{cat}</Text>
                </View>
              )}
              {catCriteria.map((crit, ci) => (
                <View key={ci} style={s.tableRow} wrap={false}>
                  <View style={s.tableCell0}>
                    <Text style={s.criterionText}>{crit.criterion}</Text>
                  </View>
                  {options.map((opt, oi) => {
                    const isWinner = crit.winner === opt.name
                    return (
                      <View key={oi} style={[s.tableCell, isWinner ? { backgroundColor: '#0a1a0a' } : {}]}>
                        <Text style={isWinner ? s.cellWinner : s.cellText}>
                          {crit.values[opt.name] ?? '—'}
                        </Text>
                        {isWinner && <View style={s.winnerDot} />}
                      </View>
                    )
                  })}
                </View>
              ))}
            </View>
          )
        })}
        {scenarios && scenarios.length > 0 && (
          <View>
            <Text style={s.scenTitle}>Cenários Recomendados</Text>
            {scenarios.map((sc, si) => (
              <View key={si} style={s.scenBlock} wrap={false}>
                <Text style={s.scenScenario}>{sc.scenario}</Text>
                <Text style={s.scenRec}>→ {sc.recommendation}</Text>
                <Text style={s.scenReason}>{sc.reason}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={s.footer} fixed>
          <Text>{skillName} · Comparativo · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
