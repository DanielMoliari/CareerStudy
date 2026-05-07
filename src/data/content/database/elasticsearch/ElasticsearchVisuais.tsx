'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage } from '@/components/visuals/SequenceDiagram'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ConceptCarousel } from '@/components/visuals/ConceptCarousel'
import type { Slide } from '@/components/visuals/ConceptCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'

// ── Paleta Elasticsearch ──────────────────────────────────────────────────────
const C      = '#FEC514'   // Elasticsearch yellow
const BG     = '#0f172a'
const CARD   = '#1e293b'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const RED    = '#ef4444'
const MUTE   = '#475569'
const FG     = '#e2e8f0'
const C2     = '#00bfb3'   // Elastic teal

void CARD; void FG; void AMB; void C2

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Inverted Index Anatomy (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const INDEX_LAYERS: Layer[] = [
  {
    id: 'query-phase',
    label: 'Query Phase — Busca & Score',
    sublabel: 'Coordinating node distribui query para todos os shards relevantes',
    color: C,
    description: 'O coordinating node envia a query para todos os shards primários (ou réplicas). Cada shard executa a busca localmente e retorna os top-N doc IDs com scores. O coordinating node agrega, reordena e busca _source dos documentos selecionados.',
    examples: [
      'Cada shard retorna top-N scores parciais — não os documentos completos',
      'Merge global: reordena os top-N de todos os shards por score BM25',
      'Segundo round-trip para buscar _source dos documentos selecionados',
      'explain: true mostra cálculo de BM25 por campo e por shard',
    ],
  },
  {
    id: 'bm25',
    label: 'BM25 Score — Relevância',
    sublabel: 'TF saturation (k1=1.2) + field length normalization (b=0.75)',
    color: PRP,
    description: 'BM25 melhora TF-IDF com saturação de frequência (k1) e normalização por comprimento do documento (b). "redis" em título curto recebe score maior que em artigo longo. Boost por campo multiplica o score.',
    examples: [
      'k1=1.2: satura o ganho de frequência — 1000 ocorrências não vale 1000× mais que 1',
      'b=0.75: normaliza por tamanho — "redis" em título de 3 palavras > em artigo de 10.000',
      'multi_match com fields: ["title^3", "body"] — título vale 3× mais',
      'function_score adiciona sinais externos: freshness, popularidade',
    ],
  },
  {
    id: 'inverted-index',
    label: 'Inverted Index — Core do Lucene',
    sublabel: 'Termo → posting list (doc IDs + frequências + posições)',
    color: SKY,
    description: 'Para cada termo do corpus, o inverted index mapeia para a posting list: lista de documentos que contêm o termo, com frequência e posições. Busca full-text em O(1) para termos exatos. Intersecção de posting lists para queries multi-termo.',
    examples: [
      '"redis" → [doc1(freq:3, pos:[5,12,34]), doc7(freq:1, pos:[2])]',
      '"cache" → [doc1(freq:2), doc3(freq:5), doc9(freq:1)]',
      'query "redis cache" → intersecção das duas posting lists',
      'Skip lists aceleram merge de posting lists grandes',
    ],
  },
  {
    id: 'analyzer',
    label: 'Analyzer Pipeline',
    sublabel: 'Char filter → Tokenizer → Token filter',
    color: GRN,
    description: 'O texto passa pelo analyzer antes de entrar no inverted index. O mesmo analyzer DEVE ser usado na busca — inconsistência causa miss de resultados. Teste com a API _analyze antes de indexar.',
    examples: [
      'standard: lowercase + tokeniza por whitespace/pontuação',
      '"Redis in Action" → ["redis", "in", "action"] → sem "in" (stop) → ["redis", "action"]',
      'portuguese stemmer: "correndo" → "corr"',
      'POST /index/_analyze {"analyzer": "my_analyzer", "text": "Redis"} — debug',
    ],
  },
  {
    id: 'mapping',
    label: 'Mapping — Schema do Índice',
    sublabel: 'text (analisado) vs keyword (raw) — defina ANTES de indexar',
    color: RED,
    description: 'O mapping define como cada campo é indexado. text passa pelo analyzer — para busca full-text. keyword não é analisado — para filtros exatos, sort e aggregations. Multi-field: mesmo campo como text E .keyword.',
    examples: [
      '"title": {"type": "text", "analyzer": "portuguese"} — busca full-text',
      '"status": {"type": "keyword"} — filtro exato e terms agg',
      'Multi-field: "title.keyword" para sort e aggregation exata',
      'dynamic: false → ES rejeita campos não mapeados explicitamente',
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Bool Query (ComparisonTable com rating correto)
// ═══════════════════════════════════════════════════════════════════════════════

const QUERY_OPTIONS: ComparisonOption[] = [
  { id: 'must',     label: 'must',     color: RED },
  { id: 'filter',   label: 'filter',   color: GRN },
  { id: 'should',   label: 'should',   color: AMB },
  { id: 'must_not', label: 'must_not', color: MUTE },
]

const QUERY_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'obrigatorio',
    label: 'Documento DEVE satisfazer?',
    values: {
      must:     { rating: 'excellent', note: 'Sim — obrigatório para aparecer nos resultados' },
      filter:   { rating: 'excellent', note: 'Sim — obrigatório, sem contribuição ao score' },
      should:   { rating: 'poor',      note: 'Não — opcional, boost se satisfaz' },
      must_not: { rating: 'excellent', note: 'Sim — documento NÃO deve satisfazer' },
    },
  },
  {
    id: 'score',
    label: 'Afeta o score de relevância?',
    values: {
      must:     { rating: 'excellent', note: 'Sim — contribui para score BM25' },
      filter:   { rating: 'poor',      note: 'Não — resultado binário (match/no match)' },
      should:   { rating: 'excellent', note: 'Sim — aumenta score se satisfaz' },
      must_not: { rating: 'poor',      note: 'Não — apenas exclusão, sem score' },
    },
  },
  {
    id: 'cache',
    label: 'Cacheado pelo bitset cache?',
    values: {
      must:     { rating: 'poor',      note: 'Não — recalcula BM25 a cada query' },
      filter:   { rating: 'excellent', note: 'Sim — bitset cacheado, 5-10× mais rápido' },
      should:   { rating: 'poor',      note: 'Não — recalcula score' },
      must_not: { rating: 'good',      note: 'Pode ser cacheado como bitset de exclusão' },
    },
  },
  {
    id: 'usecase',
    label: 'Quando usar',
    values: {
      must:     { rating: 'excellent', note: 'Termos de busca do usuário — relevância importa' },
      filter:   { rating: 'excellent', note: 'Status, data, categoria, flags — filtros binários' },
      should:   { rating: 'good',      note: 'Boost por campo extra: tags, sinônimos' },
      must_not: { rating: 'good',      note: 'Excluir: status=deleted, categoria=spam' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Indexação Flow (SequenceDiagram — tipos corretos)
// ═══════════════════════════════════════════════════════════════════════════════

const INDEX_ACTORS: SeqActor[] = [
  { id: 'client',   label: 'Client',              color: SKY },
  { id: 'coord',    label: 'Coordinating\nNode',  color: C },
  { id: 'primary',  label: 'Primary Shard',        color: RED },
  { id: 'replica',  label: 'Replica Shard',        color: GRN },
]

const INDEX_MESSAGES: SeqMessage[] = [
  { from: 'client',  to: 'coord',   label: 'PUT /index/_doc/1 {JSON document}' },
  { from: 'coord',   to: 'primary', label: 'hash(_id) % shards → Primary P1' },
  { from: 'primary', to: 'primary', label: 'Escreve no memory buffer + translog', type: 'async' },
  { from: 'primary', to: 'replica', label: 'Replica sync (paralelo)', type: 'async' },
  { from: 'replica', to: 'primary', label: 'ACK confirmado', type: 'return' },
  { from: 'primary', to: 'coord',   label: 'OK — quórum de réplicas confirmou', type: 'return' },
  { from: 'coord',   to: 'client',  label: '201 Created {_id, _seq_no, _primary_term}', type: 'return' },
  { from: 'primary', to: 'primary', label: 'refresh (1s) → buffer vira segmento Lucene', type: 'async' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — ILM Lifecycle (DecisionTree)
// ═══════════════════════════════════════════════════════════════════════════════

const ILM_ROOT: DTNode = {
  id: 'root',
  question: 'Qual é o padrão de acesso dos seus dados?',
  children: [
    { label: 'Logs / métricas — dados time-series com crescimento contínuo', nodeId: 'time-series' },
    { label: 'Dados de negócio — documentos que são atualizados', nodeId: 'business-data' },
    { label: 'Search index — conteúdo relativamente estático', nodeId: 'search-static' },
  ],
}

const ILM_NODES: Record<string, DTNode> = {
  'time-series': {
    id: 'time-series',
    question: 'Precisa de consultas históricas por quanto tempo?',
    children: [
      { label: '30 dias ativos + 90 dias arquivo + delete', nodeId: 'ilm-full' },
      { label: 'Apenas dados recentes (7-30 dias)', nodeId: 'ilm-simple' },
    ],
  },
  'ilm-full': {
    id: 'ilm-full',
    recommendation: 'ILM com 4 fases: hot → warm → cold → delete',
    detail: 'hot: escrita intensa, SSD, rollover por tamanho (50GB) ou idade (1 dia). warm: apenas leitura, forcemerge para 1 segmento, réplica opcional removida. cold: searchable snapshots em object storage (S3). delete: expiração automática após 90 dias.',
  },
  'ilm-simple': {
    id: 'ilm-simple',
    recommendation: 'ILM com 2 fases: hot → delete',
    detail: 'Rollover diário com delete após 7-30 dias. Data Streams como abstração — backing indices gerenciados automaticamente. Alias único para escrita e leitura de todos os backing indices históricos.',
  },
  'business-data': {
    id: 'business-data',
    recommendation: 'Índice regular sem ILM',
    detail: 'Use índice único ou versões (my_index_v1, v2). Alias para zero-downtime reindex. ILM não se aplica bem a dados que são atualizados — requer append-only. Defina shard count com cuidado: 20-50GB por shard como regra geral.',
  },
  'search-static': {
    id: 'search-static',
    question: 'Precisa de reindex periódico?',
    children: [
      { label: 'Sim — rebuild noturno ou on-demand (mudança de mapping)', nodeId: 'alias-swap' },
      { label: 'Não — índice estável com updates incrementais', nodeId: 'single-index' },
    ],
  },
  'alias-swap': {
    id: 'alias-swap',
    recommendation: 'Blue/Green com aliases',
    detail: 'Mantenha dois índices: current (v1) e next (v2). Rebuild em v2 em background. Swap atômico do alias: remove de v1, adiciona em v2 — zero-downtime. Permite rollback instantâneo revertendo o alias para v1.',
  },
  'single-index': {
    id: 'single-index',
    recommendation: 'Índice único com updates via _update/_bulk',
    detail: 'Use optimistic concurrency control com _seq_no + _primary_term para updates seguros. Define mapping completo antes de indexar qualquer dado. Defina number_of_shards baseado no volume esperado (20-50GB por shard).',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Aggregations Pipeline (ConceptCarousel)
// ═══════════════════════════════════════════════════════════════════════════════

const AGG_SLIDES: Slide[] = [
  {
    title: 'Bucket Aggregations',
    paragraphs: [
      'terms: agrupa por valor exato de campo keyword — top categorias, status, tags',
      'date_histogram: agrupa por intervalo de tempo — eventos por hora/dia/semana',
      'range: grupos por faixas numéricas — produtos por faixa de preço',
      'geo_distance: grupos por distância de um ponto geográfico',
    ],
    gradient: [C, '#7a5e00'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.8, padding: 12 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>// Vendas por categoria</div>
        <div>{'{'}<span style={{ color: C }}>"aggs"</span>: {'{'}</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: SKY }}>"por_cat"</span>: {'{'}</div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: GRN }}>"terms"</span>: {'{'}</div>
        <div style={{ paddingLeft: 36 }}><span style={{ color: FG }}>"field"</span>: <span style={{ color: C }}>"category.keyword"</span>,</div>
        <div style={{ paddingLeft: 36 }}><span style={{ color: FG }}>"size"</span>: <span style={{ color: AMB }}>20</span></div>
        <div style={{ paddingLeft: 24 }}>{'}'}</div>
        <div style={{ paddingLeft: 12 }}>{'}'}</div>
        <div>{'}'}</div>
      </div>
    ),
  },
  {
    title: 'Metric Aggregations',
    paragraphs: [
      'avg, sum, min, max: estatísticas simples sobre campo numérico',
      'percentiles: p50, p95, p99 — latência de API, distribuição de preços',
      'cardinality: contagem aproximada de valores únicos (HyperLogLog)',
      'stats: combina min/max/avg/sum/count em uma única query',
    ],
    gradient: [SKY, '#1e4a6e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.8, padding: 12 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>// Sub-agg dentro de bucket</div>
        <div><span style={{ color: C }}>"por_cat"</span>: {'{'}<span style={{ color: GRN }}>"terms"</span>: {'{ ... }'}</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: PRP }}>"aggs"</span>: {'{'}</div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: SKY }}>"preco_medio"</span>: {'{'}</div>
        <div style={{ paddingLeft: 36 }}><span style={{ color: GRN }}>"avg"</span>: {'{'} <span style={{ color: FG }}>"field"</span>: <span style={{ color: C }}>"price"</span> {'}'}</div>
        <div style={{ paddingLeft: 24 }}>{'}'}</div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: SKY }}>"p99"</span>: {'{'}</div>
        <div style={{ paddingLeft: 36 }}><span style={{ color: GRN }}>"percentiles"</span>: {'{'} <span style={{ color: FG }}>"field"</span>: <span style={{ color: C }}>"duration_ms"</span> {'}'}</div>
        <div style={{ paddingLeft: 24 }}>{'}'}</div>
      </div>
    ),
  },
  {
    title: 'Pipeline Aggregations',
    paragraphs: [
      'Operam sobre resultados de outras aggregations — não sobre documentos diretamente',
      'cumulative_sum: soma acumulada de vendas por mês',
      'derivative: variação entre buckets consecutivos (taxa de crescimento)',
      'moving_avg: média móvel para suavizar séries temporais ruidosas',
    ],
    gradient: [GRN, '#1a5c2e'],
    illustration: (
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1.8, padding: 12 }}>
        <div style={{ color: MUTE, fontSize: 9 }}>// Soma acumulada de vendas por mês</div>
        <div><span style={{ color: C }}>"vendas_mes"</span>: {'{'}</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: GRN }}>"date_histogram"</span>: {'{'}<span style={{ color: FG }}>"field"</span>: <span style={{ color: C }}>"date"</span>, <span style={{ color: FG }}>"calendar_interval"</span>: <span style={{ color: C }}>"month"</span>{'}'}</div>
        <div style={{ paddingLeft: 12 }}><span style={{ color: PRP }}>"aggs"</span>: {'{'}</div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: SKY }}>"total"</span>: {'{'}<span style={{ color: GRN }}>"sum"</span>: {'{'}<span style={{ color: FG }}>"field"</span>: <span style={{ color: C }}>"amount"</span>{'}'}{'}'},</div>
        <div style={{ paddingLeft: 24 }}><span style={{ color: SKY }}>"cumulative"</span>: {'{'}<span style={{ color: GRN }}>"cumulative_sum"</span>: {'{'}<span style={{ color: FG }}>"buckets_path"</span>: <span style={{ color: C }}>"total"</span>{'}'}</div>
        <div style={{ paddingLeft: 12 }}>{'}'}</div>
        <div>{'}'}</div>
      </div>
    ),
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — text vs keyword (ComparisonTable com rating correto)
// ═══════════════════════════════════════════════════════════════════════════════

