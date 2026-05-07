'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'

// ── Paleta Kafka ──────────────────────────────────────────────────────────────
const C      = '#231F20'   // preto Kafka — usado em accent/borda
const CA     = '#4a4545'   // cinza Kafka para destaques
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const PRP    = '#8b5cf6'
const SKY    = '#38bdf8'

// ─────────────────────────────────────────────────────────────────────────────
// Visual 1: Arquitetura interativa — Topics, Partitions e Consumer Groups
// ─────────────────────────────────────────────────────────────────────────────

const PARTITIONS = [
  { id: 0, leader: 'broker-1', msgs: [0, 3, 6], color: RED },
  { id: 1, leader: 'broker-2', msgs: [1, 4, 7], color: AMB },
  { id: 2, leader: 'broker-3', msgs: [2, 5, 8], color: GRN },
]

const CONSUMERS = [
  { id: 1, partition: 0, color: RED },
  { id: 2, partition: 1, color: AMB },
  { id: 3, partition: 2, color: GRN },
]

function KafkaArchVisual() {
  const [selected, setSelected] = useState<number | null>(null)

  const detail = selected !== null ? PARTITIONS[selected] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Clique em uma partition para ver os detalhes de roteamento e replicação
      </div>

      {/* Producers → Topic */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Producers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          {['Producer A (key: user-1)', 'Producer B (key: user-2)', 'Producer C (sem key)'].map((p, i) => (
            <div key={i} style={{ padding: '6px 10px', borderRadius: 6, background: `${AMB}20`, border: `1px solid ${AMB}60`, fontSize: 11, color: AMB, fontFamily: 'JetBrains Mono, monospace' }}>
              {p}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 20, color: FGMUTE, flexShrink: 0 }}>{'→'}</div>

        {/* Partitions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: PRP, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>
            Topic: orders (3 partitions, RF=3)
          </div>
          {PARTITIONS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(selected === p.id ? null : p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                border: `2px solid ${selected === p.id ? p.color : LINE}`,
                background: selected === p.id ? `${p.color}15` : CARD,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'all .2s',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: p.color, minWidth: 30 }}>P-{p.id}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {p.msgs.map(m => (
                  <div key={m} style={{ width: 22, height: 22, borderRadius: 4, background: `${p.color}30`, border: `1px solid ${p.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: p.color, fontFamily: 'JetBrains Mono, monospace' }}>
                    {m}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 10, color: FGMUTE, marginLeft: 'auto' }}>leader: {p.leader}</span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 20, color: FGMUTE, flexShrink: 0 }}>{'→'}</div>

        {/* Consumer Group */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GRN, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
            Consumer Group: order-processor
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '10px', border: `1px solid ${GRN}50`, borderRadius: 8, background: `${GRN}08` }}>
            {CONSUMERS.map(c => (
              <div key={c.id} style={{ padding: '5px 10px', borderRadius: 6, background: selected === c.partition ? `${c.color}20` : CARD, border: `1px solid ${selected === c.partition ? c.color : LINE}`, fontSize: 11, color: c.color, fontFamily: 'JetBrains Mono, monospace', transition: 'all .2s' }}>
                Consumer-{c.id} {'←'} P-{c.partition}
              </div>
            ))}
            <div style={{ padding: '5px 10px', borderRadius: 6, background: CARD, border: `1px dashed ${LINE}`, fontSize: 11, color: FGMUTE, fontFamily: 'JetBrains Mono, monospace' }}>
              Consumer-4 (ocioso)
            </div>
          </div>
        </div>
      </div>

      {detail && (
        <div style={{ padding: '14px 16px', borderRadius: 10, background: `${detail.color}12`, border: `2px solid ${detail.color}40` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: detail.color, marginBottom: 8 }}>
            Partition {detail.id} — detalhes
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11, color: FG, lineHeight: 1.6 }}>
            <div>
              <strong style={{ color: FGMUTE }}>Leader:</strong> {detail.leader} (recebe writes do producer)
            </div>
            <div>
              <strong style={{ color: FGMUTE }}>Followers:</strong> os outros 2 brokers (ISR — replication factor 3)
            </div>
            <div>
              <strong style={{ color: FGMUTE }}>Mensagens:</strong> offsets {detail.msgs.join(', ')} (ordem garantida dentro desta partition)
            </div>
            <div>
              <strong style={{ color: FGMUTE }}>Consumer:</strong> Consumer-{detail.id + 1} — exatamente 1 consumer por partition no grupo
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: FGMUTE, lineHeight: 1.5 }}>
            ⚠ Consumer-4 está ocioso: {PARTITIONS.length} partitions já têm {PARTITIONS.length} consumers. Mais consumers que partitions nunca aumentam paralelismo.
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 2: Replicação e ISR — SequenceDiagram
// ─────────────────────────────────────────────────────────────────────────────

