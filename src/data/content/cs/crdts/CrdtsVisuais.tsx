'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'

// ── Paleta CRDTs ──────────────────────────────────────────────────────────────
const C      = '#8b5cf6'   // roxo CRDT
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'
const PINK   = '#ec4899'
const ORG    = '#f97316'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — G-Counter Interactive Simulator
// Justificativa: ver réplicas incrementando e mergiando com animação de vetor
// ensina o mecanismo interno melhor que qualquer descrição textual. O usuário
// entende merge = max ao ver os valores fluindo entre réplicas.
// ═══════════════════════════════════════════════════════════════════════════════

type GCounterState = [number, number, number] // [A, B, C]

function GCounterVisual() {
  const [replicaA, setReplicaA] = useState<GCounterState>([0, 0, 0])
  const [replicaB, setReplicaB] = useState<GCounterState>([0, 0, 0])
  const [replicaC, setReplicaC] = useState<GCounterState>([0, 0, 0])
  const [merged, setMerged] = useState<GCounterState | null>(null)
  const [lastMerge, setLastMerge] = useState<string | null>(null)

  const mergeVectors = (a: GCounterState, b: GCounterState): GCounterState =>
    [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])]

  const doMergeAll = () => {
    const ab = mergeVectors(replicaA, replicaB)
    const abc = mergeVectors(ab, replicaC)
    setMerged(abc)
    setLastMerge(new Date().toLocaleTimeString())
  }

  const resetAll = () => {
    setReplicaA([0, 0, 0])
    setReplicaB([0, 0, 0])
    setReplicaC([0, 0, 0])
    setMerged(null)
    setLastMerge(null)
  }

  const readSum = (v: GCounterState) => v[0] + v[1] + v[2]

  const REPLICAS = [
    { label: 'Réplica A', idx: 0 as const, color: GRN, state: replicaA, set: setReplicaA },
    { label: 'Réplica B', idx: 1 as const, color: SKY, state: replicaB, set: setReplicaB },
    { label: 'Réplica C', idx: 2 as const, color: PRP, state: replicaC, set: setReplicaC },
  ]

  const SLOT_LABELS = ['A', 'B', 'C']
  const SLOT_COLORS = [GRN, SKY, PRP]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Clique em <strong style={{ color: FG }}>+1</strong> em cada réplica para incrementar seu slot local. Depois clique em <strong style={{ color: C }}>Merge All</strong> para ver a convergência.
      </div>

      {/* Réplicas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {REPLICAS.map((r) => (
          <div key={r.label} style={{ background: CARD, borderRadius: 12, padding: 16, border: `2px solid ${r.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: r.color, marginBottom: 12 }}>{r.label}</div>

            {/* Vector slots */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, justifyContent: 'center' }}>
              {SLOT_LABELS.map((sl, si) => (
                <div key={sl} style={{
                  width: 52, height: 52, borderRadius: 10,
                  background: si === r.idx ? `${r.color}22` : BG,
                  border: `2px solid ${si === r.idx ? r.color : LINE}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ fontSize: 9, color: SLOT_COLORS[si], fontWeight: 700, marginBottom: 2 }}>{sl}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: si === r.idx ? r.color : FGMUTE }}>
                    {r.state[si]}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const next = [...r.state] as GCounterState
                next[r.idx] += 1
                r.set(next)
                setMerged(null)
              }}
              style={{
                width: '100%', padding: '8px 0', background: `${r.color}22`,
                border: `1px solid ${r.color}`, borderRadius: 8,
                color: r.color, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              + 1 Incrementar
            </button>

            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: FGMUTE }}>
              Read local: <strong style={{ color: FG }}>{readSum(r.state)}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Merge controls */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={doMergeAll}
          style={{
            padding: '10px 28px', background: C, border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Merge All (max por slot)
        </button>
        <button
          onClick={resetAll}
          style={{
            padding: '10px 20px', background: CARD, border: `1px solid ${LINE}`,
            borderRadius: 10, color: FGMUTE, fontSize: 13, cursor: 'pointer',
          }}
        >
          Resetar
        </button>
      </div>

      {/* Merged result */}
      {merged && (
        <div style={{ background: `${C}15`, border: `2px solid ${C}`, borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C, marginBottom: 12 }}>
            Estado Mergeado — merge(A, B, C) = max por slot
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
            {SLOT_LABELS.map((sl, si) => (
              <div key={sl} style={{
                width: 64, height: 64, borderRadius: 12,
                background: `${SLOT_COLORS[si]}22`,
                border: `2px solid ${SLOT_COLORS[si]}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 10, color: SLOT_COLORS[si], fontWeight: 700, marginBottom: 2 }}>{sl}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: SLOT_COLORS[si] }}>{merged[si]}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: 16 }}>
            Read total: <strong style={{ color: C, fontSize: 24 }}>{readSum(merged)}</strong>
          </div>
          <div style={{ textAlign: 'center', fontSize: 11, color: FGMUTE, marginTop: 8 }}>
            Qualquer ordem de merge produz o mesmo resultado — propriedade comutativa + associativa
            {lastMerge && ` · Mergeado às ${lastMerge}`}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — CRDT Types Explorer (custom)
