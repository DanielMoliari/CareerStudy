'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type ErrorEntry = {
  title: string
  errorMessage?: string
  cause: string
  solution: string
  code?: {
    broken: string
    fixed: string
  }
  severity?: 'critical' | 'warning' | 'info'
  category?: string
  relatedErrors?: string[]
}

export interface ErrorRefPdfOpts {
  errors: ErrorEntry[]
  skillName: string
  accentColor: string
  stackLabel: string
  coverTitle?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildErrorRefPdf(opts: ErrorRefPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    errors,
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

  const severityColor = (sev?: string) => {
    if (sev === 'critical') return '#ef4444'
    if (sev === 'warning')  return '#f59e0b'
    return '#38bdf8'
  }

  const severityBg = (sev?: string) => {
    if (sev === 'critical') return '#3f1d2a'
    if (sev === 'warning')  return '#2d1b08'
    return '#0c2233'
  }

  const severityLabel = (sev?: string) => {
    if (sev === 'critical') return 'CRÍTICO'
    if (sev === 'warning')  return 'ATENÇÃO'
    return 'INFO'
  }

  const s = StyleSheet.create({
    page:         { backgroundColor: '#0f172a', padding: 36, fontFamily: 'Helvetica' },
    header:       { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:      { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:      { fontSize: 8, color: '#475569' },
    catTitle:     { fontSize: 13, color: accentColor, fontFamily: 'Helvetica-Bold', marginTop: 16, marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    errBlock:     { marginBottom: 14, padding: 12, backgroundColor: '#1e293b', borderRadius: 6 },
    errTopRow:    { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 6 },
    errTitle:     { fontSize: 11, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', flex: 1 },
    severityBadge:{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, fontFamily: 'Helvetica-Bold', fontSize: 7, letterSpacing: 1 },
    errMsgBlock:  { marginBottom: 8, padding: 8, backgroundColor: '#1a0a0a', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#ef4444' },
    errMsgText:   { fontSize: 8, color: '#fca5a5', fontFamily: 'Courier', lineHeight: 1.4 },
    fieldLabel:   { fontSize: 7, color: '#64748b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 3, marginTop: 6 },
    fieldText:    { fontSize: 9, color: '#94a3b8', lineHeight: 1.55 },
    codeSection:  { marginTop: 8 },
    codeLabel:    { fontSize: 7, color: '#475569', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' as const },
    codeBroken:   { padding: 7, backgroundColor: '#1a0a0a', borderRadius: 3, marginBottom: 4, borderLeftWidth: 2, borderLeftColor: '#ef4444' },
    codeFixed:    { padding: 7, backgroundColor: '#0a1a0a', borderRadius: 3, borderLeftWidth: 2, borderLeftColor: '#4ade80' },
    codeTextRed:  { fontSize: 7.5, color: '#fca5a5', fontFamily: 'Courier', lineHeight: 1.4 },
    codeTextGreen:{ fontSize: 7.5, color: '#86efac', fontFamily: 'Courier', lineHeight: 1.4 },
    relatedRow:   { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 4, marginTop: 6 },
    relatedLabel: { fontSize: 7, color: '#475569', marginRight: 4 },
    relatedBadge: { fontSize: 7, color: '#94a3b8', backgroundColor: '#0f172a', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
    footer:       { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const categories = Array.from(new Set(errors.map(e => e.category ?? 'Geral')))

  const cover = await buildCoverPage({
    badge: 'Error Reference',
    title: coverTitle ?? `${skillName} — Guia de Erros`,
    subtitle: `${errors.length} erros comuns com causa, solução e código corrigido. Guia de troubleshooting para diagnóstico rápido.`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: `${errors.length} erros`,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Error Reference</Text>
          <Text style={s.headerR}>{errors.length} erros · {categories.length} categorias</Text>
        </View>
        {categories.map(cat => {
          const catErrors = errors.filter(e => (e.category ?? 'Geral') === cat)
          return (
            <View key={cat}>
              <Text style={s.catTitle}>{cat}</Text>
              {catErrors.map((err, i) => (
                <View key={i} style={s.errBlock} wrap={false}>
                  <View style={s.errTopRow}>
                    <Text style={s.errTitle}>{err.title}</Text>
                    <Text style={[s.severityBadge, { color: severityColor(err.severity), backgroundColor: severityBg(err.severity) }]}>
                      {severityLabel(err.severity)}
                    </Text>
                  </View>
                  {err.errorMessage && (
                    <View style={s.errMsgBlock}>
                      <Text style={s.errMsgText}>{err.errorMessage}</Text>
                    </View>
                  )}
                  <Text style={s.fieldLabel}>Causa</Text>
                  <Text style={s.fieldText}>{err.cause}</Text>
                  <Text style={s.fieldLabel}>Solução</Text>
                  <Text style={s.fieldText}>{err.solution}</Text>
                  {err.code && (
                    <View style={s.codeSection}>
                      <Text style={s.codeLabel}>Errado</Text>
                      <View style={s.codeBroken}>
                        <Text style={s.codeTextRed}>{err.code.broken}</Text>
                      </View>
                      <Text style={s.codeLabel}>Correto</Text>
                      <View style={s.codeFixed}>
                        <Text style={s.codeTextGreen}>{err.code.fixed}</Text>
                      </View>
                    </View>
                  )}
                  {err.relatedErrors && err.relatedErrors.length > 0 && (
                    <View style={s.relatedRow}>
                      <Text style={s.relatedLabel}>Ver também:</Text>
                      {err.relatedErrors.map((re, ri) => (
                        <Text key={ri} style={s.relatedBadge}>{re}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )
        })}
        <View style={s.footer} fixed>
          <Text>{skillName} · Error Reference · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
