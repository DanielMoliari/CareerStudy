'use client'
import { useState, useEffect, useRef } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { HookTimeline } from '@/components/visuals/HookTimeline'
import type { TimelinePhase } from '@/components/visuals/HookTimeline'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'

// ── Paleta Event Loop ─────────────────────────────────────────────────────────
const C      = '#f59e0b'   // âmbar — representa async/tempo
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const BLUE   = '#3b82f6'

void LINE; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Event Loop Animado (componente custom)
// ═══════════════════════════════════════════════════════════════════════════════

type ELStep = {
  status: string
  stack: string[]
  webapi: string[]
  micro: string[]
  macro: string[]
  output: string[]
}

const EL_STEPS: ELStep[] = [
  { status: 'SYNC — console.log(1) vai para a call stack e executa imediatamente', stack: ['main()', 'console.log(1)', '', ''], webapi: ['', ''], micro: ['', ''], macro: ['', ''], output: ['1'] },
  { status: 'WEBAPI — setTimeout(fn, 0) entrega o callback para o Timer da Web API', stack: ['main()', 'setTimeout(fn,0)', '', ''], webapi: ['⏱ timer 0ms: log2', ''], micro: ['', ''], macro: ['', ''], output: ['1'] },
  { status: 'MICRO — Promise.resolve().then(log3) enfileira log3 na microtask queue', stack: ['main()', 'Promise.resolve().then()', '', ''], webapi: ['⏱ timer 0ms: log2', ''], micro: ['log3 (Promise.then)', ''], macro: ['', ''], output: ['1'] },
  { status: 'SYNC — console.log(4) executa. Call stack ainda ativa', stack: ['main()', 'console.log(4)', '', ''], webapi: ['⏱ timer 0ms: log2', ''], micro: ['log3 (Promise.then)', ''], macro: ['', ''], output: ['1', '4'] },
  { status: 'TIMER — Timer de 0ms expirou → callback log2 move para a macrotask queue', stack: ['main()', '', '', ''], webapi: ['', ''], micro: ['log3 (Promise.then)', ''], macro: ['log2 (setTimeout)', ''], output: ['1', '4'] },
  { status: 'MICRO — Call stack vazia → event loop drena TODA a microtask queue. log3 executa', stack: ['log3()', '', '', ''], webapi: ['', ''], micro: ['', ''], macro: ['log2 (setTimeout)', ''], output: ['1', '4', '3'] },
  { status: 'MACRO — Microtasks vazias → event loop executa UMA macrotask: log2', stack: ['log2()', '', '', ''], webapi: ['', ''], micro: ['', ''], macro: ['', ''], output: ['1', '4', '3', '2'] },
  { status: '✅ Completo! Regra: SYNC → MICRO (todas) → MACRO (uma por vez). Saída: 1, 4, 3, 2', stack: ['', '', '', ''], webapi: ['', ''], micro: ['', ''], macro: ['', ''], output: ['1', '4', '3', '2'] },
]

