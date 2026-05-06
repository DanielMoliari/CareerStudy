'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type SecurityCheck = {
  item: string
  description?: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  cwe?: string
  owasp?: string
  remediation?: string
  testable?: boolean
}

export interface SecurityChecklistPdfOpts {
  checks: SecurityCheck[]
  skillName: string
  accentColor: string
  stackLabel: string
  targetAudience?: string
  coverTitle?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildSecurityChecklistPdf(opts: SecurityChecklistPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    checks,
    skillName,
    accentColor,
    stackLabel,
    targetAudience,
    coverTitle,
    date,
  } = opts

  const today = date ?? (() => {
    const d = new Date()
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${months[d.getMonth()]}/${d.getFullYear()}`
  })()

  const sevColor = (sev: string) => {
    if (sev === 'critical') return '#ef4444'
    if (sev === 'high')     return '#f97316'
    if (sev === 'medium')   return '#f59e0b'
    return '#38bdf8'
  }

  const sevBg = (sev: string) => {
    if (sev === 'critical') return '#3f1d2a'
    if (sev === 'high')     return '#2d1408'
    if (sev === 'medium')   return '#2d1b08'
    return '#0c2233'
  }

  const sevLabel = (sev: string) => {
    if (sev === 'critical') return 'CRÍTICO'
    if (sev === 'high')     return 'ALTO'
    if (sev === 'medium')   return 'MÉDIO'
    return 'BAIXO'
  }

  const s = StyleSheet.create({
    page:          { backgroundColor: '#0f172a', padding: 36, fontFamily: 'Helvetica' },
    header:        { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:       { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:       { fontSize: 8, color: '#475569' },
    summaryBox:    { padding: 12, backgroundColor: '#1e293b', borderRadius: 6, marginBottom: 16 },
    summaryTitle:  { fontSize: 11, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 8 },
    summaryRow:    { flexDirection: 'row' as const, gap: 16 },
    summaryItem:   { padding: '4 10', borderRadius: 4 },
    summaryNum:    { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    summaryLabel:  { fontSize: 7, letterSpacing: 1, textTransform: 'uppercase' as const },
    audienceText:  { fontSize: 8, color: '#64748b', marginTop: 8 },
    catTitle:      { fontSize: 12, color: accentColor, fontFamily: 'Helvetica-Bold', marginTop: 14, marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    checkBlock:    { marginBottom: 10, padding: 10, backgroundColor: '#1e293b', borderRadius: 6 },
    checkTopRow:   { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 8, marginBottom: 6 },
    checkbox:      { width: 14, height: 14, borderWidth: 1.5, borderColor: '#475569', borderRadius: 3, flexShrink: 0, marginTop: 1 },
    checkItemText: { fontSize: 9.5, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', flex: 1, lineHeight: 1.4 },
    badgeRow:      { flexDirection: 'row' as const, gap: 6, marginBottom: 6 },
    sevBadge:      { fontSize: 7, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    cweBadge:      { fontSize: 7, color: '#94a3b8', backgroundColor: '#0f172a', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
    owaspBadge:    { fontSize: 7, color: '#a78bfa', backgroundColor: '#1a1040', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
    testBadge:     { fontSize: 7, color: '#4ade80', backgroundColor: '#0a1a0a', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
    description:   { fontSize: 8.5, color: '#94a3b8', lineHeight: 1.55, marginBottom: 4 },
    remedBox:      { padding: 7, backgroundColor: '#0a1628', borderRadius: 3, borderLeftWidth: 2, borderLeftColor: '#4ade80' },
    remedLabel:    { fontSize: 7, color: '#4ade80', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 2, textTransform: 'uppercase' as const },
    remedText:     { fontSize: 8, color: '#86efac', lineHeight: 1.5 },
    footer:        { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const categories = Array.from(new Set(checks.map(c => c.category)))
  const countBySev = (sev: string) => checks.filter(c => c.severity === sev).length

  const cover = await buildCoverPage({
    badge: 'Security Checklist',
    title: coverTitle ?? `${skillName} — Checklist de Segurança`,
    subtitle: `${checks.length} verificações de segurança organizadas por categoria e severidade.${targetAudience ? ` Público-alvo: ${targetAudience}.` : ''}`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: targetAudience ?? `${checks.length} checks`,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Security Checklist</Text>
          <Text style={s.headerR}>{checks.length} verificações · {categories.length} categorias</Text>
        </View>
        <View style={s.summaryBox}>
          <Text style={s.summaryTitle}>Resumo por Severidade</Text>
          <View style={s.summaryRow}>
            {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
              <View key={sev} style={[s.summaryItem, { backgroundColor: sevBg(sev) }]}>
                <Text style={[s.summaryNum, { color: sevColor(sev) }]}>{countBySev(sev)}</Text>
                <Text style={[s.summaryLabel, { color: sevColor(sev) }]}>{sevLabel(sev)}</Text>
              </View>
            ))}
          </View>
          {targetAudience && <Text style={s.audienceText}>Público-alvo: {targetAudience}</Text>}
        </View>
        {categories.map(cat => {
          const catChecks = checks.filter(c => c.category === cat)
          return (
            <View key={cat}>
              <Text style={s.catTitle}>{cat}</Text>
              {catChecks.map((check, i) => (
                <View key={i} style={s.checkBlock} wrap={false}>
                  <View style={s.checkTopRow}>
                    <View style={s.checkbox} />
                    <Text style={s.checkItemText}>{check.item}</Text>
                  </View>
                  <View style={s.badgeRow}>
                    <Text style={[s.sevBadge, { color: sevColor(check.severity), backgroundColor: sevBg(check.severity) }]}>
                      {sevLabel(check.severity)}
                    </Text>
                    {check.cwe && <Text style={s.cweBadge}>{check.cwe}</Text>}
                    {check.owasp && <Text style={s.owaspBadge}>{check.owasp}</Text>}
                    {check.testable && <Text style={s.testBadge}>Testável</Text>}
                  </View>
                  {check.description && <Text style={s.description}>{check.description}</Text>}
                  {check.remediation && (
                    <View style={s.remedBox}>
                      <Text style={s.remedLabel}>Remediação</Text>
                      <Text style={s.remedText}>{check.remediation}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )
        })}
        <View style={s.footer} fixed>
          <Text>{skillName} · Security Checklist · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
