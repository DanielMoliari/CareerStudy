import type { SkillContent } from '@/types'

const qdrant: SkillContent = {
  tagline: "Vector database de alta performance: HNSW filterable, payload indexing, multitenancy.",
  why: "Qdrant é uma das melhores opções para vector DB em produção. Saber quando usar sobre pgvector, como configurar coleções, filtros e quantização, é diferencial em stack AI/LLM.",
  summary: "Qdrant é um vector database escrito em Rust, otimizado para busca ANN com filtros. Suporta HNSW com filtros (filterable HNSW), payload indexing (índices em metadados), named vectors (múltiplos vetores por ponto), sparse vectors (para hybrid search BM25 + denso), collections, snapshots e API REST/gRPC.\n\nO principal diferencial do Qdrant sobre soluções como pgvector é o filterable HNSW: durante a construção do índice, o grafo é consciente dos filtros mais comuns, permitindo busca vetorial filtrada sem o custo de pre/post-filtering que degrada recall ou precision.\n\nQdrant também suporta quantização vetorial (scalar int8, binary), named vectors para multimodalidade, e multitenancy via payload filtering — tudo em um servidor Rust de ~50MB de binário.",

  keypoints: [
    { title: "Collections", body: "Unidade de organização. Cada collection tem sua configuração de vetor (dimensão, métrica de distância: Cosine, Dot, Euclid, Manhattan). Isolamento completo entre collections — ideal para multitenancy por cliente." },
    { title: "Points", body: "Unidade de dado: id (UUID ou inteiro) + vector(s) + payload (metadados JSON arbitrários). Payload é indexável e filtrável. Suporta upsert atômico. IDs são globalmente únicos na collection." },
    { title: "Filterable HNSW", body: "Qdrant constrói HNSW consciente dos filtros. Para filtros seletivos, atravessa subgrafo relevante. Evita o problema de pre-filter (quebra o grafo HNSW, destrói o recall) ou post-filter (pode retornar menos que k). Resultado: recall alto mesmo com filtros muito seletivos." },
    { title: "Payload indexing", body: "Índices em campos do payload: keyword (string), integer, float, bool, geo, datetime. Melhora performance de filtros em busca híbrida. Sem índice, filtro é brute-force no payload de todos os candidatos." },
    { title: "Named vectors", body: "Um ponto pode ter múltiplos vetores nomeados: ex. title_embedding (1536d, Cosine) e body_embedding (768d, Dot). Busca em cada vetor independentemente ou com fusão de scores (Reciprocal Rank Fusion)." },
    { title: "Sparse vectors", body: "Suporte a sparse vectors (BM25, SPLADE). Combinado com dense vectors = hybrid search com Reciprocal Rank Fusion. Melhor recall que só dense em domínios com jargão técnico, SKUs, códigos, nomes próprios." },
    { title: "Quantização", body: "Scalar (int8): 4x menos RAM que float32, recall ~99%. Binary: 32x menos RAM, recall ~90–95%. Qdrant suporta rescoring — busca com vetor quantizado, re-rank com vetor original nos top-K candidatos." },
    { title: "Multitenancy", body: "Padrão: um campo tenant_id no payload + payload index + filtro obrigatório. Alternativa: uma collection por tenant (mais isolamento, mais overhead). Com payload filtering, uma collection serve N tenants com recall exato." },
  ],

  gotchas: [
    "Collection sem payload index para filtros frequentes — filtro vira brute-force scan O(N), performance ruim em grandes coleções.",
    "m muito alto em HNSW (ex: 64) — RAM e tempo de build explodem. Default 16 é bom; aumente para 32 apenas com recall comprovadamente melhor nos seus dados.",
    "Quantização binária sem rescoring — recall cai para 90–95%. Ative oversampling + rescoring para manter recall alto.",
    "Sem snapshot/backup — vector DB é estado crítico. Configure snapshots periódicos via API de snapshots do Qdrant ou qdrant-client.",
    "Payload com chaves dinâmicas — impossível indexar tudo antecipadamente. Defina o schema de payload antes de criar a collection e documente quais campos precisam de índice.",
    "Não especificar on_disk para coleções grandes — vetores carregados inteiramente em RAM por default. Use on_disk: true + quantização para coleções > 10M vetores.",
  ],

  interview: [
    {
      q: "Como Qdrant resolve busca com filtros eficientemente?",
      a: "<p><strong>Filterable HNSW</strong>: durante a construção do índice, Qdrant é consciente dos filtros mais comuns e constrói o grafo de forma que o traversal possa ser guiado pelos filtros.</p><p>Durante busca com filtro, em vez de pré-filtrar (quebra o grafo HNSW, destrói o recall) ou pós-filtrar (pode retornar menos que k resultados), Qdrant navega no subgrafo de pontos que satisfazem o filtro. Resultado: recall alto com filtros seletivos sem overhead de dois estágios.</p><p>Para filtros com <strong>seletividade alta</strong> (ex: tenant_id = X onde X tem poucos pontos), Qdrant cai automaticamente para brute-force nos candidatos filtrados — isso é mais rápido que navegar HNSW com poucos vizinhos relevantes.</p>",
      level: "senior",
      tip: "Explique os dois problemas (pré-filter quebra grafo, pós-filter retorna menos que k) antes de apresentar a solução.",
    },
    {
      q: "Quando hybrid search (sparse + dense) é necessário?",
      a: "<p>Dense vectors (embeddings) são bons para similaridade semântica mas podem falhar em matching exato de termos raros: nomes próprios, códigos, jargão técnico, SKUs, IDs. 'iPhone 15 Pro Max 256GB' pode ter score baixo contra 'smartphone Apple 2023' semanticamente, mas exact match é o correto.</p><p>Sparse vectors (BM25, SPLADE) são bons para matching de termos exatos. Combinados via <strong>Reciprocal Rank Fusion</strong> ou score linear, melhoram recall em domínios especializados. Qdrant suporta nativamente com named vectors — cada vetor tem seu próprio índice (HNSW para dense, inverted index para sparse). A query de busca especifica qual vetor usar para cada componente.</p>",
      level: "senior",
    },
    {
      q: "Qual a diferença entre Qdrant e pgvector?",
      a: "<p><strong>pgvector:</strong> integrado ao Postgres (mesma transação, ACID, JOINs SQL), operacionalmente simples, bom até ~1–10M vetores dependendo de índice. Filtros via SQL mas sem HNSW filterable — filtros muito seletivos degradam recall.</p><p><strong>Qdrant:</strong> vector DB dedicado, filterable HNSW nativo, payload indexing, sparse vectors, quantização, collections isoladas. Melhor em escala e filtros complexos. Mais complexidade operacional — servidor adicional, API própria.</p><p><strong>Regra prática:</strong> se você já usa Postgres e o dataset cabe em memória (~1M vetores), pgvector é suficiente. Para AI em escala com filtros complexos, multitenancy ou hybrid search: Qdrant.</p>",
      level: "pleno",
      tip: "Mencione o custo operacional — Qdrant é mais um servidor para manter.",
    },
    {
      q: "O que é quantização de vetores e qual o impacto?",
      a: "<p>Quantização reduz a precisão dos floats para representação menor:</p><ul><li><strong>Scalar (int8):</strong> 4x menos RAM que float32, recall > 99%, leve speedup</li><li><strong>Product Quantization (PQ):</strong> maior compressão (~8-32x), recall moderado</li><li><strong>Binary:</strong> 32x menos RAM, recall pode cair para 90–95%</li></ul><p>Qdrant suporta <strong>oversampling + rescoring</strong>: busca com vetor quantizado para os top-K * oversampling candidatos, re-rank com vetor original nos top-K finais. Mantém recall alto com muito menos RAM. Configurar <code>quantization_config</code> + <code>rescore: true</code> na query.</p>",
      level: "senior",
    },
    {
      q: "Como implementar multitenancy no Qdrant?",
      a: "<p>Dois padrões:</p><ul><li><strong>Uma collection por tenant:</strong> isolamento total, overhead de N collections, difícil de manter em larga escala</li><li><strong>Payload filtering (recomendado):</strong> campo tenant_id no payload + <code>payload_index</code> do tipo keyword + filtro obrigatório em toda query</li></ul><p>Com payload filtering, uma collection serve N tenants com recall exato — filterable HNSW garante que o grafo é traversado apenas nos pontos do tenant correto. Crie o índice: <code>PUT /collections/{name}/index</code> body <code>field_name: 'tenant_id', field_schema: 'keyword'</code>. Sempre inclua o filtro na query para garantir isolamento e performance.</p>",
      level: "senior",
    },
    {
      q: "Como configurar uma collection do zero para produção?",
      a: "<p>Configuração completa:</p><pre>vectors: {\n  size: 1536,           // dimensão do embedding\n  distance: 'Cosine',   // ou Dot (se embeddings L2-norm), Euclid\n  on_disk: false,       // true para coleções > 10M vetores\n},\nhnsw_config: {\n  m: 16,               // conexões por nó (16 é bom até 100M vetores)\n  ef_construct: 100,   // qualidade de construção (mais = melhor recall, mais tempo)\n  on_disk: false,\n},\nquantization_config: {\n  scalar: { type: 'int8', quantile: 0.99, always_ram: true },\n}</pre><p>Depois criar payload indexes para campos usados em filtros. Testar recall com seu dataset antes de ir a produção.</p>",
      level: "pleno",
    },
    {
      q: "Qual a diferença entre ef_construct e ef na busca?",
      a: "<p><strong>ef_construct</strong>: parâmetro de construção do HNSW — quantos candidatos são considerados ao inserir cada ponto no grafo. Maior = melhor recall final, mais tempo de indexação, mais RAM durante build. Tipicamente 100–200.</p><p><strong>ef (search)</strong>: parâmetro de busca — tamanho da lista de candidatos durante o traversal do grafo para cada query. Maior = melhor recall, mais lento por query. Tipicamente 100–200. Pode ser ajustado por query via <code>params: { hnsw_ef: 200 }</code>.</p><p>Trade-off: ef alto = recall alto, latência alta. Para production, calibre ef para seu SLO de latência P99.</p>",
      level: "senior",
    },
    {
      q: "O que são snapshots no Qdrant e como usar?",
      a: "<p>Snapshots são backups completos de uma collection — serialização de todos os vetores, payloads e índices em um arquivo comprimido.</p><p><strong>Criar:</strong> <code>POST /collections/{name}/snapshots</code> — retorna o arquivo. <strong>Listar:</strong> <code>GET /collections/{name}/snapshots</code>. <strong>Restaurar:</strong> <code>PUT /collections/{name}/snapshots/recover</code> com localização do arquivo.</p><p>Para produção: automatize snapshots periódicos (ex: cron), armazene em S3 ou similar. Qdrant Cloud tem snapshots automáticos. Em self-hosted, implemente o ciclo de backup via script.</p>",
      level: "pleno",
    },
    {
      q: "Quando usar Qdrant Cloud vs self-hosted?",
      a: "<p><strong>Qdrant Cloud:</strong> gerenciado, snapshots automáticos, escalabilidade horizontal via API, sem ops overhead. Indicado para equipes pequenas, projetos AI com foco em produto.</p><p><strong>Self-hosted (Docker/K8s):</strong> controle total, sem egress costs, útil quando dados são sensíveis (LGPD, HIPAA) ou quando integração com infra existente é necessária. Requer configuração de persistência, backup e monitoramento.</p><p>Trade-off principal: tempo de operação vs custo. Qdrant Cloud cobra por nó; self-hosted tem custo de infra + ops.</p>",
      level: "pleno",
    },
    {
      q: "Como fazer upsert em batch no Qdrant eficientemente?",
      a: "<p>Use <code>upsert_points</code> (REST: <code>PUT /collections/{name}/points</code>) com batches de 100–1000 pontos. Qdrant processa batch atomicamente — ou tudo é inserido ou falha.</p><p><strong>Python SDK:</strong> <code>client.upsert(collection_name='x', points=[PointStruct(id=i, vector=emb, payload={...})])</code></p><p>Para grandes datasets (> 1M pontos): use paralelismo (múltiplas threads), tamanho de batch 256–512, e monitore memória durante indexação. O HNSW é construído incrementalmente — cada batch atualiza o grafo. Ao final, chame <code>optimize</code> para compactar.</p>",
      level: "pleno",
    },
    {
      q: "O que é Reciprocal Rank Fusion e como o Qdrant suporta?",
      a: "<p><strong>RRF</strong>: técnica de fusão de rankings de múltiplas fontes. Para cada resultado de cada ranker, score RRF = 1 / (k + rank), onde k é constante (tipicamente 60). Soma os scores RRF de todas as fontes e re-ordena.</p><p>Vantagem: não precisa normalizar scores heterogêneos (BM25 vs cosine similarity — escalas diferentes). Robusto a outliers.</p><p>No Qdrant: query com múltiplos named vectors + <code>fusion: 'rrf'</code> no request. Cada named vector produz seu ranking, RRF funde. Alternativa: <code>fusion: 'dbsf'</code> (Distribution-Based Score Fusion) que normaliza scores.</p>",
      level: "senior",
    },
    {
      q: "Como monitorar a saúde de um cluster Qdrant?",
      a: "<p>Endpoints de observabilidade:</p><ul><li><code>GET /metrics</code> — métricas Prometheus: latência de busca, indexação, uso de memória</li><li><code>GET /cluster</code> — estado do cluster, peers, consensus</li><li><code>GET /collections/{name}</code> — status da collection: vectors_count, indexed_vectors_count, status (green/yellow/red)</li></ul><p>Alertar quando <code>status != 'green'</code> (indica indexação em andamento ou erro), latência P99 acima do SLO, e memória se aproximando do limite. O Qdrant expõe métricas padrão que integram diretamente com Prometheus + Grafana.</p>",
      level: "senior",
    },
    {
      q: "Qual o impacto de 'm' no HNSW na performance?",
      a: "<p><strong>m</strong> define o número de conexões bidirecionais por nó no grafo HNSW (camadas superiores usam m, camada 0 usa m*2).</p><ul><li><strong>m baixo (4–8):</strong> menos RAM, build mais rápido, recall menor em datasets grandes</li><li><strong>m médio (16):</strong> bom equilíbrio para a maioria dos casos</li><li><strong>m alto (32–64):</strong> recall maior, RAM proporcional ao m, build mais lento</li></ul><p>Regra prática: m=16 para até 50M vetores. Aumente apenas se recall calibrado com seu dataset mostrar melhora significativa. RAM extra pode valer menos que quantização + m=16.</p>",
      level: "senior",
    },
    {
      q: "Quais métricas de distância o Qdrant suporta e quando usar cada uma?",
      a: "<p><strong>Cosine:</strong> mede ângulo entre vetores, invariante à magnitude. Use quando os embeddings não são L2-normalizados. Padrão para text embeddings (OpenAI, Cohere).</p><p><strong>Dot product:</strong> produto escalar. Matematicamente equivalente a Cosine para vetores L2-normalizados, mas mais rápido. Use se seu embedding model produz vetores normalizados (ex: E5, GTE com normalize=True).</p><p><strong>Euclid (L2):</strong> distância euclidiana. Use para image embeddings ou quando a magnitude tem significado semântico.</p><p><strong>Manhattan:</strong> soma das diferenças absolutas. Menos comum, útil para dados esparsos.</p>",
      level: "pleno",
    },
    {
      q: "Como funciona o filtro de payload no Qdrant?",
      a: "<p>Filtros são expressos em JSON com operadores: <code>must</code> (AND), <code>should</code> (OR), <code>must_not</code> (NOT). Exemplo:</p><pre>filter: {\n  must: [\n    { key: 'tenant_id', match: { value: 'acme' } },\n    { key: 'status', match: { value: 'published' } },\n  ],\n  should: [\n    { key: 'score', range: { gte: 0.8 } },\n  ]\n}</pre><p>Com payload index criado nos campos relevantes, filtro é resolvido via índice invertido antes (ou durante) o traversal HNSW. Sem índice, é brute-force O(N).</p>",
      level: "pleno",
    },
    {
      q: "O que diferencia HNSW de IVF e por que Qdrant usa HNSW?",
      a: "<p><strong>IVF (Inverted File Index):</strong> divide o espaço em clusters (Voronoi cells via k-means), busca apenas nos clusters mais próximos da query. Bom recall com nprobe suficiente, mas requer treinamento offline e é pior com filtros (candidatos estão espalhados por clusters).</p><p><strong>HNSW (Hierarchical NSW):</strong> grafo hierárquico, online (não requer treinamento), suporta updates incrementais, excelente recall. O Qdrant escolheu HNSW porque: (1) não requer batch de treinamento, (2) suporta updates em tempo real, (3) filterable HNSW é viável (IVF com filtros é problemático).</p>",
      level: "senior",
    },
    {
      q: "Como versionar embeddings no Qdrant quando troco de modelo?",
      a: "<p>Problema: novo modelo gera embeddings incompatíveis com os antigos — você não pode misturar vetores de modelos diferentes na mesma busca.</p><p><strong>Estratégias:</strong></p><ul><li><strong>Named vectors:</strong> adicione um novo named vector (<code>v2_embedding</code>) mantendo o antigo (<code>v1_embedding</code>). Re-processe os pontos gradualmente adicionando o campo novo. Busque no v2 quando disponível, v1 como fallback.</li><li><strong>Nova collection:</strong> crie <code>docs_v2</code>, popule com novos embeddings, valide e troque o ponteiro da aplicação. Zero downtime se feito gradualmente.</li></ul><p>Evite misturar vetores de modelos diferentes no mesmo campo — recall despencará sem erro explícito.</p>",
      level: "senior",
    },
    {
      q: "Qual o papel de ef_construct na qualidade do índice?",
      a: "<p><code>ef_construct</code> controla quantos vizinhos são avaliados ao inserir cada novo ponto no grafo HNSW. Maior ef_construct = grafo mais rico = recall maior na busca.</p><p>Trade-off: dobrar ef_construct quase dobra o tempo de indexação. Para indexação one-shot (dataset estático): use ef_construct=200 para qualidade máxima. Para indexação contínua (stream): ef_construct=100 equilibra throughput e qualidade.</p><p>Importante: ef_construct afeta apenas a qualidade do grafo construído. Aumentar ef na busca também melhora recall mas com custo por query — prefira calibrar os dois.</p>",
      level: "senior",
    },
    {
      q: "Como fazer scroll (listagem paginada) de pontos no Qdrant?",
      a: "<p>O Qdrant suporta scroll sem offset numérico (que seria O(N)). Use cursor-based pagination via <code>offset</code> como UUID do último ponto retornado.</p><p><strong>API:</strong> <code>POST /collections/{name}/points/scroll</code> com body <code>{ limit: 100, filter: {...}, with_payload: true, with_vector: false }</code>. A resposta inclui <code>next_page_offset</code> — passe-o como <code>offset</code> na próxima chamada. Quando <code>next_page_offset</code> for null, paginação acabou.</p><p>Uso comum: exportar todos os pontos de um tenant, re-indexar após mudança de modelo, backfill de campos no payload.</p>",
      level: "pleno",
    },
    {
      q: "Como o Qdrant garante alta disponibilidade em cluster?",
      a: "<p>Em modo cluster, Qdrant usa <strong>sharding + replicação</strong>. Cada collection é dividida em N shards, cada shard replicado R vezes. Writes vão para o shard líder, reads podem ir para qualquer réplica.</p><p><strong>Configuração:</strong> <code>shard_number: 6, replication_factor: 2</code>. Com 3 nós, cada nó tem 2 shards e 2 réplicas de outros shards — perda de 1 nó não perde dados.</p><p>Raft consensus para eleição de líder de shard. Durante failover, o cluster redireciona queries para réplicas disponíveis. <code>write_consistency_factor</code> controla quantas réplicas devem confirmar antes de retornar sucesso ao cliente.</p>",
      level: "senior",
    },
    {
      q: "Qual a diferença entre upsert e update de payload no Qdrant?",
      a: "<p><strong>Upsert (upsert_points):</strong> insere ou substitui o ponto inteiro (vector + payload). Se o ID já existe, sobrescreve tudo — incluindo apagar campos de payload não especificados.</p><p><strong>Set/Overwrite payload:</strong> <code>POST /points/payload</code> com <code>payload: {...}</code> — atualiza apenas os campos especificados, mantém os demais. Ideal para updates parciais (ex: só atualizar o campo <code>status</code>).</p><p><strong>Delete payload field:</strong> <code>POST /points/payload/delete</code> para remover campos específicos. Use filtro para selecionar quais pontos atualizar sem iterar todos.</p>",
      level: "pleno",
    },
  ],

  diagrams: [
    {
      title: "Arquitetura de um Point no Qdrant",
      html: `
<style>
.qd-point-wrap { font-family: 'JetBrains Mono', monospace; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; }
.qd-point-box { border: 2px solid #38bdf8; border-radius: 8px; padding: 16px; }
.qd-point-title { color: #38bdf8; font-size: 13px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
.qd-point-field { display: flex; gap: 12px; margin-bottom: 8px; align-items: flex-start; }
.qd-field-label { color: #64748b; font-size: 12px; min-width: 80px; padding-top: 2px; }
.qd-field-val { color: #e2e8f0; font-size: 12px; }
.qd-vec-box { background: #1e293b; border-radius: 6px; padding: 8px; display: flex; gap: 6px; flex-wrap: wrap; }
.qd-vec-num { color: #4ade80; font-size: 11px; }
.qd-payload-box { background: #1e293b; border-radius: 6px; padding: 8px; }
.qd-payload-row { display: flex; gap: 8px; margin-bottom: 4px; }
.qd-payload-key { color: #a78bfa; font-size: 12px; }
.qd-payload-v { color: #fbbf24; font-size: 12px; }
.qd-tag { display: inline-block; background: #0f172a; border: 1px solid #334155; border-radius: 4px; padding: 2px 8px; font-size: 11px; color: #94a3b8; margin-right: 6px; }
.qd-arrow { text-align: center; color: #334155; margin: 12px 0; font-size: 20px; }
</style>
<div class="qd-point-wrap">
  <div class="qd-point-box">
    <div class="qd-point-title">Point (unidade de dado)</div>
    <div class="qd-point-field">
      <span class="qd-field-label">id:</span>
      <span class="qd-field-val"><span class="qd-tag">UUID</span> ou <span class="qd-tag">integer</span> — único na collection</span>
    </div>
    <div class="qd-point-field">
      <span class="qd-field-label">vector:</span>
      <div>
        <div class="qd-vec-box">
          <span class="qd-vec-num">0.032</span><span class="qd-vec-num">-0.418</span><span class="qd-vec-num">0.771</span><span class="qd-vec-num">0.129</span><span class="qd-vec-num">...</span><span style="color:#64748b;font-size:11px"> ×1536 dims</span>
        </div>
        <div style="margin-top:6px;font-size:11px;color:#64748b">ou named: { title_emb: [...], body_emb: [...] }</div>
      </div>
    </div>
    <div class="qd-point-field">
      <span class="qd-field-label">payload:</span>
      <div class="qd-payload-box" style="flex:1">
        <div class="qd-payload-row"><span class="qd-payload-key">"tenant_id":</span><span class="qd-payload-v">"acme-corp"</span></div>
        <div class="qd-payload-row"><span class="qd-payload-key">"status":</span><span class="qd-payload-v">"published"</span></div>
        <div class="qd-payload-row"><span class="qd-payload-key">"score":</span><span class="qd-payload-v">0.95</span></div>
        <div class="qd-payload-row"><span class="qd-payload-key">"created_at":</span><span class="qd-payload-v">"2024-01-15T..."</span></div>
        <div style="margin-top:4px;font-size:11px;color:#64748b">indexável por keyword / integer / float / geo / datetime</div>
      </div>
    </div>
  </div>
  <div class="qd-arrow">↓ agrupa em</div>
  <div style="border:2px solid #a78bfa;border-radius:8px;padding:12px;text-align:center">
    <span style="color:#a78bfa;font-size:13px;font-weight:700">Collection</span>
    <span style="color:#64748b;font-size:12px;margin-left:12px">{ size: 1536, distance: 'Cosine', hnsw_config: {...} }</span>
  </div>
</div>
      `,
      caption: "Cada ponto tem ID + vetor(es) + payload JSON. O payload pode ser indexado para filtros eficientes.",
    },
    {
      title: "Filterable HNSW: como funciona",
      html: `
<style>
.qd-hnsw-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 640px; margin: 0 auto; }
.qd-hnsw-title { color: #38bdf8; font-size: 14px; font-weight: 700; margin-bottom: 16px; }
.qd-compare-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.qd-approach { background: #1e293b; border-radius: 8px; padding: 12px; }
.qd-approach-title { font-size: 12px; font-weight: 700; margin-bottom: 8px; }
.qd-approach-bad { color: #ef4444; }
.qd-approach-ok { color: #f59e0b; }
.qd-approach-good { color: #4ade80; }
.qd-approach-body { font-size: 11px; color: #94a3b8; line-height: 1.5; }
.qd-problem { color: #ef4444; font-size: 11px; margin-top: 6px; }
.qd-visual { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
.qd-node { width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 8px; color: white; }
.qd-node-match { background: #4ade80; }
.qd-node-no { background: #334155; opacity: 0.4; }
.qd-node-active { background: #38bdf8; }
</style>
<div class="qd-hnsw-wrap">
  <div class="qd-hnsw-title">Estratégias de busca vetorial com filtro</div>
  <div class="qd-compare-row">
    <div class="qd-approach">
      <div class="qd-approach-title qd-approach-bad">Pre-filter</div>
      <div class="qd-approach-body">Filtra primeiro → busca nos resultados</div>
      <div class="qd-problem">Quebra o grafo HNSW — vizinhos podem ter sido removidos. Recall despenca.</div>
    </div>
    <div class="qd-approach">
      <div class="qd-approach-title qd-approach-ok">Post-filter</div>
      <div class="qd-approach-body">Busca k vizinhos → filtra resultados</div>
      <div class="qd-problem">Pode retornar &lt; k resultados. Filtro seletivo = problema.</div>
    </div>
    <div class="qd-approach">
      <div class="qd-approach-title qd-approach-good">Filterable HNSW</div>
      <div class="qd-approach-body">Grafo consciente do filtro — navega apenas nos nós que passam no filtro</div>
      <div style="color:#4ade80;font-size:11px;margin-top:6px">Recall alto. Retorna exatamente k.</div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:12px;font-size:12px;color:#94a3b8">
    <span style="color:#4ade80;font-weight:700">Como Qdrant faz: </span>durante indexação HNSW, mantém subgrafos por segmentos de payload. Query com filtro traversa o subgrafo relevante. Para filtros muito seletivos (&lt; 1% dos pontos), cai automaticamente para brute-force — mais rápido que grafo com poucos nós.
  </div>
</div>
      `,
      caption: "Pre-filter quebra o grafo, post-filter retorna menos resultados. Filterable HNSW resolve os dois.",
    },
    {
      title: "Hybrid Search: Dense + Sparse com RRF",
      html: `
<style>
.qd-hybrid-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 640px; margin: 0 auto; }
.qd-hybrid-row { display: flex; gap: 12px; margin-bottom: 16px; }
.qd-hybrid-box { flex: 1; background: #1e293b; border-radius: 8px; padding: 12px; }
.qd-hybrid-box-title { font-size: 12px; font-weight: 700; margin-bottom: 8px; color: #38bdf8; }
.qd-hybrid-item { font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
.qd-rank-item { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px; }
.qd-rank-key { color: #e2e8f0; }
.qd-rank-val { color: #fbbf24; }
.qd-arrow-center { text-align: center; color: #a78bfa; font-weight: 700; font-size: 14px; margin: 8px 0; }
.qd-fusion-box { background: #1e293b; border: 2px solid #a78bfa; border-radius: 8px; padding: 12px; text-align: center; }
.qd-rrf-formula { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #4ade80; margin: 8px 0; }
</style>
<div class="qd-hybrid-wrap">
  <div class="qd-hybrid-row">
    <div class="qd-hybrid-box">
      <div class="qd-hybrid-box-title">Dense Vector (HNSW)</div>
      <div class="qd-hybrid-item">Embedding semântico (1536d)</div>
      <div class="qd-hybrid-item">Bom para: significado geral</div>
      <div class="qd-hybrid-item">Ruim para: termos raros, SKUs, nomes</div>
      <div style="margin-top:8px;border-top:1px solid #334155;padding-top:8px">
        <div class="qd-rank-item"><span class="qd-rank-key">doc_A</span><span class="qd-rank-val">rank 1</span></div>
        <div class="qd-rank-item"><span class="qd-rank-key">doc_C</span><span class="qd-rank-val">rank 2</span></div>
        <div class="qd-rank-item"><span class="qd-rank-key">doc_B</span><span class="qd-rank-val">rank 3</span></div>
      </div>
    </div>
    <div class="qd-hybrid-box">
      <div class="qd-hybrid-box-title" style="color:#f59e0b">Sparse Vector (BM25/SPLADE)</div>
      <div class="qd-hybrid-item">Index invertido de tokens</div>
      <div class="qd-hybrid-item">Bom para: termos exatos, jargão</div>
      <div class="qd-hybrid-item">Ruim para: paráfrase, sinonímia</div>
      <div style="margin-top:8px;border-top:1px solid #334155;padding-top:8px">
        <div class="qd-rank-item"><span class="qd-rank-key">doc_B</span><span class="qd-rank-val">rank 1</span></div>
        <div class="qd-rank-item"><span class="qd-rank-key">doc_A</span><span class="qd-rank-val">rank 2</span></div>
        <div class="qd-rank-item"><span class="qd-rank-key">doc_D</span><span class="qd-rank-val">rank 3</span></div>
      </div>
    </div>
  </div>
  <div class="qd-arrow-center">↓ Reciprocal Rank Fusion ↓</div>
  <div class="qd-fusion-box">
    <div style="color:#a78bfa;font-weight:700;font-size:13px;margin-bottom:8px">score_RRF(doc) = Σ 1/(k + rank_i)</div>
    <div class="qd-rrf-formula">k = 60 (constante)</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:8px">Não precisa normalizar escalas. Robusto a outliers. Qdrant: fusion: 'rrf' na query.</div>
    <div style="margin-top:8px;border-top:1px solid #334155;padding-top:8px;display:flex;gap:12px;justify-content:center">
      <span style="font-size:11px;color:#4ade80">doc_A: 1/61 + 1/62 ≈ 0.032</span>
      <span style="font-size:11px;color:#4ade80">doc_B: 1/63 + 1/61 ≈ 0.032</span>
    </div>
  </div>
</div>
      `,
      caption: "Hybrid search combina busca semântica com busca lexical. RRF funde os rankings sem normalização de scores.",
    },
    {
      title: "Quantização: Trade-off RAM vs Recall",
      html: `
<style>
.qd-quant-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 640px; margin: 0 auto; }
.qd-quant-title { color: #38bdf8; font-size: 14px; font-weight: 700; margin-bottom: 16px; }
.qd-quant-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.qd-quant-table th { color: #64748b; font-weight: 600; padding: 8px; text-align: left; border-bottom: 1px solid #334155; }
.qd-quant-table td { padding: 8px; border-bottom: 1px solid #1e293b; color: #e2e8f0; }
.qd-badge-none { background: #334155; color: #94a3b8; }
.qd-badge-int8 { background: #065f46; color: #4ade80; }
.qd-badge-pq { background: #78350f; color: #f59e0b; }
.qd-badge-bin { background: #7f1d1d; color: #f87171; }
.qd-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.qd-rescore { background: #1e293b; border: 1px solid #a78bfa; border-radius: 8px; padding: 12px; margin-top: 16px; font-size: 12px; color: #94a3b8; }
</style>
<div class="qd-quant-wrap">
  <div class="qd-quant-title">Tipos de quantização no Qdrant</div>
  <table class="qd-quant-table">
    <thead>
      <tr>
        <th>Tipo</th><th>Compressão</th><th>Recall</th><th>Velocidade</th><th>Use quando</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="qd-badge qd-badge-none">float32</span></td>
        <td>1x (base)</td>
        <td style="color:#4ade80">100%</td>
        <td>Referência</td>
        <td>Dataset pequeno, recall crítico</td>
      </tr>
      <tr>
        <td><span class="qd-badge qd-badge-int8">int8</span></td>
        <td>4x menos RAM</td>
        <td style="color:#4ade80">~99%</td>
        <td>1.5–2x mais rápido</td>
        <td>Produção geral — melhor custo-benefício</td>
      </tr>
      <tr>
        <td><span class="qd-badge qd-badge-pq">PQ</span></td>
        <td>8–32x menos RAM</td>
        <td style="color:#f59e0b">~90–97%</td>
        <td>Variável</td>
        <td>Dataset enorme, RAM muito limitada</td>
      </tr>
      <tr>
        <td><span class="qd-badge qd-badge-bin">binary</span></td>
        <td>32x menos RAM</td>
        <td style="color:#ef4444">~90–95%</td>
        <td>3–5x mais rápido</td>
        <td>Scale extremo, recall relaxado</td>
      </tr>
    </tbody>
  </table>
  <div class="qd-rescore">
    <strong style="color:#a78bfa">Rescoring pattern:</strong> busca com vetor quantizado → top-K × oversampling candidatos → re-rank com vetor float32 original → retorna top-K. Mantém recall alto com RAM reduzida. Configure: <code style="color:#4ade80">rescore: true</code> na query + <code>oversampling: 2.0</code>.
  </div>
</div>
      `,
      caption: "Scalar int8 é o ponto ideal para produção: 4x menos RAM, recall ~99%. Binary para escala extrema com rescoring.",
    },
  ],

  cheatsheet: {
    title: "Qdrant CheatSheet",
    html: `
<style>
.qd-cs-wrap { font-family: 'JetBrains Mono', monospace; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 700px; margin: 0 auto; font-size: 12px; }
.qd-cs-section { margin-bottom: 20px; }
.qd-cs-title { color: #38bdf8; font-size: 13px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #334155; padding-bottom: 6px; }
.qd-cs-row { display: flex; gap: 12px; margin-bottom: 6px; }
.qd-cs-cmd { color: #4ade80; min-width: 220px; }
.qd-cs-desc { color: #94a3b8; }
.qd-cs-warn { color: #ef4444; }
.qd-cs-ok { color: #4ade80; }
</style>
<div class="qd-cs-wrap">
  <div class="qd-cs-section">
    <div class="qd-cs-title">Operações de Collection</div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">PUT /collections/{name}</span><span class="qd-cs-desc">Criar collection com config de vetores</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">DELETE /collections/{name}</span><span class="qd-cs-desc">Deletar collection</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">GET /collections/{name}</span><span class="qd-cs-desc">Info + status (green/yellow/red)</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">PUT /collections/{name}/index</span><span class="qd-cs-desc">Criar payload index em campo</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">POST /collections/{name}/snapshots</span><span class="qd-cs-desc">Criar snapshot (backup)</span></div>
  </div>
  <div class="qd-cs-section">
    <div class="qd-cs-title">Operações de Points</div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">PUT /collections/{name}/points</span><span class="qd-cs-desc">Upsert pontos em batch</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">POST /points/search</span><span class="qd-cs-desc">Busca vetorial (+ filtro opcional)</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">POST /points/scroll</span><span class="qd-cs-desc">Paginação por cursor (sem offset numérico)</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">POST /points/payload</span><span class="qd-cs-desc">Atualizar payload (parcial)</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">POST /points/delete</span><span class="qd-cs-desc">Deletar por filtro ou IDs</span></div>
  </div>
  <div class="qd-cs-section">
    <div class="qd-cs-title">Parâmetros HNSW</div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">m: 16</span><span class="qd-cs-desc">Conexões por nó. Default 16, aumente apenas se recall pede</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">ef_construct: 100</span><span class="qd-cs-desc">Qualidade de build. 100 para stream, 200 para one-shot</span></div>
    <div class="qd-cs-row"><span class="qd-cs-cmd">ef: 128 (na query)</span><span class="qd-cs-desc">Candidatos por busca. Maior = recall melhor, latência maior</span></div>
  </div>
  <div class="qd-cs-section">
    <div class="qd-cs-title">Regras rápidas</div>
    <div class="qd-cs-row"><span class="qd-cs-warn">✗</span><span class="qd-cs-desc">Filtrar sem payload index — brute-force O(N)</span></div>
    <div class="qd-cs-row"><span class="qd-cs-warn">✗</span><span class="qd-cs-desc">Misturar vetores de modelos diferentes no mesmo campo</span></div>
    <div class="qd-cs-row"><span class="qd-cs-warn">✗</span><span class="qd-cs-desc">m > 32 sem calibrar recall no seu dataset</span></div>
    <div class="qd-cs-row"><span class="qd-cs-ok">✓</span><span class="qd-cs-desc">int8 quantização + rescore para produção</span></div>
    <div class="qd-cs-row"><span class="qd-cs-ok">✓</span><span class="qd-cs-desc">tenant_id como keyword index para multitenancy</span></div>
    <div class="qd-cs-row"><span class="qd-cs-ok">✓</span><span class="qd-cs-desc">Snapshot periódico — vector DB é estado crítico</span></div>
  </div>
</div>
    `,
    caption: "Referência rápida dos endpoints, parâmetros e regras do Qdrant.",
  },

  mindmap: {
    title: "Mapa Mental: Qdrant",
    html: `
<style>
.qd-mm-wrap { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 28px; max-width: 680px; margin: 0 auto; }
.qd-mm-center { background: #ef4444; color: white; border-radius: 8px; padding: 10px 20px; text-align: center; font-weight: 700; font-size: 15px; display: inline-block; margin: 0 auto; width: 100%; box-sizing: border-box; }
.qd-mm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
.qd-mm-branch { background: #1e293b; border-radius: 8px; padding: 14px; }
.qd-mm-branch-title { font-weight: 700; font-size: 13px; margin-bottom: 8px; }
.qd-mm-leaf { font-size: 11px; color: #94a3b8; margin-bottom: 4px; padding-left: 8px; border-left: 2px solid; }
</style>
<div class="qd-mm-wrap">
  <div class="qd-mm-center">Qdrant — Vector Database</div>
  <div class="qd-mm-grid">
    <div class="qd-mm-branch">
      <div class="qd-mm-branch-title" style="color:#38bdf8">Estrutura</div>
      <div class="qd-mm-leaf" style="border-color:#38bdf8">Collection → config de vetores</div>
      <div class="qd-mm-leaf" style="border-color:#38bdf8">Point: ID + vector + payload</div>
      <div class="qd-mm-leaf" style="border-color:#38bdf8">Named vectors (multimodal)</div>
      <div class="qd-mm-leaf" style="border-color:#38bdf8">Payload: metadados JSON</div>
    </div>
    <div class="qd-mm-branch">
      <div class="qd-mm-branch-title" style="color:#4ade80">Indexação</div>
      <div class="qd-mm-leaf" style="border-color:#4ade80">HNSW: m, ef_construct</div>
      <div class="qd-mm-leaf" style="border-color:#4ade80">Filterable HNSW (diferencial)</div>
      <div class="qd-mm-leaf" style="border-color:#4ade80">Payload index: keyword/int/float</div>
      <div class="qd-mm-leaf" style="border-color:#4ade80">Sparse: inverted index</div>
    </div>
    <div class="qd-mm-branch">
      <div class="qd-mm-branch-title" style="color:#f59e0b">Busca</div>
      <div class="qd-mm-leaf" style="border-color:#f59e0b">Vetorial + filtro (must/should)</div>
      <div class="qd-mm-leaf" style="border-color:#f59e0b">Hybrid: dense + sparse</div>
      <div class="qd-mm-leaf" style="border-color:#f59e0b">RRF ou DBSF para fusão</div>
      <div class="qd-mm-leaf" style="border-color:#f59e0b">ef (search) por query</div>
    </div>
    <div class="qd-mm-branch">
      <div class="qd-mm-branch-title" style="color:#a78bfa">Produção</div>
      <div class="qd-mm-leaf" style="border-color:#a78bfa">Quantização int8 + rescore</div>
      <div class="qd-mm-leaf" style="border-color:#a78bfa">Snapshots periódicos</div>
      <div class="qd-mm-leaf" style="border-color:#a78bfa">Cluster: sharding + réplicas</div>
      <div class="qd-mm-leaf" style="border-color:#a78bfa">Métricas Prometheus /metrics</div>
    </div>
  </div>
</div>
    `,
    caption: "Visão geral de Qdrant: estrutura, indexação, busca e produção.",
  },

  mnemonics: [
    {
      label: "Filterable HNSW: PRE quebra, PÓS falta, FIL passa",
      trick: "PRE-filter quebra o grafo, PÓS-filter falta resultados, Filterable HNSW passa nos dois",
      explanation: "Três abordagens de busca vetorial com filtro: PRE-filter filtra antes de entrar no grafo — quebra os caminhos do HNSW, recall despenca. PÓS-filter busca k vizinhos e filtra depois — pode retornar menos que k resultados quando o filtro é seletivo. Filterable HNSW (Qdrant): grafo construído consciente dos filtros, traversal navega apenas nós válidos — recall alto e retorna exatamente k. Em entrevista: explique os dois anti-padrões antes de apresentar a solução.",
    },
    {
      label: "DQMTS: collection Qdrant para produção",
      trick: "Dá Qualidade Mesmo Tendo Scale — Distance, Quantização, m do HNSW, ef/ef_construct, Snapshot",
      explanation: "Os 5 parâmetros obrigatórios ao criar uma collection: D=Distance (Cosine para embeddings não normalizados, Dot para normalizados), Q=Quantização (int8 + rescore=true: 4x menos RAM, recall ~99%), M=m do HNSW (m=16 para maioria, m=32 só com recall comprovado melhor), T=ef/ef_construct (ef_construct=100 stream/200 one-shot, ef na query calibrado para SLO P99), S=Snapshot (backup periódico obrigatório — vector DB é estado crítico). Configuração errada no início = reindexação cara em produção.",
    },
    {
      label: "RRF: score = 1 sobre (60 mais rank), somado por ranker",
      trick: "Não normaliza escalas — usa só o rank, não o score absoluto",
      explanation: "Reciprocal Rank Fusion: score(doc) = Σ 1/(k + rank_i) onde k=60 é constante. Vantagem principal: não precisa normalizar escalas incompatíveis (cosine similarity 0–1 vs BM25 0–∞). Usa apenas o ranking, não o score absoluto. Robusto a outliers. Exemplo: Doc A rank 1 em dense (1/61) + rank 3 em sparse (1/63) = 0.032. No Qdrant: fusion: 'rrf' na query. A maioria esquece que RRF usa só ranks, não scores — isso é o que o torna robusto.",
    },
  ],

  exercises: [
    {
      level: "iniciante",
      title: "Criar collection e inserir pontos",
      description: "Configure um Qdrant local via Docker. Crie uma collection 'artigos' com dimensão 384, distância Cosine. Insira 10 pontos com embeddings fake (use numpy.random ou torch.randn) e payload { category: string, score: float }. Faça uma busca vetorial e valide os resultados.",
      concepts: ["collection", "points", "upsert", "search", "payload"],
    },
    {
      level: "intermediario",
      title: "Payload index e filtro eficiente",
      description: "Na collection do exercício anterior, adicione um payload index no campo 'category' (tipo keyword) e no campo 'score' (tipo float). Meça o tempo de uma busca com filtro must: [{key: 'category', match: {value: 'tech'}}] antes e depois do índice. Use 10.000 pontos para ver diferença real. Verifique com GET /collections/artigos que o campo aparece em payload_schema.",
      concepts: ["payload indexing", "keyword index", "filterable HNSW", "performance"],
    },
    {
      level: "intermediario",
      title: "Multitenancy com payload filtering",
      description: "Implemente multitenancy: insira 1.000 pontos com tenant_id em A ou B. Crie payload index no tenant_id. Escreva uma função search_for_tenant(query_vector, tenant_id) que garante que só pontos do tenant correto são retornados. Adicione um teste que verifica isolamento: resultados do tenant A nunca aparecem em busca do tenant B.",
      concepts: ["multitenancy", "payload filter", "must", "keyword match"],
    },
    {
      level: "senior",
      title: "Hybrid search com RRF",
      description: "Configure uma collection com named vectors: 'dense' (sentence-transformers, 384d) e 'sparse' (BM25 com qdrant_bm25 ou splade). Indexe 500 documentos com conteúdo técnico (jargão, siglas). Compare recall de: (1) só dense, (2) só sparse, (3) hybrid com RRF. Use 20 queries com termos técnicos raros. Esperado: hybrid > max(dense, sparse) em pelo menos 60% das queries.",
      concepts: ["named vectors", "sparse vectors", "RRF", "hybrid search", "recall"],
    },
    {
      level: "senior",
      title: "Quantização com rescoring e benchmark de RAM",
      description: "Crie duas collections idênticas: 'bench_float' (float32) e 'bench_quant' (int8 + rescore). Indexe 100.000 vetores de 1536d. Meça: (1) RAM usada por cada collection via GET /collections, (2) latência P50 e P99 de 1.000 buscas, (3) recall@10 usando ground truth calculado com brute-force. Documente o trade-off observado.",
      concepts: ["quantização", "int8", "rescoring", "RAM", "recall", "benchmark"],
    },
  ],

  codeExamples: [
    {
      title: "Criar collection e fazer upsert com Python SDK",
      language: "python",
      code: `from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    ScalarQuantization, ScalarQuantizationConfig, ScalarType,
    PayloadSchemaType,
)
import numpy as np

client = QdrantClient(url="http://localhost:6333")

# Criar collection com quantização int8
client.recreate_collection(
    collection_name="artigos",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
    quantization_config=ScalarQuantization(
        scalar=ScalarQuantizationConfig(
            type=ScalarType.INT8,
            quantile=0.99,
            always_ram=True,  # índice quant em RAM mesmo com on_disk=True
        )
    ),
)

# Criar payload index para filtros eficientes
client.create_payload_index(
    collection_name="artigos",
    field_name="tenant_id",
    field_schema=PayloadSchemaType.KEYWORD,
)
client.create_payload_index(
    collection_name="artigos",
    field_name="score",
    field_schema=PayloadSchemaType.FLOAT,
)

# Upsert em batch
embeddings = np.random.randn(100, 1536).tolist()
points = [
    PointStruct(
        id=i,
        vector=embeddings[i],
        payload={
            "tenant_id": "acme" if i % 2 == 0 else "globo",
            "title": f"Artigo {i}",
            "score": float(np.random.uniform(0, 1)),
        }
    )
    for i in range(100)
]
client.upsert(collection_name="artigos", points=points)
print(f"Upserted {len(points)} points")`,
    },
    {
      title: "Busca vetorial com filtro e multitenancy",
      language: "python",
      code: `from qdrant_client.models import Filter, FieldCondition, MatchValue, Range, SearchParams

def search_for_tenant(
    client: QdrantClient,
    query_vector: list[float],
    tenant_id: str,
    limit: int = 10,
    min_score: float = 0.7,
):
    """Busca vetorial com isolamento de tenant via payload filter."""
    results = client.search(
        collection_name="artigos",
        query_vector=query_vector,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="tenant_id",
                    match=MatchValue(value=tenant_id),
                ),
                FieldCondition(
                    key="score",
                    range=Range(gte=min_score),
                ),
            ]
        ),
        limit=limit,
        with_payload=True,
        search_params=SearchParams(
            hnsw_ef=128,   # mais candidatos = recall melhor (default ~10)
            exact=False,   # True = brute-force, para debugging de recall
        ),
    )
    return results

# Hybrid search com named vectors + RRF
from qdrant_client.models import NamedVector, SearchRequest, Fusion

results = client.query_points(
    collection_name="artigos_hybrid",
    prefetch=[
        {"query": dense_vector, "using": "dense", "limit": 20},
        {"query": sparse_vector, "using": "sparse", "limit": 20},
    ],
    query=Fusion.RRF,  # Reciprocal Rank Fusion
    limit=10,
)`,
    },
    {
      title: "Scroll paginado e snapshot automático",
      language: "python",
      code: `import httpx
from qdrant_client.models import ScrollRequest

# Scroll cursor-based (sem offset numérico O(N))
def scroll_all_points(client, collection: str, tenant_id: str):
    """Itera todos os pontos de um tenant com cursor pagination."""
    offset = None
    all_points = []

    while True:
        result = client.scroll(
            collection_name=collection,
            scroll_filter=Filter(must=[
                FieldCondition(key="tenant_id", match=MatchValue(value=tenant_id))
            ]),
            limit=256,
            offset=offset,
            with_payload=True,
            with_vectors=False,  # não precisamos dos vetores no export
        )
        points, next_offset = result
        all_points.extend(points)

        if next_offset is None:
            break  # última página
        offset = next_offset

    return all_points

# Criar snapshot e salvar URL
import asyncio

async def create_snapshot(collection: str, base_url: str = "http://localhost:6333"):
    """Cria snapshot e retorna a URL de download."""
    async with httpx.AsyncClient() as http:
        resp = await http.post(
            f"{base_url}/collections/{collection}/snapshots",
            timeout=120.0,  # pode demorar para coleções grandes
        )
        resp.raise_for_status()
        data = resp.json()
        snapshot_name = data["result"]["name"]
        download_url = f"{base_url}/collections/{collection}/snapshots/{snapshot_name}"
        print(f"Snapshot: {download_url}")
        return download_url

# Uso: asyncio.run(create_snapshot("artigos"))`,
    },
  ],

  videos: [
    { title: "Qdrant in 5 Minutes", channel: "Qdrant Official", url: "https://www.youtube.com/watch?v=LRcZ9pbGnno", topic: "Intro" },
    { title: "Vector Search with Qdrant - Full Course", channel: "freeCodeCamp", url: "https://www.youtube.com/watch?v=GMs3kqKWmss", topic: "Full Tutorial" },
    { title: "Filterable HNSW — How It Works", channel: "Qdrant Official", url: "https://www.youtube.com/watch?v=C3o5kSVhpX0", topic: "HNSW" },
    { title: "Hybrid Search with Sparse + Dense Vectors", channel: "Qdrant Official", url: "https://www.youtube.com/watch?v=uCkW-3Mc4wU", topic: "Hybrid Search" },
    { title: "Vector Quantization Explained", channel: "Andrej Karpathy", url: "https://www.youtube.com/watch?v=RVH7eHWK8yI", topic: "Quantização" },
  ],

  resources: [
    { title: "Qdrant Documentation", url: "https://qdrant.tech/documentation/", kind: "docs" },
    { title: "Qdrant — Filterable HNSW (artigo técnico)", url: "https://qdrant.tech/articles/filtrable-hnsw/", kind: "artigo" },
    { title: "Hybrid Search with Qdrant (guia oficial)", url: "https://qdrant.tech/documentation/tutorials/hybrid-search/", kind: "docs" },
    { title: "Vector Quantization — Qdrant Blog", url: "https://qdrant.tech/articles/scalar-quantization/", kind: "artigo" },
    { title: "Multitenancy Best Practices", url: "https://qdrant.tech/documentation/guides/multiple-partitions/", kind: "docs" },
    { title: "Qdrant Python Client API Reference", url: "https://python-client.qdrant.tech/", kind: "docs" },
    { title: "ANN Benchmarks (comparação objetiva)", url: "https://ann-benchmarks.com/", kind: "pratica" },
  ],
}

export default qdrant