// Justificativa: hierarquia de G-Set → 2P-Set → OR-Set com tradeoffs por tipo.
// Ver os tradeoffs lado a lado com exemplos de operações interativos ensina
// melhor que ler a lista. Permite explorar "o que acontece se..." em cada tipo.
// ═══════════════════════════════════════════════════════════════════════════════

type CRDTType = {
  id: string
  name: string
  category: string
  color: string
  ops: string[]
  merge: string
  readFormula: string
  canRemove: boolean
  canReadd: boolean
  metadata: 'mínimo' | 'médio' | 'alto'
  useCases: string[]
  limitation: string
}

const CRDT_TYPES: CRDTType[] = [
  {
    id: 'g-counter',
    name: 'G-Counter',
    category: 'Counter',
    color: GRN,
    ops: ['increment(replicaId)'],
    merge: 'max(A[i], B[i]) por slot',
    readFormula: 'sum(counter[0..n])',
    canRemove: false,
    canReadd: false,
    metadata: 'mínimo',
    useCases: ['Likes', 'Views', 'Métricas', 'Eventos analytics'],
    limitation: 'Só incrementa — sem decrement',
  },
  {
    id: 'pn-counter',
    name: 'PN-Counter',
    category: 'Counter',
    color: SKY,
    ops: ['increment(replicaId)', 'decrement(replicaId)'],
    merge: 'max(P[i], Q[i]) e max(N[i], M[i])',
    readFormula: 'sum(P) - sum(N)',
    canRemove: false,
    canReadd: false,
    metadata: 'médio',
    useCases: ['Score', 'Rating', 'Estoque eventual'],
    limitation: 'Não garante valor ≥ 0 sem coordenação',
  },
  {
    id: 'g-set',
    name: 'G-Set',
    category: 'Set',
    color: AMB,
    ops: ['add(element)'],
    merge: 'union(A, B)',
    readFormula: 'elements in set',
    canRemove: false,
    canReadd: false,
    metadata: 'mínimo',
    useCases: ['Tags imutáveis', 'Whitelist', 'IDs de recursos'],
    limitation: 'Sem remove — elementos ficam para sempre',
  },
  {
    id: '2p-set',
    name: '2P-Set',
    category: 'Set',
    color: ORG,
    ops: ['add(element)', 'remove(element)'],
    merge: 'union(adds) + union(removes)',
    readFormula: 'adds \\ removes',
    canRemove: true,
    canReadd: false,
    metadata: 'médio',
    useCases: ['Listas com delete permanente'],
    limitation: 'Sem re-add: elemento removido não volta nunca',
  },
  {
    id: 'or-set',
    name: 'OR-Set',
    category: 'Set',
    color: C,
    ops: ['add(element) → UUID tag', 'remove(element, tags-observadas)'],
    merge: 'union(adds) filtrado por removes',
    readFormula: 'elementos com tags ativas (não-removidas)',
    canRemove: true,
    canReadd: true,
    metadata: 'alto',
    useCases: ['Listas colaborativas', 'Riak KV', 'Carrinhos offline'],
    limitation: 'Metadata cresce com tombstones — precisa de GC',
  },
  {
    id: 'lww-register',
    name: 'LWW-Register',
    category: 'Register',
    color: PINK,
    ops: ['write(value, timestamp)'],
    merge: 'max(timestamp) vence',
    readFormula: 'value com maior timestamp',
    canRemove: false,
    canReadd: false,
    metadata: 'mínimo',
    useCases: ['Status online/offline', 'Config simples', 'Last seen'],
    limitation: 'Clock skew pode descartar updates recentes silenciosamente',
  },
]

