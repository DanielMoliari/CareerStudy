'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta Elasticsearch ──────────────────────────────────────────────────────
const C    = '#FEC514'  // Elasticsearch yellow — NUNCA omitir
const C2   = '#00bfb3'  // Elastic teal
const GRN  = '#4ade80'
const SKY  = '#38bdf8'
const PRP  = '#a78bfa'
const RED  = '#ef4444'

void C2

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Elasticsearch em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: inverted index, BM25, text vs keyword, bool query, aggregations, sharding, ILM, reindex sem downtime, autocomplete, scroll vs search_after, nested vs parent-child, geo queries e mais.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Query DSL, mappings, aggregations e ILM numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: bool query (must/filter/should/must_not), tipos de campo (text/keyword/date/geo), aggregations por categoria, ILM phases, APIs de diagnóstico, aliases e reindex.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os truques que grudam Elasticsearch na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'text vs keyword, filter vs must, shard count imutável, ILM phases, search_after vs scroll. Truques verbais para os pontos mais cobrados em entrevistas.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 6 erros mais comuns com Elasticsearch',
    type: 'antipatterns',
    pages: 3,
    description: 'Terms agg em campo text, dynamic mapping com tipo errado, sem ILM para logs, must onde filter seria melhor, _source: false, paginação com from+size profundo.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref — Query DSL',
    subtitle: 'Bool query, aggregations, mappings e APIs de diagnóstico',
    type: 'quick-ref',
    pages: 2,
    description: 'Referência rápida: bool query completo, tipos de aggregations, mapping types, APIs de cluster health e diagnóstico condensados.',
    icon: '05',
    goal: 'Consulta de queries',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Como funciona a busca full-text no Elasticsearch?',
    a: 'Query passa pelo mesmo analyzer que indexou: tokenização, lowercase, stemming. Termos resultantes são buscados no inverted index. Para cada documento com os termos, calcula score BM25. <strong>Bool query:</strong> must (obrigatório, afeta score), filter (obrigatório, não afeta score, cacheado), should (opcional, boost no score), must_not (exclusão). Use filter para datas, status e flags — é cacheado e muito mais rápido que must.',
    tip: 'filter é cacheado como bitset pelo ES. must recalcula BM25 a cada query. Para filtros que não precisam de relevância, sempre use filter — performance 5-10× melhor.',
  },
  {
    level: 'Senior',
    q: 'Quando NÃO usar Elasticsearch?',
    a: '<strong>Source of truth transacional:</strong> ES não tem ACID — use como projeção secundária do banco primário. <strong>Dataset pequeno:</strong> Postgres com pg_trgm resolve sem complexidade operacional de cluster. <strong>Latência de indexação zero:</strong> near real-time (~1s de delay) é inerente ao Lucene. <strong>JOINs relacionais complexos:</strong> nested objects e parent-child têm alto custo. <strong>Updates frequentes de documentos inteiros:</strong> delete + reindex de cada update é caro.',
    tip: 'A pergunta-chave: "Se o ES ficar inconsistente por alguns segundos, o negócio quebra?" Se sim, ES não é a fonte de verdade — é uma projeção de busca do banco primário.',
  },
  {
    level: 'Senior',
    q: 'Explique a diferença entre text e keyword no mapping.',
    a: '<strong>text:</strong> passa pelo analyzer antes de indexar. "Hello World" → tokens ["hello", "world"]. Busca full-text (match, multi_match). Não é agregável por default. <strong>keyword:</strong> indexado raw, case-sensitive. Filtros exatos (term), sort, aggregations. <strong>Multi-field (padrão recomendado):</strong> "title": {"type": "text", "fields": {"keyword": {"type": "keyword"}}}. Use title para match, title.keyword para sort e terms agg.',
    tip: 'Multi-field é o padrão — não escolha entre text e keyword, use os dois. title para match, title.keyword para terms agg e sort. 80% dos bugs de mapping vêm de confundir os dois.',
  },
  {
    level: 'Senior',
    q: 'Como funciona sharding e qual o tamanho ideal de shard?',
    a: 'Índice dividido em N <strong>primary shards</strong> na criação — imutável. Cada primary tem M <strong>replica shards</strong> (HA + read scaling). Documentos roteados via hash(_id) % num_shards. <strong>Tamanho ideal: 20-50GB por shard.</strong> Shards muito pequenos = overhead de coordenação. Shards muito grandes = recovery lento. Fórmula: num_shards = ceil(dataset_GB / 30GB). Overhead por shard: ~30MB de JVM heap.',
    tip: 'Over-sharding é problema real: 1000 shards de 1MB é pior que 10 shards de 100MB. Shard count é imutável — planeje com cuidado antes de criar o índice.',
  },
  {
    level: 'Senior',
    q: 'Como implementar paginação profunda eficiente?',
    a: '<strong>from + size:</strong> simples mas ineficiente — busca top 10.000 e descarta. Limitado por max_result_window (default 10.000). <strong>scroll API:</strong> snapshot do índice, contexto no servidor. Bom para dump, ruim para paginação interativa. <strong>search_after (recomendado para UI):</strong> usa valores do último resultado como cursor. Stateless, eficiente, qualquer tamanho. Requer sort estável com _id como tiebreaker para paginação determinística.',
    tip: 'search_after com _id como tiebreaker garante ordem determinística mesmo com índice sendo atualizado. scroll é para processos batch, não para UI.',
  },
  {
    level: 'Senior',
    q: 'O que é ILM e como estruturar para logs?',
    a: 'ILM automatiza gestão de índices: <strong>hot</strong> (escrita intensa, SSD), <strong>warm</strong> (leitura, forcemerge para 1 segmento, réplica opcional removida), <strong>cold</strong> (acesso raro, searchable snapshot em object storage), <strong>frozen</strong> (quase sem acesso), <strong>delete</strong> (expiração automática). Para logs: Data Streams com rollover automático (50GB ou 1 dia). Alias único aponta para índice corrente — transparente para a aplicação.',
    tip: 'Rollover é o mecanismo chave: ILM cria alias que aponta para o índice corrente. Quando rola, o alias aponta para o novo — a aplicação não precisa saber qual índice usar.',
  },
  {
    level: 'Senior',
    q: 'Como fazer reindex sem downtime?',
    a: '<strong>Blue/Green com alias:</strong> 1) Criar índice v2 com mapping correto. 2) POST /_reindex de v1 para v2. 3) Reindex delta: docs criados durante a cópia (filtrar por timestamp). 4) Swap atômico do alias: remove alias de v1, adiciona em v2. 5) Delete v1. Use wait_for_completion=false para reindex assíncrono + tasks API para monitorar. Sempre use aliases em produção — nunca aponte a aplicação direto para o índice.',
    tip: 'Sempre use aliases em produção — são o equivalente ao DNS para índices Elasticsearch. Swap de alias é atômico — zero downtime garantido.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o BM25 e como fazer relevance tuning?',
    a: 'BM25 combina TF (frequência do termo) com saturação (k1=1.2) e normalização por tamanho de documento (b=0.75). <strong>Tuning:</strong> multi_match com boost por campo (title^3, description^1). function_score para adicionar sinais externos: decay por data, popularidade. <strong>Debug:</strong> explain: true mostra cálculo completo de score por campo. Logging de impressões + cliques para análise offline. ES Learning to Rank para modelos ML supervisionados.',
    tip: 'explain: true é sua ferramenta de debug de relevância — mostra o cálculo BM25 completo por campo e por documento. Nunca use em produção (overhead alto).',
  },
  {
    level: 'Pleno',
    q: 'Como estruturar aggregations para analytics?',
    a: '<strong>Bucket agg</strong> (groups): terms (por valor), date_histogram (por intervalo de tempo), range (por faixa numérica). <strong>Metric agg</strong> (cálculos): avg, sum, max, min, percentiles, cardinality (HyperLogLog). <strong>Pipeline agg</strong> (sobre outras aggs): cumulative_sum, derivative, moving_avg. Composição: bucket → metric (sub-agg dentro de cada bucket). Para performance: use filter context antes das aggs para reduzir o conjunto de documentos.',
    tip: 'Aggregations e busca simultâneas em uma única query: a query raiz filtra os docs para agg E busca — uma única passagem pelos shards. Muito eficiente.',
  },
  {
    level: 'Senior',
    q: 'O que são nested objects e quando usar parent-child?',
    a: '<strong>Flat objects (default):</strong> arrays são achatados — queries cruzam campos de objetos diferentes (bug). <strong>Nested:</strong> cada objeto é documento Lucene oculto, queries nested garantem correlação de campos. Custo: mais documentos, queries mais lentas. <strong>Parent-child (join field):</strong> documentos relacionados com atualizações independentes. Filho e pai devem estar no mesmo shard. Custo maior que nested.',
    tip: 'Nested para arrays onde a correlação de campos importa (atributos de produto). Parent-child quando o filho muda frequentemente sem alterar o pai (comentários de post).',
  },
  {
    level: 'Senior',
    q: 'Como implementar autocomplete eficiente?',
    a: '<strong>completion suggester:</strong> campo tipo "completion", FST (Finite State Transducer) em memória — latência mínima. Suporta fuzzy e context suggesters (filtro por categoria). <strong>search_as_you_type (ES 7.2+):</strong> tipo de campo dedicado, suporta middle-of-word matching, equilíbrio entre performance e flexibilidade. <strong>edge_ngram analyzer:</strong> indexa prefixos — maior índice, mas permite scoring customizado complexo. Recomendação: search_as_you_type para maioria dos casos.',
    tip: 'completion suggester é o mais rápido (FST in-memory) mas o menos flexível. search_as_you_type é o melhor equilíbrio para autocomplete em produção.',
  },
  {
    level: 'Senior',
    q: 'Como monitorar saúde de um cluster Elasticsearch?',
    a: '<strong>GET /_cluster/health:</strong> green (todos shards OK), yellow (réplicas faltando, primaries OK), red (primaries faltando — perda de dados possível). <strong>Métricas críticas:</strong> JVM heap acima de 75% = risco de GC pauses. Thread pool rejections = sobrecarga. Segment count alto = force merge necessário. Search latency p99 via /_stats. <strong>Ferramentas:</strong> Kibana Stack Monitoring, GET /_cat/nodes?v, GET /_cat/shards?v.',
    tip: 'Yellow é comum e não crítico — réplicas não alocadas. Red é emergência — primary shards faltando. Nunca ignore red: o cluster não tem redundância e pode perder dados.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'bool query', sig: '{"bool": {"must": [...], "filter": [...], "should": [...], "must_not": [...]}}', desc: 'Combina condições. must: obrigatório + afeta score. filter: obrigatório + cacheado + sem score. should: boost. must_not: exclusão.' },
  { name: 'match / multi_match', sig: '{"match": {"title": "query"}} | {"multi_match": {"query": "q", "fields": ["title^3", "body"]}}', desc: 'Busca full-text analisada. multi_match com boost por campo (^N). Passa pelo analyzer.' },
  { name: 'term / terms', sig: '{"term": {"status": "published"}} | {"terms": {"tag": ["redis", "cache"]}}', desc: 'Filtro exato em campo keyword. Sem analyzer. Para campos text use match (não term).' },
  { name: 'range', sig: '{"range": {"date": {"gte": "2024-01-01", "lte": "now"}}}', desc: 'Intervalo em campos numéricos ou de data. Suporta now, now-7d, now/d (truncar para dia).' },
  { name: 'terms aggregation', sig: '{"aggs": {"by_cat": {"terms": {"field": "category.keyword", "size": 20}}}}', desc: 'Group by valor de campo keyword. size limita número de buckets. Sempre .keyword para terms agg.' },
  { name: 'date_histogram agg', sig: '{"date_histogram": {"field": "date", "calendar_interval": "month"}}', desc: 'Agrupa por intervalo de tempo. calendar_interval: day, week, month, year. fixed_interval para intervalos fixos.' },
  { name: 'search_after', sig: '{"search_after": [lastVal, lastId], "sort": [{"date": "desc"}, {"_id": "asc"}]}', desc: 'Paginação stateless e eficiente. Requer sort estável com _id como tiebreaker. Substitui scroll para UIs.' },
  { name: 'reindex API', sig: 'POST /_reindex {"source": {"index": "old"}, "dest": {"index": "new"}}', desc: 'Copia documentos entre índices. Use aliases para swap zero-downtime. wait_for_completion=false para async.' },
  { name: 'aliases', sig: 'POST /_aliases {"actions": [{"remove": {"index": "v1", "alias": "my_index"}}, {"add": {"index": "v2", "alias": "my_index"}}]}', desc: 'Swap atômico de índices. Aplicação só usa o alias — transparente para mudanças de índice.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Terms agg em campo text — use .keyword subfield' },
  { ok: false, t: 'Dynamic mapping sem controle — defina mappings explícitos antes de indexar' },
  { ok: false, t: 'Filtros (status, data) em must — devem ir em filter (cacheado, sem score)' },
  { ok: false, t: 'from + size para paginação profunda — use search_after' },
  { ok: false, t: '_source: false sem pensar — impede reindex, update e highlight' },
  { ok: false, t: 'Número par de master-eligible nodes — split brain. Use 3 ou 5.' },
  { ok: true, t: 'Multi-field: "title" como text + "title.keyword" como keyword' },
  { ok: true, t: 'filter context para filtros binários — cacheado e sem recálculo de score' },
  { ok: true, t: 'ILM + Data Streams para logs e time-series' },
  { ok: true, t: 'Aliases em produção — swap atômico sem downtime' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'text vs keyword: "text Transforma, keyword Conserva"',
    trick: 'T=Transforma, K=Konserva',
    expansion: [
      ['text Transforma', 'Analyzer: tokeniza, lowercase, stemming → tokens individuais'],
      ['text usa', 'match, multi_match, highlight — busca full-text'],
      ['keyword Conserva', 'Raw string, sem analyzer, case-sensitive'],
      ['keyword usa', 'term, terms, sort, aggregations — filtros exatos'],
    ],
    explanation: 'A distinção mais crítica do ES. 80% dos bugs de mapping vêm de confundir text e keyword.',
    example: '"Hello World" como text → ["hello", "world"]. Como keyword → "Hello World" (inteiro).',
    why: 'Toda entrevista sênior de ES pergunta sobre text vs keyword. É a fundação de tudo mais.',
  },
  {
    label: 'filter vs must: "Filter é Fast, Must é Matemática"',
    trick: 'F=Fast (cache), M=Math (BM25)',
    expansion: [
      ['filter Fast', 'Não afeta score, resultado cacheado como bitset'],
      ['filter usa', 'Condições binárias: status, data, categoria, flags'],
      ['must Math', 'Calcula BM25 score a cada query, não cacheado'],
      ['must usa', 'Termos de busca do usuário onde relevância importa'],
    ],
    explanation: 'filter é 5-10× mais rápido que must para filtros binários. Sempre use filter para campos não-full-text.',
    example: 'Busca de produtos: must match title "redis", filter term status "published", filter range price 0..100.',
    why: 'Usar must para filtros é o erro de performance mais comum em ES. filter context + bitset cache é a otimização mais fácil.',
  },
  {
    label: 'Shard count: "Escolha uma vez, Viva com ela para sempre"',
    trick: 'Shard count = imutável = pense antes',
    expansion: [
      ['Imutável', 'Shard count é fixado na criação do índice — mudança exige reindex completo'],
      ['Regra geral', '20-50GB por shard. ceil(dataset_GB / 30GB) = num_shards'],
      ['Overhead', '~30MB de JVM heap por shard — over-sharding é problema real'],
      ['Solução', 'ILM + rollover para logs — novos índices com shard count correto'],
    ],
    explanation: 'Shard count é a decisão mais irreversível do ES. Planeje antes de criar o índice.',
    example: '300GB de logs? ceil(300/30) = 10 primary shards. 10TB? Usar ILM com rollover a 50GB.',
    why: 'Candidatos frequentemente tratam shard count como mutável. Saber que é imutável é sinal de experiência.',
  },
  {
    label: 'ILM Phases: "Hot Warn Cold Frozen Delete — Herd Wants Coffee, Fred Delivers"',
    trick: 'H-W-C-F-D',
    expansion: [
      ['Hot', 'Escrita e leitura intensas. SSD, todos os shards ativos. Rollover por tamanho ou idade.'],
      ['Warm', 'Apenas leitura. forcemerge para 1 segmento. Pode remover réplicas para economizar.'],
      ['Cold', 'Acesso raro. Searchable snapshots em object storage. Muito mais barato.'],
      ['Frozen', 'Quase sem acesso. Busca muito lenta. Custo mínimo.'],
    ],
    explanation: 'ILM move índices automaticamente entre fases baseado em tempo ou tamanho.',
    example: 'Logs: hot (7 dias/50GB) → warm (30 dias) → cold (90 dias) → delete.',
    why: 'ILM é obrigatório para qualquer uso sério de ES com logs. Candidatos sem ILM mostram falta de experiência operacional.',
  },
  {
    label: 'Paginação: "from é Falso, search_after é Real, scroll é Batch"',
    trick: 'F=Falso (ineficiente), SA=Stateless, SC=Snapshot',
    expansion: [
      ['from + size', 'Busca top N e descarta — O(from+size) por shard. Limite: 10.000. Ineficiente para páginas profundas.'],
      ['search_after', 'Cursor pelo último valor — stateless, eficiente. Precisa de sort estável. Para UI.'],
      ['scroll', 'Snapshot do índice, contexto no servidor. Para dumps batch, não para UI interativa.'],
    ],
    explanation: 'Escolha pelo uso: UI interativa → search_after. Dump completo → scroll. Paginação simples (< page 10) → from+size.',
    example: 'E-commerce com 1M produtos: from 990, size 10 = ES busca 1000 por shard, descarta 990. search_after não tem esse custo.',
    why: 'from+size profundo é problema silencioso de performance. search_after é a solução correta mas requer sort estável.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Terms agg em campo text',
    badDesc: 'Campo text é tokenizado — terms agg retorna tokens, não valores originais',
    badCode: [
      { t: '// ❌ terms agg em campo text — erro ou resultado errado\n', c: RED },
      { t: '{"aggs": {"categorias": {\n', c: '#ef4444' },
      { t: '  "terms": {"field": "category"}}}  // text field!\n', c: '#ef4444' },
      { t: '// Resultado: "action", "in", "redis" (tokens)\n', c: RED },
      { t: '// Não: "Redis in Action" (valor original)', c: '#e2e8f0' },
    ],
    goodDesc: 'Use .keyword subfield para aggregations e sort exatos',
    goodCode: [
      { t: '// ✅ .keyword para agg e sort\n', c: GRN },
      { t: '{"aggs": {"categorias": {\n', c: '#e2e8f0' },
      { t: '  "terms": {"field": "category.keyword"}}}  // keyword!\n', c: '#4ade80' },
      { t: '// Mapping: "category": {"type": "text",\n', c: GRN },
      { t: '//   "fields": {"keyword": {"type": "keyword"}}}', c: GRN },
    ],
    why: 'text fields são tokenizados. "Redis in Action" → tokens individuais. terms agg retornaria "redis", "in", "action" separados. Keyword preserva o valor original.',
  },
  {
    title: 'Dynamic mapping sem controle',
    badDesc: 'ES infere tipo pelo primeiro documento — campo numérico como string gera campo text não agregável',
    badCode: [
      { t: '// ❌ Primeiro doc com "price" como string\n', c: RED },
      { t: 'POST /products/_doc {"price": "29.99", "name": "Redis"}\n', c: '#ef4444' },
      { t: '// Dynamic mapping cria price como text!\n', c: RED },
      { t: '// Tentativa de range agg em price → erro\n', c: RED },
      { t: '// Correção: reindex completo (pode demorar horas)', c: '#e2e8f0' },
    ],
    goodDesc: 'Defina mappings explícitos ANTES de indexar qualquer dado',
    goodCode: [
      { t: '// ✅ Mapping explícito antes de indexar\n', c: GRN },
      { t: 'PUT /products {"mappings": {"properties": {\n', c: '#e2e8f0' },
      { t: '  "price": {"type": "float"},\n', c: '#4ade80' },
      { t: '  "name": {"type": "text", "fields":\n', c: '#e2e8f0' },
      { t: '    {"keyword": {"type": "keyword"}}},\n', c: '#4ade80' },
      { t: '  "status": {"type": "keyword"}}}}\n', c: '#4ade80' },
    ],
    why: 'Dynamic mapping é conveniente para protótipos, perigoso em produção. Tipo errado = reindex completo. Defina mappings antes do primeiro documento.',
  },
  {
    title: 'Filtros em must em vez de filter',
    badDesc: 'must recalcula BM25 e não é cacheado — filtros binários devem ir em filter context',
    badCode: [
      { t: '// ❌ status e date em must — lento, sem cache\n', c: RED },
      { t: '{"query": {"bool": {"must": [\n', c: '#ef4444' },
      { t: '  {"match": {"title": "redis"}},\n', c: '#e2e8f0' },
      { t: '  {"term": {"status": "published"}},  // ← deve ser filter!\n', c: '#ef4444' },
      { t: '  {"range": {"date": {"gte": "now-7d"}}}  // ← filter!\n', c: '#ef4444' },
    ],
    goodDesc: 'Filtros binários em filter context — cacheados e sem recálculo de score',
    goodCode: [
      { t: '// ✅ must apenas para busca full-text com relevância\n', c: GRN },
      { t: '{"query": {"bool": {\n', c: '#e2e8f0' },
      { t: '  "must": [{"match": {"title": "redis"}}],\n', c: '#e2e8f0' },
      { t: '  "filter": [\n', c: '#4ade80' },
      { t: '    {"term": {"status": "published"}},\n', c: '#4ade80' },
      { t: '    {"range": {"date": {"gte": "now-7d"}}}]}}}\n', c: '#4ade80' },
    ],
    why: 'filter context não afeta score e é cacheado como bitset. Filtros de status/data em must recalculam BM25 desnecessariamente — 5-10× mais lento.',
  },
  {
    title: 'Paginação profunda com from + size',
    badDesc: 'from: 9990, size: 10 faz ES buscar 10.000 docs e descartar 9.990 em cada shard',
    badCode: [
      { t: '// ❌ Paginação profunda com from+size\n', c: RED },
      { t: '{"from": 9990, "size": 10, "query": {...}}\n', c: '#ef4444' },
      { t: '// ES busca 10.000 por shard, descarta 9.990\n', c: RED },
      { t: '// Limite: max_result_window = 10.000\n', c: RED },
      { t: '// Resultado: timeout ou error 400', c: '#e2e8f0' },
    ],
    goodDesc: 'search_after com sort estável para paginação eficiente e stateless',
    goodCode: [
      { t: '// ✅ search_after — stateless e eficiente\n', c: GRN },
      { t: '{"size": 10,\n', c: '#e2e8f0' },
      { t: ' "sort": [{"date": "desc"}, {"_id": "asc"}],\n', c: GRN },
      { t: ' "search_after": ["2024-01-15T10:00:00Z", "doc-id-123"]}\n', c: GRN },
      { t: '// Usa valores do último resultado como cursor\n', c: GRN },
      { t: '// Não tem limite de profundidade', c: GRN },
    ],
    why: 'from+size é O(from+size) por shard — page 1000 com 10 resultados = busca 10.010 docs por shard. search_after usa ponteiro no índice — eficiente independente da página.',
  },
]