const ISR_ACTORS: SeqActor[] = [
  { id: 'producer', label: 'Producer', color: AMB },
  { id: 'leader',   label: 'Broker-1 (Leader)',  color: RED },
  { id: 'isr1',     label: 'Broker-2 (ISR)',     color: GRN },
  { id: 'isr2',     label: 'Broker-3 (ISR)',     color: GRN },
]

const ISR_MESSAGES: SeqMessage[] = [
  { from: 'producer', to: 'leader',   label: 'PRODUCE msg (acks=all)', type: 'sync' },
  { from: 'leader',   to: 'isr1',    label: 'Replicar offset 7',       type: 'async', note: 'fetch periódico do follower' },
  { from: 'leader',   to: 'isr2',    label: 'Replicar offset 7',       type: 'async' },
  { from: 'isr1',     to: 'leader',  label: 'ACK offset 7',            type: 'return' },
  { from: 'isr2',     to: 'leader',  label: 'ACK offset 7',            type: 'return', note: 'HW avança para 7 após todas ISRs confirmarem' },
  { from: 'leader',   to: 'producer',label: 'ACK (acks=all: líder + ISRs confirmaram)', type: 'return' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Visual 3: Consumer Group State Machine
// ─────────────────────────────────────────────────────────────────────────────

const CG_STATES: SMState[] = [
  { id: 'finding',  label: 'Finding Coordinator', description: 'Consumer localiza o Group Coordinator — o broker que gerencia o grupo.', color: SKY,  isInitial: true },
  { id: 'joining',  label: 'Joining',              description: 'Consumer envia JoinGroup request. O coordinator elege um leader (o primeiro a chegar).', color: AMB },
  { id: 'syncing',  label: 'Syncing',              description: 'Consumer leader faz a atribuição de partitions e envia via SyncGroup. Todos recebem sua fatia.', color: PRP },
  { id: 'stable',   label: 'Stable',               description: 'Consumindo. Heartbeat periódico para o coordinator. Max.poll.interval.ms para processar entre polls.', color: GRN },
  { id: 'rebalancing', label: 'Rebalancing',       description: 'Consumer entrou/saiu ou estourou o timeout. TODOS param de processar (Eager Rebalancing clássico) até nova atribuição.', color: RED },
  { id: 'dead',     label: 'Dead',                 description: 'Consumer removido do grupo por timeout excessivo. Partitions redistribuídas para os sobreviventes.', color: CA, isFinal: true },
]

const CG_TRANSITIONS: SMTransition[] = [
  { from: 'finding',     to: 'joining',     event: 'Coordinator encontrado' },
  { from: 'joining',     to: 'syncing',     event: 'JoinGroup aceito' },
  { from: 'syncing',     to: 'stable',      event: 'Partitions atribuídas' },
  { from: 'stable',      to: 'rebalancing', event: 'Consumer entra/sai ou heartbeat timeout', guard: 'session.timeout.ms expirado' },
  { from: 'rebalancing', to: 'joining',     event: 'Rebalancing iniciado — todos rejoinam' },
  { from: 'stable',      to: 'dead',        event: 'max.poll.interval.ms estourado', guard: 'processamento lento entre polls' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Visual 4: Kafka vs RabbitMQ — ComparisonTable
// ─────────────────────────────────────────────────────────────────────────────

const BROKER_OPTIONS: ComparisonOption[] = [
  { id: 'kafka',    label: 'Apache Kafka',  sublabel: 'Log distribuído', color: CA },
  { id: 'rabbit',   label: 'RabbitMQ',      sublabel: 'Fila clássica AMQP', color: '#FF6600' },
]

const BROKER_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'modelo',
    label: 'Modelo de dados',
    description: 'Como as mensagens são armazenadas e consumidas',
    values: {
      kafka:  { rating: 'excellent', note: 'Log imutável — consumers leem sem deletar. Replay possível.' },
      rabbit: { rating: 'good',      note: 'Fila clássica — mensagem some após consumo.' },
    },
  },
  {
    id: 'throughput',
    label: 'Throughput',
    description: 'Mensagens por segundo em escala',
    values: {
      kafka:  { rating: 'excellent', note: 'Milhões/s via sequential I/O + zero-copy + batching.' },
      rabbit: { rating: 'fair',      note: 'Dezenas de milhares/s. Adequado para maioria dos casos.' },
    },
  },
  {
    id: 'replay',
    label: 'Replay de mensagens',
    description: 'Reprocessar eventos antigos',
    values: {
      kafka:  { rating: 'excellent', note: 'Replay via reset de offset. Retention configurável.' },
      rabbit: { rating: 'poor',      note: 'Mensagem deletada após consumo. Sem replay nativo.' },
    },
  },
  {
    id: 'routing',
    label: 'Roteamento complexo',
    description: 'Exchanges, routing keys, fanout, topic patterns',
    values: {
      kafka:  { rating: 'fair',      note: 'Topics e consumer groups. Roteamento simples.' },
      rabbit: { rating: 'excellent', note: 'Exchanges (direct, fanout, topic, headers). Muito flexível.' },
    },
  },
  {
    id: 'retention',
    label: 'Retenção de histórico',
    description: 'Manter mensagens por longo período',
    values: {
      kafka:  { rating: 'excellent', note: 'Retention.ms configurável — semanas, meses ou ilimitado com compaction.' },
      rabbit: { rating: 'poor',      note: 'Mensagens para consumo imediato. TTL por mensagem, não histórico.' },
    },
  },
  {
    id: 'ordering',
    label: 'Ordenação de mensagens',
    description: 'Garantia de ordem de processamento',
    values: {
      kafka:  { rating: 'good',      note: 'Ordem garantida dentro de uma partition. Use partition key por entidade.' },
      rabbit: { rating: 'good',      note: 'Ordem na fila. Múltiplos consumers podem quebrar a ordem.' },
    },
  },
  {
    id: 'operacao',
    label: 'Simplicidade operacional',
    description: 'Facilidade de setup, monitoramento e manutenção',
    values: {
      kafka:  { rating: 'fair',      note: 'Mais complexo. Brokers, partitions, ISR, Schema Registry.' },
      rabbit: { rating: 'good',      note: 'Mais simples de operar. Management UI inclusa.' },
    },
  },
  {
    id: 'dlq',
    label: 'Dead Letter Queue nativa',
    description: 'Tratamento de mensagens com falha',
    values: {
      kafka:  { rating: 'fair',      note: 'Dead Letter Topic por convenção (não nativo). Spring Kafka implementa.' },
      rabbit: { rating: 'excellent', note: 'Dead Letter Exchange nativo por configuração.' },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Visual 5: Offset Commit — estados interativos
// ─────────────────────────────────────────────────────────────────────────────

const OFFSET_SCENARIOS = [
  {
    id: 'auto',
    label: 'Auto-commit',
    color: RED,
    config: 'enable.auto.commit=true\nauto.commit.interval.ms=5000',
    timeline: [
      { label: 'Poll mensagens 0-9', status: 'processing', note: '' },
      { label: 'AUTO-COMMIT offset 9 (após 5s)', status: 'committed', note: 'commit automático antes de processar tudo' },
      { label: 'Processando msg 7...', status: 'processing', note: '' },
      { label: 'CRASH', status: 'error', note: 'offset já foi commitado!' },
      { label: 'Restart: começa do offset 10', status: 'warn', note: 'Msgs 7, 8, 9 NÃO são reprocessadas → perda de dados!' },
    ],
    risk: 'PERDA DE DADOS: commit antes de processar. Em crash, mensagens são perdidas.',
  },
  {
    id: 'manual-sync',
    label: 'Manual commitSync()',
    color: GRN,
    config: 'enable.auto.commit=false\ncommitSync() após processar',
    timeline: [
      { label: 'Poll mensagens 0-9', status: 'processing', note: '' },
      { label: 'Processa mensagem 0', status: 'ok', note: '' },
      { label: '... processa 1-8 ...', status: 'ok', note: '' },
      { label: 'Processa mensagem 9', status: 'ok', note: '' },
      { label: 'commitSync(offset=10)', status: 'committed', note: 'commit apenas após processar tudo' },
      { label: 'Em crash antes do commit: reprocessa 0-9', status: 'warn', note: 'at-least-once: duplicatas possíveis, não perda' },
    ],
    risk: 'AT-LEAST-ONCE: duplicatas possíveis em crash, mas nunca perda. Implemente idempotência no consumer.',
  },
]

function OffsetCommitVisual() {
  const [scenario, setScenario] = useState('manual-sync')
  const active = OFFSET_SCENARIOS.find(s => s.id === scenario)!

  const statusColors: Record<string, string> = {
    processing: SKY,
    committed:  GRN,
    ok:         GRN,
    warn:       AMB,
    error:      RED,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {OFFSET_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: `2px solid ${scenario === s.id ? s.color : LINE}`,
              background: scenario === s.id ? `${s.color}20` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 12,
              fontWeight: 700,
              color: scenario === s.id ? s.color : FG,
              transition: 'all .2s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '10px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: active.color, whiteSpace: 'pre' }}>
        {active.config}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {active.timeline.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${statusColors[step.status]}20`, border: `1.5px solid ${statusColors[step.status]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: statusColors[step.status], flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: statusColors[step.status], fontWeight: step.status === 'committed' || step.status === 'error' ? 700 : 400 }}>
                {step.label}
              </div>
              {step.note && (
                <div style={{ fontSize: 10, color: FGMUTE, marginTop: 2 }}>{step.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', borderRadius: 8, background: `${active.color}12`, border: `1.5px solid ${active.color}50`, fontSize: 12, color: FG, lineHeight: 1.6 }}>
        <strong style={{ color: active.color }}>Resultado: </strong>{active.risk}
      </div>

      <div style={{ padding: '10px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
        <strong style={{ color: FG }}>Exatamente-uma-vez (Exactly-once):</strong> requer idempotent producer + transações Kafka + isolation.level=read_committed. Complexo — use at-least-once + idempotência no consumer na maioria dos casos.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export default function ApacheKafkaVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'kafka-arch',
      title: 'Topics, Partitions e Consumer Groups',
      subtitle: 'Clique em cada partition para ver roteamento, leader e consumer atribuído',
      accent: PRP,
      component: <KafkaArchVisual />,
    },
    {
      id: 'kafka-isr',
      title: 'Replicação e ISR (acks=all)',
      subtitle: 'Sequência de escrita com acks=all — como durabilidade é garantida pelas In-Sync Replicas',
      accent: GRN,
      component: (
        <SequenceDiagram
          actors={ISR_ACTORS}
          messages={ISR_MESSAGES}
          accentColor={GRN}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'kafka-cg-states',
      title: 'Ciclo de Vida do Consumer Group',
      subtitle: 'Estados e transições — rebalancing, heartbeat, dead consumer e atribuição de partitions',
      accent: AMB,
      component: (
        <StateMachineExplorer
          states={CG_STATES}
          transitions={CG_TRANSITIONS}
          initialState="finding"
          accentColor={AMB}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'kafka-vs-rabbit',
      title: 'Kafka vs RabbitMQ',
      subtitle: 'Comparação multidimensional — quando usar log distribuído vs fila clássica',
      accent: CA,
      component: (
        <ComparisonTable
          options={BROKER_OPTIONS}
          criteria={BROKER_CRITERIA}
          accentColor={PRP}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'kafka-offset',
      title: 'Offset Commit — Auto vs Manual',
      subtitle: 'Visualize o que acontece com auto-commit vs manual em caso de crash',
      accent: GRN,
      component: <OffsetCommitVisual />,
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
