'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'

// ── Paleta Node.js ────────────────────────────────────────────────────────────
const C      = '#68A063'   // Node.js green
const BG     = '#0f172a'
const CARD   = '#1e293b'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const MUTE   = '#475569'
const RED    = '#ef4444'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Event Loop passo a passo (CodeStepper)
// ═══════════════════════════════════════════════════════════════════════════════

const EVENT_LOOP_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'event-loop-basic',
    label: 'Event Loop — nextTick vs Promise vs setImmediate vs setTimeout',
    code: `process.nextTick(() => console.log('nextTick'))
Promise.resolve().then(() => console.log('Promise.then'))
setImmediate(() => console.log('setImmediate'))
setTimeout(() => console.log('setTimeout 0'), 0)
console.log('síncrono')
// Output: síncrono → nextTick → Promise.then → setImmediate → setTimeout 0`,
    language: 'javascript',
    steps: [
      {
        lineStart: 1,
        lineEnd: 5,
        title: 'Registro das callbacks',
        explanation: 'Código síncrono executa: todas as callbacks são registradas nas filas. Nenhuma callback roda ainda.',
      },
      {
        lineStart: 5,
        title: 'Síncrono executa',
        explanation: 'console.log("síncrono") roda imediatamente na call stack. Output: "síncrono". Call stack drena.',
        output: '"síncrono"',
      },
      {
        lineStart: 1,
        title: 'nextTick drena',
        explanation: 'process.nextTick tem PRIORIDADE MÁXIMA — drena completamente antes de qualquer microtask ou macrotask.',
        output: '"síncrono" → "nextTick"',
      },
      {
        lineStart: 2,
        title: 'Microtasks de Promise',
        explanation: 'Promise.then() entra na fila de microtasks. Executa depois do nextTick, mas antes de qualquer timer ou I/O.',
        output: '"síncrono" → "nextTick" → "Promise.then"',
      },
      {
        lineStart: 3,
        title: 'setImmediate — fase check',
        explanation: 'setImmediate roda na fase "check" do event loop — após a fase poll de I/O. Garantido antes de setTimeout em contexto de I/O.',
        output: '... → "setImmediate"',
        memory: { phase: 'check' },
      },
      {
        lineStart: 4,
        title: 'setTimeout — fase timers',
        explanation: 'setTimeout(fn, 0) depende do timer heap. Fora de contexto I/O, a ordem vs setImmediate é não-determinística.',
        output: '... → "setTimeout 0"',
        memory: { phase: 'timers', nota: 'ordem vs setImmediate não garantida' },
      },
    ],
  },
  {
    id: 'async-await-loop',
    label: 'async/await — como Promises se encaixam no event loop',
    code: `async function fetchUser(id) {
  console.log('1 - início')
  const user = await db.findUser(id) // suspende aqui
  console.log('3 - após await')
  return user
}

fetchUser(42)
console.log('2 - síncrono após chamada')
// Output: 1 → 2 → 3`,
    language: 'javascript',
    steps: [
      {
        lineStart: 8,
        title: 'fetchUser é chamado',
        explanation: 'fetchUser(42) é invocada. Executa sincronamente até encontrar o await. A função suspende e retorna controle ao chamador.',
        callStack: ['fetchUser', 'main'],
      },
      {
        lineStart: 2,
        title: 'Output: "1 - início"',
        explanation: 'console.log("1 - início") executa antes do await. A função ainda está na call stack.',
        output: '"1 - início"',
        callStack: ['fetchUser → await'],
      },
      {
        lineStart: 9,
        title: 'Código síncrono continua',
        explanation: 'Com fetchUser suspensa, o código após a chamada continua. Output: "2 - síncrono após chamada".',
        output: '"1 - início" → "2 - síncrono após chamada"',
        callStack: ['main'],
      },
      {
        lineStart: 4,
        title: 'Promise resolve → "3 - após await"',
        explanation: 'Quando db.findUser resolve, o resumo da função entra na fila de microtasks e executa no próximo tick.',
        output: '"1 - início" → "2" → "3 - após await"',
        memory: { microtaskQueue: '→ resolve da Promise' },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Arquitetura Node.js (LayerStack: V8 + libuv + APIs)
// ═══════════════════════════════════════════════════════════════════════════════

const NODE_LAYERS: Layer[] = [
  {
    id: 'app',
    label: 'Aplicação / Frameworks',
    sublabel: 'Express, Fastify, NestJS, Next.js, scripts CLI',
    color: C,
    examples: ['HTTP servers', 'Middlewares', 'Rotas', 'WebSocket', 'Workers'],
    description: 'Seu código JavaScript/TypeScript. Usa as APIs do Node.js para criar servidores, ler arquivos, conectar bancos etc.',
  },
  {
    id: 'node-apis',
    label: 'Node.js Core APIs',
    sublabel: 'fs, http, https, net, crypto, stream, worker_threads, cluster',
    color: AMB,
    examples: ['fs.readFile', 'http.createServer', 'stream.pipeline', 'worker_threads', 'crypto', 'events.EventEmitter'],
    description: 'APIs JavaScript nativas do Node.js. Fazem ponte entre seu código e as capacidades de baixo nível (V8 + libuv).',
  },
  {
    id: 'bindings',
    label: 'Node.js Bindings (C++)',
    sublabel: 'Ponte entre JavaScript e bibliotecas nativas',
    color: SKY,
    examples: ['node_file.cc', 'node_http_parser.cc', 'node_crypto.cc', 'uv_fs_*', 'V8 Bindings'],
    description: 'Código C++ que expõe funcionalidades de sistema ao JavaScript. Usa V8 API e macros uv_* da libuv.',
  },
  {
    id: 'v8',
    label: 'V8 (Google)',
    sublabel: 'Motor JavaScript — compila JS para código nativo',
    color: PRP,
    examples: ['JIT Compiler', 'Garbage Collector', 'Heap', 'Call Stack', 'Ignition + TurboFan'],
    description: 'Motor de alto desempenho que executa JavaScript. JIT compila funções hot para código nativo. GC gerencia memória automaticamente.',
  },
  {
    id: 'libuv',
    label: 'libuv',
    sublabel: 'I/O assíncrono multiplataforma — o coração do event loop',
    color: GRN,
    examples: ['Event Loop', 'Thread Pool (4 threads default)', 'epoll/kqueue/IOCP', 'Timers', 'DNS', 'File System'],
    description: 'Biblioteca C que implementa o event loop e abstrai diferenças de OS. O thread pool (default: 4) cuida de fs, crypto, dns.lookup — operações sem AIO nativo.',
  },
  {
    id: 'os',
    label: 'Sistema Operacional',
    sublabel: 'Kernel: Linux / macOS / Windows',
    color: MUTE,
    examples: ['epoll (Linux)', 'kqueue (macOS)', 'IOCP (Windows)', 'Sockets TCP/UDP', 'File descriptors'],
    description: 'O kernel fornece as primitivas de I/O não-bloqueante. libuv abstrai as diferenças entre plataformas.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Streams & Backpressure (componente custom interativo)
// ═══════════════════════════════════════════════════════════════════════════════

type StreamStep = {
  id: string
  label: string
  type: 'readable' | 'transform' | 'writable' | 'pipe'
  desc: string
  code: string
  highlight: string
}

const STREAM_STEPS: StreamStep[] = [
  {
    id: 'readable',
    label: 'Readable Stream',
    type: 'readable',
    desc: 'Fonte de dados — produz chunks. Exemplos: fs.createReadStream(), http.IncomingMessage, process.stdin. Modo flowing: emite "data" automaticamente. Modo paused: chame .read() manualmente.',
    code: `const rs = fs.createReadStream('big.csv', {
  highWaterMark: 64 * 1024 // 64KB por chunk
})`,
    highlight: 'highWaterMark controla o buffer interno',
  },
  {
    id: 'transform',
    label: 'Transform Stream',
    type: 'transform',
    desc: 'Lê e transforma dados — duplex stream. Exemplos: zlib.createGzip(), csv-parse, crypto.createCipheriv(). Implementa _transform(chunk, enc, cb).',
    code: `const gzip = zlib.createGzip()
// ou custom:
const upper = new Transform({
  transform(chunk, enc, cb) {
    cb(null, chunk.toString().toUpperCase())
  }
})`,
    highlight: 'chame cb(null, resultado) para enviar ao próximo',
  },
  {
    id: 'writable',
    label: 'Writable Stream',
    type: 'writable',
    desc: 'Destino final dos dados. Exemplos: fs.createWriteStream(), http.ServerResponse, process.stdout. Implementa _write(chunk, enc, cb). Retorna false quando buffer lotou (backpressure!).',
    code: `const ws = fs.createWriteStream('output.csv.gz')
ws.on('drain', () => {
  // buffer esvaziou — pode escrever de novo
  rs.resume()
})`,
    highlight: '"drain" sinaliza que o buffer esvaziou',
  },
  {
    id: 'pipe',
    label: 'stream.pipeline()',
    type: 'pipe',
    desc: 'Conecta streams com gerenciamento automático de backpressure e cleanup de erros. Use sempre pipeline() em vez de .pipe() — .pipe() não propaga erros!',
    code: `import { pipeline } from 'stream/promises'

await pipeline(
  fs.createReadStream('big.csv'),
  zlib.createGzip(),
  fs.createWriteStream('big.csv.gz')
)
// cleanup automático em erro`,
    highlight: 'pipeline() propaga erros e libera recursos',
  },
]

function StreamsVisual() {
  const [active, setActive] = useState<string>('readable')
  const step = STREAM_STEPS.find(s => s.id === active)!

  const colorFor = (type: StreamStep['type']) => {
    if (type === 'readable') return C
    if (type === 'transform') return AMB
    if (type === 'writable') return SKY
    return GRN
  }

  const LINE = '#334155'

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: 20, height: '100%' }}>
      {/* pipeline visual */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: BG, borderRadius: 12, padding: '16px 20px', border: `1px solid ${LINE}` }}>
        {STREAM_STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: s.type === 'pipe' ? 1.5 : 1 }}>
            <button
              onClick={() => setActive(s.id)}
              style={{
                flex: 1,
                background: active === s.id ? `${colorFor(s.type)}20` : CARD,
                border: `2px solid ${active === s.id ? colorFor(s.type) : LINE}`,
                borderRadius: 10,
                padding: '10px 8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: active === s.id ? `0 0 14px ${colorFor(s.type)}40` : 'none',
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, color: active === s.id ? colorFor(s.type) : FGMUTE, marginBottom: 3, fontFamily: "'JetBrains Mono', monospace" }}>{s.type.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: FG, fontWeight: 600 }}>{s.label}</div>
            </button>
            {i < STREAM_STEPS.length - 1 && (
              <div style={{ width: 32, textAlign: 'center', color: GRN, fontSize: 18, fontWeight: 700, flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: CARD, borderRadius: 12, padding: 20, border: `1px solid ${colorFor(step.type)}30` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colorFor(step.type), marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.label}</div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.7, marginBottom: 12 }}>{step.desc}</div>
          <div style={{ background: `${colorFor(step.type)}15`, border: `1px solid ${colorFor(step.type)}40`, borderRadius: 8, padding: '8px 12px', fontSize: 11, color: colorFor(step.type), fontStyle: 'italic' }}>
            {step.highlight}
          </div>
        </div>
        <div style={{ background: BG, borderRadius: 12, padding: 20, border: `1px solid ${LINE}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.9, color: FGMUTE, whiteSpace: 'pre-wrap' }}>
          {step.code}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Cluster vs Worker Threads (comparativo interativo)
// ═══════════════════════════════════════════════════════════════════════════════

const CONCURRENCY_OPTIONS: ComparisonOption[] = [
  { id: 'cluster',       label: 'cluster',       color: C },
  { id: 'worker-threads', label: 'worker_threads', color: AMB },
  { id: 'child-process', label: 'child_process',  color: SKY },
]

const CONCURRENCY_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'use-case',
    label: 'Caso de uso principal',
    values: {
      'cluster':        { rating: 'good',  note: 'Escalar HTTP server em múltiplos cores (N workers = N processos)' },
      'worker-threads': { rating: 'good',  note: 'CPU-bound em background: hashing, parsing, compressão' },
      'child-process':  { rating: 'good',  note: 'Executar comandos de sistema, binários externos, scripts' },
    },
  },
  {
    id: 'memory',
    label: 'Memória compartilhada',
    values: {
      'cluster':        { rating: 'poor',      note: 'NÃO — processos isolados. IPC via process.send()' },
      'worker-threads': { rating: 'excellent',  note: 'SIM — SharedArrayBuffer + Atomics para memória real' },
      'child-process':  { rating: 'poor',       note: 'NÃO — processos completamente isolados' },
    },
  },
  {
    id: 'overhead',
    label: 'Overhead de criação',
    values: {
      'cluster':        { rating: 'poor',   note: 'Alto — fork() cria processo completo (~50MB+ memória)' },
      'worker-threads': { rating: 'fair',   note: 'Médio — thread leve, compartilha heap do processo pai' },
      'child-process':  { rating: 'poor',   note: 'Alto — processo separado, sem compartilhamento' },
    },
  },
  {
    id: 'failure',
    label: 'Isolamento de falha',
    values: {
      'cluster':        { rating: 'excellent', note: 'Excelente — worker crash não afeta o master nem outros workers' },
      'worker-threads': { rating: 'fair',      note: 'Médio — erro fatal pode derrubar o processo principal' },
      'child-process':  { rating: 'excellent', note: 'Excelente — processo completamente isolado' },
    },
  },
  {
    id: 'io-sharing',
    label: 'Compartilhar porta HTTP',
    values: {
      'cluster':        { rating: 'excellent', note: 'SIM — workers compartilham a mesma porta via master' },
      'worker-threads': { rating: 'poor',      note: 'NÃO — não têm event loop HTTP próprio por padrão' },
      'child-process':  { rating: 'poor',      note: 'Não nativamente — requer IPC para passar o socket' },
    },
  },
  {
    id: 'communication',
    label: 'Comunicação entre unidades',
    values: {
      'cluster':        { rating: 'fair', note: 'process.send() / message events (serializado)' },
      'worker-threads': { rating: 'good', note: 'postMessage() + SharedArrayBuffer + Atomics' },
      'child-process':  { rating: 'fair', note: 'stdio pipes, IPC channel, spawn options' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Módulos CommonJS vs ESM (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const MODULE_SLIDES: Slide[] = [
  {
    title: 'CommonJS (CJS)',
    paragraphs: [
      'require() é síncrono — bloqueia até carregar o módulo. module.exports / exports — objeto mutável compartilhado.',
      'Módulos em cache após primeira carga (singleton por processo). __dirname e __filename disponíveis globalmente.',
      'Extensão .js, .cjs ou package.json sem "type":"module". require() dinâmico: pode ser usado em if/try — carregamento condicional.',
    ],
    gradient: [AMB, '#b45309'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.9, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9, marginBottom: 8 }}>math.js</div>
        <div><span style={{ color: AMB }}>function</span> <span style={{ color: C }}>add</span>(a, b) {'{'} <span style={{ color: PRP }}>return</span> a + b {'}'}</div>
        <div><span style={{ color: SKY }}>module.exports</span> = {'{'} add {'}'}</div>
        <div style={{ marginTop: 16, color: MUTE, fontSize: 9 }}>app.js</div>
        <div><span style={{ color: PRP }}>const</span> {'{'} <span style={{ color: C }}>add</span> {'}'} = <span style={{ color: AMB }}>require</span>(<span style={{ color: GRN }}>'./math'</span>)</div>
        <div style={{ color: MUTE, fontSize: 9, marginTop: 8 }}>// require() dinâmico — pode ser em if/try</div>
        <div><span style={{ color: PRP }}>if</span> (debug) <span style={{ color: AMB }}>require</span>(<span style={{ color: GRN }}>'./debug-utils'</span>)</div>
      </div>
    ),
  },
  {
    title: 'ES Modules (ESM)',
    paragraphs: [
      'import/export estático — analisado em parse-time, permite tree shaking. Top-level await suportado nativamente.',
      'Sem __dirname / __filename — use import.meta.url. Strict mode sempre ativo por padrão.',
      'Extensão .mjs ou package.json com "type":"module". TypeScript: "module":"NodeNext" + "moduleResolution":"NodeNext".',
    ],
    gradient: [SKY, '#0369a1'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.9, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9, marginBottom: 8 }}>math.mjs</div>
        <div><span style={{ color: PRP }}>export</span> <span style={{ color: AMB }}>function</span> <span style={{ color: C }}>add</span>(a, b) {'{'} <span style={{ color: PRP }}>return</span> a + b {'}'}</div>
        <div style={{ marginTop: 16, color: MUTE, fontSize: 9 }}>app.mjs</div>
        <div><span style={{ color: PRP }}>import</span> {'{'} <span style={{ color: C }}>add</span> {'}'} <span style={{ color: PRP }}>from</span> <span style={{ color: GRN }}>'./math.mjs'</span></div>
        <div style={{ marginTop: 8, color: MUTE, fontSize: 9 }}>// top-level await</div>
        <div><span style={{ color: PRP }}>const</span> config = <span style={{ color: PRP }}>await</span> <span style={{ color: AMB }}>fetch</span>(<span style={{ color: GRN }}>'...'</span>).then(r =&gt; r.json())</div>
      </div>
    ),
  },
  {
    title: 'Interoperabilidade CJS ↔ ESM',
    paragraphs: [
      'ESM pode importar CJS — Node faz wrapper automático. CJS NÃO pode require() ESM — use import() dinâmico (retorna Promise).',
      '"type":"module" torna .js = ESM no pacote inteiro. Pacotes duais: "exports" com "require" e "import" condicional.',
      'TypeScript: "module":"NodeNext" + "moduleResolution":"NodeNext" para suporte correto a ESM com extensões explícitas.',
    ],
    gradient: [GRN, '#15803d'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, lineHeight: 1.9, padding: 16 }}>
        <div style={{ color: MUTE, fontSize: 9, marginBottom: 8 }}>// ESM importando CJS — OK</div>
        <div><span style={{ color: PRP }}>import</span> lodash <span style={{ color: PRP }}>from</span> <span style={{ color: GRN }}>'lodash'</span> <span style={{ color: MUTE }}>// funciona</span></div>
        <div style={{ marginTop: 12, color: RED, fontSize: 9 }}>// CJS importando ESM — ERRO</div>
        <div style={{ color: RED }}>// const mod = require('./esm.mjs')</div>
        <div style={{ marginTop: 8, color: GRN }}>// CJS importando ESM — correto</div>
        <div><span style={{ color: PRP }}>const</span> mod = <span style={{ color: PRP }}>await</span> <span style={{ color: AMB }}>import</span>(<span style={{ color: GRN }}>'./esm.mjs'</span>)</div>
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns Node.js (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const NODE_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Callback Hell — pyramid of doom',
    wrong: [
      [{ text: 'fs.readFile', color: RED }, { text: "('a.json', (err, a) => {" }],
      [{ text: '  if (err) throw err', color: RED }],
      [{ text: '  db.query', color: RED }, { text: "(a.id, (err, r) => {" }],
      [{ text: '    if (err) throw err', color: RED }],
      [{ text: '    fs.writeFile', color: RED }, { text: "('out', r, (err) => {" }],
      [{ text: '      if (err) throw err', color: RED }],
      [{ text: '    })' }],
      [{ text: '  })' }],
      [{ text: '})' }],
    ],
    right: [
      [{ text: 'async function', color: AMB }, { text: ' processFile() {' }],
      [{ text: '  const', color: PRP }, { text: ' a = ' }, { text: 'await', color: PRP }, { text: " fs.promises.readFile('a.json')", color: GRN }],
      [{ text: '  const', color: PRP }, { text: ' r = ' }, { text: 'await', color: PRP }, { text: ' db.query(a.id)', color: GRN }],
      [{ text: '  await', color: PRP }, { text: " fs.promises.writeFile('out', r)", color: GRN }],
      [{ text: '}' }],
    ],
    why: 'Callbacks aninhados criam "pyramid of doom" — ilegível, difícil de tratar erros, impossível de testar unitariamente. Use async/await.',
  },
  {
    title: 'Operação síncrona em loop de requisição',
    wrong: [
      [{ text: 'app.get', color: RED }, { text: "('/users', (req, res) => {" }],
      [{ text: '  // BLOQUEIA o event loop!', color: MUTE }],
      [{ text: '  const data = ' }, { text: 'fs.readFileSync', color: RED }, { text: "('cache.json')" }],
      [{ text: '  res.json(JSON.parse(data))' }],
      [{ text: '})' }],
    ],
    right: [
      [{ text: 'app.get', color: GRN }, { text: "('/users', async (req, res) => {" }],
      [{ text: '  const data = await ' }, { text: "fs.promises.readFile", color: GRN }, { text: "('cache.json')" }],
      [{ text: '  res.json(JSON.parse(data))' }],
      [{ text: '})' }],
    ],
    why: 'readFileSync, bcrypt.hashSync em loops de requisição bloqueiam o event loop inteiro para TODAS as requisições concorrentes. Use a variante async/await.',
  },
  {
    title: 'Promises sem tratamento de erro',
    wrong: [
      [{ text: '// ❌ rejeição silenciosa (Node < 15)', color: MUTE }],
      [{ text: 'fetchData()', color: RED }, { text: '.then(process) // sem .catch()' }],
      [{ text: '// ❌ async sem try/catch', color: MUTE }],
      [{ text: 'app.get', color: RED }, { text: "('/x', async (req, res) => {" }],
      [{ text: '  const r = await riskyOp() // crash em erro', color: RED }],
      [{ text: '  res.json(r)' }],
      [{ text: '})' }],
    ],
    right: [
      [{ text: 'fetchData()' }, { text: '\n  .then(process)\n  .' }],
      [{ text: '  .catch', color: GRN }, { text: '(err => logger.error(err))' }],
      [{ text: 'app.get', color: GRN }, { text: "('/x', async (req, res, next) => {" }],
      [{ text: '  try {' }],
      [{ text: '    const r = await riskyOp()', color: GRN }],
      [{ text: '    res.json(r)' }],
      [{ text: '  } catch (err) { ' }, { text: 'next(err)', color: GRN }, { text: ' }' }],
      [{ text: '})' }],
    ],
    why: 'UnhandledPromiseRejection em Node 15+ termina o processo. Toda Promise deve ter catch ou estar em async/await com try/catch.',
  },
  {
    title: 'Memory leak por EventEmitter',
    wrong: [
      [{ text: '// listener adicionado a cada requisição', color: MUTE }],
      [{ text: 'app.get', color: RED }, { text: "('/ws', (req, res) => {" }],
      [{ text: '  emitter.', color: RED }, { text: "on('data', handler)", color: RED }],
      [{ text: '  // handler nunca removido!', color: RED }],
      [{ text: '})' }],
    ],
    right: [
      [{ text: 'app.get', color: GRN }, { text: "('/ws', (req, res) => {" }],
      [{ text: '  const handler = (d) => res.write(d)' }],
      [{ text: '  emitter.', color: GRN }, { text: 'on', color: GRN }, { text: "('data', handler)" }],
      [{ text: "  req.on('" }, { text: "close'", color: GRN }, { text: ", () =>" }],
      [{ text: '    emitter.' }, { text: 'off', color: GRN }, { text: "('data', handler))" }],
      [{ text: '})' }],
    ],
    why: 'Adicionar listeners em loop sem remover esgota memória. EventEmitter avisa com "MaxListenersExceededWarning" para >10 listeners. Remova o listener quando o request fechar.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Quando usar Node.js (DecisionTree — flat nodes map)
// ═══════════════════════════════════════════════════════════════════════════════

const WHEN_NODES: Record<string, DTNode> = {
  root: {
    id: 'root',
    question: 'Qual é o perfil principal da tarefa?',
    children: [
      { label: 'I/O intensivo (APIs, banco, WebSocket, streaming)', nodeId: 'io-check' },
      { label: 'CPU-bound (ML, encoding, crypto pesado)', nodeId: 'cpu-check' },
      { label: 'Processamento de dados / ETL em batch', nodeId: 'batch' },
      { label: 'Sistema de tempo real (jogos, simulação física)', nodeId: 'realtime' },
    ],
  },
  'io-check': {
    id: 'io-check',
    question: 'Precisa de alta concorrência (1000+ conexões simultâneas)?',
    children: [
      { label: 'Sim', nodeId: 'node-excellent', color: GRN },
      { label: 'Não (< 100 conexões)', nodeId: 'node-fine', color: AMB },
    ],
  },
  'node-excellent': {
    id: 'node-excellent',
    recommendation: 'Node.js é excelente',
    detail: 'Event loop não-bloqueante brilha aqui. Uma instância pode gerenciar 10k+ conexões com uso mínimo de memória. Express, Fastify, ou NestJS são boas escolhas.',
    color: GRN,
  },
  'node-fine': {
    id: 'node-fine',
    recommendation: 'Node.js funciona bem',
    detail: 'Para baixo volume, qualquer stack serve. Node é simples e o ecossistema npm é vasto. Considere Django/Rails/Spring Boot se seu time já dominar.',
    color: GRN,
  },
  'cpu-check': {
    id: 'cpu-check',
    question: 'Qual o volume de processamento?',
    children: [
      { label: 'Pesado (segundos a minutos por tarefa)', nodeId: 'cpu-heavy', color: RED },
      { label: 'Leve (< 50ms por operação)', nodeId: 'cpu-light', color: GRN },
    ],
  },
  'cpu-heavy': {
    id: 'cpu-heavy',
    recommendation: 'Considere Python / Go / Rust',
    detail: 'Node.js trava o event loop em CPU-bound. worker_threads ajuda, mas Go/Rust têm paralelismo nativo. Para ML/AI, Python (TensorFlow, PyTorch) é o ecossistema certo.',
    color: RED,
  },
  'cpu-light': {
    id: 'cpu-light',
    recommendation: 'worker_threads resolve',
    detail: 'Para CPU-bound leve e pontual, worker_threads do Node.js é suficiente. Passe o trabalho para uma thread separada, resultado via postMessage.',
    color: GRN,
  },
  batch: {
    id: 'batch',
    recommendation: 'Node pode, mas avalie Python/Go',
    detail: 'Node.js com streams lida bem com ETL de grande volume (sem carregar tudo em memória). Para análise complexa de dados ou uso de pandas/numpy, Python é mais produtivo.',
    color: AMB,
  },
  realtime: {
    id: 'realtime',
    recommendation: 'Node NÃO é a escolha ideal',
    detail: 'GC pausas do V8 causam jitter imprevisível. Para jogos e simulação física, Go (goroutines) ou C++/Rust oferecem controle de latência que Node não consegue garantir.',
    color: RED,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Error Handling patterns (CardCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const ERROR_CARDS: CarouselCard[] = [
  {
    name: 'try/catch em async/await',
    signature: 'async function handler(req, res, next)',
    emoji: '🛡️',
    color: C,
    use: [
      'Route handlers do Express/Fastify',
      'Serviços com múltiplas operações async',
      'Quando precisar de contexto local para logging',
    ],
    dontUse: 'Handlers síncronos (use error-first callback) ou quando o error boundary global é suficiente',
  },
  {
    name: 'Domain Errors (classes de erro)',
    signature: 'class AppError extends Error { statusCode: number }',
    emoji: '🏗️',
    color: AMB,
    use: [
      'APIs REST com múltiplos tipos de erro',
      'Validação de negócio (conflito, autorização)',
      'Erros que precisam de mensagem customizada para o cliente',
    ],
    dontUse: 'Erros de infra (DB down, timeout) — log e retorne 500 genérico',
  },
  {
    name: 'Global Error Handler (Express)',
    signature: 'app.use((err, req, res, next) => {})',
    emoji: '🌐',
    color: SKY,
    use: [
      'Centralizar logging de erros (Sentry, Datadog)',
      'Formatar resposta de erro consistente para toda a API',
      'Distinguir erros esperados (AppError) de bugs (500)',
    ],
    dontUse: 'Como substituto do try/catch em handlers async sem wrapper',
  },
  {
    name: 'process.on uncaughtException / unhandledRejection',
    signature: 'process.on("uncaughtException", (err, origin) => {})',
    emoji: '⚡',
    color: RED,
    use: [
      'Logging de erros fatais antes de morrer',
      'Flush de buffers (telemetria, logs)',
      'Notificar equipe antes de process.exit(1)',
    ],
    dontUse: 'Tentar continuar o processo — estado indeterminado. Como substituto de tratamento de erro normal',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function NodeJsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'event-loop-stepper',
      title: 'Event Loop',
      subtitle: 'Execução passo a passo — nextTick vs Promise vs setImmediate vs setTimeout',
      accent: C,
      component: (
        <CodeStepper
          scenarios={EVENT_LOOP_SCENARIOS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'arquitetura-node',
      title: 'Arquitetura',
      subtitle: 'V8 + libuv + Thread Pool — as camadas do Node.js',
      accent: C,
      component: (
        <LayerStack
          layers={NODE_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'streams-backpressure',
      title: 'Streams',
      subtitle: 'Readable → Transform → Writable com backpressure e pipeline()',
      accent: C,
      component: <StreamsVisual />,
    },
    {
      id: 'cluster-vs-workers',
      title: 'Concorrência',
      subtitle: 'cluster vs worker_threads vs child_process — quando usar cada um',
      accent: C,
      component: (
        <ComparisonTable
          options={CONCURRENCY_OPTIONS}
          criteria={CONCURRENCY_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'modulos-cjs-esm',
      title: 'Módulos',
      subtitle: 'CommonJS vs ESM — diferenças, interoperabilidade, dual packages',
      accent: C,
      component: (
        <ConceptCarousel
          slides={MODULE_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'antipatterns-node',
      title: 'Anti-patterns',
      subtitle: 'Callback hell, sync em loop, Promises sem catch, memory leaks',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={NODE_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'quando-usar',
      title: 'Quando usar?',
      subtitle: 'Árvore de decisão — I/O vs CPU-bound vs batch vs realtime',
      accent: C,
      component: (
        <DecisionTree
          root={WHEN_NODES.root}
          nodes={WHEN_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'error-patterns',
      title: 'Error Handling',
      subtitle: 'try/catch, domain errors, global handler, process events',
      accent: C,
      component: (
        <CardCarousel
          cards={ERROR_CARDS}
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
