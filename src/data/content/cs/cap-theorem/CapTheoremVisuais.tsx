'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'

// ── Paleta CAP Theorem ────────────────────────────────────────────────────────
const C      = '#A855F7'   // roxo CAP
const SEC    = '#7e22ce'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const AMB    = '#f59e0b'
const PINK   = '#ec4899'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — CAP Triangle Interactive (custom)
// Justificativa: o triângulo C/A/P é visual por natureza, mas "qual sistema cai
// onde" é onde o aprendizado acontece. Hovering em sistemas reais e ver onde
// caem com explicação detalhada é melhor que tabela estática.
// ═══════════════════════════════════════════════════════════════════════════════

type CAPSystem = {
  name: string
  shortName: string
  cap: 'CP' | 'AP' | 'CA-mito'
  pacelc: string
  color: string
  description: string
  details: string
  partitionBehavior: string
  consistency: string
  examples: string[]
}

const CAP_SYSTEMS: CAPSystem[] = [
  {
    name: 'Google Spanner',
    shortName: 'Spanner',
    cap: 'CP',
    pacelc: 'PC/EC',
    color: '#4ade80',
    description: 'Strict serializability via TrueTime + Paxos. ACID em escala global.',
    details: 'Google usa atomic clocks (TrueTime) para sincronização de relógios em microssegundos. Paxos para consenso. ACID com strict serializability — combinação única em escala global.',
    partitionBehavior: 'Lado minoritário fica indisponível. Recusa writes para preservar consistency.',
    consistency: 'External / Strict serializability — ordem global respeitada com real-time.',
    examples: ['Google Cloud Spanner', 'F1 (DB do AdWords)'],
  },
  {
    name: 'CockroachDB',
    shortName: 'CockroachDB',
    cap: 'CP',
    pacelc: 'PC/EC',
    color: '#84cc16',
    description: 'Open-source Spanner alternative. Distributed SQL com strong consistency.',
    details: 'Usa Raft para consenso, HLC (Hybrid Logical Clocks) em vez de TrueTime. Strict serializability. Postgres-compatible wire protocol.',
    partitionBehavior: 'Lado minoritário sem quorum não aceita writes. Strong consistency garantida.',
    consistency: 'Serializable (default), pode configurar para weaker.',
    examples: ['CockroachDB Cloud', 'Workload SaaS multi-tenant'],
  },
  {
    name: 'PostgreSQL (sync replica)',
    shortName: 'PostgreSQL sync',
    cap: 'CP',
    pacelc: 'PC/EC',
    color: '#38bdf8',
    description: 'Primary trava se replica sync não responde. Strong consistency local.',
    details: 'synchronous_commit = remote_apply garante que replica aplicou antes do client receber OK. Em partição, primary fica indisponível esperando ack que não vem.',
    partitionBehavior: 'Primary trava esperando ack da replica. Sistema indisponível para writes.',
    consistency: 'Serializable (com SERIALIZABLE isolation). Strong cross-replica.',
    examples: ['Postgres com sync standby', 'AWS RDS Multi-AZ (semelhante)'],
  },
  {
    name: 'etcd',
    shortName: 'etcd',
    cap: 'CP',
    pacelc: 'PC/EC',
    color: '#22c55e',
    description: 'Key-value distribuído com Raft. Storage do Kubernetes.',
    details: 'Raft para consenso. Strong consistency garantida. Watch API para reactive systems. Líder eleito por majoria; em partição, lado minoritário não aceita writes.',
    partitionBehavior: 'Lado sem quorum (majoria) fica indisponível para writes. Reads podem ser stale via lease.',
    consistency: 'Linearizable.',
    examples: ['Kubernetes etcd', 'CoreOS etcd cluster', 'Docker Swarm'],
  },
  {
    name: 'ZooKeeper',
    shortName: 'ZooKeeper',
    cap: 'CP',
    pacelc: 'PC/EC',
    color: '#10b981',
    description: 'Coordenação distribuída. ZAB protocol. Para leader election, locks, config.',
    details: 'ZAB (ZooKeeper Atomic Broadcast) — protocolo de consenso similar a Paxos/Raft. Sequential consistency garantida. Histórico difícil de operar mas extremamente robusto.',
    partitionBehavior: 'Necessita quorum (N/2+1) para operação. Lado minoritário rejeita writes.',
    consistency: 'Sequential consistency (não linearizable por default — usar sync para isso).',
    examples: ['Apache Kafka', 'HBase coordination', 'Hadoop NameNode HA'],
  },
  {
    name: 'MongoDB (w=majority)',
    shortName: 'MongoDB',
    cap: 'CP',
    pacelc: 'PA/EC',
    color: '#16a34a',
    description: 'Tunable. Default 4.0+ é w=majority — strong consistency.',
    details: 'Replica set com primary + secondaries. write concern w=majority + readConcern majority dá strong consistency. Default antes de 4.0 era mais AP.',
    partitionBehavior: 'Em partição com primary majoritário, continua. Minoritário para writes.',
    consistency: 'Configurable: linearizable (com readConcern linearizable) ou eventual (com readPreference secondaryPreferred).',
    examples: ['Atlas managed MongoDB', 'MongoDB Sharded Clusters'],
  },
  {
    name: 'Cassandra (default)',
    shortName: 'Cassandra',
    cap: 'AP',
    pacelc: 'PA/EL',
    color: '#f59e0b',
    description: 'Tunable consistency. Default CL=ONE é AP. Multi-DC nativo.',
    details: 'Anel de nodes com gossip protocol. Última escrita vence (LWW) por timestamp. Read repair, hinted handoff, anti-entropy via Merkle trees.',
    partitionBehavior: 'Ambos lados continuam aceitando reads/writes. Conflitos resolvidos via LWW.',
    consistency: 'Tunable por query: ONE (eventual), QUORUM (strong se R+W>N), ALL.',
    examples: ['Apple iCloud', 'Netflix metadata', 'Discord messages'],
  },
  {
    name: 'DynamoDB (default)',
    shortName: 'DynamoDB',
    cap: 'AP',
    pacelc: 'PA/EL',
    color: '#fb923c',
    description: 'Default eventual consistency. ConsistentRead=true vira CP por query.',
    details: 'Inspirado no Amazon Dynamo paper (2007). Usa vector clocks internamente. Multi-region via Global Tables. Latência sub-10ms global.',
    partitionBehavior: 'Default: continua aceitando writes em ambos lados. Resolve via LWW timestamp.',
    consistency: 'Eventual (default) ou strongly consistent (ConsistentRead=true, custa 2× latência).',
    examples: ['Amazon checkout', 'Netflix user data', 'Lyft real-time'],
  },
  {
    name: 'CouchDB',
    shortName: 'CouchDB',
    cap: 'AP',
    pacelc: 'PA/EL',
    color: '#ef4444',
    description: 'Master-master replication. MVCC com revision IDs. Built-in conflict handling.',
    details: 'Designed for offline-first (PouchDB no browser). Conflitos retornados ao cliente para resolver. Strong eventual via revision tree.',
    partitionBehavior: 'Cada node continua aceitando writes. Conflicts retornados ao cliente após sync.',
    consistency: 'Eventual com revision tracking.',
    examples: ['CouchDB OSS', 'IBM Cloudant', 'PouchDB (mobile)'],
  },
  {
    name: 'Riak',
    shortName: 'Riak',
    cap: 'AP',
    pacelc: 'PA/EL',
    color: '#dc2626',
    description: 'Vector clocks reais (não LWW). CRDTs nativos. Inspirado no Dynamo.',
    details: 'Único banco mainstream com vector clocks reais — retorna versões em conflito para o cliente. CRDTs nativos (counter, set, map, register). Foco em high availability.',
    partitionBehavior: 'Sloppy quorum + hinted handoff. Continua disponível mesmo com falhas múltiplas.',
    consistency: 'Eventual com vector clocks. CRDTs garantem strong eventual sem perda.',
    examples: ['Bet365', 'Comcast', 'Riak KV histórico'],
  },
  {
    name: 'Redis (replication)',
    shortName: 'Redis',
    cap: 'AP',
    pacelc: 'PA/EL',
    color: '#f87171',
    description: 'Master-replica async (default). Replicação async = AP. Sentinel para failover.',
    details: 'Replicação async = primary aceita writes, replicas seguem em background. Em partição, primary continua mas pode haver split-brain. Redis Cluster + WAIT command para semi-sync.',
    partitionBehavior: 'Master continua aceitando writes mesmo isolado. Possível split-brain sem Sentinel.',
    consistency: 'Eventual (replicação async). WAIT command ajuda mas não garante.',
    examples: ['Cache web', 'Session store', 'Pub/Sub leve'],
  },
  {
    name: 'PostgreSQL (single node)',
    shortName: 'PG single',
    cap: 'CA-mito',
    pacelc: '—',
    color: '#475569',
    description: 'Single-node não tem partição — "CA" só faz sentido nesse contexto.',
    details: 'PostgreSQL single-instance é ACID + 100% disponível enquanto o servidor estiver ativo. Não há P porque não há replicação. Mito do CAP "real" é sistemas que assumem rede perfeita.',
    partitionBehavior: 'N/A — sem partição em single node.',
    consistency: 'Serializable (com SERIALIZABLE isolation).',
    examples: ['PostgreSQL local', 'SQLite'],
  },
]

