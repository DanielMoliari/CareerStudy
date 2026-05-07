'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta Qdrant ─────────────────────────────────────────────────────────────
const C   = '#ef4444'   // Qdrant red
const GRN = '#4ade80'
const AMB = '#f59e0b'
const SKY = '#38bdf8'
const PRP = '#a78bfa'
const BG  = '#0f172a'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Comparação: Qdrant vs pgvector vs Pinecone vs Weaviate
// ═══════════════════════════════════════════════════════════════════════════════

const VDB_OPTIONS: ComparisonOption[] = [
  { id: 'qdrant',    label: 'Qdrant',    color: C },
  { id: 'pgvector',  label: 'pgvector',  color: SKY },
  { id: 'pinecone',  label: 'Pinecone',  color: GRN },
  { id: 'weaviate',  label: 'Weaviate',  color: PRP },
]

const VDB_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'filtros',
    label: 'Filtros com recall alto',
    values: {
      qdrant:   { rating: 'excellent', note: 'Filterable HNSW nativo — recall alto mesmo com filtros seletivos' },
      pgvector: { rating: 'fair',      note: 'Filtros via SQL, mas HNSW não é filterable — recall pode cair' },
      pinecone: { rating: 'good',      note: 'Metadata filtering suportado, mas closed-source' },
      weaviate: { rating: 'good',      note: 'Filtros suportados, HNSW com filterable index' },
    },
  },
  {
    id: 'hybrid',
    label: 'Hybrid search nativo',
    values: {
      qdrant:   { rating: 'excellent', note: 'Dense + sparse + RRF nativos. Named vectors.' },
      pgvector: { rating: 'fair',      note: 'Requer extensão extra (pg_search) ou implementação manual' },
      pinecone: { rating: 'good',      note: 'Suporta sparse+dense, mas dependente de Pinecone' },
      weaviate: { rating: 'good',      note: 'BM25 + vector nativo, fusion suportada' },
    },
  },
  {
    id: 'quantizacao',
    label: 'Quantização vetorial',
    values: {
      qdrant:   { rating: 'excellent', note: 'int8, binary, PQ com rescoring — 4–32x menos RAM' },
      pgvector: { rating: 'poor',      note: 'Sem quantização — todos os vetores em float32' },
      pinecone: { rating: 'good',      note: 'Quantização interna gerenciada, opaca' },
      weaviate: { rating: 'fair',      note: 'PQ disponível mas com mais fricção de config' },
    },
  },
  {
    id: 'ops',
    label: 'Simplicidade operacional',
    values: {
      qdrant:   { rating: 'good',      note: 'Docker simples, binário Rust ~50MB. Qdrant Cloud disponível.' },
      pgvector: { rating: 'excellent', note: 'Extensão do Postgres — sem servidor adicional' },
      pinecone: { rating: 'excellent', note: '100% gerenciado — zero infra' },
      weaviate: { rating: 'fair',      note: 'Mais complexo de configurar e escalar' },
    },
  },
  {
    id: 'escala',
    label: 'Escala (> 10M vetores)',
    values: {
      qdrant:   { rating: 'excellent', note: 'Cluster nativo: sharding + replicação. Quantização reduz RAM.' },
      pgvector: { rating: 'fair',      note: 'Limitado pelo Postgres — difícil sharding horizontal' },
      pinecone: { rating: 'excellent', note: 'Gerenciado, escala horizontal automaticamente' },
      weaviate: { rating: 'good',      note: 'Cluster suportado, mais complexo' },
    },
  },
  {
    id: 'custo',
    label: 'Custo total',
    values: {
      qdrant:   { rating: 'good',      note: 'Open-source grátis. Cloud tem custo. Self-hosted = custo de infra.' },
      pgvector: { rating: 'excellent', note: 'Grátis, roda no Postgres existente — zero custo adicional' },
      pinecone: { rating: 'fair',      note: 'Vendor lock-in, custo por reads/writes pode ser alto' },
      weaviate: { rating: 'good',      note: 'Open-source grátis, Cloud pago' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Hybrid Search Sequence Diagram
// ═══════════════════════════════════════════════════════════════════════════════

const HS_ACTORS: SeqActor[] = [
  { id: 'app',    label: 'Aplicação',      color: SKY },
  { id: 'qdrant', label: 'Qdrant',         color: C },
  { id: 'hnsw',   label: 'HNSW Index',     color: GRN },
  { id: 'inv',    label: 'Inverted Index', color: AMB },
  { id: 'rrf',    label: 'RRF Fusion',     color: PRP },
]

const HS_MESSAGES: SeqMessage[] = [
  {
    from: 'app',
    to: 'qdrant',
    label: 'query(dense_vec, sparse_vec, filter, limit=10)',
    note: 'Named vectors: "dense" + "sparse"',
  },
  {
    from: 'qdrant',
    to: 'hnsw',
    label: 'search(dense_vec, filter, limit=20)',
    note: 'Filterable HNSW — só nós que passam no filtro',
  },
  {
    from: 'hnsw',
    to: 'qdrant',
    label: 'ranked_dense[20]',
    type: 'return' as const,
    note: 'Ranking por cosine similarity',
  },
  {
    from: 'qdrant',
    to: 'inv',
    label: 'search(sparse_vec, filter, limit=20)',
    note: 'BM25/SPLADE inverted index',
  },
  {
    from: 'inv',
    to: 'qdrant',
    label: 'ranked_sparse[20]',
    type: 'return' as const,
    note: 'Ranking por BM25 score',
  },
  {
    from: 'qdrant',
    to: 'rrf',
    label: 'fuse(ranked_dense, ranked_sparse)',
    note: 'score = Σ 1/(60 + rank_i)',
  },
  {
    from: 'rrf',
    to: 'qdrant',
    label: 'fused_ranking[10]',
    type: 'return' as const,
  },
  {
    from: 'qdrant',
    to: 'app',
    label: 'results[10] com payload',
    type: 'return' as const,
    note: 'Ranking híbrido final',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Layer Stack: arquitetura interna do Qdrant
// ═══════════════════════════════════════════════════════════════════════════════

const QDRANT_LAYERS: Layer[] = [
  {
    id: 'api',
    label: 'API Layer',
    sublabel: 'REST + gRPC',
    color: SKY,
    description: 'Endpoints para collections, points, search, scroll, snapshots. gRPC para alta throughput.',
    examples: ['PUT /collections', 'POST /points', 'POST /search', 'POST /scroll', 'POST /snapshots'],
  },
  {
    id: 'consensus',
    label: 'Cluster Consensus',
    sublabel: 'Raft — leader election',
    color: PRP,
    description: 'Raft consensus para coordenação de cluster. Eleição de líder de shard. write_consistency_factor.',
    examples: ['Shard leader election', 'Write consistency', 'Failover automático'],
  },
  {
    id: 'collection',
    label: 'Collection Manager',
    sublabel: 'Sharding + Replicação',
    color: AMB,
    description: 'Gerencia shards da collection. Distribui pontos via hash. Réplicas para HA.',
    examples: ['shard_number', 'replication_factor', 'Hash routing'],
  },
  {
    id: 'segment',
    label: 'Segment Engine',
    sublabel: 'Indexação e storage',
    color: GRN,
    description: 'Segmentos imutáveis + segmento mutável. Merge periódico. Payload storage separado de vector storage.',
    examples: ['HNSW index (dense)', 'Inverted index (sparse)', 'Payload index'],
  },
  {
    id: 'storage',
    label: 'Storage Backend',
    sublabel: 'Memmap + RocksDB',
    color: C,
    description: 'Vetores em memmap files (on_disk opcional). Payloads em RocksDB. Snapshots em tar.gz.',
    examples: ['Vector storage (mmap)', 'Payload (RocksDB)', 'WAL para durabilidade'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Filterable HNSW vs Pre/Post-filter (HTML diagram)
// ═══════════════════════════════════════════════════════════════════════════════

const FilterableHnswDiagram = () => (
  <div style={{ fontFamily: "'Space Grotesk', sans-serif", background: BG, borderRadius: 12, padding: 24, maxWidth: 680 }}>
    <div style={{ color: SKY, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
      Estratégias de busca vetorial com filtro
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
      {[
        { title: 'Pre-filter', color: '#ef4444', desc: 'Filtra antes → busca nos resultados', problem: 'Quebra o grafo HNSW — vizinhos podem ter sido removidos. Recall despenca.' },
        { title: 'Post-filter', color: '#f59e0b', desc: 'Busca k vizinhos → filtra resultados', problem: 'Pode retornar < k resultados. Filtro seletivo = problema.' },
        { title: 'Filterable HNSW', color: '#4ade80', desc: 'Grafo consciente do filtro — navega apenas nos nós válidos', problem: 'Recall alto. Retorna exatamente k.' },
      ].map(item => (
        <div key={item.title} style={{ background: '#1e293b', borderRadius: 8, padding: 12, borderTop: `3px solid ${item.color}` }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: item.color, marginBottom: 6 }}>{item.title}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{item.desc}</div>
          <div style={{ fontSize: 11, color: item.color === '#4ade80' ? '#4ade80' : '#ef4444' }}>{item.problem}</div>
        </div>
      ))}
    </div>
    <div style={{ background: '#1e293b', borderRadius: 8, padding: 12, fontSize: 12, color: '#94a3b8' }}>
      <span style={{ color: '#4ade80', fontWeight: 700 }}>Como Qdrant faz: </span>
      durante indexação HNSW, mantém subgrafos por segmentos de payload. Query com filtro traversa o subgrafo relevante.
      Para filtros muito seletivos (&lt;1% dos pontos), cai automaticamente para brute-force — mais rápido que grafo esparso.
    </div>
  </div>
)

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAIS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

const VISUALS: VisualDef[] = [
  {
    id: 'comparacao',
    title: 'Vector DBs Comparados',
    subtitle: 'Qdrant vs pgvector vs Pinecone vs Weaviate',
    accent: C,
    component: (
      <ComparisonTable
        options={VDB_OPTIONS}
        criteria={VDB_CRITERIA}
        accentColor={C}
        title="Qdrant vs pgvector vs Pinecone vs Weaviate"
      />
    ),
  },
  {
    id: 'filterable-hnsw',
    title: 'Filterable HNSW',
    subtitle: 'Por que pre/post-filter falham e como Qdrant resolve',
    accent: SKY,
    component: <FilterableHnswDiagram />,
  },
  {
    id: 'hybrid-search',
    title: 'Hybrid Search Flow',
    subtitle: 'Dense + Sparse → Reciprocal Rank Fusion',
    accent: PRP,
    component: (
      <SequenceDiagram
        actors={HS_ACTORS}
        messages={HS_MESSAGES}
        accentColor={C}
        bgColor={BG}
        title="Hybrid Search: Dense + Sparse → RRF"
      />
    ),
  },
  {
    id: 'arquitetura',
    title: 'Arquitetura Interna',
    subtitle: 'Camadas do Qdrant: API → Consensus → Segment → Storage',
    accent: GRN,
    component: (
      <LayerStack
        layers={QDRANT_LAYERS}
        accentColor={C}
        title="Qdrant — Camadas Internas"
        direction="top-down"
      />
    ),
  },
]

export default function QdrantVisuais() {
  const [active, setActive] = useState(0)
  return <VisuaisShell visuals={VISUALS} active={active} onChange={setActive} />
}
