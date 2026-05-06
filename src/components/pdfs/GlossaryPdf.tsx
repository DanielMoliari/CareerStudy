'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type GlossaryTerm = {
  term: string
  pronunciation?: string
  definition: string
  example?: string
  seeAlso?: string[]
  category?: string
  isAcronym?: boolean
}

export interface GlossaryPdfOpts {
  terms: GlossaryTerm[]
  skillName: string
  accentColor: string
  stackLabel: string
  coverTitle?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildGlossaryPdf(opts: GlossaryPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    terms,
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
    page:         { backgroundColor: '#0f172a', padding: 36, fontFamily: 'Helvetica' },
    header:       { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:      { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:      { fontSize: 8, color: '#475569' },
    letterSep:    { fontSize: 24, color: accentColor, fontFamily: 'Helvetica-Bold', marginTop: 16, marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    termBlock:    { marginBottom: 12, padding: 10, backgroundColor: '#1e293b', borderRadius: 6 },
    termRow:      { flexDirection: 'row' as const, alignItems: 'center' as const, marginBottom: 4, gap: 8 },
    termName:     { fontSize: 12, color: '#e2e8f0', fontFamily: 'Helvetica-Bold' },
    acronymBadge: { fontSize: 7, color: accentColor, backgroundColor: '#0a1628', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    pronunciation:{ fontSize: 9, color: '#64748b', fontStyle: 'italic' as const },
    definition:   { fontSize: 9, color: '#94a3b8', lineHeight: 1.6, marginBottom: 6 },
    exampleBlock: { padding: 7, backgroundColor: '#0a1628', borderRadius: 3, marginBottom: 6 },
    exampleLabel: { fontSize: 7, color: '#475569', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' as const },
    exampleText:  { fontSize: 8, color: '#a3e635', fontFamily: 'Courier', lineHeight: 1.4 },
    seeAlsoRow:   { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 4 },
    seeAlsoLabel: { fontSize: 7, color: '#475569', marginRight: 4 },
    seeAlsoBadge: { fontSize: 7, color: accentColor, backgroundColor: '#0a1628', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3 },
    footer:       { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term))
  const byLetter: Record<string, GlossaryTerm[]> = {}
  for (const t of sorted) {
    const letter = t.term[0].toUpperCase()
    if (!byLetter[letter]) byLetter[letter] = []
    byLetter[letter].push(t)
  }
  const letters = Object.keys(byLetter).sort()

  const cover = await buildCoverPage({
    badge: 'Glossário',
    title: coverTitle ?? `${skillName} — Glossário de Termos`,
    subtitle: `${terms.length} termos técnicos com definição, pronúncia e exemplos de uso. Ordenados alfabeticamente com separadores por letra.`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: `${terms.length} termos`,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Glossário</Text>
          <Text style={s.headerR}>{terms.length} termos · {letters.length} letras</Text>
        </View>
        {letters.map(letter => (
          <View key={letter}>
            <Text style={s.letterSep}>{letter}</Text>
            {byLetter[letter].map((t, i) => (
              <View key={i} style={s.termBlock} wrap={false}>
                <View style={s.termRow}>
                  <Text style={s.termName}>{t.term}</Text>
                  {t.isAcronym && <Text style={s.acronymBadge}>SIGLA</Text>}
                  {t.pronunciation && <Text style={s.pronunciation}>{t.pronunciation}</Text>}
                </View>
                <Text style={s.definition}>{t.definition}</Text>
                {t.example && (
                  <View style={s.exampleBlock}>
                    <Text style={s.exampleLabel}>Exemplo</Text>
                    <Text style={s.exampleText}>{t.example}</Text>
                  </View>
                )}
                {t.seeAlso && t.seeAlso.length > 0 && (
                  <View style={s.seeAlsoRow}>
                    <Text style={s.seeAlsoLabel}>Ver também:</Text>
                    {t.seeAlso.map((sa, si) => (
                      <Text key={si} style={s.seeAlsoBadge}>{sa}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{skillName} · Glossário · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
