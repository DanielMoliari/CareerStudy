'use client'
import { useState, useCallback } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { ProConMatrix } from '@/components/visuals/ProConMatrix'
import type { ProConOption } from '@/components/visuals/ProConMatrix'

// ── Paleta System Design ──────────────────────────────────────────────────────
const C      = '#0EA5E9'   // sky-500 — arquitetura de sistemas
const C2     = '#0284c7'   // sky-600
const BG     = '#0f172a'
const CARD   = '#1e293b'
const CARD2  = '#243044'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const TEAL   = '#2dd4bf'
const ORG    = '#fb923c'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Escalabilidade Horizontal vs Vertical
// ═══════════════════════════════════════════════════════════════════════════════

const SCALE_OPTIONS: ComparisonOption[] = [
  { id: 'horizontal', label: 'Horizontal (Scale-out)', sublabel: 'Adicionar mais servidores', color: C },
  { id: 'vertical',   label: 'Vertical (Scale-up)',   sublabel: 'Servidor mais potente',     color: AMB },
]

const SCALE_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'custo',
    label: 'Custo inicial',
    category: 'Economia',
    description: 'Custo para começar a escalar',
    values: {
      horizontal: { rating: 'excellent', note: 'Commodity hardware barato' },
      vertical:   { rating: 'poor',      note: 'Hardware enterprise caro' },
    },
  },
  {
    id: 'limite',
    label: 'Limite máximo',
    category: 'Capacidade',
    description: 'Até onde pode crescer',
    values: {
      horizontal: { rating: 'excellent', note: 'Teoricamente ilimitado' },
      vertical:   { rating: 'poor',      note: 'Limite do hardware físico' },
    },
  },
  {
    id: 'downtime',
    label: 'Downtime para escalar',
    category: 'Disponibilidade',
    description: 'Se precisa parar o serviço para escalar',
    values: {
      horizontal: { rating: 'excellent', note: 'Zero — adiciona instâncias sem parar' },
      vertical:   { rating: 'fair',      note: 'Geralmente requer restart' },
    },
  },
  {
    id: 'complexidade',
    label: 'Complexidade de app',
    category: 'Engenharia',
    description: 'O que a aplicação precisa suportar',
    values: {
      horizontal: { rating: 'poor', note: 'Sessão distribuída, locks distribuídos, dados particionados' },
      vertical:   { rating: 'excellent', note: 'App não precisa mudar — faz em 1 máquina' },
    },
  },
  {
    id: 'failover',
    label: 'Tolerância a falha',
    category: 'Resiliência',
    description: 'O que acontece se um nó cai',
    values: {
      horizontal: { rating: 'excellent', note: 'Outros servidores absorvem o tráfego' },
      vertical:   { rating: 'poor',      note: 'Servidor único: SPOF total' },
    },
  },
  {
    id: 'latencia',
    label: 'Latência de estado',
    category: 'Performance',
    description: 'Latência ao acessar estado compartilhado',
    values: {
      horizontal: { rating: 'fair',      note: 'Cache distribuído, rede entre nós' },
      vertical:   { rating: 'excellent', note: 'Memória local, sem rede' },
    },
  },
  {
    id: 'quando',
    label: 'Quando usar',
    category: 'Decisão',
    description: 'Cenário ideal para cada abordagem',
    values: {
      horizontal: { rating: 'good', note: 'Microservices, stateless APIs, sistemas com DAU alto' },
      vertical:   { rating: 'good', note: 'DBs monolíticos, apps legadas, escala moderada' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Algoritmos de Load Balancer (custom)
// ═══════════════════════════════════════════════════════════════════════════════

type LBAlgorithm = {
  id: string
  name: string
  emoji: string
  color: string
  how: string
  pros: string[]
  cons: string[]
  bestFor: string
  demo: { label: string; weight?: number }[]
}

const LB_ALGORITHMS: LBAlgorithm[] = [
  {
    id: 'round-robin',
    name: 'Round Robin',
    emoji: '🔄',
    color: C,
    how: 'Distribui requisições em sequência circular: S1 → S2 → S3 → S1 → ...',
    pros: ['Simples de implementar', 'Distribuição uniforme se servidores iguais', 'Sem estado extra'],
    cons: ['Ignora carga real do servidor', 'Péssimo se sessões são stateful', 'Servidores lentos acumulam fila'],
    bestFor: 'Servidores idênticos e stateless (APIs REST sem sessão)',
    demo: [{ label: 'S1' }, { label: 'S2' }, { label: 'S3' }],
  },
  {
    id: 'least-connections',
    name: 'Least Connections',
    emoji: '📊',
    color: GRN,
    how: 'Roteia para o servidor com MENOR número de conexões ativas no momento.',
    pros: ['Usa capacidade real dos servidores', 'Adapta a requests lentos', 'Sem starvation'],
    cons: ['Requer rastrear estado de conexões', 'Overhead maior no LB', 'Pode ter race condition'],
    bestFor: 'Requests com duração variável (uploads, WebSocket, streaming)',
    demo: [{ label: 'S1 (2 conn)', weight: 2 }, { label: 'S2 (8 conn)', weight: 8 }, { label: 'S3 (1 conn)', weight: 1 }],
  },
  {
    id: 'ip-hash',
    name: 'IP Hash',
    emoji: '🔑',
    color: AMB,
    how: 'hash(IP do cliente) % N servidores → mesmo cliente sempre vai para o mesmo servidor.',
    pros: ['Sticky session sem cookie', 'Simples de implementar', 'Consistente para usuário'],
    cons: ['Distribuição desequilibrada se IPs de corporações (NAT)', 'Remove servidor → redistribui clientes', 'Ineficaz atrás de proxy'],
    bestFor: 'Apps que precisam de sessão server-side sem Redis distribuído',
    demo: [{ label: 'S1 (hash 0-2)' }, { label: 'S2 (hash 3-5)' }, { label: 'S3 (hash 6-9)' }],
  },
  {
    id: 'weighted',
    name: 'Weighted Round Robin',
    emoji: '⚖️',
    color: PRP,
    how: 'Cada servidor tem um peso. Servidor com peso 3 recebe 3x mais requisições que peso 1.',
    pros: ['Flexível para servidores heterogêneos', 'Máximo poderoso recebe mais carga', 'Controle fino'],
    cons: ['Configuração manual de pesos', 'Pesos errados causam sobrecarga', 'Não adapta dinamicamente'],
    bestFor: 'Fleet misto (VMs grandes e pequenas), canary deploy com 5% de tráfego',
    demo: [{ label: 'S1 (w=3)', weight: 3 }, { label: 'S2 (w=1)', weight: 1 }, { label: 'S3 (w=2)', weight: 2 }],
  },
]

function LoadBalancerVisual() {
  const [selected, setSelected] = useState(0)
  const alg = LB_ALGORITHMS[selected]

  return (
    <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      {/* Lista lateral */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
        {LB_ALGORITHMS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setSelected(i)}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: `2px solid ${i === selected ? a.color : LINE}`,
              background: i === selected ? `${a.color}15` : CARD,
              color: i === selected ? a.color : FGMUTE,
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: i === selected ? 700 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all .2s',
            }}
          >
            <span>{a.emoji}</span>
            <span>{a.name}</span>
          </button>
        ))}
      </div>

      {/* Painel de detalhes */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          padding: '14px 18px',
          borderRadius: 10,
          background: `${alg.color}12`,
          border: `2px solid ${alg.color}40`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: alg.color, marginBottom: 6 }}>
            {alg.emoji} {alg.name}
          </div>
          <div style={{ fontSize: 13, color: FG, lineHeight: 1.6 }}>{alg.how}</div>
        </div>

        {/* Demo visual */}
        <div style={{ padding: '12px 16px', borderRadius: 8, background: CARD2, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.6px' }}>Distribuição de tráfego</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 60 }}>
            {alg.demo.map((s, i) => {
              const maxW = Math.max(...alg.demo.map(x => x.weight ?? 1))
              const h = Math.round(((s.weight ?? 1) / maxW) * 48) + 12
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%',
                    height: h,
                    background: `${alg.color}30`,
                    border: `1px solid ${alg.color}60`,
                    borderRadius: '4px 4px 0 0',
                  }} />
                  <div style={{ fontSize: 10, color: FGMUTE, textAlign: 'center' }}>{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: `${GRN}0a`, border: `1px solid ${GRN}30` }}>
            <div style={{ fontSize: 11, color: GRN, fontWeight: 700, marginBottom: 6 }}>Vantagens</div>
            {alg.pros.map((p, i) => (
              <div key={i} style={{ fontSize: 12, color: FG, marginBottom: 3 }}>✓ {p}</div>
            ))}
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: `${RED}0a`, border: `1px solid ${RED}30` }}>
            <div style={{ fontSize: 11, color: RED, fontWeight: 700, marginBottom: 6 }}>Desvantagens</div>
            {alg.cons.map((c, i) => (
              <div key={i} style={{ fontSize: 12, color: FG, marginBottom: 3 }}>✗ {c}</div>
            ))}
          </div>
        </div>

        <div style={{ padding: '8px 14px', borderRadius: 6, background: `${alg.color}0a`, border: `1px solid ${alg.color}30` }}>
          <span style={{ fontSize: 11, color: alg.color, fontWeight: 700 }}>Melhor para: </span>
          <span style={{ fontSize: 12, color: FG }}>{alg.bestFor}</span>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Hierarquia de Cache
