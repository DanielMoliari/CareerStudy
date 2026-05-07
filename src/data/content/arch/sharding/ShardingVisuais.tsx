'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisShell'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'

// ── Paleta Sharding (amber) ───────────────────────────────────────────────────
const C      = '#f59e0b'   // amber — cor primária do tema sharding
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Consistent Hash Ring Interativo
// Por que visual: o anel circular com vnodes é genuinamente difícil de entender
// em texto. Ver as chaves sendo roteadas no sentido horário + o impacto mínimo
// de adicionar um nó ensina o conceito melhor que qualquer parágrafo.
// ═══════════════════════════════════════════════════════════════════════════════

function ConsistentHashRingVisual() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showNewNode, setShowNewNode] = useState(false)

  const CX = 200
  const CY = 200
  const R = 140

  // Nós fixos no anel (ângulos em graus)
  const nodes = [
    { id: 'A', angle: 0,   color: '#3b82f6', label: 'Shard A' },
    { id: 'B', angle: 120, color: '#8b5cf6', label: 'Shard B' },
    { id: 'C', angle: 240, color: '#10b981', label: 'Shard C' },
  ]

  const newNode = { id: 'D', angle: 60, color: C, label: 'Shard D (novo)' }

  const allNodes = showNewNode ? [...nodes, newNode] : nodes

  // Chaves estáticas no anel
  const keys = [
    { id: 'k1', angle: 30,  label: 'user:123' },
    { id: 'k2', angle: 90,  label: 'post:456' },
    { id: 'k3', angle: 170, label: 'sess:789' },
    { id: 'k4', angle: 210, label: 'img:001' },
    { id: 'k5', angle: 290, label: 'cfg:X' },
    { id: 'k6', angle: 330, label: 'order:9' },
  ]

  function anglePt(deg: number, radius = R) {
    const rad = (deg - 90) * (Math.PI / 180)
    return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) }
  }

  // Dado o ângulo de uma chave, encontra o próximo nó no sentido horário
  function getOwner(keyAngle: number) {
    const sorted = [...allNodes].sort((a, b) => a.angle - b.angle)
    const next = sorted.find(n => n.angle > keyAngle) ?? sorted[0]
    return next
  }

  const selectedInfo = selectedNode
    ? allNodes.find(n => n.id === selectedNode)
    : null

  const ownedKeys = selectedNode
    ? keys.filter(k => getOwner(k.angle).id === selectedNode)
    : []

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: 24 }}>
      {/* Anel SVG */}
      <div style={{ flex: '0 0 420px' }}>
        <svg width={400} height={400} viewBox="0 0 400 400">
          {/* Anel */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={LINE} strokeWidth={2} />

          {/* Linhas de roteamento das chaves */}
          {keys.map(k => {
            const owner = getOwner(k.angle)
            const kp = anglePt(k.angle, R)
            const np = anglePt(owner.angle, R - 20)
            const isHighlighted = selectedNode === owner.id
            return (
              <line
                key={k.id}
                x1={kp.x} y1={kp.y} x2={np.x} y2={np.y}
                stroke={isHighlighted ? owner.color : LINE}
                strokeWidth={isHighlighted ? 1.5 : 0.8}
                strokeDasharray="4 3"
                opacity={selectedNode && !isHighlighted ? 0.2 : 0.7}
              />
            )
          })}

          {/* Chaves no anel */}
          {keys.map(k => {
            const p = anglePt(k.angle)
            const owner = getOwner(k.angle)
            const isHighlighted = selectedNode === owner.id
            return (
              <g key={k.id}>
                <circle
                  cx={p.x} cy={p.y} r={7}
                  fill={isHighlighted ? owner.color : '#475569'}
                  opacity={selectedNode && !isHighlighted ? 0.3 : 1}
                />
                <text
                  x={p.x + (p.x > CX ? 12 : -12)} y={p.y + 4}
                  textAnchor={p.x > CX ? 'start' : 'end'}
                  fontSize={9} fill={isHighlighted ? owner.color : FGMUTE}
                  opacity={selectedNode && !isHighlighted ? 0.4 : 1}
                >
                  {k.label}
                </text>
              </g>
            )
          })}

          {/* Nós do anel */}
          {allNodes.map(n => {
            const p = anglePt(n.angle)
            const isSelected = selectedNode === n.id
            const isNew = n.id === 'D'
            return (
              <g
                key={n.id}
                onClick={() => setSelectedNode(selectedNode === n.id ? null : n.id)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={p.x} cy={p.y} r={isSelected ? 20 : 16}
                  fill={n.color}
                  stroke={isSelected ? '#fff' : 'none'}
                  strokeWidth={isSelected ? 2.5 : 0}
                  opacity={selectedNode && !isSelected ? 0.5 : 1}
                />
                {isNew && (
                  <circle cx={p.x} cy={p.y} r={22} fill="none" stroke={C} strokeWidth={1.5} strokeDasharray="3 2" />
                )}
                <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fontSize={10} fontWeight="700" fill="white">
                  {n.id}
                </text>
                <text
                  x={p.x + (p.x > CX ? 26 : -26)} y={p.y + 4}
                  textAnchor={p.x > CX ? 'start' : 'end'}
                  fontSize={9} fill={n.id === 'D' ? C : FG}
                  fontWeight={isSelected ? '700' : '400'}
                >
                  {n.label}
                </text>
              </g>
            )
          })}

          {/* Centro */}
          <text x={CX} y={CY - 8} textAnchor="middle" fontSize={10} fill={FGMUTE}>Anel Hash</text>
          <text x={CX} y={CY + 8} textAnchor="middle" fontSize={9} fill={FGMUTE}>0 — 2³²</text>
        </svg>
      </div>

      {/* Painel de detalhes */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: CARD, borderRadius: 8, padding: 16, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C, marginBottom: 8 }}>Como funciona</div>
          <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
            Cada chave e cada shard são mapeados no anel. Uma chave vai para o{' '}
            <span style={{ color: FG }}>próximo shard no sentido horário</span>.{' '}
            Clique em um shard para ver quais chaves ele serve.
          </div>
        </div>

        {selectedInfo && (
          <div style={{ background: CARD, borderRadius: 8, padding: 16, border: `2px solid ${selectedInfo.color}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: selectedInfo.color, marginBottom: 8 }}>
              {selectedInfo.label}
            </div>
            <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 8 }}>
              Ângulo no anel: {selectedInfo.angle}°
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: FG, marginBottom: 6 }}>
              Chaves servidas ({ownedKeys.length}):
            </div>
            {ownedKeys.length > 0 ? ownedKeys.map(k => (
              <div key={k.id} style={{
                background: BG, borderRadius: 4, padding: '4px 8px',
                fontSize: 10, color: selectedInfo.color, marginBottom: 4,
                fontFamily: 'monospace',
              }}>
                {k.label}
              </div>
            )) : (
              <div style={{ fontSize: 10, color: FGMUTE }}>Nenhuma chave no momento</div>
            )}
          </div>
        )}

        {!selectedInfo && (
          <div style={{ background: CARD, borderRadius: 8, padding: 16, border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
              Clique em um shard para ver as chaves que ele serve.
            </div>
          </div>
        )}

        <div style={{ background: CARD, borderRadius: 8, padding: 16, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: FG, marginBottom: 12 }}>
            Impacto de adicionar shard
          </div>
          <button
            onClick={() => setShowNewNode(!showNewNode)}
            style={{
              padding: '8px 16px', borderRadius: 6, border: `1px solid ${C}`,
              background: showNewNode ? C : 'transparent',
              color: showNewNode ? '#1a0f00' : C,
              fontSize: 11, fontWeight: 700, cursor: 'pointer', width: '100%',
            }}
          >
            {showNewNode ? '— Remover Shard D' : '+ Adicionar Shard D (ângulo 60°)'}
          </button>
          {showNewNode && (
            <div style={{ marginTop: 10, fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
              Shard D entra em 60°. Apenas chaves entre Shard A (0°) e Shard D (60°) migram.{' '}
              <span style={{ color: C }}>~1/N das chaves total</span> — não todas.
              Isso é consistent hashing vs hash mod N simples.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Estratégias de Sharding — ComparisonTable
// Por que visual: comparar 4 estratégias em múltiplas dimensões simultaneamente
// (range scan, hot shard, resharding, complexidade) não é possível em texto linear.
// ═══════════════════════════════════════════════════════════════════════════════

const SHARD_OPTIONS: ComparisonOption[] = [
  { id: 'range', label: 'Range', sublabel: 'A-F → S1, G-M → S2', color: '#3b82f6' },
  { id: 'hash', label: 'Hash Mod N', sublabel: 'hash(key) % N', color: '#8b5cf6' },
  { id: 'consistent', label: 'Consistent Hash', sublabel: 'Anel circular', color: C },
  { id: 'geo', label: 'Geographic', sublabel: 'Por região', color: '#10b981' },
]

const SHARD_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'range-scan',
    label: 'Range Scan',
    description: 'Eficiência de queries por intervalo de chave',
    values: {
      range:      { rating: 'excellent', note: 'Nativo — dados ordenados por design' },
      hash:       { rating: 'poor',      note: 'Scatter-gather em todos os shards' },
      consistent: { rating: 'poor',      note: 'Sem garantia de ordenação no anel' },
      geo:        { rating: 'good',      note: 'Eficiente dentro da região' },
    },
  },
  {
    id: 'hot-shard',
    label: 'Resistência a Hot Shard',
    description: 'Capacidade de distribuir uniformemente o tráfego',
    values: {
      range:      { rating: 'poor',      note: 'Timestamp recente → último shard' },
      hash:       { rating: 'excellent', note: 'Distribuição uniforme por design' },
      consistent: { rating: 'good',      note: 'Uniforme; vnodes melhoram ainda mais' },
      geo:        { rating: 'fair',      note: 'Depende de distribuição geográfica' },
    },
  },
  {
    id: 'resharding',
    label: 'Custo de Resharding',
    description: 'Quantidade de dados movidos ao adicionar/remover shard',
    values: {
      range:      { rating: 'fair',      note: 'Split de intervalo — muda só 1 shard' },
      hash:       { rating: 'poor',      note: 'Quase todas as chaves migram com N±1' },
      consistent: { rating: 'excellent', note: 'Apenas ~1/N das chaves migram' },
      geo:        { rating: 'good',      note: 'Novas regiões sem impacto nas antigas' },
    },
  },
  {
    id: 'cross-shard',
    label: 'Cross-Shard Query',
    description: 'Frequência de queries que tocam múltiplos shards',
    values: {
      range:      { rating: 'excellent', note: 'Range dentro do shard é zero-cost' },
      hash:       { rating: 'fair',      note: 'Queries por campo não-shard = fanout' },
      consistent: { rating: 'fair',      note: 'Idem hash — sem ordem implícita' },
      geo:        { rating: 'poor',      note: 'Queries cross-region são caras' },
    },
  },
  {
    id: 'complexity',
    label: 'Complexidade de Implementação',
    description: 'Dificuldade de implementar e operar',
    values: {
      range:      { rating: 'good',      note: 'Simples de entender; lookup direto' },
      hash:       { rating: 'excellent', note: 'Função hash + mod — trivial' },
      consistent: { rating: 'fair',      note: 'Anel + vnodes requerem biblioteca' },
      geo:        { rating: 'poor',      note: 'Routing, compliance, latência inter-region' },
    },
  },
  {
    id: 'compliance',
    label: 'Suporte a Compliance',
    description: 'Facilidade de isolamento de dados por jurisdição (GDPR)',
    values: {
      range:      { rating: 'poor',      note: 'Dados misturados por chave, não região' },
      hash:       { rating: 'poor',      note: 'Nenhuma garantia geográfica' },
      consistent: { rating: 'poor',      note: 'Nenhuma garantia geográfica' },
      geo:        { rating: 'excellent', note: 'Por design — dados em região específica' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Scatter-Gather Pattern — SequenceDiagram
// Por que visual: a sequência temporal de fanout para N shards e merge do resultado
// é uma colaboração entre múltiplos atores que não fica clara em texto.
// ═══════════════════════════════════════════════════════════════════════════════

const SG_ACTORS: SeqActor[] = [
  { id: 'client',  label: 'Client',        color: '#e2e8f0' },
  { id: 'coord',   label: 'Coordinator',   color: C },
  { id: 's0',      label: 'Shard 0',       color: '#3b82f6' },
  { id: 's1',      label: 'Shard 1',       color: '#8b5cf6' },
  { id: 's2',      label: 'Shard N',       color: '#10b981' },
]

const SG_MESSAGES: SeqMessage[] = [
  {
    from: 'client', to: 'coord',
    label: 'SELECT COUNT(*) WHERE country=\'BR\'',
    type: 'sync',
    note: 'Query sem shard key — precisa de fanout',
  },
  {
    from: 'coord', to: 's0',
    label: 'query shard 0',
    type: 'async',
    note: 'Paralelo — todos os shards recebem simultaneamente',
  },
  {
    from: 'coord', to: 's1',
    label: 'query shard 1',
    type: 'async',
  },
  {
    from: 'coord', to: 's2',
    label: 'query shard N',
    type: 'async',
    note: 'Latência total = max(latência de cada shard)',
  },
  {
    from: 's0', to: 'coord',
    label: 'resultado: 234k',
    type: 'return',
  },
  {
    from: 's1', to: 'coord',
    label: 'resultado: 198k',
    type: 'return',
  },
  {
    from: 's2', to: 'coord',
    label: 'resultado: 301k',
    type: 'return',
    note: 'Coordinator aguarda o mais lento (tail latency)',
  },
  {
    from: 'coord', to: 'client',
    label: 'COUNT = 2.1M (soma de todos)',
    type: 'return',
    note: 'Merge em memória no coordinator',
  },
]

const SG_GROUPS: SeqGroup[] = [
  {
    label: 'Scatter — fanout paralelo',
    kind: 'par',
    fromMsg: 1,
    toMsg: 3,
    color: C,
  },
  {
    label: 'Gather — esperar o mais lento',
    kind: 'alt',
    fromMsg: 4,
    toMsg: 6,
    color: '#8b5cf6',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Evolução de Escala — StateMachineExplorer
// Por que visual: a progressão de "banco único → replicas → sharding" é uma
// transição de estados com eventos que disparam a mudança — perfeito para
// state machine. Candidatos de entrevista precisam verbalizar essa progressão.
// ═══════════════════════════════════════════════════════════════════════════════

const SCALE_STATES: SMState[] = [
  {
    id: 'single',
    label: 'Single DB',
    description: 'Um banco único com índices otimizados. Aguenta muito mais do que as pessoas pensam — Postgres em hardware moderno, TBs e 50k QPS.',
    color: '#10b981',
    isInitial: true,
  },
  {
    id: 'cache',
    label: '+ Cache',
    description: 'Redis na frente reduz QPS no banco em uma ordem de grandeza. A maioria dos sistemas resolve aqui — ratio de leitura 10:1 ou mais.',
    color: '#3b82f6',
  },
  {
    id: 'replicas',
    label: '+ Read Replicas',
    description: 'Descarrega leitura para réplicas. Escrita ainda vai para o master. Arquitetura que aguenta 99% dos casos até ~10TB.',
    color: '#8b5cf6',
  },
  {
    id: 'partition',
    label: 'Particionamento Local',
    description: 'PARTITION BY no mesmo servidor. Sem complexidade distribuída. Postgres suporta nativamente. Permite VACUUM e index rebuild por partição.',
    color: C,
  },
  {
    id: 'sharding',
    label: 'Sharding',
    description: 'Dados em servidores diferentes. Escala horizontal genuína. Custo operacional 10x — cross-shard queries, transações distribuídas, resharding.',
    color: '#ef4444',
    isFinal: true,
  },
]

const SCALE_TRANSITIONS: SMTransition[] = [
  {
    from: 'single', to: 'cache',
    event: 'Reads dominantes',
    guard: 'QPS reads > 5k; latência em queries repetidas',
    code: 'Redis CACHE_ASIDE pattern; TTL por tipo de dado',
  },
  {
    from: 'cache', to: 'replicas',
    event: 'Cache não resolve',
    guard: 'Reads com dados únicos por usuário; ratio leitura:escrita > 10:1',
    code: 'READ_REPLICA para queries SELECT; MASTER para writes',
  },
  {
    from: 'replicas', to: 'partition',
    event: 'Tabela muito grande',
    guard: 'Tabela > 500GB; VACUUM lento; índices enormes',
    code: 'PARTITION BY RANGE(created_at) INTERVAL \'1 month\'',
  },
  {
    from: 'partition', to: 'sharding',
    event: 'Writes não escalam',
    guard: 'Write QPS > 50k sustentado; dataset > 10TB; vertical scaling esgotado',
    code: 'hash(user_id) % N; consistent hashing para resharding fácil',
  },
  {
    from: 'single', to: 'replicas',
    event: 'HA necessária',
    guard: 'Requisito de uptime > 99.9%; single point of failure inaceitável',
    code: 'Streaming replication; automatic failover (Patroni, RDS Multi-AZ)',
  },
]

// ── Componente principal ───────────────────────────────────────────────────────

export default function ShardingVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'consistent-ring',
      title: 'Consistent Hash Ring',
      subtitle: 'Anel interativo — roteamento de chaves e impacto de adicionar shard',
      accent: C,
      component: <ConsistentHashRingVisual />,
    },
    {
      id: 'strategies-comparison',
      title: 'Estratégias de Sharding',
      subtitle: 'Range vs Hash vs Consistent vs Geographic — todos os trade-offs',
      accent: C,
      component: (
        <ComparisonTable
          options={SHARD_OPTIONS}
          criteria={SHARD_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Estratégias de Sharding"
          description="Clique em uma estratégia para destacar seus pontos fortes e fracos em cada critério."
          highlightBest
        />
      ),
    },
    {
      id: 'scatter-gather',
      title: 'Scatter-Gather Pattern',
      subtitle: 'Fluxo de cross-shard query — fanout paralelo e merge de resultados',
      accent: C,
      component: (
        <SequenceDiagram
          actors={SG_ACTORS}
          messages={SG_MESSAGES}
          groups={SG_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="Scatter-Gather — Cross-Shard Query"
          description="Uma query sem a shard key força o coordinator a enviar para todos os N shards em paralelo e aguardar o mais lento."
        />
      ),
    },
    {
      id: 'scale-progression',
      title: 'Progressão de Escala',
      subtitle: 'Quando partir para cada solução — do banco único ao sharding',
      accent: C,
      component: (
        <StateMachineExplorer
          states={SCALE_STATES}
          transitions={SCALE_TRANSITIONS}
          initialState="single"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Escalonamento de Banco de Dados"
          description="Clique em cada estado para ver quando ele se aplica. As transições mostram os gatilhos que levam à próxima solução."
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