// ── Dados: Quick Ref — Query DSL ──────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Bool Query',
        entries: [
          { key: 'must: [...]', value: 'Obrigatório + afeta score BM25', badge: 'afeta score', badgeColor: '#ef4444' },
          { key: 'filter: [...]', value: 'Obrigatório + cacheado + sem score', badge: 'cacheado', badgeColor: '#4ade80' },
          { key: 'should: [...]', value: 'Opcional — boost no score se satisfaz' },
          { key: 'must_not: [...]', value: 'Exclusão — sem contribuição ao score', badge: 'cacheado', badgeColor: '#4ade80' },
          { key: 'minimum_should_match', value: 'Mínimo de claúsulas should obrigatórias' },
        ],
      },
      {
        title: 'Leaf Queries',
        entries: [
          { key: 'match: {field: query}', value: 'Full-text com analyzer. Para campos text.' },
          { key: 'multi_match: {query, fields: [f^n]}', value: 'match em múltiplos campos com boost (^N)' },
          { key: 'term: {field: value}', value: 'Filtro exato. Para campos keyword.' },
          { key: 'terms: {field: [v1, v2]}', value: 'IN list. Filtro exato em keyword.' },
          { key: 'range: {field: {gte, lte}}', value: 'Intervalo em numérico ou data. now, now-7d' },
          { key: 'exists: {field: f}', value: 'Documento tem o campo (não null)' },
          { key: 'prefix: {field: prefix}', value: 'Começa com — em campo keyword' },
          { key: 'fuzzy: {field: {value, fuzziness}}', value: 'Tolerância a erros de digitação' },
        ],
      },
      {
        title: 'APIs de Diagnóstico',
        entries: [
          { key: 'GET /_cluster/health', value: 'Status green/yellow/red do cluster' },
          { key: 'GET /_cat/nodes?v', value: 'Lista nós com métricas (heap, cpu, load)' },
          { key: 'GET /_cat/shards?v', value: 'Lista shards e estado (STARTED, UNASSIGNED)' },
          { key: 'GET /index/_stats', value: 'Métricas do índice: docs, store, search latency' },
          { key: 'GET /index/_mapping', value: 'Mapping atual do índice' },
          { key: 'POST /index/_analyze', value: 'Testa analyzer: {analyzer, text}' },
          { key: 'GET /index/_explain/id', value: 'Score de um documento específico' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Aggregations',
        entries: [
          { key: 'terms: {field: f.keyword, size: N}', value: 'Group by valor. Sempre .keyword para keyword field.', badge: 'bucket', badgeColor: '#6366f1' },
          { key: 'date_histogram: {field, calendar_interval}', value: 'Group by tempo: day, week, month, year', badge: 'bucket', badgeColor: '#6366f1' },
          { key: 'range: {field, ranges: [{to}, {from,to}]}', value: 'Group por faixas numéricas', badge: 'bucket', badgeColor: '#6366f1' },
          { key: 'avg / sum / min / max: {field}', value: 'Estatísticas simples sobre campo numérico', badge: 'metric', badgeColor: '#4ade80' },
          { key: 'percentiles: {field, percents: [50,95,99]}', value: 'Distribuição de percentis', badge: 'metric', badgeColor: '#4ade80' },
          { key: 'cardinality: {field}', value: 'Contagem aproximada de únicos (HyperLogLog)', badge: 'metric', badgeColor: '#4ade80' },
          { key: 'cumulative_sum: {buckets_path}', value: 'Soma acumulada de outra agg', badge: 'pipeline', badgeColor: '#f59e0b' },
          { key: 'derivative: {buckets_path}', value: 'Taxa de variação entre buckets', badge: 'pipeline', badgeColor: '#f59e0b' },
        ],
      },
      {
        title: 'Mapping Types',
        entries: [
          { key: 'text', value: 'Busca full-text. Passa pelo analyzer.' },
          { key: 'keyword', value: 'Filtro exato, sort, agg. Sem analyzer.' },
          { key: 'date', value: 'Data/hora. Suporta now-7d, formato customizado.' },
          { key: 'integer / long / float / double', value: 'Numéricos. Para range agg e sort.' },
          { key: 'boolean', value: 'true/false. Filtro exato.' },
          { key: 'geo_point', value: 'Lat/lon. geo_distance, geo_bounding_box.' },
          { key: 'nested', value: 'Array de objetos com correlação de campos.' },
          { key: 'completion', value: 'Autocomplete via FST in-memory.' },
        ],
      },
      {
        title: 'ILM & Index Management',
        entries: [
          { key: 'PUT /_ilm/policy/name {...}', value: 'Cria política ILM com fases' },
          { key: 'hot → rollover', value: 'max_size: 50gb ou max_age: 1d' },
          { key: 'warm → forcemerge', value: 'max_num_segments: 1 após movimentação' },
          { key: 'cold → searchable_snapshot', value: 'Object storage — acesso raro' },
          { key: 'delete → min_age: 90d', value: 'Expiração automática do índice' },
          { key: 'POST /_aliases', value: 'Swap atômico: remove old + add new' },
          { key: 'POST /_reindex?wait_for_completion=false', value: 'Reindex async — monitore com tasks API' },
        ],
      },
    ],
  },
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Elasticsearch',
    stackLabel: 'Database · Search Engine',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Elasticsearch',
    accentColor: C,
    stackLabel: 'Database · Search Engine',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['text', 'Busca full-text com analyzer — match, multi_match, highlight'],
        ['keyword', 'Filtro exato, sort, aggregations — sem analyzer'],
        ['filter context', 'Cacheado como bitset — para condições binárias'],
        ['must context', 'Afeta score BM25 — apenas para relevância'],
        ['ILM + Data Streams', 'Gestão automática do ciclo de vida de índices'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'filter context para filtros binários — 5-10× mais rápido que must',
        '.keyword para terms agg e sort — nunca em campo text',
        'search_after para paginação profunda — stateless e eficiente',
        'Defina mappings explícitos antes do primeiro documento',
        'ILM + Data Streams para logs — evita índice crescendo indefinidamente',
        '20-50GB por shard — over-sharding é problema real de performance',
      ],
      patterns: [
        {
          name: 'Bool query completa',
          code: `{
  "query": {
    "bool": {
      "must": [{"multi_match": {
        "query": "redis cache",
        "fields": ["title^3", "body"]
      }}],
      "filter": [
        {"term": {"status": "published"}},
        {"range": {"date": {"gte": "now-30d"}}}
      ],
      "should": [{"term": {"tags": "performance"}}]
    }
  }
}`,
          desc: 'must para relevância; filter para condições binárias cacheadas',
        },
        {
          name: 'Reindex com alias (zero-downtime)',
          code: `// 1. Criar índice v2 com mapping correto
PUT /products_v2 { "mappings": {...} }

// 2. Reindex assíncrono
POST /_reindex?wait_for_completion=false
{ "source": {"index": "products_v1"},
  "dest": {"index": "products_v2"} }

// 3. Swap atômico do alias
POST /_aliases {"actions": [
  {"remove": {"index": "products_v1", "alias": "products"}},
  {"add": {"index": "products_v2", "alias": "products"}}
]}`,
          desc: 'Alias como contrato — a aplicação nunca vê a migração',
        },
        {
          name: 'search_after paginação',
          code: `// Primeira página
{"size": 10,
 "sort": [{"date": "desc"}, {"_id": "asc"}],
 "query": {...}}

// Página seguinte — usa valores do último hit
{"size": 10,
 "sort": [{"date": "desc"}, {"_id": "asc"}],
 "search_after": ["2024-01-15T10:00:00Z", "abc123"],
 "query": {...}}`,
          desc: 'Cursor stateless — eficiente para qualquer profundidade',
        },
      ],
      mentalModels: [
        'text Transforma (analyzer), keyword Conserva (raw) — multi-field para ambos',
        'filter é Fast (cache + sem score), must é Math (BM25) — filtros binários → filter',
        'Shard count é imutável — planeje antes, use ILM para rollover',
        'Alias = DNS do índice — swap atômico para zero-downtime',
        'search_after para UI, scroll para dumps — from+size para páginas rasas apenas',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Elasticsearch',
    stackLabel: 'Database · Search Engine',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Elasticsearch',
    stackLabel: 'Database · Search Engine',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'Elasticsearch',
    accentColor: C,
    stackLabel: 'Database · Search Engine',
    tagline: 'Query DSL, aggregations, mapping types e APIs de diagnóstico',
    version: '8.x',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function ElasticsearchPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
