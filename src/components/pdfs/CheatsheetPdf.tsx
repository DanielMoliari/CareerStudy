'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type HookItem = {
  name: string
  sig: string
  desc: string
}

export type PatternItem = {
  name: string
  code: string
  desc: string
}

export type DepRow = [string, string]

export type RuleItem = {
  ok: boolean
  t: string
}

export type MentalModelItem = string

export interface CheatsheetPdfOpts {
  skillName: string
  accentColor: string
  stackLabel: string
  sections: {
    hooks: HookItem[]
    hooksExtra?: HookItem[]
    depRows: DepRow[]
    rules: RuleItem[]
    performanceTips: string[]
    patterns: PatternItem[]
    mentalModels: MentalModelItem[]
  }
  coverTitle?: string
  coverSubtitle?: string
  headerLeft?: string
  footerLeft?: string
  date?: string
  levelLabel?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildCheatsheetPdf(opts: CheatsheetPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    skillName,
    accentColor,
    stackLabel,
    sections,
    coverTitle,
    coverSubtitle,
    headerLeft,
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
    header:    { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:   { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:   { fontSize: 8, color: '#475569' },
    secTitle:  { fontSize: 9, color: accentColor, textTransform: 'uppercase' as const, letterSpacing: 2, marginBottom: 6, fontFamily: 'Helvetica-Bold' },
    secBar:    { height: 1, backgroundColor: '#1e293b', marginBottom: 8 },
    section:   { marginBottom: 12 },
    grid:      { flexDirection: 'row' as const, flexWrap: 'wrap' as const },
    hookCard:  { width: '48%', backgroundColor: '#1e293b', borderRadius: 5, padding: 8, marginBottom: 5, marginRight: '2%' },
    hookName:  { fontSize: 10, color: accentColor, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    hookSig:   { fontSize: 7.5, color: '#7dd3fc', marginBottom: 4, lineHeight: 1.4 },
    hookDesc:  { fontSize: 7.5, color: '#94a3b8', lineHeight: 1.5 },
    ruleRow:   { flexDirection: 'row' as const, alignItems: 'flex-start' as const, marginBottom: 4 },
    ruleDot:   { fontSize: 9, width: 12, fontFamily: 'Helvetica-Bold' },
    ruleText:  { fontSize: 9, color: '#cbd5e1', flex: 1, lineHeight: 1.55 },
    depsCard:  { backgroundColor: '#1e293b', borderRadius: 5, padding: 10, marginBottom: 6 },
    depsRow:   { flexDirection: 'row' as const, marginBottom: 4 },
    depsKey:   { fontSize: 9, color: accentColor, width: 75, fontFamily: 'Helvetica-Bold' },
    depsVal:   { fontSize: 9, color: '#94a3b8', flex: 1, lineHeight: 1.5 },
    pattCard:  { backgroundColor: '#1e293b', borderRadius: 5, padding: 9, marginBottom: 6 },
    pattName:  { fontSize: 9.5, color: accentColor, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
    pattCode:  { fontSize: 8, color: '#7dd3fc', fontFamily: 'Courier', marginBottom: 4, lineHeight: 1.45 },
    pattDesc:  { fontSize: 8.5, color: '#94a3b8', lineHeight: 1.5 },
    footer:    { position: 'absolute' as const, bottom: 16, left: 28, right: 28, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const cover = await buildCoverPage({
    badge: 'CheatSheet',
    title: coverTitle ?? `${skillName} — Hooks, regras e patterns em uma referência`,
    subtitle: coverSubtitle ?? 'Referência densa em poucas páginas. Tudo que você precisa checar rapidamente sem abrir documentação.',
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
          <Text style={s.headerL}>{headerLeft ?? `${skillName} · CheatSheet`}</Text>
          <Text style={s.headerR}>Referência rápida</Text>
        </View>

        <View style={s.section}>
          <Text style={s.secTitle}>Hooks principais</Text>
          <View style={s.secBar} />
          <View style={s.grid}>
            {sections.hooks.map((h, i) => (
              <View key={i} style={s.hookCard}>
                <Text style={s.hookName}>{h.name}</Text>
                <Text style={s.hookSig}>{h.sig}</Text>
                <Text style={s.hookDesc}>{h.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {sections.depRows.length > 0 && (
          <View style={s.section}>
            <Text style={s.secTitle}>Dependency Array</Text>
            <View style={s.secBar} />
            <View style={s.depsCard}>
              {sections.depRows.map(([k, v], i) => (
                <View key={i} style={s.depsRow}>
                  <Text style={s.depsKey}>{k}</Text>
                  <Text style={s.depsVal}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {sections.rules.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.secTitle}>Regras dos Hooks</Text>
            <View style={s.secBar} />
            {sections.rules.map((r, i) => (
              <View key={i} style={s.ruleRow}>
                <Text style={[s.ruleDot, { color: r.ok ? '#4ade80' : '#f87171' }]}>{r.ok ? '✓' : '✗'}</Text>
                <Text style={[s.ruleText, { color: r.ok ? '#cbd5e1' : '#fca5a5' }]}>{r.t}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={s.footer} fixed>
          <Text>{footerLeft ?? `${skillName} CheatSheet · CareerStudy`}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{headerLeft ?? `${skillName} · CheatSheet`}</Text>
          <Text style={s.headerR}>Performance e patterns</Text>
        </View>

        {sections.performanceTips.length > 0 && (
          <View style={s.section}>
            <Text style={s.secTitle}>Performance</Text>
            <View style={s.secBar} />
            {sections.performanceTips.map((r, i) => (
              <View key={i} style={s.ruleRow}>
                <Text style={[s.ruleDot, { color: accentColor }]}>›</Text>
                <Text style={s.ruleText}>{r}</Text>
              </View>
            ))}
          </View>
        )}

        {sections.patterns.length > 0 && (
          <View style={s.section}>
            <Text style={s.secTitle}>Patterns comuns</Text>
            <View style={s.secBar} />
            {sections.patterns.map((p, i) => (
              <View key={i} style={s.pattCard}>
                <Text style={s.pattName}>{p.name}</Text>
                <Text style={s.pattCode}>{p.code}</Text>
                <Text style={s.pattDesc}>{p.desc}</Text>
              </View>
            ))}
          </View>
        )}

        {sections.mentalModels.length > 0 && (
          <View style={s.section} wrap={false}>
            <Text style={s.secTitle}>Atalhos mentais</Text>
            <View style={s.secBar} />
            {sections.mentalModels.map((r, i) => (
              <View key={i} style={s.ruleRow}>
                <Text style={[s.ruleDot, { color: accentColor }]}>≡</Text>
                <Text style={s.ruleText}>{r}</Text>
              </View>
            ))}
          </View>
        )}

        {sections.hooksExtra && sections.hooksExtra.length > 0 && (
          <View style={s.section}>
            <Text style={s.secTitle}>Novos Hooks</Text>
            <View style={s.secBar} />
            <View style={s.grid}>
              {sections.hooksExtra.map((h, i) => (
                <View key={i} style={s.hookCard}>
                  <Text style={s.hookName}>{h.name}</Text>
                  <Text style={s.hookSig}>{h.sig}</Text>
                  <Text style={s.hookDesc}>{h.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={s.footer} fixed>
          <Text>{footerLeft ?? `${skillName} CheatSheet · CareerStudy`}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