// ═══════════════════════════════════════════════════════════════════════════════

const CACHE_LAYERS: Layer[] = [
  {
    id: 'cpu',
    label: 'CPU Cache (L1/L2/L3)',
    sublabel: 'Latência: ~1–40ns | Tamanho: KB–MB',
    description: 'Cache dentro do próprio processador. L1 por core (~1ns), L2 compartilhado (~5ns), L3 entre cores (~40ns). Gerenciado pelo hardware — transparente para o dev.',
    color: '#ec4899',
    examples: ['Operações de loop tight', 'Acesso sequencial a array', 'Hot path do GC'],
  },
  {
    id: 'app',
    label: 'Application Cache (in-process)',
    sublabel: 'Latência: ~0.1ms | Tamanho: limitado pela RAM do processo',
    description: 'Objetos em memória do processo. Map, LRU cache, Guava Cache. Latência zero de rede — mas dados são perdidos no restart e não compartilhados entre instâncias.',
    color: AMB,
    examples: ['Map<String, User> em memória', 'LRU cache de configs', 'Memoização de cálculos'],
    code: 'const cache = new Map<string, User>()\ncache.set(userId, user)',
  },
  {
    id: 'distributed',
    label: 'Distributed Cache (Redis / Memcached)',
    sublabel: 'Latência: ~0.5–2ms | Tamanho: GBs',
    description: 'Cache externo compartilhado entre instâncias. Redis suporta estruturas ricas (hash, list, sorted set), TTL, pub/sub, Lua. Memcached é mais simples e rápido para strings puras.',
    color: C,
    examples: ['Session store', 'Rate limiting counters', 'Computed feed/timeline'],
    code: 'await redis.setex(`user:${id}`, 300, JSON.stringify(user))',
  },
  {
    id: 'cdn',
    label: 'CDN (CloudFront / Fastly / Cloudflare)',
    sublabel: 'Latência: ~1–50ms (edge) | Tamanho: TBs',
    description: 'Cache geográfico distribuído em Points of Presence (PoPs) globais. Ideal para assets estáticos, imagens, HTML pré-renderizado. Cache-Control headers definem TTL.',
    color: TEAL,
    examples: ['HTML de páginas populares', 'Imagens e vídeos', 'JS/CSS bundles'],
    code: 'Cache-Control: public, max-age=31536000, immutable',
  },
  {
    id: 'database',
    label: 'Database Query Cache',
    sublabel: 'Latência: ~1–5ms | Tamanho: configurável',
    description: 'Cache interno do banco para resultados de queries. PostgreSQL usa shared_buffers. MySQL tinha query cache (removido no 8.0). Menos controle — preferir Redis para cache de resultado.',
    color: FGMUTE,
    examples: ['Shared_buffers do Postgres', 'InnoDB buffer pool', 'Materialized views'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — CAP Theorem (custom interativo)
// ═══════════════════════════════════════════════════════════════════════════════

type CAPSystem = {
  name: string
  cap: ('C' | 'A' | 'P')[]
  color: string
  desc: string
  tradeoff: string
}

const CAP_SYSTEMS: CAPSystem[] = [
  { name: 'PostgreSQL\n(single node)', cap: ['C', 'A'], color: '#4479A1', desc: 'ACID total, sem partição — mas sem partição network = não é distribuído real', tradeoff: 'Sem tolerância a partição: se cai, para.' },
  { name: 'Zookeeper\nEtcd / Consul',  cap: ['C', 'P'], color: '#F59E0B', desc: 'Consistência forte (Raft/Paxos), tolera partição de rede — mas fica indisponível durante eleição', tradeoff: 'Disponibilidade cai em partição.' },
  { name: 'HBase\nMongoDB (strong)',    cap: ['C', 'P'], color: '#47A248', desc: 'Leituras sempre retornam dado mais recente — mas podem bloquear em partição', tradeoff: 'Prefere erro a dado inconsistente.' },
  { name: 'DynamoDB\nCassandra',        cap: ['A', 'P'], color: '#FF9900', desc: 'Nunca rejeita write/read — mas pode retornar dado desatualizado (eventual consistency)', tradeoff: 'Aceita inconsistência temporária.' },
  { name: 'CouchDB\nRiak',             cap: ['A', 'P'], color: '#E42528', desc: 'Multi-master, sempre disponível, eventual consistency com CRDTs', tradeoff: 'Conflitos resolvidos na leitura.' },
  { name: 'Redis\n(replication)',       cap: ['A', 'P'], color: '#DC382D', desc: 'Replicação assíncrona — em failover pode perder writes não replicados', tradeoff: 'Janela de inconsistência no failover.' },
]

function CAPTheoremVisual() {
  const [hovered, setHovered] = useState<string | null>(null)
  const sys = CAP_SYSTEMS.find(s => s.name === hovered)

  const vertices = {
    C: { x: 300, y: 40,  label: 'Consistency',  sub: 'Todo nó vê o dado mais recente', color: C },
    A: { x: 60,  y: 400, label: 'Availability', sub: 'Todo request recebe resposta', color: GRN },
    P: { x: 540, y: 400, label: 'Partition\nTolerance', sub: 'Sistema funciona com rede particionada', color: AMB },
  }

  // Posições dos sistemas no triângulo
  const sysPos: Record<string, { x: number; y: number }> = {
    'PostgreSQL\n(single node)': { x: 300, y: 220 },
    'Zookeeper\nEtcd / Consul':  { x: 190, y: 195 },
    'HBase\nMongoDB (strong)':   { x: 390, y: 195 },
    'DynamoDB\nCassandra':       { x: 435, y: 330 },
    'CouchDB\nRiak':             { x: 355, y: 330 },
    'Redis\n(replication)':      { x: 275, y: 330 },
  }

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 600px' }}>
        <svg viewBox="0 0 600 460" style={{ width: '100%', height: 340 }}>
          {/* Triângulo */}
          <polygon
            points="300,50 70,410 530,410"
            fill="none"
            stroke={LINE}
            strokeWidth={2}
          />
          {/* Regiões coloridas sutis */}
          <polygon points="300,50 70,410 185,230" fill={`${C}08`} />
          <polygon points="300,50 185,230 415,230" fill={`${AMB}06`} />
          <polygon points="185,230 70,410 530,410 415,230" fill={`${GRN}06`} />

          {/* Vértices */}
          {(Object.entries(vertices) as [string, typeof vertices.C][]).map(([key, v]) => (
            <g key={key}>
              <circle cx={v.x} cy={v.y} r={28} fill={`${v.color}20`} stroke={v.color} strokeWidth={2} />
              <text x={v.x} y={v.y} textAnchor="middle" dominantBaseline="middle" fill={v.color} fontSize={15} fontWeight={700}>{key}</text>
            </g>
          ))}

          {/* Labels dos vértices */}
          <text x={300} y={18}  textAnchor="middle" fill={C}   fontSize={11} fontWeight={600}>Consistency</text>
          <text x={30}  y={415} textAnchor="middle" fill={GRN} fontSize={11} fontWeight={600}>Availability</text>
          <text x={570} y={415} textAnchor="middle" fill={AMB} fontSize={11} fontWeight={600}>Partition Tol.</text>

          {/* Sistemas */}
          {CAP_SYSTEMS.map(s => {
            const pos = sysPos[s.name]
            const isHov = hovered === s.name
            return (
              <g key={s.name}
                onMouseEnter={() => setHovered(s.name)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={pos.x} cy={pos.y} r={isHov ? 18 : 14}
                  fill={isHov ? s.color : `${s.color}40`}
                  stroke={s.color}
                  strokeWidth={isHov ? 2 : 1}
                  style={{ transition: 'all .2s' }}
                />
                <text x={pos.x} y={pos.y + 26}
                  textAnchor="middle"
                  fill={isHov ? s.color : FGMUTE}
                  fontSize={9}
                  fontWeight={isHov ? 700 : 400}
                >
                  {s.name.split('\n')[0]}
                </text>
              </g>
            )
          })}

          {/* Legend */}
          <text x={300} y={445} textAnchor="middle" fill={FGMUTE} fontSize={10}>
            Hover nos pontos para ver trade-offs — você só pode escolher 2 de 3
          </text>
        </svg>
      </div>

      {/* Painel lateral */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sys ? (
          <div style={{
            padding: '16px',
            borderRadius: 10,
            background: `${sys.color}12`,
            border: `2px solid ${sys.color}40`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: sys.color, marginBottom: 8 }}>
              {sys.name.replace('\n', ' / ')}
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {sys.cap.map(c => (
                <span key={c} style={{
                  padding: '2px 10px',
                  borderRadius: 4,
                  background: `${vertices[c].color}25`,
                  color: vertices[c].color,
                  fontSize: 12,
                  fontWeight: 700,
                  border: `1px solid ${vertices[c].color}50`,
                }}>{c}</span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: FG, lineHeight: 1.6, marginBottom: 10 }}>{sys.desc}</div>
            <div style={{
              padding: '8px 12px',
              borderRadius: 6,
              background: `${RED}10`,
              border: `1px solid ${RED}30`,
              fontSize: 12,
              color: RED,
            }}>
              ⚠ Trade-off: {sys.tradeoff}
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: FGMUTE, lineHeight: 1.7 }}>
              O teorema CAP (Brewer, 2000) prova que um sistema distribuído <strong style={{ color: FG }}>não pode garantir simultaneamente</strong> Consistência, Disponibilidade e Tolerância a Partição de rede.
            </div>
            <div style={{ padding: '12px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 12, color: FGMUTE, marginBottom: 8 }}>Em partição de rede, você escolhe:</div>
              <div style={{ fontSize: 12, color: C,   marginBottom: 4 }}>C+P → Rejeita reads/writes até consistência restaurada</div>
              <div style={{ fontSize: 12, color: GRN, marginBottom: 4 }}>A+P → Responde com dado possivelmente desatualizado</div>
              <div style={{ fontSize: 12, color: FGMUTE }}>C+A → Impossível em sistema verdadeiramente distribuído</div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 6, background: `${AMB}10`, border: `1px solid ${AMB}30`, fontSize: 12, color: AMB }}>
              Hover nos sistemas para ver qual trade-off cada um faz.
            </div>
          </>
        )}

        {/* Chave de vértices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {(Object.entries(vertices) as [string, typeof vertices.C][]).map(([key, v]) => (
            <div key={key} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${v.color}20`, border: `2px solid ${v.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: v.color }}>
                {key}
              </div>
              <div>
                <div style={{ fontSize: 12, color: FG, fontWeight: 600 }}>{v.label}</div>
                <div style={{ fontSize: 11, color: FGMUTE }}>{v.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Message Queue: Producer → Queue → Consumer
// ═══════════════════════════════════════════════════════════════════════════════

const MQ_ACTORS: SeqActor[] = [
  { id: 'prod',    label: 'Producer',      color: C,      icon: '📤' },
  { id: 'broker',  label: 'Message Broker',color: AMB,    icon: '📬' },
  { id: 'dlq',     label: 'Dead Letter Q', color: RED,    icon: '💀' },
  { id: 'cons',    label: 'Consumer',      color: GRN,    icon: '📥' },
  { id: 'db',      label: 'Database',      color: FGMUTE, icon: '🗄️' },
]

const MQ_MESSAGES: SeqMessage[] = [
  { from: 'prod',   to: 'broker', label: 'publish(msg, routingKey)',           type: 'async',  note: 'Fire-and-forget. Producer não espera consumer.' },
  { from: 'broker', to: 'prod',   label: 'ack (mensagem persistida)',          type: 'return', note: 'Broker confirma que salvou. Publisher confirm.' },
  { from: 'broker', to: 'cons',   label: 'deliver(msg)',                       type: 'sync',   note: 'Consumer recebe e processa.' },
  { from: 'cons',   to: 'db',     label: 'INSERT order',                       type: 'sync',   note: 'Processamento do lado do consumer.' },
  { from: 'db',     to: 'cons',   label: 'OK',                                 type: 'return', note: 'DB confirma a gravação.' },
  { from: 'cons',   to: 'broker', label: 'ack(deliveryTag)',                   type: 'return', note: 'Consumer confirma processamento → broker remove da fila.' },
  { from: 'cons',   to: 'broker', label: 'nack(requeue=true) — em falha',      type: 'return', note: 'Falha: broker re-enfileira a mensagem.' },
  { from: 'broker', to: 'cons',   label: 'retry (até maxDeliveryCount)',        type: 'sync',   note: 'Broker reentrega. Geralmente 3-5 tentativas.' },
  { from: 'broker', to: 'dlq',    label: 'move to DLQ (após max retries)',     type: 'async',  note: 'Mensagem vai para Dead Letter Queue para análise manual.' },
]

const MQ_GROUPS: SeqGroup[] = [
  { label: 'Happy Path', kind: 'alt', fromMsg: 0, toMsg: 5, color: `${GRN}15` },
  { label: 'Retry Loop', kind: 'loop', fromMsg: 6, toMsg: 7, color: `${AMB}15` },
  { label: 'Falha permanente', kind: 'alt', fromMsg: 8, toMsg: 8, color: `${RED}15` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Rate Limiting: algoritmos lado a lado (custom)
// ═══════════════════════════════════════════════════════════════════════════════

type RLAlgorithm = {
  id: string
  name: string
  color: string
  desc: string
  how: string
  pros: string[]
  cons: string[]
  useCase: string
}

const RL_ALGORITHMS: RLAlgorithm[] = [
  {
    id: 'token-bucket',
    name: 'Token Bucket',
    color: C,
    desc: 'Balde com capacidade B. Tokens adicionados a taxa R/s. Request consume 1 token; sem token → rejeitado.',
    how: 'Permite bursts até capacidade do balde. Tokens se acumulam quando não há tráfego.',
    pros: ['Permite burst controlado', 'Suaviza picos', 'Simples com Redis (DECR)'],
    cons: ['2 parâmetros para tunar (rate + burst)', 'Race condition sem atomic ops'],
    useCase: 'APIs que precisam tolerar bursts: uploads, relatórios',
  },
  {
    id: 'leaky-bucket',
    name: 'Leaky Bucket',
    color: TEAL,
    desc: 'Balde vaza a taxa constante R/s, independente de quando chegam os requests. Fila dentro do balde.',
    how: 'Requests enfileirados; processados a taxa fixa. Balde cheio → drop. Output sempre uniforme.',
    pros: ['Output completamente uniforme', 'Protege downstream de bursts', 'Throttling preciso'],
    cons: ['Aumenta latência (fila)', 'Não permite bursts legítimos', 'Tamanho da fila = memória'],
    useCase: 'Proteção de backends frágeis, egress rate limiting',
  },
  {
    id: 'fixed-window',
    name: 'Fixed Window Counter',
    color: AMB,
    desc: 'Janela fixa de tempo T (ex: 1min). Contador reseta ao início da próxima janela.',
    how: 'Redis: INCR + EXPIRE. Se counter > limite → rejeita.',
    pros: ['Ultra simples', '1 operação Redis por request', 'Fácil de entender'],
    cons: ['Permite 2× burst na borda da janela', '00:59 + 01:01 = 2 janelas cheias juntas'],
    useCase: 'Limites generosos onde edge-case da borda não importa',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window Log',
    color: PRP,
    desc: 'Mantém log de timestamps dos últimos requests. Janela desliza com o tempo real.',
    how: 'Redis Sorted Set com timestamp como score. ZREMRANGEBYSCORE remove expirados. ZCARD conta.',
    pros: ['Precisão exata', 'Sem edge-case da borda', 'Comportamento intuitivo'],
    cons: ['Memória: O(max_requests) por usuário', 'Mais operações Redis por request'],
    useCase: 'APIs críticas onde precisão importa mais que custo de memória',
  },
]

function RateLimitingVisual() {
  const [selected, setSelected] = useState(0)
  const alg = RL_ALGORITHMS[selected]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {RL_ALGORITHMS.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setSelected(i)}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 8,
              border: `2px solid ${i === selected ? a.color : LINE}`,
              background: i === selected ? `${a.color}15` : CARD,
              color: i === selected ? a.color : FGMUTE,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: i === selected ? 700 : 400,
              transition: 'all .2s',
            }}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: `${alg.color}12`,
            border: `2px solid ${alg.color}40`,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: alg.color, marginBottom: 6 }}>{alg.name}</div>
            <div style={{ fontSize: 13, color: FG, lineHeight: 1.6 }}>{alg.desc}</div>
          </div>
          <div style={{ padding: '10px 14px', borderRadius: 8, background: CARD2, border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>Como funciona</div>
            <div style={{ fontSize: 13, color: FG, lineHeight: 1.6 }}>{alg.how}</div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 6, background: `${alg.color}08`, border: `1px solid ${alg.color}25`, fontSize: 12 }}>
            <span style={{ color: alg.color, fontWeight: 700 }}>Caso de uso: </span>
            <span style={{ color: FG }}>{alg.useCase}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: `${GRN}0a`, border: `1px solid ${GRN}30` }}>
            <div style={{ fontSize: 11, color: GRN, fontWeight: 700, marginBottom: 8 }}>Vantagens</div>
            {alg.pros.map((p, i) => (
              <div key={i} style={{ fontSize: 12, color: FG, marginBottom: 4, display: 'flex', gap: 6 }}>
                <span style={{ color: GRN }}>✓</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 8, background: `${RED}0a`, border: `1px solid ${RED}30` }}>
            <div style={{ fontSize: 11, color: RED, fontWeight: 700, marginBottom: 8 }}>Desvantagens</div>
            {alg.cons.map((c, i) => (
              <div key={i} style={{ fontSize: 12, color: FG, marginBottom: 4, display: 'flex', gap: 6 }}>
                <span style={{ color: RED }}>✗</span>
                <span>{c}</span>
              </div>
            ))}
          </div>

          {/* Comparação rápida de Redis complexity */}
          <div style={{ padding: '10px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>Custo Redis por request</div>
            {[
              { id: 'token-bucket',  ops: 'DECR / INCR',         cost: 1 },
              { id: 'leaky-bucket',  ops: 'LLEN + LPUSH',        cost: 2 },
              { id: 'fixed-window',  ops: 'INCR + EXPIRE',       cost: 2 },
              { id: 'sliding-window',ops: 'ZREMRANGE + ZADD + ZCARD', cost: 3 },
            ].map(r => (
              <div key={r.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 0',
                opacity: r.id === alg.id ? 1 : 0.4,
                borderBottom: `1px solid ${LINE}`,
              }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: r.id === alg.id ? alg.color : FGMUTE }}>{r.ops}</span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: i < r.cost ? (r.id === alg.id ? alg.color : FGMUTE) : LINE,
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Consistent Hashing (custom interativo)
// ═══════════════════════════════════════════════════════════════════════════════

type HashNode = {
  id: string
  label: string
  angle: number
  color: string
  virtual: boolean
}

const HASH_NODES: HashNode[] = [
  { id: 'n1',  label: 'Node A',   angle: 0,   color: C,    virtual: false },
  { id: 'n1v', label: 'Node A\'', angle: 120, color: C,    virtual: true  },
  { id: 'n2',  label: 'Node B',   angle: 40,  color: GRN,  virtual: false },
  { id: 'n2v', label: 'Node B\'', angle: 200, color: GRN,  virtual: true  },
  { id: 'n3',  label: 'Node C',   angle: 80,  color: AMB,  virtual: false },
  { id: 'n3v', label: 'Node C\'', angle: 280, color: AMB,  virtual: true  },
]

const HASH_KEYS = [
  { label: 'user:1234',  angle: 20  },
  { label: 'order:88',   angle: 55  },
  { label: 'session:X',  angle: 100 },
  { label: 'product:44', angle: 170 },
  { label: 'cache:Z',    angle: 240 },
  { label: 'token:99',   angle: 310 },
]

function ConsistentHashingVisual() {
  const [removedNode, setRemovedNode] = useState<string | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  const activeNodes = HASH_NODES.filter(n => !removedNode || !n.id.startsWith(removedNode.replace('v', '')))

  const getOwner = useCallback((keyAngle: number) => {
    const sorted = [...activeNodes].sort((a, b) => a.angle - b.angle)
    const found = sorted.find(n => n.angle >= keyAngle)
    return found ?? sorted[0]
  }, [activeNodes])

  const cx = 200
  const cy = 200
  const r  = 160

  function polarToXY(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div>
        <svg viewBox="0 0 400 400" style={{ width: 340, height: 340 }}>
          {/* Anel */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={LINE} strokeWidth={2} />

          {/* Arcos coloridos (partições) */}
          {activeNodes.map((node, i) => {
            const sorted = [...activeNodes].sort((a, b) => a.angle - b.angle)
            const idx = sorted.findIndex(n => n.id === node.id)
            const next = sorted[(idx + 1) % sorted.length]
            const startA = node.angle
            const endA = next.angle <= startA ? next.angle + 360 : next.angle
            const startRad = ((startA - 90) * Math.PI) / 180
            const endRad = ((endA - 90) * Math.PI) / 180
            const x1 = cx + r * Math.cos(startRad)
            const y1 = cy + r * Math.sin(startRad)
            const x2 = cx + r * Math.cos(endRad)
            const y2 = cy + r * Math.sin(endRad)
            const large = (endA - startA) > 180 ? 1 : 0
            return (
              <path
                key={node.id}
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
                fill={`${node.color}08`}
                stroke="none"
              />
            )
          })}

          {/* Keys */}
          {HASH_KEYS.map(key => {
            const pos = polarToXY(key.angle, r + 18)
            const owner = getOwner(key.angle)
            const isHov = hoveredKey === key.label
            return (
              <g key={key.label}
                onMouseEnter={() => setHoveredKey(key.label)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{ cursor: 'pointer' }}
              >
                <line
                  x1={polarToXY(key.angle, r).x}
                  y1={polarToXY(key.angle, r).y}
                  x2={polarToXY(key.angle, r - 24).x}
                  y2={polarToXY(key.angle, r - 24).y}
                  stroke={isHov ? owner.color : `${owner.color}60`}
                  strokeWidth={isHov ? 2 : 1}
                  strokeDasharray="3 2"
                />
                <circle cx={pos.x} cy={pos.y} r={isHov ? 7 : 5}
                  fill={isHov ? owner.color : `${owner.color}40`}
                  stroke={owner.color}
                  strokeWidth={1}
                />
                {isHov && (
                  <text x={pos.x} y={pos.y - 12} textAnchor="middle" fill={owner.color} fontSize={9} fontWeight={700}>
                    {key.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {activeNodes.map(node => {
            const pos = polarToXY(node.angle, r)
            return (
              <g key={node.id}>
                <circle cx={pos.x} cy={pos.y} r={node.virtual ? 6 : 10}
                  fill={node.virtual ? `${node.color}20` : `${node.color}40`}
                  stroke={node.color}
                  strokeWidth={node.virtual ? 1 : 2}
                  strokeDasharray={node.virtual ? '3 2' : 'none'}
                />
                {!node.virtual && (
                  <text x={pos.x} y={pos.y + 20} textAnchor="middle" fill={node.color} fontSize={10} fontWeight={700}>
                    {node.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Center label */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill={FGMUTE} fontSize={11}>Hash Ring</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill={FGMUTE} fontSize={10}>0–360°</text>
        </svg>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontSize: 13, color: FG, lineHeight: 1.7 }}>
          <strong style={{ color: C }}>Consistent Hashing</strong> distribui dados num anel circular de hash. Cada servidor ocupa um ou mais pontos no anel. Uma key vai para o <em>primeiro servidor no sentido horário</em>.
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 8, fontWeight: 700 }}>Por que é melhor que hash simples?</div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }}>
            hash(key) % N → remover 1 servidor redistribui <strong style={{ color: RED }}>quase todos</strong> os dados.<br />
            Consistent Hash → remover 1 servidor redistribui <strong style={{ color: GRN }}>só as keys daquele nó</strong>.
          </div>
        </div>

        <div style={{ padding: '12px 14px', borderRadius: 8, background: CARD2, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 8, fontWeight: 700 }}>Virtual nodes (vnodes)</div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }}>
            Cada servidor físico tem <strong style={{ color: AMB }}>múltiplos pontos</strong> no anel (tracejado = vnode). Isso distribui a carga uniformemente mesmo com poucos servidores.
          </div>
        </div>

        <div style={{ padding: '10px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, color: FGMUTE, marginBottom: 8, fontWeight: 700 }}>Simular remoção de nó:</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['n1', 'n2', 'n3'].map((id, i) => {
              const colors = [C, GRN, AMB]
              const names = ['Node A', 'Node B', 'Node C']
              const isRemoved = removedNode === id
              return (
                <button
                  key={id}
                  onClick={() => setRemovedNode(isRemoved ? null : id)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: 6,
                    border: `2px solid ${isRemoved ? RED : colors[i]}`,
                    background: isRemoved ? `${RED}15` : `${colors[i]}10`,
                    color: isRemoved ? RED : colors[i],
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 11,
                    fontWeight: 700,
                    transition: 'all .2s',
                  }}
                >
                  {isRemoved ? '✓ removido' : `Remove ${names[i]}`}
                </button>
              )
            })}
          </div>
        </div>

        {hoveredKey && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: `${getOwner(HASH_KEYS.find(k => k.label === hoveredKey)!.angle).color}12`,
            border: `1px solid ${getOwner(HASH_KEYS.find(k => k.label === hoveredKey)!.angle).color}40`,
            fontSize: 12,
          }}>
            <span style={{ color: FGMUTE }}>Key </span>
            <strong style={{ color: FG }}>{hoveredKey}</strong>
            <span style={{ color: FGMUTE }}> → </span>
            <strong style={{ color: getOwner(HASH_KEYS.find(k => k.label === hoveredKey)!.angle).color }}>
              {getOwner(HASH_KEYS.find(k => k.label === hoveredKey)!.angle).label}
            </strong>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Fluxo completo: URL Shortener (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const URL_ACTORS: SeqActor[] = [
  { id: 'client',  label: 'Client',       color: FG,   icon: '🌐' },
  { id: 'cdn',     label: 'CDN',          color: TEAL, icon: '🌍' },
  { id: 'lb',      label: 'Load Balancer',color: C,    icon: '⚖️' },
  { id: 'api',     label: 'API Service',  color: PRP,  icon: '⚙️' },
  { id: 'redis',   label: 'Redis Cache',  color: RED,  icon: '⚡' },
  { id: 'db',      label: 'PostgreSQL',   color: '#4479A1', icon: '🗄️' },
  { id: 'worker',  label: 'Worker / MQ',  color: AMB,  icon: '📬' },
]

const URL_MESSAGES: SeqMessage[] = [
  { from: 'client', to: 'cdn',    label: 'POST /shorten {url: "https://..."} ',    type: 'sync' },
  { from: 'cdn',    to: 'lb',     label: 'forward (não é asset estático)',          type: 'sync' },
  { from: 'lb',     to: 'api',    label: 'route para instância disponível',         type: 'sync' },
  { from: 'api',    to: 'api',    label: 'gera shortCode = base62(encode(id))',     type: 'sync',   note: 'Usa ID único gerado via Snowflake ou sequence do DB' },
  { from: 'api',    to: 'db',     label: 'INSERT (shortCode, longUrl, createdAt)', type: 'sync' },
  { from: 'db',     to: 'api',    label: 'OK (id gerado)',                          type: 'return' },
  { from: 'api',    to: 'redis',  label: 'SET shortCode → longUrl (TTL=86400)',     type: 'async',  note: 'Cache para acelerar o redirect' },
  { from: 'api',    to: 'worker', label: 'publish(AnalyticsEvent{shortCode, ip})', type: 'async',  note: 'Não bloqueia response — analytics assíncrono' },
  { from: 'api',    to: 'client', label: '201 {shortUrl: "short.ly/abc123"}',       type: 'return' },
  { from: 'client', to: 'cdn',    label: 'GET /abc123',                             type: 'sync' },
  { from: 'cdn',    to: 'lb',     label: 'forward',                                 type: 'sync' },
  { from: 'lb',     to: 'api',    label: 'route',                                   type: 'sync' },
  { from: 'api',    to: 'redis',  label: 'GET abc123',                              type: 'sync' },
  { from: 'redis',  to: 'api',    label: 'hit: "https://..."',                      type: 'return', note: 'Cache hit: sem acesso ao DB' },
  { from: 'api',    to: 'client', label: '302 Location: "https://..."',             type: 'return' },
]

const URL_GROUPS: SeqGroup[] = [
  { label: 'Criar URL curta', kind: 'ref', fromMsg: 0, toMsg: 8, color: `${C}10` },
  { label: 'Redirecionar (cache hit)', kind: 'alt', fromMsg: 9, toMsg: 14, color: `${GRN}10` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — SQL vs NoSQL (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const DB_OPTIONS: ComparisonOption[] = [
  { id: 'sql',       label: 'SQL (Relacional)',  sublabel: 'PostgreSQL, MySQL',   color: '#4479A1' },
  { id: 'document',  label: 'NoSQL Document',   sublabel: 'MongoDB, Firestore',  color: '#47A248' },
  { id: 'keyvalue',  label: 'NoSQL Key-Value',  sublabel: 'Redis, DynamoDB',     color: '#DC382D' },
  { id: 'columnar',  label: 'NoSQL Columnar',   sublabel: 'Cassandra, HBase',    color: '#F59E0B' },
]

const DB_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'schema',
    label: 'Schema',
    category: 'Modelo',
    values: {
      sql:      { rating: 'excellent', note: 'Rígido, validado, normalizado' },
      document: { rating: 'fair',      note: 'Flexível, mas pode virar bagunça' },
      keyvalue: { rating: 'poor',      note: 'Sem schema — payload opaco' },
      columnar: { rating: 'fair',      note: 'Colunas definidas, linhas livres' },
    },
  },
  {
    id: 'transacoes',
    label: 'Transações ACID',
    category: 'Consistência',
    values: {
      sql:      { rating: 'excellent', note: 'ACID nativo, transactions multi-row' },
      document: { rating: 'fair',      note: 'ACID em doc único; multi-doc limitado' },
      keyvalue: { rating: 'poor',      note: 'Sem transação (Redis tem MULTI limitado)' },
      columnar: { rating: 'poor',      note: 'Eventual consistency por padrão' },
    },
  },
  {
    id: 'escala',
    label: 'Escala horizontal',
    category: 'Performance',
    values: {
      sql:      { rating: 'fair',      note: 'Complexo — sharding manual, limitações de JOIN' },
      document: { rating: 'good',      note: 'Sharding nativo, ReplicaSet fácil' },
      keyvalue: { rating: 'excellent', note: 'Sharding trivial — sem relações' },
      columnar: { rating: 'excellent', note: 'Projetado para petabytes com anel Cassandra' },
    },
  },
  {
    id: 'queries',
    label: 'Queries complexas',
    category: 'Consulta',
    values: {
      sql:      { rating: 'excellent', note: 'JOINs, subqueries, window functions, CTEs' },
      document: { rating: 'good',      note: 'Aggregation pipeline — poderoso mas verbose' },
      keyvalue: { rating: 'poor',      note: 'Só por chave — sem query ad-hoc' },
      columnar: { rating: 'fair',      note: 'CQL, mas sem JOINs — leitura por partition key' },
    },
  },
  {
    id: 'write',
    label: 'Write throughput',
    category: 'Performance',
    values: {
      sql:      { rating: 'fair',      note: 'Lock, WAL, fsync limitam throughput' },
      document: { rating: 'good',      note: 'Write concern configurável — write-heavy ok' },
      keyvalue: { rating: 'excellent', note: '100K+ ops/s, memória = velocidade' },
      columnar: { rating: 'excellent', note: 'Append-only SSTables — write otimizado' },
    },
  },
  {
    id: 'usecase',
    label: 'Caso de uso típico',
    category: 'Decisão',
    values: {
      sql:      { rating: 'excellent', note: 'Fintech, e-commerce, ERP, relações complexas' },
      document: { rating: 'good',      note: 'CMS, catálogo, perfil de usuário, config' },
      keyvalue: { rating: 'good',      note: 'Cache, sessão, leaderboard, rate limit' },
      columnar: { rating: 'good',      note: 'IoT, séries temporais, logs, analytics' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — Qual componente usar? (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const SD_DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'O que você precisa adicionar ao sistema?',
  color: C,
  children: [
    { label: 'Reduzir latência de leitura', nodeId: 'latencia', color: TEAL },
    { label: 'Escalar para mais usuários',  nodeId: 'scale',    color: GRN  },
    { label: 'Desacoplar serviços',         nodeId: 'decouple', color: AMB  },
    { label: 'Proteger o sistema',          nodeId: 'protect',  color: RED  },
  ],
}

const SD_DECISION_NODES: Record<string, DTNode> = {
  latencia: {
    id: 'latencia',
    question: 'Os dados mudam com frequência?',
    color: TEAL,
    children: [
      { label: 'Não — dados relativamente estáticos', nodeId: 'cache-cdn',    color: C    },
      { label: 'Sim — dados em tempo real',           nodeId: 'cache-app',    color: TEAL },
    ],
  },
  scale: {
    id: 'scale',
    question: 'O gargalo é leitura ou escrita?',
    color: GRN,
    children: [
      { label: 'Leitura pesada (90%+ reads)',  nodeId: 'read-replica', color: GRN },
      { label: 'Escrita pesada (write-heavy)', nodeId: 'sharding',     color: AMB },
    ],
  },
  decouple: {
    id: 'decouple',
    question: 'Precisa de resposta imediata?',
    color: AMB,
    children: [
      { label: 'Sim — resposta síncrona', nodeId: 'api-gw',  color: C   },
      { label: 'Não — pode ser assíncrono', nodeId: 'mq',    color: AMB },
    ],
  },
  protect: {
    id: 'protect',
    question: 'De onde vem a ameaça?',
    color: RED,
    children: [
      { label: 'Tráfego abusivo / DDoS', nodeId: 'rate-limit', color: RED  },
      { label: 'Serviço dependente lento', nodeId: 'circuit',  color: ORG  },
    ],
  },
  'cache-cdn': {
    id: 'cache-cdn',
    recommendation: 'CDN + Cache Estático',
    detail: 'Use CloudFront/Fastly para assets e HTML. Cache-Control: max-age longo + stale-while-revalidate. Invalidação por path ou tag.',
    color: C,
    icon: '🌍',
  },
  'cache-app': {
    id: 'cache-app',
    recommendation: 'Redis + Cache Aside',
    detail: 'Cache aside: tenta Redis → miss → lê DB → salva Redis com TTL. Para dados de usuário, usar key user:{id}. Invalidar ao mudar.',
    color: TEAL,
    icon: '⚡',
  },
  'read-replica': {
    id: 'read-replica',
    recommendation: 'Read Replicas + Read-through Cache',
    detail: 'Adicione replicas de leitura (RDS Multi-AZ ou PgBouncer). Direcione SELECTs para replicas. Redis na frente para queries hot.',
    color: GRN,
    icon: '🗄️',
  },
  sharding: {
    id: 'sharding',
    recommendation: 'Horizontal Sharding',
    detail: 'Particione dados por shard key (user_id, tenant_id). Consistent hashing para distribuição. Evite hot shards com shard key de alta cardinalidade.',
    color: AMB,
    icon: '🔀',
  },
  'api-gw': {
    id: 'api-gw',
    recommendation: 'API Gateway + BFF',
    detail: 'API Gateway agrega múltiplos microservices numa interface única. BFF (Backend for Frontend) cria APIs otimizadas por cliente (mobile vs web).',
    color: C,
    icon: '🚪',
  },
  mq: {
    id: 'mq',
    recommendation: 'Message Queue (Kafka / SQS / RabbitMQ)',
    detail: 'Producer publica evento, consumer processa em seu ritmo. Kafka para streaming de alta vazão, SQS para simplicidade gerenciada, RabbitMQ para routing complexo.',
    color: AMB,
    icon: '📬',
  },
  'rate-limit': {
    id: 'rate-limit',
    recommendation: 'Rate Limiting + WAF',
    detail: 'Token bucket por usuário no API Gateway. WAF (CloudFront + Shield) para DDoS. Limite em múltiplas camadas: LB, API, por endpoint.',
    color: RED,
    icon: '🛡️',
  },
  circuit: {
    id: 'circuit',
    recommendation: 'Circuit Breaker + Timeout + Retry',
    detail: 'Circuit Breaker (Hystrix/resilience4j) abre após N falhas. Timeout obrigatório em toda chamada externa. Retry com exponential backoff + jitter.',
    color: ORG,
    icon: '⚡',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 11 — Anti-patterns de System Design
// ═══════════════════════════════════════════════════════════════════════════════

const SD_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Pular clarificação e ir direto ao desenho',
    wrong: [
      [{ text: '// Entrevistador: "Projete o Twitter"' }],
      [{ text: '// Dev: [Imediatamente desenha caixas]' }],
      [{ text: 'Client → LB → API → DB', color: RED }],
      [{ text: '// 20 min depois: "Ah, são 500M usuários"' }],
      [{ text: '// Redesenha tudo — tempo perdido', color: RED }],
    ],
    right: [
      [{ text: '// Dev pergunta ANTES de desenhar:' }],
      [{ text: '"Quantos DAUs? Read ou write heavy?"', color: GRN }],
      [{ text: '"Latência máxima aceitável? Global?"', color: GRN }],
      [{ text: '"Precisa de consistência forte?"', color: GRN }],
      [{ text: '// Só depois desenha — com contexto real', color: GRN }],
    ],
    why: 'Sem clarificar, você desenha pro sistema errado. 5 minutos de perguntas evitam 30 minutos de retrabalho.',
  },
  {
    title: 'Adicionar componentes sem justificar',
    wrong: [
      [{ text: '// "Vou usar Kafka + Cassandra + ElasticSearch + Redis + gRPC"', color: RED }],
      [{ text: 'const stack = [kafka, cassandra, es, redis, grpc]', color: RED }],
      [{ text: '// Sem justificar POR QUE cada componente' }],
      [{ text: '// Cada um = custo operacional + modo de falha', color: RED }],
    ],
    right: [
      [{ text: '// "Aqui está meu raciocínio para cada componente:"' }],
      [{ text: '"Redis: timeline cache, O(1) de leitura"', color: GRN }],
      [{ text: '"Kafka: fanout assíncrono, desacopla serviços"', color: GRN }],
      [{ text: '"Cassandra: write-heavy, 10K writes/s por nó"', color: GRN }],
      [{ text: '"Cada um resolve um gargalo específico"', color: GRN }],
    ],
    why: 'Usar tecnologia sem justificar é red flag. Senior usa o mínimo necessário e cresce a partir daí.',
  },
  {
    title: 'Não considerar falha (SPOF)',
    wrong: [
      [{ text: 'API --> Database', color: RED }],
      [{ text: '// Único banco, sem replica' }],
      [{ text: '// Único ponto de falha (Single Point of Failure)', color: RED }],
      [{ text: '// DB cai → sistema todo para' }],
    ],
    right: [
      [{ text: 'API --> Primary DB', color: GRN }],
      [{ text: 'API --> Read Replica (leituras)', color: GRN }],
      [{ text: 'Primary DB --> Read Replica (replication)', color: GRN }],
      [{ text: '// Failover automático com Route53 health check', color: GRN }],
    ],
    why: 'Todo sistema em produção tem falhas. Pensar em SPOF desde o design é diferencial sênior.',
  },
  {
    title: 'Ignorar back-of-envelope antes de propor storage',
    wrong: [
      [{ text: '// "Vou usar um banco SQL para os tweets"' }],
      [{ text: '// Sem calcular: 500M tweets/dia = 5.8K/s' }],
      [{ text: '// Tamanho: 200 bytes/tweet × 500M = 100GB/dia', color: RED }],
      [{ text: '// Em 5 anos: 182TB — SQL single node não escala', color: RED }],
    ],
    right: [
      [{ text: '// SEMPRE calcule antes de escolher storage:' }],
      [{ text: 'QPS = DAU × writes_per_day / 86400', color: GRN }],
      [{ text: 'Storage_day = QPS × record_size × 86400', color: GRN }],
      [{ text: '// Aí escolhe: SQL (relações) vs NoSQL (volume)', color: GRN }],
    ],
    why: 'Escolher storage sem estimar é como escolher banco de dados no escuro. Cálculo leva 2 minutos e evita redesign completo.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 12 — Progressão de domínio em System Design
// ═══════════════════════════════════════════════════════════════════════════════

const SD_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Iniciante',
    label: 'Iniciante',
    emoji: '🌱',
    concepts: [
      { name: 'HTTP básico', tip: 'GET, POST, status codes, headers' },
      { name: 'Cliente-servidor', tip: 'Request/response, stateless' },
      { name: 'Banco relacional', tip: 'SQL, tables, foreign keys, índices' },
      { name: 'Cache básico', tip: 'Redis SET/GET, TTL, por que usar' },
      { name: 'DNS e CDN', tip: 'Como resolução DNS funciona, CDN para assets' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '⚙️',
    concepts: [
      { name: 'Load Balancer', tip: 'Round Robin, Least Conn, IP Hash, L4 vs L7' },
      { name: 'Horizontal vs Vertical', tip: 'Trade-offs, quando usar cada um' },
      { name: 'SQL vs NoSQL', tip: 'Quando usar cada tipo, CAP theorem' },
      { name: 'Message Queue', tip: 'Producer/Consumer, ack/nack, DLQ, Kafka vs SQS' },
      { name: 'API Gateway', tip: 'Rate limiting, auth, roteamento, BFF pattern' },
      { name: 'Read Replica', tip: 'Replicação async, eventual consistency na leitura' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '🚀',
    concepts: [
      { name: 'Consistent Hashing', tip: 'Anel de hash, vnodes, redistribuição mínima' },
      { name: 'Rate Limiting avançado', tip: 'Token bucket, sliding window, Redis + Lua' },
      { name: 'Cache Invalidation', tip: 'Write-through, write-behind, cache-aside, CDN purge' },
      { name: 'Sharding + Rebalancing', tip: 'Shard key, hot shards, rebalancing sem downtime' },
      { name: 'Idempotência', tip: 'Idempotency keys, at-least-once vs exactly-once' },
      { name: 'Back-of-envelope', tip: 'QPS, storage, bandwidth — calcular em 5 minutos' },
    ],
  },
  {
    id: 'staff',
    name: 'Staff',
    label: 'Staff',
    emoji: '🏗️',
    concepts: [
      { name: 'Multi-region design', tip: 'Active-active vs active-passive, data sovereignty' },
      { name: 'Distributed Tracing', tip: 'Correlation IDs, Jaeger, debug em sistemas distribuídos' },
      { name: 'Capacity Planning', tip: 'Prever crescimento, provisionar com antecedência' },
      { name: 'Cost optimization', tip: 'Spot instances, data tiering, compression, compaction' },
      { name: 'Security by design', tip: 'Zero trust, defense in depth, blast radius' },
      { name: 'Postmortem / RCA', tip: 'Five Whys, sistemas anti-frágeis, chaos engineering' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 13 — Cache policies: write-through vs write-behind vs cache-aside (ProCon)
// ═══════════════════════════════════════════════════════════════════════════════

const CACHE_STRATEGIES: ProConOption[] = [
  {
    id: 'cache-aside',
    label: 'Cache Aside',
    sublabel: 'Lazy loading',
    color: C,
    icon: '🔍',
    pros: [
      { text: 'Cache só contém dados acessados — sem cold data', weight: 'high' },
      { text: 'Falha do cache não derruba a app', weight: 'high' },
      { text: 'Modelo mental simples: app controla o cache', weight: 'medium' },
    ],
    cons: [
      { text: 'Cache miss = 3 operações (miss + DB + SET)', weight: 'medium' },
      { text: 'Race condition em writes concorrentes', weight: 'high', context: ['Mitigar com lock ou version check'] },
      { text: 'Dados stale até o TTL expirar', weight: 'medium' },
    ],
    bestFor: ['Read-heavy com dados mutáveis', 'APIs de perfil de usuário', 'Qualquer cache Redis simples'],
  },
  {
    id: 'write-through',
    label: 'Write Through',
    sublabel: 'Sync write',
    color: GRN,
    icon: '✍️',
    pros: [
      { text: 'Cache sempre consistente com DB', weight: 'high' },
      { text: 'Sem cache miss em leitura (dado sempre lá)', weight: 'high' },
      { text: 'Ótimo para dados lidos imediatamente após write', weight: 'medium' },
    ],
    cons: [
      { text: 'Latência de write aumenta (cache + DB)', weight: 'medium' },
      { text: 'Cache contém dados que talvez nunca sejam lidos', weight: 'low' },
      { text: 'Custo de cache maior (todos os dados escritos ficam)', weight: 'medium' },
    ],
    bestFor: ['Dados críticos lidos logo após write', 'Leaderboard em tempo real', 'Configurações de sistema'],
  },
  {
    id: 'write-behind',
    label: 'Write Behind',
    sublabel: 'Async write (write-back)',
    color: AMB,
    icon: '⚡',
    pros: [
      { text: 'Write latência mínima — responde ao cliente imediatamente', weight: 'high' },
      { text: 'Batch writes → menos IOPS no DB', weight: 'high' },
      { text: 'Excelente throughput de escrita', weight: 'high' },
    ],
    cons: [
      { text: 'Perda de dados se cache cair antes de persistir no DB', weight: 'high', context: ['Risco crítico em fintech'] },
      { text: 'Complexidade de implementação alta', weight: 'medium' },
      { text: 'Debug difícil — dado está no cache, não no DB', weight: 'medium' },
    ],
    bestFor: ['Write-heavy com tolerância a perda eventual', 'Contadores de views', 'Session stores'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function SystemDesignVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'escala',
      title: 'Escalabilidade',
      subtitle: 'Horizontal vs vertical — trade-offs em múltiplas dimensões',
      accent: C,
      component: (
        <ComparisonTable
          options={SCALE_OPTIONS}
          criteria={SCALE_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'load-balancer',
      title: 'Load Balancer',
      subtitle: 'Round Robin, Least Connections, IP Hash, Weighted — como cada algoritmo distribui tráfego',
      accent: C2,
      component: <LoadBalancerVisual />,
    },
    {
      id: 'cache',
      title: 'Hierarquia de Cache',
      subtitle: 'CPU L1/L2/L3 → Application → Redis → CDN → DB — latência e tamanho de cada camada',
      accent: AMB,
      component: (
        <LayerStack
          layers={CACHE_LAYERS}
          accentColor={AMB}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'cap',
      title: 'CAP Theorem',
      subtitle: 'Triângulo interativo com sistemas reais — onde cada banco de dados se posiciona',
      accent: C,
      component: <CAPTheoremVisual />,
    },
    {
      id: 'message-queue',
      title: 'Message Queue',
      subtitle: 'Producer → Broker → Consumer com ack/nack, retry e Dead Letter Queue',
      accent: AMB,
      component: (
        <SequenceDiagram
          actors={MQ_ACTORS}
          messages={MQ_MESSAGES}
          groups={MQ_GROUPS}
          accentColor={AMB}
          bgColor={BG}
          title="Message Queue — Happy Path + Retry + DLQ"
          description="Clique em uma mensagem para ver detalhes"
        />
      ),
    },
    {
      id: 'rate-limiting',
      title: 'Rate Limiting',
      subtitle: 'Token Bucket, Leaky Bucket, Fixed Window, Sliding Window — como cada algoritmo funciona',
      accent: RED,
      component: <RateLimitingVisual />,
    },
    {
      id: 'consistent-hashing',
      title: 'Consistent Hashing',
      subtitle: 'Anel de hash interativo — simule adição e remoção de nós',
      accent: C,
      component: <ConsistentHashingVisual />,
    },
    {
      id: 'url-shortener',
      title: 'URL Shortener — Fluxo Completo',
      subtitle: 'Todos os componentes em ação: criar URL curta + redirect com cache hit',
      accent: PRP,
      component: (
        <SequenceDiagram
          actors={URL_ACTORS}
          messages={URL_MESSAGES}
          groups={URL_GROUPS}
          accentColor={PRP}
          bgColor={BG}
          title="URL Shortener — Criar e Redirecionar"
          description="Clique em uma mensagem para ver detalhes do fluxo"
        />
      ),
    },
    {
      id: 'sql-vs-nosql',
      title: 'SQL vs NoSQL',
      subtitle: 'Relacional, Document, Key-Value e Columnar — quando usar cada um',
      accent: '#4479A1',
      component: (
        <ComparisonTable
          options={DB_OPTIONS}
          criteria={DB_CRITERIA}
          accentColor={'#4479A1'}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'decision-tree',
      title: 'Qual componente usar?',
      subtitle: 'Árvore de decisão interativa — do problema ao componente certo',
      accent: C,
      component: (
        <DecisionTree
          root={SD_DECISION_ROOT}
          nodes={SD_DECISION_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os erros mais comuns em entrevistas de system design — e como evitar',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={SD_ANTIPATTERNS}
          accentColor={RED}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'cache-strategies',
      title: 'Cache Strategies',
      subtitle: 'Cache Aside vs Write-Through vs Write-Behind — prós, contras e quando usar',
      accent: C,
      component: (
        <ProConMatrix
          options={CACHE_STRATEGIES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada de Domínio',
      subtitle: 'Do iniciante ao staff — conceitos por nível de senioridade',
      accent: C,
      component: (
        <ProgressionMap
          levels={SD_PROGRESSION}
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