function EventLoopAnimated() {
  const [step, setStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const current = step >= 0 ? EL_STEPS[step] : null

  function startAnimation() {
    if (running) return
    setRunning(true)
    setStep(0)
  }

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setRunning(false)
    setStep(-1)
  }

  useEffect(() => {
    if (!running || step < 0) return
    if (step >= EL_STEPS.length - 1) {
      setRunning(false)
      return
    }
    timerRef.current = setTimeout(() => setStep(s => s + 1), 1100)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [running, step])

  function Box({ label, color, items, emptyLabel }: { label: string; color: string; items: string[]; emptyLabel: string }) {
    return (
      <div style={{ background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 10, padding: 12, flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color, marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${LINE}` }}>
          {label}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((item, i) => (
            <div key={i} style={{
              background: item ? `${color}12` : BG,
              border: `1px solid ${item ? color : LINE}`,
              borderRadius: 6, padding: '6px 10px',
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              color: item ? FG : '#1e293b',
              minHeight: 28,
              transition: 'all 0.3s',
            }}>
              {item || ' '}
            </div>
          ))}
        </div>
        {items.every(i => !i) && (
          <div style={{ fontSize: 9, color: '#334155', textAlign: 'center', marginTop: 4 }}>{emptyLabel}</div>
        )}
      </div>
    )
  }

  const code = `console.log(1)
setTimeout(() => console.log(2), 0)
Promise.resolve().then(() => console.log(3))
console.log(4)`

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Event Loop — visualização animada</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Observe como cada fila é processada em ordem de prioridade</div>
      </div>

      {/* Código */}
      <div style={{ background: CARD, borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.8, color: FGMUTE }}>
        {code.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <button
          onClick={startAnimation}
          disabled={running}
          style={{
            background: running ? LINE : `${C}20`, border: `1.5px solid ${running ? LINE : C}`,
            borderRadius: 6, color: running ? FGMUTE : C, fontSize: 11, padding: '6px 16px',
            cursor: running ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          {step < 0 ? '▶ Executar' : step >= EL_STEPS.length - 1 ? '✅ Concluído' : '⏳ Executando...'}
        </button>
        <button
          onClick={reset}
          style={{
            background: 'transparent', border: `1.5px solid ${LINE}`,
            borderRadius: 6, color: FGMUTE, fontSize: 11, padding: '6px 16px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          ↺ Resetar
        </button>
        {current && (
          <div style={{
            flex: 1, background: CARD, border: `1px solid ${LINE}`, borderRadius: 6,
            padding: '6px 12px', fontSize: 10, color: FG, lineHeight: 1.5,
          }}>
            {current.status}
          </div>
        )}
      </div>

      {/* Diagrama */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
        <Box label="Call Stack" color={GRN} items={current?.stack ?? ['', '', '', '']} emptyLabel="vazia" />
        <Box label="Web APIs" color={PRP} items={current?.webapi ?? ['', '']} emptyLabel="inativa" />
        <Box label="Microtask Queue" color={BLUE} items={current?.micro ?? ['', '']} emptyLabel="vazia" />
        <Box label="Macrotask Queue" color={C} items={current?.macro ?? ['', '']} emptyLabel="vazia" />
      </div>

      {/* Output */}
      <div style={{ background: CARD, borderRadius: 8, padding: '10px 14px' }}>
        <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Output</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', minHeight: 28 }}>
          {(current?.output ?? []).map((v, i) => (
            <span key={i} style={{
              background: `${GRN}20`, border: `1px solid ${GRN}`, borderRadius: 4,
              padding: '2px 10px', fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
              color: GRN, fontWeight: 700,
            }}>
              {v}
            </span>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12, fontSize: 10, color: FGMUTE }}>
        <span><span style={{ color: GRN, fontWeight: 700 }}>■</span> Call Stack (síncrono)</span>
        <span><span style={{ color: PRP, fontWeight: 700 }}>■</span> Web APIs / Timer</span>
        <span><span style={{ color: BLUE, fontWeight: 700 }}>■</span> Microtasks (Promise.then)</span>
        <span><span style={{ color: C, fontWeight: 700 }}>■</span> Macrotasks (setTimeout)</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Call Stack Visualização (componente custom)
// ═══════════════════════════════════════════════════════════════════════════════

type StackFrame = {
  name: string
  detail: string
  color: string
}

type CallStackScenario = {
  id: string
  label: string
  description: string
  frames: StackFrame[][]
  code: string
}

const CALL_STACK_SCENARIOS: CallStackScenario[] = [
  {
    id: 'sync',
    label: 'Chamadas síncronas',
    description: 'A call stack funciona como uma pilha LIFO — Last In, First Out. Cada chamada de função empilha um frame.',
    code: `function c() { return 1 + 1 }
function b() { return c() }
function a() { return b() }
a()  // empilha: main → a → b → c`,
    frames: [
      [{ name: 'main()', detail: 'contexto global', color: FGMUTE }],
      [{ name: 'a()', detail: 'chamado na linha 4', color: C }, { name: 'main()', detail: 'contexto global', color: FGMUTE }],
      [{ name: 'b()', detail: 'chamado por a()', color: C }, { name: 'a()', detail: 'chamado na linha 4', color: C }, { name: 'main()', detail: 'contexto global', color: FGMUTE }],
      [{ name: 'c()', detail: 'chamado por b()', color: GRN }, { name: 'b()', detail: 'chamado por a()', color: C }, { name: 'a()', detail: 'chamado na linha 4', color: C }, { name: 'main()', detail: 'contexto global', color: FGMUTE }],
      [{ name: 'b()', detail: 'c() retornou 2', color: C }, { name: 'a()', detail: 'chamado na linha 4', color: C }, { name: 'main()', detail: 'contexto global', color: FGMUTE }],
      [{ name: 'a()', detail: 'b() retornou 2', color: C }, { name: 'main()', detail: 'contexto global', color: FGMUTE }],
      [{ name: 'main()', detail: 'a() retornou 2', color: FGMUTE }],
    ],
  },
  {
    id: 'stackoverflow',
    label: 'Stack Overflow',
    description: 'Recursão infinita — a call stack tem tamanho limitado (~10.000 frames). Cada chamada adiciona um frame sem jamais retornar.',
    code: `function infinite() {
  // sem caso base!
  return infinite()
}
infinite() // RangeError: Maximum call stack size exceeded`,
    frames: [
      [{ name: 'infinite()', detail: 'chamada 1', color: RED }, { name: 'main()', detail: 'global', color: FGMUTE }],
      [{ name: 'infinite()', detail: 'chamada 2', color: RED }, { name: 'infinite()', detail: 'chamada 1', color: RED }, { name: 'main()', detail: 'global', color: FGMUTE }],
      [{ name: 'infinite()', detail: 'chamada 3', color: RED }, { name: 'infinite()', detail: 'chamada 2', color: RED }, { name: 'infinite()', detail: 'chamada 1', color: RED }, { name: 'main()', detail: 'global', color: FGMUTE }],
      [{ name: '... (N calls)', detail: 'stack crescendo...', color: RED }, { name: 'infinite()', detail: 'chamada N-1', color: RED }, { name: 'infinite()', detail: 'chamada N-2', color: RED }, { name: 'main()', detail: 'global', color: FGMUTE }],
    ],
  },
  {
    id: 'async',
    label: 'async/await desmistificado',
    description: 'await não bloqueia o thread. Ele suspende a função, devolve o controle ao event loop, e agenda o restante como microtask quando a Promise resolve.',
    code: `async function fetchData() {
  console.log('antes')
  const data = await fetch('/api')  // suspende aqui
  console.log('depois') // microtask quando resolve
}
fetchData()
console.log('sincrono') // executa antes de 'depois'`,
    frames: [
      [{ name: 'fetchData()', detail: 'executando sincronamente', color: C }, { name: 'main()', detail: 'global', color: FGMUTE }],
      [{ name: 'fetchData()', detail: "await hit — suspende. Output: 'antes'", color: C }, { name: 'main()', detail: 'global', color: FGMUTE }],
      [{ name: 'main()', detail: 'fetchData() suspenso → controle retorna', color: FGMUTE }],
      [{ name: 'console.log("sincrono")', detail: "Output: 'sincrono' (antes de 'depois'!)", color: GRN }, { name: 'main()', detail: 'global', color: FGMUTE }],
      [{ name: 'fetchData() (retomada)', detail: "fetch() resolveu → microtask. Output: 'depois'", color: C }],
    ],
  },
]

function CallStackVisual() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [frameStep, setFrameStep] = useState(0)
  const scenario = CALL_STACK_SCENARIOS[scenarioIdx]
  const currentFrames = scenario.frames[Math.min(frameStep, scenario.frames.length - 1)]

  function prevStep() { setFrameStep(f => Math.max(0, f - 1)) }
  function nextStep() { setFrameStep(f => Math.min(scenario.frames.length - 1, f + 1)) }
  function changeScenario(idx: number) { setScenarioIdx(idx); setFrameStep(0) }

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Seletor de cenário */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {CALL_STACK_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => changeScenario(i)}
            style={{
              background: i === scenarioIdx ? `${C}20` : CARD,
              border: `1.5px solid ${i === scenarioIdx ? C : LINE}`,
              borderRadius: 6, color: i === scenarioIdx ? C : FGMUTE,
              fontSize: 11, padding: '5px 12px', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: FGMUTE, marginBottom: 12 }}>{scenario.description}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Código */}
        <div>
          <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Código</div>
          <pre style={{
            background: CARD, border: `1px solid ${LINE}`, borderRadius: 8,
            padding: '12px 14px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            color: FGMUTE, lineHeight: 1.7, margin: 0, overflowX: 'auto',
          }}>
            {scenario.code}
          </pre>
        </div>

        {/* Call Stack */}
        <div>
          <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Call Stack — passo {frameStep + 1} / {scenario.frames.length}
          </div>
          <div style={{
            background: CARD, border: `1px solid ${LINE}`, borderRadius: 8,
            padding: 12, minHeight: 160,
            display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-start', gap: 4,
          }}>
            {currentFrames.length === 0 ? (
              <div style={{ fontSize: 10, color: LINE, textAlign: 'center', alignSelf: 'center', marginTop: 'auto' }}>
                ⬜ stack vazia
              </div>
            ) : (
              [...currentFrames].reverse().map((frame, i) => (
                <div
                  key={i}
                  style={{
                    background: `${frame.color}15`,
                    border: `1.5px solid ${frame.color}`,
                    borderRadius: 6, padding: '6px 12px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: frame.color, fontWeight: 700 }}>
                    {frame.name}
                  </span>
                  <span style={{ fontSize: 9, color: FGMUTE }}>{frame.detail}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Navegação */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={prevStep}
          disabled={frameStep === 0}
          style={{
            background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 6,
            color: FGMUTE, fontSize: 11, padding: '6px 16px',
            cursor: frameStep === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: frameStep === 0 ? 0.4 : 1,
          }}
        >
          ← Anterior
        </button>
        <button
          onClick={nextStep}
          disabled={frameStep >= scenario.frames.length - 1}
          style={{
            background: frameStep < scenario.frames.length - 1 ? `${C}20` : CARD,
            border: `1.5px solid ${frameStep < scenario.frames.length - 1 ? C : LINE}`,
            borderRadius: 6, color: frameStep < scenario.frames.length - 1 ? C : FGMUTE,
            fontSize: 11, padding: '6px 16px',
            cursor: frameStep >= scenario.frames.length - 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: frameStep >= scenario.frames.length - 1 ? 0.4 : 1,
          }}
        >
          Próximo →
        </button>
        <span style={{ fontSize: 10, color: FGMUTE, alignSelf: 'center' }}>
          Topo da pilha = primeiro a executar (LIFO)
        </span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Macrotasks vs Microtasks (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const TASK_OPTIONS: ComparisonOption[] = [
  { id: 'micro', label: 'Microtasks', sublabel: 'Alta prioridade', color: BLUE },
  { id: 'macro', label: 'Macrotasks', sublabel: 'Baixa prioridade', color: C },
]

const TASK_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'priority',
    label: 'Prioridade de execução',
    category: 'Fundamento',
    values: {
      micro: { rating: 'excellent', note: 'Drena completamente antes de qualquer macrotask' },
      macro: { rating: 'fair',      note: 'Executa uma por vez, depois do drain de microtasks' },
    },
  },
  {
    id: 'when',
    label: 'Quando executa',
    category: 'Timing',
    values: {
      micro: { rating: 'excellent', note: 'Após cada task — antes do próximo paint/macrotask' },
      macro: { rating: 'good',      note: 'Na próxima iteração do event loop' },
    },
  },
  {
    id: 'apis',
    label: 'APIs que geram',
    category: 'APIs',
    values: {
      micro: { rating: 'na', note: 'Promise.then/catch/finally, queueMicrotask, MutationObserver, process.nextTick*' },
      macro: { rating: 'na', note: 'setTimeout, setInterval, setImmediate (Node), I/O callbacks, requestAnimationFrame' },
    },
  },
  {
    id: 'blocking',
    label: 'Pode bloquear o thread?',
    category: 'Riscos',
    values: {
      micro: { rating: 'poor',      note: 'Sim! Microtask que gera microtask (loop) bloqueia indefinidamente' },
      macro: { rating: 'fair',      note: 'Bloqueia por 1 iteração — próximas macrotasks aguardam' },
    },
  },
  {
    id: 'use-case',
    label: 'Casos de uso',
    category: 'Quando usar',
    values: {
      micro: { rating: 'na', note: 'Código pós-operação assíncrona, Promise chaining, notificação de mudança de estado' },
      macro: { rating: 'na', note: 'Delays, polling, animações (rAF), quebrar processamento longo em chunks' },
    },
  },
  {
    id: 'node-extra',
    label: 'Node.js específico',
    category: 'Node.js',
    values: {
      micro: { rating: 'na', note: 'process.nextTick é mais prioritário que Promise.then — executa antes das demais microtasks' },
      macro: { rating: 'na', note: 'setImmediate → executa após I/O. setTimeout(0) → pode vir antes ou depois dependendo do contexto' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — async/await execution order (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const ASYNC_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'async-await-basic',
    label: 'async/await básico',
    code: `async function fetchUser() {
  console.log('1: antes do await')
  const user = await getUser()  // suspende aqui
  console.log('3: depois do await')
  return user
}

fetchUser()
console.log('2: após chamar fetchUser()')
// Output: 1, 2, 3`,
    steps: [
      { lineStart: 1, lineEnd: 2, title: 'Função async começa', explanation: 'fetchUser() é chamada. Executa sincronamente até o primeiro await. "1: antes do await" é impresso.', callStack: ['fetchUser()'], output: '1: antes do await' },
      { lineStart: 3, lineEnd: 3, title: 'await suspende a função', explanation: 'await getUser() suspende fetchUser() e DEVOLVE o controle ao chamador. getUser() começa a executar de forma assíncrona (Web API / Promise).', callStack: ['fetchUser() [SUSPENSO]'], memory: { user: 'Promise<pending>' } },
      { lineStart: 8, lineEnd: 8, title: 'Código após fetchUser() executa', explanation: 'O event loop continua. console.log("2") executa IMEDIATAMENTE após fetchUser() ser suspensa — antes de getUser() resolver.', callStack: ['main()'], output: '1, 2' },
      { lineStart: 4, lineEnd: 4, title: 'Promise resolveu → microtask', explanation: 'getUser() resolveu. O restante de fetchUser() é enfileirado como microtask. Quando a call stack estiver vazia, microtask executa.', callStack: ['fetchUser() (retomada)'], memory: { user: '{ id: 1, name: "Ana" }' }, output: '1, 2, 3' },
    ],
  },
  {
    id: 'promise-all',
    label: 'Promise.all vs sequencial',
    code: `// Sequencial (lento: 1s + 1s = 2s total)
const a = await fetchA()  // espera 1s
const b = await fetchB()  // espera mais 1s

// Paralelo com Promise.all (rápido: max(1s,1s) = 1s)
const [a, b] = await Promise.all([
  fetchA(),  // começa imediatamente
  fetchB(),  // começa imediatamente (paralelo!)
])`,
    steps: [
      { lineStart: 1, lineEnd: 3, title: 'Sequencial — awaits em série', explanation: 'Cada await espera o anterior resolver. Total: 1s + 1s = 2s. fetchB() nem começa enquanto fetchA() não termina.', callStack: ['fetchA() aguardando...'], memory: { 'tempo total': '~2 segundos' } },
      { lineStart: 5, lineEnd: 9, title: 'Promise.all — paralelo', explanation: 'Promise.all recebe um array de Promises JÁ INICIADAS. fetchA() e fetchB() começam ao mesmo tempo. Await é liberado quando TODAS resolvem.', callStack: ['Promise.all [fetchA, fetchB]'], memory: { 'fetchA': 'running', 'fetchB': 'running', 'tempo total': '~1 segundo' } },
      { lineStart: 9, lineEnd: 9, title: 'Ambas resolveram', explanation: 'Promise.all resolve quando a última Promise do array resolve. O resultado é um array com os valores na mesma ordem que as Promises foram passadas.', callStack: ['retomando após Promise.all'], memory: { a: '{ data: "A" }', b: '{ data: "B" }' }, output: 'Em 1s em vez de 2s' },
    ],
  },
  {
    id: 'promise-chain',
    label: 'Promise chaining vs async/await',
    code: `// Com Promise chaining
fetch('/api/user')
  .then(r => r.json())
  .then(user => fetch(\`/api/posts/\${user.id}\`))
  .then(r => r.json())
  .then(posts => console.log(posts))

// Equivalente com async/await (mais legível)
async function loadPosts() {
  const userRes = await fetch('/api/user')
  const user = await userRes.json()
  const postsRes = await fetch(\`/api/posts/\${user.id}\`)
  const posts = await postsRes.json()
  console.log(posts)
}`,
    steps: [
      { lineStart: 1, lineEnd: 6, title: 'Promise chaining', explanation: 'Cada .then() registra um callback que executa como microtask quando a Promise anterior resolve. É waterfall sequencial — cada step aguarda o anterior.', callStack: ['fetch()', 'Promise chain registrado'] },
      { lineStart: 8, lineEnd: 15, title: 'async/await — equivalente', explanation: 'async/await é açúcar sintático sobre Promises. Cada await é um .then() implícito. O comportamento é idêntico — apenas a sintaxe é diferente.', callStack: ['loadPosts()'] },
      { lineStart: 9, lineEnd: 9, title: 'Execução — await 1', explanation: 'fetch("/api/user") começa. loadPosts() é suspensa. Quando resolve, retoma com a Response.', callStack: ['loadPosts() [suspenso]'], memory: { userRes: 'Promise<pending>' } },
      { lineStart: 11, lineEnd: 11, title: 'Execução — await 2', explanation: 'user.id está disponível. Inicia o segundo fetch — seria impossível sem o user do primeiro. Isso é um fetch sequencial dependente — intencionalmente não paralelo.', callStack: ['loadPosts() [suspenso]'], memory: { user: '{ id: 42 }', postsRes: 'Promise<pending>' } },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Blocking vs Non-blocking (componente custom)
// ═══════════════════════════════════════════════════════════════════════════════

type BlockingScenario = {
  id: string
  label: string
  isBlocking: boolean
  code: string
  description: string
  impact: string
  fix?: string
}

const BLOCKING_SCENARIOS: BlockingScenario[] = [
  {
    id: 'sync-loop',
    label: 'Loop síncrono pesado',
    isBlocking: true,
    code: `// ❌ BLOCKING — trava o thread por N ms
function heavyCompute() {
  let sum = 0
  for (let i = 0; i < 1_000_000_000; i++) {
    sum += i
  }
  return sum
}

heavyCompute() // UI congela durante execução`,
    description: 'Um loop de bilhões de iterações bloqueia a call stack. Enquanto este código executa, nenhuma microtask, macrotask ou evento de UI pode ser processado.',
    impact: 'Interface congela. Cliques não respondem. Animações param. Em Node.js, novas requests ficam em fila.',
    fix: 'Dividir em chunks com setTimeout(nextChunk, 0) ou usar Web Workers para código off-thread.',
  },
  {
    id: 'setimmediate',
    label: 'Chunks com setTimeout(0)',
    isBlocking: false,
    code: `// ✓ NON-BLOCKING — processa em chunks
function heavyComputeAsync(total, done) {
  const CHUNK = 100_000
  let sum = 0, i = 0

  function nextChunk() {
    const end = Math.min(i + CHUNK, total)
    for (; i < end; i++) sum += i
    if (i < total)
      setTimeout(nextChunk, 0) // libera o thread
    else
      done(sum)
  }
  setTimeout(nextChunk, 0)
}`,
    description: 'setTimeout(0) não é "delay zero" — é "execute quando a call stack estiver vazia". Cada chunk processa e libera o thread, permitindo que UI e outros eventos sejam processados entre chunks.',
    impact: 'Interface responsiva. Outros eventos são processados entre chunks. Trade-off: operação total demora mais.',
  },
  {
    id: 'sync-io',
    label: 'I/O síncrono (Node.js)',
    isBlocking: true,
    code: `// ❌ BLOCKING em Node.js
const fs = require('fs')
const data = fs.readFileSync('large.txt', 'utf8')
// Nenhuma outra request é servida enquanto lê

// ✓ NON-BLOCKING
fs.readFile('large.txt', 'utf8', (err, data) => {
  // callback executado quando I/O completo
})
// outras requests são atendidas enquanto lê`,
    description: 'Em Node.js, I/O síncrono (readFileSync) bloqueia o único thread. Todas as outras requests ficam em fila esperando. I/O assíncrono delega para o sistema operacional e libera o thread imediatamente.',
    impact: 'readFileSync em um servidor web = DoS auto-infligido. 1 request lenta paralisa todas as outras.',
  },
  {
    id: 'long-promise',
    label: 'await não elimina blocking',
    isBlocking: true,
    code: `async function badExample() {
  // ❌ await em código CPU-bound NÃO ajuda
  const result = await new Promise(resolve => {
    let sum = 0
    for (let i = 0; i < 1e9; i++) sum += i // BLOCKING
    resolve(sum)
  })
  return result
}

// O Promise executor roda sincronamente!
// O loop ainda bloqueia o thread`,
    description: 'await/Promise não tornam código CPU-bound não-bloqueante. O executor da Promise roda sincronamente. await só libera o thread quando a Promise já está em estado pending aguardando I/O.',
    impact: 'Erro comum: envolver código síncrono pesado em Promise achando que torna async. Não torna.',
    fix: 'Para CPU-bound: Web Workers (browser) ou worker_threads (Node.js). Isola em thread separado.',
  },
]

function BlockingVisual() {
  const [selected, setSelected] = useState<string>('sync-loop')
  const scenario = BLOCKING_SCENARIOS.find(s => s.id === selected)!

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Blocking vs Non-blocking</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Entenda o que realmente bloqueia o event loop</div>
      </div>

      {/* Seletor */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {BLOCKING_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(s.id)}
            style={{
              background: selected === s.id ? `${s.isBlocking ? RED : GRN}20` : CARD,
              border: `1.5px solid ${selected === s.id ? (s.isBlocking ? RED : GRN) : LINE}`,
              borderRadius: 6,
              color: selected === s.id ? (s.isBlocking ? RED : GRN) : FGMUTE,
              fontSize: 11, padding: '5px 12px', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            {s.isBlocking ? '🔴' : '🟢'} {s.label}
          </button>
        ))}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <span style={{
          background: `${scenario.isBlocking ? RED : GRN}20`,
          border: `1px solid ${scenario.isBlocking ? RED : GRN}`,
          borderRadius: 6, padding: '3px 10px',
          fontSize: 11, fontWeight: 700,
          color: scenario.isBlocking ? RED : GRN,
        }}>
          {scenario.isBlocking ? '🔴 BLOCKING' : '🟢 NON-BLOCKING'}
        </span>
      </div>

      {/* Código */}
      <pre style={{
        background: CARD, border: `1px solid ${LINE}`, borderRadius: 8,
        padding: '12px 14px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        color: FGMUTE, lineHeight: 1.7, marginBottom: 12, overflowX: 'auto', whiteSpace: 'pre',
      }}>
        {scenario.code}
      </pre>

      {/* Explicação */}
      <div style={{ padding: '12px 16px', background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: FG, lineHeight: 1.7, marginBottom: 10 }}>{scenario.description}</div>
        <div style={{
          padding: '8px 12px', background: `${scenario.isBlocking ? RED : GRN}10`,
          border: `1px solid ${scenario.isBlocking ? RED : GRN}40`, borderRadius: 6,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: scenario.isBlocking ? RED : GRN }}>Impacto: </span>
          <span style={{ fontSize: 11, color: FGMUTE }}>{scenario.impact}</span>
        </div>
        {scenario.fix && (
          <div style={{ marginTop: 8, padding: '8px 12px', background: `${C}10`, border: `1px solid ${C}40`, borderRadius: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: C }}>Correção: </span>
            <span style={{ fontSize: 11, color: FGMUTE }}>{scenario.fix}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Common Gotchas (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const EL_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'setTimeout(0) não é "executar agora"',
    wrong: [
      [{ text: '// ❌ esperando que setTimeout(0) execute "imediatamente"', color: '#475569' }],
      [{ text: 'console.log(', color: FG }, { text: "'a'", color: '#fbbf24' }, { text: ')', color: FG }],
      [{ text: 'setTimeout(() => console.log(', color: RED }, { text: "'b'", color: '#fbbf24' }, { text: '), 0)', color: RED }],
      [{ text: 'Promise.resolve().then(() => console.log(', color: FG }, { text: "'c'", color: '#fbbf24' }, { text: '))', color: FG }],
      [{ text: '// ❌ Assumindo saída: a, b, c', color: '#475569' }],
    ],
    right: [
      [{ text: '// ✓ Saída real: a, c, b', color: GRN }],
      [{ text: '// Motivo: microtasks (Promise.then) têm', color: '#475569' }],
      [{ text: '// prioridade MAIOR que macrotasks (setTimeout)', color: '#475569' }],
      [{ text: '', color: FG }],
      [{ text: 'console.log(', color: FG }, { text: "'a'", color: '#fbbf24' }, { text: ')  // SYNC → executa agora', color: '#4ade80' }],
      [{ text: '// setTimeout(0) → macrotask queue', color: '#475569' }],
      [{ text: '// Promise.then → microtask queue', color: '#475569' }],
      [{ text: '// Após sync: micro (c) → macro (b)', color: '#4ade80' }],
    ],
    why: 'setTimeout(0) significa "coloque na macrotask queue". Mas Promises/microtasks são processadas ANTES de qualquer macrotask quando a call stack esvazia. A ordem é sempre: sync → microtasks → macrotask.',
  },
  {
    title: 'Microtask loop infinito bloqueia tudo',
    wrong: [
      [{ text: '// ❌ Microtask que gera microtask infinitamente', color: '#475569' }],
      [{ text: 'function badLoop() {', color: FG }],
      [{ text: '  return Promise.resolve().then(badLoop)', color: RED }],
      [{ text: '}', color: FG }],
      [{ text: 'badLoop() // Congela o thread — nunca executa macrotasks!', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Use macrotask para "defer sem bloquear"', color: GRN }],
      [{ text: 'function deferredLoop() {', color: FG }],
      [{ text: '  setTimeout(deferredLoop, 0)  // macrotask', color: GRN }],
      [{ text: '  // Libera o event loop entre iterações', color: '#475569' }],
      [{ text: '}', color: FG }],
      [{ text: 'deferredLoop() // Não bloqueia — event loop respira', color: GRN }],
    ],
    why: 'O event loop drena TODAS as microtasks antes de prosseguir. Uma microtask que gera outra microtask cria um loop infinito que nunca libera o thread. Use setTimeout para loops que precisam coexistir com o resto do event loop.',
  },
  {
    title: 'Promise.all vs await sequencial',
    wrong: [
      [{ text: '// ❌ Fetches sequenciais — desnecessariamente lento', color: '#475569' }],
      [{ text: 'async function loadDashboard() {', color: FG }],
      [{ text: '  const user = await getUser()      // 200ms', color: RED }],
      [{ text: '  const posts = await getPosts()    // + 300ms', color: RED }],
      [{ text: '  const stats = await getStats()    // + 150ms', color: RED }],
      [{ text: '  // Total: ~650ms', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// ✓ Fetches paralelos — Promise.all', color: GRN }],
      [{ text: 'async function loadDashboard() {', color: FG }],
      [{ text: '  const [user, posts, stats] = await Promise.all([', color: GRN }],
      [{ text: '    getUser(),   // começa agora', color: GRN }],
      [{ text: '    getPosts(),  // começa agora (paralelo)', color: GRN }],
      [{ text: '    getStats(),  // começa agora (paralelo)', color: GRN }],
      [{ text: '  ])  // Total: ~300ms (o mais lento)', color: GRN }],
      [{ text: '}', color: FG }],
    ],
    why: 'await sequencial espera cada Promise resolver antes de iniciar a próxima. Se as operações são independentes, use Promise.all — elas rodam em paralelo e o total é o tempo da mais lenta, não a soma.',
  },
  {
    title: 'Não lidar com reject em Promise.all',
    wrong: [
      [{ text: '// ❌ Se qualquer Promise rejeitar, toda Promise.all rejeita', color: '#475569' }],
      [{ text: 'const results = await Promise.all([', color: RED }],
      [{ text: '  fetchA(),', color: FG }],
      [{ text: '  fetchB(),  // se esta rejeitar...', color: RED }],
      [{ text: '  fetchC(),  // esta nunca é usada', color: RED }],
      [{ text: '])  // ❌ Unhandled Promise rejection', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Promise.allSettled — não rejeita, informa status', color: GRN }],
      [{ text: 'const results = await Promise.allSettled([', color: GRN }],
      [{ text: '  fetchA(), fetchB(), fetchC()', color: FG }],
      [{ text: '])', color: GRN }],
      [{ text: 'results.forEach(r => {', color: FG }],
      [{ text: "  if (r.status === 'fulfilled') use(r.value)", color: GRN }],
      [{ text: "  if (r.status === 'rejected') log(r.reason)", color: GRN }],
      [{ text: '})', color: FG }],
    ],
    why: 'Promise.all tem comportamento "fail fast" — se qualquer Promise rejeitar, toda a operação rejeita imediatamente. Use Promise.allSettled quando você quer processar todas as respostas mesmo que algumas falhem.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Node.js Event Loop Phases (HookTimeline)
// ═══════════════════════════════════════════════════════════════════════════════

const NODE_PHASES: TimelinePhase[] = [
  {
    id: 'timers',
    emoji: '⏱',
    name: 'Timers',
    color: C,
    short: 'Timers',
    detail: 'Executa callbacks de setTimeout() e setInterval() cujo delay expirou. Importante: o delay é mínimo, não exato — depende do SO e da carga do sistema.',
    code: [
      [{ text: 'setTimeout(() => {', color: FG }],
      [{ text: "  console.log('timers phase')", color: '#fbbf24' }],
      [{ text: '}, 0)', color: FG }],
      [{ text: '// Executa nesta fase após I/O callbacks', color: '#475569' }],
    ],
  },
  {
    id: 'pending',
    emoji: '📋',
    name: 'Pending Callbacks',
    color: FGMUTE,
    short: 'Pending',
    detail: 'Executa callbacks de I/O que foram adiados para a próxima iteração — como erros de TCP que precisam ser reportados (ex: ECONNREFUSED no Linux).',
    code: [
      [{ text: '// Callbacks de I/O com erro adiado', color: '#475569' }],
      [{ text: '// ex: erro de conexão TCP reportado', color: '#475569' }],
      [{ text: '// para a próxima iteração do loop', color: '#475569' }],
    ],
  },
  {
    id: 'idle',
    emoji: '💤',
    name: 'Idle / Prepare',
    color: FGMUTE,
    short: 'Idle',
    detail: 'Uso interno do Node.js. Não relevante para código de aplicação — não existem APIs públicas que se conectam a esta fase.',
    code: [
      [{ text: '// Uso interno do Node.js', color: '#475569' }],
      [{ text: '// Não exposto para código de aplicação', color: '#475569' }],
    ],
  },
  {
    id: 'poll',
    emoji: '🔍',
    name: 'Poll (I/O)',
    color: BLUE,
    short: 'Poll',
    detail: 'Fase mais importante. Busca novos eventos de I/O e executa seus callbacks. Se a poll queue estiver vazia, espera por eventos (blocking wait) — eficiência de CPU. Se houver setImmediate pendente, move para Check.',
    code: [
      [{ text: 'fs.readFile("file.txt", (err, data) => {', color: FG }],
      [{ text: '  // Callback executa na fase POLL', color: '#475569' }],
      [{ text: '  // quando o I/O completa', color: '#475569' }],
      [{ text: '})', color: FG }],
    ],
  },
  {
    id: 'check',
    emoji: '✓',
    name: 'Check (setImmediate)',
    color: GRN,
    short: 'Check',
    detail: 'Executa callbacks de setImmediate(). Sempre executa APÓS a fase Poll da mesma iteração — útil para garantir execução após qualquer I/O da iteração atual.',
    code: [
      [{ text: 'setImmediate(() => {', color: FG }],
      [{ text: "  console.log('check phase')", color: '#4ade80' }],
      [{ text: '})', color: FG }],
      [{ text: '// Executa após Poll nesta iteração', color: '#475569' }],
    ],
  },
  {
    id: 'close',
    emoji: '🔒',
    name: 'Close Callbacks',
    color: RED,
    short: 'Close',
    detail: 'Executa callbacks de "close" — como socket.on("close") ou process.on("exit"). Último estágio antes de reiniciar o ciclo.',
    code: [
      [{ text: "socket.on('close', () => {", color: FG }],
      [{ text: "  console.log('connection closed')", color: '#ef4444' }],
      [{ text: '})', color: FG }],
      [{ text: '// Executa na fase Close', color: '#475569' }],
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — queueMicrotask e process.nextTick (componente custom)
// ═══════════════════════════════════════════════════════════════════════════════

type PriorityItem = {
  order: number
  api: string
  type: 'sync' | 'nexttick' | 'microtask' | 'macro'
  color: string
  note: string
  nodeOnly?: boolean
}

const PRIORITY_ITEMS: PriorityItem[] = [
  { order: 1, api: 'Código síncrono / call stack',  type: 'sync',      color: GRN,    note: 'Mais prioritário — executa até esvaziar a call stack' },
  { order: 2, api: 'process.nextTick(fn)',           type: 'nexttick',  color: PRP,    note: 'Node.js apenas — mais prioritário que Promise.then', nodeOnly: true },
  { order: 3, api: 'Promise.then/catch/finally',     type: 'microtask', color: BLUE,   note: 'Microtask — drena completamente antes de macrotasks' },
  { order: 4, api: 'queueMicrotask(fn)',              type: 'microtask', color: BLUE,   note: 'Mesma fila das Promises — equivalente a Promise.then' },
  { order: 5, api: 'MutationObserver',               type: 'microtask', color: BLUE,   note: 'Browser: observa mudanças no DOM como microtask' },
  { order: 6, api: 'setImmediate(fn)',                type: 'macro',     color: C,      note: 'Node.js apenas — fase Check, após I/O da iteração', nodeOnly: true },
  { order: 7, api: 'setTimeout(fn, 0)',               type: 'macro',     color: C,      note: 'Macrotask — menor prioridade' },
  { order: 8, api: 'setInterval(fn, N)',              type: 'macro',     color: C,      note: 'Macrotask — repetindo a cada N ms' },
  { order: 9, api: 'requestAnimationFrame(fn)',       type: 'macro',     color: SKY,    note: 'Browser: antes do próximo frame de pintura (~16ms)' },
]

function PriorityVisual() {
  const [selected, setSelected] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'browser' | 'node'>('all')

  const visible = PRIORITY_ITEMS.filter(item => {
    if (filter === 'node') return true
    if (filter === 'browser') return !item.nodeOnly
    return true
  })

  const colors: Record<string, string> = {
    sync: GRN, nexttick: PRP, microtask: BLUE, macro: C,
  }
  const labels: Record<string, string> = {
    sync: 'Síncrono', nexttick: 'nextTick (Node)', microtask: 'Microtask', macro: 'Macrotask',
  }

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Ordem de prioridade de execução</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Clique em uma API para ver detalhes. Maior prioridade = número menor.</div>
      </div>

      {/* Filtro */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'browser', 'node'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? `${C}20` : CARD,
              border: `1.5px solid ${filter === f ? C : LINE}`,
              borderRadius: 6, color: filter === f ? C : FGMUTE,
              fontSize: 11, padding: '4px 12px', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {f === 'all' ? 'Todos' : f === 'browser' ? 'Browser' : 'Node.js'}
          </button>
        ))}
      </div>

      {/* Lista */}
      {visible.map((item) => (
        <div
          key={item.order}
          onClick={() => setSelected(selected === item.order ? null : item.order)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
            background: selected === item.order ? `${item.color}12` : `${CARD}80`,
            border: `1px solid ${selected === item.order ? item.color : LINE}`,
            transition: 'all 0.15s',
          }}
        >
          <div style={{
            width: 22, height: 22, borderRadius: 4,
            background: `${item.color}25`, border: `1px solid ${item.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: item.color, flexShrink: 0,
          }}>
            {item.order}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: FG, flex: 1 }}>
            {item.api}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{
              background: `${colors[item.type]}20`, border: `1px solid ${colors[item.type]}`,
              borderRadius: 4, padding: '1px 8px', fontSize: 9, color: colors[item.type], fontWeight: 700,
            }}>
              {labels[item.type]}
            </span>
            {item.nodeOnly && (
              <span style={{
                background: `${PRP}20`, border: `1px solid ${PRP}`,
                borderRadius: 4, padding: '1px 8px', fontSize: 9, color: PRP, fontWeight: 700,
              }}>
                Node.js
              </span>
            )}
          </div>
        </div>
      ))}

      {selected !== null && (
        <div style={{
          marginTop: 12, padding: '12px 16px', borderRadius: 8,
          background: `${PRIORITY_ITEMS.find(i => i.order === selected)?.color}10`,
          border: `1px solid ${PRIORITY_ITEMS.find(i => i.order === selected)?.color}40`,
          fontSize: 12, color: FG, lineHeight: 1.7,
        }}>
          <span style={{ fontWeight: 700, color: PRIORITY_ITEMS.find(i => i.order === selected)?.color }}>
            Prioridade {selected}: {PRIORITY_ITEMS.find(i => i.order === selected)?.api}
          </span>
          <br />
          {PRIORITY_ITEMS.find(i => i.order === selected)?.note}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function EventLoopVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'event-loop-animated',
      title: 'Event Loop Animado',
      subtitle: 'Visualize call stack, microtask queue e macrotask queue em ação',
      accent: C,
      component: <EventLoopAnimated />,
    },
    {
      id: 'call-stack',
      title: 'Call Stack',
      subtitle: 'LIFO em ação — push/pop, stack overflow e async/await desmistificado',
      accent: C,
      component: <CallStackVisual />,
    },
    {
      id: 'macro-micro',
      title: 'Macrotasks vs Microtasks',
      subtitle: 'Comparação de prioridade, APIs e casos de uso',
      accent: C,
      component: (
        <ComparisonTable
          options={TASK_OPTIONS}
          criteria={TASK_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Macrotasks vs Microtasks"
          description="A ordem de prioridade que define o comportamento de código assíncrono"
          highlightBest={false}
        />
      ),
    },
    {
      id: 'async-await',
      title: 'async/await — execução real',
      subtitle: 'O que realmente acontece quando await é encontrado',
      accent: C,
      component: (
        <CodeStepper
          scenarios={ASYNC_SCENARIOS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="async/await — mapeamento para o event loop"
          description="Entenda como await traduz para suspensão e retomada via microtasks"
        />
      ),
    },
    {
      id: 'blocking',
      title: 'Blocking vs Non-blocking',
      subtitle: 'O que realmente trava o thread — e como evitar',
      accent: C,
      component: <BlockingVisual />,
    },
    {
      id: 'gotchas',
      title: 'Armadilhas Comuns',
      subtitle: 'setTimeout(0), microtask loops, Promise.all vs sequencial',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={EL_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
          label="Event Loop — Armadilhas"
          heading="Os erros mais comuns com código assíncrono"
          description="Padrões que parecem corretos mas quebram por desconhecer o event loop"
        />
      ),
    },
    {
      id: 'node-phases',
      title: 'Fases do Node.js',
      subtitle: 'Timers → Pending → Poll → Check → Close — a ordem importa',
      accent: C,
      component: (
        <HookTimeline
          phases={NODE_PHASES}
          accentColor={C}
          bgColor={BG}
          label="Node.js Event Loop"
          heading="As 6 fases do event loop do Node.js"
          description="setImmediate vs setTimeout: a resposta depende de onde você está no loop"
        />
      ),
    },
    {
      id: 'priority',
      title: 'Ordem de Prioridade',
      subtitle: 'Do código síncrono ao setTimeout — quem executa primeiro?',
      accent: C,
      component: <PriorityVisual />,
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
