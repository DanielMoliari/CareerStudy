'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type MnemonicItem = {
  label: string
  trick: string
  expansion: Array<[string, string]>
  explanation: string
  example: string
  why: string
}

export interface MnemonicsPdfOpts {
  mnemonics: MnemonicItem[]
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

export async function buildMnemonicsPdf(opts: MnemonicsPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    mnemonics,
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
    page:        { backgroundColor: '#0f172a', padding: 32, fontFamily: 'Helvetica' },
    header:      { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:     { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:     { fontSize: 8, color: '#475569' },
    card:        { backgroundColor: '#1e293b', borderRadius: 8, padding: 16, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: accentColor },
    label:       { fontSize: 8, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: 2, marginBottom: 6 },
    trick:       { fontSize: 32, color: accentColor, fontFamily: 'Helvetica-Bold', marginBottom: 8, letterSpacing: 4 },
    expansion:   { marginBottom: 10 },
    expRow:      { flexDirection: 'row' as const, marginBottom: 3 },
    expLetter:   { fontSize: 11, color: '#38bdf8', fontFamily: 'Helvetica-Bold', width: 22 },
    expMeaning:  { fontSize: 10, color: '#cbd5e1', flex: 1, lineHeight: 1.5 },
    divider:     { borderBottomWidth: 1, borderBottomColor: '#334155', marginVertical: 8 },
    explanation: { fontSize: 9.5, color: '#94a3b8', lineHeight: 1.65, marginBottom: 8 },
    exampleBox:  { backgroundColor: '#0f172a', padding: 9, borderRadius: 4, marginTop: 6, marginBottom: 6 },
    exampleLbl:  { fontSize: 7, color: accentColor, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3 },
    exampleTxt:  { fontSize: 9, color: '#cbd5e1', lineHeight: 1.5, fontFamily: 'Courier' },
    whyBox:      { backgroundColor: '#0a1628', borderLeftWidth: 2, borderLeftColor: '#f59e0b', padding: 8, borderRadius: 3, marginTop: 4 },
    whyLabel:    { fontSize: 7, color: '#f59e0b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3 },
    whyText:     { fontSize: 8.5, color: '#fcd34d', lineHeight: 1.55 },
    footer:      { position: 'absolute' as const, bottom: 18, left: 32, right: 32, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const cover = await buildCoverPage({
    badge: 'Mnemônicos',
    title: coverTitle ?? `Os ${mnemonics.length} truques que grudam ${skillName} na memória`,
    subtitle: coverSubtitle ?? 'Associações verbais e visuais para regras, re-renders, memoização e lifecycle. Repita em voz alta — ancora melhor que ler.',
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
          <Text style={s.headerL}>{headerLeft ?? `${skillName} · Mnemônicos`}</Text>
          <Text style={s.headerR}>{headerRight ?? `${mnemonics.length} truques de memória`}</Text>
        </View>
        {mnemonics.map((m, i) => (
          <View key={i} style={s.card} wrap={false}>
            <Text style={s.label}>{i + 1}. {m.label}</Text>
            <Text style={s.trick}>{m.trick}</Text>
            <View style={s.expansion}>
              {m.expansion.map((row, ri) => (
                <View key={ri} style={s.expRow}>
                  <Text style={s.expLetter}>{row[0]}</Text>
                  <Text style={s.expMeaning}>{row[1]}</Text>
                </View>
              ))}
            </View>
            <View style={s.divider} />
            <Text style={s.explanation}>{m.explanation}</Text>
            <View style={s.exampleBox}>
              <Text style={s.exampleLbl}>EXEMPLO PRÁTICO</Text>
              <Text style={s.exampleTxt}>{m.example}</Text>
            </View>
            <View style={s.whyBox}>
              <Text style={s.whyLabel}>POR QUE ISSO GRUDA?</Text>
              <Text style={s.whyText}>{m.why}</Text>
            </View>
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{footerLeft ?? `${skillName} Mnemônicos · CareerStudy`}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