const FIELD_OPTIONS: ComparisonOption[] = [
  { id: 'text',    label: 'text',       color: PRP },
  { id: 'keyword', label: 'keyword',    color: GRN },
  { id: 'multi',   label: 'multi-field', color: C },
]

const FIELD_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'analyzer',
    label: 'Analyzer aplicado na indexação?',
    values: {
      text:    { rating: 'excellent', note: 'Sim — tokeniza, lowercase, stemming, stop words' },
      keyword: { rating: 'poor',      note: 'Não — string raw, case-sensitive, inteira' },
      multi:   { rating: 'excellent', note: 'Ambos: text para busca, .keyword sem analyzer' },
    },
  },
  {
    id: 'fulltext',
    label: 'Busca full-text (match / multi_match)',
    values: {
      text:    { rating: 'excellent', note: 'Sim — match, multi_match, highlight, fuzzy' },
      keyword: { rating: 'poor',      note: 'Não — apenas term/terms exato (case-sensitive)' },
      multi:   { rating: 'excellent', note: 'Sim — via campo text principal' },
    },
  },
  {
    id: 'agg',
    label: 'Aggregations e sort eficiente',
    values: {
      text:    { rating: 'poor',      note: 'Não por default — fielddata desabilitado (consome heap)' },
      keyword: { rating: 'excellent', note: 'Sim — terms agg, sort, cardinality' },
      multi:   { rating: 'excellent', note: 'Sim — via .keyword subfield' },
    },
  },
  {
    id: 'exemplo',
    label: 'Campos de exemplo',
    values: {
      text:    { rating: 'good', note: 'description, body, summary, bio, content' },
      keyword: { rating: 'good', note: 'status, category, email, country_code, tag' },
      multi:   { rating: 'excellent', note: 'title, name, author (busca + sort + agg)' },
    },
  },
  {
    id: 'gotcha',
    label: 'Armadilha mais comum',
    values: {
      text:    { rating: 'fair', note: 'terms agg em campo text → tokens, não valores originais' },
      keyword: { rating: 'fair', note: 'match query em keyword → case-sensitive, sem stemming' },
      multi:   { rating: 'good', note: 'Esquecer o .keyword no sort/agg → erro ou performance ruim' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns Elasticsearch (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const ES_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Terms agg em campo text',
    wrong: [
      [{ text: '// ❌ text field não é agregável por default', color: RED }],
      [{ text: 'GET /index/_search', color: '#e2e8f0' }],
      [{ text: '{"aggs": {"categorias": {', color: '#e2e8f0' }],
      [{ text: '  "terms": {"field": "category"}}}  // ← text!', color: '#ef4444' }],
      [{ text: '// fielddata disabled: erro 400 ou tokens errados', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Use .keyword subfield para agg', color: GRN }],
      [{ text: '{"aggs": {"categorias": {', color: '#e2e8f0' }],
      [{ text: '  "terms": {"field": "category.keyword"}}}', color: '#4ade80' }],
      [{ text: '// Mapping: "category": {"type": "text",', color: GRN }],
      [{ text: '//   "fields": {"keyword": {"type":"keyword"}}}', color: GRN }],
    ],
    why: 'text fields são tokenizados. "Redis in Action" vira tokens individuais. terms agg retornaria "redis", "in", "action" separados. Use .keyword para o valor original inteiro.',
  },
  {
    title: 'Dynamic mapping com tipo errado',
    wrong: [
      [{ text: '// ❌ Primeiro doc com "price" como string', color: RED }],
      [{ text: 'POST /products/_doc {"price": "29.99"}', color: '#ef4444' }],
      [{ text: '// Dynamic mapping cria price como text!', color: RED }],
      [{ text: '// Aggregation range em price → erro', color: RED }],
      [{ text: '// Correção: reindex completo obrigatório', color: RED }],
    ],
    right: [
      [{ text: '// ✅ Defina mapping ANTES de indexar', color: GRN }],
      [{ text: 'PUT /products {"mappings": {"properties": {', color: '#e2e8f0' }],
      [{ text: '  "price": {"type": "float"},', color: '#4ade80' }],
      [{ text: '  "title": {"type": "text", "fields":', color: '#e2e8f0' }],
      [{ text: '    {"keyword": {"type": "keyword"}}},', color: '#4ade80' }],
      [{ text: '  "status": {"type": "keyword"}}}}', color: '#4ade80' }],
    ],
    why: 'Dynamic mapping infere tipo pelo primeiro documento. Número como string → campo text não é agregável. Defina mappings explicitamente antes de qualquer indexação.',
  },
  {
    title: 'Filtros em must em vez de filter',
    wrong: [
      [{ text: '// ❌ status e date em must — recalcula BM25', color: RED }],
      [{ text: '{"query": {"bool": {"must": [', color: '#ef4444' }],
      [{ text: '  {"match": {"title": "redis"}},', color: '#e2e8f0' }],
      [{ text: '  {"term": {"status": "published"}},  // must!', color: '#ef4444' }],
      [{ text: '  {"range": {"date": {"gte": "now-7d"}}}]}}', color: '#ef4444' }],
    ],
    right: [
      [{ text: '// ✅ Filtros binários em filter — cacheados', color: GRN }],
      [{ text: '{"query": {"bool": {', color: '#e2e8f0' }],
      [{ text: '  "must": [{"match": {"title": "redis"}}],', color: '#e2e8f0' }],
      [{ text: '  "filter": [', color: '#4ade80' }],
      [{ text: '    {"term": {"status": "published"}},', color: '#4ade80' }],
      [{ text: '    {"range": {"date": {"gte": "now-7d"}}}]}}}', color: '#4ade80' }],
    ],
    why: 'filter context não afeta score e é cacheado como bitset. must context recalcula BM25 desnecessariamente. Filtros de status/data em filter são 5-10× mais rápidos.',
  },
  {
    title: 'Paginação profunda com from + size',
    wrong: [
      [{ text: '// ❌ from 9990 busca 10.000 docs por shard', color: RED }],
      [{ text: '{"from": 9990, "size": 10, "query": {...}}', color: '#ef4444' }],
      [{ text: '// ES busca e descarta 9.990 por shard', color: RED }],
      [{ text: '// Limite: max_result_window = 10.000', color: RED }],
    ],
    right: [
      [{ text: '// ✅ search_after — stateless e eficiente', color: GRN }],
      [{ text: '{"size": 10,', color: '#e2e8f0' }],
      [{ text: ' "sort": [{"date": "desc"}, {"_id": "asc"}],', color: '#4ade80' }],
      [{ text: ' "search_after": ["2024-01-15", "doc-id-123"]}', color: '#4ade80' }],
      [{ text: '// Cursor pelo último valor — sem limite de página', color: GRN }],
    ],
    why: 'from+size é O(from+size) por shard. search_after usa ponteiro no índice — eficiente independente da profundidade da página.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function ElasticsearchVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'inverted-index',
      title: 'Inverted Index',
      subtitle: 'Anatomy completa: mapping → analyzer → inverted index → BM25 → query phase',
      accent: C,
      component: (
        <LayerStack
          layers={INDEX_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'bool-query',
      title: 'Bool Query',
      subtitle: 'must vs filter vs should vs must_not — score, cache e quando usar cada um',
      accent: C,
      component: (
        <ComparisonTable
          options={QUERY_OPTIONS}
          criteria={QUERY_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'indexing-flow',
      title: 'Fluxo de Indexação',
      subtitle: 'Coordinating node → primary shard → replica → refresh → segmento Lucene',
      accent: C,
      component: (
        <SequenceDiagram
          actors={INDEX_ACTORS}
          messages={INDEX_MESSAGES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'ilm',
      title: 'ILM & Data Streams',
      subtitle: 'Index Lifecycle Management — quando usar cada estratégia de índice',
      accent: C,
      component: (
        <DecisionTree
          root={ILM_ROOT}
          nodes={ILM_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'aggregations',
      title: 'Aggregations',
      subtitle: 'Bucket, Metric e Pipeline aggregations — composição e exemplos práticos',
      accent: C,
      component: (
        <ConceptCarousel
          slides={AGG_SLIDES}
          accentColor={C}
          bgColor={BG}
          cardColor={'#1e293b'}
        />
      ),
    },
    {
      id: 'text-vs-keyword',
      title: 'text vs keyword',
      subtitle: 'Tipos de campo, analyzers, multi-field e armadilhas de mapping',
      accent: C,
      component: (
        <ComparisonTable
          options={FIELD_OPTIONS}
          criteria={FIELD_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Terms agg em text, dynamic mapping, must vs filter, paginação profunda',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={ES_ANTIPATTERNS}
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
