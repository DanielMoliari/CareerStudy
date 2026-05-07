'use client'
import { useState, useEffect, useRef } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'

// ── Paleta Processos/Threads ──────────────────────────────────────────────────
const C      = '#06b6d4'   // cyan — concorrência
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'

void LINE; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Processo vs Thread — Layout de Memória
// ═══════════════════════════════════════════════════════════════════════════════

function ProcessVsThreadVisual() {
  const [view, setView] = useState<'process' | 'thread'>('process')
  const [hovered, setHovered] = useState<string | null>(null)

  const segments = {
    process: [
      { id: 'code', label: 'Code Segment', desc: 'Instruções do programa (read-only). Compartilhado em processos fork() via COW.', color: '#3b82f6', size: 1 },
      { id: 'data', label: 'Data Segment', desc: 'Variáveis globais e estáticas. Inicializadas (.data) e não-inicializadas (.bss).', color: '#8b5cf6', size: 1 },
      { id: 'heap', label: 'Heap', desc: 'Alocação dinâmica (malloc/new). Gerenciado por GC em linguagens managed. Cresce para cima.', color: C, size: 2 },
      { id: 'gap', label: '(espaço livre)', desc: 'Stack e Heap crescem em direções opostas. Se se tocarem: OOM.', color: '#1e293b', size: 1, muted: true },
      { id: 'stack', label: 'Stack', desc: 'Frames de função (LIFO). Rápida. 1-8MB típico. Cresce para baixo.', color: GRN, size: 1 },
    ],
    thread: [
      { id: 'code-shared', label: 'Code Segment (compartilhado)', desc: 'Todas as threads do processo compartilham o mesmo código.', color: '#3b82f680', size: 1 },
      { id: 'data-shared', label: 'Data/Globals (compartilhado)', desc: 'Variáveis globais compartilhadas — principal fonte de race conditions.', color: '#8b5cf680', size: 1 },
      { id: 'heap-shared', label: 'Heap (compartilhado)', desc: 'Heap compartilhado entre todas as threads. Mutex necessário para acesso seguro.', color: `${C}80`, size: 2 },
      { id: 'stack-t1', label: 'Stack Thread 1 (privada)', desc: 'Cada thread tem sua própria stack de chamadas. Frames locais são thread-safe.', color: GRN, size: 1 },
      { id: 'stack-t2', label: 'Stack Thread 2 (privada)', desc: 'Stack separada por thread. Vars locais em funções são automaticamente thread-safe.', color: '#86efac', size: 1 },
    ],
  }

  const current = segments[view]
  const total = current.reduce((a, b) => a + b.size, 0)

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Layout de Memória — Processo vs Thread</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Clique nos segmentos para ver detalhes. Observe o que é compartilhado.</div>
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['process', 'thread'] as const).map(v => (
          <button
            key={v}
            onClick={() => { setView(v); setHovered(null) }}
            style={{
              background: view === v ? `${C}20` : CARD,
              border: `1.5px solid ${view === v ? C : LINE}`,
              borderRadius: 8, color: view === v ? C : FGMUTE,
              fontSize: 12, padding: '6px 18px', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s', fontWeight: view === v ? 700 : 400,
            }}
          >
            {v === 'process' ? 'Processo (isolado)' : 'Threads (compartilhado)'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Diagrama de memória */}
        <div>
          <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Espaço de endereçamento
          </div>
          <div style={{ border: `2px solid ${LINE}`, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: CARD, padding: '4px 8px', fontSize: 9, color: FGMUTE, borderBottom: `1px solid ${LINE}` }}>
              ↑ alto endereço
            </div>
            {current.map(seg => (
              <div
                key={seg.id}
                onMouseEnter={() => setHovered(seg.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setHovered(hovered === seg.id ? null : seg.id)}
                style={{
                  height: `${(seg.size / total) * 140}px`,
                  background: hovered === seg.id
                    ? `${seg.color}30`
                    : (seg as typeof seg & { muted?: boolean }).muted ? '#0f172a' : `${seg.color}15`,
                  borderBottom: `1px solid ${LINE}`,
                  borderLeft: `3px solid ${(seg as typeof seg & { muted?: boolean }).muted ? LINE : seg.color}`,
                  padding: '4px 8px',
                  cursor: (seg as typeof seg & { muted?: boolean }).muted ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <span style={{
                  fontSize: 9, fontWeight: 600,
                  color: (seg as typeof seg & { muted?: boolean }).muted ? '#334155' : seg.color,
                  lineHeight: 1.3,
                }}>
                  {seg.label}
                </span>
              </div>
            ))}
            <div style={{ background: CARD, padding: '4px 8px', fontSize: 9, color: FGMUTE }}>
              ↓ baixo endereço
            </div>
          </div>
        </div>

        {/* Painel de detalhes */}
        <div>
          {hovered ? (
            (() => {
              const seg = current.find(s => s.id === hovered)!
              return (
                <div style={{
                  background: `${seg.color}10`, border: `1.5px solid ${seg.color}40`,
                  borderRadius: 10, padding: 16,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: seg.color, marginBottom: 8 }}>
                    {seg.label}
                  </div>
                  <div style={{ fontSize: 12, color: FG, lineHeight: 1.8 }}>{seg.desc}</div>
                </div>
              )
            })()
          ) : (
            <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
              <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.8 }}>
                {view === 'process' ? (
                  <>
                    <strong style={{ color: FG }}>Processo isolado:</strong> cada processo tem seu próprio espaço de endereçamento. Nenhum segmento é compartilhado por padrão.<br /><br />
                    Comunicação entre processos exige IPC explícito (pipe, socket, shared memory). Crash de um processo não afeta os outros.<br /><br />
                    <strong style={{ color: C }}>Passe o mouse nos segmentos</strong> para ver detalhes de cada um.
                  </>
                ) : (
                  <>
                    <strong style={{ color: FG }}>Threads compartilham o processo:</strong> Code, Data e Heap são compartilhados entre todas as threads. Apenas a Stack é privada por thread.<br /><br />
                    Isso significa que variáveis globais e objetos no Heap precisam de sincronização (mutex). Vars locais em funções são thread-safe por padrão.<br /><br />
                    <strong style={{ color: RED }}>Race condition</strong> = duas threads lendo/escrevendo o Heap sem mutex.
                  </>
                )}
              </div>
            </div>
          )}

          {/* Legenda */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: FGMUTE }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: `${C}40`, border: `2px solid ${C}` }} />
              <span>compartilhado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: FGMUTE }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: `${GRN}40`, border: `2px solid ${GRN}` }} />
              <span>privado por thread</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Race Condition Animada
