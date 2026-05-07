'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Memory Management ──────────────────────────────────────────────────
const C      = '#10b981'   // emerald — memória/alocação
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const BLUE   = '#3b82f6'
const PRP    = '#a78bfa'

void LINE; void FGMUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — GC Generacional — Fluxo de Objetos no V8
// ═══════════════════════════════════════════════════════════════════════════════

type GCObject = {
  id: string
  label: string
  age: number
  space: 'young' | 'old' | 'collected'
  color: string
}

function GCGenerationalVisual() {
  const [gcCycle, setGcCycle] = useState(0)
  const [objects, setObjects] = useState<GCObject[]>([
    { id: 'obj1', label: 'obj1 (temp)', age: 0, space: 'young', color: RED },
    { id: 'obj2', label: 'obj2 (module)', age: 0, space: 'young', color: C },
    { id: 'obj3', label: 'obj3 (temp)', age: 0, space: 'young', color: RED },
    { id: 'obj4', label: 'obj4 (cache)', age: 0, space: 'young', color: C },
    { id: 'obj5', label: 'obj5 (temp)', age: 0, space: 'young', color: RED },
  ])

  const explanations = [
    'Estado inicial: 5 objetos recém-alocados no young space. Temporários (vermelho) e de longa duração (verde).',
    'Minor GC #1: Scavenger varre o young space. Temporários (obj1, obj3, obj5) morrem. Sobreviventes (obj2, obj4) ganham age=1.',
    'Novos objetos alocados no young space. obj6 (temp) e obj7 (singleton).',
    'Minor GC #2: obj6 morre. obj2 e obj4 sobrevivem 2 GCs → promovidos ao old space. obj7 age=1.',
    'obj2 e obj4 estão no old space. Raro Major GC é necessário para limpá-los se ficarem inalcançáveis.',
  ]

  function runGC() {
    if (gcCycle >= 4) {
      setGcCycle(0)
      setObjects([
        { id: 'obj1', label: 'obj1 (temp)', age: 0, space: 'young', color: RED },
        { id: 'obj2', label: 'obj2 (module)', age: 0, space: 'young', color: C },
        { id: 'obj3', label: 'obj3 (temp)', age: 0, space: 'young', color: RED },
        { id: 'obj4', label: 'obj4 (cache)', age: 0, space: 'young', color: C },
        { id: 'obj5', label: 'obj5 (temp)', age: 0, space: 'young', color: RED },
      ])
      return
    }

    const next = gcCycle + 1
    setGcCycle(next)

    if (next === 1) {
      setObjects(prev => prev.map(o =>
        ['obj1', 'obj3', 'obj5'].includes(o.id)
          ? { ...o, space: 'collected' as const }
          : { ...o, age: 1 }
      ))
    } else if (next === 2) {
      setObjects(prev => [
        ...prev.filter(o => o.space !== 'collected'),
        { id: 'obj6', label: 'obj6 (temp)', age: 0, space: 'young' as const, color: RED },
        { id: 'obj7', label: 'obj7 (singleton)', age: 0, space: 'young' as const, color: C },
      ])
    } else if (next === 3) {
      setObjects(prev => prev.map(o => {
        if (o.id === 'obj6') return { ...o, space: 'collected' as const }
        if (o.id === 'obj7') return { ...o, age: 1 }
        if (o.id === 'obj2' || o.id === 'obj4') return { ...o, space: 'old' as const, age: 2 }
        return o
      }))
    } else if (next === 4) {
      // noop — explanation shows old space objects
    }
  }

  const youngObjects = objects.filter(o => o.space === 'young')
  const oldObjects = objects.filter(o => o.space === 'old')

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>GC Generacional — Ciclo de Vida dos Objetos</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Veja objetos serem coletados no young space e promovidos ao old space</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {/* Young Space */}
        <div style={{ background: CARD, border: `1.5px solid ${C}30`, borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Young Space</div>
            <div style={{ fontSize: 9, color: FGMUTE }}>Scavenger GC • frequente</div>
          </div>
          {youngObjects.length === 0 ? (
            <div style={{ fontSize: 10, color: '#334155', textAlign: 'center', padding: '12px 0' }}>vazio</div>
          ) : youngObjects.map(obj => (
            <div key={obj.id} style={{
              background: `${obj.color}15`, border: `1px solid ${obj.color}40`,
              borderRadius: 6, padding: '5px 10px', marginBottom: 5,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: obj.color }}>{obj.label}</span>
              <span style={{ fontSize: 9, color: FGMUTE }}>age={obj.age}</span>
            </div>
          ))}
        </div>

        {/* Old Space */}
        <div style={{ background: CARD, border: `1.5px solid ${BLUE}30`, borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Old Space</div>
            <div style={{ fontSize: 9, color: FGMUTE }}>Mark-Sweep-Compact • raro</div>
          </div>
          {oldObjects.length === 0 ? (
            <div style={{ fontSize: 10, color: '#334155', textAlign: 'center', padding: '12px 0' }}>vazio — nenhum promovido ainda</div>
          ) : oldObjects.map(obj => (
            <div key={obj.id} style={{
              background: `${BLUE}15`, border: `1px solid ${BLUE}40`,
              borderRadius: 6, padding: '5px 10px', marginBottom: 5,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: BLUE }}>{obj.label}</span>
              <span style={{ fontSize: 9, color: FGMUTE }}>promovido (age={obj.age})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explicação */}
      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: FG, lineHeight: 1.7 }}>
        <span style={{ fontWeight: 700, color: C }}>Ciclo {gcCycle}: </span>
        {explanations[gcCycle]}
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, color: FGMUTE, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: RED, display: 'inline-block' }} />
          Temporário (morre jovem)
        </span>
        <span style={{ fontSize: 10, color: FGMUTE, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: C, display: 'inline-block' }} />
          Longa duração (promovido)
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={runGC}
          style={{
            background: `${C}20`, border: `1.5px solid ${C}`,
            borderRadius: 8, color: C, fontSize: 11, padding: '7px 20px',
            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700,
          }}
        >
          {gcCycle >= 4 ? '↺ Reiniciar' : gcCycle === 0 ? '▶ Executar Minor GC #1' : gcCycle === 1 ? '+ Alocar novos objetos' : gcCycle === 2 ? '▶ Executar Minor GC #2' : '→ Próximo passo'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Heap Snapshot — Como Ler o DevTools
// ═══════════════════════════════════════════════════════════════════════════════

type SnapshotEntry = {
  constructor: string
  distance: number
  shallowSize: number
  retainedSize: number
  delta: number
  retainer: string
  leak: boolean
}

const SNAPSHOT_DATA: SnapshotEntry[] = [
  { constructor: 'Array', distance: 2, shallowSize: 128, retainedSize: 847200, delta: 12400, retainer: 'globalCache.items', leak: true },
  { constructor: 'EventListener', distance: 3, shallowSize: 56, retainedSize: 420000, delta: 8200, retainer: 'button#menu.listeners', leak: true },
  { constructor: 'Closure', distance: 4, shallowSize: 72, retainedSize: 312000, delta: 6100, retainer: 'setInterval callback', leak: true },
  { constructor: 'HTMLDivElement', distance: 2, shallowSize: 88, retainedSize: 156000, delta: 3000, retainer: 'detachedNodes', leak: true },
  { constructor: 'Promise', distance: 5, shallowSize: 64, retainedSize: 89000, delta: 1800, retainer: 'pendingHandlers', leak: true },
  { constructor: 'String', distance: 3, shallowSize: 240, retainedSize: 240, delta: 0, retainer: 'constants.labels', leak: false },
  { constructor: 'Object', distance: 2, shallowSize: 96, retainedSize: 96, delta: 0, retainer: 'config.settings', leak: false },
]

function HeapSnapshotVisual() {
  const [selected, setSelected] = useState<SnapshotEntry | null>(null)
  const [sortBy, setSortBy] = useState<'retainedSize' | 'delta'>('delta')

  const sorted = [...SNAPSHOT_DATA].sort((a, b) => b[sortBy] - a[sortBy])

  function formatBytes(b: number) {
    if (b > 1000000) return `${(b / 1000000).toFixed(1)} MB`
    if (b > 1000) return `${(b / 1000).toFixed(0)} KB`
    return `${b} B`
  }

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Como Ler um Heap Snapshot</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Simulação do Chrome DevTools Memory — clique em um objeto para ver o retainer</div>
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: FGMUTE }}>Ordenar por:</span>
        {(['delta', 'retainedSize'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            style={{
              background: sortBy === s ? `${C}20` : CARD,
              border: `1.5px solid ${sortBy === s ? C : LINE}`,
              borderRadius: 6, color: sortBy === s ? C : FGMUTE,
              fontSize: 10, padding: '4px 12px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {s === 'delta' ? 'Delta (crescimento)' : 'Retained Size'}
          </button>
        ))}
      </div>

      {/* Tabela simulada */}
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '160px 70px 90px 90px 70px',
          background: CARD, padding: '6px 12px', borderBottom: `1px solid ${LINE}`,
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: FGMUTE,
        }}>
          <span>Constructor</span>
          <span>Distance</span>
          <span>Shallow Size</span>
          <span style={{ color: sortBy === 'retainedSize' ? C : FGMUTE }}>Retained Size</span>
          <span style={{ color: sortBy === 'delta' ? C : FGMUTE }}>Delta ↑</span>
        </div>
        {sorted.map((entry, i) => (
          <div
            key={i}
            onClick={() => setSelected(selected?.constructor === entry.constructor && selected.retainer === entry.retainer ? null : entry)}
            style={{
              display: 'grid', gridTemplateColumns: '160px 70px 90px 90px 70px',
              padding: '7px 12px', borderBottom: `1px solid ${LINE}`,
              background: selected?.constructor === entry.constructor && selected?.retainer === entry.retainer
                ? `${entry.leak ? RED : C}15`
                : i % 2 === 0 ? BG : CARD,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: entry.leak ? RED : FGMUTE }}>
              {entry.constructor}
              {entry.leak && <span style={{ fontSize: 8, marginLeft: 4, background: `${RED}20`, color: RED, borderRadius: 3, padding: '1px 4px' }}>leak?</span>}
            </span>
            <span style={{ fontSize: 10, color: FGMUTE }}>{entry.distance}</span>
            <span style={{ fontSize: 10, color: FGMUTE }}>{formatBytes(entry.shallowSize)}</span>
            <span style={{ fontSize: 10, color: entry.retainedSize > 100000 ? AMB : FGMUTE, fontWeight: entry.retainedSize > 100000 ? 700 : 400 }}>
              {formatBytes(entry.retainedSize)}
            </span>
            <span style={{ fontSize: 10, color: entry.delta > 0 ? RED : FGMUTE, fontWeight: entry.delta > 0 ? 700 : 400 }}>
              {entry.delta > 0 ? `+${formatBytes(entry.delta)}` : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Retainer detail */}
      {selected ? (
        <div style={{
          background: `${selected.leak ? RED : C}10`,
          border: `1.5px solid ${selected.leak ? RED : C}40`,
          borderRadius: 10, padding: 14,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: selected.leak ? RED : C, marginBottom: 8 }}>
            Retainers de {selected.constructor}
          </div>
          <div style={{ fontSize: 11, color: FG, marginBottom: 8 }}>
            <span style={{ color: FGMUTE }}>Caminho de referência: </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: selected.leak ? RED : C }}>
              roots → {selected.retainer} → {selected.constructor}
            </span>
          </div>
          {selected.leak && (
            <div style={{ fontSize: 11, color: AMB, lineHeight: 1.7 }}>
              Delta positivo ({'+' + formatBytes(selected.delta)}) e retained size alto ({formatBytes(selected.retainedSize)}) indicam possível leak. Verifique se {selected.retainer} deveria ainda referenciar este objeto.
            </div>
          )}
          {!selected.leak && (
            <div style={{ fontSize: 11, color: C, lineHeight: 1.7 }}>
              Delta zero — este objeto não está crescendo. Provavelmente uso legítimo.
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, lineHeight: 1.8 }}>
          <strong style={{ color: FG }}>Como interpretar:</strong><br />
          <strong style={{ color: C }}>Retained Size</strong> = memória que seria liberada se o objeto fosse coletado (inclui tudo que só este objeto segura).<br />
          <strong style={{ color: RED }}>Delta positivo</strong> = objeto crescendo entre snapshots — candidato a leak.<br />
          <strong style={{ color: AMB }}>Distance</strong> = distância da root no grafo de referências — menor = mais próximo de uma root.<br /><br />
          Clique em um objeto para ver o caminho de referência que o mantém vivo.
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Leak Anti-patterns (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const LEAK_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Event listener sem removeEventListener',
    wrong: [
      [{ text: 'function setup() {', color: FG }],
      [{ text: '  const bigData = new Array(1_000_000).fill(0)', color: RED }],
      [{ text: '  // bigData capturado no escopo do handler', color: '#475569' }],
      [{ text: '  button.addEventListener(', color: RED }, { text: "'click'", color: AMB }, { text: ', handler)', color: RED }],
      [{ text: '  // ❌ Sem removeEventListener — bigData nunca coletado', color: RED }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: 'function setup() {', color: FG }],
      [{ text: '  const bigData = new Array(1_000_000).fill(0)', color: FG }],
      [{ text: '  button.addEventListener(', color: C }, { text: "'click'", color: AMB }, { text: ', handler)', color: C }],
      [{ text: '  // ✓ Cleanup ao desmontar', color: '#475569' }],
      [{ text: '  return () => button.removeEventListener(', color: C }, { text: "'click'", color: AMB }, { text: ', handler)', color: C }],
      [{ text: '}', color: FG }],
    ],
    why: 'O handler captura o escopo de setup() via closure. Enquanto o listener existir, bigData não pode ser coletado — mesmo que setup() tenha retornado. GC segue referências: listener → handler closure → bigData.',
  },
  {
    title: 'setInterval sem clearInterval em SPA',
    wrong: [
      [{ text: '// ❌ React component sem cleanup', color: '#475569' }],
      [{ text: 'useEffect(() => {', color: RED }],
      [{ text: "  setInterval(() => fetchData(), 5000)", color: RED }],
      [{ text: '  // Sem return de cleanup!', color: RED }],
      [{ text: '  // Ao desmontar: interval continua rodando', color: RED }],
      [{ text: '  // Estado do componente: leak de memória', color: RED }],
      [{ text: '}, [])', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Com cleanup correto', color: C }],
      [{ text: 'useEffect(() => {', color: FG }],
      [{ text: '  const id = setInterval(() => fetchData(), 5000)', color: C }],
      [{ text: '  return () => clearInterval(id)  // cleanup!', color: C }],
      [{ text: '}, [fetchData])', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '// Mesmo padrão para setTimeout e subscriptions', color: '#475569' }],
    ],
    why: 'setInterval sem clearInterval continua rodando após o componente desmontar. O callback segura uma closure do componente, impedindo que o GC colete o escopo do componente, estados e objetos referenciados.',
  },
  {
    title: 'Cache global sem LRU/TTL',
    wrong: [
      [{ text: '// ❌ Cache que cresce sem limite', color: '#475569' }],
      [{ text: 'const cache = new Map()  // singleton global', color: RED }],
      [{ text: '', color: FG }],
      [{ text: 'async function getUser(id: string) {', color: FG }],
      [{ text: '  if (cache.has(id)) return cache.get(id)', color: FG }],
      [{ text: '  const user = await fetchUser(id)', color: FG }],
      [{ text: '  cache.set(id, user)  // nunca limpa!', color: RED }],
      [{ text: '  return user', color: FG }],
      [{ text: '}', color: FG }],
    ],
    right: [
      [{ text: '// ✓ LRU com tamanho máximo', color: C }],
      [{ text: 'const cache = new LRUCache(100)  // máx 100 entradas', color: C }],
      [{ text: '', color: FG }],
      [{ text: 'async function getUser(id: string) {', color: FG }],
      [{ text: '  if (cache.has(id)) return cache.get(id)', color: FG }],
      [{ text: '  const user = await fetchUser(id)', color: FG }],
      [{ text: '  cache.set(id, user)  // evict LRU se > 100', color: C }],
      [{ text: '  return user', color: FG }],
      [{ text: '}', color: FG }],
    ],
    why: 'Map global em módulo singleton never gets garbage collected — viverá pela duração do processo. Em servidores de longa execução, acumula entradas indefinidamente. LRU limita o tamanho; TTL garante que dados expirados são removidos.',
  },
  {
    title: 'DOM detached mas referenciado por JS',
    wrong: [
      [{ text: '// ❌ Guarda ref ao elemento DOM', color: '#475569' }],
      [{ text: 'let cachedEl: HTMLElement | null = null', color: RED }],
      [{ text: '', color: FG }],
      [{ text: 'function setup() {', color: FG }],
      [{ text: '  cachedEl = document.getElementById(', color: RED }, { text: "'panel'", color: AMB }, { text: ')', color: RED }],
      [{ text: '}', color: FG }],
      [{ text: '// DOM removido:', color: '#475569' }],
      [{ text: 'document.body.removeChild(panel)', color: FG }],
      [{ text: '// cachedEl ainda segura o node + subárvore inteira!', color: RED }],
    ],
    right: [
      [{ text: '// ✓ Limpa a referência quando DOM é removido', color: C }],
      [{ text: 'let cachedEl: HTMLElement | null = null', color: FG }],
      [{ text: '', color: FG }],
      [{ text: 'function cleanup() {', color: FG }],
      [{ text: '  cachedEl = null  // permite GC do node', color: C }],
      [{ text: '  document.body.removeChild(panel)', color: FG }],
      [{ text: '}', color: FG }],
      [{ text: '// Ou: use WeakRef para refs que podem expirar', color: '#475569' }],
      [{ text: 'const ref = new WeakRef(el)  // não impede GC', color: C }],
    ],
    why: 'Remover um elemento do DOM não libera memória se há referência JS para ele. O elemento e toda sua subárvore de filhos ficam na memória enquanto a variável JS existir. "Detached DOM tree" é a classificação no DevTools.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Stack vs Heap Interativo com Closures
// ═══════════════════════════════════════════════════════════════════════════════

type MemStep = {
  stack: Array<{ name: string; vars: string[]; color: string }>
  heap: Array<{ id: string; label: string; refs: number; color: string }>
  note: string
  code: string
}

const MEM_STEPS: MemStep[] = [
  {
    stack: [],
    heap: [],
    code: 'function outer() {',
    note: 'Antes de chamar outer(). Stack e heap vazios.',
  },
  {
    stack: [{ name: 'outer()', vars: ['let obj = {data: [...]}', '→ heap[0]'], color: BLUE }],
    heap: [{ id: 'heap0', label: '{data: Array(1000)}', refs: 1, color: BLUE }],
    code: 'const obj = { data: new Array(1000) }',
    note: 'outer() empilhado. obj é referência na stack apontando para objeto no heap.',
  },
  {
    stack: [
      { name: 'inner()', vars: ['referência captura → obj'], color: C },
      { name: 'outer()', vars: ['let obj → heap[0]', 'const inner = function...'], color: BLUE },
    ],
    heap: [
      { id: 'heap0', label: '{data: Array(1000)}', refs: 2, color: BLUE },
      { id: 'heap1', label: 'closure: inner()', refs: 1, color: C },
    ],
    code: 'const inner = function() { return obj.data.length }',
    note: 'Closure inner criada no heap. Captura obj do escopo de outer — refs para heap[0] sobe para 2.',
  },
  {
    stack: [
      { name: 'inner()', vars: ['referência captura → obj'], color: C },
      { name: 'outer()', vars: ['retornou inner →'], color: BLUE },
    ],
    heap: [
      { id: 'heap0', label: '{data: Array(1000)}', refs: 1, color: BLUE },
      { id: 'heap1', label: 'closure: inner()', refs: 1, color: C },
    ],
    code: 'return inner  // outer retorna',
    note: 'outer() retorna inner. Frame de outer desempilhado, mas obj no heap ainda tem 1 ref: a closure inner!',
  },
  {
    stack: [{ name: 'main()', vars: ['const fn = inner →', '→ heap[1] (closure)'], color: AMB }],
    heap: [
      { id: 'heap0', label: '{data: Array(1000)}', refs: 1, color: BLUE },
      { id: 'heap1', label: 'closure: inner()', refs: 1, color: C },
    ],
    code: 'const fn = outer()  // fn segura a closure',
    note: 'fn no main() segura a closure. Enquanto fn existir, a closure existe. Enquanto a closure existir, obj no heap não pode ser coletado.',
  },
  {
    stack: [{ name: 'main()', vars: ['fn = null'], color: AMB }],
    heap: [
      { id: 'heap0', label: '{data: Array(1000)}', refs: 0, color: RED },
      { id: 'heap1', label: 'closure: inner()', refs: 0, color: RED },
    ],
    code: 'fn = null  // libera a referência',
    note: 'fn = null → closure sem refs → obj sem refs. GC pode coletar ambos. Memória liberada!',
  },
]

function StackHeapClosureVisual() {
  const [step, setStep] = useState(0)
  const current = MEM_STEPS[step]

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>Stack, Heap e Closures</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Veja como uma closure retém objetos no heap além do escopo da função</div>
      </div>

      {/* Código atual */}
      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: '8px 14px', marginBottom: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C }}>
        {'→ '}{current.code}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {/* Stack */}
        <div>
          <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Call Stack (LIFO)
          </div>
          <div style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, overflow: 'hidden', minHeight: 120 }}>
            {current.stack.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', fontSize: 10, color: '#334155' }}>vazia</div>
            ) : [...current.stack].reverse().map((frame, i) => (
              <div key={i} style={{
                padding: '8px 12px', borderBottom: `1px solid ${LINE}`,
                background: `${frame.color}10`, borderLeft: `3px solid ${frame.color}`,
              }}>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: frame.color, fontWeight: 700, marginBottom: 4 }}>{frame.name}</div>
                {frame.vars.map((v, j) => (
                  <div key={j} style={{ fontSize: 9, color: FGMUTE, lineHeight: 1.6 }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Heap */}
        <div>
          <div style={{ fontSize: 9, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Heap (GC gerenciado)
          </div>
          <div style={{ border: `1.5px solid ${LINE}`, borderRadius: 8, overflow: 'hidden', minHeight: 120 }}>
            {current.heap.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', fontSize: 10, color: '#334155' }}>vazio</div>
            ) : current.heap.map((obj) => (
              <div key={obj.id} style={{
                padding: '8px 12px', borderBottom: `1px solid ${LINE}`,
                background: obj.refs === 0 ? `${RED}10` : `${obj.color}10`,
                borderLeft: `3px solid ${obj.refs === 0 ? RED : obj.color}`,
              }}>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: obj.refs === 0 ? RED : obj.color, fontWeight: 700, marginBottom: 4 }}>{obj.label}</div>
                <div style={{ fontSize: 9, color: obj.refs === 0 ? RED : FGMUTE }}>
                  refs={obj.refs} {obj.refs === 0 ? '← coletar!' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nota */}
      <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: FG, lineHeight: 1.7 }}>
        <span style={{ fontWeight: 700, color: C }}>Passo {step + 1}/{MEM_STEPS.length}: </span>
        {current.note}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          style={{ background: CARD, border: `1.5px solid ${LINE}`, borderRadius: 6, color: FGMUTE, fontSize: 11, padding: '6px 16px', cursor: step === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: step === 0 ? 0.4 : 1 }}>
          ← Anterior
        </button>
        <button onClick={() => setStep(s => Math.min(MEM_STEPS.length - 1, s + 1))} disabled={step === MEM_STEPS.length - 1}
          style={{ background: step < MEM_STEPS.length - 1 ? `${C}20` : CARD, border: `1.5px solid ${step < MEM_STEPS.length - 1 ? C : LINE}`, borderRadius: 6, color: step < MEM_STEPS.length - 1 ? C : FGMUTE, fontSize: 11, padding: '6px 16px', cursor: step >= MEM_STEPS.length - 1 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: step >= MEM_STEPS.length - 1 ? 0.4 : 1 }}>
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
// VISUAL 5 — Progression Map — Do Iniciante ao Sênior em Memory
// ═══════════════════════════════════════════════════════════════════════════════

const MEM_LEVELS: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Iniciante',
    label: 'Iniciante',
    emoji: '🌱',
    concepts: [
      { name: 'Stack vs Heap', tip: 'Stack para frames de função; heap para objetos alocados dinamicamente' },
      { name: 'Garbage Collection existe', tip: 'JS tem GC automático — você não precisa liberar memória manualmente' },
      { name: 'Primitivos vs Objetos', tip: 'Primitivos na stack por valor; objetos no heap por referência' },
      { name: 'Stack overflow', tip: 'Recursão sem base case — stack enche e processo crasha' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '⚡',
    concepts: [
      { name: 'Leaks mais comuns', tip: 'Listeners, timers, caches sem LRU, DOM detached, closures' },
      { name: 'WeakMap / WeakRef', tip: 'Referências fracas que não impedem GC — use para cache por objeto' },
      { name: 'LRU Cache pattern', tip: 'Map mantém ordem de inserção — O(1) delete+set para promover' },
      { name: 'useEffect cleanup', tip: 'Retornar função de cleanup que remove listeners e cancela timers' },
      { name: 'Reachability', tip: 'GC coleta apenas objetos inalcançáveis a partir das roots' },
      { name: '3 Heap Snapshots', tip: 'Baseline → uso → mais uso. Comparison view mostra objetos crescentes' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '🎯',
    concepts: [
      { name: 'V8 GC Generacional', tip: 'Young space (Scavenger) + old space (Mark-Sweep-Compact). Hipótese: objetos morrem jovens' },
      { name: 'Concurrent Marking', tip: 'Orinoco: marking em background, sem Stop-the-World. Write barrier para novas refs' },
      { name: 'Object Pooling', tip: 'Reutilizar objetos em vez de criar/destruir. Reduz GC pressure em hot paths' },
      { name: 'Retainers analysis', tip: 'Retained Size e Retainers tree no DevTools — identifica quem impede GC' },
      { name: 'Buffer.allocUnsafe risks', tip: 'allocUnsafe sem fill completo pode vazar memória de processos anteriores' },
      { name: 'False sharing (cache line)', tip: '64 bytes por cache line — variáveis vizinhas invalidam o cache de outros threads' },
      { name: 'FinalizationRegistry', tip: 'Callback quando objeto é coletado — para limpar recursos externos' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Especialista',
    emoji: '🚀',
    concepts: [
      { name: 'Rust ownership model', tip: 'Zero GC, zero leaks via borrow checker em compile time. RAII automático' },
      { name: 'Reference counting + cycles', tip: 'Python usa refcount + cycle detector. Swift ARC com weak/unowned' },
      { name: 'Memory fragmentation', tip: 'Externa (espaços entre blocos) vs interna (blocos oversized). Compact resolve externa' },
      { name: 'Allocator tuning', tip: 'jemalloc/tcmalloc/mimalloc para reduzir fragmentação e contention em multi-thread' },
      { name: 'GC tuning flags', tip: '--max-old-space-size, --optimize-for-size, --expose-gc. Monitorar com perf_hooks gc observer' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function MemoryManagementVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'gc-generational',
      title: 'GC Generacional',
      subtitle: 'Objetos jovens morrem no young space; sobreviventes vão para old space',
      accent: C,
      component: <GCGenerationalVisual />,
    },
    {
      id: 'stack-heap-closures',
      title: 'Stack, Heap e Closures',
      subtitle: 'Como closures retêm objetos no heap além do escopo da função',
      accent: C,
      component: <StackHeapClosureVisual />,
    },
    {
      id: 'leak-antipatterns',
      title: 'Anti-patterns de Leak',
      subtitle: 'Os 4 padrões mais comuns de memory leak em JavaScript',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={LEAK_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
          label="Memory Leaks"
          heading="Anti-patterns que causam memory leak em JS/React"
          description="Padrões que parecem corretos mas prendem objetos no heap indefinidamente"
        />
      ),
    },
    {
      id: 'heap-snapshot',
      title: 'Heap Snapshot',
      subtitle: 'Como ler o DevTools Memory para identificar leaks',
      accent: C,
      component: <HeapSnapshotVisual />,
    },
    {
      id: 'progression',
      title: 'Jornada de Aprendizado',
      subtitle: 'Do iniciante ao especialista em memory management',
      accent: C,
      component: (
        <ProgressionMap
          levels={MEM_LEVELS}
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
