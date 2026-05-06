'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { HeatMap } from '@/components/visuals/HeatMap'
import type { HeatCell } from '@/components/visuals/HeatMap'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'

// ── Paleta PostgreSQL ─────────────────────────────────────────────────────────
const C      = '#336791'   // PostgreSQL blue
const C2     = '#5b9bd5'   // azul claro
const BG     = '#0f172a'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const RED    = '#ef4444'
const GRN    = '#4ade80'
const AMB    = '#f59e0b'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'
const MUTE   = '#475569'

void LINE; void FG; void FGMUTE; void MUTE

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Query Execution Pipeline (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const QUERY_PIPELINE_LAYERS: Layer[] = [
  {
    id: 'parse',
    label: 'Parse',
    sublabel: 'Lexer + Parser → Parse Tree (AST)',
    description: 'Lexer tokeniza o SQL e o Parser constrói uma Parse Tree. Erros de sintaxe são capturados aqui — "syntax error at or near". Nenhum acesso ao catálogo nessa fase.',
    color: SKY,
    icon: '①',
    examples: ['SelectStmt → targetList, fromClause, whereClause, groupClause', '"syntax error at or near" vem daqui'],
  },
  {
    id: 'analyze',
    label: 'Analyze',
    sublabel: 'Semantic Analysis → Query Tree com OIDs',
    description: 'Verifica existência de tabelas, colunas e funções no pg_catalog. Resolve aliases, star-expansion (SELECT *), tipos de dado. Gera uma Query tree com OIDs resolvidos.',
    color: AMB,
    icon: '②',
    examples: ['"users" → relid 16384, "u.name" → attnum 2 text', '"column X does not exist" vem daqui'],
  },
  {
    id: 'rewrite',
    label: 'Rewrite',
    sublabel: 'Rule System → expansão de views e Row-Level Security',
    description: 'O Rule System aplica regras de reescrita (pg_rewrite). Views são expandidas substituindo pelo SELECT subjacente. Row-Level Security policies são injetadas como predicados adicionais.',
    color: PRP,
    icon: '③',
    examples: ['View "active_users" → SELECT * FROM users WHERE active = true', 'RLS: AND user_id = current_user_id()'],
  },
  {
    id: 'plan',
    label: 'Plan',
    sublabel: 'Planner/Optimizer → plano de menor custo estimado',
    description: 'O coração do Postgres. Usa estatísticas de pg_statistic (colecionadas pelo ANALYZE) para estimar custos de cada plano candidato. Escolhe o plano de menor custo. EXPLAIN mostra o plano escolhido.',
    color: C2,
    icon: '④',
    examples: ['Hash Join, Nested Loop, Merge Join — planner avalia todos', 'EXPLAIN (ANALYZE, BUFFERS) mostra custo real vs estimado'],
  },
  {
    id: 'execute',
    label: 'Execute',
    sublabel: 'Executor percorre o plano em árvore — lê do Shared Buffer Pool',
    description: 'O Executor percorre o plano em forma de árvore (pipeline model). Cada nó puxa tuplas do filho (pull model). Lê páginas do Shared Buffer Pool — cache hit ou disk I/O. Agrega, filtra e retorna linhas.',
    color: GRN,
    icon: '⑤',
    examples: ['HashAggregate → Hash Join → Seq Scan / Index Scan', 'Shared buffer hit evita disk I/O'],
  },
  {
    id: 'return',
    label: 'Return',
    sublabel: 'Wire protocol libpq → streaming ao cliente',
    description: 'Resultados são enviados ao cliente através do protocolo de mensagens PostgreSQL (libpq). O cliente pode consumir em streaming (cursor) ou buffer completo. O portal do backend é destruído ao finalizar.',
    color: C,
    icon: '⑥',
    examples: ['RowDescription → DataRow... → CommandComplete → ReadyForQuery', 'DECLARE my_cur CURSOR FOR SELECT... — streaming controlado'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Tipos de Índice (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const INDEX_OPTIONS: ComparisonOption[] = [
  { id: 'btree', label: 'B-Tree',  color: C2 },
  { id: 'gin',   label: 'GIN',     color: PRP },
  { id: 'gist',  label: 'GiST',    color: GRN },
  { id: 'brin',  label: 'BRIN',    color: AMB },
  { id: 'hash',  label: 'Hash',    color: RED },
]

const INDEX_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'equality',
    label: 'Igualdade (=)',
    category: 'Operações suportadas',
    values: {
      btree: { rating: 'excellent', note: 'Nativo, padrão para a maioria dos casos' },
      gin:   { rating: 'good',      note: 'Suportado via operador =' },
      gist:  { rating: 'good',      note: 'Depende do tipo de dado' },
      brin:  { rating: 'fair',      note: 'Aproximado — false positives possíveis' },
      hash:  { rating: 'excellent', note: 'Ótimo para igualdade, somente =' },
    },
  },
  {
    id: 'range',
    label: 'Range (<, >, BETWEEN)',
    category: 'Operações suportadas',
    values: {
      btree: { rating: 'excellent', note: 'Padrão para range queries' },
      gin:   { rating: 'poor',      note: 'Não suporta range' },
      gist:  { rating: 'good',      note: 'Suporta range types nativamente' },
      brin:  { rating: 'fair',      note: 'Aproximado, eficiente para dados ordenados por inserção' },
      hash:  { rating: 'poor',      note: 'Somente igualdade' },
    },
  },
  {
    id: 'order',
    label: 'ORDER BY sem sort',
    category: 'Operações suportadas',
    values: {
      btree: { rating: 'excellent', note: 'Entrega tuplas já ordenadas — elimina sort extra' },
      gin:   { rating: 'poor',      note: 'Não suporta' },
      gist:  { rating: 'poor',      note: 'Não garante ordem' },
      brin:  { rating: 'poor',      note: 'Não suporta' },
      hash:  { rating: 'poor',      note: 'Não suporta' },
    },
  },
  {
    id: 'jsonb',
    label: 'JSONB / arrays',
    category: 'Operações suportadas',
    values: {
      btree: { rating: 'poor',      note: 'Não suporta operadores JSONB' },
      gin:   { rating: 'excellent', note: 'Nativo para @>, ?, ?|, ?& em JSONB e arrays' },
      gist:  { rating: 'fair',      note: 'Suporte parcial via extensões' },
      brin:  { rating: 'poor',      note: 'Não suporta' },
      hash:  { rating: 'poor',      note: 'Não suporta' },
    },
  },
  {
    id: 'fulltext',
    label: 'Full-text (tsvector)',
    category: 'Operações suportadas',
    values: {
      btree: { rating: 'poor',      note: 'Não suporta operador @@' },
      gin:   { rating: 'excellent', note: 'Ideal para tsvector — busca texto completo' },
      gist:  { rating: 'good',      note: 'Suportado, atualização mais rápida que GIN' },
      brin:  { rating: 'poor',      note: 'Não suporta' },
      hash:  { rating: 'poor',      note: 'Não suporta' },
    },
  },
  {
    id: 'geometry',
    label: 'Geometria / PostGIS',
    category: 'Operações suportadas',
    values: {
      btree: { rating: 'poor',      note: 'Não suporta operadores geoespaciais' },
      gin:   { rating: 'poor',      note: 'Não adequado para geometria' },
      gist:  { rating: 'excellent', note: 'Nativo para PostGIS — ST_Intersects, ST_Within, etc.' },
      brin:  { rating: 'poor',      note: 'Não suporta' },
      hash:  { rating: 'poor',      note: 'Não suporta' },
    },
  },
  {
    id: 'size',
    label: 'Tamanho do índice',
    category: 'Características',
    values: {
      btree: { rating: 'good',      note: 'Médio — balanceado' },
      gin:   { rating: 'fair',      note: 'Grande — inverted index pode ser maior que a tabela' },
      gist:  { rating: 'good',      note: 'Médio — depende do tipo' },
      brin:  { rating: 'excellent', note: 'Minúsculo — apenas metadados de blocos' },
      hash:  { rating: 'good',      note: 'Médio — similar ao B-Tree' },
    },
  },
  {
    id: 'write-speed',
    label: 'Velocidade de escrita',
    category: 'Características',
    values: {
      btree: { rating: 'good',      note: 'Boa — split de página ocasional' },
      gin:   { rating: 'fair',      note: 'Lenta em writes — usa pending list para batch' },
      gist:  { rating: 'good',      note: 'Boa para maioria dos tipos' },
      brin:  { rating: 'excellent', note: 'Ótima — apenas atualiza metadados de bloco' },
      hash:  { rating: 'good',      note: 'Boa — similar ao B-Tree' },
    },
  },
  {
    id: 'partial',
    label: 'Índice parcial (WHERE)',
    category: 'Características',
    values: {
      btree: { rating: 'excellent', note: 'CREATE INDEX ON t(col) WHERE active = true' },
      gin:   { rating: 'excellent', note: 'Suportado' },
      gist:  { rating: 'excellent', note: 'Suportado' },
      brin:  { rating: 'excellent', note: 'Suportado' },
      hash:  { rating: 'excellent', note: 'Suportado' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — EXPLAIN ANALYZE HeatMap
// ═══════════════════════════════════════════════════════════════════════════════

const EXPLAIN_ROWS = [
  'HashAggregate',
  'Hash Join',
  'Seq Scan (orders)',
  'Hash',
  'Index Scan (users)',
  'Bitmap Heap Scan',
  'Bitmap Index Scan',
]

const EXPLAIN_COLS = ['Custo Start', 'Custo Total', 'Rows Est.', 'Rows Real', 'Loops']

const EXPLAIN_DATA: HeatCell[][] = [
  [{ value: 6, note: 'startup cost: 6.2' }, { value: 9, note: 'total cost: 9.1' }, { value: 4, note: '2 rows estimadas' }, { value: 3, note: '3 rows reais' }, { value: 1, note: '1 execução' }],
  [{ value: 3, note: 'startup: 3.1' }, { value: 7, note: 'total: 7.0 — inner join com hash' }, { value: 5, note: '10 rows est.' }, { value: 6, note: '12 rows reais' }, { value: 1, note: '1 loop' }],
  [{ value: 0, note: 'startup: 0 (não paga setup)' }, { value: 8, note: 'total: 8.2 — lê páginas sequenciais' }, { value: 9, note: 'alta estimativa de rows' }, { value: 10, note: 'rows reais altas' }, { value: 1, note: '1 loop' }],
  [{ value: 2, note: 'startup: 2 — constrói hash table' }, { value: 4, note: 'total: 4' }, { value: 3, note: '5 rows est.' }, { value: 3, note: '5 rows reais' }, { value: 1, note: '1 build' }],
  [{ value: 0, note: 'startup: 0.28' }, { value: 2, note: 'total: 2.3 — muito eficiente' }, { value: 1, note: '1 row est.' }, { value: 1, note: '1 row real' }, { value: 5, note: '5 loops (1 por usuário)' }],
  [{ value: 4, note: 'startup: 4.4 — espera bitmap' }, { value: 6, note: 'total: 6.0' }, { value: 5, note: '8 rows est.' }, { value: 4, note: '6 rows reais' }, { value: 1, note: '1 loop' }],
  [{ value: 0, note: 'startup: 0' }, { value: 3, note: 'total: 3.2 — constrói bitmap de TIDs' }, { value: 5, note: '8 rows est.' }, { value: 4, note: '6 rows reais' }, { value: 1, note: '1 loop' }],
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — JOIN Algorithms (ComparisonTable)
// ═══════════════════════════════════════════════════════════════════════════════

const JOIN_OPTIONS: ComparisonOption[] = [
  { id: 'nested-loop', label: 'Nested Loop', color: AMB },
  { id: 'hash-join',   label: 'Hash Join',   color: C2 },
  { id: 'merge-join',  label: 'Merge Join',  color: GRN },
]

const JOIN_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'complexity',
    label: 'Complexidade',
    category: 'Custo algorítmico',
    values: {
      'nested-loop': { rating: 'poor',      note: 'O(N×M) — cresce multiplicativamente' },
      'hash-join':   { rating: 'excellent', note: 'O(N+M) — linear no total de linhas' },
      'merge-join':  { rating: 'good',      note: 'O(N log N + M log M) se precisar ordenar' },
    },
  },
  {
    id: 'memory',
    label: 'Memória necessária',
    category: 'Custo algorítmico',
    values: {
      'nested-loop': { rating: 'excellent', note: 'O(1) — nenhuma memória extra necessária' },
      'hash-join':   { rating: 'fair',      note: 'O(menor tabela) para construir hash table' },
      'merge-join':  { rating: 'excellent', note: 'O(1) se ambas já ordenadas por join key' },
    },
  },
  {
    id: 'best-case',
    label: 'Melhor cenário',
    category: 'Quando usar',
    values: {
      'nested-loop': { rating: 'good',      note: 'Inner pequeno + índice no outer — OLTP com FK' },
      'hash-join':   { rating: 'excellent', note: 'Tabelas grandes sem ordenação — OLAP' },
      'merge-join':  { rating: 'good',      note: 'Ambas tabelas já ordenadas por join key' },
    },
  },
  {
    id: 'non-equijoin',
    label: 'Suporta non-equijoin',
    category: 'Quando usar',
    values: {
      'nested-loop': { rating: 'excellent', note: 'Qualquer condição de join' },
      'hash-join':   { rating: 'poor',      note: 'Somente igualdade (=)' },
      'merge-join':  { rating: 'fair',      note: 'Igualdade + alguns range joins' },
    },
  },
  {
    id: 'parallelism',
    label: 'Paralelismo',
    category: 'Performance',
    values: {
      'nested-loop': { rating: 'fair',      note: 'Limitado' },
      'hash-join':   { rating: 'excellent', note: 'Bom — Parallel Hash suportado' },
      'merge-join':  { rating: 'good',      note: 'Bom — works com parallel sort' },
    },
  },
  {
    id: 'startup-cost',
    label: 'Startup cost',
    category: 'Performance',
    values: {
      'nested-loop': { rating: 'excellent', note: 'Baixo — começa a retornar linhas logo' },
      'hash-join':   { rating: 'fair',      note: 'Alto — precisa construir hash table primeiro' },
      'merge-join':  { rating: 'fair',      note: 'Alto — sort pode ser necessário antes' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — WAL & Replicação (SequenceDiagram)
// ═══════════════════════════════════════════════════════════════════════════════

const WAL_ACTORS: SeqActor[] = [
  { id: 'app',      label: 'Aplicação',     color: '#e2e8f0' },
  { id: 'primary',  label: 'Primary',       color: C2 },
  { id: 'wal',      label: 'WAL',           color: AMB },
  { id: 'replica',  label: 'Replica',       color: GRN },
  { id: 'standby',  label: 'Standby App',   color: '#94a3b8' },
]

const WAL_MESSAGES: SeqMessage[] = [
  { from: 'app',     to: 'primary',  label: 'BEGIN; INSERT; COMMIT',        note: 'Transação enviada pelo cliente' },
  { from: 'primary', to: 'wal',      label: 'WAL record gerado (LSN X)',     note: 'Write-Ahead Log: mudança descrita antes dos dados', type: 'sync' },
  { from: 'wal',     to: 'primary',  label: 'fsync() — WAL no disco',       note: 'Durabilidade garantida antes do OK ao cliente', type: 'return' },
  { from: 'primary', to: 'app',      label: 'COMMIT OK',                    note: 'Cliente recebe confirmação', type: 'return' },
  { from: 'primary', to: 'replica',  label: 'WAL stream (LSN X)',            note: 'Streaming replication: WAL enviado imediatamente', type: 'async' },
  { from: 'replica', to: 'primary',  label: 'Ack LSN X (flush/apply)',      note: 'Replica confirma recebimento e aplicação', type: 'return' },
  { from: 'replica', to: 'wal',      label: 'Replay WAL records',           note: 'Replica aplica as mudanças localmente', type: 'sync' },
  { from: 'standby', to: 'replica',  label: 'SELECT (read-only)',           note: 'Hot standby: réplica aceita leituras' },
  { from: 'replica', to: 'standby',  label: 'Resultado',                    type: 'return' },
]

const WAL_GROUPS: SeqGroup[] = [
  { label: 'Commit no Primary', kind: 'loop', fromMsg: 0, toMsg: 3, color: C2 },
  { label: 'Streaming Replication', kind: 'par', fromMsg: 4, toMsg: 7, color: GRN },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — MVCC & Isolamento (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const MVCC_LAYERS: Layer[] = [
  {
    id: 'serializable',
    label: 'SERIALIZABLE',
    sublabel: 'Isolamento total — como se fosse serial',
    description: 'Nível mais restritivo. Postgres usa SSI (Serializable Snapshot Isolation) — detecta ciclos de dependência entre transações. Zero leitura suja, nenhuma leitura não-repetível, nenhum phantom, nem write skew. Custo: mais aborts.',
    examples: ['SET TRANSACTION ISOLATION LEVEL SERIALIZABLE', 'Evita: write skew (problema do médico de plantão)', 'Custo: pode abortar com "could not serialize"'],
    color: RED,
    icon: '🔒',
  },
  {
    id: 'repeatable-read',
    label: 'REPEATABLE READ',
    sublabel: 'Snapshot da transação — sem phantoms no Postgres',
    description: 'A transação vê um snapshot fixo do banco no momento do primeiro SELECT. No Postgres, REPEATABLE READ já protege contra phantom reads. Boa escolha para relatórios longos que precisam de dados consistentes.',
    examples: ['SET TRANSACTION ISOLATION LEVEL REPEATABLE READ', 'No Postgres: phantom reads também evitados (SSI parcial)'],
    color: AMB,
    icon: '📸',
  },
  {
    id: 'read-committed',
    label: 'READ COMMITTED (default)',
    sublabel: 'Cada statement vê um novo snapshot',
    description: 'Nível default. Cada comando SQL dentro da transação vê o snapshot do banco no momento que o comando começa. Evita leituras sujas mas permite leituras não-repetíveis entre statements.',
    examples: ['DEFAULT — não precisa SET', 'Permite: non-repeatable reads entre statements', 'Evita: dirty reads (leitura de dados não-commitados)'],
    color: C2,
    icon: '📋',
  },
  {
    id: 'read-uncommitted',
    label: 'READ UNCOMMITTED',
    sublabel: 'Mesmo que READ COMMITTED no Postgres',
    description: 'SQL padrão define READ UNCOMMITTED como permitindo dirty reads. O Postgres ignora isso e sempre usa pelo menos READ COMMITTED. Escrever READ UNCOMMITTED no Postgres é equivalente a READ COMMITTED.',
    examples: ['SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED', 'No Postgres: equivalente a READ COMMITTED', 'Dirty reads: nunca acontecem no Postgres (MVCC garante)'],
    color: '#475569',
    icon: '📖',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns PostgreSQL (AntiPatternsGallery)
// ═══════════════════════════════════════════════════════════════════════════════

const PG_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'N+1 queries — buscar relações em loop',
    wrong: [
      [{ text: 'const orders = await db.query', color: '#e2e8f0' }],
      [{ text: "('SELECT * FROM orders')", color: '#ef4444' }],
      [{ text: '// Loop N+1:', color: '#64748b' }],
      [{ text: 'for (const o of orders) {', color: '#e2e8f0' }],
      [{ text: "  o.user = await db.query('SELECT * FROM users WHERE id=$1', [o.user_id])", color: '#ef4444' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: 'SELECT o.*, u.name, u.email', color: '#4ade80' }],
      [{ text: '  FROM orders o', color: '#e2e8f0' }],
      [{ text: '  JOIN users u ON u.id = o.user_id', color: '#4ade80' }],
      [{ text: " WHERE o.status = 'pendente'", color: '#e2e8f0' }],
      [{ text: '-- 1 query, resultado completo', color: '#64748b' }],
    ],
    why: 'Um SELECT na aplicação para cada linha da lista principal. Com 1000 pedidos, 1001 queries. Latência de rede e I/O explodem. Solução: JOIN ou carregamento em lote com IN.',
  },
  {
    title: 'SELECT * — over-fetch de colunas',
    wrong: [
      [{ text: 'SELECT *', color: '#ef4444' }],
      [{ text: '  FROM produtos', color: '#e2e8f0' }],
      [{ text: ' -- traz imagem_bytes (1MB), metadados JSONB grande', color: '#64748b' }],
    ],
    right: [
      [{ text: 'SELECT id, nome, preco, estoque', color: '#4ade80' }],
      [{ text: '  FROM produtos', color: '#e2e8f0' }],
      [{ text: " WHERE categoria = 'eletrônicos'", color: '#e2e8f0' }],
      [{ text: '-- Index Only Scan possível', color: '#64748b' }],
    ],
    why: 'Traz todas as colunas incluindo JSONB, TEXT grandes e bytea. Impede Index Only Scans. Aumenta transferência de rede e memória. Sempre liste as colunas necessárias.',
  },
  {
    title: 'FK sem índice na coluna referenciante',
    wrong: [
      [{ text: 'CREATE TABLE posts (', color: '#e2e8f0' }],
      [{ text: '  id      BIGSERIAL PRIMARY KEY,', color: '#e2e8f0' }],
      [{ text: '  user_id BIGINT REFERENCES users(id)', color: '#ef4444' }],
      [{ text: '  -- SEM índice em user_id!', color: '#64748b' }],
      [{ text: ');', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: 'CREATE TABLE posts (', color: '#e2e8f0' }],
      [{ text: '  id      BIGSERIAL PRIMARY KEY,', color: '#e2e8f0' }],
      [{ text: '  user_id BIGINT NOT NULL REFERENCES users(id)', color: '#4ade80' }],
      [{ text: ');', color: '#e2e8f0' }],
      [{ text: '-- Índice manual obrigatório:', color: '#64748b' }],
      [{ text: 'CREATE INDEX ON posts(user_id);', color: '#4ade80' }],
    ],
    why: 'Postgres NÃO cria índice automático na coluna que tem REFERENCES. Queries com JOIN na FK fazem Seq Scan se não houver índice. Em tabelas grandes isso é desastroso.',
  },
  {
    title: 'Conexão nova por request — sem pool',
    wrong: [
      [{ text: '// Por request — SEM pool', color: '#64748b' }],
      [{ text: 'async function handleReq(req) {', color: '#e2e8f0' }],
      [{ text: '  const client = new Client(config)', color: '#ef4444' }],
      [{ text: '  await client.connect()', color: '#ef4444' }],
      [{ text: '  const r = await client.query(sql)', color: '#e2e8f0' }],
      [{ text: '  await client.end()', color: '#ef4444' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '// Pool compartilhado — inicializa 1x', color: '#64748b' }],
      [{ text: 'const pool = new Pool({ max: 20, idleTimeoutMillis: 30000 })', color: '#4ade80' }],
      [{ text: 'async function handleReq(req) {', color: '#e2e8f0' }],
      [{ text: '  // pool reutiliza conexão existente', color: '#64748b' }],
      [{ text: '  return pool.query(sql)', color: '#4ade80' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Postgres fork() um processo por conexão. Criar e destruir conexão a cada request custa ~15ms. Com 100 req/s = 100 processos simultâneos. Use PgBouncer ou pool da lib.',
  },
  {
    title: 'Ignorar bloat e autovacuum',
    wrong: [
      [{ text: '-- Dead tuples acumulando:', color: '#64748b' }],
      [{ text: 'SELECT relname, n_dead_tup, n_live_tup', color: '#ef4444' }],
      [{ text: '  FROM pg_stat_user_tables', color: '#ef4444' }],
      [{ text: ' -- Dead tuples: 5.000.000!', color: '#64748b' }],
      [{ text: ' -- autovacuum_enabled = false', color: '#ef4444' }],
    ],
    right: [
      [{ text: '-- Monitor autovacuum:', color: '#64748b' }],
      [{ text: 'SELECT relname, last_autovacuum, n_dead_tup, n_live_tup', color: '#4ade80' }],
      [{ text: 'FROM pg_stat_user_tables', color: '#4ade80' }],
      [{ text: 'ORDER BY n_dead_tup DESC;', color: '#4ade80' }],
      [{ text: '-- VACUUM ANALYZE tabela_critica;', color: '#64748b' }],
    ],
    why: 'MVCC nunca deleta tuplas in-place — UPDATE cria nova versão, DELETE marca xmax. As versões mortas ficam na heap até o VACUUM limpá-las. Sem vacuum: tabela cresce indefinidamente.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Connection Pooling (LayerStack)
// ═══════════════════════════════════════════════════════════════════════════════

const POOLING_LAYERS: Layer[] = [
  {
    id: 'app',
    label: 'Aplicação (N instâncias)',
    sublabel: 'Node.js / NestJS / Django workers',
    description: 'Cada instância mantém um pool de conexões local. O pool da lib gerencia conexões abertas e as empresta por request. Libera a conexão de volta após o query, não ao fim do request HTTP.',
    examples: ['pg-pool: max: 20 conexões por process', 'Prisma: connection_limit padrão', 'Pool libera em pool.query() ou client.release()'],
    color: '#e2e8f0',
    icon: '🖥️',
  },
  {
    id: 'pgbouncer',
    label: 'PgBouncer (recomendado)',
    sublabel: 'Proxy de connection pooling',
    description: 'PgBouncer senta entre a app e o Postgres. Em transaction mode: a conexão com o Postgres é alocada apenas durante a transação ativa. 1000 clients podem compartilhar 20 conexões Postgres reais.',
    examples: ['Transaction mode: mais eficiente (recomendado)', 'Session mode: compatível com SET, PREPARE, LISTEN', 'Statement mode: agressivo, quebra transações multi-statement'],
    color: AMB,
    icon: '🔄',
  },
  {
    id: 'postgres',
    label: 'PostgreSQL (max_connections)',
    sublabel: 'Processos reais no servidor',
    description: 'Cada conexão Postgres é um processo Unix. max_connections (padrão 100) define o limite total. Acima disso: "sorry, too many clients already". Cada processo consome ~5-10MB de memória.',
    examples: ['max_connections = 100 (default)', 'SELECT count(*) FROM pg_stat_activity', 'SELECT pg_terminate_backend(pid) WHERE state = \'idle\''],
    color: C,
    icon: '🗄️',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — MVCC Transaction Diagram
// ═══════════════════════════════════════════════════════════════════════════════

const MVCC_INFO = [
  'Começo do tempo. Linha id=1 tem versão v1: name=Ana, criada pela transação xmin=100.',
  'v1 já existe. Nada acontece.',
  'Tx A começa, pega snapshot t1. Vai poder ler só o que foi commitado antes.',
  'Tx B começa DEPOIS. Faz UPDATE: cria v2 (name=Bia, xmin=101). v1 fica marcada com xmax=101 mas continua ali — não é overwrite.',
  'Tx A faz SELECT. Decide qual versão ler: v1 é visível (xmin=100, comitada antes do snapshot). v2 não (xmin=101, ainda não commitou). Lê <strong>Ana</strong>.',
  'Tx B dá COMMIT. v2 agora é oficial pra futuras transações — mas A já tem seu snapshot.',
  'Tx A repete o SELECT. Snapshot dela não mudou! Continua vendo v1 = <strong>Ana</strong>. Isso é <strong>repeatable read</strong> de graça pelo MVCC.',
]

function MVCCVisual() {
  const [mvccStep, setMvccStep] = useState(0)

  const TXA = C2
  const TXB = PRP
  const ROW = RED

  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>MVCC — Passo a Passo</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Como o PostgreSQL mantém versões de linhas para isolamento de transações</div>
      </div>

      <svg viewBox="0 0 880 360" style={{ width: '100%', display: 'block', background: '#1e293b', borderRadius: 10, marginBottom: 14 }}>
        <text x="440" y="20" textAnchor="middle" fontSize="13" fill={FGMUTE} fontWeight="700">
          {`passo ${mvccStep} / ${MVCC_INFO.length - 1}`}
        </text>

        <line x1="80" y1="60" x2="820" y2="60" stroke={FGMUTE} strokeWidth="1.5" />
        <text x="826" y="65" fontSize="11" fill={FGMUTE}>tempo →</text>

        <text x="60" y="124" fontSize="11" fill={TXA} fontWeight="700" textAnchor="end">Tx A</text>
        <line x1="80" y1="120" x2="820" y2="120" stroke={TXA} strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

        <text x="60" y="204" fontSize="11" fill={TXB} fontWeight="700" textAnchor="end">Tx B</text>
        <line x1="80" y1="200" x2="820" y2="200" stroke={TXB} strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

        <text x="60" y="294" fontSize="11" fill={ROW} fontWeight="700" textAnchor="end">linha id=1</text>
        <line x1="80" y1="290" x2="820" y2="290" stroke={ROW} strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

        {mvccStep >= 1 && (
          <g>
            <circle cx="150" cy="290" r="8" fill={ROW} opacity="0.9" />
            <text x="150" y="310" textAnchor="middle" fontSize="10" fill={ROW}>name=Ana</text>
            <text x="150" y="323" textAnchor="middle" fontSize="10" fill={FGMUTE}>xmin=100</text>
          </g>
        )}

        {mvccStep >= 2 && (
          <g>
            <circle cx="270" cy="120" r="8" fill={TXA} opacity="0.9" />
            <text x="270" y="108" textAnchor="middle" fontSize="10" fill={TXA} fontWeight="700">BEGIN A</text>
            <text x="270" y="96" textAnchor="middle" fontSize="10" fill={FGMUTE}>(snap=t1)</text>
            <line x1="270" y1="128" x2="270" y2="282" stroke={TXA} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
          </g>
        )}

        {mvccStep >= 3 && (
          <g>
            <circle cx="380" cy="200" r="8" fill={TXB} opacity="0.9" />
            <text x="380" y="188" textAnchor="middle" fontSize="10" fill={TXB} fontWeight="700">BEGIN B</text>
            <text x="380" y="176" textAnchor="middle" fontSize="10" fill={FGMUTE}>UPDATE name=Bia</text>
            <circle cx="380" cy="290" r="8" fill={TXB} opacity="0.7" />
            <text x="380" y="310" textAnchor="middle" fontSize="10" fill={TXB}>name=Bia</text>
            <text x="380" y="323" textAnchor="middle" fontSize="10" fill={FGMUTE}>xmin=101</text>
          </g>
        )}

        {mvccStep >= 4 && (
          <g>
            <circle cx="500" cy="120" r="8" fill={TXA} opacity="0.9" />
            <text x="500" y="108" textAnchor="middle" fontSize="10" fill={TXA} fontWeight="700">SELECT por A</text>
            <text x="500" y="96" textAnchor="middle" fontSize="10" fill={GRN}>lê v1: Ana ✓</text>
          </g>
        )}

        {mvccStep >= 5 && (
          <g>
            <circle cx="620" cy="200" r="8" fill={GRN} opacity="0.9" />
            <text x="620" y="188" textAnchor="middle" fontSize="10" fill={GRN} fontWeight="700">COMMIT B</text>
            <text x="620" y="176" textAnchor="middle" fontSize="10" fill={FGMUTE}>v2 visível pra futuras</text>
          </g>
        )}

        {mvccStep >= 6 && (
          <g>
            <circle cx="730" cy="120" r="8" fill={TXA} opacity="0.9" />
            <text x="730" y="108" textAnchor="middle" fontSize="10" fill={TXA} fontWeight="700">SELECT por A novamente</text>
            <text x="730" y="96" textAnchor="middle" fontSize="10" fill={GRN}>ainda Ana ✓ (snapshot)</text>
          </g>
        )}
      </svg>

      <div style={{ background: '#1e293b', border: `1px solid ${LINE}`, borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: FG, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: MVCC_INFO[mvccStep] }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => setMvccStep(p => Math.min(MVCC_INFO.length - 1, p + 1))}
          disabled={mvccStep === MVCC_INFO.length - 1}
          style={{
            background: mvccStep < MVCC_INFO.length - 1 ? `${C}20` : '#1e293b',
            border: `1.5px solid ${mvccStep < MVCC_INFO.length - 1 ? C : LINE}`,
            borderRadius: 6, color: mvccStep < MVCC_INFO.length - 1 ? C : FGMUTE,
            fontSize: 11, padding: '6px 16px',
            cursor: mvccStep === MVCC_INFO.length - 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: mvccStep === MVCC_INFO.length - 1 ? 0.4 : 1,
          }}
        >
          {'próximo passo →'}
        </button>
        <button
          onClick={() => setMvccStep(0)}
          style={{
            background: 'transparent', border: `1.5px solid ${LINE}`,
            borderRadius: 6, color: FGMUTE, fontSize: 11, padding: '6px 14px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          resetar
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 10 — B-Tree vs LSM-Tree
// ═══════════════════════════════════════════════════════════════════════════════

function BTreeLsmVisual() {
  return (
    <div style={{ background: '#0f172a', borderRadius: 12, padding: 24, fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: FG, marginBottom: 4 }}>B-Tree vs LSM-Tree</div>
        <div style={{ fontSize: 11, color: FGMUTE }}>Estruturas de indexação: trade-offs de leitura e escrita</div>
      </div>

      <svg viewBox="0 0 880 380" style={{ width: '100%', display: 'block', background: '#1e293b', borderRadius: 10, marginBottom: 14 }}>
        <text x="160" y="30" textAnchor="middle" fontSize="13" fill={C2} fontWeight="700">B-TREE</text>
        <text x="160" y="46" textAnchor="middle" fontSize="10" fill={FGMUTE}>Postgres, MySQL, SQLite</text>

        <rect x="90" y="55" width="140" height="28" rx="5" fill="none" stroke={C2} strokeWidth="1.5" />
        <text x="160" y="74" textAnchor="middle" fontSize="11" fill={C2} fontFamily="'JetBrains Mono', monospace">[ 25 | 50 | 75 ]</text>

        <line x1="120" y1="83" x2="85" y2="125" stroke={C2} strokeWidth="1" opacity="0.6" />
        <line x1="160" y1="83" x2="175" y2="125" stroke={C2} strokeWidth="1" opacity="0.6" />
        <line x1="200" y1="83" x2="285" y2="125" stroke={C2} strokeWidth="1" opacity="0.6" />

        <rect x="40" y="125" width="90" height="24" rx="4" fill="none" stroke={C2} strokeWidth="1.2" />
        <text x="85" y="141" textAnchor="middle" fontSize="10" fill={C2} fontFamily="'JetBrains Mono', monospace">[10|20]</text>

        <rect x="140" y="125" width="90" height="24" rx="4" fill="none" stroke={C2} strokeWidth="1.2" />
        <text x="185" y="141" textAnchor="middle" fontSize="10" fill={C2} fontFamily="'JetBrains Mono', monospace">[30|40]</text>

        <rect x="240" y="125" width="90" height="24" rx="4" fill="none" stroke={C2} strokeWidth="1.2" />
        <text x="285" y="141" textAnchor="middle" fontSize="10" fill={C2} fontFamily="'JetBrains Mono', monospace">[60|70]</text>

        <rect x="20" y="195" width="60" height="22" rx="3" fill={`${C2}20`} stroke={C2} strokeWidth="1" />
        <text x="50" y="210" textAnchor="middle" fontSize="9" fill={C2} fontFamily="'JetBrains Mono', monospace">5, 8</text>

        <rect x="90" y="195" width="60" height="22" rx="3" fill={`${C2}20`} stroke={C2} strokeWidth="1" />
        <text x="120" y="210" textAnchor="middle" fontSize="9" fill={C2} fontFamily="'JetBrains Mono', monospace">15, 18</text>

        <rect x="155" y="195" width="60" height="22" rx="3" fill={`${C2}20`} stroke={C2} strokeWidth="1" />
        <text x="185" y="210" textAnchor="middle" fontSize="9" fill={C2} fontFamily="'JetBrains Mono', monospace">28, 29</text>

        <rect x="220" y="195" width="60" height="22" rx="3" fill={`${C2}20`} stroke={C2} strokeWidth="1" />
        <text x="250" y="210" textAnchor="middle" fontSize="9" fill={C2} fontFamily="'JetBrains Mono', monospace">45, 48</text>

        <rect x="285" y="195" width="60" height="22" rx="3" fill={`${C2}20`} stroke={C2} strokeWidth="1" />
        <text x="315" y="210" textAnchor="middle" fontSize="9" fill={C2} fontFamily="'JetBrains Mono', monospace">65, 68</text>

        <rect x="350" y="195" width="60" height="22" rx="3" fill={`${C2}20`} stroke={C2} strokeWidth="1" />
        <text x="380" y="210" textAnchor="middle" fontSize="9" fill={C2} fontFamily="'JetBrains Mono', monospace">80, 95</text>

        <text x="30" y="250" fontSize="10" fill={AMB}>INSERT em página cheia → page split</text>
        <text x="30" y="268" fontSize="10" fill={GRN}>leitura: 3 page reads (O(log n)) ✓</text>

        <line x1="450" y1="20" x2="450" y2="360" stroke={LINE} strokeWidth="1.5" strokeDasharray="4 3" />

        <text x="670" y="30" textAnchor="middle" fontSize="13" fill={GRN} fontWeight="700">LSM-TREE</text>
        <text x="670" y="46" textAnchor="middle" fontSize="10" fill={FGMUTE}>Cassandra, RocksDB</text>

        <rect x="490" y="55" width="200" height="40" rx="5" fill={`${GRN}15`} stroke={GRN} strokeWidth="1.5" />
        <text x="590" y="71" textAnchor="middle" fontSize="11" fill={GRN} fontWeight="700">MEMTABLE</text>
        <text x="590" y="86" textAnchor="middle" fontSize="10" fill={FGMUTE} fontFamily="'JetBrains Mono', monospace">sorted · [10,25,30,47,60]</text>

        <text x="590" y="112" textAnchor="middle" fontSize="10" fill={FGMUTE}>flush ↓</text>

        <rect x="470" y="120" width="80" height="22" rx="3" fill={`${GRN}20`} stroke={GRN} strokeWidth="1" />
        <text x="510" y="135" textAnchor="middle" fontSize="9" fill={GRN}>SST L0a</text>

        <rect x="560" y="120" width="80" height="22" rx="3" fill={`${GRN}20`} stroke={GRN} strokeWidth="1" />
        <text x="600" y="135" textAnchor="middle" fontSize="9" fill={GRN}>SST L0b</text>

        <rect x="650" y="120" width="80" height="22" rx="3" fill={`${GRN}20`} stroke={GRN} strokeWidth="1" />
        <text x="690" y="135" textAnchor="middle" fontSize="9" fill={GRN}>SST L0c</text>

        <text x="590" y="165" textAnchor="middle" fontSize="10" fill={FGMUTE}>compaction ↓</text>

        <rect x="490" y="175" width="240" height="22" rx="3" fill={`${GRN}15`} stroke={GRN} strokeWidth="1.2" />
        <text x="610" y="190" textAnchor="middle" fontSize="9" fill={GRN}>SST L1 (merged + dedup)</text>

        <rect x="490" y="208" width="240" height="22" rx="3" fill={`${GRN}10`} stroke={GRN} strokeWidth="1" opacity="0.7" />
        <text x="610" y="223" textAnchor="middle" fontSize="9" fill={GRN} opacity="0.7">SST L2</text>

        <text x="470" y="255" fontSize="10" fill={RED}>write amp ALTA (compaction)</text>
        <text x="470" y="273" fontSize="10" fill={GRN}>writes sequenciais (rapidíssimo) ✓</text>
        <text x="470" y="291" fontSize="10" fill={FGMUTE}>bloom filter mitiga leitura</text>
      </svg>

      <div style={{ background: '#1e293b', border: `1px solid ${LINE}`, borderRadius: 8, padding: '10px 14px', marginBottom: 10, fontSize: 12, color: FG, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: '<strong>Regra de bolso:</strong> read-heavy + dados que mudam em lugares aleatórios → B-tree. Write-heavy + time-séries ou logs → LSM.' }}
      />

      <div style={{ fontSize: 12, color: FGMUTE, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: '<strong>B-tree</strong> é in-place: cada UPDATE reescreve a página onde a chave mora. Bom pra leitura (3-4 IOs até o leaf). <strong>LSM</strong> nunca escreve in-place: tudo vai pra um <code>memtable</code> em RAM e, quando enche, flusha pra um SSTable imutável. Isso dá escritas <strong>sequenciais</strong>. O preço é <strong>write amplification</strong> durante compaction. Bloom filters ajudam a pular SSTables sem a chave.' }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function PostgresqlVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'query-pipeline',
      title: 'Query Pipeline',
      subtitle: 'Parse → Analyze → Rewrite → Plan → Execute → Return',
      accent: C,
      component: (
        <LayerStack
          layers={QUERY_PIPELINE_LAYERS}
          accentColor={C}
          bgColor={BG}
          direction="top-down"
        />
      ),
    },
    {
      id: 'index-types',
      title: 'Tipos de Índice',
      subtitle: 'B-Tree vs GIN vs GiST vs BRIN vs Hash',
      accent: C2,
      component: (
        <ComparisonTable
          options={INDEX_OPTIONS}
          criteria={INDEX_CRITERIA}
          accentColor={C2}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'explain-analyze',
      title: 'EXPLAIN ANALYZE',
      subtitle: 'Custo por nó de execução — heatmap de intensidade',
      accent: AMB,
      component: (
        <HeatMap
          rows={EXPLAIN_ROWS}
          cols={EXPLAIN_COLS}
          data={EXPLAIN_DATA}
          accentColor={C}
          bgColor={BG}
          lowColor="#1e3a5f"
          highColor={C}
          title="Custo por Nó de Execução"
          description="Valores de 0 a 10 representam custo relativo. Hover para ver o valor real do plano."
          valueFormatter={(v) => v.toFixed(0)}
        />
      ),
    },
    {
      id: 'join-algorithms',
      title: 'JOIN Algorithms',
      subtitle: 'Nested Loop vs Hash Join vs Merge Join',
      accent: GRN,
      component: (
        <ComparisonTable
          options={JOIN_OPTIONS}
          criteria={JOIN_CRITERIA}
          accentColor={GRN}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'wal-replication',
      title: 'WAL & Replicação',
      subtitle: 'Write-Ahead Log → Streaming Replication → Hot Standby',
      accent: AMB,
      component: (
        <SequenceDiagram
          actors={WAL_ACTORS}
          messages={WAL_MESSAGES}
          groups={WAL_GROUPS}
          accentColor={AMB}
          bgColor={BG}
          title="WAL & Streaming Replication"
          description="Fluxo completo do commit no primary até a aplicação do WAL na réplica"
        />
      ),
    },
    {
      id: 'mvcc-isolation',
      title: 'MVCC & Isolamento',
      subtitle: 'READ COMMITTED → REPEATABLE READ → SERIALIZABLE',
      accent: C,
      component: (
        <LayerStack
          layers={MVCC_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'N+1, SELECT *, FK sem índice, sem pool, bloat',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={PG_ANTIPATTERNS}
          accentColor={RED}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'connection-pooling',
      title: 'Connection Pooling',
      subtitle: 'App pool → PgBouncer → PostgreSQL',
      accent: C2,
      component: (
        <LayerStack
          layers={POOLING_LAYERS}
          accentColor={C2}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'mvcc-step-by-step',
      title: 'MVCC Passo a Passo',
      subtitle: 'Como versões de linha garantem isolamento sem locks de leitura',
      accent: C,
      component: <MVCCVisual />,
    },
    {
      id: 'btree-vs-lsm',
      title: 'B-Tree vs LSM-Tree',
      subtitle: 'Trade-offs de leitura e escrita entre as duas estruturas de indexação',
      accent: GRN,
      component: <BTreeLsmVisual />,
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
