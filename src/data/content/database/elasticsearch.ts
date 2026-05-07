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
    "_source: false economiza espaço mas impede _update, reindex e highlight — pense antes de desabilitar.",
    "scroll API mantém contexto aberto no servidor — use search_after para paginação profunda em produção (sem estado no servidor).",
  ],

  interview: [
    {
      q: "Como funciona a busca full-text no Elasticsearch?",
      a: "<p>Query passa pelo mesmo analyzer que indexou: tokenização, lowercase, stemming. Termos resultantes são buscados no inverted index. Para cada documento que contém os termos, calcula score BM25 (frequência do termo, raridade no corpus, tamanho do documento).</p><p>Documentos retornados ordenados por score. <b>Bool query</b> combina:<ul><li><code>must</code> — obrigatório, afeta score</li><li><code>should</code> — opcional, boost no score</li><li><code>filter</code> — obrigatório, não afeta score, é cacheado</li><li><code>must_not</code> — exclusão, não afeta score</li></ul>Use <code>filter</code> para datas, status, flags — é cacheado e muito mais rápido que must.</p>",
      level: "pleno",
      tip: "filter é cacheado pelo bitset cache do Elasticsearch. must recalcula score a cada query. Para filtros que não precisam de relevância, sempre use filter.",
    },
    {
      q: "Quando NÃO usar Elasticsearch?",
      a: "<p><b>Source of truth transacional:</b> ES não tem ACID. Use como projeção secundária sincronizada via CDC ou eventos do banco primário.</p><p><b>Dataset pequeno:</b> Postgres com <code>pg_trgm</code> ou full-text search nativo resolve sem a complexidade operacional de um cluster ES.</p><p><b>Latência de indexação crítica:</b> near real-time (~1s de delay) é inerente ao Lucene. Para visibilidade imediata estrita, ES não é adequado.</p><p><b>JOINs relacionais:</b> ES é desnormalizado por natureza. Nested objects e parent-child têm custo alto em performance e complexidade.</p>",
      level: "senior",
      tip: "A pergunta-chave: 'Se o ES ficar inconsistente por alguns segundos, o negócio quebra?' Se sim, ES não é a fonte de verdade certa.",
    },
    {
      q: "Como você implementaria busca com relevance tuning?",
      a: "<p><b>Multi-match com boost por campo:</b> <code>{\"multi_match\": {\"query\": \"redis\", \"fields\": [\"title^3\", \"description^1\", \"tags^2\"]}}</code>. BM25 calcula score base; boost multiplica.</p><p><b>function_score</b> adiciona sinais externos: decay por data (documentos recentes têm score maior), popularidade como multiplicador de score de negócio.</p><p><b>Iteração:</b> use <code>explain: true</code> na query para entender como cada documento recebeu seu score. Logging de impressões e cliques para análise offline. ES Learning to Rank (plugin) para modelos ML supervisionados.</p>",
      level: "senior",
      tip: "explain: true é a ferramenta de debug de relevância — mostra o cálculo completo de BM25 por campo e por documento.",
    },
    {
      q: "O que é Index Lifecycle Management (ILM)?",
      a: "<p>ILM automatiza a gestão de índices ao longo do tempo através de fases: <b>hot</b> (escrita e leitura intensas), <b>warm</b> (leitura, menos recursos, forcemerge), <b>cold</b> (acesso raro, comprimido, leitura lenta), <b>frozen</b> (quase sem acesso, searchable snapshot), <b>delete</b> (expiração).</p><p>Para logs e time-series: índice novo por dia/semana via rollover (quando atingir tamanho ou idade), muda de fase automaticamente. Evita crescimento indefinido e otimiza custos — dados frios em hardware barato.</p>",
      level: "senior",
      tip: "Rollover é a chave: ILM cria um alias que aponta para o índice corrente. Quando o índice rola, o alias aponta para o novo — transparente para a aplicação.",
    },
    {
      q: "Explique a diferença entre text e keyword no mapping.",
      a: "<p><b>text:</b> passa pelo analyzer antes de ser indexado. 'Hello World' vira tokens ['hello', 'world']. Usado para busca full-text (match, multi_match). Não é ordenável nem agregável por default.</p><p><b>keyword:</b> indexado sem análise. 'Hello World' fica como 'Hello World'. Usado para filtros exatos (term, terms), ordenação (sort), aggregations (terms agg). Case-sensitive.</p><p><b>Padrão common:</b> campos de texto frequentemente têm <b>multi-field</b>: o campo principal é text para busca, e um subfield <code>.keyword</code> é keyword para filtro/sort/agg.</p><p>Exemplo de mapping: <code>\"title\": {\"type\": \"text\", \"fields\": {\"keyword\": {\"type\": \"keyword\"}}}</code>. Acesse via <code>title</code> (busca) ou <code>title.keyword</code> (sort/agg).</p>",
      level: "pleno",
      tip: "Multi-field é o padrão — não escolha entre text e keyword, use os dois. title para match, title.keyword para terms agg e sort.",
    },
    {
      q: "O que é BM25 e como funciona o cálculo de relevância?",
      a: "<p>BM25 (Best Match 25) é o algoritmo de ranking padrão do ES desde a versão 5. Evolução do TF-IDF com dois melhoramentos chave:</p><ul><li><b>TF saturation (k1):</b> limita o impacto de frequência muito alta do termo. Sem saturação, documentos com 1000 ocorrências de 'redis' seriam ridiculamente mais relevantes que documentos com 10. BM25 satura esse ganho.</li><li><b>Field length normalization (b):</b> documentos mais curtos são favorecidos. 'Redis' em um título de 3 palavras é mais relevante do que em um documento de 10.000 palavras.</li></ul><p>Parâmetros: <code>k1</code> (default 1.2) controla saturação; <code>b</code> (default 0.75) controla normalização de comprimento. Configuráveis por index nos settings.</p>",
      level: "senior",
      tip: "Use explain: true para ver exatamente como BM25 calculou o score de cada campo. É a forma mais rápida de entender por que um documento está rankeado onde está.",
    },
    {
      q: "Como funciona sharding e qual o tamanho ideal de shard?",
      a: "<p>Um índice ES é dividido em N <b>primary shards</b> na criação. Cada shard é um índice Lucene independente. Documentos são roteados para shards via <code>hash(_id) % num_shards</code>. Cada primary tem M <b>replica shards</b> (HA + read scaling).</p><p><b>Tamanho ideal:</b> 20-50GB por shard (regra geral Elastic). Shards muito pequenos aumentam overhead de coordenação; shards muito grandes tornam recovery lento.</p><p><b>Shard count é imutável</b> após criação. Para redimensionar: crie novo índice com mapping atualizado, use _reindex API ou data streams com ILM para rollover automático.</p><p>Fórmula: <code>num_shards = ceil(dataset_GB / 30GB)</code>. Para 300GB de dados: 10 primary shards.</p>",
      level: "senior",
      tip: "Over-sharding é um problema real: 1000 shards de 1MB cada é pior que 10 shards de 100MB. Shard overhead fixo por JVM heap: ~30MB por shard.",
    },
    {
      q: "Como implementar paginação profunda eficiente no Elasticsearch?",
      a: "<p><b>from + size (básico):</b> <code>{\"from\": 9990, \"size\": 10}</code>. ES busca os primeiros 10.000 documentos e descarta 9.990. Problemático a partir de page 100+. Limitado por <code>max_result_window</code> (default 10.000).</p><p><b>scroll API:</b> cria snapshot do índice, mantém contexto aberto no servidor. Bom para dump completo de dados, ruim para paginação interativa (estado no servidor, sem ordem garantida entre requests).</p><p><b>search_after (recomendado para UI):</b> usa valores do último resultado como cursor. <code>{\"search_after\": [\"2024-01-15\", \"doc-id-123\"], \"sort\": [\"date\", \"_id\"]}</code>. Stateless, eficiente, funciona com qualquer tamanho de dataset. Não permite pular para página específica.</p>",
      level: "senior",
      tip: "search_after com sort em _id como tiebreaker garante paginação determinística mesmo com índice sendo atualizado durante a navegação.",
    },
    {
      q: "Como estruturar queries com aggregations para analytics?",
      a: "<p>Aggregations são compostas: bucket agg cria grupos, metric agg calcula dentro de cada grupo, pipeline agg opera sobre outras aggregations.</p><p>Exemplo — vendas por categoria com média de preço e total:</p><code>{\"aggs\": {\"por_categoria\": {\"terms\": {\"field\": \"category.keyword\", \"size\": 20}, \"aggs\": {\"preco_medio\": {\"avg\": {\"field\": \"price\"}}, \"total\": {\"sum\": {\"field\": \"amount\"}}}}}}</code><p>Para performance: use <code>filter</code> context antes das aggs para reduzir o conjunto. <code>execution_hint: map</code> vs <code>global_ordinals</code> afeta performance de terms agg em campos de alta cardinalidade.</p>",
      level: "senior",
      tip: "Aggregations e busca simultâneas: a query no nível raiz filtra os docs para agg e busca. Muito eficiente — uma única passagem pelos shards.",
    },
    {
      q: "Como funciona o analyzer e como criar um custom para português?",
      a: "<p>Pipeline do analyzer: <b>character filter</b> (ex: html_strip remove tags) → <b>tokenizer</b> (standard quebra por whitespace/pontuação) → <b>token filter</b> (lowercase, stemmer, stop words, synonyms).</p><p>Custom analyzer para português:<code>{\"settings\": {\"analysis\": {\"analyzer\": {\"portuguese_custom\": {\"type\": \"custom\", \"tokenizer\": \"standard\", \"filter\": [\"lowercase\", \"portuguese_stop\", \"portuguese_stemmer\"]}}, \"filter\": {\"portuguese_stemmer\": {\"type\": \"stemmer\", \"language\": \"portuguese\"}, \"portuguese_stop\": {\"type\": \"stop\", \"stopwords\": \"_portuguese_\"}}}}}</code></p><p>Teste com API <code>_analyze</code>: <code>POST /my_index/_analyze {\"analyzer\": \"portuguese_custom\", \"text\": \"jogadores correndo\"}</code>.</p>",
      level: "senior",
      tip: "_analyze é sua ferramenta de debug de analyzer — veja exatamente quais tokens são gerados antes de indexar dados reais.",
    },
    {
      q: "O que é _source e como usar _source filtering?",
      a: "<p><code>_source</code> é o JSON original do documento armazenado pelo ES. Por default, todo documento tem _source habilitado — permite reindex, update parcial, highlight e retorno dos campos na resposta.</p><p><b>_source filtering na query:</b> retorna apenas campos necessários para economizar banda:<code>{\"_source\": [\"title\", \"price\", \"date\"], \"query\": {...}}</code></p><p><b>Desabilitar _source no mapping:</b> <code>\"_source\": {\"enabled\": false}</code>. Economiza espaço mas impede: _update, reindex, highlight, script fields. Só faça se você tiver certeza — irreversível sem reindex.</p><p><b>Alternativa:</b> <code>_source excludes</code> para campos grandes que você não quer retornar mas ainda precisa para reindex.</p>",
      level: "pleno",
      tip: "Nunca desabilite _source em prod sem entender todas as implicações. _source filtering na query (não no mapping) é a abordagem segura para economizar banda.",
    },
    {
      q: "Como monitorar saúde e performance de um cluster Elasticsearch?",
      a: "<p><b>Cluster health:</b> <code>GET /_cluster/health</code> retorna status green/yellow/red. Green: todos os shards ativos. Yellow: réplicas faltando (primaries OK). Red: primaries faltando (perda de dados possível).</p><p><b>Métricas críticas:</b><ul><li>JVM heap usage: acima de 75% = risco de GC pauses</li><li>Thread pool rejections: indexing e search rejections indicam sobrecarga</li><li>Segment count: muitos segmentos pequenos = force merge necessário</li><li>Search latency p99 via <code>GET /index/_stats</code></li></ul></p><p><b>Ferramentas:</b> Kibana Stack Monitoring, Elastic APM, Prometheus + elasticsearch_exporter. <code>GET /_cat/nodes?v</code> e <code>GET /_cat/shards?v</code> para diagnóstico rápido.</p>",
      level: "senior",
      tip: "Yellow cluster é comum e não crítico — réplicas não alocadas. Red cluster é emergência — primary shards faltando. Nunca ignore red.",
    },
    {
      q: "Como fazer reindex sem downtime no Elasticsearch?",
      a: "<p><b>Cenário:</b> precisa mudar mapping (ex: adicionar campo keyword, mudar analyzer). Shard count e tipos são imutáveis — reindex é obrigatório.</p><p><b>Processo zero-downtime com alias:</b><ol><li>Crie novo índice com mapping correto: <code>my_index_v2</code></li><li>Execute reindex: <code>POST /_reindex {\"source\": {\"index\": \"my_index_v1\"}, \"dest\": {\"index\": \"my_index_v2\"}}</code></li><li>Rode reindex delta para documentos criados durante a cópia (usar query por timestamp)</li><li>Mude o alias para apontar para v2: <code>POST /_aliases {\"actions\": [{\"remove\": ...}, {\"add\": ...}]}</code></li><li>Delete índice antigo</li></ol></p><p>Use <code>wait_for_completion=false</code> para reindex assíncrono e monitore com task API.</p>",
      level: "senior",
      tip: "Sempre use aliases em produção, nunca aponte a aplicação direto para o índice. Alias = swap atômico sem downtime.",
    },
    {
      q: "O que são nested objects e quando usar parent-child?",
      a: "<p><b>Flat objects (default):</b> arrays de objetos são achatados — queries podem cruzar campos de objetos diferentes. Bug clássico: <code>[{color: red, size: L}, {color: blue, size: S}]</code> retorna para query <code>color:red AND size:S</code>.</p><p><b>Nested:</b> cada objeto é indexado como documento Lucene separado oculto. Queries nested (nested query) garantem correlação de campos dentro do mesmo objeto. Custo: mais documentos no índice, queries mais lentas, limits de nested objects por doc.</p><p><b>Parent-child (join field):</b> documentos relacionados em índice com tipo pai/filho. Permite atualizações independentes. Custo maior que nested — requer que pai e filho estejam no mesmo shard.</p>",
      level: "senior",
      tip: "Nested para arrays estáticos (atributos de produto). Parent-child para relacionamentos onde o filho muda frequentemente sem alterar o pai (comentários de post).",
    },
    {
      q: "Como usar o Explain API para debug de relevância?",
      a: "<p><code>GET /index/_explain/doc_id {\"query\": {...}}</code> — retorna a árvore completa de cálculo de score para um documento específico, mesmo que ele não tenha aparecido nos resultados (útil para entender por que um documento esperado não apareceu).</p><p>A resposta inclui: se o documento faz match (matched: true/false), o score total, e a decomposição por subcláusula (BM25 por campo, boost aplicado, function_score contributions).</p><p><b>Alternativa:</b> <code>\"explain\": true</code> na query retorna explanation para todos os hits — mais prático para debugging de top resultados.</p>",
      level: "pleno",
      tip: "explain no nível de query (explain: true) é caro — nunca use em produção. Use apenas em ambiente de desenvolvimento para tuning de relevância.",
    },
    {
      q: "Como funciona o processo de indexação internamente?",
      a: "<p><b>Fluxo de indexação:</b><ol><li>Client envia documento para qualquer node (coordinating node)</li><li>Coordinating calcula shard: <code>hash(_id) % num_primary_shards</code></li><li>Documento vai para o primary shard desse slot</li><li>Primary indexa no buffer em memória + transaction log (translog)</li><li>Primary encaminha para réplicas (paralelamente)</li><li>Primary confirma ao client após quórum de réplicas confirmar</li></ol></p><p><b>Refresh:</b> buffer → segmento Lucene em disco. Default 1s. Após refresh, documento é pesquisável.</p><p><b>Flush:</b> translog → disco real. Garante durabilidade em caso de crash. Default quando translog fica grande ou a cada 30min.</p>",
      level: "senior",
      tip: "Aumentar refresh_interval para 30s durante bulk indexing melhora throughput drasticamente — documentos ficam no buffer mais tempo antes de virar segmento.",
    },
    {
      q: "Como implementar busca de autocompletar (autocomplete) eficiente?",
      a: "<p><b>Opção 1 — edge_ngram analyzer:</b> indexa prefixos ('redis' → 'r', 're', 'red', 'redi', 'redis'). Query simples com match no campo edge_ngram. Custo: índice maior.</p><p><b>Opção 2 — completion suggester:</b> tipo de campo dedicado (<code>\"type\": \"completion\"</code>). Estrutura de dados FST (Finite State Transducer) em memória — latência muito baixa. Suporta fuzzy, context suggesters (filtro por categoria). Limitado: sem scoring customizado complexo.</p><p>Exemplo de completion: <code>POST /suggest {\"suggest\": {\"autocomplete\": {\"prefix\": \"red\", \"completion\": {\"field\": \"title_suggest\", \"size\": 5}}}}</code></p><p><b>Opção 3 — search_as_you_type field type:</b> ES 7.2+, mais simples que edge_ngram, suporta middle-of-word matching.</p>",
      level: "senior",
      tip: "completion suggester é o mais rápido (FST in-memory) mas o menos flexível. search_as_you_type é o melhor equilíbrio para a maioria dos casos de autocomplete.",
    },
    {
      q: "Como funciona o controle de concorrência no Elasticsearch?",
      a: "<p>ES usa <b>optimistic concurrency control</b> baseado em sequence numbers. Cada documento tem <code>_seq_no</code> e <code>_primary_term</code>.</p><p><b>Update condicional:</b> <code>PUT /index/_doc/1?if_seq_no=10&if_primary_term=1</code> — falha com 409 Conflict se o documento foi modificado desde que você o leu.</p><p><b>Retry on conflict:</b> para updates sem leitura prévia, <code>POST /index/_update/1?retry_on_conflict=3</code> tenta até 3 vezes em caso de conflito.</p><p>Não existe locking pessimista — ES é otimizado para operações concorrentes de alta frequência onde conflitos são raros.</p>",
      level: "senior",
      tip: "_seq_no + _primary_term substituíram o _version para controle de concorrência a partir do ES 7. Sempre leia o _seq_no atual antes de um update condicional.",
    },
    {
      q: "O que é o Data Stream e quando usar em vez de índices regulares?",
      a: "<p><b>Data Stream</b> é uma abstração sobre múltiplos backing indices para dados time-series (logs, métricas, eventos). Requer campo <code>@timestamp</code>. Documentos só podem ser appendados (sem updates/deletes diretos no índice atual).</p><p><b>Vantagens:</b><ul><li>Rollover automático via ILM — novo índice backing criado quando atingir tamanho/tempo</li><li>Single alias para escrita e leitura em todos os backing indices</li><li>Roteamento otimizado por tempo — queries com filtro de data só atingem os backing indices relevantes</li></ul></p><p>Use Data Streams para qualquer dado com padrão de crescimento contínuo onde você não precisa atualizar documentos antigos. ECS (Elastic Common Schema) como formato para logs.</p>",
      level: "senior",
      tip: "Data Streams + ILM é a arquitetura correta para observabilidade. Substitui o padrão manual de index-per-day que era comum antes do ES 7.",
    },
    {
      q: "Como usar _bulk API para indexação em alta performance?",
      a: "<p><b>_bulk API</b> agrupa múltiplas operações em um único request HTTP, reduzindo overhead de rede drasticamente.</p><p>Formato NDJSON (cada operação = 2 linhas):<code>{\"index\": {\"_index\": \"products\", \"_id\": \"1\"}}\n{\"title\": \"Redis in Action\", \"price\": 39.99}\n{\"update\": {\"_id\": \"2\"}}\n{\"doc\": {\"price\": 29.99}}\n{\"delete\": {\"_id\": \"3\"}}</code></p><p><b>Tuning de bulk indexing:</b><ul><li>Tamanho ideal: 5-15MB por bulk request (não número de docs)</li><li>Aumentar <code>refresh_interval</code> para 30s durante indexação</li><li>Desabilitar réplicas temporariamente e re-habilitar após</li><li>Múltiplos threads em paralelo (1 por shard)</li></ul></p>",
      level: "pleno",
      tip: "Monitore thread pool rejections durante bulk indexing. Se tiver rejeições, reduza o tamanho do bulk ou número de threads — você está saturando o cluster.",
    },
    {
      q: "Como estruturar queries geoespaciais no Elasticsearch?",
      a: "<p>Campo <code>geo_point</code> armazena coordenadas (lat/lon). Indexa em estrutura de dados otimizada para queries espaciais.</p><p><b>Queries geoespaciais:</b><ul><li><code>geo_distance</code>: documentos dentro de raio: <code>{\"filter\": {\"geo_distance\": {\"distance\": \"10km\", \"location\": {\"lat\": -23.5, \"lon\": -46.6}}}}</code></li><li><code>geo_bounding_box</code>: documentos dentro de retângulo — mais eficiente para buscas por viewport de mapa</li><li><code>geo_shape</code>: polígonos, linhas, formas complexas</li></ul></p><p><b>Ordenar por distância:</b> <code>\"sort\": [{\"_geo_distance\": {\"location\": [-46.6, -23.5], \"order\": \"asc\", \"unit\": \"km\"}}]</code></p>",
      level: "senior",
      tip: "geo_bounding_box é mais eficiente que geo_distance para queries de mapa — a maioria das UIs de mapa trabalha com bounds retangulares, não com raios.",
    },
  ],

  diagrams: [
    {
      title: "Pipeline de Indexação e Busca no Elasticsearch",
      html: `<style>
.es-pipeline { font-family: monospace; max-width: 700px; color: #e0e0e0; }
.es-row { display: flex; align-items: stretch; gap: 8px; margin: 10px 0; }
.es-box { background: #1a1a2e; border: 1px solid #6366f1; border-radius: 6px; padding: 10px; flex: 1; text-align: center; font-size: 12px; }
.es-box.highlight { border-color: #ef4444; background: #1e1a2e; }
.es-arrow { color: #6b7280; align-self: center; font-size: 18px; }
.es-label { color: #818cf8; font-size: 11px; margin-bottom: 4px; font-weight: bold; }
.es-content { color: #d1d5db; }
.es-sep { text-align: center; color: #374151; margin: 6px 0; font-size: 11px; }
</style>
<div class="es-pipeline">
  <div class="es-sep">— INDEXAÇÃO —</div>
  <div class="es-row">
    <div class="es-box"><div class="es-label">Documento JSON</div><div class="es-content">"Redis in Action"</div></div>
    <div class="es-arrow">→</div>
    <div class="es-box highlight"><div class="es-label">Analyzer</div><div class="es-content">tokenize → lowercase → stem</div></div>
    <div class="es-arrow">→</div>
    <div class="es-box"><div class="es-label">Inverted Index</div><div class="es-content">redis → [doc1, doc5]<br>action → [doc1, doc8]</div></div>
  </div>
  <div class="es-sep">— BUSCA —</div>
  <div class="es-row">
    <div class="es-box"><div class="es-label">Query "Redis"</div><div class="es-content">match query</div></div>
    <div class="es-arrow">→</div>
    <div class="es-box highlight"><div class="es-label">Mesmo Analyzer</div><div class="es-content">"redis" (token)</div></div>
    <div class="es-arrow">→</div>
    <div class="es-box"><div class="es-label">BM25 Score</div><div class="es-content">TF × IDF × norm<br>→ rank por relevância</div></div>
  </div>
</div>`,
      caption: "O analyzer de busca DEVE ser o mesmo do índice — inconsistência entre os dois causa miss de resultados.",
    },
    {
      title: "text vs keyword — Quando Usar Cada Tipo",
      html: `<style>
.es-types { display: flex; gap: 16px; font-family: monospace; max-width: 700px; color: #e0e0e0; }
.es-col { flex: 1; background: #1a1a2e; border-radius: 8px; padding: 14px; }
.es-col h4 { margin: 0 0 10px; font-size: 14px; color: #fff; border-bottom: 1px solid #374151; padding-bottom: 6px; }
.es-txt { border-top-color: #6366f1; }
.es-kw { border-top-color: #22c55e; }
.es-col { border-top: 3px solid #374151; }
.es-txt { border-top-color: #6366f1; }
.es-kw { border-top-color: #22c55e; }
.es-row { font-size: 12px; margin: 5px 0; }
.es-k { color: #818cf8; }
.es-v { color: #d1d5db; }
.es-good { color: #22c55e; font-size: 11px; }
.es-bad { color: #f87171; font-size: 11px; }
.es-multi { background: #111827; border-radius: 6px; padding: 10px; margin-top: 10px; font-size: 12px; }
</style>
<div class="es-types">
  <div class="es-col es-txt">
    <h4>text</h4>
    <div class="es-row"><span class="es-k">Analyzer:</span> <span class="es-v">sim (tokenize, lowercase, stem)</span></div>
    <div class="es-row"><span class="es-k">Armazena:</span> <span class="es-v">tokens individuais</span></div>
    <div class="es-good">✓ match, multi_match</div>
    <div class="es-good">✓ highlight</div>
    <div class="es-bad">✗ sort / terms agg</div>
    <div class="es-bad">✗ filtro exato</div>
    <div class="es-row" style="margin-top:8px"><span class="es-k">Exemplo:</span> <span class="es-v">title, description, body</span></div>
  </div>
  <div class="es-col es-kw">
    <h4>keyword</h4>
    <div class="es-row"><span class="es-k">Analyzer:</span> <span class="es-v">não (raw string)</span></div>
    <div class="es-row"><span class="es-k">Armazena:</span> <span class="es-v">string inteira</span></div>
    <div class="es-good">✓ term, terms query</div>
    <div class="es-good">✓ sort, aggregations</div>
    <div class="es-bad">✗ busca full-text</div>
    <div class="es-bad">✗ match parcial</div>
    <div class="es-row" style="margin-top:8px"><span class="es-k">Exemplo:</span> <span class="es-v">status, category, email, tag</span></div>
  </div>
</div>
<div class="es-multi">
  <strong style="color:#f59e0b">Multi-field (melhor prática):</strong><br>
  <code style="color:#86efac; font-size:11px">"title": { "type": "text", "fields": { "keyword": { "type": "keyword" } } }</code><br>
  Busca full-text em <code>title</code> · Sort/agg em <code>title.keyword</code>
</div>`,
      caption: "Multi-field é o padrão recomendado — use text para busca e .keyword para sort e aggregations.",
    },
    {
      title: "Arquitetura de Sharding e Réplicas",
      html: `<style>
.es-cluster { font-family: sans-serif; max-width: 700px; color: #e0e0e0; }
.es-nodes { display: flex; gap: 12px; margin-bottom: 16px; }
.es-node { flex: 1; background: #1a1a2e; border: 1px solid #374151; border-radius: 8px; padding: 10px; }
.es-node h4 { margin: 0 0 8px; font-size: 12px; color: #818cf8; text-align: center; }
.es-shard { border-radius: 4px; padding: 4px 6px; margin: 3px 0; font-size: 11px; text-align: center; }
.es-primary { background: #ef4444; color: #fff; }
.es-replica { background: #374151; color: #d1d5db; border: 1px dashed #6b7280; }
.es-legend { display: flex; gap: 12px; font-size: 11px; margin-top: 8px; }
.es-leg { display: flex; align-items: center; gap: 4px; }
.es-dot-p { width: 10px; height: 10px; background: #ef4444; border-radius: 2px; }
.es-dot-r { width: 10px; height: 10px; background: #374151; border: 1px dashed #6b7280; border-radius: 2px; }
.es-info { background: #111827; border-left: 3px solid #f59e0b; padding: 8px; font-size: 11px; color: #d1d5db; }
</style>
<div class="es-cluster">
  <div class="es-nodes">
    <div class="es-node">
      <h4>Node 1 (master)</h4>
      <div class="es-shard es-primary">P0 — primary</div>
      <div class="es-shard es-primary">P1 — primary</div>
      <div class="es-shard es-replica">R2 — replica</div>
    </div>
    <div class="es-node">
      <h4>Node 2</h4>
      <div class="es-shard es-replica">R0 — replica</div>
      <div class="es-shard es-primary">P2 — primary</div>
      <div class="es-shard es-replica">R1 — replica</div>
    </div>
    <div class="es-node">
      <h4>Node 3</h4>
      <div class="es-shard es-replica">R1 — replica</div>
      <div class="es-shard es-replica">R0 — replica</div>
      <div class="es-shard es-primary">P1 — (failover)</div>
    </div>
  </div>
  <div class="es-legend">
    <div class="es-leg"><div class="es-dot-p"></div> Primary (recebe escrita)</div>
    <div class="es-leg"><div class="es-dot-r"></div> Replica (HA + read scaling)</div>
  </div>
  <div class="es-info" style="margin-top:10px">
    Índice com 3 primary shards + 1 replica cada = 6 shards total.<br>
    Primary e replica do mesmo shard NUNCA ficam no mesmo node (proteção a falha de node).
  </div>
</div>`,
      caption: "ES garante que primary e sua réplica nunca coexistam no mesmo nó — perda de nó não perde dados.",
    },
    {
      title: "Index Lifecycle Management — Fases",
      html: `<style>
.es-ilm { font-family: sans-serif; max-width: 700px; color: #e0e0e0; }
.es-phases { display: flex; align-items: stretch; gap: 0; }
.es-phase { flex: 1; padding: 12px 8px; text-align: center; position: relative; }
.es-phase:not(:last-child)::after { content: '→'; position: absolute; right: -10px; top: 50%; transform: translateY(-50%); color: #6b7280; font-size: 18px; z-index: 1; }
.es-hot { background: #7f1d1d; border-radius: 8px 0 0 8px; }
.es-warm { background: #78350f; }
.es-cold { background: #1e3a5f; }
.es-frozen { background: #1a1a4a; }
.es-del { background: #1a1a1a; border-radius: 0 8px 8px 0; }
.es-phase h4 { margin: 0 0 6px; font-size: 12px; color: #fff; }
.es-phase p { margin: 0; font-size: 10px; color: #d1d5db; line-height: 1.5; }
.es-trigger { background: #111827; border-radius: 4px; padding: 2px 4px; font-size: 10px; color: #f59e0b; display: inline-block; margin: 4px 0; }
</style>
<div class="es-ilm">
  <div class="es-phases">
    <div class="es-phase es-hot">
      <h4>Hot</h4>
      <div class="es-trigger">writes + reads</div>
      <p>Indexação ativa<br>SSDs, alta CPU</p>
    </div>
    <div class="es-phase es-warm">
      <h4>Warm</h4>
      <div class="es-trigger">após 7 dias</div>
      <p>Só leitura<br>forcemerge<br>HDDs OK</p>
    </div>
    <div class="es-phase es-cold">
      <h4>Cold</h4>
      <div class="es-trigger">após 30 dias</div>
      <p>Acesso raro<br>comprimido<br>leitura lenta</p>
    </div>
    <div class="es-phase es-frozen">
      <h4>Frozen</h4>
      <div class="es-trigger">após 90 dias</div>
      <p>Searchable snapshot<br>S3 / object store</p>
    </div>
    <div class="es-phase es-del">
      <h4>Delete</h4>
      <div class="es-trigger">após 365 dias</div>
      <p>Expiração<br>por política</p>
    </div>
  </div>
</div>`,
      caption: "ILM move dados automaticamente entre tiers de hardware, otimizando custo × performance ao longo do tempo de vida do dado.",
    },
  ],

  mnemonics: [
    {
      label: "TIKBAS — Componentes do Analyzer",
      trick: "Tokena, Indexa, Keyword, Busca, Analisa, Stemma",
      explanation: "Character filter → Tokenizer → Token filter. Lembra que o texto passa por 3 estágios antes de ser indexado. E que o mesmo analyzer usado na indexação DEVE ser usado na busca — query e índice falam o mesma língua.",
    },
    {
      label: "text busca, keyword filtra",
      trick: "TEXT para texto (match), KEYWORD para key exata (filter/sort/agg)",
      explanation: "text é analisado (tokenizado, lowercase, stem) — ideal para match e multi_match. keyword não é analisado — ideal para term, sort e aggregations. A confusão entre os dois causa 80% dos bugs de mapping no ES.",
    },
    {
      label: "MFS — Must, Filter, Should",
      trick: "Must Força Score, Filter Sem Score",
      explanation: "must: obrigatório + afeta score (use para relevância). filter: obrigatório + NÃO afeta score + É CACHEADO (use para datas, status, flags). should: opcional + aumenta score (use para boosting). filter é sempre mais eficiente que must para condições binárias.",
    },
    {
      label: "search_after não scroll — stateless é melhor",
      trick: "Scroll guarda Estado, search_after é Stateless",
      explanation: "scroll mantém um contexto aberto no servidor (memória) por cada cliente — não escala para muitos usuários concorrentes. search_after usa valores do último resultado como cursor — sem estado no servidor, funciona com qualquer tamanho de dataset. Para paginação em UI: sempre search_after.",
    },
    {
      label: "Shard size: 20-50GB",
      trick: "Shards são como Pizzas: nem miúdas demais, nem gigantes",
      explanation: "Shard muito pequeno (<1GB): overhead JVM fixo ~30MB por shard. 1000 shards de 1MB = 30GB de heap só para metadados. Shard muito grande (>50GB): recovery lento após falha. O sweet spot: 20-50GB por shard. Calcule: dataset_GB / 30 = número de primary shards.",
    },
  ],

  cheatsheet: {
    title: "Elasticsearch — Cheatsheet de Query DSL e APIs",
    html: `<style>
.es-cs { font-family: monospace; max-width: 720px; color: #e0e0e0; font-size: 12px; }
.es-section { margin: 10px 0; }
.es-section h4 { color: #ef4444; border-bottom: 1px solid #374151; padding-bottom: 4px; margin: 0 0 6px; font-size: 12px; text-transform: uppercase; }
.es-table { width: 100%; border-collapse: collapse; }
.es-table td { padding: 4px 8px; border: 1px solid #1f2937; vertical-align: top; }
.es-table tr:nth-child(even) { background: #111827; }
.es-cmd { color: #86efac; }
.es-desc { color: #d1d5db; }
.es-tip { background: #1e3a1e; border-left: 3px solid #22c55e; padding: 8px; font-size: 11px; color: #bbf7d0; margin-top: 8px; }
</style>
<div class="es-cs">
  <div class="es-section">
    <h4>Query Types</h4>
    <table class="es-table">
      <tr><td class="es-cmd">match</td><td class="es-desc">Full-text em campo text — usa analyzer</td></tr>
      <tr><td class="es-cmd">term / terms</td><td class="es-desc">Valor exato em campo keyword — não analisa</td></tr>
      <tr><td class="es-cmd">bool (must/filter/should/must_not)</td><td class="es-desc">Combina queries. filter é cacheado e não afeta score</td></tr>
      <tr><td class="es-cmd">multi_match</td><td class="es-desc">match em múltiplos campos com boost: fields: ["title^3","body"]</td></tr>
      <tr><td class="es-cmd">range</td><td class="es-desc">gte/lte em datas e números — use em filter context</td></tr>
      <tr><td class="es-cmd">exists</td><td class="es-desc">Campo existe no documento — útil para dados incompletos</td></tr>
    </table>
  </div>
  <div class="es-section">
    <h4>Aggregations</h4>
    <table class="es-table">
      <tr><td class="es-cmd">terms</td><td class="es-desc">Group by campo keyword — top N valores</td></tr>
      <tr><td class="es-cmd">date_histogram</td><td class="es-desc">Group by intervalo de tempo (day, week, month)</td></tr>
      <tr><td class="es-cmd">avg / sum / max / min</td><td class="es-desc">Métricas numéricas dentro de buckets</td></tr>
      <tr><td class="es-cmd">percentiles</td><td class="es-desc">p50, p95, p99 — latência, distribuição</td></tr>
    </table>
  </div>
  <div class="es-section">
    <h4>APIs Essenciais</h4>
    <table class="es-table">
      <tr><td class="es-cmd">GET /_cluster/health</td><td class="es-desc">green/yellow/red — saúde do cluster</td></tr>
      <tr><td class="es-cmd">GET /index/_analyze</td><td class="es-desc">Debug: veja tokens gerados pelo analyzer</td></tr>
      <tr><td class="es-cmd">GET /index/_explain/id</td><td class="es-desc">Debug: cálculo de score para um documento</td></tr>
      <tr><td class="es-cmd">POST /_reindex</td><td class="es-desc">Copiar dados entre índices (zero-downtime com alias)</td></tr>
      <tr><td class="es-cmd">POST /_bulk</td><td class="es-desc">Indexação em lote — 5-15MB por request</td></tr>
    </table>
  </div>
  <div class="es-tip">Checklist de produção: mappings explícitos → aliases em vez de índices diretos → ILM configurado → refresh_interval ajustado para workload → shard size entre 20-50GB</div>
</div>`,
    caption: "Referência rápida de Query DSL e APIs de operação — base para produção.",
  },

  mindmap: {
    title: "Elasticsearch — Mapa Mental",
    html: `<style>
.es-mm { font-family: sans-serif; max-width: 720px; color: #e0e0e0; }
.es-center { background: #ef4444; color: #fff; border-radius: 50%; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; margin: 0 auto 20px; text-align: center; }
.es-branches { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.es-branch { background: #1a1a2e; border-top: 3px solid #ef4444; border-radius: 6px; padding: 10px; }
.es-branch h4 { color: #f87171; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; }
.es-leaf { color: #d1d5db; font-size: 11px; padding: 2px 0; border-left: 2px solid #374151; padding-left: 6px; margin: 3px 0; }
</style>
<div class="es-mm">
  <div class="es-center">Elastic-search</div>
  <div class="es-branches">
    <div class="es-branch"><h4>Indexação</h4>
      <div class="es-leaf">Inverted index (Lucene)</div>
      <div class="es-leaf">Analyzer pipeline</div>
      <div class="es-leaf">Refresh (1s default)</div>
      <div class="es-leaf">Translog (durabilidade)</div>
      <div class="es-leaf">Bulk API</div>
    </div>
    <div class="es-branch"><h4>Mappings</h4>
      <div class="es-leaf">text — busca full-text</div>
      <div class="es-leaf">keyword — filtro/sort/agg</div>
      <div class="es-leaf">Multi-field (.keyword)</div>
      <div class="es-leaf">Dynamic vs explicit</div>
      <div class="es-leaf">_source filtering</div>
    </div>
    <div class="es-branch"><h4>Query DSL</h4>
      <div class="es-leaf">match / multi_match</div>
      <div class="es-leaf">bool: must/filter/should</div>
      <div class="es-leaf">term / terms / range</div>
      <div class="es-leaf">function_score</div>
      <div class="es-leaf">explain: true</div>
    </div>
    <div class="es-branch"><h4>Aggregations</h4>
      <div class="es-leaf">terms (group by)</div>
      <div class="es-leaf">date_histogram</div>
      <div class="es-leaf">avg / sum / percentiles</div>
      <div class="es-leaf">Nested aggs</div>
      <div class="es-leaf">Pipeline aggs</div>
    </div>
    <div class="es-branch"><h4>Operações</h4>
      <div class="es-leaf">ILM — hot/warm/cold</div>
      <div class="es-leaf">Reindex com alias</div>
      <div class="es-leaf">Data Streams</div>
      <div class="es-leaf">_cluster/health</div>
      <div class="es-leaf">_analyze debug</div>
    </div>
    <div class="es-branch"><h4>Arquitetura</h4>
      <div class="es-leaf">Shards + réplicas</div>
      <div class="es-leaf">20-50GB por shard</div>
      <div class="es-leaf">Quórum de masters (3)</div>
      <div class="es-leaf">Coordinating node</div>
      <div class="es-leaf">BM25 scoring</div>
    </div>
  </div>
</div>`,
    caption: "Visão completa do Elasticsearch — desde indexação até operações de cluster.",
  },

  exercises: [
    {
      level: "iniciante",
      title: "Criar índice com mapping explícito e indexar documentos",
      description: "Crie um índice 'produtos' com mapping explícito: title (text + .keyword), description (text), price (double), category (keyword), created_at (date). Indexe 10 produtos via _bulk API. Execute queries básicas: match em description, term em category, range em price. Use _analyze para verificar como 'Notebook Gamer Ultra' é tokenizado.",
      concepts: ["mappings", "bulk API", "match query", "term query", "range query", "_analyze"],
    },
    {
      level: "iniciante",
      title: "Busca full-text com bool query e filtros",
      description: "Construa uma busca de produtos que: (1) usa multi_match em title e description com boost (title^3), (2) filtra por category = 'electronics' no context filter, (3) filtra por price entre 100 e 2000 no context filter, (4) usa should para boostar produtos com score >= 4.0. Compare performance de must vs filter para o campo category usando explain: true.",
      concepts: ["bool query", "multi_match", "filter context", "must context", "should", "boost"],
    },
    {
      level: "intermediario",
      title: "Aggregations para dashboard de analytics",
      description: "Implemente um endpoint de analytics de pedidos com aggregations: (1) total de pedidos por status (terms agg em status.keyword), (2) receita total por dia nos últimos 30 dias (date_histogram + sum agg), (3) top 10 categorias por valor médio de pedido (terms + avg nested), (4) percentis de tempo de entrega p50/p95/p99. Todas as aggs em uma única query ES com filtro de date_range.",
      concepts: ["terms agg", "date_histogram", "sum/avg metric", "percentiles", "nested aggs", "filter + aggs"],
    },
    {
      level: "intermediario",
      title: "Reindex zero-downtime com mudança de mapping",
      description: "Simule uma migração real: você tem o índice 'articles_v1' onde o campo tags foi indexado como text. Você precisa mudar para keyword para permitir aggregation. Processo: (1) crie articles_v2 com mapping correto, (2) crie alias 'articles' apontando para v1, (3) faça reindex com _reindex API, (4) sincronize documentos criados durante o reindex (filtre por updated_at > início do reindex), (5) troque o alias atomicamente, (6) delete v1.",
      concepts: ["reindex API", "aliases", "zero-downtime migration", "mapping changes", "atomic alias swap"],
    },
    {
      level: "senior",
      title: "Custom analyzer para busca em português com sinônimos",
      description: "Crie um custom analyzer 'portuguese_search' com: (1) html_strip character filter, (2) standard tokenizer, (3) token filters em ordem: lowercase, portuguese_stop (palavras vazias PT-BR), synonym_graph para equivalências ('notebook,laptop,computador'), kstem para stemming. Aplique ao campo description. Valide com _analyze. Teste busca por 'laptop gamer' que deve retornar documentos com 'notebook para jogos'.",
      concepts: ["custom analyzer", "character filter", "token filter", "synonyms", "stemmer", "portuguese"],
    },
    {
      level: "senior",
      title: "ILM policy completo para logs de aplicação",
      description: "Implemente ILM para logs de aplicação com 365 dias de retenção: (1) crie ILM policy com fases hot (rollover 50GB ou 1 dia), warm (forcemerge para 1 segmento, migrar para warm nodes após 7 dias), cold (readonly após 30 dias), delete (após 365 dias). (2) Crie index template com a policy vinculada e mapping ECS básico. (3) Crie data stream 'app-logs'. (4) Configure shrink na fase warm para reduzir shard count. (5) Monitore progresso via _ilm/explain.",
      concepts: ["ILM", "rollover", "forcemerge", "shrink", "data streams", "index template", "ECS", "_ilm/explain"],
    },
  ],

  videos: [
    {
      title: "Elasticsearch Tutorial for Beginners",
      channel: "TechWorld with Nana",
      url: "https://www.youtube.com/watch?v=ZP0NmfyfsoM",
      topic: "Conceitos core, setup e primeiras queries",
    },
    {
      title: "Elasticsearch in 100 Seconds",
      channel: "Fireship",
      url: "https://www.youtube.com/watch?v=ZhoNMjRTnCc",
      topic: "Overview rápido do modelo de dados e busca",
    },
    {
      title: "Elasticsearch Complete Course — Full Text Search",
      channel: "Amigoscode",
      url: "https://www.youtube.com/watch?v=oPhlCLFLjm0",
      topic: "Query DSL, mappings, aggregations com Spring Boot",
    },
    {
      title: "ELK Stack Tutorial — Elasticsearch, Logstash, Kibana",
      channel: "edureka!",
      url: "https://www.youtube.com/watch?v=MRMgd6E9AXE",
      topic: "ELK Stack para observabilidade e log analytics",
    },
    {
      title: "Relevance Tuning in Elasticsearch",
      channel: "Elastic",
      url: "https://www.youtube.com/watch?v=CCTgroOcyfM",
      topic: "BM25, function_score, Learning to Rank",
    },
  ],

  resources: [
    { title: "Elasticsearch Reference Docs", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html", kind: "docs" },
    { title: "Elasticsearch — The Definitive Guide", url: "https://www.elastic.co/guide/en/elasticsearch/guide/current/index.html", kind: "livro" },
    { title: "Elastic Learn — Cursos e Certificações", url: "https://www.elastic.co/training/", kind: "curso" },
    { title: "Query DSL Reference Completo", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html", kind: "docs" },
    { title: "Index Lifecycle Management Guide", url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/index-lifecycle-management.html", kind: "docs" },
    { title: "Elasticsearch — Mappings Best Practices", url: "https://www.elastic.co/blog/found-elasticsearch-mapping-introduction", kind: "artigo" },
    { title: "OpenSearch Docs (fork compatível)", url: "https://opensearch.org/docs/latest/", kind: "docs" },
    { title: "Elastic Labs — Blog técnico avançado", url: "https://www.elastic.co/blog/category/engineering", kind: "artigo" },
  ],

  codeExamples: [
    {
      title: "Criação de índice com mapping explícito — TypeScript",
      language: "typescript",
      code: `import { Client } from '@elastic/elasticsearch'
const es = new Client({ node: 'http://localhost:9200' })

await es.indices.create({
  index: 'products_v1',
  body: {
    settings: {
      number_of_shards: 3,
      number_of_replicas: 1,
      analysis: {
        analyzer: {
          portuguese_search: {
            type: 'custom',
            tokenizer: 'standard',
            filter: ['lowercase', 'portuguese_stop', 'portuguese_stemmer'],
          },
        },
        filter: {
          portuguese_stemmer: { type: 'stemmer', language: 'portuguese' },
          portuguese_stop: { type: 'stop', stopwords: '_portuguese_' },
        },
      },
    },
    mappings: {
      properties: {
        title: {
          type: 'text',
          analyzer: 'portuguese_search',
          fields: { keyword: { type: 'keyword' } },   // multi-field
        },
        description: { type: 'text', analyzer: 'portuguese_search' },
        price: { type: 'double' },
        category: { type: 'keyword' },
        tags: { type: 'keyword' },
        created_at: { type: 'date' },
        location: { type: 'geo_point' },
      },
    },
  },
})

// Cria alias para zero-downtime swap
await es.indices.putAlias({ index: 'products_v1', name: 'products' })`,
    },
    {
      title: "Bool Query com filter, must e aggregations",
      language: "typescript",
      code: `import { Client } from '@elastic/elasticsearch'
const es = new Client({ node: 'http://localhost:9200' })

interface SearchParams {
  q: string
  category?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
}

async function searchProducts({ q, category, minPrice, maxPrice, page = 1, size = 20 }: SearchParams) {
  const from = (page - 1) * size

  const result = await es.search({
    index: 'products',
    body: {
      from,
      size,
      _source: ['title', 'price', 'category', 'created_at'],  // _source filtering
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: q,
                fields: ['title^3', 'description^1', 'tags^2'],  // boost por campo
                fuzziness: 'AUTO',
              },
            },
          ],
          filter: [
            // filter: não afeta score, É CACHEADO pelo ES
            ...(category ? [{ term: { category } }] : []),
            ...(minPrice || maxPrice ? [{
              range: {
                price: {
                  ...(minPrice && { gte: minPrice }),
                  ...(maxPrice && { lte: maxPrice }),
                },
              },
            }] : []),
          ],
        },
      },
      sort: [{ _score: 'desc' }, { created_at: 'desc' }],
      aggs: {
        por_categoria: { terms: { field: 'category', size: 10 } },
        faixa_preco: {
          range: {
            field: 'price',
            ranges: [{ to: 100 }, { from: 100, to: 500 }, { from: 500 }],
          },
        },
      },
    },
  })

  return {
    total: result.hits.total,
    hits: result.hits.hits.map(h => h._source),
    aggs: result.aggregations,
  }
}`,
    },
    {
      title: "Paginação com search_after — stateless",
      language: "typescript",
      code: `import { Client } from '@elastic/elasticsearch'
const es = new Client({ node: 'http://localhost:9200' })

// search_after: cursor stateless — sem estado no servidor
// Ideal para paginação em UI com datasets grandes
async function getPage(searchAfter?: [string, string]) {
  const result = await es.search({
    index: 'products',
    body: {
      size: 20,
      sort: [
        { created_at: { order: 'desc' } },
        { _id: { order: 'desc' } },  // tiebreaker determinístico
      ],
      ...(searchAfter && { search_after: searchAfter }),
      query: { match_all: {} },
    },
  })

  const hits = result.hits.hits
  const lastHit = hits[hits.length - 1]
  // Cursor para próxima página: valores do último documento
  const nextCursor = lastHit
    ? [lastHit.sort![0] as string, lastHit.sort![1] as string]
    : null

  return {
    items: hits.map(h => h._source),
    nextCursor,  // passe como searchAfter na próxima chamada
    hasMore: hits.length === 20,
  }
}

// Uso:
// Primeira página
const page1 = await getPage()
// Próxima página usando cursor
const page2 = await getPage(page1.nextCursor!)`,
    },
    {
      title: "Reindex zero-downtime com alias swap",
      language: "typescript",
      code: `import { Client } from '@elastic/elasticsearch'
const es = new Client({ node: 'http://localhost:9200' })

async function reindexZeroDowntime(aliasName: string, newMapping: object) {
  const startTime = new Date().toISOString()

  // 1. Descobre índice atual apontado pelo alias
  const aliasInfo = await es.indices.getAlias({ name: aliasName })
  const currentIndex = Object.keys(aliasInfo)[0]
  const newIndex = currentIndex.replace(/v(\d+)$/, (_, n) => \`v\${+n + 1}\`)

  console.log(\`Reindexando \${currentIndex} → \${newIndex}\`)

  // 2. Cria novo índice com mapping correto
  await es.indices.create({ index: newIndex, body: newMapping })

  // 3. Copia dados (assíncrono para datasets grandes)
  const { body: { task } } = await es.reindex({
    wait_for_completion: false,
    body: {
      source: { index: currentIndex },
      dest: { index: newIndex },
    },
  })

  // Aguarda conclusão
  while (true) {
    const { body: status } = await es.tasks.get({ task_id: task })
    if (status.completed) break
    await new Promise(r => setTimeout(r, 5000))
  }

  // 4. Sincroniza docs criados durante o reindex
  await es.reindex({
    body: {
      source: {
        index: currentIndex,
        query: { range: { updated_at: { gte: startTime } } },
      },
      dest: { index: newIndex },
    },
  })

  // 5. Swap atômico do alias
  await es.indices.updateAliases({
    body: {
      actions: [
        { remove: { index: currentIndex, alias: aliasName } },
        { add: { index: newIndex, alias: aliasName } },
      ],
    },
  })

  // 6. Remove índice antigo
  await es.indices.delete({ index: currentIndex })
  console.log(\`Migração concluída. Alias '\${aliasName}' agora aponta para \${newIndex}\`)
}`,
    },
  ],
}

export default elasticsearch
