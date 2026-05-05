/**
 * Catálogo de componentes genéricos de CareerStudy.
 *
 * Cada entrada descreve um componente reutilizável (visual ou PDF),
 * seus props principais e quais skills já o utilizam.
 *
 * Use este arquivo como índice de descoberta — importe os componentes
 * diretamente de seus módulos (não deste arquivo).
 */

// ── Tipos de catálogo ─────────────────────────────────────────────────────────

export type CatalogEntry = {
  /** Caminho relativo a src/components/ */
  module: string
  /** Descrição de uso e quando escolher este componente */
  description: string
  /** Props mínimos necessários (sem defaults) */
  props: string[]
  /** Slugs das skills que já instanciam este componente */
  usedBy: string[]
}

// ── Visuais ───────────────────────────────────────────────────────────────────

export const VISUAL_CATALOG: Record<string, CatalogEntry> = {
  VisuaisShell: {
    module: 'visuals/VisuaisShell',
    description:
      'Shell container que renderiza a barra de navegação lateral e o painel ativo. ' +
      'Todo arquivo *Visuais.tsx deve retornar este componente com um array de VisualDef.',
    props: [
      'visuals: VisualDef[]',
      'active: number',
      'onChange: (i: number) => void',
    ],
    usedBy: ['react'],
  },

  ConceptCarousel: {
    module: 'visuals/ConceptCarousel',
    description:
      'Carrossel de slides com ilustração ReactNode à direita e texto estruturado à esquerda. ' +
      'Ideal para introduzir fundamentos e conceitos encadeados com progressão visual.',
    props: [
      'slides: Slide[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react'],
  },

  TreeExplorer: {
    module: 'visuals/TreeExplorer',
    description:
      'Explorador de árvore interativa com seleção de nó, painel de detalhes e mapa de tipos. ' +
      'Use para visualizar hierarquias como a Fiber tree do React ou árvores DOM/AST.',
    props: [
      'tree: TreeNode',
      'typeMap: Record<string, TreeNodeTypeMeta>',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
      'card2Color: string',
    ],
    usedBy: ['react'],
  },

  ReRenderSimulator: {
    module: 'visuals/ReRenderSimulator',
    description:
      'Simulador de re-renders: seleciona cenário, clica para disparar, anima quais nós re-renderizam. ' +
      'Útil para demonstrar diferenças entre memo/useMemo/useCallback e prop drilling.',
    props: [
      'nodes: RRNode[]',
      'scenarios: Scenario[]',
      'accentColor: string',
      'fireColor: string',
      'safeColor: string',
      'bgColor: string',
      'card2Color: string',
    ],
    usedBy: ['react'],
  },

  HookTimeline: {
    module: 'visuals/HookTimeline',
    description:
      'Timeline horizontal de fases do ciclo de vida com código de exemplo por fase. ' +
      'Ideal para hooks lifecycle, pipeline de execução ou fases de build.',
    props: [
      'phases: TimelinePhase[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['react'],
  },

  CardCarousel: {
    module: 'visuals/CardCarousel',
    description:
      'Carrossel de cards com nome, assinatura, emoji, casos de uso e quando não usar. ' +
      'Ideal para comparar APIs similares (hooks, adapters, drivers) lado a lado.',
    props: [
      'cards: CarouselCard[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react'],
  },

  AntiPatternsGallery: {
    module: 'visuals/AntiPatternsGallery',
    description:
      'Galeria de anti-patterns com diff visual (errado x correto) e explicação técnica. ' +
      'Use para content de code review, boas práticas e armadilhas conhecidas.',
    props: [
      'patterns: AntiPattern[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react'],
  },

  PriorityPanel: {
    module: 'visuals/PriorityPanel',
    description:
      'Painel de prioridades com lista de conceitos agrupados por nível (essencial/importante/bônus). ' +
      'Use para planos de estudo, guias de foco pré-entrevista ou roadmaps.',
    props: [
      'priorities: Record<string, PriorityInfo>',
      'priorityOrder: string[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react'],
  },

  ProgressionMap: {
    module: 'visuals/ProgressionMap',
    description:
      'Mapa de progressão em 5 níveis (junior → especialista) com conceitos por nível e tooltip. ' +
      'Ideal para mostrar a jornada de domínio de uma tecnologia.',
    props: [
      'levels: ProgressionLevel[]',
      'accentColor: string',
      'bgColor: string',
    ],
    usedBy: ['react'],
  },

  FeaturesCarousel: {
    module: 'visuals/FeaturesCarousel',
    description:
      'Carrossel de features com diff before/after e descrição. ' +
      'Use para destacar novidades de versão, migrações ou comparações de API.',
    props: [
      'features: Feature[]',
      'accentColor: string',
      'bgColor: string',
      'cardColor: string',
    ],
    usedBy: ['react'],
  },
}

// ── PDFs ──────────────────────────────────────────────────────────────────────

export const PDF_CATALOG: Record<string, CatalogEntry> = {
  QAReviewPdf: {
    module: 'pdfs/QAReviewPdf',
    description:
      'PDF de Q&A para recuperação ativa. Cada pergunta tem nível (pleno/sênior), ' +
      'resposta em HTML rico, bullets opcionais e dica. Gera capa + páginas de perguntas.',
    props: [
      'qa: QAItem[]',
      'accentColor: string',
      'skillName: string',
      'stackLabel: string',
    ],
    usedBy: ['react'],
  },

  CheatsheetPdf: {
    module: 'pdfs/CheatsheetPdf',
    description:
      'PDF de cheatsheet denso com seções: hooks, dependency array, regras, patterns, ' +
      'performance tips e mental models. Estruturado para referência rápida pré-entrevista.',
    props: [
      'skillName: string',
      'accentColor: string',
      'stackLabel: string',
      'sections: { hooks, depRows, rules, performanceTips, patterns, mentalModels }',
    ],
    usedBy: ['react'],
  },

  MnemonicsPdf: {
    module: 'pdfs/MnemonicsPdf',
    description:
      'PDF de mnemônicos com cartões de memorização: sigla/truque verbal, expansão letra-a-letra, ' +
      'exemplo prático e âncora cognitiva. Ideal para regras com muitas variáveis.',
    props: [
      'mnemonics: MnemonicItem[]',
      'accentColor: string',
      'skillName: string',
      'stackLabel: string',
    ],
    usedBy: ['react'],
  },

  AntipatternsPdf: {
    module: 'pdfs/AntipatternsPdf',
    description:
      'PDF de anti-patterns com código errado x correto (tokens coloridos) e explicação técnica. ' +
      'Usa o formato CodeToken[] para highlight sem dependência de syntax highlighter.',
    props: [
      'antipatterns: AntiPatternItem[]',
      'accentColor: string',
      'skillName: string',
      'stackLabel: string',
    ],
    usedBy: ['react'],
  },

  MindmapPdf: {
    module: 'pdfs/MindmapPdf',
    description:
      'PDF de mind map com página de categorias (tags essencial/avançado/normal) e página de checklist. ' +
      'Visão panorâmica do ecossistema da skill para identificar gaps antes de entrevista.',
    props: [
      'categories: MindmapCategory[]',
      'checklist: string[]',
      'accentColor: string',
      'skillName: string',
      'stackLabel: string',
    ],
    usedBy: ['react'],
  },
}

// ── Re-exports seletivos (tipos apenas) ───────────────────────────────────────
// Não re-exportamos builders/componentes para evitar bundle desnecessário.
// Importe diretamente do módulo de cada componente.

export type { VisualDef } from './visuals/VisuaisNav'
export type { Slide } from './visuals/ConceptCarousel'
export type { TreeNode, TreeNodeTypeMeta } from './visuals/TreeExplorer'
export type { RRNode, Scenario } from './visuals/ReRenderSimulator'
export type { TimelinePhase } from './visuals/HookTimeline'
export type { CarouselCard } from './visuals/CardCarousel'
export type { AntiPattern } from './visuals/AntiPatternsGallery'
export type { PriorityInfo } from './visuals/PriorityPanel'
export type { ProgressionLevel } from './visuals/ProgressionMap'
export type { Feature } from './visuals/FeaturesCarousel'
export type { QAItem } from './pdfs/QAReviewPdf'
export type { HookItem, PatternItem, DepRow, RuleItem } from './pdfs/CheatsheetPdf'
export type { MnemonicItem } from './pdfs/MnemonicsPdf'
export type { AntiPatternItem, CodeToken } from './pdfs/AntipatternsPdf'
export type { MindmapCategory, MindmapCategoryItem } from './pdfs/MindmapPdf'
