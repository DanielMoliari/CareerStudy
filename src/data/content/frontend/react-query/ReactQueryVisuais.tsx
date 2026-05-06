'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'

// ── Paleta React Query ──────────────────────────────────────────────────────────
const C      = '#FF4154'   // react-query vermelho
const SEC    = '#d93040'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Máquina de estados de uma query
// Justificativa: o ciclo idle→loading→success→error→refetching é o coração da
// lib. A distinção entre isLoading e isFetching só faz sentido ao ver os
// estados e transições — texto não consegue transmitir isso com a mesma clareza.
// ═══════════════════════════════════════════════════════════════════════════════

const QUERY_STATES: SMState[] = [
  {
    id: 'idle',
    label: 'idle',
    description: 'Query desabilitada (enabled=false). Nenhum fetch foi iniciado. Aparece quando a query depende de um valor ainda não disponível.',
    color: FGMUTE,
    isInitial: true,
  },
  {
    id: 'loading',
    label: 'loading',
    description: 'Primeiro fetch — sem dado no cache. isLoading=true, isFetching=true. Exibir skeleton neste estado.',
    color: SKY,
  },
  {
    id: 'success',
    label: 'success',
    description: 'Dado disponível no cache. isSuccess=true, data contém o resultado. Pode ser fresh (dentro do staleTime) ou stale (pronto para background refetch).',
    color: GRN,
    isFinal: false,
  },
  {
    id: 'error',
    label: 'error',
    description: 'Fetch falhou após todas as retentativas. isError=true, error contém o erro. Dado anterior ainda disponível em cache se existia.',
    color: C,
    isFinal: false,
  },
  {
    id: 'refetching',
    label: 'refetching',
    description: 'Background refetch — dado stale sendo atualizado. isFetching=true MAS isLoading=false e data ainda disponível. NÃO esconder o dado durante refetch!',
    color: AMB,
  },
]