// ═══════════════════════════════════════════════════════════════════════════════

type RaceStep = {
  threadA: string
  threadB: string
  counter: number
  regA: string
  regB: string
  note: string
  danger: boolean
}

const RACE_STEPS: RaceStep[] = [
  { threadA: 'pronta', threadB: 'pronta', counter: 0, regA: '—', regB: '—', note: 'counter=0. Duas threads prontas para incrementar.', danger: false },
  { threadA: 'LOAD counter → regA=0', threadB: 'aguardando', counter: 0, regA: '0', regB: '—', note: 'Thread A lê counter (0) para o registrador A.', danger: false },
  { threadA: 'suspensa (context switch)', threadB: 'LOAD counter → regB=0', counter: 0, regA: '0', regB: '0', note: 'OS faz context switch! Thread B lê counter — ainda 0 (Thread A não fez STORE ainda).', danger: true },
  { threadA: 'suspensa', threadB: 'ADD 1 → regB=1', counter: 0, regA: '0', regB: '1', note: 'Thread B soma 1 no seu registrador.', danger: true },
  { threadA: 'suspensa', threadB: 'STORE regB → counter=1', counter: 1, regA: '0', regB: '1', note: 'Thread B escreve 1 no counter.', danger: true },
  { threadA: 'retomada: ADD 1 → regA=1', threadB: 'concluída', counter: 1, regA: '1', regB: '1', note: 'Thread A retoma com regA=0 (valor antigo!) e soma 1.', danger: true },
  { threadA: 'STORE regA → counter=1', threadB: 'concluída', counter: 1, regA: '1', regB: '1', note: 'Thread A sobrescreve counter com 1. Esperado: 2. Resultado: 1. Incremento PERDIDO!', danger: true },
]

