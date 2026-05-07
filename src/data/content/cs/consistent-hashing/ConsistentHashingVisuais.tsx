'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Consistent Hashing ─────────────────────────────────────────────────
const C      = '#6366f1'  // indigo — algorithms
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Hash Módulo vs Consistent Hashing (custom interativo)
// Justificativa: o problema do thundering herd ao escalar é o motivador central.
// Ver a diferença de remapeamento em tempo real ao adicionar 1 nó ancora o conceito.
// ═══════════════════════════════════════════════════════════════════════════════

function simpleHash(key: string, n: number): number {
  let h = 5381
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) + h + key.charCodeAt(i)) >>> 0
  }
  return h % n
}

function ringHash(key: string, maxVal: number): number {
  let h = 5381
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) + h + key.charCodeAt(i)) >>> 0
  }
  return h % maxVal
}

function ConsistentHashingDemo() {
  const [numNodes, setNumNodes] = useState(5)
  const RING_SIZE = 1024
  const KEY_COUNT = 100

  const keys = Array.from({ length: KEY_COUNT }, (_, i) => `key:${i}`)

  function getNodePositions(n: number): number[] {
    return Array.from({ length: n }, (_, i) => ringHash(`node:${i}`, RING_SIZE)).sort((a, b) => a - b)
  }

  function getRingNode(keyStr: string, positions: number[]): number {
    const h = ringHash(keyStr, RING_SIZE)
    const idx = positions.findIndex(p => p >= h)
    return idx === -1 ? 0 : idx
  }

  const nodes1 = getNodePositions(numNodes)
  const nodes2 = getNodePositions(numNodes + 1)

  const moduloRemapped    = keys.filter(k => simpleHash(k, numNodes) !== simpleHash(k, numNodes + 1)).length
  const consistentRemapped = keys.filter(k => getRingNode(k, nodes1) !== getRingNode(k, nodes2)).length

  const moduloPct    = (moduloRemapped / KEY_COUNT * 100).toFixed(1)
  const consistentPct = (consistentRemapped / KEY_COUNT * 100).toFixed(1)

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Hash módulo vs Consistent Hashing — remapeamento ao escalar</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Ajuste o número de nós e veja quantas chaves remapeiam ao adicionar 1 nó. Hash módulo causa tempestade de cache misses; consistent hashing mantém ~1/N.</p>
      </div>

      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ color: C, fontSize: 11, fontWeight: 700, letterSpacing: '.05em' }}>N (nós atuais)</div>
          <div style={{ color: FG, fontSize: 22, fontWeight: 800 }}>{numNodes}</div>
        </div>
        <input
          type="range" min={2} max={20} value={numNodes}
          onChange={e => setNumNodes(Number(e.target.value))}
          style={{ width: '100%', accentColor: C, cursor: 'pointer' }}
        />
        <div style={{ color: FGMUTE, fontSize: 10, marginTop: 4 }}>
          Simulando adição de 1 nó: N={numNodes} → N={numNodes + 1}. Total de {KEY_COUNT} chaves.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        {[
          {
            label: 'Hash Módulo (key % N)',
            color: RED,
            remapped: moduloRemapped,
            pct: moduloPct,
            description: 'Complexidade: O(K). Quase todas as chaves mudam de nó.',
          },
          {
            label: 'Consistent Hashing',
            color: GRN,
            remapped: consistentRemapped,
            pct: consistentPct,
            description: `Complexidade: O(K/N). ~1/N = ${(100/numNodes).toFixed(0)}% esperado.`,
          },
        ].map(({ label, color, remapped, pct, description }) => (
          <div key={label} style={{ background: CARD, border: `2px solid ${color}60`, borderRadius: 12, padding: 16 }}>
            <div style={{ color, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{label}</div>
            <div style={{ color, fontSize: 36, fontWeight: 800 }}>{pct}%</div>
            <div style={{ color: FGMUTE, fontSize: 10, marginBottom: 10 }}>
              {remapped}/{KEY_COUNT} chaves remapeadas
            </div>
            <div style={{ background: BG, borderRadius: 4, height: 8, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: 8, borderRadius: 4, background: color, width: `${pct}%`, transition: 'width .3s' }} />
            </div>
            <div style={{ color: FGMUTE, fontSize: 10, lineHeight: 1.5 }}>
              {description}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: CARD, border: `1px solid ${C}40`, borderRadius: 10, padding: 14,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ color: FGMUTE, fontSize: 10, letterSpacing: '.1em', marginBottom: 4 }}>REDUÇÃO DE REMAPEAMENTO</div>
          <div style={{ color: C, fontSize: 28, fontWeight: 800 }}>
            {moduloRemapped > 0 ? (moduloRemapped / Math.max(consistentRemapped, 1)).toFixed(1) : '—'}×
          </div>
          <div style={{ color: FGMUTE, fontSize: 10 }}>menos chaves migram com consistent hashing</div>
        </div>
        <div style={{
          background: BG, border: `1px solid ${LINE}`, borderRadius: 8, padding: '10px 14px',
          fontSize: 11, color: FGMUTE, maxWidth: 240, lineHeight: 1.6,
        }}>
          <strong style={{ color: AMB }}>Thundering herd:</strong> com hash módulo, {moduloRemapped} cache misses simultâneos ao escalar. Backend recebe {moduloRemapped}× mais requisições que o normal.
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Ring Interativo com Lookup
// Justificativa: ver onde uma chave específica vai no anel torna o conceito tangível.
// ═══════════════════════════════════════════════════════════════════════════════

function RingVisual() {
  const [numNodes, setNumNodes] = useState(5)
  const [numVnodes, setNumVnodes] = useState(1)
  const [lookupKey, setLookupKey] = useState('user:1234')
  const RING_SIZE = 360

  function nodeColor(i: number): string {
    const colors = [C, AMB, GRN, SKY, '#ec4899', '#f97316', '#14b8a6', '#8b5cf6']
    return colors[i % colors.length]
  }

  type Token = { nodeIdx: number; angle: number; label: string }

  const tokens: Token[] = []
  for (let ni = 0; ni < numNodes; ni++) {
    for (let vi = 0; vi < numVnodes; vi++) {
      const h = ringHash(`node:${ni}:vn:${vi}`, RING_SIZE)
      tokens.push({ nodeIdx: ni, angle: h, label: numVnodes > 1 ? `N${ni+1}.${vi+1}` : `N${ni+1}` })
    }
  }
  tokens.sort((a, b) => a.angle - b.angle)

  const keyAngle = ringHash(lookupKey, RING_SIZE)
  let targetIdx = tokens.findIndex(t => t.angle >= keyAngle)
  if (targetIdx === -1) targetIdx = 0
  const targetToken = tokens[targetIdx]

  function polarToXY(angle: number, r: number): { x: number; y: number } {
    const rad = (angle / RING_SIZE) * 2 * Math.PI - Math.PI / 2
    return { x: 150 + r * Math.cos(rad), y: 150 + r * Math.sin(rad) }
  }

  const keyPos = polarToXY(keyAngle, 85)

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Ring interativo — lookup de chave no anel</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Ajuste nós e vnodes. Digite uma chave para ver em qual nó ela cai (próximo no sentido horário).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: C, fontSize: 10, fontWeight: 700 }}>NÓS FÍSICOS</span>
              <span style={{ color: FG, fontSize: 18, fontWeight: 800 }}>{numNodes}</span>
            </div>
            <input type="range" min={1} max={8} value={numNodes} onChange={e => setNumNodes(Number(e.target.value))}
              style={{ width: '100%', accentColor: C }} />
          </div>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: AMB, fontSize: 10, fontWeight: 700 }}>VNODES POR NÓ</span>
              <span style={{ color: FG, fontSize: 18, fontWeight: 800 }}>{numVnodes}</span>
            </div>
            <input type="range" min={1} max={5} value={numVnodes} onChange={e => setNumVnodes(Number(e.target.value))}
              style={{ width: '100%', accentColor: AMB }} />
          </div>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: 12 }}>
            <div style={{ color: GRN, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>CHAVE DE LOOKUP</div>
            <input
              value={lookupKey}
              onChange={e => setLookupKey(e.target.value)}
              style={{
                width: '100%', background: BG, border: `1px solid ${LINE}`, borderRadius: 6,
                padding: '6px 10px', color: GRN, fontFamily: 'inherit', fontSize: 12, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {targetToken && (
            <div style={{ background: `${nodeColor(targetToken.nodeIdx)}20`, border: `2px solid ${nodeColor(targetToken.nodeIdx)}`, borderRadius: 8, padding: 14 }}>
              <div style={{ color: FGMUTE, fontSize: 10, marginBottom: 4 }}>RESULTADO</div>
              <div style={{ color: nodeColor(targetToken.nodeIdx), fontSize: 14, fontWeight: 800 }}>
                Nó {targetToken.nodeIdx + 1} ({targetToken.label})
              </div>
              <div style={{ color: FGMUTE, fontSize: 10, marginTop: 4 }}>
                hash("{lookupKey}") = {keyAngle}<br/>
                Próximo token: {targetToken.angle}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Array.from({ length: numNodes }, (_, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: CARD, borderRadius: 6, padding: '4px 8px',
                border: `1px solid ${nodeColor(i)}40`, fontSize: 11,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: nodeColor(i) }} />
                <span style={{ color: FG }}>Nó {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <svg viewBox="0 0 300 300" width="300" height="300">
            <circle cx="150" cy="150" r="110" fill="none" stroke="#334155" strokeWidth="2" />
            <text x="150" y="147" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="monospace">hash</text>
            <text x="150" y="160" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="monospace">ring</text>

            {tokens.map((token, i) => {
              const pos = polarToXY(token.angle, 110)
              const isTarget = i === targetIdx
              return (
                <g key={i}>
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={isTarget ? 9 : 6}
                    fill={nodeColor(token.nodeIdx)}
                    stroke={isTarget ? '#fff' : '#0f172a'}
                    strokeWidth={isTarget ? 2 : 1}
                  />
                  <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize="7" fontWeight="700" fill="#fff" fontFamily="monospace">
                    {token.label}
                  </text>
                </g>
              )
            })}

            <circle cx={keyPos.x} cy={keyPos.y} r={5} fill={GRN} stroke="#fff" strokeWidth={1.5} />
            <text x={keyPos.x} y={keyPos.y - 10} textAnchor="middle" fontSize="8" fill={GRN} fontFamily="monospace">key</text>

            {targetToken && (() => {
              const tPos = polarToXY(targetToken.angle, 110)
              return (
                <line x1={keyPos.x} y1={keyPos.y} x2={tPos.x} y2={tPos.y}
                  stroke={GRN} strokeWidth="1.5" strokeDasharray="4,2" />
              )
            })()}

            <text x="150" y="28" textAnchor="middle" fontSize="8" fill="#475569" fontFamily="monospace">0</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Variantes em cards customizados (sem ConceptCarousel)
// Justificativa: ConceptCarousel espera Slide com paragraphs/gradient/illustration
// que não se aplicam bem ao contexto técnico de algoritmos.
// ═══════════════════════════════════════════════════════════════════════════════

const CH_VARIANTS = [
  {
    id: 'ring-basic',
    title: 'Ring Básico',
    complexity: 'O(log N) lookup',
    badge: 'Simples',
    badgeColor: SKY,
    description: 'Cada nó físico tem 1 token no anel. Distribuição pode ficar desigual por acaso estatístico — alguns nós ficam com arcos maiores e mais chaves.',
    code: `ring.addNode({ id: 'node-3', address: '10.0.0.3' })
// Chaves no arco [node-2, node-3] migram para node-3
// Resto permanece intacto — K/(N+1) migram`,
    usedBy: 'Implementações básicas',
    limit: 'Distribuição heterogênea',
  },
  {
    id: 'vnodes',
    title: 'Virtual Nodes (vnodes)',
    complexity: 'O(log M·N) lookup',
    badge: 'Produção',
    badgeColor: C,
    description: 'Cada nó físico recebe M tokens pseudoaleatórios no anel (M=100-256 típico). Distribuição estatisticamente uniforme. Falha distribui carga entre vários vizinhos.',
    code: `ring.addNode({ id: 'node-1' }, 150)
// node-1 aparece 150x no anel:
// hash("node-1:0"), hash("node-1:1"), ..., hash("node-1:149")`,
    usedBy: 'Cassandra, DynamoDB, Amazon Dynamo',
    limit: 'Overhead de memória por vnodes',
  },
  {
    id: 'jump',
    title: 'Jump Consistent Hashing',
    complexity: 'O(ln n) lookup',
    badge: 'Google 2014',
    badgeColor: AMB,
    description: 'Descarta o anel completamente. Dado (key, num_buckets), determina o bucket em O(ln n) com 2 variáveis e um loop. Zero estado, zero estrutura de dados.',
    code: `function jumpHash(key: bigint, n: number): number {
  let b = -1n, j = 0n
  while (j < BigInt(n)) {
    b = j
    key = (key * 2862933555777941757n + 1n) & 0xFFFFFFFFFFFFFFFFn
    j = BigInt(Math.floor(Number(b+1n) * (2**31 / (Number(key>>33n)+1))))
  }
  return Number(b)
}`,
    usedBy: 'Clusters que só crescem (append-only)',
    limit: 'Não suporta remoção de nó do meio',
  },
  {
    id: 'rendezvous',
    title: 'Rendezvous Hashing (HRW)',
    complexity: 'O(N) por lookup',
    badge: 'CDNs',
    badgeColor: GRN,
    description: 'Para cada chave, calcula hash(chave, nó) para todos os N nós. A chave vai para o nó com maior hash. Sem anel, sem estado. Ideal para N pequeno.',
    code: `function rendezvousGet(key: string, nodes: string[]): string {
  let best = { node: '', score: -1 }
  for (const node of nodes) {
    const score = hash(key + ':' + node)
    if (score > best.score) best = { node, score }
  }
  return best.node
}`,
    usedBy: 'Akamai CDN, grupos de cache pequenos',
    limit: 'O(N) por lookup — não escala para N grande',
  },
  {
    id: 'bounded',
    title: 'Bounded Loads',
    complexity: 'O(log N) amortizado',
    badge: 'Google 2017',
    badgeColor: '#ec4899',
    description: 'Cada nó tem capacidade máxima de (1+ε)×carga_média. Se o nó responsável está cheio, vai para o próximo. Resolve hot keys sem cache local.',
    code: `function getNodeBounded(key: string, ε = 0.25): Node {
  const avgLoad = totalLoad / numNodes
  const maxLoad = avgLoad * (1 + ε)
  let candidate = ring.getNode(key)
  while (candidate.currentLoad >= maxLoad) {
    candidate = ring.nextNode(candidate)
  }
  return candidate
}`,
    usedBy: 'Load balancers Google, CDNs com hot content',
    limit: 'Requer contador de carga por nó em tempo real',
  },
]

function VariantsVisual() {
  const [selected, setSelected] = useState(0)
  const v = CH_VARIANTS[selected]

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Variantes de Consistent Hashing</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Cada extensão resolve um problema específico. Selecione para ver detalhes e implementação.</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {CH_VARIANTS.map((variant, i) => (
          <button
            key={variant.id}
            onClick={() => setSelected(i)}
            style={{
              background: selected === i ? C : 'transparent',
              color: selected === i ? '#fff' : FGMUTE,
              border: `1.5px solid ${selected === i ? C : LINE}`,
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
          >
            {variant.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <span style={{ background: `${v.badgeColor}20`, color: v.badgeColor, border: `1px solid ${v.badgeColor}50`, borderRadius: 6, padding: '3px 10px', fontSize: 10, fontWeight: 700 }}>
              {v.badge}
            </span>
            <span style={{ color: C, fontSize: 11, fontWeight: 600 }}>{v.complexity}</span>
          </div>
          <p style={{ color: FG, fontSize: 13, lineHeight: 1.7, margin: '0 0 16px' }}>{v.description}</p>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <div style={{ color: GRN, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>USADO POR</div>
            <div style={{ color: FG, fontSize: 12 }}>{v.usedBy}</div>
          </div>
          <div style={{ background: `${RED}10`, border: `1px solid ${RED}30`, borderRadius: 8, padding: 12 }}>
            <div style={{ color: RED, fontSize: 10, fontWeight: 700, marginBottom: 6 }}>LIMITAÇÃO</div>
            <div style={{ color: FG, fontSize: 12 }}>{v.limit}</div>
          </div>
        </div>
        <div>
          <div style={{ color: FGMUTE, fontSize: 10, fontWeight: 700, marginBottom: 8, letterSpacing: '.1em' }}>IMPLEMENTAÇÃO</div>
          <pre style={{
            background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: 14,
            fontSize: 11, color: FG, overflow: 'auto', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap',
          }}>
            {v.code}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Sistemas reais por algoritmo (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const SYSTEMS_OPTIONS: ComparisonOption[] = [
  { id: 'cassandra', label: 'Cassandra', sublabel: 'Ring + vnodes', color: AMB },
  { id: 'dynamo', label: 'DynamoDB', sublabel: 'Token ring', color: '#fb923c' },
  { id: 'redis', label: 'Redis Cluster', sublabel: 'Hash slots', color: RED },
  { id: 'memcached', label: 'Memcached', sublabel: 'Ketama', color: SKY },
  { id: 'cdn', label: 'CDN (Akamai)', sublabel: 'Rendezvous', color: GRN },
]

const SYSTEMS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'algorithm',
    label: 'Algoritmo',
    category: 'Implementação',
    description: 'Variante de consistent hashing usada',
    values: {
      cassandra: { rating: 'excellent', note: 'Ring com Murmur3Partitioner + 256 vnodes por padrão.' },
      dynamo: { rating: 'excellent', note: 'Token ring com preference list. Vnodes no DynamoDB moderno.' },
      redis: { rating: 'good', note: 'Hash slots: 16384 slots fixos via CRC16(key) % 16384.' },
      memcached: { rating: 'good', note: 'Ketama library — ring puro com MD5 hash.' },
      cdn: { rating: 'good', note: 'Rendezvous hashing (HRW) — hash(URL, edge) por edge server.' },
    },
  },
  {
    id: 'replication',
    label: 'Replicação',
    category: 'Disponibilidade',
    description: 'Como réplicas são posicionadas no anel',
    values: {
      cassandra: { rating: 'excellent', note: 'N réplicas nos próximos nós únicos. Preference list por rack/AZ.' },
      dynamo: { rating: 'excellent', note: 'N réplicas nos N-1 nós seguintes. Preference list por AZ.' },
      redis: { rating: 'good', note: 'Cada shard tem primary + N replicas. Replica não usa anel.' },
      memcached: { rating: 'poor', note: 'Sem replicação nativa — apenas distribuição de chaves.' },
      cdn: { rating: 'good', note: 'Geo-proximity filter + HRW entre candidates próximos.' },
    },
  },
  {
    id: 'consistency',
    label: 'Consistência tunable',
    category: 'Garantias',
    description: 'R+W>N para strong consistency',
    values: {
      cassandra: { rating: 'excellent', note: 'CL=ONE (eventual) → CL=QUORUM (strong) → CL=ALL. Por query.' },
      dynamo: { rating: 'good', note: 'eventual (default) ou ConsistentRead=true (strong, 2× custo).' },
      redis: { rating: 'fair', note: 'WAIT command para semi-sync. Replicação async por padrão.' },
      memcached: { rating: 'poor', note: 'Sem consistência — cache puro, TTL-based.' },
      cdn: { rating: 'poor', note: 'Cache hit rate é o objetivo — consistência não aplicável.' },
    },
  },
  {
    id: 'rebalancing',
    label: 'Rebalanceamento',
    category: 'Operacional',
    description: 'Como redistribui dados ao escalar',
    values: {
      cassandra: { rating: 'excellent', note: 'Automático via streaming. nodetool decommission/bootstrap.' },
      dynamo: { rating: 'excellent', note: 'Automático e gerenciado. Transparente para o desenvolvedor.' },
      redis: { rating: 'good', note: 'Migração de hash slots entre shards. Operação manual ou automática.' },
      memcached: { rating: 'fair', note: 'Cache invalidation — não migra dados, apenas perde cache.' },
      cdn: { rating: 'excellent', note: 'Edge servers adicionados automaticamente. HRW re-roteia URLs.' },
    },
  },
  {
    id: 'hotspot',
    label: 'Proteção a hotspot',
    category: 'Performance',
    description: 'Como lida com chaves muito acessadas',
    values: {
      cassandra: { rating: 'fair', note: 'nodetool toppartitions detecta. Requer sub-sharding manual.' },
      dynamo: { rating: 'good', note: 'Adaptive capacity automática. Burst capacity por partição.' },
      redis: { rating: 'fair', note: 'Hashtag permite co-location. Sem proteção automática a hot keys.' },
      memcached: { rating: 'poor', note: 'Hot key satura o servidor. Requer local cache em front.' },
      cdn: { rating: 'excellent', note: 'CDN por natureza distribui hot content — múltiplas POPs servem.' },
    },
  },
  {
    id: 'use-case',
    label: 'Caso de uso ideal',
    category: 'Decisão',
    description: 'Quando escolher cada sistema',
    values: {
      cassandra: { rating: 'good', note: 'Time-series, IoT, write-heavy, multi-DC com latência baixa.' },
      dynamo: { rating: 'excellent', note: 'Serverless, key-value de baixa latência, escala gerenciada.' },
      redis: { rating: 'good', note: 'Cache, sessões, Pub/Sub, rate limiting. Latência sub-ms.' },
      memcached: { rating: 'fair', note: 'Cache simples sem complexidade. Memória eficiente.' },
      cdn: { rating: 'good', note: 'Assets estáticos, streaming, distribuição geográfica de conteúdo.' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Decision Tree: qual variante usar?
// Usa o formato flat Record<string, DTNode> que o componente espera.
// ═══════════════════════════════════════════════════════════════════════════════

const CH_DT_ROOT: DTNode = {
  id: 'root',
  question: 'O cluster pode crescer E diminuir (scale up e down)?',
  children: [
    { label: 'Sim — cluster flexível', nodeId: 'flexible', color: C },
    { label: 'Não — só cresce', nodeId: 'append-only', color: AMB },
  ],
}

const CH_DT_NODES: Record<string, DTNode> = {
  flexible: {
    id: 'flexible',
    question: 'N de nós é grande (>20) ou heterogêneo?',
    children: [
      { label: 'Sim — N grande ou máquinas diferentes', nodeId: 'ring-vnodes', color: C },
      { label: 'Não — N pequeno e homogêneo', nodeId: 'rendezvous', color: GRN },
    ],
  },
  'append-only': {
    id: 'append-only',
    question: 'Performance de lookup é crítica (microserviços, alto QPS)?',
    children: [
      { label: 'Sim — precisa de máxima velocidade', nodeId: 'jump', color: AMB },
      { label: 'Não — simplicidade preferível', nodeId: 'ring-simple', color: SKY },
    ],
  },
  'ring-vnodes': {
    id: 'ring-vnodes',
    recommendation: 'Ring + vnodes (100-256 por nó)',
    detail: 'Cassandra, DynamoDB. Suporta qualquer operação de escala. Distribuição uniforme mesmo com nós heterogêneos. Mais flexível e mais usado em produção.',
    color: C,
  },
  rendezvous: {
    id: 'rendezvous',
    recommendation: 'Rendezvous Hashing (HRW)',
    detail: 'N pequeno (5-20 nós): HRW é O(N) mas simples, sem estado, sem estrutura de dados. CDNs e grupos de cache pequenos. Akamai usa HRW.',
    color: GRN,
  },
  jump: {
    id: 'jump',
    recommendation: 'Jump Consistent Hashing',
    detail: 'O(ln n) lookup, O(1) memória, zero estado. Google Jump Hash 2014. Limitação crítica: só adiciona no final — não suporta remoção de nó do meio.',
    color: AMB,
  },
  'ring-simple': {
    id: 'ring-simple',
    recommendation: 'Ring básico (sem vnodes)',
    detail: 'Ring sem vnodes para simplicidade máxima. Aceita distribuição levemente desigual. Se N for muito pequeno, rendezvous também resolve com menos código.',
    color: SKY,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Progressão de conhecimento
// ═══════════════════════════════════════════════════════════════════════════════

const CH_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'basico',
    name: 'Fundamentos',
    label: 'Fundamentos',
    emoji: '🔵',
    concepts: [
      { name: 'Hash módulo % N não escala', tip: 'Adicionar 1 nó remapeia quase todas as chaves — thundering herd de cache misses' },
      { name: 'Anel circular 0..2³²', tip: 'Chaves e nós compartilham o mesmo espaço de hash — chave vai para o próximo nó no sentido horário' },
      { name: 'K/(N+1) remapeamento esperado', tip: 'Adicionar 1 nó move apenas K/(N+1) chaves — muito menos que hash módulo' },
      { name: 'Cassandra e DynamoDB usam', tip: 'Exemplos concretos que mostram que o conceito é produção, não teórico' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '🟣',
    concepts: [
      { name: 'Virtual nodes (vnodes)', tip: 'M tokens por nó físico (100-256) para distribuição uniforme e failover distribuído' },
      { name: 'Hash slots (Redis)', tip: '16384 slots fixos via CRC16 — diferente do anel dinâmico, mas mesmo princípio' },
      { name: 'Preference list por rack/AZ', tip: 'Réplicas em racks diferentes garantem disponibilidade se um rack cair' },
      { name: 'R+W>N para consistency tunable', tip: 'R=1,W=1 eventual | R=quorum,W=quorum strong. Cassandra permite por query.' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '⚡',
    concepts: [
      { name: 'Jump Hash O(ln n)', tip: 'Sem anel, sem estado. Google 2014. Só adiciona no final — não remove do meio' },
      { name: 'Rendezvous HRW O(N)', tip: 'hash(key, node) para todos N nós — maior score vence. Sem estado, CDNs.' },
      { name: 'Bounded loads (1+ε)×média', tip: 'Se nó primário sobrecarregado, próximo no anel absorve. Google 2017.' },
      { name: 'bisect para sorted token array', tip: 'Implementação eficiente: sorted array de tokens + bisect_right para lookup O(log N)' },
      { name: 'Papers: Karger 1997, Dynamo 2007, Jump 2014', tip: 'Citar os papers originais demonstra domínio de referência técnica em entrevistas sênior' },
      { name: 'nodetool toppartitions', tip: 'Ferramenta Cassandra para diagnosticar hot partitions em produção' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ConsistentHashingVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'remap-demo',
      title: 'Hash módulo vs Consistent Hashing',
      subtitle: 'Ajuste N e veja a diferença de remapeamento ao adicionar 1 nó — thundering herd vs 1/N',
      accent: C,
      component: <ConsistentHashingDemo />,
    },
    {
      id: 'ring',
      title: 'Ring interativo',
      subtitle: 'Anel com nós e vnodes — lookup de chave em tempo real, veja a seta apontar para o nó correto',
      accent: C,
      component: <RingVisual />,
    },
    {
      id: 'variants',
      title: 'Variantes do algoritmo',
      subtitle: 'Ring básico → vnodes → Jump hash → Rendezvous → Bounded loads — implementação de cada um',
      accent: C,
      component: <VariantsVisual />,
    },
    {
      id: 'systems',
      title: 'Sistemas reais',
      subtitle: 'Cassandra, DynamoDB, Redis Cluster, Memcached, CDN — como cada um usa consistent hashing',
      accent: C,
      component: (
        <ComparisonTable
          options={SYSTEMS_OPTIONS}
          criteria={SYSTEMS_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Consistent Hashing em sistemas reais"
          description="Cada sistema usa uma variante diferente. Cassandra e Dynamo são os mais completos. Redis usa hash slots. CDNs usam rendezvous."
        />
      ),
    },
    {
      id: 'decision',
      title: 'Qual variante usar?',
      subtitle: 'Árvore de decisão — cluster flexível vs append-only, N grande vs pequeno, performance crítica',
      accent: C,
      component: (
        <DecisionTree
          root={CH_DT_ROOT}
          nodes={CH_DT_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Qual variante de consistent hashing escolher?"
          description="Responda 2-3 perguntas sobre seus requisitos e chegue ao algoritmo correto."
        />
      ),
    },
    {
      id: 'progression',
      title: 'Progressão de conhecimento',
      subtitle: 'Fundamentos → Pleno → Sênior — o que cada nível domina sobre consistent hashing',
      accent: C,
      component: (
        <ProgressionMap
          levels={CH_PROGRESSION}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          heading="Consistent Hashing — progressão de conhecimento"
          description="Do conceito básico até implementação e papers. Sênior cita Karger 1997, Dynamo 2007 e Jump 2014 por nome."
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
