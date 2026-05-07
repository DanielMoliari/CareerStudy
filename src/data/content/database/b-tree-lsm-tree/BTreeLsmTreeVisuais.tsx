'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta B-Tree / LSM-Tree ──────────────────────────────────────────────────
const C      = '#4169E1'   // Postgres blue
const LSM    = '#DC382D'   // Cassandra/Redis red
const BG     = '#0f172a'
const CARD   = '#1e293b'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Comparativo B-Tree vs LSM-Tree (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const STRUCT_OPTIONS: ComparisonOption[] = [
  { id: 'btree', label: 'B-Tree',   sublabel: 'Postgres, MySQL InnoDB, SQLite', color: C   },
  { id: 'lsm',   label: 'LSM-Tree', sublabel: 'RocksDB, Cassandra, LevelDB',   color: LSM },
]

const STRUCT_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'write',
    label: 'Write latência',
    category: 'Performance',
    description: 'Custo de inserção e atualização',
    values: {
      btree: { rating: 'fair',      note: 'Random I/O — navega árvore até folha, modifica in-place, rebalanceia' },
      lsm:   { rating: 'excellent', note: 'Sequencial — escreve em memtable (RAM), flush para SSTable depois' },
    },
  },
  {
    id: 'read-point',
    label: 'Leitura pontual (WHERE id = X)',
    category: 'Performance',
    description: 'Busca de uma chave específica',
    values: {
      btree: { rating: 'excellent', note: 'O(log n) — 1 caminho da raiz à folha, sempre previsível' },
      lsm:   { rating: 'good',      note: 'Bloom filter + SSTables recentes — bom, mas pode checar múltiplos arquivos' },
    },
  },
  {
    id: 'range',
    label: 'Range scan (BETWEEN, ORDER BY)',
    category: 'Performance',
    description: 'Varrer um intervalo de chaves',
    values: {
      btree: { rating: 'excellent', note: 'Folhas doubly-linked — scan linear após encontrar o início do range' },
      lsm:   { rating: 'fair',      note: 'Múltiplas SSTables precisam ser mescladas — merge sort em runtime' },
    },
  },
  {
    id: 'write-amp',
    label: 'Write amplification',
    category: 'Overhead',
    description: 'Quantas vezes o dado é escrito em disco',
    values: {
      btree: { rating: 'good',      note: '2-5x — dado + metadados de índice' },
      lsm:   { rating: 'poor',      note: '10-30x (leveled) — memtable + flush + compactação em cada nível' },
    },
  },
  {
    id: 'space',
    label: 'Uso de espaço em disco',
    category: 'Overhead',
    description: 'Fragmentação e espaço desperdiçado',
    values: {
      btree: { rating: 'good',      note: 'Fragmentação com tempo (bloat) — VACUUM/reindex necessários' },
      lsm:   { rating: 'fair',      note: 'Write amplification + tombstones acumulados antes de compactação' },
    },
  },
  {
    id: 'ssd',
    label: 'Desempenho em SSD/NVMe',
    category: 'Hardware',
    description: 'Como cada estrutura se comporta em SSD vs HDD',
    values: {
      btree: { rating: 'good',      note: 'SSD reduz penalidade do random I/O — melhor que em HDD' },
      lsm:   { rating: 'excellent', note: 'Sequencial ainda vence random em NVMe, mas gap menor que em HDD' },
    },
  },
  {
    id: 'compaction',
    label: 'Background overhead',
    category: 'Operacional',
    description: 'Trabalho em background necessário',
    values: {
      btree: { rating: 'excellent', note: 'Minimal — rebalanceamento por insert, VACUUM periódico' },
      lsm:   { rating: 'fair',      note: 'Compactação contínua — pode competir com queries em carga alta' },
    },
  },
  {
    id: 'use-case',
    label: 'Caso de uso ideal',
    category: 'Decisão',
    description: 'Quando cada estrutura é a escolha certa',
    values: {
      btree: { rating: 'excellent', note: 'OLTP, leitura heavy, range queries, relatórios, ACID forte' },
      lsm:   { rating: 'excellent', note: 'Write-heavy, time-series, IoT, logs, eventos, métricas' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Como funciona o LSM-Tree (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

function MemtableViz({ keys }: { keys: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ fontSize: 10, color: FGMUTE, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Memtable (sorted map em RAM)</div>
      {keys.map((k, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 8,
            background: CARD,
            border: `1px solid ${LSM}`,
            borderRadius: 5,
            padding: '6px 10px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
        >
          <span style={{ color: LSM, fontWeight: 700, minWidth: 60 }}>{k.split(':')[0]}</span>
          <span style={{ color: FGMUTE }}>{k.split(':')[1]}</span>
        </div>
      ))}
    </div>
  )
}

function SStableViz({ keys, level, opacity = 1 }: { keys: string[]; level: string; opacity?: number }) {
  return (
    <div style={{ opacity }}>
      <div style={{ fontSize: 10, color: LSM, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{level}</div>
      <div style={{ background: CARD, border: `1px solid ${LSM}`, borderRadius: 5, padding: '8px 10px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: FGMUTE }}>
          {keys.join('  |  ')}
        </div>
      </div>
    </div>
  )
}

const LSM_SLIDES: Slide[] = [
  {
    title: 'Escrita — vai para a memtable',
    paragraphs: [
      'Todo write no LSM-Tree vai primeiro para a memtable — uma estrutura ordenada em RAM (skiplist ou red-black tree). Escrita é O(1) amortizado porque é in-memory.',
      'Para durabilidade, o write também é appendado no WAL (Write-Ahead Log) em disco, de forma sequencial. Se crashar, o WAL é replayed para reconstruir a memtable.',
      'Resultado: latência de escrita extremamente baixa — apenas RAM + append sequencial no WAL, sem random I/O.',
    ],
    gradient: ['rgba(220,56,45,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <MemtableViz
        keys={[
          'user:1000: Alice',
          'user:1005: Bob',
          'user:1010: Carol',
          'user:1020: Dave',
        ]}
      />
    ),
  },
  {
    title: 'Flush — memtable vira SSTable imutável',
    paragraphs: [
      'Quando a memtable atinge o tamanho máximo, ela é "flushed" para disco como uma SSTable (Sorted String Table) — um arquivo imutável com as chaves ordenadas.',
      'Imutabilidade é a propriedade central: SSTables nunca são modificadas. Novos writes criam novas SSTables. Isso elimina locking complexo e facilita compressão e replicação.',
      'Cada SSTable tem um Bloom filter associado — uma estrutura em memória que responde "essa chave definitivamente não está aqui" sem abrir o arquivo.',
    ],
    gradient: ['rgba(220,56,45,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SStableViz keys={['user:1000 Alice', 'user:1005 Bob', 'user:1010 Carol', 'user:1020 Dave']} level="SSTable L0 (flush da memtable)" />
        <SStableViz keys={['event:100 view', 'event:101 click', 'event:105 view']} level="SSTable L0 (flush anterior)" opacity={0.7} />
      </div>
    ),
  },
  {
    title: 'Compactação — mescla e ordena SSTables',
    paragraphs: [
      'Com o tempo, múltiplas SSTables se acumulam nos níveis. A compactação mescla SSTables de forma ordenada (merge sort), eliminando versões antigas e tombstones (marcadores de delete).',
      'Size-tiered (Cassandra): mescla SSTables de tamanho similar — menos write amplification, mais read amplification.',
      'Leveled (RocksDB): mantém L(n+1) 10x maior que L(n) — mais write amplification (~30x) mas read amplification muito menor (poucas SSTables por nível).',
    ],
    gradient: ['rgba(245,158,11,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SStableViz keys={['e:100 view', 'u:1000 Alice', 'u:1010 Carol']} level="L0 (recente)" />
        <div style={{ textAlign: 'center', color: AMB, fontSize: 14 }}>↓ compacta</div>
        <SStableViz keys={['e:100 view', 'e:101 click', 'u:1000 Alice', 'u:1005 Bob', 'u:1010 Carol', 'u:1020 Dave']} level="L1 (compactado, ordenado)" />
      </div>
    ),
  },
  {
    title: 'Leitura — memtable → SSTables → Bloom filter',
    paragraphs: [
      'Para ler uma chave: (1) verifica memtable — se está lá, retorna imediatamente. (2) Para cada SSTable do mais recente ao mais antigo: primeiro consulta o Bloom filter. Se diz "definitivamente não está aqui", pula o SSTable sem I/O.',
      'Bloom filter garante zero false negatives — "não está" é 100% certo. Isso transforma read miss de O(n SSTables) para O(1) na maioria dos casos.',
      'Se o Bloom filter diz "pode estar", faz binary search no índice da SSTable e lê o bloco. Retorna a primeira versão encontrada (a mais recente).',
    ],
    gradient: ['rgba(167,139,250,0.18)', 'rgba(15,23,42,0.95)'],
    illustration: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { step: '1', label: 'memtable', note: 'não está aqui', color: FGMUTE },
          { step: '2', label: 'Bloom filter L0', note: '"definitivamente não está" → SKIP', color: PRP },
          { step: '3', label: 'Bloom filter L1', note: '"pode estar" → binary search...', color: AMB },
          { step: '4', label: 'SSTable L1', note: '→ encontrou user:1000 = Alice ✓', color: GRN },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              background: CARD,
              border: `1px solid ${s.color}`,
              borderRadius: 5,
              padding: '6px 10px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
            }}
          >
            <span style={{ color: s.color, fontWeight: 700, minWidth: 16 }}>{s.step}</span>
            <span style={{ color: FG, minWidth: 120 }}>{s.label}</span>
            <span style={{ color: s.color }}>{s.note}</span>
          </div>
        ))}
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Árvore de decisão: B-Tree vs LSM (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

// DTNode uses: { id, question?, recommendation?, detail?, children?: [{label, nodeId, color?}], color?, icon? }

const DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'Qual é o padrão de acesso dominante do sistema?',
  children: [
    { label: 'Escrita intensiva (logs, eventos, IoT, métricas)', nodeId: 'write-heavy', color: LSM },
    { label: 'Leitura dominante (OLTP, relatórios, range queries)', nodeId: 'read-heavy', color: C },
    { label: 'Mixed — escrita e leitura equilibradas', nodeId: 'mixed', color: AMB },
  ],
}

const DECISION_NODES_MAP: Record<string, DTNode> = {
  'write-heavy': {
    id: 'write-heavy',
    question: 'É time-series, IoT ou append-only sem updates?',
    children: [
      { label: 'Sim — writes dominam fortemente', nodeId: 'lsm-pure', color: LSM },
      { label: 'Não — leitura também importa', nodeId: 'lsm-balanced', color: AMB },
    ],
  },
  'lsm-pure': {
    id: 'lsm-pure',
    recommendation: 'LSM-Tree — Cassandra ou RocksDB',
    detail: 'Cassandra para distribuído, RocksDB embarcado. Size-tiered compaction para maximizar write throughput. Bloom filters para mitigar read latência.',
    color: LSM,
  },
  'lsm-balanced': {
    id: 'lsm-balanced',
    recommendation: 'LSM-Tree com Leveled Compaction',
    detail: 'RocksDB com leveled compaction: write throughput alto + read amplification controlado. Block cache para SSTables quentes. Bits-per-key no Bloom filter ajustado.',
    color: LSM,
  },
  'read-heavy': {
    id: 'read-heavy',
    question: 'Precisa de range scan eficiente (ORDER BY, BETWEEN)?',
    children: [
      { label: 'Sim — range queries são críticos', nodeId: 'btree-range', color: C },
      { label: 'Só lookups pontuais (WHERE id = X)', nodeId: 'btree-point', color: C },
    ],
  },
  'btree-range': {
    id: 'btree-range',
    recommendation: 'B-Tree — PostgreSQL',
    detail: 'B+ Tree com folhas doubly-linked é ideal para range scans. Postgres em NVMe SSD performa muito bem. FILLFACTOR 80-90 para tabelas com muitos UPDATEs.',
    color: C,
  },
  'btree-point': {
    id: 'btree-point',
    recommendation: 'B-Tree — PostgreSQL ou MySQL',
    detail: 'B-Tree O(log n) para lookups pontuais. Hash index tem O(1) mas sem range scan — raramente vale a pena. Shared_buffers deve cobrir os índices mais usados.',
    color: C,
  },
  'mixed': {
    id: 'mixed',
    question: 'Os dados têm natureza temporal (time-series)?',
    children: [
      { label: 'Sim — dados crescem por tempo', nodeId: 'timescale', color: AMB },
      { label: 'Não — padrão de acesso genérico', nodeId: 'btree-default', color: C },
    ],
  },
  'timescale': {
    id: 'timescale',
    recommendation: 'TimescaleDB (Postgres + hypertables)',
    detail: 'Postgres com extensão TimescaleDB: hypertables particionadas por tempo, B-Tree dentro de cada partição, compressão automática de chunks antigos. Melhor dos dois mundos.',
    color: AMB,
  },
  'btree-default': {
    id: 'btree-default',
    recommendation: 'B-Tree — PostgreSQL',
    detail: 'Para workload misto genérico, B-Tree com índices bem escolhidos costuma ser a escolha mais segura. Monitorar n_tup_hot_upd para garantir HOT updates em tabelas de alta escrita.',
    color: C,
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Jornada do iniciante ao sênior (ProgressionMap)
// ═══════════════════════════════════════════════════════════════════════════════

const BTLSM_LEVELS: ProgressionLevel[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    label: 'Conceitos fundamentais',
    emoji: 'IN',
    concepts: [
      { name: 'O que é um índice',               tip: 'Estrutura que acelera buscas sem varrer a tabela inteira' },
      { name: 'B-Tree básico',                   tip: 'Árvore balanceada com O(log n) para busca — Postgres usa B+ Tree' },
      { name: 'B+ Tree vs B-Tree',               tip: 'B+ Tree: dados só nas folhas, folhas linkadas — melhor range scan' },
      { name: 'O que é LSM-Tree',                tip: 'Log-Structured Merge Tree — escreve sequencialmente, compacta depois' },
      { name: 'Memtable e SSTable',              tip: 'Memtable: escrita em RAM. SSTable: flush para disco imutável' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Tradeoffs e escolhas',
    emoji: 'PL',
    concepts: [
      { name: 'Write amplification',             tip: 'B-Tree: 2-5x. LSM leveled: 10-30x. O dado é escrito múltiplas vezes.' },
      { name: 'Read amplification',              tip: 'LSM precisa verificar múltiplas SSTables — Bloom filter mitiga' },
      { name: 'Bloom filter',                    tip: 'Zero false negatives — "não está" é certo. Skip SSTable sem I/O.' },
      { name: 'Size-tiered vs leveled',          tip: 'Size-tiered: menos write amp. Leveled: menos read amp.' },
      { name: 'Quando usar cada estrutura',      tip: 'B-Tree: OLTP/range. LSM: write-heavy/time-series.' },
      { name: 'Tombstones em LSM',               tip: 'Delete insere tombstone — dado real removido na compactação' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Tuning e arquitetura',
    emoji: 'SR',
    concepts: [
      { name: 'FILLFACTOR e HOT updates',        tip: 'FILLFACTOR < 100 deixa espaço para HOT updates sem index write' },
      { name: 'Block cache em LSM',              tip: 'RocksDB block cache: SSTables quentes em RAM — mitiga read amp' },
      { name: 'Bits per key no Bloom filter',    tip: '10 bits/chave = 1% FP rate. 20 bits = 0.01%. Trade RAM vs I/O.' },
      { name: 'WAL + durabilidade LSM',          tip: 'Memtable + WAL — WAL é replayed no crash para reconstruir memtable' },
      { name: 'RocksDB como storage engine',     tip: 'Base de TiKV, MyRocks, CockroachDB Pebble, YugabyteDB' },
      { name: 'SSD vs HDD — mudança de cálculo', tip: 'NVMe: random I/O penalidade menor → B-Tree competitive em SSD' },
      { name: 'Write throughput benchmarks',     tip: 'LSM pode atingir 1M+ inserts/s para writes sequenciais' },
      { name: 'Compaction lag monitoring',       tip: 'RocksDB: compaction.pending_bytes, Cassandra: compaction metrics' },
      { name: 'TimescaleDB como meio-termo',     tip: 'Postgres + hypertables particionadas por tempo — B-Tree com particionamento' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function BTreeLsmTreeVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'comparison',
      title: 'Comparativo completo',
      subtitle: 'B-Tree vs LSM-Tree — write, read, range scan, overhead, casos de uso',
      accent: C,
      component: (
        <ComparisonTable
          options={STRUCT_OPTIONS}
          criteria={STRUCT_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'lsm-walkthrough',
      title: 'LSM-Tree por dentro',
      subtitle: 'Escrita → memtable → flush → compactação → leitura com Bloom filter',
      accent: LSM,
      component: (
        <ConceptCarousel
          slides={LSM_SLIDES}
          accentColor={LSM}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'decision',
      title: 'Árvore de decisão',
      subtitle: 'Qual estrutura escolher para cada workload',
      accent: AMB,
      component: (
        <DecisionTree
          root={DECISION_ROOT}
          nodes={DECISION_NODES_MAP}
          accentColor={AMB}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Jornada — iniciante ao sênior',
      subtitle: 'Conceitos por nível — do índice básico ao tuning de compactação',
      accent: GRN,
      component: (
        <ProgressionMap
          levels={BTLSM_LEVELS}
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
