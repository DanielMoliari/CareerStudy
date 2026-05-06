'use client'

// ── Types ────────────────────────────────────────────────────────────────────────

export type QuickRefEntry = {
  key: string
  value: string
  badge?: string
  badgeColor?: string
}

export type QuickRefSection = {
  title: string
  entries: QuickRefEntry[]
}

export type QuickRefColumn = {
  sections: QuickRefSection[]
}

export interface QuickRefPdfOpts {
  columns: QuickRefColumn[]
  skillName: string
  accentColor: string
  stackLabel: string
  tagline?: string
  version?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildQuickRefPdf(opts: QuickRefPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    columns,
    skillName,
    accentColor,
    stackLabel,
    tagline,
    version,
  } = opts

  const colCount = Math.min(Math.max(columns.length, 1), 3)
  // Each column takes an equal fraction with small gaps between them
  const colWidthPct = colCount === 1 ? '100%' : colCount === 2 ? '49%' : '32.5%'

  const s = StyleSheet.create({
    // Page — A4 landscape, dark background, tight padding
    page: {
      backgroundColor: '#0f172a',
      padding: 18,
      paddingBottom: 26,
      fontFamily: 'Helvetica',
      flexDirection: 'column' as const,
    },

    // ── Header ────────────────────────────────────────────────────────────────
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 10,
    },
    accentBar: {
      width: 4,
      height: 28,
      backgroundColor: accentColor,
      borderRadius: 2,
      marginRight: 10,
    },
    headerText: {
      flexDirection: 'column' as const,
      justifyContent: 'center' as const,
    },
    headerTitle: {
      fontSize: 15,
      color: '#f1f5f9',
      fontFamily: 'Helvetica-Bold',
      lineHeight: 1.1,
    },
    headerTagline: {
      fontSize: 8,
      color: '#64748b',
      marginTop: 2,
    },
    headerRight: {
      marginLeft: 'auto' as const,
      flexDirection: 'column' as const,
      alignItems: 'flex-end' as const,
    },
    stackBadge: {
      backgroundColor: '#1e293b',
      borderRadius: 3,
      paddingHorizontal: 7,
      paddingVertical: 2,
      marginBottom: 3,
    },
    stackBadgeText: {
      fontSize: 7,
      color: accentColor,
      fontFamily: 'Helvetica-Bold',
      letterSpacing: 1,
    },
    versionText: {
      fontSize: 7,
      color: '#475569',
    },

    // ── Divider ───────────────────────────────────────────────────────────────
    headerDivider: {
      height: 1,
      backgroundColor: '#1e293b',
      marginBottom: 10,
    },

    // ── Columns layout ────────────────────────────────────────────────────────
    columnsRow: {
      flexDirection: 'row' as const,
      flex: 1,
      gap: 8,
    },
    column: {
      flexDirection: 'column' as const,
      width: colWidthPct,
    },

    // ── Section ───────────────────────────────────────────────────────────────
    section: {
      marginBottom: 9,
    },
    sectionHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: 7.5,
      color: accentColor,
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase' as const,
      letterSpacing: 1.5,
    },
    sectionDivider: {
      flex: 1,
      height: 1,
      backgroundColor: '#1e293b',
      marginLeft: 6,
    },

    // ── Entry rows ────────────────────────────────────────────────────────────
    entryRow: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: 2,
    },
    entryRowAlt: {
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: 2,
      backgroundColor: '#111827',
    },
    entryKey: {
      fontSize: 8,
      color: accentColor,
      fontFamily: 'Courier',
      width: '40%',
      lineHeight: 1.4,
    },
    entryValue: {
      fontSize: 8,
      color: '#94a3b8',
      fontFamily: 'Helvetica',
      flex: 1,
      lineHeight: 1.4,
    },

    // ── Badge ─────────────────────────────────────────────────────────────────
    badgeWrap: {
      borderRadius: 2,
      paddingHorizontal: 4,
      paddingVertical: 1,
      marginLeft: 4,
      alignSelf: 'center' as const,
    },
    badgeText: {
      fontSize: 6.5,
      fontFamily: 'Helvetica-Bold',
    },

    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
      position: 'absolute' as const,
      bottom: 8,
      left: 18,
      right: 18,
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      borderTopWidth: 1,
      borderTopColor: '#1e293b',
      paddingTop: 4,
    },
    footerLeft: {
      fontSize: 7,
      color: '#475569',
    },
    footerRight: {
      fontSize: 7,
      color: '#334155',
    },
  })

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>

        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={s.header}>
          <View style={s.accentBar} />
          <View style={s.headerText}>
            <Text style={s.headerTitle}>{skillName}</Text>
            {tagline ? <Text style={s.headerTagline}>{tagline}</Text> : null}
          </View>
          <View style={s.headerRight}>
            <View style={s.stackBadge}>
              <Text style={s.stackBadgeText}>{stackLabel}</Text>
            </View>
            {version ? <Text style={s.versionText}>{version}</Text> : null}
          </View>
        </View>
        <View style={s.headerDivider} />

        {/* ── Columns ────────────────────────────────────────────────── */}
        <View style={s.columnsRow}>
          {columns.map((col, ci) => (
            <View key={ci} style={s.column}>
              {col.sections.map((sec, si) => (
                <View key={si} style={s.section} wrap={false}>
                  {/* Section title + horizontal rule */}
                  <View style={s.sectionHeader}>
                    <Text style={s.sectionTitle}>{sec.title}</Text>
                    <View style={s.sectionDivider} />
                  </View>

                  {/* Entry micro-table */}
                  {sec.entries.map((entry, ei) => (
                    <View key={ei} style={ei % 2 === 0 ? s.entryRow : s.entryRowAlt}>
                      <Text style={s.entryKey}>{entry.key}</Text>
                      <Text style={s.entryValue}>{entry.value}</Text>
                      {entry.badge ? (
                        <View style={[s.badgeWrap, { backgroundColor: entry.badgeColor ? entry.badgeColor + '33' : '#1e293b' }]}>
                          <Text style={[s.badgeText, { color: entry.badgeColor ?? '#94a3b8' }]}>
                            {entry.badge}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerLeft}>CareerStudy  •  {skillName}</Text>
          <Text style={s.footerRight}>{version ?? stackLabel}</Text>
        </View>

      </Page>
    </Document>
  )
}