function CRDTTypesVisual() {
  const [selected, setSelected] = useState<string>('g-counter')
  const type = CRDT_TYPES.find(t => t.id === selected)!

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%', minHeight: 400 }}>
      {/* Type selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 170, flexShrink: 0 }}>
        {['Counter', 'Set', 'Register'].map(cat => (
          <div key={cat}>
            <div style={{ fontSize: 10, fontWeight: 700, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4, paddingLeft: 4 }}>{cat}</div>
            {CRDT_TYPES.filter(t => t.category === cat).map(t => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                style={{
                  width: '100%', padding: '9px 12px', marginBottom: 4,
                  background: selected === t.id ? `${t.color}22` : CARD,
                  border: `2px solid ${selected === t.id ? t.color : LINE}`,
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  color: selected === t.id ? t.color : FG,
                  fontSize: 13, fontWeight: selected === t.id ? 700 : 400,
                  transition: 'all .15s',
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Detail */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `2px solid ${type.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: type.color }}>{type.name}</div>
              <div style={{ fontSize: 11, color: FGMUTE }}>Categoria: {type.category}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: type.canRemove ? `${GRN}22` : `${RED}22`, color: type.canRemove ? GRN : RED, fontWeight: 700 }}>
                {type.canRemove ? '✓ Remove' : '✗ Remove'}
              </span>
              <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: type.canReadd ? `${GRN}22` : `${RED}22`, color: type.canReadd ? GRN : RED, fontWeight: 700 }}>
                {type.canReadd ? '✓ Re-add' : '✗ Re-add'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Operações</div>
              {type.ops.map(op => (
                <div key={op} style={{ background: BG, borderRadius: 6, padding: '6px 10px', marginBottom: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: SKY }}>{op}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Merge Function</div>
              <div style={{ background: BG, borderRadius: 6, padding: '6px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: AMB }}>{type.merge}</div>
              <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: FGMUTE, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 }}>Read Formula</div>
              <div style={{ background: BG, borderRadius: 6, padding: '6px 10px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: GRN }}>{type.readFormula}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: CARD, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: GRN, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Casos de Uso</div>
            {type.useCases.map(u => (
              <div key={u} style={{ fontSize: 12, color: FG, padding: '3px 0', display: 'flex', gap: 6 }}>
                <span style={{ color: GRN }}>•</span>{u}
              </div>
            ))}
          </div>
          <div style={{ background: CARD, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: AMB, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>Metadata</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
              {['mínimo', 'médio', 'alto'].map(m => (
                <div key={m} style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                  background: type.metadata === m ? `${AMB}22` : BG,
                  border: `1px solid ${type.metadata === m ? AMB : LINE}`,
                  color: type.metadata === m ? AMB : FGMUTE,
                }}>{m}</div>
              ))}
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>Limitação</div>
            <div style={{ fontSize: 12, color: '#fca5a5' }}>{type.limitation}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — CRDT vs OT Comparison
// Justificativa: duas arquiteturas distintas (P2P vs servidor central) são
// melhor entendidas visualmente. ComparisonTable com 5 critérios mostra
// claramente quando usar cada um — texto não transmite isso tão eficientemente.
// ═══════════════════════════════════════════════════════════════════════════════

const PARADIGM_OPTIONS: ComparisonOption[] = [
  { id: 'crdt', label: 'CRDT', sublabel: 'Conflict-free Replicated Data Type', color: C },
  { id: 'ot',   label: 'OT', sublabel: 'Operational Transform', color: SKY },
]

const PARADIGM_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'arch',
    label: 'Arquitetura',
    description: 'Topologia de rede necessária',
    values: {
      crdt: { rating: 'excellent', note: 'Peer-to-peer, sem servidor central obrigatório' },
      ot:   { rating: 'fair',      note: 'Exige servidor central para serializar operações' },
    },
  },
  {
    id: 'offline',
    label: 'Suporte Offline',
    description: 'Operação sem conectividade',
    values: {
      crdt: { rating: 'excellent', note: 'Offline-first nativo — réplica opera independente' },
      ot:   { rating: 'poor',      note: 'Requer servidor para transformar — offline difícil' },
    },
  },
  {
    id: 'complexity',
    label: 'Complexidade de Implementação',
    description: 'Dificuldade de implementar corretamente',
    values: {
      crdt: { rating: 'good',  note: 'Use lib (Yjs, Automerge) — implementação própria é arriscada' },
      ot:   { rating: 'poor',  note: 'Algoritmos de transformação são notoriamente difíceis de provar corretos' },
    },
  },
  {
    id: 'richtext',
    label: 'Suporte a Texto Rico',
    description: 'Formatação, undo/redo, estrutura complexa',
    values: {
      crdt: { rating: 'good',      note: 'Yjs suporta texto rico com histórico parcial via Undo Manager' },
      ot:   { rating: 'excellent', note: 'Modelo maduro — Google Docs usa OT desde 2006 com undo rico' },
    },
  },
  {
    id: 'metadata',
    label: 'Overhead de Metadata',
    description: 'Custo de storage adicional',
    values: {
      crdt: { rating: 'fair', note: 'Tombstones crescem — GC periódico necessário' },
      ot:   { rating: 'good', note: 'Operações podem ser descartadas após aplicadas no servidor' },
    },
  },
  {
    id: 'maturity',
    label: 'Adoção em Produção',
    description: 'Projetos reais usando em escala',
    values: {
      crdt: { rating: 'good',      note: 'Figma, Linear, Notion offline, Riak KV' },
      ot:   { rating: 'excellent', note: 'Google Docs, Etherpad — 10+ anos de produção' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function CrdtsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'g-counter-sim',
      title: 'G-Counter Interativo',
      subtitle: 'Incremente réplicas offline e veja o merge convergir em tempo real',
      accent: C,
      component: <GCounterVisual />,
    },
    {
      id: 'crdt-types',
      title: 'Tipos de CRDT',
      subtitle: 'Explorer interativo: operações, merge function e limitações de cada tipo',
      accent: C,
      component: <CRDTTypesVisual />,
    },
    {
      id: 'crdt-vs-ot',
      title: 'CRDT vs OT',
      subtitle: 'Comparação em 6 dimensões — quando usar cada paradigma',
      accent: C,
      component: (
        <ComparisonTable
          options={PARADIGM_OPTIONS}
          criteria={PARADIGM_CRITERIA}
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