function CAPTriangleVisual() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string>('Cassandra (default)')
  const active = CAP_SYSTEMS.find(s => s.name === (hovered ?? selected))!

  // Posições no triângulo SVG (180w × 200h)
  function getPosition(system: CAPSystem): { x: number; y: number } {
    if (system.cap === 'CP') {
      // Direita do triângulo
      const idx = CAP_SYSTEMS.filter(s => s.cap === 'CP').indexOf(system)
      const baseX = 220
      const baseY = 70
      return { x: baseX - (idx % 3) * 18, y: baseY + Math.floor(idx / 3) * 22 }
    }
    if (system.cap === 'AP') {
      // Esquerda do triângulo
      const idx = CAP_SYSTEMS.filter(s => s.cap === 'AP').indexOf(system)
      const baseX = 65
      const baseY = 70
      return { x: baseX + (idx % 3) * 18, y: baseY + Math.floor(idx / 3) * 22 }
    }
    return { x: 175, y: 175 }
  }

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>CAP Triangle — sistemas reais por classificação</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Hover ou clique em qualquer sistema para ver detalhes técnicos. Mesmo sistema pode ser CP ou AP por configuração (Cassandra QUORUM vira CP).</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 22 }}>
        {/* Triangle SVG */}
        <div style={{ position: 'relative', width: 320, height: 280 }}>
          <svg viewBox="0 0 320 280" width="320" height="280">
            {/* Triangle */}
            <polygon points="160,15 25,260 295,260" fill="none" stroke="#475569" stroke-width="2" />
            {/* Highlighted regions */}
            <polygon points="160,15 80,160 240,160" fill="rgba(168,85,247,.05)" />
            <polygon points="80,160 25,260 160,260" fill="rgba(74,222,128,.04)" />
            <polygon points="240,160 160,260 295,260" fill="rgba(56,189,248,.04)" />

            {/* Vertices */}
            <circle cx="160" cy="15" r="24" fill="#1e293b" stroke="#A855F7" strokeWidth="2" />
            <text x="160" y="14" textAnchor="middle" fontSize="13" fontWeight="700" fill="#A855F7" fontFamily="Space Grotesk,sans-serif">
              <tspan x="160" dy="5">C</tspan>
            </text>
            <text x="160" y="34" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Space Grotesk,sans-serif">Consistency</text>

            <circle cx="25" cy="260" r="24" fill="#1e293b" stroke="#4ade80" strokeWidth="2" />
            <text x="25" y="259" textAnchor="middle" fontSize="13" fontWeight="700" fill="#4ade80" fontFamily="Space Grotesk,sans-serif">
              <tspan x="25" dy="5">A</tspan>
            </text>
            <text x="25" y="277" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Space Grotesk,sans-serif">Availability</text>

            <circle cx="295" cy="260" r="24" fill="#1e293b" stroke="#fbbf24" strokeWidth="2" />
            <text x="295" y="259" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fbbf24" fontFamily="Space Grotesk,sans-serif">
              <tspan x="295" dy="5">P</tspan>
            </text>
            <text x="295" y="277" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Space Grotesk,sans-serif">Partition</text>

            {/* Region labels */}
            <text x="225" y="100" fontSize="10" fontWeight="700" fill="#A855F7" fontFamily="Space Grotesk,sans-serif">CP</text>
            <text x="60" y="100" fontSize="10" fontWeight="700" fill="#4ade80" fontFamily="Space Grotesk,sans-serif">AP</text>
            <text x="160" y="220" textAnchor="middle" fontSize="9" fill="#ef4444" fontFamily="Space Grotesk,sans-serif" fontWeight="700">CA = mito</text>

            {/* System dots */}
            {CAP_SYSTEMS.map(s => {
              const pos = getPosition(s)
              const isActive = (hovered ?? selected) === s.name
              return (
                <g key={s.name}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 7 : 5}
                    fill={s.color}
                    stroke={isActive ? '#fff' : '#1e293b'}
                    strokeWidth={isActive ? 2 : 1}
                    style={{ cursor: 'pointer', transition: 'all .2s' }}
                    onMouseEnter={() => setHovered(s.name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(s.name)}
                  />
                </g>
              )
            })}
          </svg>

          {/* Legenda */}
          <div style={{ marginTop: 12, fontSize: 9, color: FGMUTE, lineHeight: 1.7 }}>
            <strong style={{ color: '#A855F7' }}>CP</strong> = consistency em partição<br />
            <strong style={{ color: '#4ade80' }}>AP</strong> = availability em partição<br />
            <strong style={{ color: '#ef4444' }}>CA</strong> = mito (single-node ou rede perfeita)
          </div>
        </div>

        {/* Detalhes do sistema selecionado */}
        <div style={{
          background: CARD,
          border: `2px solid ${active.color}40`,
          borderRadius: 12,
          padding: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: active.color,
              boxShadow: `0 0 12px ${active.color}`,
            }} />
            <div>
              <div style={{ color: active.color, fontSize: 15, fontWeight: 800 }}>{active.name}</div>
              <div style={{ color: FGMUTE, fontSize: 10 }}>
                CAP: <span style={{ color: active.color, fontWeight: 700 }}>{active.cap}</span> · PACELC: <span style={{ color: FG, fontWeight: 700 }}>{active.pacelc}</span>
              </div>
            </div>
          </div>

          <div style={{ color: FG, fontSize: 12, marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.6 }}>
            {active.description}
          </div>

          <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: 10, marginBottom: 10 }}>
            <div style={{ color: active.color, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 4 }}>DETALHES TÉCNICOS</div>
            <div style={{ color: FGMUTE, fontSize: 11, lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>{active.details}</div>
          </div>

          <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: 10, marginBottom: 10 }}>
            <div style={{ color: AMB, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 4 }}>EM PARTIÇÃO</div>
            <div style={{ color: FGMUTE, fontSize: 11, lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>{active.partitionBehavior}</div>
          </div>

          <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: 10, marginBottom: 10 }}>
            <div style={{ color: SKY, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 4 }}>MODELO DE CONSISTÊNCIA</div>
            <div style={{ color: FGMUTE, fontSize: 11, lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>{active.consistency}</div>
          </div>

          <div>
            <div style={{ color: GRN, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 6 }}>EXEMPLOS REAIS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {active.examples.map(ex => (
                <span key={ex} style={{
                  background: BG,
                  border: `1px solid ${LINE}`,
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 10,
                  color: FG,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{ex}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Consistency Models Spectrum (custom)
// Justificativa: a hierarquia "linearizable → sequential → causal → eventual" é
// um espectro que confunde até sêniores. Visualizar como linha do tempo com
// exemplos práticos do que é/não é permitido em cada nível ancora o conceito.
// ═══════════════════════════════════════════════════════════════════════════════

type ConsistencyLevel = {
  id: string
  name: string
  shortName: string
  position: number  // 0-100
  color: string
  description: string
  examples: string[]
  guarantees: string[]
  costs: string[]
}

const CONSISTENCY_LEVELS: ConsistencyLevel[] = [
  {
    id: 'strict',
    name: 'Strict Serializability',
    shortName: 'Strict Serial',
    position: 100,
    color: '#10b981',
    description: 'Linearizability + Serializability. Toda operação atômica em ordem real-time global; transações executam em alguma ordem serial respeitando real-time.',
    examples: ['Google Spanner', 'CockroachDB'],
    guarantees: ['Real-time order global', 'Transações serializable', 'Sem fenômenos de isolation'],
    costs: ['Latência alta (consenso global)', 'Custo de hardware (TrueTime)', 'Throughput limitado'],
  },
  {
    id: 'linear',
    name: 'Linearizability',
    shortName: 'Linearizable',
    position: 90,
    color: '#22c55e',
    description: 'Operações únicas (registers, KV) parecem atômicas em algum ponto entre invocação e resposta. Ordem real-time global preservada. Não inclui transações multi-op.',
    examples: ['etcd', 'ZooKeeper (com sync)', 'DynamoDB (ConsistentRead)'],
    guarantees: ['Toda leitura vê última escrita confirmada', 'Sem stale reads', 'Composable'],
    costs: ['Round-trip para quorum', 'Latência ms vs sub-ms eventual'],
  },
  {
    id: 'serializable',
    name: 'Serializability',
    shortName: 'Serializable',
    position: 80,
    color: '#84cc16',
    description: 'Transações executam em ALGUMA ordem serial. Não especifica qual ordem nem real-time. Postgres com SERIALIZABLE isolation faz isso single-node.',
    examples: ['PostgreSQL (SERIALIZABLE)', 'MySQL (Serializable isolation)'],
    guarantees: ['Sem race conditions entre transações', 'Isolation forte'],
    costs: ['Mais aborts (serialization failures)', 'Pode não respeitar real-time entre clientes'],
  },
  {
    id: 'snapshot',
    name: 'Snapshot Isolation',
    shortName: 'SI',
    position: 70,
    color: '#a3e635',
    description: 'Cada transação vê snapshot consistente do início. Permite write skew (anomalia que serializability previne).',
    examples: ['PostgreSQL (REPEATABLE READ)', 'Oracle', 'CockroachDB (default)'],
    guarantees: ['Reads consistentes dentro da tx', 'Sem dirty/non-repeatable reads'],
    costs: ['Write skew possível', 'Espaço para versões (MVCC)'],
  },
  {
    id: 'causal',
    name: 'Causal Consistency',
    shortName: 'Causal',
    position: 55,
    color: '#facc15',
    description: 'Operações causalmente relacionadas (read-then-write) são vistas em ordem por todos. Operações concorrentes podem aparecer em qualquer ordem.',
    examples: ['MongoDB (causal sessions)', 'COPS', 'Pileus'],
    guarantees: ['Read-your-writes', 'Monotonic reads', 'Causal order preservada'],
    costs: ['Mais complexo que strong, mais simples que linearizable', 'Dependency tracking'],
  },
  {
    id: 'session',
    name: 'Session Consistency',
    shortName: 'Session',
    position: 40,
    color: '#fbbf24',
    description: 'Garantias dentro de uma sessão de cliente: read-your-writes, monotonic reads, monotonic writes. Não cross-session.',
    examples: ['Azure Cosmos DB (default)', 'DynamoDB (sticky)'],
    guarantees: ['Cliente sempre vê suas escritas', 'Reads não voltam no tempo dentro da sessão'],
    costs: ['Sticky sessions necessárias', 'Não funciona cross-tab/device'],
  },
  {
    id: 'monotonic',
    name: 'Monotonic Reads',
    shortName: 'Monotonic',
    position: 25,
    color: '#fb923c',
    description: 'Leituras sucessivas nunca voltam no tempo. Pode pular para frente, mas nunca para trás.',
    examples: ['Cassandra (LOCAL_ONE com sticky)', 'CDN/cache layers'],
    guarantees: ['Não vê estado mais antigo após ver estado mais novo'],
    costs: ['Pode ver estados intermediários inconsistentes'],
  },
  {
    id: 'eventual',
    name: 'Eventual Consistency',
    shortName: 'Eventual',
    position: 5,
    color: '#ef4444',
    description: 'Sistema converge eventualmente sem garantia de QUANDO ou de ordem. Sem novos updates, todas réplicas eventualmente convergem.',
    examples: ['Cassandra (CL=ONE)', 'DynamoDB (default)', 'CouchDB'],
    guarantees: ['Convergência (sob inputs estáveis)'],
    costs: ['Stale reads', 'Reads inconsistentes', 'Cliente precisa lidar com conflitos'],
  },
]

function ConsistencyModelsSpectrum() {
  const [selected, setSelected] = useState<string>('linear')
  const active = CONSISTENCY_LEVELS.find(l => l.id === selected)!

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Espectro de modelos de consistência</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Do mais forte ao mais fraco. Sistemas reais geralmente vivem entre esses pontos — clique para detalhar cada nível.</p>
      </div>

      {/* Linha do espectro */}
      <div style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: '20px 16px',
        marginBottom: 16,
        position: 'relative',
      }}>
        {/* Eixo */}
        <div style={{
          height: 6,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #ef4444 0%, #fb923c 25%, #fbbf24 50%, #84cc16 75%, #22c55e 100%)',
          position: 'relative',
          marginBottom: 22,
        }}>
          {/* Markers */}
          {CONSISTENCY_LEVELS.map(level => {
            const isSel = level.id === selected
            return (
              <button
                key={level.id}
                onClick={() => setSelected(level.id)}
                style={{
                  position: 'absolute',
                  left: `${level.position}%`,
                  top: -8,
                  transform: 'translateX(-50%)',
                  width: isSel ? 24 : 18,
                  height: isSel ? 24 : 18,
                  borderRadius: '50%',
                  background: level.color,
                  border: `${isSel ? 3 : 2}px solid ${isSel ? '#fff' : BG}`,
                  cursor: 'pointer',
                  boxShadow: isSel ? `0 0 14px ${level.color}` : 'none',
                  transition: 'all .2s',
                  padding: 0,
                }}
                title={level.name}
              />
            )
          })}
        </div>

        {/* Labels do eixo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
          <div style={{ color: '#ef4444', fontWeight: 700, letterSpacing: '.05em' }}>← MAIS FRACO (eventual)</div>
          <div style={{ color: '#22c55e', fontWeight: 700, letterSpacing: '.05em' }}>MAIS FORTE (strict serial) →</div>
        </div>

        {/* Lista de modelos */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {CONSISTENCY_LEVELS.map(level => (
            <button
              key={level.id}
              onClick={() => setSelected(level.id)}
              style={{
                background: level.id === selected ? `${level.color}25` : BG,
                border: `1.5px solid ${level.id === selected ? level.color : LINE}`,
                borderRadius: 6,
                padding: '6px 8px',
                fontSize: 9.5,
                color: level.id === selected ? level.color : FG,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
                textAlign: 'left',
                transition: 'all .2s',
              }}
            >
              {level.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Detalhes */}
      <div style={{
        background: CARD,
        border: `2px solid ${active.color}40`,
        borderRadius: 12,
        padding: 18,
      }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: active.color, fontSize: 16, fontWeight: 800 }}>{active.name}</div>
        </div>

        <div style={{ color: FG, fontSize: 12, marginBottom: 14, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.7 }}>
          {active.description}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: 12 }}>
            <div style={{ color: GRN, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 8 }}>GARANTIAS</div>
            {active.guarantees.map((g, i) => (
              <div key={i} style={{ fontSize: 10.5, color: FG, padding: '3px 0', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.5 }}>
                <span style={{ color: GRN, marginRight: 6 }}>✓</span>{g}
              </div>
            ))}
          </div>
          <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: 12 }}>
            <div style={{ color: AMB, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 8 }}>CUSTOS</div>
            {active.costs.map((c, i) => (
              <div key={i} style={{ fontSize: 10.5, color: FG, padding: '3px 0', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.5 }}>
                <span style={{ color: AMB, marginRight: 6 }}>!</span>{c}
              </div>
            ))}
          </div>
          <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: 12 }}>
            <div style={{ color: C, fontSize: 9, fontWeight: 700, letterSpacing: '.1em', marginBottom: 8 }}>EXEMPLOS</div>
            {active.examples.map((e, i) => (
              <div key={i} style={{
                fontSize: 10,
                color: FG,
                padding: '4px 8px',
                background: `${active.color}10`,
                borderLeft: `2px solid ${active.color}`,
                borderRadius: 3,
                marginBottom: 4,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Quorum Calculator (custom interactive)
// Justificativa: R + W > N é fórmula central mas abstrata. Calculadora
// interativa com sliders, mostrando "strong vs eventual" em tempo real e
// fault tolerance, fixa o conceito muito melhor que ler.
// ═══════════════════════════════════════════════════════════════════════════════

function QuorumCalculator() {
  const [N, setN] = useState(5)
  const [R, setR] = useState(3)
  const [W, setW] = useState(3)

  const isStrong = R + W > N
  const overlap = Math.max(0, R + W - N)
  const tolerateReads = N - R
  const tolerateWrites = N - W

  function setNAndAdjust(newN: number) {
    setN(newN)
    if (R > newN) setR(newN)
    if (W > newN) setW(newN)
  }

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Quorum Calculator — R + W &gt; N</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Ajuste N (réplicas), R (read quorum) e W (write quorum). Veja em tempo real se a configuração garante strong consistency e quanto fault tolerance permite.</p>
      </div>

      {/* Sliders */}
      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: 18, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <SliderControl label="N (réplicas)" value={N} min={1} max={9} onChange={setNAndAdjust} color={C} hint="Total de réplicas no cluster" />
          <SliderControl label="W (write quorum)" value={W} min={1} max={N} onChange={setW} color={SKY} hint="Réplicas que confirmam write" />
          <SliderControl label="R (read quorum)" value={R} min={1} max={N} onChange={setR} color={GRN} hint="Réplicas consultadas em read" />
        </div>
      </div>

      {/* Resultado principal */}
      <div style={{
        background: CARD,
        border: `2px solid ${isStrong ? GRN : AMB}`,
        borderRadius: 12,
        padding: 18,
        marginBottom: 14,
        boxShadow: `0 0 20px ${isStrong ? GRN : AMB}30`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ color: FGMUTE, fontSize: 10, letterSpacing: '.1em', marginBottom: 4, textTransform: 'uppercase' }}>Resultado</div>
            <div style={{ color: isStrong ? GRN : AMB, fontSize: 20, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
              R + W = {R} + {W} = {R + W} {isStrong ? '>' : '≤'} {N} = N
            </div>
            <div style={{ color: isStrong ? GRN : AMB, fontSize: 13, fontWeight: 700, marginTop: 4 }}>
              {isStrong ? '✓ STRONG CONSISTENCY' : '⚠ EVENTUAL CONSISTENCY'}
            </div>
          </div>
          <div style={{
            background: isStrong ? `${GRN}15` : `${AMB}15`,
            border: `1px solid ${isStrong ? GRN : AMB}`,
            borderRadius: 8,
            padding: '12px 16px',
            textAlign: 'center',
          }}>
            <div style={{ color: FGMUTE, fontSize: 9, letterSpacing: '.1em' }}>OVERLAP</div>
            <div style={{ color: isStrong ? GRN : AMB, fontSize: 24, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
              {overlap}
            </div>
            <div style={{ color: FGMUTE, fontSize: 9 }}>nodes</div>
          </div>
        </div>

        <div style={{
          background: BG,
          borderLeft: `3px solid ${isStrong ? GRN : AMB}`,
          borderRadius: 6,
          padding: '10px 14px',
          fontSize: 11,
          color: FGMUTE,
          lineHeight: 1.7,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {isStrong ? (
            <><strong style={{ color: GRN }}>Por que strong:</strong> qualquer conjunto de W writes e qualquer conjunto de R reads se sobrepõem em pelo menos {overlap} node{overlap > 1 ? 's' : ''}. Esse{overlap > 1 ? 's' : ''} node{overlap > 1 ? 's têm' : ' tem'} a última escrita. Toda leitura encontra valor mais recente.</>
          ) : (
            <><strong style={{ color: AMB }}>Por que eventual:</strong> sem sobreposição garantida entre quorums de read e write, leitura pode ir para nodes que ainda não receberam o write. Stale reads possíveis. Resolução via read repair, LWW, vector clocks.</>
          )}
        </div>
      </div>

      {/* Fault tolerance + Cassandra equivalents */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: 16 }}>
          <div style={{ color: PRP, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', marginBottom: 12, textTransform: 'uppercase' }}>Fault Tolerance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: BG, borderRadius: 6 }}>
              <span style={{ color: FG, fontSize: 11 }}>Reads continuam com até</span>
              <span style={{ color: GRN, fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{tolerateReads}</span>
              <span style={{ color: FGMUTE, fontSize: 10 }}>nodes down</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: BG, borderRadius: 6 }}>
              <span style={{ color: FG, fontSize: 11 }}>Writes continuam com até</span>
              <span style={{ color: SKY, fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{tolerateWrites}</span>
              <span style={{ color: FGMUTE, fontSize: 10 }}>nodes down</span>
            </div>
          </div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: 16 }}>
          <div style={{ color: AMB, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', marginBottom: 12, textTransform: 'uppercase' }}>Equivalente Cassandra</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <CassandraEquivalent label="ONE" desc="W=1 ou R=1" active={W === 1 || R === 1} />
            <CassandraEquivalent label="QUORUM" desc={`W=R=⌈N/2⌉+1 = ${Math.floor(N / 2) + 1}`} active={W === Math.floor(N / 2) + 1 && R === Math.floor(N / 2) + 1} />
            <CassandraEquivalent label="ALL" desc={`W=N=${N} ou R=N=${N}`} active={W === N || R === N} />
          </div>
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <PresetBtn label="Strong + balanceado" onClick={() => { setN(5); setR(3); setW(3) }} color={GRN} />
        <PresetBtn label="Strong + read fast" onClick={() => { setN(5); setR(1); setW(5) }} color={SKY} />
        <PresetBtn label="Strong + write fast" onClick={() => { setN(5); setR(5); setW(1) }} color={PRP} />
        <PresetBtn label="Eventual (mais rápido)" onClick={() => { setN(5); setR(1); setW(1) }} color={AMB} />
      </div>
    </div>
  )

  function SliderControl({ label, value, min, max, onChange, color, hint }: {
    label: string; value: number; min: number; max: number; onChange: (v: number) => void; color: string; hint: string
  }) {
    return (
      <div style={{
        background: BG,
        border: `1.5px solid ${color}40`,
        borderRadius: 8,
        padding: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ color: color, fontSize: 10, fontWeight: 700, letterSpacing: '.05em' }}>{label}</div>
          <div style={{ color: color, fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: color,
            cursor: 'pointer',
          }}
        />
        <div style={{ color: FGMUTE, fontSize: 9, marginTop: 4 }}>{hint}</div>
      </div>
    )
  }

  function CassandraEquivalent({ label, desc, active }: { label: string; desc: string; active: boolean }) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 10px',
        background: active ? `${C}20` : BG,
        border: `1px solid ${active ? C : LINE}`,
        borderRadius: 6,
        fontSize: 10,
      }}>
        <span style={{ color: active ? C : FG, fontWeight: 700 }}>{label}</span>
        <span style={{ color: FGMUTE, fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>{desc}</span>
      </div>
    )
  }

  function PresetBtn({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
    return (
      <button
        onClick={onClick}
        style={{
          background: 'transparent',
          border: `1px solid ${color}60`,
          color: color,
          borderRadius: 6,
          padding: '6px 12px',
          fontSize: 10,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {label}
      </button>
    )
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Eventual Consistency Timeline (custom)
// Justificativa: stale reads são abstratos sem ver a sequência temporal. Animar
// write em A → propagação → momento em que B vê o valor é o que torna
// "eventual" concreto.
// ═══════════════════════════════════════════════════════════════════════════════

function EventualConsistencyTimeline() {
  const [time, setTime] = useState(0)

  // Timeline events
  const timelineSteps = [
    { t: 0,   label: 'Estado inicial', desc: 'Todos os 3 nodes têm valor "balance=100"' },
    { t: 10,  label: 'Cliente escreve em A', desc: 'A: balance=500. Replicação ainda não começou.' },
    { t: 20,  label: 'Cliente lê de B', desc: 'B retorna 100 (STALE). Cliente vê valor antigo.' },
    { t: 35,  label: 'A inicia replicação para B', desc: 'Mensagem em flight (latência de rede).' },
    { t: 50,  label: 'B recebe e aplica', desc: 'B: balance=500. Próximo read de B vê 500.' },
    { t: 60,  label: 'A replica para C', desc: 'Propagação assíncrona continua.' },
    { t: 75,  label: 'C recebe e aplica', desc: 'C: balance=500. Sistema convergiu.' },
    { t: 100, label: 'Eventual consistency atingida', desc: 'Todos os nodes consistentes — mas demorou ~75ms desde o write.' },
  ]

  function getNodeValue(node: 'A' | 'B' | 'C'): { value: number; status: 'ok' | 'stale' | 'updating' } {
    if (node === 'A') {
      if (time < 10) return { value: 100, status: 'ok' }
      return { value: 500, status: 'ok' }
    }
    if (node === 'B') {
      if (time < 10) return { value: 100, status: 'ok' }
      if (time < 35) return { value: 100, status: 'stale' }
      if (time < 50) return { value: 100, status: 'updating' }
      return { value: 500, status: 'ok' }
    }
    // C
    if (time < 10) return { value: 100, status: 'ok' }
    if (time < 60) return { value: 100, status: 'stale' }
    if (time < 75) return { value: 100, status: 'updating' }
    return { value: 500, status: 'ok' }
  }

  const currentStep = timelineSteps.filter(s => s.t <= time).pop()!

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>Eventual consistency — write em A propaga para B e C</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Mova o slider do tempo. Veja o write em A propagar para B (mais rápido) e C (mais lento). Stale reads acontecem entre o write e a propagação.</p>
      </div>

      {/* Nodes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18 }}>
        {(['A', 'B', 'C'] as const).map(node => {
          const { value, status } = getNodeValue(node)
          const colors: Record<typeof status, string> = {
            ok: GRN,
            stale: RED,
            updating: AMB,
          }
          const labels: Record<typeof status, string> = {
            ok: 'CONSISTENTE',
            stale: 'STALE',
            updating: 'PROPAGANDO...',
          }
          const color = colors[status]

          return (
            <div
              key={node}
              style={{
                background: CARD,
                border: `2px solid ${color}`,
                borderRadius: 12,
                padding: 18,
                textAlign: 'center',
                transition: 'all .3s',
                boxShadow: `0 0 18px ${color}30`,
              }}
            >
              <div style={{ color: FGMUTE, fontSize: 10, letterSpacing: '.1em', marginBottom: 6 }}>NODE {node}</div>
              <div style={{ color: color, fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
                {value}
              </div>
              <div style={{ color: FGMUTE, fontSize: 9, marginBottom: 10 }}>balance</div>
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: `${color}20`,
                border: `1px solid ${color}`,
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 700,
                color: color,
                letterSpacing: '.05em',
              }}>
                {labels[status]}
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline slider */}
      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ color: C, fontSize: 11, fontWeight: 700, letterSpacing: '.1em' }}>TEMPO (ms)</div>
          <div style={{ color: FG, fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>{time}</div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={time}
          onChange={e => setTime(Number(e.target.value))}
          style={{ width: '100%', accentColor: C, cursor: 'pointer' }}
        />

        {/* Event markers */}
        <div style={{ position: 'relative', height: 20, marginTop: 6 }}>
          {timelineSteps.map(s => (
            <div
              key={s.t}
              style={{
                position: 'absolute',
                left: `${s.t}%`,
                top: 0,
                width: 2,
                height: 8,
                background: s.t <= time ? C : LINE,
                transition: 'background .2s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Current event */}
      <div style={{
        background: CARD,
        borderLeft: `3px solid ${C}`,
        borderRadius: 6,
        padding: '12px 14px',
        marginBottom: 12,
      }}>
        <div style={{ color: C, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{currentStep.label}</div>
        <div style={{ color: FGMUTE, fontSize: 11, lineHeight: 1.6, fontFamily: "'Space Grotesk', sans-serif" }}>
          {currentStep.desc}
        </div>
      </div>

      {/* Insight */}
      <div style={{
        background: CARD2,
        border: `1px solid ${AMB}40`,
        borderRadius: 8,
        padding: '12px 14px',
        fontSize: 11,
        color: FGMUTE,
        lineHeight: 1.7,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <strong style={{ color: AMB }}>Lição:</strong> em sistema AP com replicação async, ler de qualquer node DURANTE a janela de propagação retorna stale data. Para evitar: (1) sticky sessions (cliente sempre no mesmo node), (2) quorum reads (R+W &gt; N), (3) read-your-writes consistency (cliente envia versão da sua última escrita). Cassandra QUORUM resolve; CL=ONE não.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — CRDT G-Counter Convergence (custom)
// Justificativa: CRDTs convergem "magicamente" e ver isso acontecer com 3 nodes
// incrementando offline e mergeando depois é o que destrava o aha-moment.
// Numbers tell the story.
// ═══════════════════════════════════════════════════════════════════════════════

type GCounterState = {
  A: number
  B: number
  C: number
}

function GCounterCRDTVisual() {
  const initial: GCounterState = { A: 0, B: 0, C: 0 }
  const [stateA, setStateA] = useState<GCounterState>(initial)
  const [stateB, setStateB] = useState<GCounterState>(initial)
  const [stateC, setStateC] = useState<GCounterState>(initial)

  function increment(node: 'A' | 'B' | 'C') {
    if (node === 'A') setStateA({ ...stateA, A: stateA.A + 1 })
    if (node === 'B') setStateB({ ...stateB, B: stateB.B + 1 })
    if (node === 'C') setStateC({ ...stateC, C: stateC.C + 1 })
  }

  function merge(from: GCounterState, into: GCounterState): GCounterState {
    return {
      A: Math.max(from.A, into.A),
      B: Math.max(from.B, into.B),
      C: Math.max(from.C, into.C),
    }
  }

  function syncAll() {
    const merged = merge(merge(stateA, stateB), stateC)
    setStateA(merged)
    setStateB(merged)
    setStateC(merged)
  }

  function reset() {
    setStateA(initial)
    setStateB(initial)
    setStateC(initial)
  }

  function value(s: GCounterState): number {
    return s.A + s.B + s.C
  }

  function NodePanel({ label, state, color, onIncrement }: { label: string; state: GCounterState; color: string; onIncrement: () => void }) {
    return (
      <div style={{
        background: CARD,
        border: `2px solid ${color}40`,
        borderRadius: 12,
        padding: 16,
        textAlign: 'center',
      }}>
        <div style={{ color: FGMUTE, fontSize: 10, letterSpacing: '.1em', marginBottom: 6 }}>NODE {label}</div>
        <div style={{ color: color, fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
          {value(state)}
        </div>
        <div style={{ color: FGMUTE, fontSize: 9, marginBottom: 10 }}>valor total</div>

        <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 6, padding: 8, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
          <div style={{ color: FGMUTE, fontSize: 8, letterSpacing: '.1em', marginBottom: 4 }}>STATE VECTOR</div>
          <div style={{ color: FG }}>{`{ A: ${state.A}, B: ${state.B}, C: ${state.C} }`}</div>
        </div>

        <button
          onClick={onIncrement}
          style={{
            background: color,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 14px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            width: '100%',
          }}
        >
          + INCREMENTAR {label}
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: 24, fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ color: FG, margin: 0, fontSize: 16, fontWeight: 800 }}>G-Counter CRDT — convergência sem coordenação</h3>
        <p style={{ color: FGMUTE, fontSize: 12, margin: '4px 0 0' }}>Cada node incrementa só seu próprio counter. Merge = max componente-a-componente. Comutativo + associativo + idempotente — converge sem perder updates concorrentes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
        <NodePanel label="A" state={stateA} color={GRN} onIncrement={() => increment('A')} />
        <NodePanel label="B" state={stateB} color={SKY} onIncrement={() => increment('B')} />
        <NodePanel label="C" state={stateC} color={PRP} onIncrement={() => increment('C')} />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 14 }}>
        <button
          onClick={syncAll}
          style={{
            background: C,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 22px',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '.05em',
          }}
        >
          ↻ SYNC ALL (anti-entropy)
        </button>
        <button
          onClick={reset}
          style={{
            background: 'transparent',
            color: FG,
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: '10px 22px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          RESET
        </button>
      </div>

      <div style={{
        background: CARD2,
        borderLeft: `3px solid ${C}`,
        borderRadius: 8,
        padding: '12px 14px',
        fontSize: 11,
        color: FGMUTE,
        lineHeight: 1.7,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        <strong style={{ color: C }}>Experimento:</strong> incremente independentemente em A (3×), B (5×), C (2×). Veja que cada node só vê seu próprio progresso (A vê 3, B vê 5, C vê 2). Clique <strong>SYNC ALL</strong> — todos convergem para 10 sem perder nenhum increment, mesmo tendo trabalhado offline. Comparado com LWW (last-write-wins), que perderia 9 dos 10 increments.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — System Comparison (ComparisonTable)
// Justificativa: 4 sistemas distribuídos × 6 critérios é o tipo de comparação
// que entrevistadores fazem em system design. Ver lado a lado é melhor que ler
// keypoint por keypoint.
// ═══════════════════════════════════════════════════════════════════════════════

const SYSTEM_OPTIONS: ComparisonOption[] = [
  { id: 'cassandra', label: 'Cassandra', sublabel: 'AP tunable', color: AMB },
  { id: 'dynamo', label: 'DynamoDB', sublabel: 'AP gerenciado', color: '#fb923c' },
  { id: 'mongo', label: 'MongoDB', sublabel: 'CP (w=majority)', color: GRN },
  { id: 'spanner', label: 'Spanner', sublabel: 'Strict serial', color: PRP },
]

const SYSTEM_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'cap',
    label: 'CAP classification',
    category: 'Fundamentos',
    description: 'Default behavior em partição',
    values: {
      cassandra: { rating: 'good', note: 'AP por default. CL=QUORUM vira CP por query.' },
      dynamo: { rating: 'good', note: 'AP por default. ConsistentRead=true vira CP.' },
      mongo: { rating: 'good', note: 'CP com w=majority + readConcern majority (default 4.0+).' },
      spanner: { rating: 'excellent', note: 'CP estrito. Strict serializability via TrueTime.' },
    },
  },
  {
    id: 'pacelc',
    label: 'PACELC',
    category: 'Fundamentos',
    description: 'Comportamento em partição e em normal',
    values: {
      cassandra: { rating: 'good', note: 'PA/EL — disponibilidade + latência baixa' },
      dynamo: { rating: 'good', note: 'PA/EL — multi-region < 10ms' },
      mongo: { rating: 'good', note: 'PA/EC — disponível em partição, consistente em normal' },
      spanner: { rating: 'excellent', note: 'PC/EC — sempre consistency, custa latência' },
    },
  },
  {
    id: 'consistency',
    label: 'Modelo de consistência',
    category: 'Garantias',
    description: 'Garantia mais forte oferecida',
    values: {
      cassandra: { rating: 'fair', note: 'Tunable: ONE (eventual) → ALL (strong)' },
      dynamo: { rating: 'good', note: 'Eventual ou strongly consistent (ConsistentRead)' },
      mongo: { rating: 'good', note: 'Linearizable (linearizable readConcern)' },
      spanner: { rating: 'excellent', note: 'External / strict serializable' },
    },
  },
  {
    id: 'latency',
    label: 'Latência típica',
    category: 'Performance',
    description: 'Latência de read e write',
    values: {
      cassandra: { rating: 'excellent', note: 'Sub-ms em LOCAL_ONE, ~5-10ms em LOCAL_QUORUM' },
      dynamo: { rating: 'excellent', note: 'Sub-10ms global. ConsistentRead 2× mais lento.' },
      mongo: { rating: 'good', note: '~5-20ms com w=majority' },
      spanner: { rating: 'fair', note: '50-200ms cross-region (custo de TrueTime + Paxos)' },
    },
  },
  {
    id: 'scale',
    label: 'Escala',
    category: 'Performance',
    description: 'Capacidade de escala horizontal',
    values: {
      cassandra: { rating: 'excellent', note: 'Linear scaling — adicionar nodes melhora throughput' },
      dynamo: { rating: 'excellent', note: 'Auto-scaling, sub-millissegundo em qualquer escala' },
      mongo: { rating: 'good', note: 'Sharding manual, mais operacional' },
      spanner: { rating: 'excellent', note: 'Escala global automática, 99.999% SLA' },
    },
  },
  {
    id: 'cost',
    label: 'Custo operacional',
    category: 'Custo',
    description: 'Self-hosted vs managed',
    values: {
      cassandra: { rating: 'fair', note: 'Self-host complexo. DataStax Astra = managed.' },
      dynamo: { rating: 'good', note: 'Managed, mas pricing por RCU/WCU pode surpreender' },
      mongo: { rating: 'good', note: 'Atlas managed disponível, comunity self-host' },
      spanner: { rating: 'poor', note: 'Caro. Mínimo $0.30/h por node + storage' },
    },
  },
  {
    id: 'use-case',
    label: 'Caso de uso ideal',
    category: 'Decisão',
    description: 'Quando escolher',
    values: {
      cassandra: { rating: 'good', note: 'Multi-DC com latência baixa, time-series, escrita pesada' },
      dynamo: { rating: 'excellent', note: 'Serverless apps, event sourcing, key-value de baixa latência' },
      mongo: { rating: 'good', note: 'Document store flexível, prototipagem rápida, geo-distributed' },
      spanner: { rating: 'good', note: 'Finanças globais, inventário crítico, multi-region ACID' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CapTheoremVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'triangle',
      title: 'CAP Triangle',
      subtitle: 'Sistemas reais por classificação CAP — clique para detalhes',
      accent: C,
      component: <CAPTriangleVisual />,
    },
    {
      id: 'consistency-spectrum',
      title: 'Modelos de consistência',
      subtitle: 'Espectro do mais forte (linearizable) ao mais fraco (eventual)',
      accent: C,
      component: <ConsistencyModelsSpectrum />,
    },
    {
      id: 'quorum',
      title: 'Quorum Calculator',
      subtitle: 'R + W > N — ajuste sliders e veja strong vs eventual em tempo real',
      accent: C,
      component: <QuorumCalculator />,
    },
    {
      id: 'eventual-timeline',
      title: 'Eventual consistency timeline',
      subtitle: 'Write em A → propagação para B e C — quando stale reads acontecem',
      accent: C,
      component: <EventualConsistencyTimeline />,
    },
    {
      id: 'crdt',
      title: 'CRDT G-Counter',
      subtitle: 'Increments offline em 3 nodes → merge sem perder dados',
      accent: C,
      component: <GCounterCRDTVisual />,
    },
    {
      id: 'systems',
      title: 'Comparativo de sistemas',
      subtitle: 'Cassandra vs DynamoDB vs MongoDB vs Spanner em 7 critérios',
      accent: C,
      component: (
        <ComparisonTable
          options={SYSTEM_OPTIONS}
          criteria={SYSTEM_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Bancos distribuídos — escolha por consistência e workload"
          description="Cassandra para time-series multi-DC. DynamoDB para serverless de baixa latência. MongoDB para flexibilidade de schema. Spanner para ACID global crítico."
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
