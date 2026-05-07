'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { FlowDiagram } from '@/components/visuals/FlowDiagram'
import type { FlowNode, FlowEdge } from '@/components/visuals/FlowDiagram'

// ── Paleta EXPLAIN ANALYZE ────────────────────────────────────────────────────
const C      = '#5b9bd5'   // azul claro Postgres-tool
const C2     = '#336791'   // Postgres blue
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
const SKY    = '#38bdf8'
const MUTE   = '#475569'

void CARD2; void MUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Plan Reading Stepper (custom)
// Lê um plano real linha por linha, destacando o que cada campo significa
// ═══════════════════════════════════════════════════════════════════════════════

type PlanStep = {
  highlight: { line: number; chars: [number, number][] }[]
  title: string
  explanation: string
  diagnosis?: string
}

// Plano em texto fixo para destaque cirurgico
const PLAN_LINES = [
  'Hash Join  (cost=45.20..980.50 rows=4980 width=72)',
  '   (actual time=8.20..45.10 rows=4987 loops=1)',
  '   Buffers: shared hit=1240 read=4200',
  '   Hash Cond: (orders.user_id = users.id)',
  '   ->  Index Scan using idx_orders_status on orders',
  '         (cost=0.40..60.30 rows=1000 width=64)',
  '         (actual time=0.10..3.20 rows=998 loops=1)',
  '         Index Cond: (status = \'pago\')',
  '   ->  Seq Scan on users  (cost=0..800.0 rows=50000 width=64)',
  '         (actual time=0..180.40 rows=50000 loops=1)',
  '         Filter: (active = true)',
  '         Rows Removed by Filter: 47800',
]

const PLAN_STEPS: PlanStep[] = [
  {
    highlight: [{ line: 0, chars: [[0, 9]] }],
    title: '1. Tipo do nó — algoritmo escolhido',
    explanation: 'Hash Join: o planner construiu uma hash table do lado menor e fez probe com cada linha do outer. Outras possibilidades: Nested Loop, Merge Join, Seq Scan, Index Scan, Bitmap Heap Scan.',
    diagnosis: 'Hash Join é boa escolha para joins grandes sem ordenação prévia. Verifique os filhos para confirmar.',
  },
  {
    highlight: [{ line: 0, chars: [[12, 33]] }],
    title: '2. Cost estimado — startup..total',
    explanation: 'cost=45.20..980.50 — startup é o custo até retornar a primeira linha (alto em Hash Join porque precisa construir a hash table primeiro). Total é o custo até retornar todas as linhas. Unidades RELATIVAS — não milissegundos.',
    diagnosis: 'Cost só serve para comparar planos entre si. Para tempo real, precisa de ANALYZE.',
  },
  {
    highlight: [{ line: 0, chars: [[35, 45]] }],
    title: '3. Rows estimados pelo planner',
    explanation: 'rows=4980 — o planner estimou 4980 linhas baseado em estatísticas (pg_statistic). Compare com actual rows na próxima linha para detectar estatísticas desatualizadas.',
    diagnosis: 'Diferença > 10× entre estimado e real = rode VACUUM ANALYZE.',
  },
  {
    highlight: [{ line: 0, chars: [[46, 54]] }],
    title: '4. Width — bytes médios por linha',
    explanation: 'width=72 — tamanho médio em bytes de cada linha retornada por este nó. Útil para estimar memória necessária para Sort e Hash Join: rows × width = bytes a alocar em work_mem.',
    diagnosis: '4980 rows × 72 bytes = ~360KB. Se passar de work_mem, há spill para disco.',
  },
  {
    highlight: [{ line: 1, chars: [[3, 32]] }],
    title: '5. Actual time — startup..total real',
    explanation: 'actual time=8.20..45.10 — milissegundos reais. Só aparece com EXPLAIN ANALYZE. Compare com cost startup/total para sentir se as estimativas eram razoáveis. Tempo total da query = actual time do nó raiz.',
    diagnosis: '45ms total para Hash Join é razoável para 5000 linhas em ambos os lados.',
  },
  {
    highlight: [{ line: 1, chars: [[34, 44]] }],
    title: '6. Actual rows — realidade',
    explanation: 'actual rows=4987 — linhas REAIS que passaram por este nó. Compare com rows estimado (4980): praticamente igual = estatísticas saudáveis.',
    diagnosis: '4987 vs 4980 estimado — diferença < 1%. Estatísticas atualizadas.',
  },
  {
    highlight: [{ line: 1, chars: [[45, 53]] }],
    title: '7. Loops — quantas vezes o nó executou',
    explanation: 'loops=1 — este nó foi invocado uma vez. CRÍTICO em Nested Loops: o inner node pode ter loops=N onde N é o número de linhas do outer. actual time é POR LOOP — multiplique por loops para o custo total!',
    diagnosis: 'loops=1 aqui. Em Nested Loop, inner com time=0.5ms e loops=50000 = 25 segundos.',
  },
  {
    highlight: [{ line: 2, chars: [[3, 41]] }],
    title: '8. Buffers — cache hits vs leituras de disco',
    explanation: 'shared hit=1240 read=4200 — páginas de 8KB lidas. hit = veio do cache (rápido). read = veio do disco (lento). Hit ratio = 1240 / (1240 + 4200) = 23% — baixíssimo!',
    diagnosis: 'Hit ratio 23% indica dataset frio ou shared_buffers insuficiente. Em produção quente, hit ratio deve ser > 99%.',
  },
  {
    highlight: [{ line: 8, chars: [[7, 16]] }],
    title: '9. Filho 2: Seq Scan suspeito',
    explanation: 'Seq Scan on users (rows=50000) — leitura sequencial da tabela inteira. Pode ser bom (tabela pequena ou retorno > 15%) ou ruim (filtro seletivo sem índice).',
    diagnosis: 'Verifique a próxima linha — Filter + Rows Removed by Filter dirá se é Seq Scan evitável.',
  },
  {
    highlight: [{ line: 11, chars: [[9, 39]] }],
    title: '10. Rows Removed by Filter — sinal vermelho',
    explanation: 'Rows Removed by Filter: 47800 de 50000 lidas — 95.6% das linhas foram descartadas após leitura completa. Indica falta de índice na coluna do filtro.',
    diagnosis: 'CREATE INDEX ON users(active) WHERE active = true. Ou índice parcial. Depois VACUUM ANALYZE users.',
  },
]

