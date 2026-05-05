'use client'

// ── Types ────────────────────────────────────────────────────────────────────────

export interface CoverPageOpts {
  badge: string
  title: string
  subtitle: string
  accent: string
  date: string
  /** Symbol/emoji displayed in the logo circle (default: '⚛') */
  logoSymbol?: string
  /** Stack label in meta row (default: 'React 18 / 19') */
  stackLabel?: string
  /** Level label in meta row (default: 'Pleno e Sênior') */
  levelLabel?: string
  footerText?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

/**
 * Async builder — returns a react-pdf <Page> element for a cover page.
 * Must be called inside an async function that already imported @react-pdf/renderer.
 */
export async function buildCoverPage(opts: CoverPageOpts): Promise<React.ReactElement> {
  const { Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    badge,
    title,
    subtitle,
    accent,
    date,
    logoSymbol = '⚛',
    stackLabel = 'React 18 / 19',
    levelLabel = 'Pleno e Sênior',
    footerText = 'CareerStudy · Guia de bolso para revisão cognitiva · careerstudy.app',
  } = opts

  const s = StyleSheet.create({
    page:      { backgroundColor: '#0f172a', padding: 0, fontFamily: 'Helvetica' },
    band:      { height: 6, backgroundColor: accent },
    inner:     { padding: 56, flexGrow: 1, justifyContent: 'center' as const },
    logoBox:   { width: 88, height: 88, borderRadius: 44, backgroundColor: '#0a1628', borderWidth: 2, borderColor: accent, alignItems: 'center' as const, justifyContent: 'center' as const, marginBottom: 28 },
    logoText:  { fontSize: 36, color: accent, fontFamily: 'Helvetica-Bold' },
    badge:     { fontSize: 9, color: accent, letterSpacing: 3, marginBottom: 14, textTransform: 'uppercase' as const, fontFamily: 'Helvetica-Bold' },
    title:     { fontSize: 36, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 12, lineHeight: 1.15 },
    subtitle:  { fontSize: 13, color: '#94a3b8', lineHeight: 1.55, maxWidth: 420, marginBottom: 36 },
    metaRow:   { flexDirection: 'row' as const, gap: 24, marginTop: 28, paddingTop: 18, borderTopWidth: 1, borderTopColor: '#1e293b' },
    metaItem:  {},
    metaLabel: { fontSize: 8, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: 2, marginBottom: 3 },
    metaValue: { fontSize: 11, color: '#e2e8f0', fontFamily: 'Helvetica-Bold' },
    footer:    { position: 'absolute' as const, bottom: 28, left: 56, right: 56, fontSize: 8, color: '#475569' },
  })

  return (
    <Page size="A4" style={s.page}>
      <View style={s.band} />
      <View style={s.inner}>
        <View style={s.logoBox}>
          <Text style={s.logoText}>{logoSymbol}</Text>
        </View>
        <Text style={s.badge}>{badge}</Text>
        <Text style={s.title}>{title}</Text>
        <Text style={s.subtitle}>{subtitle}</Text>
        <View style={s.metaRow}>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Stack</Text>
            <Text style={s.metaValue}>{stackLabel}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Nível</Text>
            <Text style={s.metaValue}>{levelLabel}</Text>
          </View>
          <View style={s.metaItem}>
            <Text style={s.metaLabel}>Atualizado</Text>
            <Text style={s.metaValue}>{date}</Text>
          </View>
        </View>
        <Text style={s.footer}>{footerText}</Text>
      </View>
    </Page>
  )
}
