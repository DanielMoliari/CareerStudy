'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type CommandEntry = {
  command: string
  description: string
  flags?: Array<{ flag: string; description: string }>
  example?: string
  output?: string
  category: string
  danger?: boolean
}

export interface CommandRefPdfOpts {
  commands: CommandEntry[]
  skillName: string
  accentColor: string
  stackLabel: string
  coverTitle?: string
  coverSubtitle?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildCommandRefPdf(opts: CommandRefPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    commands,
    skillName,
    accentColor,
    stackLabel,
    coverTitle,
    coverSubtitle,
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
    sectionTitle: { fontSize: 13, color: accentColor, fontFamily: 'Helvetica-Bold', marginBottom: 10, marginTop: 16, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    cmdBlock:     { marginBottom: 12, padding: 12, backgroundColor: '#1e293b', borderRadius: 6 },
    cmdDanger:    { marginBottom: 12, padding: 12, backgroundColor: '#1e293b', borderRadius: 6, borderLeftWidth: 3, borderLeftColor: '#ef4444' },
    cmdName:      { fontSize: 12, color: accentColor, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
    cmdNameDanger:{ fontSize: 12, color: '#ef4444', fontFamily: 'Helvetica-Bold', marginBottom: 4 },
    desc:         { fontSize: 9, color: '#94a3b8', lineHeight: 1.55, marginBottom: 6 },
    flagsLabel:   { fontSize: 7, color: '#64748b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' as const },
    flagRow:      { flexDirection: 'row' as const, marginBottom: 3, paddingLeft: 8 },
    flagKey:      { fontSize: 8, color: '#38bdf8', fontFamily: 'Helvetica-Bold', width: 100 },
    flagDesc:     { fontSize: 8, color: '#94a3b8', flex: 1, lineHeight: 1.45 },
    codeBlock:    { marginTop: 6, padding: 8, backgroundColor: '#0a1628', borderRadius: 4 },
    codeLabel:    { fontSize: 7, color: '#475569', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 3, textTransform: 'uppercase' as const },
    codeText:     { fontSize: 8, color: '#a3e635', fontFamily: 'Courier', lineHeight: 1.4 },
    outputText:   { fontSize: 8, color: '#64748b', fontFamily: 'Courier', lineHeight: 1.4, marginTop: 2 },
    dangerBadge:  { alignSelf: 'flex-start' as const, backgroundColor: '#3f1d2a', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, marginBottom: 4 },
    dangerText:   { fontSize: 7, color: '#ef4444', fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
    footer:       { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const categories = Array.from(new Set(commands.map(c => c.category)))

  const cover = await buildCoverPage({
    badge: 'Command Reference',
    title: coverTitle ?? `${skillName} — Referência de Comandos`,
    subtitle: coverSubtitle ?? `Todos os comandos essenciais organizados por categoria com flags, exemplos e saídas esperadas. ${commands.length} entradas.`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: `${commands.length} comandos`,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Command Reference</Text>
          <Text style={s.headerR}>{commands.length} comandos · {categories.length} categorias</Text>
        </View>
        {categories.map(cat => {
          const catCommands = commands.filter(c => c.category === cat)
          return (
            <View key={cat}>
              <Text style={s.sectionTitle}>{cat}</Text>
              {catCommands.map((cmd, i) => (
                <View key={i} style={cmd.danger ? s.cmdDanger : s.cmdBlock} wrap={false}>
                  {cmd.danger && (
                    <View style={s.dangerBadge}>
                      <Text style={s.dangerText}>DESTRUTIVO</Text>
                    </View>
                  )}
                  <Text style={cmd.danger ? s.cmdNameDanger : s.cmdName}>{cmd.command}</Text>
                  <Text style={s.desc}>{cmd.description}</Text>
                  {cmd.flags && cmd.flags.length > 0 && (
                    <View>
                      <Text style={s.flagsLabel}>Flags</Text>
                      {cmd.flags.map((f, fi) => (
                        <View key={fi} style={s.flagRow}>
                          <Text style={s.flagKey}>{f.flag}</Text>
                          <Text style={s.flagDesc}>{f.description}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {cmd.example && (
                    <View style={s.codeBlock}>
                      <Text style={s.codeLabel}>Exemplo</Text>
                      <Text style={s.codeText}>{cmd.example}</Text>
                      {cmd.output && <Text style={s.outputText}># {cmd.output}</Text>}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )
        })}
        <View style={s.footer} fixed>
          <Text>{skillName} · Command Reference · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