const MUTEX_STEPS: RaceStep[] = [
  { threadA: 'pronta', threadB: 'pronta', counter: 0, regA: '—', regB: '—', note: 'counter=0. Mutex disponível.', danger: false },
  { threadA: 'mutex.lock() ✓', threadB: 'tenta mutex.lock() → BLOQUEIA', counter: 0, regA: '—', regB: '—', note: 'Thread A adquire o mutex. Thread B tenta e fica bloqueada — espera a vez.', danger: false },
  { threadA: 'LOAD counter → regA=0', threadB: 'bloqueada no mutex', counter: 0, regA: '0', regB: '—', note: 'Thread A executa a seção crítica sem interrupção (OS não cede CPU dentro do mutex).', danger: false },
  { threadA: 'ADD + STORE → counter=1', threadB: 'bloqueada no mutex', counter: 1, regA: '1', regB: '—', note: 'Thread A completa o incremento atômico.', danger: false },
  { threadA: 'mutex.unlock() ✓', threadB: 'mutex.lock() ✓', counter: 1, regA: '1', regB: '—', note: 'Thread A libera o mutex. Thread B é desbloqueada e adquire.', danger: false },
  { threadA: 'concluída', threadB: 'LOAD→ADD→STORE → counter=2', counter: 2, regA: '1', regB: '2', note: 'Thread B executa o incremento completo.', danger: false },
  { threadA: 'concluída', threadB: 'mutex.unlock() ✓', counter: 2, regA: '1', regB: '2', note: 'Resultado correto: 2. Mutex garantiu execução atômica.', danger: false },
]

