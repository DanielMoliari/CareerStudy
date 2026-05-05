'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type MindmapCategoryItem = {
  /** Texto exibido na tag */
  t: string
  /** Se verdadeiro → tag essencial (pleno) */
  k?: boolean
  /** Se verdadeiro → tag nível sênior/avançado */
  a?: boolean
}

export type MindmapCategory = {
  label: string
  color: string
  items: MindmapCategoryItem[]
}

export interface MindmapPdfOpts {
  categories: MindmapCategory[]
  checklist: string[]
  accentColor: string
  skillName: string
  stackLabel: string
  coverTitle?: string
  coverSubtitle?: string
  headerLeft?: string
  footerLeft?: string
  date?: string
  levelLabel?: string
  /** Label da legenda: cor essencial */
  legendEssentialLabel?: string
  /** Label da legenda: cor importante */
  legendImportantLabel?: string
  /** Label da legenda: cor sênior */
  legendSeniorLabel?: string
  checklistTitle?: string
  checklistDesc?: string
  mapTitle?: string
  mapDesc?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildMindmapPdf(opts: MindmapPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    categories,
    checklist,
    accentColor,
    skillName,
    stackLabel,
    coverTitle,
    coverSubtitle,
    headerLeft,
    footerLeft,
    date,
    levelLabel = 'Pleno e Sênior',
    legendEssentialLabel = 'essencial (pleno)',
    legendImportantLabel = 'importante',
    legendSeniorLabel = 'nível sênior',
    checklistTitle = 'Checklist de entrevista',
    checklistDesc = 'Você deve conseguir responder cada uma de cabeça em até 90 segundos. Marque o quadrado quando tiver certeza absoluta. Volte às que ficaram em branco.',
    mapTitle = 'Mapa de domínios',
    mapDesc,
  } = opts

  const today = date ?? (() => {
    const d = new Date()
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${months[d.getMonth()]}/${d.getFullYear()}`
  })()

  const s = StyleSheet.create({
    page:        { backgroundColor: '#0f172a', padding: 28, fontFamily: 'Helvetica' },
    header:      { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between' as const, marginBottom: 14, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    headerL:     { fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold' },
    headerR:     { fontSize: 8, color: '#475569' },
    legend:      { flexDirection: 'row' as const, gap: 14, marginBottom: 12 },
    legItem:     { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 5 },
    legDot:      { width: 8, height: 8, borderRadius: 4 },
    legText:     { fontSize: 8, color: '#94a3b8' },
    row:         { flexDirection: 'row' as const, alignItems: 'flex-start' as const, marginBottom: 7, paddingBottom: 7, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    catBox:      { width: 88, marginRight: 10, paddingTop: 3 },
    catLabel:    { fontSize: 8.5, fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase' as const },
    tags:        { flex: 1, flexDirection: 'row' as const, flexWrap: 'wrap' as const },
    tag:         { fontSize: 8, color: '#94a3b8', backgroundColor: '#1e293b', padding: '3 6', borderRadius: 3, marginRight: 4, marginBottom: 4 },
    tagKey:      { fontSize: 8, color: accentColor, backgroundColor: '#0a1f2e', padding: '3 6', borderRadius: 3, marginRight: 4, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
    tagAdv:      { fontSize: 8, color: '#f87171', backgroundColor: '#1a0808', padding: '3 6', borderRadius: 3, marginRight: 4, marginBottom: 4, fontFamily: 'Helvetica-Bold' },
    checkRow:    { flexDirection: 'row' as const, alignItems: 'flex-start' as const, marginBottom: 7, paddingHorizontal: 4 },
    checkBox:    { width: 11, height: 11, borderWidth: 1, borderColor: '#475569', borderRadius: 2, marginRight: 8, marginTop: 1 },
    checkNum:    { fontSize: 9, color: '#475569', width: 22, fontFamily: 'Helvetica-Bold' },
    checkText:   { fontSize: 9.5, color: '#cbd5e1', flex: 1, lineHeight: 1.5 },
    sectionTitle:{ fontSize: 11, color: accentColor, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
    sectionDesc: { fontSize: 9, color: '#94a3b8', marginBottom: 14, lineHeight: 1.5 },
    footer:      { position: 'absolute' as const, bottom: 16, left: 28, right: 28, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const cover = await buildCoverPage({
    badge: 'Mind Map',
    title: coverTitle ?? `${skillName} do zero ao sênior em uma folha`,
    subtitle: coverSubtitle ?? `${categories.length} categorias do ecossistema ${skillName} e checklist de ${checklist.length} perguntas para auto-avaliar o domínio. Use para identificar gaps antes de uma entrevista.`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel,
  })

  const headerLabel = headerLeft ?? `${skillName} · Mind Map`
  const footerLabel = footerLeft ?? `${skillName} Mind Map · CareerStudy`

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{headerLabel}</Text>
          <Text style={s.headerR}>{categories.length} categorias · escala pleno → sênior</Text>
        </View>
        <Text style={s.sectionTitle}>{mapTitle}</Text>
        {mapDesc && <Text style={s.sectionDesc}>{mapDesc}</Text>}
        {!mapDesc && (
          <Text style={s.sectionDesc}>
            {`Ciano = essencial (pleno) · Cinza = importante · Vermelho = nível sênior`}
          </Text>
        )}
        <View style={s.legend}>
          <View style={s.legItem}><View style={[s.legDot, { backgroundColor: accentColor }]} /><Text style={s.legText}>{legendEssentialLabel}</Text></View>
          <View style={s.legItem}><View style={[s.legDot, { backgroundColor: '#475569' }]} /><Text style={s.legText}>{legendImportantLabel}</Text></View>
          <View style={s.legItem}><View style={[s.legDot, { backgroundColor: '#f87171' }]} /><Text style={s.legText}>{legendSeniorLabel}</Text></View>
        </View>
        {categories.map((cat, ci) => (
          <View key={ci} style={s.row}>
            <View style={s.catBox}>
              <Text style={[s.catLabel, { color: cat.color }]}>{cat.label}</Text>
            </View>
            <View style={s.tags}>
              {cat.items.map((item, ii) => (
                <Text key={ii} style={item.a ? s.tagAdv : item.k ? s.tagKey : s.tag}>{item.a ? '★ ' + item.t : item.t}</Text>
              ))}
            </View>
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{footerLabel}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{headerLabel}</Text>
          <Text style={s.headerR}>Checklist de entrevista</Text>
        </View>
        <Text style={s.sectionTitle}>{checklistTitle} — {checklist.length} perguntas</Text>
        <Text style={s.sectionDesc}>{checklistDesc}</Text>
        {checklist.map((q, i) => (
          <View key={i} style={s.checkRow}>
            <View style={s.checkBox} />
            <Text style={s.checkNum}>{String(i + 1).padStart(2, '0')}</Text>
            <Text style={s.checkText}>{q}</Text>
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{footerLabel}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