function PlanReadingVisual() {
  const [step, setStep] = useState(0)
  const s = PLAN_STEPS[step]

  const isHighlighted = (lineIdx: number, charIdx: number) =>
    s.highlight.some(h => {
      if (h.line !== lineIdx) return false
      return h.chars.some(([a, b]) => charIdx >= a && charIdx < b)
    })

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 22, fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Plano com highlight */}
      <div style={{
        background: '#0d1117', border: `1px solid ${LINE}`, borderRadius: 8,
        padding: 16, marginBottom: 16, fontSize: 12, lineHeight: 1.9,
        fontFamily: "'JetBrains Mono', monospace", overflowX: 'auto',
      }}>
        {PLAN_LINES.map((line, li) => (
          <div key={li} style={{ whiteSpace: 'pre' }}>
            {line.split('').map((ch, ci) => (
              <span key={ci} style={{
                color: isHighlighted(li, ci) ? '#0f172a' : (li % 2 === 1 ? FGMUTE : FG),
                background: isHighlighted(li, ci) ? `${C}` : 'transparent',
                fontWeight: isHighlighted(li, ci) ? 700 : 400,
                borderRadius: isHighlighted(li, ci) ? 2 : 0,
                padding: isHighlighted(li, ci) ? '2px 0' : 0,
                transition: 'all .15s',
              }}>
                {ch}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Explicação */}
      <div style={{ background: CARD, borderRadius: 10, padding: 18, marginBottom: 14, border: `1.5px solid ${C}40` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C }}>{s.title}</div>
          <div style={{ fontSize: 11, color: FGMUTE, fontFamily: "'JetBrains Mono', monospace" }}>
            passo {step + 1} / {PLAN_STEPS.length}
          </div>
        </div>
        <div style={{ fontSize: 13, color: FG, lineHeight: 1.7, marginBottom: s.diagnosis ? 12 : 0 }}>
          {s.explanation}
        </div>
        {s.diagnosis && (
          <div style={{
            background: BG, borderRadius: 6, padding: 10,
            borderLeft: `3px solid ${AMB}`,
            fontSize: 12, color: FG, lineHeight: 1.6,
          }}>
            <strong style={{ color: AMB }}>Diagnóstico: </strong>{s.diagnosis}
          </div>
        )}
      </div>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setStep(p => Math.max(0, p - 1))}
          disabled={step === 0}
          style={{
            background: 'transparent', border: `1.5px solid ${LINE}`, borderRadius: 6,
            color: step > 0 ? FG : MUTE, fontSize: 12, padding: '8px 16px',
            cursor: step > 0 ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
            opacity: step > 0 ? 1 : 0.4,
          }}
        >
          {'<- anterior'}
        </button>
        <button
          onClick={() => setStep(p => Math.min(PLAN_STEPS.length - 1, p + 1))}
          disabled={step === PLAN_STEPS.length - 1}
          style={{
            background: step < PLAN_STEPS.length - 1 ? `${C}25` : 'transparent',
            border: `1.5px solid ${step < PLAN_STEPS.length - 1 ? C : LINE}`, borderRadius: 6,
            color: step < PLAN_STEPS.length - 1 ? C : MUTE, fontSize: 12, padding: '8px 16px',
            cursor: step < PLAN_STEPS.length - 1 ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
            fontWeight: 600,
          }}
        >
          {'próximo passo ->'}
        </button>
        <button
          onClick={() => setStep(0)}
          style={{
            background: 'transparent', border: `1.5px solid ${LINE}`, borderRadius: 6,
            color: FGMUTE, fontSize: 12, padding: '8px 14px',
            cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto',
          }}
        >
          resetar
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Tipos de nó (CardCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const NODE_TYPE_CARDS: CarouselCard[] = [
  {
    name: 'Seq Scan',
    signature: 'Seq Scan on tabela (cost=0..N rows=M)',
    emoji: '📜',
    color: RED,
    use: [
      'Tabelas pequenas (< 1000 linhas) — sem ganho de índice',
      'Queries que retornam > 15% das linhas — I/O sequencial é eficiente',
      'Sem índice na coluna do filtro (caso a corrigir, geralmente)',
    ],
    dontUse: 'Tabela grande com Filter removendo > 90% das linhas. Sinal: falta índice ou estatísticas erradas que impedem o planner de usar índice existente.',
    difficulty: 1,
  },
  {
    name: 'Index Scan',
    signature: 'Index Scan using idx_x on tabela (cost=0.4..N)',
    emoji: '🎯',
    color: GRN,
    use: [
      'Filtros seletivos (< 5% das linhas) — caminho feliz',
      'Igualdade simples ou range pequeno na coluna indexada',
      'ORDER BY na coluna do índice — entrega ordenado',
    ],
    dontUse: 'Correlação baixa (dados fisicamente espalhados) + muitas linhas — Index Scan pode ter mais I/O aleatório que Seq Scan sequencial.',
    difficulty: 1,
  },
  {
    name: 'Index Only Scan',
    signature: 'Index Only Scan using idx_inc on tabela (...)',
    emoji: '🚀',
    color: '#34d399',
    use: [
      'TODAS colunas no SELECT e WHERE estão no índice (chave + INCLUDE)',
      'Visibility map atualizado (VACUUM recente)',
      'Caminho mais rápido possível — sem acesso à heap',
    ],
    dontUse: 'Visibility map desatualizado (linhas marcadas dirty no índice) — degrada para Index Scan. Rode VACUUM regularmente em tabelas com muitos UPDATEs.',
    difficulty: 2,
  },
  {
    name: 'Bitmap Heap Scan',
    signature: 'Bitmap Heap Scan on tabela + Bitmap Index Scan',
    emoji: '🗺️',
    color: SKY,
    use: [
      'Múltiplos índices combinados (BitmapAnd / BitmapOr)',
      'Quantidade média de linhas (5-20%) — entre Index Scan e Seq Scan',
      'Reduz I/O aleatório ao ordenar TIDs por bloco físico',
    ],
    dontUse: 'work_mem insuficiente — Bitmap fica "lossy" e precisa Recheck Cond na heap (custo extra). Aumente work_mem para a sessão.',
    difficulty: 2,
  },
  {
    name: 'Nested Loop',
    signature: 'Nested Loop  ->  inner com loops=N',
    emoji: '🔁',
    color: AMB,
    use: [
      'Outer pequeno (poucas linhas)',
      'Inner com Index Scan rápido na join condition',
      'OLTP com FK indexada — caminho ideal',
    ],
    dontUse: 'Outer com muitas linhas + inner sem índice = N × custo_inner. Catastrófico. inner com loops=50000 e time=2ms = 100 segundos reais. Crie índice na join condition.',
    difficulty: 2,
  },
  {
    name: 'Hash Join',
    signature: 'Hash Join + Hash (Buckets/Batches)',
    emoji: '#️⃣',
    color: PRP,
    use: [
      'Joins grandes sem ordenação prévia — OLAP típico',
      'Igualdade na join condition (não suporta range/desigualdade)',
      'Paralelizável — Parallel Hash Join em Postgres 11+',
    ],
    dontUse: 'Hash table não cabe em work_mem — Batches > 1 = spill para disco (temp files). Aumente work_mem para a sessão. Inadequado para queries com LIMIT pequeno (alto startup cost).',
    difficulty: 2,
  },
  {
    name: 'Merge Join',
    signature: 'Merge Join — ambos inputs ordenados',
    emoji: '🤝',
    color: '#34d399',
    use: [
      'Ambos inputs já ordenados pela join key (Index Scan + Index Scan)',
      'Tabelas grandes com índice na join column',
      'Range joins (poucos algoritmos suportam)',
    ],
    dontUse: 'Inputs precisam ser ordenados via Sort explícito caro — pode piorar o plano total. O planner geralmente prefere Hash Join nesse caso.',
    difficulty: 3,
  },
  {
    name: 'Gather / Gather Merge',
    signature: 'Gather Workers Planned: 2 / Workers Launched: 2',
    emoji: '⚡',
    color: SKY,
    use: [
      'Tabelas grandes (> 8MB) — paralelismo ativado por padrão',
      'Operações CPU-bound (filter complexo, agregação)',
      'Gather Merge mantém ordenação dos workers',
    ],
    dontUse: 'Tabelas pequenas — overhead de comunicação supera ganho. Configurações: max_parallel_workers_per_gather = 2 default. Aumente se CPUs ociosas.',
    difficulty: 3,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Decisão de JOIN: qual algoritmo o planner escolhe?
// ═══════════════════════════════════════════════════════════════════════════════

const JOIN_ROOT: DTNode = {
  id: 'start',
  question: 'A condição de join é igualdade (=)?',
  children: [
    { label: 'Sim — equijoin', nodeId: 'eq', color: GRN },
    { label: 'Não — range/desigualdade', nodeId: 'non-eq', color: AMB },
  ],
}

const JOIN_NODES: Record<string, DTNode> = {
  'non-eq': {
    id: 'non-eq',
    recommendation: 'Nested Loop',
    detail: 'Hash Join e Merge Join exigem igualdade. Para non-equijoin (e.g. ON a.x BETWEEN b.lo AND b.hi, ou a.x > b.y), o planner usa Nested Loop. Performance depende criticamente do índice no inner. Range joins podem se beneficiar de tipos especializados (tsrange, daterange + GiST).',
    color: AMB,
    icon: '🔁',
  },
  'eq': {
    id: 'eq',
    question: 'O outer (lado esquerdo) tem MUITAS linhas?',
    children: [
      { label: 'Não — poucas linhas', nodeId: 'small-outer', color: GRN },
      { label: 'Sim — muitas linhas', nodeId: 'big-outer', color: AMB },
    ],
  },
  'small-outer': {
    id: 'small-outer',
    question: 'O inner tem índice na join condition?',
    children: [
      { label: 'Sim', nodeId: 'nested-loop-good', color: GRN },
      { label: 'Não', nodeId: 'hash-join-small', color: SKY },
    ],
  },
  'nested-loop-good': {
    id: 'nested-loop-good',
    recommendation: 'Nested Loop',
    detail: 'Outer pequeno + inner indexado = caminho ideal. Cada linha do outer faz Index Scan rápido (~0.1ms) no inner. Total: N_outer × time_inner. OLTP típico com FK indexada. Startup cost baixíssimo — boa escolha para LIMIT também.',
    color: GRN,
    icon: '🎯',
  },
  'hash-join-small': {
    id: 'hash-join-small',
    recommendation: 'Hash Join (criar índice no inner!)',
    detail: 'Sem índice no inner, cada loop vira Seq Scan completo. O planner provavelmente escolherá Hash Join — constrói hash do inner (mesmo sem índice) e faz probe. Solução de longo prazo: CREATE INDEX no inner para permitir Nested Loop.',
    color: SKY,
    icon: '#️⃣',
  },
  'big-outer': {
    id: 'big-outer',
    question: 'Ambos os lados já estão ordenados pela join key?',
    children: [
      { label: 'Sim — Index Scan ambos', nodeId: 'merge-join', color: '#34d399' },
      { label: 'Não — apenas filtros', nodeId: 'hash-join-big', color: PRP },
    ],
  },
  'merge-join': {
    id: 'merge-join',
    recommendation: 'Merge Join',
    detail: 'Quando ambos os lados já estão ordenados pela mesma chave (Index Scan no índice apropriado), o Merge Join percorre os dois em paralelo como zíper. Zero overhead de hash, ótimo para tabelas grandes. Custo: O(N + M). Range joins também podem usar.',
    color: '#34d399',
    icon: '🤝',
  },
  'hash-join-big': {
    id: 'hash-join-big',
    recommendation: 'Hash Join',
    detail: 'Outer grande + sem ordenação = Hash Join é a escolha do planner. Constrói hash do menor lado em work_mem, faz probe com o maior. Cuidado: se o lado menor não cabe em work_mem, há spill (Batches > 1) — temp files no disco. SET work_mem = "256MB" para a sessão de queries grandes.',
    color: PRP,
    icon: '#️⃣',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Diagnostic Flow (FlowDiagram)
// O fluxo "vejo X no plano, faço Y" — recipe book de diagnóstico
// ═══════════════════════════════════════════════════════════════════════════════

const DIAG_NODES: FlowNode[] = [
  { id: 'start',     label: 'Query lenta',   sublabel: 'Identificada via pg_stat_statements', color: C, shape: 'circle', tooltip: 'Sempre comece com pg_stat_statements para encontrar a query de maior impacto (calls × mean_time). EXPLAIN sozinho otimiza a query errada.' },
  { id: 'explain',   label: 'EXPLAIN ANALYZE', sublabel: '+ BUFFERS, + FORMAT JSON', color: C, tooltip: 'EXPLAIN (ANALYZE, BUFFERS) — sempre os dois. ANALYZE traz tempos reais; BUFFERS revela cache hit ratio. Para DML: BEGIN; ... ROLLBACK;' },

  { id: 'seq',       label: 'Seq Scan + Filter', sublabel: 'Rows Removed alto?', color: RED, tooltip: 'Seq Scan com Rows Removed by Filter > 90% indica falta de índice ou planner ignorando índice por estatísticas erradas.' },
  { id: 'rows-bad',  label: 'Rows ≠ Actual', sublabel: 'Diferença > 10×?', color: AMB, tooltip: 'rows estimado vs actual rows divergente significa que o planner trabalha com estatísticas desatualizadas — escolhe planos subótimos.' },
  { id: 'nested',    label: 'Nested Loop',   sublabel: 'inner loops alto?', color: AMB, tooltip: 'inner com loops=N e time alto = N × time_loop = catástrofe. Cada loop é uma chamada ao inner.' },
  { id: 'hash',      label: 'Hash Join',     sublabel: 'Batches > 1?', color: PRP, tooltip: 'Batches > 1 significa spill para disco — work_mem insuficiente. Buffers: temp read/written confirmam I/O em arquivo temporário.' },
  { id: 'cache',     label: 'Buffers',       sublabel: 'shared read >> hit?', color: SKY, tooltip: 'Hit ratio < 99% indica que o working set não cabe em shared_buffers. Aumente shared_buffers ou aceite latência maior.' },

  { id: 'fix-idx',   label: 'CREATE INDEX', sublabel: 'B-Tree, parcial ou INCLUDE', color: GRN, tooltip: 'Para igualdade simples: B-Tree. Para filtros constantes: WHERE no índice (parcial). Para Index Only Scan: INCLUDE de colunas extras. Sempre VACUUM ANALYZE depois.' },
  { id: 'fix-stat',  label: 'VACUUM ANALYZE', sublabel: '+ CREATE STATISTICS', color: GRN, tooltip: 'VACUUM ANALYZE atualiza pg_statistic. Para correlação entre colunas (WHERE a=X AND b=Y), CREATE STATISTICS (dependencies, mcv).' },
  { id: 'fix-join',  label: 'Index na join key', sublabel: 'Inner do Nested Loop', color: GRN, tooltip: 'Inner sem índice + outer grande = catástrofe. CREATE INDEX na coluna do JOIN ON. Pode mudar plano para Hash Join automaticamente também.' },
  { id: 'fix-mem',   label: 'SET work_mem', sublabel: 'Por sessão, não global', color: GRN, tooltip: 'SET work_mem = "256MB" antes da query. Cuidado: work_mem × max_connections × hashes_por_query pode exceder RAM. Por sessão é seguro.' },
  { id: 'fix-buf',   label: 'shared_buffers', sublabel: 'ou cache warming', color: SKY, tooltip: 'Aumente shared_buffers (recomendação 25% RAM). Para working sets cíclicos, considere pg_prewarm para aquecer cache após restart.' },

  { id: 'verify',    label: 'Re-EXPLAIN',     sublabel: 'Validar a melhoria',   color: C, tooltip: 'Sempre re-execute EXPLAIN ANALYZE para confirmar que a otimização funcionou. cost menor + actual time menor + Buffers melhor.' },
]

const DIAG_EDGES: FlowEdge[] = [
  { from: 'start',   to: 'explain' },
  { from: 'explain', to: 'seq',     label: 'sintoma 1' },
  { from: 'explain', to: 'rows-bad', label: 'sintoma 2' },
  { from: 'explain', to: 'nested',  label: 'sintoma 3' },
  { from: 'explain', to: 'hash',    label: 'sintoma 4' },
  { from: 'explain', to: 'cache',   label: 'sintoma 5' },

  { from: 'seq',      to: 'fix-idx',  color: GRN },
  { from: 'rows-bad', to: 'fix-stat', color: GRN },
  { from: 'nested',   to: 'fix-join', color: GRN },
  { from: 'hash',     to: 'fix-mem',  color: GRN },
  { from: 'cache',    to: 'fix-buf',  color: SKY },

  { from: 'fix-idx',  to: 'verify' },
  { from: 'fix-stat', to: 'verify' },
  { from: 'fix-join', to: 'verify' },
  { from: 'fix-mem',  to: 'verify' },
  { from: 'fix-buf',  to: 'verify' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Buffers (custom)
// shared hit / shared read / dirtied — visualização das camadas de cache
// ═══════════════════════════════════════════════════════════════════════════════

type BufferScenario = {
  id: string
  label: string
  sharedHit: number
  sharedRead: number
  sharedDirtied: number
  tempRead: number
  tempWritten: number
  desc: string
}

const BUFFER_SCENARIOS: BufferScenario[] = [
  {
    id: 'hot',
    label: 'Cache quente (saudável)',
    sharedHit: 9850, sharedRead: 50, sharedDirtied: 0, tempRead: 0, tempWritten: 0,
    desc: 'Hit ratio 99.5%. Working set inteiro em shared_buffers. Latência consistente — query roda em ms previsíveis. Estado ideal de produção quente.',
  },
  {
    id: 'cold',
    label: 'Cache frio (após restart)',
    sharedHit: 200, sharedRead: 9800, sharedDirtied: 0, tempRead: 0, tempWritten: 0,
    desc: 'Hit ratio 2%. Cada página vem do disco — random I/O. Em SSD: ~10× mais lento. Em HDD: 100× mais lento. Use pg_prewarm para aquecer cache após restart.',
  },
  {
    id: 'spill',
    label: 'Hash spill para disco',
    sharedHit: 5000, sharedRead: 1200, sharedDirtied: 0, tempRead: 8000, tempWritten: 8000,
    desc: 'temp read/written altos = spill em Hash Join ou Sort. work_mem insuficiente. Cada GB de temp file = ~1 segundo de I/O extra. SET work_mem = "256MB" para a sessão.',
  },
  {
    id: 'write',
    label: 'UPDATE com dirty pages',
    sharedHit: 8000, sharedRead: 100, sharedDirtied: 2400, tempRead: 0, tempWritten: 0,
    desc: 'shared_dirtied = páginas modificadas (UPDATE/DELETE). Vão para WAL e eventualmente para o checkpoint. Em pico de escrita, checkpoints podem causar latência se mal configurados.',
  },
]

function BuffersVisual() {
  const [idx, setIdx] = useState(0)
  const sc = BUFFER_SCENARIOS[idx]
  const total = sc.sharedHit + sc.sharedRead
  const hitPct = total > 0 ? (sc.sharedHit / total) * 100 : 0

  const Block = ({ label, value, color, desc }: { label: string; value: number; color: string; desc: string }) => (
    <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1.5px solid ${color}40` }}>
      <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.5 }}>{desc}</div>
    </div>
  )

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 22, fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Cenários */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {BUFFER_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            style={{
              flex: 1, padding: '10px 6px', borderRadius: 8, cursor: 'pointer',
              background: idx === i ? `${C}25` : CARD,
              border: `1.5px solid ${idx === i ? C : LINE}`,
              color: idx === i ? C : FGMUTE, fontSize: 11, fontWeight: 600,
              textAlign: 'center', transition: 'all .15s', fontFamily: 'inherit',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Hit ratio destaque */}
      <div style={{ background: CARD, borderRadius: 12, padding: 18, marginBottom: 14, border: `1.5px solid ${hitPct > 95 ? GRN : hitPct > 50 ? AMB : RED}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Hit Ratio (cache em memória)</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: hitPct > 95 ? GRN : hitPct > 50 ? AMB : RED, fontFamily: "'JetBrains Mono', monospace" }}>
              {hitPct.toFixed(1)}%
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>Avaliação</div>
            <div style={{ fontSize: 13, color: hitPct > 95 ? GRN : hitPct > 50 ? AMB : RED, fontWeight: 700 }}>
              {hitPct > 99 ? 'Excelente' : hitPct > 95 ? 'Saudável' : hitPct > 50 ? 'Investigar' : 'Crítico'}
            </div>
          </div>
        </div>

        {/* Barra hit/read */}
        <div style={{ height: 14, background: BG, borderRadius: 7, display: 'flex', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${hitPct}%`, background: GRN, transition: 'width .3s' }} />
          <div style={{ height: '100%', width: `${100 - hitPct}%`, background: RED, transition: 'width .3s' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: FGMUTE }}>
          <span style={{ color: GRN }}>● shared hit (cache)</span>
          <span style={{ color: RED }}>● shared read (disco) ●</span>
        </div>
      </div>

      {/* Detalhes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
        <Block label="shared hit" value={sc.sharedHit} color={GRN} desc="páginas 8KB lidas do cache em memória" />
        <Block label="shared read" value={sc.sharedRead} color={RED} desc="páginas lidas do disco (cache miss)" />
        <Block label="shared dirtied" value={sc.sharedDirtied} color={AMB} desc="páginas modificadas (UPDATE/DELETE)" />
        <Block label="temp read+written" value={sc.tempRead + sc.tempWritten} color={PRP} desc="spill para arquivo temporário" />
      </div>

      {/* Análise */}
      <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}`, fontSize: 12, color: FG, lineHeight: 1.7 }}>
        <strong style={{ color: C }}>Análise: </strong>{sc.desc}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Estimated vs Actual Rows (custom)
// Como statisticas erradas levam a planos terríveis
// ═══════════════════════════════════════════════════════════════════════════════

type StatScenario = {
  id: string
  label: string
  estimated: number
  actual: number
  planChosen: string
  planExplanation: string
  betterPlan?: string
  fix: string
  color: string
}

const STAT_SCENARIOS: StatScenario[] = [
  {
    id: 'aligned',
    label: 'Estatísticas alinhadas',
    estimated: 1000, actual: 998,
    planChosen: 'Hash Join (correto)',
    planExplanation: 'Diferença < 1%. Planner escolhe o plano otimizado para 1000 linhas — Hash Join é apropriado para esse volume sem ordenação prévia.',
    fix: 'Estatísticas saudáveis. VACUUM ANALYZE no schedule normal mantém assim.',
    color: GRN,
  },
  {
    id: 'underestimate',
    label: 'Subestimou drasticamente',
    estimated: 100, actual: 98_420,
    planChosen: 'Nested Loop (catastrófico)',
    planExplanation: 'Planner viu 100 linhas no outer e escolheu Nested Loop com inner indexado — ótimo para 100. Mas o real é 98.420 linhas → 98.420 × tempo_inner = minutos de execução.',
    betterPlan: 'Hash Join — mais rápido para volumes grandes',
    fix: 'VACUUM ANALYZE imediato. Considere ALTER TABLE ALTER COLUMN col SET STATISTICS 1000 para colunas críticas.',
    color: RED,
  },
  {
    id: 'overestimate',
    label: 'Superestimou',
    estimated: 50_000, actual: 80,
    planChosen: 'Hash Join (overhead)',
    planExplanation: 'Planner achou que viriam 50k linhas e escolheu Hash Join — startup cost alto (constrói hash table). Mas só vieram 80 linhas — Nested Loop teria sido instantâneo.',
    betterPlan: 'Nested Loop com Index Scan — startup zero',
    fix: 'VACUUM ANALYZE atualiza. Para correlação entre colunas: CREATE STATISTICS s_correl (dependencies, mcv) ON col1, col2.',
    color: AMB,
  },
  {
    id: 'correlation',
    label: 'Correlação ignorada',
    estimated: 10, actual: 5_000,
    planChosen: 'Nested Loop (subestimou junção)',
    planExplanation: 'Filtros WHERE status="ativo" AND regiao="SP" — cada um seletivo isoladamente. Planner multiplica seletividades assumindo independência: 0.05 × 0.02 = 0.001. Mas eles são correlacionados (clientes ativos quase todos em SP).',
    betterPlan: 'Hash Join com estimativa correta',
    fix: 'CREATE STATISTICS s_status_regiao (dependencies, mcv) ON status, regiao FROM tabela; ANALYZE tabela. Postgres 10+ aprende sobre correlações entre colunas.',
    color: PRP,
  },
]

function StatsMismatchVisual() {
  const [idx, setIdx] = useState(0)
  const sc = STAT_SCENARIOS[idx]

  const ratio = sc.actual / sc.estimated
  const ratioBad = ratio < 0.5 || ratio > 2

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString()

  return (
    <div style={{ background: BG, borderRadius: 12, padding: 22, fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Cenários */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {STAT_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            style={{
              flex: 1, padding: '10px 6px', borderRadius: 8, cursor: 'pointer',
              background: idx === i ? `${s.color}25` : CARD,
              border: `1.5px solid ${idx === i ? s.color : LINE}`,
              color: idx === i ? s.color : FGMUTE, fontSize: 11, fontWeight: 600,
              textAlign: 'center', transition: 'all .15s', fontFamily: 'inherit',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Comparação rows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}`, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Estimated rows</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: SKY, fontFamily: "'JetBrains Mono', monospace" }}>
            {fmt(sc.estimated)}
          </div>
          <div style={{ fontSize: 10, color: FGMUTE, marginTop: 4 }}>o que o planner achou</div>
        </div>
        <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1.5px solid ${ratioBad ? RED : GRN}`, textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: FGMUTE, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Actual rows</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: ratioBad ? RED : GRN, fontFamily: "'JetBrains Mono', monospace" }}>
            {fmt(sc.actual)}
          </div>
          <div style={{ fontSize: 10, color: FGMUTE, marginTop: 4 }}>realidade do executor</div>
        </div>
      </div>

      {/* Ratio destacado */}
      <div style={{ background: CARD, borderRadius: 10, padding: 14, marginBottom: 14, border: `1px solid ${LINE}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 11, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.06em' }}>diferença</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: ratioBad ? RED : GRN, fontFamily: "'JetBrains Mono', monospace" }}>
            {ratio < 1 ? `${(1 / ratio).toFixed(1)}× MENOR` : `${ratio.toFixed(1)}× MAIOR`}
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: ratioBad ? RED : GRN, fontWeight: 700 }}>
            {ratioBad ? '🚨 ESTATÍSTICAS ERRADAS' : '✓ alinhado'}
          </div>
        </div>
      </div>

      {/* Plano + correção */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${LINE}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: sc.color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Plano escolhido
          </div>
          <div style={{ fontSize: 13, color: FG, fontWeight: 700, marginBottom: 6 }}>{sc.planChosen}</div>
          <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.6 }}>{sc.planExplanation}</div>
          {sc.betterPlan && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${LINE}`, fontSize: 11, color: GRN }}>
              <strong>Melhor plano: </strong>{sc.betterPlan}
            </div>
          )}
        </div>
        <div style={{ background: CARD, borderRadius: 10, padding: 14, border: `1px solid ${GRN}40` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: GRN, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Correção
          </div>
          <div style={{ fontSize: 12, color: FG, lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace" }}>
            {sc.fix}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns de leitura de plano (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const PLAN_READING_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Comparar cost (unidade) com tempo (ms)',
    wrong: [
      [{ text: '-- "cost de 1000 = 1 segundo, certo?"', color: '#64748b' }],
      [{ text: 'EXPLAIN SELECT * FROM ...;', color: '#e2e8f0' }],
      [{ text: '-- Hash Join (cost=45..980)', color: '#ef4444' }],
      [{ text: '-- conclui: "vai levar ~1s"  <- ERRADO', color: '#ef4444' }],
    ],
    right: [
      [{ text: '-- cost é unidade RELATIVA, não ms', color: '#64748b' }],
      [{ text: 'EXPLAIN ANALYZE SELECT * FROM ...;', color: '#22c55e' }],
      [{ text: '-- Hash Join (cost=45..980)', color: '#e2e8f0' }],
      [{ text: '-- (actual time=8.2..45.10 rows=4987)', color: '#22c55e' }],
      [{ text: '-- tempo real: 45ms — só ANALYZE revela', color: '#64748b' }],
    ],
    why: 'Cost é unidade relativa baseada em seq_page_cost, random_page_cost e parâmetros de CPU. Não é milissegundo — só serve para comparar planos entre si. cost=1000 pode significar 1ms ou 10s dependendo do hardware. Sempre EXPLAIN ANALYZE para tempo real.',
  },
  {
    title: 'Esquecer de multiplicar actual time × loops',
    wrong: [
      [{ text: '-- Inner do Nested Loop:', color: '#64748b' }],
      [{ text: '-> Index Scan on pedidos', color: '#e2e8f0' }],
      [{ text: '   (actual time=0.2..0.5 rows=20 loops=1)', color: '#ef4444' }],
      [{ text: '-- "0.5ms é rapidíssimo!"  <- ERRADO se loops=10000', color: '#ef4444' }],
    ],
    right: [
      [{ text: '-- O MESMO inner com loops alto:', color: '#64748b' }],
      [{ text: '-> Index Scan on pedidos', color: '#e2e8f0' }],
      [{ text: '   (actual time=0.2..0.5 rows=20 loops=10000)', color: '#22c55e' }],
      [{ text: '-- 0.5ms × 10000 loops = 5 segundos', color: '#64748b' }],
      [{ text: '-- O CUSTO REAL é time × loops sempre', color: '#22c55e' }],
    ],
    why: 'actual time é POR LOOP. Em Nested Loop, o inner pode ter time aparentemente baixo mas loops=N alto — multiplique para o tempo real. Um nó com time=0.5ms e loops=50000 = 25 segundos de execução. Erro de leitura mais comum no EXPLAIN.',
  },
  {
    title: 'EXPLAIN ANALYZE em DELETE sem transação',
    wrong: [
      [{ text: 'EXPLAIN ANALYZE DELETE FROM sessoes', color: '#ef4444' }],
      [{ text: 'WHERE expira_em < now();', color: '#ef4444' }],
      [{ text: '-- DELETOU DE VERDADE!', color: '#ef4444' }],
    ],
    right: [
      [{ text: 'BEGIN;', color: '#22c55e' }],
      [{ text: 'EXPLAIN ANALYZE DELETE FROM sessoes', color: '#e2e8f0' }],
      [{ text: 'WHERE expira_em < now();', color: '#e2e8f0' }],
      [{ text: 'ROLLBACK;  -- desfaz a operação', color: '#22c55e' }],
    ],
    why: 'EXPLAIN ANALYZE executa a query — em DELETE, UPDATE e INSERT, isso significa modificar dados de verdade. Sempre envolva DML em BEGIN; ... ROLLBACK; para testar com segurança. Para SELECT é seguro mesmo sem transação.',
  },
  {
    title: 'Otimizar a query errada (ignorar pg_stat_statements)',
    wrong: [
      [{ text: '-- Vejo essa query lenta no log:', color: '#64748b' }],
      [{ text: 'SELECT * FROM relatorio_mensal();  -- 500ms', color: '#ef4444' }],
      [{ text: '-- Otimiza ela. Mas quantas vezes ela roda?', color: '#64748b' }],
      [{ text: '-- 1× por dia. Total: 500ms/dia.', color: '#ef4444' }],
    ],
    right: [
      [{ text: '-- pg_stat_statements revela impacto real:', color: '#64748b' }],
      [{ text: 'SELECT query, calls, total_exec_time', color: '#22c55e' }],
      [{ text: 'FROM pg_stat_statements', color: '#22c55e' }],
      [{ text: 'ORDER BY total_exec_time DESC LIMIT 10;', color: '#22c55e' }],
      [{ text: '-- Top: SELECT user — 10ms × 100k calls = 1000s/dia', color: '#64748b' }],
      [{ text: '-- Esse é o que importa otimizar', color: '#22c55e' }],
    ],
    why: 'EXPLAIN ANALYZE diagnostica uma query isolada. pg_stat_statements revela impacto agregado (calls × mean_time). Sem ele, você otimiza a que mais aparece no log mas não a que mais custa. Sempre comece por pg_stat_statements para priorizar — depois EXPLAIN ANALYZE para diagnosticar.',
  },
  {
    title: 'Não rodar VACUUM ANALYZE após criar índice',
    wrong: [
      [{ text: 'CREATE INDEX ON pedidos(status);', color: '#e2e8f0' }],
      [{ text: 'EXPLAIN SELECT * FROM pedidos', color: '#e2e8f0' }],
      [{ text: " WHERE status = 'pago';", color: '#e2e8f0' }],
      [{ text: '-- Seq Scan ainda?! Por quê?!', color: '#ef4444' }],
    ],
    right: [
      [{ text: 'CREATE INDEX ON pedidos(status);', color: '#e2e8f0' }],
      [{ text: 'VACUUM ANALYZE pedidos;  -- atualiza pg_statistic', color: '#22c55e' }],
      [{ text: 'EXPLAIN SELECT * FROM pedidos', color: '#e2e8f0' }],
      [{ text: " WHERE status = 'pago';", color: '#e2e8f0' }],
      [{ text: '-- Index Scan using pedidos_status_idx ✓', color: '#22c55e' }],
    ],
    why: 'O planner usa pg_statistic para decidir entre índice e Seq Scan. Após criar índice, as estatísticas precisam refletir a presença dele — VACUUM ANALYZE atualiza. Sem isso, o planner pode continuar escolhendo Seq Scan por desconhecimento das novas estatísticas do índice.',
  },
  {
    title: 'Aumentar work_mem globalmente sem cálculo',
    wrong: [
      [{ text: '# postgresql.conf:', color: '#64748b' }],
      [{ text: 'work_mem = 1GB  # "para ninguém spillar mais"', color: '#ef4444' }],
      [{ text: 'max_connections = 200', color: '#e2e8f0' }],
      [{ text: '# 1GB × 200 × 3 hashes = 600GB!', color: '#ef4444' }],
      [{ text: '# OOM em horário de pico — banco trava', color: '#ef4444' }],
    ],
    right: [
      [{ text: '# Global conservador:', color: '#64748b' }],
      [{ text: 'work_mem = 16MB  # padrão sensato', color: '#22c55e' }],
      [{ text: '# Por sessão para queries específicas:', color: '#64748b' }],
      [{ text: "SET work_mem = '256MB';", color: '#22c55e' }],
      [{ text: 'EXPLAIN ANALYZE SELECT ...;', color: '#e2e8f0' }],
      [{ text: '-- Após query, volta ao padrão da conexão', color: '#64748b' }],
    ],
    why: 'work_mem × max_connections × hashes_por_query é o consumo MÁXIMO possível. Aumentar globalmente pode causar OOM em pico. Aumente por sessão (SET) para queries específicas. Para sessões frequentes problema, use ALTER USER ... SET ou ALTER DATABASE ... SET para isolar o aumento.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function ExplainAnalyzeVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'plan-reading',
      title: 'Lendo um plano passo a passo',
      subtitle: 'Os 10 campos críticos de cada nó EXPLAIN — destacados em ordem de leitura',
      accent: C,
      component: <PlanReadingVisual />,
    },
    {
      id: 'node-types',
      title: 'Tipos de nó',
      subtitle: 'Seq Scan, Index Scan, Bitmap, Nested Loop, Hash Join, Merge Join — quando cada aparece',
      accent: C,
      component: (
        <CardCarousel
          cards={NODE_TYPE_CARDS}
          accentColor={C}
          bgColor={BG}
          useLabel="Quando aparece (caminho ideal)"
          dontUseLabel="Antipattern / quando investigar"
          difficultyIcon="●"
        />
      ),
    },
    {
      id: 'join-decision',
      title: 'Qual JOIN o planner escolhe?',
      subtitle: 'Árvore de decisão: igualdade, tamanho do outer, ordenação prévia, índice no inner',
      accent: C,
      component: (
        <DecisionTree
          root={JOIN_ROOT}
          nodes={JOIN_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'diagnostic-flow',
      title: 'Fluxo de diagnóstico',
      subtitle: 'Sintomas comuns no plano e a correção canônica para cada um',
      accent: C,
      component: (
        <FlowDiagram
          nodes={DIAG_NODES}
          edges={DIAG_EDGES}
          accentColor={C}
          bgColor={BG}
          title="Recipe book — vejo X, faço Y"
          description="Cada sintoma do EXPLAIN ANALYZE tem uma correção canônica. Hover nos nós para detalhes."
          layout="LR"
        />
      ),
    },
    {
      id: 'buffers',
      title: 'Buffers — cache vs disco',
      subtitle: 'shared hit / read / dirtied / temp — interpretando hit ratio em cenários reais',
      accent: C,
      component: <BuffersVisual />,
    },
    {
      id: 'stats-mismatch',
      title: 'Estimated vs Actual rows',
      subtitle: 'O sinal mais importante — quando o planner trabalha com estatísticas erradas',
      accent: C,
      component: <StatsMismatchVisual />,
    },
    {
      id: 'antipatterns',
      title: 'Antipatterns de leitura',
      subtitle: 'Cost vs ms, esquecer loops, DELETE sem ROLLBACK, ignorar pg_stat_statements, work_mem global',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={PLAN_READING_ANTIPATTERNS}
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
