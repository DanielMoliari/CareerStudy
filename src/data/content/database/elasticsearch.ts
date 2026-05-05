import type { SkillContent } from '@/types'

const elasticsearch: SkillContent = {
  tagline: "Motor de busca e analytics distribuído baseado em Lucene.",
  why: "Elasticsearch (e OpenSearch) é o padrão para busca full-text e analytics de logs. Sênior precisa saber inverted index, mappings, aggregations e quando não usar Elastic.",
  summary: "Elasticsearch é um motor de busca distribuído construído sobre Lucene. Armazena documentos JSON em índices. Busca full-text via inverted index, relevance scoring (BM25), aggregations para analytics em tempo real. Horizontalmente escalável com sharding e réplicas. Kibana para visualização. ELK Stack (Elasticsearch, Logstash, Kibana) para logs.\n\nA distinção mais importante para autoria de conteúdo é entre campos text e keyword: text passa pelo analyzer (tokenização, lowercase, stemming) e serve para busca full-text; keyword não é analisado e serve para filtros, sorts e aggregations exatas. Confundir os dois é a fonte de 80% dos bugs de mapeamento.",
  keypoints: [
    { title: "Inverted index", body: "Mapa de termo → lista de documentos que o contêm. Core do Lucene. Permite busca full-text O(1) para termos exatos. Analyzer tokeniza e normaliza texto (lowercase, stemming, stop words)." },
    { title: "Mappings", body: "Schema do índice. Define tipos de campo (text, keyword, date, number, geo_point). text: analisado, para busca full-text. keyword: não analisado, para filtro/sort/aggregation exato." },
    { title: "Analyzers", body: "Pipeline de tokenização: character filter → tokenizer → token filter. Standard analyzer: lowercase + tokenização por whitespace/pontuação. Custom analyzers para línguas ou domínios específicos (pt_BR stemmer)." },
    { title: "Relevance scoring", body: "BM25 (default desde ES 5): mede TF-IDF com normalização por tamanho de documento. Score mais alto = mais relevante. Boost por campo, function_score para customizar (ex: score × freshness)." },
    { title: "Aggregations", body: "Bucket (group by: terms, date_histogram, range), Metric (sum, avg, max, percentiles), Pipeline (cumulativo, derivativo). Permite analytics em tempo real sobre os dados indexados sem ETL separado." },
    { title: "Sharding e réplicas", body: "Índice dividido em N shards (distribuição de dados). Cada shard tem M réplicas (HA e read scaling). Primary shard recebe escrita; réplica pode servir leitura. Shard count é fixo no momento de criação." },
    { title: "Near real-time", body: "Indexação não é imediata: documento vai para buffer, refresh periódico (default 1s) cria novo segmento Lucene. Após refresh, documento aparece em buscas. Para indexação em lote, aumente o refresh_interval." },
  ],
  gotchas: [
    "Dynamic mapping com campos desconhecidos — campo numérico indexado como text não é agregável. Defina mappings explicitamente antes de indexar.",
    "Shard count fixo no momento de criação — mudar requer reindex completo. Pense bem antes de criar (regra geral: 20-40GB por shard).",
    "Query em campo text para filtro exato — use keyword. text passa por analyzer (lowercase etc.), keyword não.",
    "Aggregation em campo text sem fielddata — desabilitado por default (consome muita memória). Use keyword ou .keyword subfield.",
    "Split brain com número par de master-eligible nodes — sempre use 3 nodes para quorum correto. Par = possibilidade de dois grupos pensando ser o master.",
    "Index per day sem ILM — acumulam índices indefinidamente. Configure Index Lifecycle Management (hot-warm-cold-delete).",
  ],
  interview: [
    {
      q: "Como funciona a busca full-text no Elasticsearch?",
      a: "<p>Query passa pelo mesmo analyzer que indexou: tokenização, lowercase, stemming. Termos resultantes buscados no inverted index. Para cada documento que contém os termos, calcula score BM25 (frequência do termo, raridade do termo no corpus, tamanho do documento).</p><p>Documentos retornados ordenados por score. Bool query combina must (obrigatório, afeta score), should (opcional, boost no score), filter (obrigatório, não afeta score, é cacheado — use para filtros). Must Not para exclusão.</p>",
      level: "pleno",
    },
    {
      q: "Quando NÃO usar Elasticsearch?",
      a: "<p>Source of truth para dados transacionais — ES não tem ACID. Use como projeção secundária dos dados primários (sincronize via CDC ou event driven).</p><p>Dados pequenos — Postgres com pg_trgm ou full-text search nativo resolve sem a complexidade operacional de ES.</p><p>Quando latência de indexação (near real-time, ~1s) é problema — ES não é para dados em tempo real strict.</p><p>Quando precisa de JOINs complexos — ES é desnormalizado por natureza, JOINs são via nested objects ou parent-child com custo alto.</p>",
      level: "senior",
    },
    {
      q: "Como você implementaria busca com relevance tuning?",
      a: "<p>Multi-match query com boost por campo: title^3, description^1, tags^2. BM25 calcula score base; boost multiplica. function_score adiciona sinais externos: freshness (decay), popularidade, score de negócio.</p><p>Para relevance tuning iterativo: ES Learning to Rank com features (clicks, conversão) ou simplesmente testar com explain API para entender como cada documento recebeu seu score. Logging de queries e resultados para análise offline.</p>",
      level: "senior",
    },
    {
      q: "O que é Index Lifecycle Management (ILM)?",
      a: "<p>ILM automatiza a gestão de índices ao longo do tempo através de fases: hot (escrita e leitura intensas), warm (leitura, menos recursos), cold (acesso raro, comprimido), delete (expiração).</p><p>Para logs e time-series, padrão típico: índice novo por dia/semana, rollover quando atingir tamanho ou idade, move para warm após X dias, delete após Y dias. Evita crescimento indefinido e otimiza custos de hardware.</p>",
      level: "senior",
    },
  ],
  resources: [
    { title: "Elasticsearch docs", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html", kind: "docs" },
    { title: "Elasticsearch — The Definitive Guide", url: "https://www.elastic.co/guide/en/elasticsearch/guide/current/index.html", kind: "livro" },
  ],
}

export default elasticsearch