const QUERY_TRANSITIONS: SMTransition[] = [
  { from: 'idle',       to: 'loading',     event: 'enabled=true',             code: 'useQuery({ enabled: !!userId })' },
  { from: 'loading',    to: 'success',     event: 'queryFn resolve',          code: '{ data: posts, isSuccess: true }' },
  { from: 'loading',    to: 'error',       event: 'queryFn rejeita (x retry)', code: '{ isError: true, error: err }' },
  { from: 'success',    to: 'refetching',  event: 'stale + window focus',     code: 'isFetching=true, data=anterior' },
  { from: 'refetching', to: 'success',     event: 'refetch resolve',          code: '{ data: novo, isFetching: false }' },
  { from: 'refetching', to: 'error',       event: 'refetch falha',            code: 'data anterior preservado' },
  { from: 'error',      to: 'loading',     event: 'retry / refetch manual',   code: 'query.refetch()' },
  { from: 'success',    to: 'idle',        event: 'enabled → false',          code: 'useQuery({ enabled: false })' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Cache: fresh → stale → inactive → garbage collected
// Justificativa: staleTime vs gcTime é a confusão mais comum entre devs que
// começam a usar React Query. O visual interativo com painel de detalhes por
// fase torna o mental model concreto em menos de 2 minutos.
// ═══════════════════════════════════════════════════════════════════════════════

interface CachePhase {
  id: string
  label: string
  color: string
  icon: string
  duration: string
  config: string
  behavior: string
  tip: string
}

const CACHE_PHASES: CachePhase[] = [
  {
    id: 'fresh',
    label: 'Fresh',
    color: GRN,
    icon: '✅',
    duration: 'staleTime (padrão: 0ms)',
    config: 'staleTime: 60_000',
    behavior: 'Dado fresco — não há background refetch ao montar componente ou focar a janela. useQuery usa o cache diretamente.',
    tip: 'staleTime: Infinity = nunca refetch automático. Ideal para dados estáticos (config, países).',
  },
  {
    id: 'stale',
    label: 'Stale',
    color: AMB,
    icon: '⏳',
    duration: 'Até todos os observers desmontarem',
    config: 'staleTime expirou',
    behavior: 'Dado desatualizado — React Query faz background refetch na próxima montagem ou window focus. O dado stale ainda é exibido durante o refetch (stale-while-revalidate).',
    tip: 'Dado stale NÃO desaparece da tela. isFetching=true indica refetch em andamento enquanto data ainda está disponível.',
  },
  {
    id: 'inactive',
    label: 'Inactive',
    color: FGMUTE,
    icon: '💤',
    duration: 'Até gcTime expirar',
    config: 'gcTime: 5 * 60_000',
    behavior: 'Nenhum componente está observando esta query. Dado permanece em memória por gcTime. Se um componente montar antes de gcTime expirar, o dado antigo é exibido enquanto refetch ocorre.',
    tip: 'gcTime (antigo cacheTime) — por quanto tempo dados sem observers ficam em memória. Após gcTime, o próximo acesso começa do zero (loading state real).',
  },
  {
    id: 'garbage',
    label: 'Garbage Collected',
    color: C,
    icon: '🗑️',
    duration: 'Removido da memória',
    config: 'gcTime expirou sem observers',
    behavior: 'Dado removido da memória. O próximo acesso inicia um fetch do zero — sem dado antigo para exibir, isLoading=true novamente.',
    tip: 'queryClient.removeQueries() remove imediatamente. Útil após logout para limpar dados sensíveis do cache.',
  },
]

function CacheLifecycleVisual() {
  const [active, setActive] = useState(0)
  const phase = CACHE_PHASES[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* Timeline de fases */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, borderRadius: 10, overflow: 'hidden', border: `1px solid ${LINE}` }}>
        {CACHE_PHASES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setActive(i)}
            style={{
              flex: 1,
              padding: '14px 8px',
              background: active === i ? `${p.color}20` : CARD,
              border: 'none',
              borderRight: i < CACHE_PHASES.length - 1 ? `1px solid ${LINE}` : 'none',
              borderBottom: active === i ? `3px solid ${p.color}` : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all .2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 22 }}>{p.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: active === i ? p.color : FGMUTE }}>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Painel de detalhes */}
      <div style={{ background: CARD, borderRadius: 12, padding: 24, border: `1px solid ${phase.color}40`, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 32 }}>{phase.icon}</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: phase.color }}>{phase.label}</div>
            <div style={{ fontSize: 12, color: FGMUTE }}>Duração: {phase.duration}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ background: BG, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: C, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Config</div>
            <code style={{ fontSize: 12, color: GRN, fontFamily: "'JetBrains Mono', monospace" }}>{phase.config}</code>
          </div>
          <div style={{ background: BG, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 10, color: SKY, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Comportamento</div>
            <p style={{ fontSize: 12, color: FG, margin: 0, lineHeight: 1.6 }}>{phase.behavior}</p>
          </div>
        </div>

        <div style={{ background: `${AMB}15`, border: `1px solid ${AMB}40`, borderRadius: 8, padding: 14 }}>
          <span style={{ fontSize: 10, color: AMB, fontWeight: 700, marginRight: 8 }}>💡 DIC</span>
          <span style={{ fontSize: 12, color: FG }}>{phase.tip}</span>
        </div>
      </div>

      {/* Fluxo linear */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
        {CACHE_PHASES.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
              background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}60`,
            }}>{p.label}</div>
            {i < CACHE_PHASES.length - 1 && <span style={{ color: LINE, fontSize: 16 }}>→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Query keys hierárquicas
// Justificativa: o conceito de invalidação hierárquica (pai invalida filhos)
// é o ponto mais mal compreendido de React Query. Ver a árvore de chaves e
// clicar em cada nó para ver o que é invalidado não existe em texto.
// ═══════════════════════════════════════════════════════════════════════════════

interface KeyNode {
  key: (string | Record<string, unknown>)[]
  label: string
  description: string
  invalidates: string[]
  color: string
  example: string
}

const KEY_NODES: KeyNode[] = [
  {
    key: ['posts'],
    label: "['posts']",
    description: 'Raiz do domínio posts. Invalidar esta key afeta TUDO relacionado a posts — listas, detalhes, comentários.',
    invalidates: ["['posts']", "['posts', 'list']", "['posts', 'list', filters]", "['posts', id]", "['posts', id, 'comments']"],
    color: C,
    example: "postKeys.all() → queryClient.invalidateQueries({ queryKey: ['posts'] })",
  },
  {
    key: ['posts', 'list'],
    label: "['posts', 'list']",
    description: "Todas as listas de posts, independente dos filtros. Invalidar aqui afeta todos os ['posts', 'list', filters] mas NÃO os detalhes.",
    invalidates: ["['posts', 'list']", "['posts', 'list', { status: 'published' }]", "['posts', 'list', { page: 2 }]"],
    color: AMB,
    example: "postKeys.lists() → invalidar após criar/deletar post (reordena listas)",
  },
  {
    key: ['posts', 'list', { status: 'published' }],
    label: "['posts', 'list', filters]",
    description: 'Uma lista específica com filtros aplicados. Invalidar aqui afeta apenas esta combinação exata de filtros.',
    invalidates: ["['posts', 'list', { status: 'published' }]"],
    color: GRN,
    example: "postKeys.list({ status: 'published' }) → refetch só da lista filtrada",
  },
  {
    key: ['posts', 'abc123'],
    label: "['posts', id]",
    description: 'O detalhe de um post específico. Não é afetado por invalidação da lista — e vice-versa.',
    invalidates: ["['posts', 'abc123']", "['posts', 'abc123', 'comments']"],
    color: SKY,
    example: "postKeys.detail('abc123') → invalidar após editar aquele post específico",
  },
  {
    key: ['posts', 'abc123', 'comments'],
    label: "['posts', id, 'comments']",
    description: 'Comentários de um post específico. Leaf node — invalidar aqui só afeta estes comentários.',
    invalidates: ["['posts', 'abc123', 'comments']"],
    color: PRP,
    example: "postKeys.comments('abc123') → invalidar após adicionar comentário",
  },
]

function QueryKeysVisual() {
  const [active, setActive] = useState(0)
  const node = KEY_NODES[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Árvore visual */}
      <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${LINE}` }}>
        <div style={{ fontSize: 10, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14, fontWeight: 700 }}>
          Hierarquia de query keys — clique para explorar a invalidação
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {KEY_NODES.map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {/* Indentação visual */}
              <div style={{ width: i * 24, flexShrink: 0 }} />
              {i > 0 && (
                <div style={{ width: 20, height: 36, borderLeft: `2px solid ${LINE}`, borderBottom: `2px solid ${LINE}`, borderBottomLeftRadius: 6, marginBottom: 2, flexShrink: 0 }} />
              )}
              <button
                onClick={() => setActive(i)}
                style={{
                  flex: 1,
                  margin: '3px 0',
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: `1.5px solid ${active === i ? n.color : LINE}`,
                  background: active === i ? `${n.color}18` : BG,
                  color: active === i ? n.color : FG,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: active === i ? 700 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all .2s',
                }}
              >
                {n.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Painel de detalhes */}
      <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${node.color}40`, flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: node.color, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>
          {node.label}
        </div>
        <p style={{ fontSize: 13, color: FG, lineHeight: 1.6, margin: '0 0 16px' }}>{node.description}</p>

        <div style={{ background: BG, borderRadius: 8, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
            O que é invalidado quando você chama invalidateQueries com esta key:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {node.invalidates.map((k, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: GRN, fontSize: 12 }}>✓</span>
                <code style={{ fontSize: 12, color: GRN, fontFamily: "'JetBrains Mono', monospace" }}>{k}</code>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: `${AMB}15`, border: `1px solid ${AMB}40`, borderRadius: 8, padding: 12 }}>
          <span style={{ fontSize: 10, color: AMB, fontWeight: 700 }}>Caso de uso: </span>
          <code style={{ fontSize: 11, color: FG, fontFamily: "'JetBrains Mono', monospace" }}>{node.example}</code>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Estratégia de Invalidação (DecisionTree)
// Justificativa: após uma mutation, qual método chamar? invalidateQueries vs
// refetchQueries vs setQueryData vs setQueryData+add são opções que confundem.
// A árvore de decisão torna isso resolvível em segundos.
// ═══════════════════════════════════════════════════════════════════════════════

const INVALIDATION_ROOT: DTNode = {
  id: 'root',
  question: 'Após a mutation, o que você quer fazer com o cache?',
  children: [
    { label: 'Marcar como stale (refetch no próximo acesso)', nodeId: 'invalidate', color: GRN },
    { label: 'Forçar refetch imediato agora', nodeId: 'refetch', color: AMB },
    { label: 'Atualizar o cache manualmente (sem fetch)', nodeId: 'setdata', color: SKY },
    { label: 'Adicionar novo item sem refetch', nodeId: 'setdata-add', color: PRP },
  ],
}

const INVALIDATION_NODES: Record<string, DTNode> = {
  invalidate: {
    id: 'invalidate',
    question: 'Há componente ativo observando a query?',
    children: [
      { label: 'Sim — refetch imediato em background', nodeId: 'inv-active', color: GRN },
      { label: 'Não — refetch quando componente montar', nodeId: 'inv-inactive', color: FGMUTE },
    ],
  },
  'inv-active': {
    id: 'inv-active',
    recommendation: "invalidateQueries({ queryKey: ['posts'] })",
    detail: 'Marca como stale e dispara background refetch imediatamente. O componente continua exibindo dado antigo durante o refetch. Padrão para 95% das mutations.',
    color: GRN,
    icon: '✅',
  },
  'inv-inactive': {
    id: 'inv-inactive',
    recommendation: "invalidateQueries({ queryKey: ['posts'] })",
    detail: 'Marca como stale mas NÃO dispara fetch (sem observer). O refetch acontece quando o usuário navegar para a página que usa essa query. Mesmo comando — comportamento diferente.',
    color: FGMUTE,
    icon: '💤',
  },
  refetch: {
    id: 'refetch',
    recommendation: "refetchQueries({ queryKey: ['posts'] })",
    detail: 'Força fetch imediato mesmo sem observers ativos. Útil após logout (limpar dados sensíveis) ou ações críticas onde você precisa da confirmação do servidor imediatamente.',
    color: AMB,
    icon: '⚡',
  },
  setdata: {
    id: 'setdata',
    recommendation: "qc.setQueryData(['posts', id], updatedPost)",
    detail: 'Atualiza o cache sem fetch. Ideal quando a mutation retorna o objeto atualizado. Combina com invalidate no onSettled para consistência final.',
    color: SKY,
    icon: '📝',
  },
  'setdata-add': {
    id: 'setdata-add',
    recommendation: "qc.setQueryData(['posts'], old =&gt; [...old, newPost])",
    detail: 'Adiciona o novo item ao cache da lista sem refetch. O servidor retorna o novo objeto na response da mutation — você o injeta no cache. Combine com invalidate no onSettled.',
    color: PRP,
    icon: '➕',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Comparação React Query vs SWR vs Redux vs fetch
// Justificativa: a pergunta "por que não usar SWR ou RTK Query?" é cobrada em
// toda entrevista que menciona React Query. A tabela multi-critério torna a
// resposta defensável e mostra que o dev entende os trade-offs reais.
// ═══════════════════════════════════════════════════════════════════════════════

const CMP_OPTIONS: ComparisonOption[] = [
  { id: 'rq',    label: 'React Query',   sublabel: 'TanStack Query v5', color: C },
  { id: 'swr',   label: 'SWR',           sublabel: 'Vercel',            color: SKY },
  { id: 'redux', label: 'Redux Toolkit', sublabel: 'RTK Query',         color: PRP },
  { id: 'fetch', label: 'fetch puro',    sublabel: 'Server Component',  color: GRN },
]

const CMP_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'cache',
    label: 'Cache automático',
    category: 'Funcionalidades',
    description: 'Gerenciamento automático de cache com staleTime e gcTime',
    values: {
      rq:    { rating: 'excellent', note: 'staleTime, gcTime, background refetch' },
      swr:   { rating: 'good',      note: 'revalidation, dedupe, focusThrottleInterval' },
      redux: { rating: 'excellent', note: 'RTK Query tem cache semelhante ao React Query' },
      fetch: { rating: 'poor',      note: 'Sem cache de cliente — novo fetch a cada render' },
    },
  },
  {
    id: 'mutations',
    label: 'Mutations com callbacks',
    category: 'Funcionalidades',
    description: 'onMutate, onSuccess, onError, onSettled e optimistic updates',
    values: {
      rq:    { rating: 'excellent', note: 'useMutation com todos os callbacks e optimistic updates' },
      swr:   { rating: 'fair',      note: 'mutate() existe mas sem callbacks estruturados' },
      redux: { rating: 'excellent', note: 'RTK Query tem invalidatesTags para invalidação' },
      fetch: { rating: 'poor',      note: 'Implementar manualmente com useEffect' },
    },
  },
  {
    id: 'devex',
    label: 'DX e DevTools',
    category: 'Experiência',
    description: 'DevTools, TypeScript, documentação',
    values: {
      rq:    { rating: 'excellent', note: 'DevTools visuais, TS excelente, tkdodo blog' },
      swr:   { rating: 'good',      note: 'TypeScript ok, sem DevTools visuais próprios' },
      redux: { rating: 'good',      note: 'Redux DevTools maduros mas mais verboso' },
      fetch: { rating: 'excellent', note: 'Zero abstração — controle total' },
    },
  },
  {
    id: 'bundle',
    label: 'Bundle size',
    category: 'Performance',
    description: 'Impacto no bundle do cliente',
    values: {
      rq:    { rating: 'fair',      note: '~13KB gzipped — justificável pela DX' },
      swr:   { rating: 'excellent', note: '~4KB gzipped — muito leve' },
      redux: { rating: 'fair',      note: 'Redux + RTK + RTK Query ~15KB' },
      fetch: { rating: 'excellent', note: '0KB — nativo do browser' },
    },
  },
  {
    id: 'ssr',
    label: 'SSR / Next.js',
    category: 'Integração',
    description: 'Suporte a Server-Side Rendering com hidratação do cache',
    values: {
      rq:    { rating: 'excellent', note: 'dehydrate + HydrationBoundary, prefetchQuery em Server Components' },
      swr:   { rating: 'good',      note: 'fallback prop para SSR, menos ergonômico' },
      redux: { rating: 'good',      note: 'Possível mas requer setup mais complexo' },
      fetch: { rating: 'excellent', note: 'É exatamente o caso de uso do Server Component' },
    },
  },
  {
    id: 'infinite',
    label: 'Scroll infinito',
    category: 'Funcionalidades',
    description: 'Suporte nativo a paginação infinita',
    values: {
      rq:    { rating: 'excellent', note: 'useInfiniteQuery com getNextPageParam' },
      swr:   { rating: 'good',      note: 'useSWRInfinite — funciona bem' },
      redux: { rating: 'fair',      note: 'Implementar manualmente com RTK Query' },
      fetch: { rating: 'poor',      note: 'Tudo manual com useState + useEffect' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Optimistic update com useMutation (CodeStepper)
// Justificativa: o fluxo onMutate → cancelQueries → setQueryData → onError
// rollback → onSettled é contra-intuitivo. Ver cada linha executar com o estado
// do cache visível é a forma mais clara de aprender esse padrão.
// ═══════════════════════════════════════════════════════════════════════════════

const OPTIMISTIC_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'optimistic',
    label: 'Optimistic Update — Curtir post',
    code: `const toggleLike = useMutation({
  mutationFn: (postId) => api.posts.toggleLike(postId),

  onMutate: async (postId) => {
    await qc.cancelQueries({ queryKey: ['posts'] })
    const prev = qc.getQueryData(['posts'])
    qc.setQueryData(['posts'], (old) =>
      old?.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked }
          : p
      )
    )
    return { prev }
  },

  onError: (_err, _vars, ctx) => {
    if (ctx?.prev) qc.setQueryData(['posts'], ctx.prev)
    toast.error('Erro ao curtir. Tente novamente.')
  },

  onSettled: () => {
    qc.invalidateQueries({ queryKey: ['posts'] })
  },
})`,
    language: 'typescript',
    steps: [
      {
        lineStart: 1,
        lineEnd: 1,
        title: 'Declarar mutation',
        explanation: 'useMutation recebe mutationFn (a request real) e callbacks de ciclo de vida. O resultado é um objeto com .mutate() e .mutateAsync().',
      },
      {
        lineStart: 3,
        lineEnd: 3,
        title: 'onMutate — antes do fetch',
        explanation: 'onMutate executa ANTES de qualquer request. É aqui que implementamos o otimismo. Recebe as mesmas variáveis que mutationFn.',
      },
      {
        lineStart: 4,
        lineEnd: 4,
        title: 'Cancelar queries em andamento',
        explanation: 'cancelQueries() interrompe qualquer refetch em flight que poderia sobrescrever o update otimista. Essencial — sem isso o otimismo pode ser revertido por uma resposta em andamento.',
        output: 'Queries canceladas: ["posts"]',
      },
      {
        lineStart: 5,
        lineEnd: 5,
        title: 'Salvar estado anterior',
        explanation: 'getQueryData() lê o cache atual sem disparar fetch. Guardamos o estado anterior para rollback caso o servidor retorne erro.',
        memory: { prev: 'Post[] com liked=false' },
      },
      {
        lineStart: 6,
        lineEnd: 11,
        title: 'Aplicar update otimista',
        explanation: 'setQueryData() atualiza o cache IMEDIATAMENTE — a UI reflete o novo estado sem esperar o servidor. O usuário vê o post curtido instantaneamente.',
        output: 'Cache atualizado: post.liked = true ✅',
      },
      {
        lineStart: 12,
        lineEnd: 12,
        title: 'Retornar contexto',
        explanation: 'O valor retornado por onMutate é passado como ctx para onError e onSettled. É o mecanismo que conecta o estado anterior ao rollback.',
        memory: { ctx: '{ prev: Post[] com liked=false }' },
      },
      {
        lineStart: 15,
        lineEnd: 18,
        title: 'onError — rollback automático',
        explanation: 'Se o servidor retornar erro, usamos ctx.prev para restaurar o estado anterior. O rollback é automático e seguro — o usuário vê a UI voltar ao estado correto.',
        output: 'Rollback: cache restaurado ao estado anterior',
      },
      {
        lineStart: 20,
        lineEnd: 22,
        title: 'onSettled — consistência final',
        explanation: 'onSettled executa SEMPRE (sucesso ou erro). invalidateQueries garante que o cache reflete o estado real do servidor — seja após sucesso ou após rollback.',
        output: 'invalidateQueries(["posts"]) → refetch agendado',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns
// Justificativa: queryKey instável, isLoading durante refetch e onSettled
// esquecido são os erros mais caros em produção. O diff visual errado × correto
// cria reconhecimento de padrão que texto isolado não consegue.
// ═══════════════════════════════════════════════════════════════════════════════

const RQ_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'queryKey instável — objeto criado inline',
    wrong: [
      [{ text: 'useQuery({', color: FG }],
      [{ text: '  queryKey: ', color: FG }, { text: "[{ userId, page }]", color: C }],
      [{ text: '  // objeto criado a cada render = key diferente a cada render', color: FGMUTE }],
      [{ text: '  queryFn: () => fetchPosts(userId, page)', color: FGMUTE }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: 'useQuery({', color: FG }],
      [{ text: '  queryKey: ', color: FG }, { text: "['posts', userId, page]", color: GRN }],
      [{ text: '  // primitivos — React Query compara por valor', color: FGMUTE }],
      [{ text: '  queryFn: () => fetchPosts(userId, page)', color: FGMUTE }],
      [{ text: '})', color: FG }],
    ],
    why: 'Objetos inline são criados novos a cada render — React Query não os considera iguais e dispara refetch desnecessário. Use apenas primitivos na queryKey.',
  },
  {
    title: 'Fetch dentro de useEffect em vez de useQuery',
    wrong: [
      [{ text: 'const [data, setData] = useState(null)', color: FG }],
      [{ text: 'const [loading, setLoading] = useState(false)', color: FG }],
      [{ text: 'useEffect(() => {', color: C }],
      [{ text: "  fetch('/api/posts').then(r => r.json()).then(d => {", color: FGMUTE }],
      [{ text: '    setData(d)', color: FGMUTE }],
      [{ text: '  })', color: FGMUTE }],
      [{ text: '}, [userId])', color: C }],
    ],
    right: [
      [{ text: 'const { data, isLoading } = useQuery({', color: FG }],
      [{ text: '  queryKey: ', color: FG }, { text: "['posts', userId]", color: GRN }],
      [{ text: "  queryFn: () => fetch('/api/posts').then(r => r.json()),", color: FGMUTE }],
      [{ text: '  staleTime: 60_000,', color: GRN }],
      [{ text: '})', color: FG }],
    ],
    why: 'useEffect para fetch é boilerplate sem cache, sem deduplicação, sem background refetch e sem retry automático. React Query resolve tudo isso com menos código.',
  },
  {
    title: 'Usar isLoading para esconder dados durante refetch',
    wrong: [
      [{ text: 'const { data, isLoading } = useQuery(...)', color: FG }],
      [{ text: 'if (isLoading) return <Skeleton />', color: C }],
      [{ text: '// Skeleton aparece durante background refetch', color: C }],
      [{ text: '// UX quebrada: dados somem momentaneamente', color: C }],
    ],
    right: [
      [{ text: 'const { data, isLoading, isFetching } = useQuery(...)', color: FG }],
      [{ text: 'if (isLoading) return <Skeleton />', color: GRN }],
      [{ text: '// isLoading só é true na PRIMEIRA busca', color: GRN }],
      [{ text: '{isFetching && <span>Atualizando...</span>}', color: GRN }],
      [{ text: '// indicador sutil durante background refetch', color: GRN }],
    ],
    why: 'isLoading = true apenas na primeira busca (sem dado em cache). isFetching = true sempre que há fetch em andamento. Use isFetching para indicadores sutis sem esconder dados.',
  },
  {
    title: 'Omitir onSettled no optimistic update',
    wrong: [
      [{ text: 'useMutation({', color: FG }],
      [{ text: '  mutationFn: toggleLike,', color: FGMUTE }],
      [{ text: '  onMutate: async () => { /* update otimista */ },', color: C }],
      [{ text: '  onError: (_, __, ctx) => { /* rollback */ },', color: C }],
      [{ text: '  // sem onSettled — cache pode ficar inconsistente', color: C }],
      [{ text: '})', color: FG }],
    ],
    right: [
      [{ text: 'useMutation({', color: FG }],
      [{ text: '  mutationFn: toggleLike,', color: FGMUTE }],
      [{ text: '  onMutate: async () => { /* update otimista */ },', color: GRN }],
      [{ text: '  onError: (_, __, ctx) => { /* rollback */ },', color: GRN }],
      [{ text: '  onSettled: () => {', color: GRN }],
      [{ text: "    qc.invalidateQueries({ queryKey: ['posts'] })", color: GRN }],
      [{ text: '  },', color: GRN }],
      [{ text: '})', color: FG }],
    ],
    why: 'onSettled garante que o cache reflita o estado real do servidor após qualquer resultado (sucesso ou erro). Sem ele, o cache pode ficar com dado otimista incorreto após erro parcial.',
  },
  {
    title: 'Invalidar chave errada (ou muito específica)',
    wrong: [
      [{ text: 'onSuccess: () => {', color: FG }],
      [{ text: "  qc.invalidateQueries({ queryKey: ['posts', 'list'] })", color: C }],
      [{ text: '  // não invalida detail pages, comments, etc', color: C }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: 'onSuccess: () => {', color: FG }],
      [{ text: "  qc.invalidateQueries({ queryKey: postKeys.all() })", color: GRN }],
      [{ text: "  // invalida TODO o domínio posts:", color: GRN }],
      [{ text: "  // ['posts'], ['posts','list'], ['posts', id], etc", color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: "A invalidação é hierárquica — usar postKeys.all() invalida todos os filhos. Invalidar só a lista não atualiza as detail pages. Use query factories para evitar magic strings.",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — SSR com Next.js App Router (SequenceDiagram)
// Justificativa: o padrão prefetchQuery → dehydrate → HydrationBoundary é mal
// compreendido porque envolve atores diferentes (Server Component, Client
// Component, QueryClient) em momentos distintos. A sequência de mensagens
// torna o fluxo inequívoco.
// ═══════════════════════════════════════════════════════════════════════════════

const SSR_ACTORS: SeqActor[] = [
  { id: 'server',    label: 'Server Component', color: GRN,  icon: '🖥️' },
  { id: 'qcserver',  label: 'QueryClient (server)', color: AMB, icon: '🗄️' },
  { id: 'boundary',  label: 'HydrationBoundary', color: SKY,  icon: '🌉' },
  { id: 'qcclient',  label: 'QueryClient (client)', color: PRP, icon: '💾' },
  { id: 'component', label: 'Client Component', color: C,    icon: '⚛️' },
]

const SSR_MESSAGES: SeqMessage[] = [
  { from: 'server',    to: 'qcserver',  label: 'new QueryClient()',                        type: 'create',  note: 'Instância isolada por request' },
  { from: 'server',    to: 'qcserver',  label: 'prefetchQuery({ queryKey, queryFn })',      type: 'sync',    note: 'Fetch acontece no servidor' },
  { from: 'qcserver',  to: 'server',    label: 'data populado no cache',                   type: 'return',  note: 'Aguarda promise resolver' },
  { from: 'server',    to: 'boundary',  label: 'dehydrate(qc) → state serializado',         type: 'sync',    note: 'Serializa o cache como JSON' },
  { from: 'boundary',  to: 'qcclient',  label: 'hydrateClient(state)',                      type: 'sync',    note: 'Injeta dados no QueryClient do cliente' },
  { from: 'component', to: 'qcclient',  label: "useQuery({ queryKey: ['posts'] })",          type: 'sync',    note: 'Consulta o cache local' },
  { from: 'qcclient',  to: 'component', label: '{ data: posts, isLoading: false }',          type: 'return',  note: 'Dado já disponível — sem loading state!' },
]

const SSR_GROUPS: SeqGroup[] = [
  { label: 'Server (Node.js)',   kind: 'alt',  fromMsg: 0, toMsg: 3 },
  { label: 'Cliente (Browser)',  kind: 'alt',  fromMsg: 4, toMsg: 6 },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — useInfiniteQuery + queries dependentes (CodeStepper)
// Justificativa: useInfiniteQuery tem um modelo mental próprio (pages[], cursor,
// getNextPageParam) que texto não transmite tão claramente quanto ver cada linha
// executar com o estado das páginas visível. Queries dependentes com enabled={!!id}
// também confundem — ver o "por que a query não dispara" junto com a solução é
// o ponto de virada para quem está aprendendo.
// ═══════════════════════════════════════════════════════════════════════════════

const ADVANCED_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'infinite-query',
    label: 'useInfiniteQuery — scroll infinito com cursor',
    code: `const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = useInfiniteQuery({
  queryKey: ['posts', 'infinite'],
  queryFn: ({ pageParam }) =&gt;
    fetch(\`/api/posts?cursor=\${pageParam ?? ''}&limit=20\`)
      .then(r =&gt; r.json()),
  initialPageParam: null,
  getNextPageParam: (lastPage) =&gt; lastPage.nextCursor,
})

// data.pages é array de páginas — flat para um único array:
const allPosts = data?.pages.flatMap(p =&gt; p.items) ?? []

// Sentinel com IntersectionObserver:
const ref = useRef(null)
useEffect(() =&gt; {
  const observer = new IntersectionObserver(
    ([e]) =&gt; { if (e.isIntersecting && hasNextPage) fetchNextPage() }
  )
  if (ref.current) observer.observe(ref.current)
  return () =&gt; observer.disconnect()
}, [hasNextPage, fetchNextPage])`,
    language: 'typescript',
    steps: [
      {
        lineStart: 1,
        lineEnd: 6,
        title: 'Retornos do useInfiniteQuery',
        explanation: 'Além de data e isLoading, useInfiniteQuery retorna: fetchNextPage() para buscar a próxima página, hasNextPage (true enquanto getNextPageParam retorna valor), e isFetchingNextPage para loading granular da próxima página.',
      },
      {
        lineStart: 7,
        lineEnd: 9,
        title: 'queryKey e queryFn com pageParam',
        explanation: 'A queryFn recebe { pageParam } — o valor retornado por getNextPageParam da página anterior. Na primeira chamada, pageParam é o valor de initialPageParam (null aqui, indicando "começo").',
        memory: { pageParam: 'null (primeira página)', cursor: 'ausente na URL → começa do início' },
      },
      {
        lineStart: 10,
        lineEnd: 11,
        title: 'initialPageParam e getNextPageParam',
        explanation: 'initialPageParam define o pageParam da primeira requisição. getNextPageParam recebe a última página retornada e deve retornar o cursor da próxima — ou undefined quando não há mais páginas. hasNextPage é true enquanto isso não for undefined.',
        output: 'Página 1 retorna: { items: [...20 posts], nextCursor: "abc123" }',
        memory: { hasNextPage: 'true (nextCursor existe)', 'data.pages': '[page1]' },
      },
      {
        lineStart: 16,
        lineEnd: 16,
        title: 'data.pages — flatten para renderizar',
        explanation: 'data.pages é um array de TODAS as páginas carregadas. Cada página é a resposta do servidor. flatMap(p => p.items) transforma [page1, page2, ...] em um único array de posts para renderizar.',
        output: 'data.pages = [{ items: [...20] }, { items: [...20] }] → allPosts = [...40 posts]',
      },
      {
        lineStart: 19,
        lineEnd: 25,
        title: 'IntersectionObserver — fetch ao scrollar',
        explanation: 'O sentinel div (ref) fica logo abaixo da última lista. Quando entra no viewport (isIntersecting), fetchNextPage() busca a próxima página se hasNextPage for true. Cleanup deregistra o observer ao desmontar.',
        output: 'Usuário scrollou até o fim → fetchNextPage() → isFetchingNextPage=true → nova página adicionada a data.pages',
      },
    ],
  },
  {
    id: 'dependent-query',
    label: 'Queries dependentes com enabled',
    code: `// Cenário: buscar o perfil do usuário, depois seus posts
const {
  data: user,
  isLoading: userLoading,
} = useQuery({
  queryKey: ['user', 'me'],
  queryFn: fetchCurrentUser,
})

// Esta query SÓ roda quando user?.id existe:
const {
  data: posts,
  isLoading: postsLoading,
} = useQuery({
  queryKey: ['posts', { userId: user?.id }],
  queryFn: () =&gt; fetchUserPosts(user!.id),
  enabled: !!user?.id,  // false = pausada, não dispara
})

// Transformar dado com select (memorizado):
const { data: postTitles } = useQuery({
  queryKey: ['posts', { userId: user?.id }],
  queryFn: () =&gt; fetchUserPosts(user!.id),
  enabled: !!user?.id,
  select: useCallback(
    (posts) =&gt; posts.map(p =&gt; ({ id: p.id, title: p.title })),
    []  // função estável — re-render só se result mudar
  ),
})`,
    language: 'typescript',
    steps: [
      {
        lineStart: 1,
        lineEnd: 7,
        title: 'Primeira query — busca o usuário',
        explanation: 'A query do usuário roda normalmente. Enquanto executa: isLoading=true, data=undefined. Após sucesso: data contém o objeto user com user.id disponível.',
        memory: { user: 'undefined → { id: "abc", name: "..." }' },
      },
      {
        lineStart: 9,
        lineEnd: 18,
        title: 'Query dependente — enabled={!!user?.id}',
        explanation: 'enabled={false} pausa a query completamente — não dispara, não aparece em loading. Enquanto user?.id é undefined (user ainda carregando), a query de posts está pausada. Quando user.id aparece, enabled vira true e a query dispara automaticamente.',
        output: 'user.id = undefined → posts query status: "pending" (não "loading")\nuser.id = "abc" → posts query status: "loading" → "success"',
        memory: { enabled: '!!undefined = false → !!\"abc\" = true' },
      },
      {
        lineStart: 20,
        lineEnd: 29,
        title: 'select — transformar dado com memoização',
        explanation: 'select recebe o dado bruto e retorna um valor derivado. O componente só re-renderiza se o valor derivado mudar. Envolver em useCallback com [] garante que a função é estável entre renders — sem ela, React Query recalcula select a cada render desnecessariamente.',
        output: 'Re-render só ocorre se postTitles (array de { id, title }) mudar — não quando outros campos do post mudam',
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ReactQueryVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'query-lifecycle',
      title: 'Ciclo de vida de uma Query',
      subtitle: 'Estados idle → loading → success → error → refetching e suas transições',
      accent: C,
      component: (
        <StateMachineExplorer
          states={QUERY_STATES}
          transitions={QUERY_TRANSITIONS}
          initialState='idle'
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'cache-lifecycle',
      title: 'Cache: Fresh → Stale → GC',
      subtitle: 'staleTime vs gcTime — quando refetch ocorre e quando o dado some da memória',
      accent: AMB,
      component: <CacheLifecycleVisual />,
    },
    {
      id: 'query-keys',
      title: 'Query Keys Hierárquicas',
      subtitle: "Invalidar ['posts'] cascateia para todos os filhos — entenda a árvore",
      accent: SKY,
      component: <QueryKeysVisual />,
    },
    {
      id: 'invalidation-strategy',
      title: 'Estratégia de Invalidação',
      subtitle: 'Qual método do QueryClient usar após uma mutation?',
      accent: GRN,
      component: (
        <DecisionTree
          root={INVALIDATION_ROOT}
          nodes={INVALIDATION_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'comparison',
      title: 'React Query vs SWR vs Redux vs fetch',
      subtitle: 'Comparação técnica para escolher a ferramenta certa',
      accent: PRP,
      component: (
        <ComparisonTable
          options={CMP_OPTIONS}
          criteria={CMP_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'optimistic-update',
      title: 'Optimistic Update passo a passo',
      subtitle: 'onMutate → update otimista → onError rollback → onSettled consistência',
      accent: SEC,
      component: (
        <CodeStepper
          scenarios={OPTIMISTIC_SCENARIOS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns do React Query',
      subtitle: 'Erros comuns de queryKey, isLoading, invalidação e optimistic updates',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={RQ_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'ssr-nextjs',
      title: 'SSR com Next.js App Router',
      subtitle: 'prefetchQuery → dehydrate → HydrationBoundary — zero loading state inicial',
      accent: GRN,
      component: (
        <SequenceDiagram
          actors={SSR_ACTORS}
          messages={SSR_MESSAGES}
          groups={SSR_GROUPS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'infinite-dependent',
      title: 'useInfiniteQuery & Queries Dependentes',
      subtitle: 'Scroll infinito com cursor, getNextPageParam, enabled e select memoizado',
      accent: PRP,
      component: (
        <CodeStepper
          scenarios={ADVANCED_SCENARIOS}
          accentColor={C}
          bgColor={BG}
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
