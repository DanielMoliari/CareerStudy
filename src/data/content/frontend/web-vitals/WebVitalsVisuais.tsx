'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta Web Vitals ─────────────────────────────────────────────────────────
const C      = '#22c55e'   // verde — performance e bons scores
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const LCP    = '#4ade80'   // verde — LCP (loading)
const INP    = '#38bdf8'   // azul — INP (interactividade)
const CLS_C  = '#fb923c'   // laranja — CLS (estabilidade)
const RED    = '#ef4444'

void LINE; void FG; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — LCP vs INP vs CLS (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const CWV_OPTIONS: ComparisonOption[] = [
  { id: 'lcp', label: 'LCP', sublabel: 'Largest Contentful Paint', color: LCP },
  { id: 'inp', label: 'INP', sublabel: 'Interaction to Next Paint', color: INP },
  { id: 'cls', label: 'CLS', sublabel: 'Cumulative Layout Shift', color: CLS_C },
]

const CWV_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'measures',
    label: 'O que mede',
    category: 'Conceito',
    description: 'A experiência do usuário que cada métrica captura',
    values: {
      lcp: { rating: 'excellent', note: 'Velocidade de carregamento percebida — quando o conteúdo principal aparece' },
      inp: { rating: 'excellent', note: 'Responsividade a interações — latência do pior clique/toque da visita' },
      cls: { rating: 'excellent', note: 'Estabilidade visual — soma de shifts de layout inesperados' },
    },
  },
  {
    id: 'target',
    label: 'Meta (bom)',
    category: 'Limites',
    description: 'Valor ideal para ser considerado "bom" pelo Google',
    values: {
      lcp: { rating: 'good', note: '≤2.5 segundos' },
      inp: { rating: 'good', note: '≤200 ms (P98 da visita)' },
      cls: { rating: 'good', note: '≤0.1 (score adimensional)' },
    },
  },
  {
    id: 'main-cause',
    label: 'Causa principal',
    category: 'Diagnóstico',
    description: 'O problema mais frequente que causa regressão nessa métrica',
    values: {
      lcp: { rating: 'poor', note: 'Imagem hero sem preload + TTFB alto' },
      inp: { rating: 'fair', note: 'Long tasks (>50ms) bloqueando o main thread' },
      cls: { rating: 'fair', note: 'Imagens sem width/height + FOUT de fontes' },
    },
  },
  {
    id: 'fix',
    label: 'Fix principal',
    category: 'Diagnóstico',
    description: 'A correção mais impactante para cada métrica',
    values: {
      lcp: { rating: 'good', note: 'rel=preload + fetchpriority=high no LCP element' },
      inp: { rating: 'good', note: 'scheduler.yield() e useDeferredValue' },
      cls: { rating: 'good', note: 'font-display: optional + skeletons com tamanho fixo' },
    },
  },
  {
    id: 'tool-lab',
    label: 'Ferramenta de lab',
    category: 'Ferramentas',
    description: 'Como medir e depurar em ambiente controlado',
    values: {
      lcp: { rating: 'good', note: 'Lighthouse → LCP element screenshot + waterfall' },
      inp: { rating: 'fair', note: 'DevTools Performance → long tasks (INP não medível sem interação real)' },
      cls: { rating: 'good', note: 'DevTools Performance → Layout Shift regions' },
    },
  },
  {
    id: 'tool-field',
    label: 'Ferramenta de field',
    category: 'Ferramentas',
    description: 'Como monitorar em produção com usuários reais',
    values: {
      lcp: { rating: 'excellent', note: 'web-vitals library: onLCP() + Search Console' },
      inp: { rating: 'excellent', note: 'web-vitals library: onINP() — único lugar com P98 real' },
      cls: { rating: 'excellent', note: 'web-vitals library: onCLS() + Search Console' },
    },
  },
  {
    id: 'nextjs',
    label: 'Next.js automático',
    category: 'Ecossistema',
    description: 'O quanto o Next.js resolve automaticamente',
    values: {
      lcp: { rating: 'excellent', note: 'next/image priority → preload automático; WebP/AVIF automático' },
      inp: { rating: 'fair', note: 'RSC reduz JS; Partial Prerendering reduz hydration cost' },
      cls: { rating: 'excellent', note: 'next/image reserva espaço; next/font com size-adjust elimina FOUT' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Stack de medição Lab vs Field (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const MEASUREMENT_LAYERS: Layer[] = [
  {
    id: 'field-ranking',
    label: 'Google Ranking',
    sublabel: 'Usa Field Data',
    description: 'O Page Experience signal que o Google usa para ranking SEO é baseado exclusivamente em field data (CrUX) — não em Lighthouse. Ter 100 no Lighthouse não garante bons Core Web Vitals no Search Console.',
    color: LCP,
    icon: '🔍',
    examples: ['Search Console CWV report', 'PageSpeed Insights (aba Field Data)', 'CrUX BigQuery'],
  },
  {
    id: 'field-rum',
    label: 'Field Data — RUM',
    sublabel: 'Real User Monitoring',
    description: 'Dados reais coletados de usuários em produção. Inclui variação de dispositivos, conexões, geografias. É o que o Google usa para ranking. Necessário instrumentar para capturar seus próprios dados (não só o que o Google vê).',
    color: C,
    icon: '👥',
    examples: ['web-vitals library (onLCP, onINP, onCLS)', 'Vercel Speed Insights', 'Datadog RUM', 'GA4 com métricas customizadas'],
  },
  {
    id: 'ci',
    label: 'CI / CD Gate',
    sublabel: 'Lab data como budget',
    description: 'Lighthouse rodando em CI para prevenir regressões antes de chegar em produção. Bloqueia merge se métricas caem abaixo de threshold. Proxy para field data — não é igual, mas serve para detectar regressões óbvias.',
    color: INP,
    icon: '🚀',
    examples: ['@lhci/cli (Lighthouse CI)', 'Vercel Deploy checks', 'GitHub Actions + lhci autorun'],
  },
  {
    id: 'lab-debug',
    label: 'Lab Data — Debug',
    sublabel: 'Identificar causa raiz',
    description: 'Ferramentas de lab com condições controladas. Reproduzíveis, mas não representam produção. Use para identificar a causa raiz de um problema detectado em field data — nunca como única fonte de verdade para performance.',
    color: CLS_C,
    icon: '🔬',
    examples: ['Chrome DevTools Performance panel', 'Lighthouse (local)', 'WebPageTest', 'PageSpeed Insights (aba Lab)'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Jornada de aprendizado (ProgressionMap)
// ═══════════════════════════════════════════════════════════════════════════════

const CWV_LEVELS: ProgressionLevel[] = [
  {
    id: 'beginner',
    name: 'Iniciante',
    label: 'Nível 1',
    emoji: '🌱',
    concepts: [
      { name: 'Sabe o que são LCP, INP e CLS', tip: 'Loading, Interactivity, Stability — as 3 dimensões de UX' },
      { name: 'Conhece os limites "bom"', tip: 'LCP ≤2.5s, INP ≤200ms, CLS ≤0.1' },
      { name: 'Usa PageSpeed Insights', tip: 'pagespeed.web.dev — combina field + lab data por URL' },
      { name: 'Diferencia lab de field data', tip: 'Lab = controlado (Lighthouse); Field = usuários reais (CrUX)' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Nível 2',
    emoji: '⚡',
    concepts: [
      { name: 'Otimiza LCP com preload', tip: '<link rel=preload as=image> + fetchpriority=high no LCP element' },
      { name: 'Elimina CLS com dimensões', tip: 'width/height em imgs, font-display: optional, skeletons' },
      { name: 'Usa next/image e next/font', tip: 'priority prop = preload automático; next/font = zero FOUT' },
      { name: 'Instrumenta web-vitals library', tip: 'onLCP, onINP, onCLS callbacks + sendBeacon para analytics' },
      { name: 'Conhece TTFB como base do LCP', tip: 'TTFB alto torna qualquer preload ineficaz — CDN primeiro' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Nível 3',
    emoji: '🎯',
    concepts: [
      { name: 'Resolve INP com scheduler.yield()', tip: 'Cede main thread periodicamente em long tasks' },
      { name: 'Usa useDeferredValue para INP', tip: 'Input responde imediatamente; lista atualiza quando browser tem tempo' },
      { name: 'Configura LHCI no CI', tip: 'Bloqueia merge se Lighthouse regredir — performance budget como code gate' },
      { name: 'Entende CLS session windows', tip: 'CLS não soma todos shifts — usa a maior session window (≤5s, ≤1s entre shifts)' },
      { name: 'Conhece PPR e seu impacto em LCP', tip: 'Shell estático do CDN + streams dinâmicos = TTFB baixo + conteúdo progressivo' },
    ],
  },
  {
    id: 'expert',
    name: 'Expert',
    label: 'Nível 4',
    emoji: '🏆',
    concepts: [
      { name: 'Diagnostica com waterfall completo', tip: 'TTFB vs render-blocking vs late discovery do LCP — causa raiz exata' },
      { name: 'Entende CrUX e agrupamento de URLs', tip: 'URL level vs origin level — impacto de tráfego insuficiente em CrUX' },
      { name: 'TBT como proxy de INP em lab', tip: 'TBT <200ms em Lighthouse sugere INP bom em produção' },
      { name: 'size-adjust e zero CLS de fontes', tip: 'next/font injeta size-adjust CSS para fallback com mesmas métricas da fonte' },
      { name: 'fetchpriority=high vs preload', tip: 'preload = hint de descoberta; fetchpriority = prioridade de download. Use ambos.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Decision Tree para diagnóstico
// ═══════════════════════════════════════════════════════════════════════════════

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'Qual Core Web Vital está com problema no Search Console?',
  children: [
    { label: 'LCP alto (>2.5s)', nodeId: 'lcp-root', color: LCP },
    { label: 'INP alto (>200ms)', nodeId: 'inp-root', color: INP },
    { label: 'CLS alto (>0.1)', nodeId: 'cls-root', color: CLS_C },
  ],
  color: C,
  icon: '🔍',
}

const DT_NODES: Record<string, DTNode> = {
  'lcp-root': {
    id: 'lcp-root',
    question: 'O TTFB está alto (>600ms) no DevTools?',
    children: [
      { label: 'Sim, TTFB alto', nodeId: 'lcp-ttfb', color: RED },
      { label: 'Não, TTFB ok', nodeId: 'lcp-asset', color: LCP },
    ],
    color: LCP,
    icon: '⏱',
  },
  'lcp-ttfb': {
    id: 'lcp-ttfb',
    recommendation: 'Prioridade: reduzir TTFB',
    detail: 'CDN para assets estáticos, cache de resposta de API, edge rendering com Next.js Edge Runtime ou Vercel. TTFB alto torna qualquer preload de imagem ineficaz.',
    color: RED,
    icon: '🌐',
  },
  'lcp-asset': {
    id: 'lcp-asset',
    question: 'A imagem LCP tem rel=preload e fetchpriority=high?',
    children: [
      { label: 'Não tem preload', nodeId: 'lcp-fix-preload', color: LCP },
      { label: 'Tem preload, LCP ainda alto', nodeId: 'lcp-fix-format', color: CLS_C },
    ],
    color: LCP,
    icon: '🖼',
  },
  'lcp-fix-preload': {
    id: 'lcp-fix-preload',
    recommendation: 'Adicionar preload + fetchpriority=high',
    detail: 'Adicione <link rel="preload" as="image" href="hero.webp" fetchpriority="high"> no <head>. No Next.js: use <Image priority /> — injeta o preload automaticamente. Isso é o fix mais impactante para LCP.',
    color: LCP,
    icon: '🚀',
  },
  'lcp-fix-format': {
    id: 'lcp-fix-format',
    recommendation: 'Otimizar formato e tamanho da imagem',
    detail: 'Converter para WebP ou AVIF (3-5x menor que JPEG). Usar srcset para servir tamanho adequado por viewport. Verificar se há render-blocking CSS/JS no <head> antes da imagem. next/image resolve tudo isso automaticamente.',
    color: CLS_C,
    icon: '🗜',
  },
  'inp-root': {
    id: 'inp-root',
    question: 'A interação lenta é em um componente com lista grande?',
    children: [
      { label: 'Sim, lista grande', nodeId: 'inp-list', color: INP },
      { label: 'Não, outro componente', nodeId: 'inp-task', color: CLS_C },
    ],
    color: INP,
    icon: '⚡',
  },
  'inp-list': {
    id: 'inp-list',
    recommendation: 'Virtualização + useDeferredValue',
    detail: 'Usar @tanstack/virtual ou react-window para renderizar só os itens visíveis. Adicionar useDeferredValue no filtro/busca — input atualiza imediatamente, lista atualiza quando browser tem tempo. Combinar com debounce no input.',
    color: INP,
    icon: '📋',
  },
  'inp-task': {
    id: 'inp-task',
    question: 'Há long tasks (>50ms) visíveis no DevTools Performance?',
    children: [
      { label: 'Sim, long tasks', nodeId: 'inp-yield', color: RED },
      { label: 'Não, INP alto mesmo assim', nodeId: 'inp-render', color: INP },
    ],
    color: CLS_C,
    icon: '🔬',
  },
  'inp-yield': {
    id: 'inp-yield',
    recommendation: 'scheduler.yield() para ceder o main thread',
    detail: 'Quebrar a long task com await scheduler.yield() a cada ~50 iterações. Mover cálculos pesados para Web Worker. Code split para reduzir JS parseado no carregamento. TBT alto no Lighthouse é proxy para INP alto.',
    color: RED,
    icon: '🔀',
  },
  'inp-render': {
    id: 'inp-render',
    recommendation: 'Otimizar o rendering após interação',
    detail: 'Re-render de componente grande após interação causa INP alto mesmo sem long task. Usar React.memo, useMemo, useCallback para evitar re-renders desnecessários. Separar estado de UI (dropdown aberto) de estado de dados.',
    color: INP,
    icon: '⚛',
  },
  'cls-root': {
    id: 'cls-root',
    question: 'O CLS acontece durante carregamento ou em interações?',
    children: [
      { label: 'Durante carregamento', nodeId: 'cls-load', color: CLS_C },
      { label: 'Após interação do usuário', nodeId: 'cls-ok', color: LCP },
    ],
    color: CLS_C,
    icon: '📐',
  },
  'cls-load': {
    id: 'cls-load',
    question: 'Há imagens ou embeds sem dimensão definida?',
    children: [
      { label: 'Sim, sem dimensões', nodeId: 'cls-img', color: RED },
      { label: 'Não, dimensões ok', nodeId: 'cls-font', color: CLS_C },
    ],
    color: CLS_C,
    icon: '🖼',
  },
  'cls-img': {
    id: 'cls-img',
    recommendation: 'Adicionar width/height em todas as imagens',
    detail: 'Defina width e height explícito em todas as imagens (ou use aspect-ratio CSS). O browser reserva o espaço antes da imagem carregar — eliminando o shift. next/image faz isso automaticamente com width/height ou fill prop.',
    color: RED,
    icon: '📏',
  },
  'cls-font': {
    id: 'cls-font',
    recommendation: 'Corrigir FOUT com font-display: optional',
    detail: 'Trocar font-display: swap por optional — usa a fonte só se já estiver no cache, evitando FOUT (Flash of Unstyled Text). Next.js font usa size-adjust para fazer o fallback ter as mesmas métricas da fonte — zero reflow. Adicionar preload da fonte principal.',
    color: CLS_C,
    icon: '🔤',
  },
  'cls-ok': {
    id: 'cls-ok',
    recommendation: 'Shifts por interação não contam para CLS',
    detail: 'CLS só conta shifts não provocados pelo usuário. Se o shift acontece após um clique, scroll ou teclado, não impacta a métrica. Verifique se o shift é realmente inesperado pelo usuário. Se for um layout animation, use transform em vez de top/left.',
    color: LCP,
    icon: '✅',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function WebVitalsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'cwv-comparison',
      title: 'LCP vs INP vs CLS',
      subtitle: 'Comparação das 3 métricas: o que medem, causas, fixes e ferramentas',
      accent: C,
      component: (
        <ComparisonTable
          options={CWV_OPTIONS}
          criteria={CWV_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'measurement-stack',
      title: 'Lab vs Field Data',
      subtitle: 'A pilha de medição: do debug local ao ranking do Google',
      accent: C,
      component: (
        <LayerStack
          layers={MEASUREMENT_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          direction="top-down"
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada de Domínio',
      subtitle: 'Do "rodo Lighthouse" ao monitoramento avançado em produção',
      accent: C,
      component: (
        <ProgressionMap
          levels={CWV_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'diagnostic-tree',
      title: 'Diagnóstico Guiado',
      subtitle: 'Árvore de decisão: qual CWV está ruim e por onde começar',
      accent: C,
      component: (
        <DecisionTree
          root={DT_ROOT}
          nodes={DT_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
