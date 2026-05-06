'use client'
import { buildCoverPage } from './CoverPage'

// ── Types ────────────────────────────────────────────────────────────────────────

export type Recipe = {
  title: string
  goal: string
  ingredients?: string[]
  steps: Array<{
    title: string
    description: string
    code?: string
  }>
  variations?: string[]
  pitfalls?: string[]
  category?: string
}

export interface RecipeBookPdfOpts {
  recipes: Recipe[]
  skillName: string
  accentColor: string
  stackLabel: string
  coverTitle?: string
  coverSubtitle?: string
  date?: string
}

// ── Builder ────────────────────────────────────────────────────────────────────────

export async function buildRecipeBookPdf(opts: RecipeBookPdfOpts): Promise<React.ReactElement> {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')

  const {
    recipes,
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
    indexTitle:   { fontSize: 14, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 12 },
    indexRow:     { flexDirection: 'row' as const, justifyContent: 'space-between' as const, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    indexName:    { fontSize: 9, color: '#cbd5e1' },
    indexCat:     { fontSize: 9, color: '#475569' },
    recipeBlock:  { marginBottom: 20, padding: 14, backgroundColor: '#1e293b', borderRadius: 8 },
    recipeNum:    { fontSize: 8, color: '#475569', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4 },
    recipeTitle:  { fontSize: 14, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 6 },
    goalBox:      { padding: 8, backgroundColor: '#0a1628', borderLeftWidth: 3, borderLeftColor: accentColor, borderRadius: 3, marginBottom: 10 },
    goalText:     { fontSize: 9, color: accentColor, lineHeight: 1.5 },
    ingredLabel:  { fontSize: 7, color: '#64748b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4 },
    ingredRow:    { flexDirection: 'row' as const, marginBottom: 2, paddingLeft: 6 },
    ingredDot:    { fontSize: 9, color: accentColor, width: 10 },
    ingredText:   { fontSize: 8, color: '#94a3b8', flex: 1 },
    stepsLabel:   { fontSize: 7, color: '#64748b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6, marginTop: 8 },
    stepRow:      { flexDirection: 'row' as const, marginBottom: 8 },
    stepNum:      { width: 20, height: 20, borderRadius: 10, backgroundColor: accentColor, alignItems: 'center' as const, justifyContent: 'center' as const, marginRight: 8, flexShrink: 0 },
    stepNumText:  { fontSize: 8, color: '#fff', fontFamily: 'Helvetica-Bold' },
    stepContent:  { flex: 1 },
    stepTitle:    { fontSize: 9, color: '#e2e8f0', fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    stepDesc:     { fontSize: 8, color: '#94a3b8', lineHeight: 1.5, marginBottom: 4 },
    codeBlock:    { padding: 7, backgroundColor: '#0a1628', borderRadius: 3 },
    codeText:     { fontSize: 7.5, color: '#a3e635', fontFamily: 'Courier', lineHeight: 1.4 },
    pitfallBox:   { marginTop: 8, padding: 8, backgroundColor: '#2d1b08', borderLeftWidth: 3, borderLeftColor: '#f59e0b', borderRadius: 3 },
    pitfallLabel: { fontSize: 7, color: '#f59e0b', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' as const },
    pitfallRow:   { flexDirection: 'row' as const, marginBottom: 3 },
    pitfallDot:   { fontSize: 9, color: '#f59e0b', width: 10 },
    pitfallText:  { fontSize: 8, color: '#fcd34d', flex: 1, lineHeight: 1.45 },
    varBox:       { marginTop: 8, padding: 8, backgroundColor: '#0c2233', borderRadius: 3 },
    varLabel:     { fontSize: 7, color: '#38bdf8', fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' as const },
    varRow:       { flexDirection: 'row' as const, marginBottom: 2 },
    varDot:       { fontSize: 9, color: '#38bdf8', width: 10 },
    varText:      { fontSize: 8, color: '#7dd3fc', flex: 1 },
    footer:       { position: 'absolute' as const, bottom: 20, left: 36, right: 36, flexDirection: 'row' as const, justifyContent: 'space-between' as const, fontSize: 7, color: '#475569' },
  })

  const cover = await buildCoverPage({
    badge: 'Recipe Book',
    title: coverTitle ?? `${skillName} — Cookbook`,
    subtitle: coverSubtitle ?? `${recipes.length} receitas prontas para os casos de uso mais comuns. Cada receita inclui ingredientes, passos com código e armadilhas a evitar.`,
    accent: accentColor,
    date: today,
    stackLabel,
    levelLabel: `${recipes.length} receitas`,
  })

  return (
    <Document>
      {cover}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Cookbook</Text>
          <Text style={s.headerR}>{recipes.length} receitas</Text>
        </View>
        <Text style={s.indexTitle}>Índice de Receitas</Text>
        {recipes.map((r, i) => (
          <View key={i} style={s.indexRow}>
            <Text style={s.indexName}>{String(i + 1).padStart(2, '0')}. {r.title}</Text>
            <Text style={s.indexCat}>{r.category ?? ''}</Text>
          </View>
        ))}
      </Page>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.headerL}>{skillName} · Receitas</Text>
          <Text style={s.headerR}></Text>
        </View>
        {recipes.map((r, i) => (
          <View key={i} style={s.recipeBlock} wrap={false}>
            <Text style={s.recipeNum}>RECEITA {String(i + 1).padStart(2, '0')}{r.category ? ` · ${r.category.toUpperCase()}` : ''}</Text>
            <Text style={s.recipeTitle}>{r.title}</Text>
            <View style={s.goalBox}>
              <Text style={s.goalText}>{r.goal}</Text>
            </View>
            {r.ingredients && r.ingredients.length > 0 && (
              <View>
                <Text style={s.ingredLabel}>Ingredientes / Pré-requisitos</Text>
                {r.ingredients.map((ing, ii) => (
                  <View key={ii} style={s.ingredRow}>
                    <Text style={s.ingredDot}>›</Text>
                    <Text style={s.ingredText}>{ing}</Text>
                  </View>
                ))}
              </View>
            )}
            <Text style={s.stepsLabel}>Passos</Text>
            {r.steps.map((step, si) => (
              <View key={si} style={s.stepRow}>
                <View style={s.stepNum}>
                  <Text style={s.stepNumText}>{si + 1}</Text>
                </View>
                <View style={s.stepContent}>
                  <Text style={s.stepTitle}>{step.title}</Text>
                  <Text style={s.stepDesc}>{step.description}</Text>
                  {step.code && (
                    <View style={s.codeBlock}>
                      <Text style={s.codeText}>{step.code}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
            {r.pitfalls && r.pitfalls.length > 0 && (
              <View style={s.pitfallBox}>
                <Text style={s.pitfallLabel}>Armadilhas Comuns</Text>
                {r.pitfalls.map((p, pi) => (
                  <View key={pi} style={s.pitfallRow}>
                    <Text style={s.pitfallDot}>⚠</Text>
                    <Text style={s.pitfallText}>{p}</Text>
                  </View>
                ))}
              </View>
            )}
            {r.variations && r.variations.length > 0 && (
              <View style={s.varBox}>
                <Text style={s.varLabel}>Variações / Alternativas</Text>
                {r.variations.map((v, vi) => (
                  <View key={vi} style={s.varRow}>
                    <Text style={s.varDot}>›</Text>
                    <Text style={s.varText}>{v}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text>{skillName} · Recipe Book · CareerStudy</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  )
}