function RaceConditionVisual() {
  const [mode, setMode] = useState<'race' | 'mutex'>('race')
  const [step, setStep] = useState(0)

  const steps = mode === 'race' ? RACE_STEPS : MUTEX_STEPS
  const current = steps[step]

  function changeMode(m: 'race' | 'mutex') {
    setMode(m)
    setStep(0)
  }

  function ThreadBox({ label, status, color }: { label: string; status: string; color: string }) {
    return (
      <div style={{
        background: CARD, border: `1.5px solid ${color}`, borderRadius: 10, padding: 12,
        flex: 1,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          {label}
        </div>
        <div style={{
          background: `${color}15`, border: `1px solid ${color}40`,
          borderRadius: 6, padding: '6px 10px',
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: FG,
          minHeight: 32,
        }}>
          {status}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Race Condition — Passo a Passo</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Veja como counter++ em duas threads perde incrementos</div>
      </div>

      {/* Toggle modo */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => changeMode('race')}
          style={{
            background: mode === 'race' ? `${RED}15` : CARD,
            border: `1.5px solid ${mode === 'race' ? RED : LINE}`,
            borderRadius: 8, color: mode === 'race' ? RED : FGMUTE,
            fontSize: 11, padding: '6px 16px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Sem mutex (race condition)
        </button>
        <button
          onClick={() => changeMode('mutex')}
          style={{
            background: mode === 'mutex' ? `${GRN}15` : CARD,
            border: `1.5px solid ${mode === 'mutex' ? GRN : LINE}`,
            borderRadius: 8, color: mode === 'mutex' ? GRN : FGMUTE,
            fontSize: 11, padding: '6px 16px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Com mutex (seguro)
        </button>
      </div>

      {/* Estado atual */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <ThreadBox label="Thread A" status={current.threadA} color={C} />
        <ThreadBox label="Thread B" status={current.threadB} color={PRP} />

        <div style={{ background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 10, padding: 12, minWidth: 140 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: AMB, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Memória Compartilhada
          </div>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 9, color: FGMUTE, marginBottom: 2 }}>counter</div>
            <div style={{
              background: `${AMB}15`, border: `1px solid ${AMB}40`,
              borderRadius: 6, padding: '4px 10px',
              fontSize: 14, fontFamily: "'JetBrains Mono', monospace",
              color: AMB, fontWeight: 700, textAlign: 'center',
            }}>
              {current.counter}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            <div>
              <div style={{ fontSize: 9, color: FGMUTE, marginBottom: 2 }}>regA</div>
              <div style={{ background: `${C}10`, border: `1px solid ${C}30`, borderRadius: 4, padding: '2px 6px', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: C, textAlign: 'center' }}>{current.regA}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: FGMUTE, marginBottom: 2 }}>regB</div>
              <div style={{ background: `${PRP}10`, border: `1px solid ${PRP}30`, borderRadius: 4, padding: '2px 6px', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: PRP, textAlign: 'center' }}>{current.regB}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Nota do passo */}
      <div style={{
        padding: '10px 14px', borderRadius: 8, marginBottom: 16,
        background: current.danger ? `${RED}10` : `${GRN}10`,
        border: `1px solid ${current.danger ? RED : GRN}40`,
        fontSize: 12, color: FG, lineHeight: 1.7,
      }}>
        <span style={{ fontWeight: 700, color: current.danger ? RED : GRN }}>
          Passo {step + 1}/{steps.length}: </span>
        {current.note}
      </div>

      {/* Navegação */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 6,
            color: FGMUTE, fontSize: 11, padding: '6px 16px',
            cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: step === 0 ? 0.4 : 1,
          }}
        >
          ← Anterior
        </button>
        <button
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
          style={{
            background: step < steps.length - 1 ? `${C}20` : CARD,
            border: `1.5px solid ${step < steps.length - 1 ? C : LINE}`,
            borderRadius: 6, color: step < steps.length - 1 ? C : FGMUTE,
            fontSize: 11, padding: '6px 16px',
            cursor: step >= steps.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            opacity: step >= steps.length - 1 ? 0.4 : 1,
          }}
        >
          Próximo →
        </button>
        <button
          onClick={() => setStep(0)}
          style={{
            background: 'transparent', border: `1.5px solid ${LINE}`,
            borderRadius: 6, color: FGMUTE, fontSize: 11, padding: '6px 14px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Resetar
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Thread States (State Machine)
// ═══════════════════════════════════════════════════════════════════════════════

const THREAD_STATES: SMState[] = [
  { id: 'new', label: 'NEW', description: 'Thread criada mas ainda não iniciada. Apenas estrutura alocada — não está no scheduler ainda.', color: FGMUTE, isInitial: true },
  { id: 'runnable', label: 'RUNNABLE', description: 'Thread pronta para executar. Está na run queue do OS aguardando uma CPU ficar disponível.', color: C },
  { id: 'running', label: 'RUNNING', description: 'Thread está atualmente executando em um core de CPU. Apenas uma por core por vez.', color: GRN },
  { id: 'blocked', label: 'BLOCKED', description: 'Thread aguarda recurso (mutex, I/O, sleep). Não consome CPU. Volta para RUNNABLE quando recurso disponível.', color: AMB },
  { id: 'terminated', label: 'TERMINATED', description: 'Thread completou execução ou foi interrompida. Recursos sendo liberados.', color: RED, isFinal: true },
]

const THREAD_TRANSITIONS: SMTransition[] = [
  { from: 'new', to: 'runnable', event: 'thread.start()', guard: 'Thread inicializada' },
  { from: 'runnable', to: 'running', event: 'scheduler seleciona', guard: 'CPU disponível' },
  { from: 'running', to: 'runnable', event: 'context switch / yield', guard: 'Time slice expirou ou yield()' },
  { from: 'running', to: 'blocked', event: 'mutex.lock() / I/O / sleep', guard: 'Recurso não disponível' },
  { from: 'blocked', to: 'runnable', event: 'mutex.unlock() / I/O pronto', guard: 'Recurso disponível' },
  { from: 'running', to: 'terminated', event: 'return / exception / kill', guard: 'Função concluída' },
  { from: 'runnable', to: 'terminated', event: 'thread.interrupt()', guard: 'Interrompida externamente' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Processo vs Thread — Comparação Multi-critério
// ═══════════════════════════════════════════════════════════════════════════════

const PROC_THREAD_OPTIONS: ComparisonOption[] = [
  { id: 'process', label: 'Processo', sublabel: 'fork() / spawn()', color: C },
  { id: 'thread', label: 'Thread', sublabel: 'pthread / worker', color: PRP },
]

const PROC_THREAD_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'isolation',
    label: 'Isolamento de memória',
    category: 'Segurança',
    description: 'Crash de um afeta os outros?',
    values: {
      process: { rating: 'excellent', note: 'Memória completamente isolada — crash não propaga' },
      thread: { rating: 'poor', note: 'Compartilha memória — bug pode derrubar o processo inteiro' },
    },
  },
  {
    id: 'creation',
    label: 'Custo de criação',
    category: 'Performance',
    values: {
      process: { rating: 'fair', note: 'fork() cria cópia do espaço de endereçamento (~ms)' },
      thread: { rating: 'excellent', note: 'Apenas nova stack + TCB (~µs)' },
    },
  },
  {
    id: 'communication',
    label: 'Comunicação',
    category: 'IPC',
    values: {
      process: { rating: 'fair', note: 'IPC explícito: pipe, socket, shared memory, mqueue' },
      thread: { rating: 'excellent', note: 'Acesso direto à memória compartilhada — zero overhead' },
    },
  },
  {
    id: 'context-switch',
    label: 'Context switch',
    category: 'Performance',
    values: {
      process: { rating: 'poor', note: 'Mais caro: troca TLB completa, recarrega page tables' },
      thread: { rating: 'good', note: 'Mais barato: mesmo espaço de endereçamento, TLB parcialmente válido' },
    },
  },
  {
    id: 'sync',
    label: 'Sincronização necessária',
    category: 'Complexidade',
    values: {
      process: { rating: 'excellent', note: 'Não precisa de mutex para dados locais — isolamento garante' },
      thread: { rating: 'poor', note: 'Mutex/semáforo obrigatório para qualquer dado compartilhado' },
    },
  },
  {
    id: 'use-case',
    label: 'Casos de uso principais',
    category: 'Uso',
    values: {
      process: { rating: 'na', note: 'HTTP servers (gunicorn, cluster), sandboxing, microservices, linguagens com GIL' },
      thread: { rating: 'na', note: 'CPU-bound paralelo (Java, C++, Go), worker pool, cache compartilhado' },
    },
  },
  {
    id: 'gil',
    label: 'Python/Ruby GIL',
    category: 'Linguagens',
    values: {
      process: { rating: 'excellent', note: 'Cada processo tem seu próprio GIL — paralelismo real em CPU' },
      thread: { rating: 'poor', note: 'GIL impede paralelismo CPU — threads só ganham em I/O' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Deadlock — Grafo de Espera Interativo
// ═══════════════════════════════════════════════════════════════════════════════

type DeadlockStep = {
  aHolds: string[]
  aWaits: string | null
  bHolds: string[]
  bWaits: string | null
  note: string
  deadlock: boolean
}

const DEADLOCK_STEPS: DeadlockStep[] = [
  { aHolds: [], aWaits: null, bHolds: [], bWaits: null, note: 'Estado inicial: mutex1 e mutex2 disponíveis. Thread A e B prontas.', deadlock: false },
  { aHolds: ['mutex1'], aWaits: null, bHolds: [], bWaits: null, note: 'Thread A adquire mutex1. mutex2 ainda disponível.', deadlock: false },
  { aHolds: ['mutex1'], aWaits: null, bHolds: ['mutex2'], bWaits: null, note: 'Thread B adquire mutex2. mutex1 já com Thread A.', deadlock: false },
  { aHolds: ['mutex1'], aWaits: 'mutex2', bHolds: ['mutex2'], bWaits: null, note: 'Thread A tenta adquirir mutex2 — BLOQUEADA. mutex2 está com B.', deadlock: false },
  { aHolds: ['mutex1'], aWaits: 'mutex2', bHolds: ['mutex2'], bWaits: 'mutex1', note: 'Thread B tenta adquirir mutex1 — BLOQUEADA. mutex1 está com A. DEADLOCK! A→B→A (ciclo).', deadlock: true },
]

const PREVENTION_STEPS: DeadlockStep[] = [
  { aHolds: [], aWaits: null, bHolds: [], bWaits: null, note: 'Prevenção por lock ordering: sempre adquirir mutex1 ANTES de mutex2.', deadlock: false },
  { aHolds: ['mutex1'], aWaits: null, bHolds: [], bWaits: null, note: 'Thread A adquire mutex1 (primeira na ordem).', deadlock: false },
  { aHolds: ['mutex1'], aWaits: null, bHolds: [], bWaits: 'mutex1', note: 'Thread B tenta mutex1 — BLOQUEADA (respeitando a ordem: mutex1 primeiro).', deadlock: false },
  { aHolds: ['mutex1', 'mutex2'], aWaits: null, bHolds: [], bWaits: 'mutex1', note: 'Thread A adquire mutex2 (segunda na ordem). B ainda aguarda mutex1.', deadlock: false },
  { aHolds: [], aWaits: null, bHolds: ['mutex1', 'mutex2'], bWaits: null, note: 'Thread A termina e libera tudo. Thread B adquire mutex1 e mutex2 na ordem. Sem deadlock!', deadlock: false },
]

function DeadlockVisual() {
  const [mode, setMode] = useState<'deadlock' | 'prevention'>('deadlock')
  const [step, setStep] = useState(0)

  const steps = mode === 'deadlock' ? DEADLOCK_STEPS : PREVENTION_STEPS
  const current = steps[step]

  function changeMode(m: 'deadlock' | 'prevention') {
    setMode(m)
    setStep(0)
  }

  function LockBadge({ name, holder, color }: { name: string; holder: string | null; color: string }) {
    return (
      <div style={{
        background: holder ? `${color}20` : CARD,
        border: `2px solid ${holder ? color : LINE}`,
        borderRadius: 10, padding: '8px 14px', textAlign: 'center', flex: 1,
        transition: 'all 0.3s',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: holder ? color : FGMUTE, marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 10, color: holder ? FG : '#475569' }}>
          {holder ? `Seguro por ${holder}` : 'Disponível'}
        </div>
      </div>
    )
  }

  const mutex1Holder = current.aHolds.includes('mutex1') ? 'Thread A' : current.bHolds.includes('mutex1') ? 'Thread B' : null
  const mutex2Holder = current.aHolds.includes('mutex2') ? 'Thread A' : current.bHolds.includes('mutex2') ? 'Thread B' : null

  function ThreadStatus({ label, holds, waits, color }: { label: string; holds: string[]; waits: string | null; color: string }) {
    return (
      <div style={{
        background: CARD,
        border: `1.5px solid ${current.deadlock ? RED : color}`,
        borderRadius: 10, padding: 12, flex: 1,
        transition: 'all 0.3s',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 4 }}>
          Segura: <span style={{ color: holds.length ? GRN : FGMUTE }}>{holds.length ? holds.join(', ') : '—'}</span>
        </div>
        <div style={{ fontSize: 10, color: FGMUTE }}>
          Aguarda: <span style={{ color: waits ? RED : FGMUTE }}>{waits ?? '—'}</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Deadlock — Grafo de Espera</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Veja como o ciclo de espera se forma e como lock ordering previne</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => changeMode('deadlock')}
          style={{
            background: mode === 'deadlock' ? `${RED}15` : CARD,
            border: `1.5px solid ${mode === 'deadlock' ? RED : LINE}`,
            borderRadius: 8, color: mode === 'deadlock' ? RED : FGMUTE,
            fontSize: 11, padding: '6px 16px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Deadlock (lock ordering errado)
        </button>
        <button
          onClick={() => changeMode('prevention')}
          style={{
            background: mode === 'prevention' ? `${GRN}15` : CARD,
            border: `1.5px solid ${mode === 'prevention' ? GRN : LINE}`,
            borderRadius: 8, color: mode === 'prevention' ? GRN : FGMUTE,
            fontSize: 11, padding: '6px 16px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Prevenção (lock ordering correto)
        </button>
      </div>

      {/* Locks */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Recursos (mutexes)</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <LockBadge name="mutex1" holder={mutex1Holder} color={C} />
          <LockBadge name="mutex2" holder={mutex2Holder} color={PRP} />
        </div>
      </div>

      {/* Threads */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <ThreadStatus label="Thread A" holds={current.aHolds} waits={current.aWaits} color={C} />
        <ThreadStatus label="Thread B" holds={current.bHolds} waits={current.bWaits} color={PRP} />
      </div>

      {/* Nota */}
      <div style={{
        padding: '10px 14px', borderRadius: 8, marginBottom: 14,
        background: current.deadlock ? `${RED}10` : step === steps.length - 1 && !current.deadlock ? `${GRN}10` : CARD,
        border: `1px solid ${current.deadlock ? RED : step === steps.length - 1 && !current.deadlock ? GRN : LINE}40`,
        fontSize: 12, color: FG, lineHeight: 1.7,
      }}>
        {current.deadlock && <span style={{ fontWeight: 700, color: RED }}>DEADLOCK! </span>}
        {current.note}
      </div>

      {/* Navegação */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 6, color: FGMUTE, fontSize: 11, padding: '6px 16px', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: step === 0 ? 0.4 : 1 }}>
          ← Anterior
        </button>
        <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1}
          style={{ background: step < steps.length - 1 ? `${C}20` : CARD, border: `1.5px solid ${step < steps.length - 1 ? C : LINE}`, borderRadius: 6, color: step < steps.length - 1 ? C : FGMUTE, fontSize: 11, padding: '6px 16px', cursor: step >= steps.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: step >= steps.length - 1 ? 0.4 : 1 }}>
          Próximo →
        </button>
        <button onClick={() => setStep(0)}
          style={{ background: 'transparent', border: `1.5px solid ${LINE}`, borderRadius: 6, color: FGMUTE, fontSize: 11, padding: '6px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
          Resetar
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function ProcessosThreadsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'memory-layout',
      title: 'Layout de Memória',
      subtitle: 'O que processo e thread compartilham — e o que é privado',
      accent: C,
      component: <ProcessVsThreadVisual />,
    },
    {
      id: 'race-condition',
      title: 'Race Condition',
      subtitle: 'Por que counter++ em duas threads perde incrementos',
      accent: C,
      component: <RaceConditionVisual />,
    },
    {
      id: 'thread-states',
      title: 'Estados de Thread',
      subtitle: 'NEW → RUNNABLE → RUNNING → BLOCKED → TERMINATED',
      accent: C,
      component: (
        <StateMachineExplorer
          states={THREAD_STATES}
          transitions={THREAD_TRANSITIONS}
          initialState="new"
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Máquina de Estados de Thread"
          description="Ciclo de vida completo: do momento de criação até a terminação"
        />
      ),
    },
    {
      id: 'process-vs-thread',
      title: 'Processo vs Thread',
      subtitle: 'Comparação multi-critério: isolamento, performance, uso',
      accent: C,
      component: (
        <ComparisonTable
          options={PROC_THREAD_OPTIONS}
          criteria={PROC_THREAD_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Processo vs Thread"
          description="Quando usar cada abordagem — trade-offs em 7 dimensões"
          highlightBest
        />
      ),
    },
    {
      id: 'deadlock',
      title: 'Deadlock',
      subtitle: 'Grafo de espera — como o ciclo se forma e como prevenir',
      accent: C,
      component: <DeadlockVisual />,
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
