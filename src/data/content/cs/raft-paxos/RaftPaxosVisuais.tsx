'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisShell'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'

// ── Paleta Raft/Paxos (indigo) ────────────────────────────────────────────────
const C      = '#6366f1'   // indigo — cor primária do tema raft-paxos
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Quorum Intersection — por que 2f+1 funciona
// Por que visual: a propriedade de interseção de quorums (qualquer dois quorums
// se intersectam) é a prova informal de por que consenso é possível. Diagrama
// de Venn interativo ensina isso de forma que nenhum texto consegue.
// ═══════════════════════════════════════════════════════════════════════════════

function QuorumIntersectionVisual() {
  const [clusterSize, setClusterSize] = useState<3 | 5 | 7>(3)
  const [scenario, setScenario] = useState<'normal' | 'failure' | 'split'>('normal')

  const configs = {
    3: { quorum: 2, tolerance: 1, nodes: ['N1', 'N2', 'N3'] },
    5: { quorum: 3, tolerance: 2, nodes: ['N1', 'N2', 'N3', 'N4', 'N5'] },
    7: { quorum: 4, tolerance: 3, nodes: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7'] },
  }

  const cfg = configs[clusterSize]

  // Para o cenário de cluster par — 4 nós
  const evenNodes = ['N1', 'N2', 'N3', 'N4']

  const nodeStatusNormal: Record<string, 'alive' | 'dead' | 'quorum1' | 'quorum2'> = {}
  cfg.nodes.forEach((n, i) => {
    if (scenario === 'failure') {
      nodeStatusNormal[n] = i < cfg.tolerance ? 'dead' : i < cfg.quorum + cfg.tolerance ? 'quorum1' : 'alive'
    } else if (scenario === 'split' && clusterSize === 3) {
      // 2 vs 1 — lado com 2 tem quorum
      nodeStatusNormal[n] = i < 2 ? 'quorum1' : 'dead'
    } else {
      nodeStatusNormal[n] = i < cfg.quorum ? 'quorum1' : 'alive'
    }
  })

  const nodeColors: Record<string, string> = {
    alive:   '#334155',
    dead:    '#1e293b',
    quorum1: C,
    quorum2: '#f59e0b',
  }

  const nodeTextColors: Record<string, string> = {
    alive:   FGMUTE,
    dead:    '#475569',
    quorum1: '#fff',
    quorum2: '#1a1200',
  }

  const isAlive = (status: string) => status !== 'dead'

  const aliveCount = Object.values(nodeStatusNormal).filter(isAlive).length

  return (
    <div style={{ padding: 24, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Controles e nós */}
      <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Seletor de tamanho */}
        <div style={{ background: CARD, borderRadius: 8, padding: 14, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: FG, marginBottom: 10 }}>Tamanho do cluster</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {([3, 5, 7] as const).map(n => (
              <button
                key={n}
                onClick={() => setClusterSize(n)}
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 6, border: `1px solid ${clusterSize === n ? C : LINE}`,
                  background: clusterSize === n ? C : 'transparent',
                  color: clusterSize === n ? '#fff' : FGMUTE,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {n} nós
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 11, color: FGMUTE }}>
              Quorum: <span style={{ color: C, fontWeight: 700 }}>{cfg.quorum}/{clusterSize}</span>
            </div>
            <div style={{ fontSize: 11, color: FGMUTE }}>
              Tolera: <span style={{ color: '#4ade80', fontWeight: 700 }}>{cfg.tolerance} falha{cfg.tolerance > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Cenários */}
        <div style={{ background: CARD, borderRadius: 8, padding: 14, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: FG, marginBottom: 10 }}>Cenário</div>
          {[
            { id: 'normal', label: 'Cluster saudável', desc: 'Todos os nós online' },
            { id: 'failure', label: `${cfg.tolerance} nó${cfg.tolerance > 1 ? 's' : ''} com falha`, desc: 'Máximo tolerável — ainda há quorum' },
            { id: 'split', label: 'Partição de rede', desc: 'Lado com maioria continua' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id as typeof scenario)}
              style={{
                width: '100%', textAlign: 'left', padding: '8px 10px', marginBottom: 6,
                borderRadius: 6, border: `1px solid ${scenario === s.id ? C : LINE}`,
                background: scenario === s.id ? 'rgba(99,102,241,.1)' : 'transparent',
                color: scenario === s.id ? C : FGMUTE,
                fontSize: 10, cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, color: scenario === s.id ? C : FG }}>{s.label}</div>
              <div style={{ marginTop: 2, color: FGMUTE }}>{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Nós visuais */}
        <div style={{ background: CARD, borderRadius: 8, padding: 14, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: FG, marginBottom: 10 }}>Nós do cluster</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cfg.nodes.map(n => {
              const status = nodeStatusNormal[n]
              return (
                <div
                  key={n}
                  style={{
                    width: 44, height: 44, borderRadius: 8,
                    background: nodeColors[status],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: nodeTextColors[status],
                    border: status === 'dead' ? `1px dashed ${LINE}` : `1px solid ${nodeColors[status]}`,
                    transition: 'all .3s',
                    textDecoration: status === 'dead' ? 'line-through' : 'none',
                  }}
                >
                  {n}
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: aliveCount >= cfg.quorum ? '#4ade80' : '#f87171', fontWeight: 700 }}>
            {aliveCount >= cfg.quorum
              ? `✓ Quorum atingido (${aliveCount}/${clusterSize} vivos) — cluster operacional`
              : `✗ Sem quorum (${aliveCount}/${clusterSize} vivos) — cluster parado`}
          </div>
        </div>
      </div>

      {/* Explicação e fórmulas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: CARD, borderRadius: 8, padding: 16, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C, marginBottom: 10 }}>
            Fórmula: 2f+1 nós para tolerar f falhas
          </div>
          {([3, 5, 7] as const).map(n => (
            <div
              key={n}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px',
                borderRadius: 6, marginBottom: 4,
                background: n === clusterSize ? 'rgba(99,102,241,.1)' : 'transparent',
                border: `1px solid ${n === clusterSize ? C : 'transparent'}`,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: n === clusterSize ? C : FGMUTE, width: 50 }}>
                {n} nós
              </span>
              <span style={{ fontSize: 11, color: FGMUTE, flex: 1 }}>
                quorum = {configs[n].quorum} | tolera {configs[n].tolerance} falha{configs[n].tolerance > 1 ? 's' : ''}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: CARD, borderRadius: 8, padding: 16, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C, marginBottom: 10 }}>
            Por que cluster par é ruim?
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {evenNodes.map((n, i) => (
              <div
                key={n}
                style={{
                  width: 44, height: 44, borderRadius: 8, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  background: i < 2 ? C : '#ef4444',
                  color: 'white',
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
            4 nós com partição 2×2: nenhum lado tem 3/4 do quorum.{' '}
            <span style={{ color: '#f87171' }}>Cluster para completamente.</span>{' '}
            Com 3 nós, a partição 2×1 ainda tem quorum no lado majoritário.{' '}
            E 4 nós têm o mesmo custo que 5 mas mesma tolerância que 3 — pior de dois mundos.
          </div>
        </div>

        <div style={{ background: CARD, borderRadius: 8, padding: 16, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C, marginBottom: 8 }}>
            Propriedade de interseção de quorums
          </div>
          <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
            Qualquer dois quorums (conjuntos de maioria) se intersectam em pelo menos 1 nó.
            Esse nó "testemunhou" a primeira decisão e pode rejeitar uma segunda decisão conflitante.
            É a propriedade que torna consenso matematicamente possível —{' '}
            <span style={{ color: FG }}>impossível ter duas maiorias sem sobreposição.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Raft Leader Election — StateMachineExplorer
// Por que visual: o ciclo follower → candidate → leader com os eventos que
// disparam cada transição é uma máquina de estados perfeita. Candidatos de
// entrevista precisam descrever esse fluxo em detalhes.
// ═══════════════════════════════════════════════════════════════════════════════

const RAFT_STATES: SMState[] = [
  {
    id: 'follower',
    label: 'Follower',
    description: 'Estado inicial. Recebe heartbeats do leader e AppendEntries. Se não receber heartbeat por electionTimeout (150-300ms aleatório), vira candidate.',
    color: '#3b82f6',
    isInitial: true,
  },
  {
    id: 'candidate',
    label: 'Candidate',
    description: 'Iniciou eleição: incrementou currentTerm, votou em si mesmo, enviou RequestVote para todos. Aguarda votos. Se receber heartbeat de leader com term ≥ atual, volta a follower.',
    color: '#f59e0b',
  },
  {
    id: 'leader',
    label: 'Leader',
    description: 'Recebeu maioria dos votos. Envia heartbeats periódicos (AppendEntries vazios). Único a receber writes de clientes. Replica log para followers.',
    color: C,
    isFinal: true,
  },
]

const RAFT_TRANSITIONS: SMTransition[] = [
  {
    from: 'follower',
    to: 'candidate',
    event: 'electionTimeout expirou',
    guard: 'Sem heartbeat do leader por 150-300ms (aleatório)',
    code: 'currentTerm++; votedFor = self; sendRequestVote(all)',
  },
  {
    from: 'candidate',
    to: 'leader',
    event: 'Recebeu maioria dos votos',
    guard: 'votes.size() >= quorum (⌊N/2⌋ + 1)',
    code: 'role = LEADER; sendHeartbeat(all); nextIndex[f] = lastLogIndex + 1',
  },
  {
    from: 'candidate',
    to: 'follower',
    event: 'Outro leader eleito ou term maior',
    guard: 'Heartbeat com term ≥ currentTerm, ou RequestVote com term maior',
    code: 'currentTerm = msg.term; votedFor = null; role = FOLLOWER',
  },
  {
    from: 'leader',
    to: 'follower',
    event: 'Recebe mensagem com term maior',
    guard: 'AppendEntries ou RequestVote com term > currentTerm',
    code: 'currentTerm = msg.term; votedFor = null; role = FOLLOWER',
  },
  {
    from: 'candidate',
    to: 'candidate',
    event: 'Split vote — nova eleição',
    guard: 'electionTimeout expirou sem maioria (empate de votos)',
    code: 'currentTerm++; votedFor = self; sendRequestVote(all)',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Log Replication — SequenceDiagram
// Por que visual: a sequência temporal de AppendEntries, confirmação de maioria,
// commit e apply envolve múltiplos atores com timing específico.
// ═══════════════════════════════════════════════════════════════════════════════

const LOG_ACTORS: SeqActor[] = [
  { id: 'client',  label: 'Client',       color: '#e2e8f0' },
  { id: 'leader',  label: 'Leader',       color: C },
  { id: 'f1',      label: 'Follower 1',   color: '#3b82f6' },
  { id: 'f2',      label: 'Follower 2',   color: '#8b5cf6' },
]

const LOG_MESSAGES: SeqMessage[] = [
  {
    from: 'client', to: 'leader',
    label: 'SET x = 42',
    type: 'sync',
    note: 'Writes sempre vão para o leader',
  },
  {
    from: 'leader', to: 'leader',
    label: 'Appenda log[5] = {term:3, cmd:"SET x=42"}',
    type: 'async',
    note: 'Persiste localmente antes de replicar',
  },
  {
    from: 'leader', to: 'f1',
    label: 'AppendEntries(prevIdx=4, entries=[{term:3,...}])',
    type: 'async',
    note: 'Paralelo para todos os followers',
  },
  {
    from: 'leader', to: 'f2',
    label: 'AppendEntries(prevIdx=4, entries=[{term:3,...}])',
    type: 'async',
  },
  {
    from: 'f1', to: 'leader',
    label: 'success=true (logIdx=5 appended)',
    type: 'return',
    note: 'F1 confirma — agora temos líder+F1 = quorum (2/3)',
  },
  {
    from: 'leader', to: 'leader',
    label: 'commit idx=5 (quorum atingido)',
    type: 'async',
    note: 'Aplica na state machine local',
  },
  {
    from: 'leader', to: 'client',
    label: 'OK (write commitado)',
    type: 'return',
    note: 'Resposta ao cliente após commit',
  },
  {
    from: 'f2', to: 'leader',
    label: 'success=true (logIdx=5 appended)',
    type: 'return',
    note: 'F2 confirma depois — já commitado, mas ainda bom',
  },
  {
    from: 'leader', to: 'f1',
    label: 'AppendEntries heartbeat (commitIndex=5)',
    type: 'async',
    note: 'Followers aplicam na state machine deles',
  },
  {
    from: 'leader', to: 'f2',
    label: 'AppendEntries heartbeat (commitIndex=5)',
    type: 'async',
  },
]

const LOG_GROUPS: SeqGroup[] = [
  {
    label: 'Replicação paralela',
    kind: 'par',
    fromMsg: 2,
    toMsg: 3,
    color: C,
  },
  {
    label: 'Quorum atingido → commit',
    kind: 'opt',
    fromMsg: 4,
    toMsg: 5,
    color: '#4ade80',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Raft vs Consenso Alternativo — ComparisonTable
// Por que visual: comparar Raft, Multi-Paxos, ZAB e Single-Primary em múltiplas
// dimensões (latência, garantias, complexidade) simultaneamente.
// ═══════════════════════════════════════════════════════════════════════════════

const CONSENSUS_OPTIONS: ComparisonOption[] = [
  { id: 'raft',    label: 'Raft',          sublabel: 'etcd, CockroachDB, KRaft', color: C },
  { id: 'paxos',   label: 'Multi-Paxos',   sublabel: 'Spanner, Chubby',          color: '#f59e0b' },
  { id: 'zab',     label: 'ZAB',           sublabel: 'ZooKeeper',                color: '#10b981' },
  { id: 'primary', label: 'Single Primary',sublabel: 'MySQL replica, async',     color: '#94a3b8' },
]

const CONSENSUS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'consistency',
    label: 'Garantia de Consistência',
    description: 'Nível de consistência garantido pelo protocolo',
    values: {
      raft:    { rating: 'excellent', note: 'Linearizabilidade provada — safety + liveness' },
      paxos:   { rating: 'excellent', note: 'Consenso formal — base teórica sólida' },
      zab:     { rating: 'excellent', note: 'Total order broadcast — garante ordem global' },
      primary: { rating: 'poor',      note: 'Eventual consistency — réplica pode estar atrasada' },
    },
  },
  {
    id: 'write-latency',
    label: 'Latência de Write',
    description: 'Latência para commitar uma escrita',
    values: {
      raft:    { rating: 'good', note: '1 RTT após leader eleito — previsível' },
      paxos:   { rating: 'good', note: '1 RTT com leader estável (2 em conflitos)' },
      zab:     { rating: 'good', note: '1 RTT para broadcast atômico' },
      primary: { rating: 'excellent', note: 'Sem esperar réplicas — latência mínima' },
    },
  },
  {
    id: 'fault-tolerance',
    label: 'Tolerância a Falhas',
    description: 'Quantas falhas o sistema aguenta sem perder dados',
    values: {
      raft:    { rating: 'excellent', note: 'f falhas em 2f+1 nós — sem perda de dados commitados' },
      paxos:   { rating: 'excellent', note: 'Idem — quorum garante mesma propriedade' },
      zab:     { rating: 'excellent', note: 'Idem — f falhas em 2f+1 nós' },
      primary: { rating: 'poor',      note: 'Se primary cai antes de replicar, dados perdidos' },
    },
  },
  {
    id: 'understandability',
    label: 'Facilidade de Implementar',
    description: 'Dificuldade de implementar corretamente',
    values: {
      raft:    { rating: 'excellent', note: 'Especificação completa — edge cases documentados' },
      paxos:   { rating: 'poor',      note: 'Multi-Paxos não especificado — cada impl. diverge' },
      zab:     { rating: 'fair',      note: 'Documentado mas menos lib disponíveis' },
      primary: { rating: 'excellent', note: 'Simples — sem protocolo de consenso' },
    },
  },
  {
    id: 'write-scalability',
    label: 'Escala de Writes',
    description: 'Capacidade de escalar writes horizontalmente',
    values: {
      raft:    { rating: 'poor',  note: 'Bottleneck no leader — writes não escalam' },
      paxos:   { rating: 'fair', note: 'Flexível — Multi-Paxos pode ter multi-leaders' },
      zab:     { rating: 'poor', note: 'Single leader para ordem global' },
      primary: { rating: 'fair', note: 'Write em qualquer réplica com replication lag' },
    },
  },
  {
    id: 'operational',
    label: 'Complexidade Operacional',
    description: 'Dificuldade de operar em produção',
    values: {
      raft:    { rating: 'good',      note: 'Eleição automática, libs maduras (etcd, hashicorp/raft)' },
      paxos:   { rating: 'fair',      note: 'Requer mais tuning; menos ferramentas padronizadas' },
      zab:     { rating: 'good',      note: 'ZooKeeper é bem maduro com tooling estabelecido' },
      primary: { rating: 'excellent', note: 'Sem protocolo de eleição — ops mais simples' },
    },
  },
]

// ── Componente principal ───────────────────────────────────────────────────────

export default function RaftPaxosVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'quorum-intersection',
      title: 'Quorum — Por que 2f+1',
      subtitle: 'Interativo — veja o que acontece com cada tamanho de cluster e cenário de falha',
      accent: C,
      component: <QuorumIntersectionVisual />,
    },
    {
      id: 'leader-election',
      title: 'Leader Election',
      subtitle: 'Máquina de estados do Raft — follower, candidate, leader com todos os eventos',
      accent: C,
      component: (
        <StateMachineExplorer
          states={RAFT_STATES}
          transitions={RAFT_TRANSITIONS}
          initialState="follower"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Raft — Leader Election"
          description="Clique em cada estado para ver quando ele se aplica e o que o provoca. As transições mostram os eventos e guardas exatos do algoritmo."
        />
      ),
    },
    {
      id: 'log-replication',
      title: 'Log Replication',
      subtitle: 'Sequência temporal — AppendEntries, quorum, commit e apply',
      accent: C,
      component: (
        <SequenceDiagram
          actors={LOG_ACTORS}
          messages={LOG_MESSAGES}
          groups={LOG_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="Raft — Log Replication"
          description="Fluxo completo de uma escrita no Raft: do cliente até o commit e notify dos followers. O commit acontece quando a maioria confirma, não quando todos confirmam."
        />
      ),
    },
    {
      id: 'consensus-comparison',
      title: 'Algoritmos de Consenso',
      subtitle: 'Raft vs Multi-Paxos vs ZAB vs Single Primary — todos os trade-offs',
      accent: C,
      component: (
        <ComparisonTable
          options={CONSENSUS_OPTIONS}
          criteria={CONSENSUS_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Algoritmos de Consenso"
          description="Clique em um algoritmo para destacar seus pontos fortes. Raft é a escolha default para novas implementações — especificação completa e libs maduras."
          highlightBest
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
