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

// ── Paleta Qdrant ─────────────────────────────────────────────────────────────
const C   = '#ef4444'  // Qdrant red

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre Qdrant em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Filterable HNSW, hybrid search, RRF, quantização com rescoring, multitenancy, snapshots, cluster, named vectors, payload filtering e muito mais.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Endpoints, parâmetros HNSW e regras rápidas',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: endpoints REST de collections e points, parâmetros HNSW (m, ef_construct, ef), métricas de distância, quantização, multitenancy, regras de ouro.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para fixar Qdrant na memória',
    type: 'mnemonics',
    pages: 2,
    description: 'PRE/PÓS/FIL para filterable HNSW, DQMTS para configuração de produção, RRF step-by-step. Os mnemônicos que grudam os conceitos mais cobrados.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 5 erros mais comuns com Qdrant',
    type: 'antipatterns',
    pages: 2,
    description: 'Filtrar sem payload index, misturar modelos no mesmo campo, quantização binária sem rescoring, HNSW m muito alto, sem snapshot.',
    icon: '04',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'quick-ref',
    title: 'Quick Ref — API',
    subtitle: 'Endpoints REST e Python SDK referência',
    type: 'quick-ref',
    pages: 2,
    description: 'Referência rápida de endpoints REST, operações Python SDK, parâmetros de busca, configuração de collection e cluster.',
    icon: '05',
    goal: 'Consulta de API',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Como Qdrant resolve busca vetorial com filtros sem degradar recall?',
    a: '<strong>Filterable HNSW</strong>: o grafo HNSW é construído consciente dos filtros mais comuns. Na busca, o traversal navega apenas nós que passam no filtro payload. Evita dois anti-padrões: <strong>pre-filter</strong> (filtra antes de entrar no grafo — quebra os caminhos, recall despenca) e <strong>post-filter</strong> (busca k vizinhos e filtra depois — pode retornar menos que k). Para filtros muito seletivos (< 1% dos pontos), Qdrant cai automaticamente para brute-force nos candidatos filtrados — mais rápido que grafo esparso.',
    tip: 'Mencione os dois anti-padrões (pre e post-filter) antes da solução — demonstra entendimento profundo do problema.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Qdrant e pgvector? Quando usar cada um?',
    a: '<strong>pgvector</strong>: extensão Postgres, sem servidor adicional, ACID, JOINs SQL. Filtros via SQL mas sem filterable HNSW — filtros seletivos degradam recall. Bom até ~1–10M vetores. <strong>Qdrant</strong>: vector DB dedicado, filterable HNSW, payload indexing, sparse vectors, quantização, multitenancy, cluster. Melhor para escala, filtros complexos, hybrid search. <strong>Regra</strong>: Postgres existente + dataset < 5M → pgvector. AI em escala com filtros complexos → Qdrant.',
    tip: 'Mencionar o custo operacional de manter outro servidor — demonstra senioridade ao considerar trade-offs.',
  },
  {
    level: 'Senior',
    q: 'O que é hybrid search e como o Qdrant suporta nativamente?',
    a: '<strong>Hybrid search</strong> combina dense vectors (embeddings semânticos) com sparse vectors (BM25/SPLADE — matching lexical). Dense falha com termos raros (SKUs, nomes, jargão técnico); sparse falha com paráfrase. Combinados via <strong>Reciprocal Rank Fusion (RRF)</strong>: score = Σ 1/(60 + rank_i) para cada ranker. Qdrant suporta com <strong>named vectors</strong> — cada vetor tem índice próprio (HNSW para dense, inverted index para sparse). Query especifica ambos + fusion: "rrf".',
    tip: 'Named vectors com fusion: "rrf" é a forma nativa de hybrid search no Qdrant — sem precisar de implementação manual.',
  },
  {
    level: 'Senior',
    q: 'O que é quantização vetorial e qual o impacto no Qdrant?',
    a: '<strong>Scalar (int8):</strong> 4x menos RAM, recall ~99%, 1.5–2x mais rápido. <strong>Binary:</strong> 32x menos RAM, recall ~90–95%. <strong>Rescoring pattern (recomendado):</strong> busca com vetor quantizado → top-K × oversampling candidatos → re-rank com float32 original → retorna top-K final. Mantém recall alto com muito menos RAM. Config: <code>quantization_config: { scalar: { type: "int8" } }</code> + <code>rescore: true</code> na query. Para produção: int8 + rescore é o ponto ideal.',
    tip: 'Rescoring é o que diferencia Qdrant — a maioria dos DBs não tem rescoring nativo, você precisa implementar manualmente.',
  },
  {
    level: 'Senior',
    q: 'Como implementar multitenancy eficientemente no Qdrant?',
    a: '<strong>Payload filtering (recomendado):</strong> campo tenant_id no payload + keyword payload index + filtro must em toda query. Filterable HNSW garante que o grafo traversa apenas pontos do tenant. Uma collection serve N tenants com recall exato. Criar índice: <code>PUT /collections/{name}/index</code> body <code>{ field_name: "tenant_id", field_schema: "keyword" }</code>. Sempre inclua o filtro na query — sem filtro, todos os tenants ficam expostos.',
    tip: 'Destacar que SEM o payload index o filtro vira brute-force O(N) — o índice é obrigatório para performance.',
  },
  {
    level: 'Pleno',
    q: 'O que são named vectors e quando usar?',
    a: '<strong>Named vectors:</strong> um Point pode ter múltiplos vetores nomeados com configs independentes. Exemplo: <code>title_embedding</code> (1536d, Cosine, OpenAI) e <code>body_embedding</code> (768d, Dot, E5). Cada named vector tem seu próprio índice HNSW. Casos de uso: (1) <strong>Multimodalidade</strong> — texto + imagem no mesmo ponto. (2) <strong>Hybrid search</strong> — dense e sparse como named vectors. (3) <strong>Migração de modelo</strong> — manter v1 e v2 durante transição gradual.',
    tip: 'Named vectors permitem migração de modelo sem downtime — adicionar o novo vector field e populá-lo gradualmente.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre ef_construct e ef na busca HNSW?',
    a: '<strong>ef_construct</strong>: parâmetro de BUILD — quantos candidatos são avaliados ao inserir cada ponto no grafo. Maior = grafo mais rico = recall maior. Tipicamente 100–200. Dobrar quase dobra o tempo de indexação. <strong>ef (search)</strong>: parâmetro de QUERY — tamanho da lista de candidatos durante o traversal. Maior = recall maior, latência maior. Ajustável por query via <code>params: { hnsw_ef: 200 }</code>. Calibre ef para seu SLO de latência P99.',
    tip: 'ef_construct afeta apenas a qualidade do grafo construído; ef na query afeta cada busca. Calibre os dois separadamente.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o filtro de payload? Quais operadores existem?',
    a: '<strong>Operadores:</strong> <code>must</code> (AND), <code>should</code> (OR com pelo menos 1 match), <code>must_not</code> (NOT). Condições: <code>match: { value }</code>, <code>range: { gte, lte, gt, lt }</code>, <code>geo_radius</code>, <code>is_null</code>, <code>is_empty</code>. Com payload index criado, filtro usa índice invertido antes do HNSW — O(log N) ou O(1) para keyword. Sem índice, brute-force O(N) em todos os candidatos. <strong>Criar índice obrigatório</strong> para campos usados em filtros frequentes.',
    tip: 'Criar payload index para todo campo usado em filtro frequente — sem índice é O(N) brute-force.',
  },
  {
    level: 'Senior',
    q: 'O que é Reciprocal Rank Fusion (RRF) e por que é usado em hybrid search?',
    a: '<strong>RRF</strong>: score(doc) = Σ 1/(k + rank_i) onde k=60 é constante. Vantagem: <strong>não precisa normalizar escalas</strong> — cosine similarity (0–1) e BM25 (0–∞) têm escalas incompatíveis. RRF usa apenas o ranking, não o score absoluto. Robusto a outliers. Alternativa: DBSF (Distribution-Based Score Fusion) normaliza usando mean e std dos scores. Qdrant: <code>fusion: "rrf"</code> ou <code>fusion: "dbsf"</code> na query. RRF é mais simples e geralmente suficiente.',
    tip: 'RRF evita normalização de escalas — use em vez de somar scores brutos de cosine + BM25.',
  },
  {
    level: 'Pleno',
    q: 'Como fazer upsert em batch de forma eficiente?',
    a: '<strong>upsert_points</strong> com batch de 100–512 pontos. REST: <code>PUT /collections/{name}/points</code>. Python: <code>client.upsert(collection_name, points=[PointStruct(id, vector, payload)])</code>. Qdrant processa batch atomicamente. Para datasets grandes (>1M): múltiplas threads paralelas, batch 256–512, monitorar memória durante build do HNSW (pico durante indexação). Diferença entre upsert (substitui tudo) e set-payload (só atualiza campos específicos do payload).',
    tip: 'Batch de 256–512 pontos por request. Paralelize com múltiplas threads para datasets grandes.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona scroll (paginação) no Qdrant?',
    a: '<strong>Cursor-based pagination</strong> — não offset numérico (que seria O(N)). API: <code>POST /points/scroll</code> com <code>{ limit: 100, filter: {...}, offset: null }</code>. Resposta inclui <code>next_page_offset</code> — use como <code>offset</code> na próxima chamada. Loop até <code>next_page_offset == null</code>. Uso: exportar todos os pontos de um tenant, re-indexar após troca de modelo, backfill de campos. Sem vector na resposta (<code>with_vector: false</code>) para economizar bandwidth.',
    tip: 'Scroll usa cursor, não offset numérico — evita O(N) skip. Loop até next_page_offset == null.',
  },
  {
    level: 'Senior',
    q: 'Como o Qdrant garante HA em cluster?',
    a: '<strong>Sharding + replicação:</strong> collection dividida em N shards, cada shard replicado R vezes. <code>shard_number: 6, replication_factor: 2</code> com 3 nós = cada nó tem 2 shards + 2 réplicas de outros shards. Perda de 1 nó não perde dados. <strong>Raft consensus</strong> para eleição de líder de shard. <strong>write_consistency_factor</strong>: quantas réplicas devem confirmar antes de retornar ao cliente (1 = performance, N = durabilidade máxima). Reads podem ir para qualquer réplica.',
    tip: 'shard_number × replication_factor = total de cópias de shard no cluster. Dimensione para tolerar N nós perdidos.',
  },
  {
    level: 'Pleno',
    q: 'O que são snapshots e como usar para backup?',
    a: '<strong>Snapshot</strong>: backup completo de uma collection — vetores, payloads e índices em arquivo comprimido. Criar: <code>POST /collections/{name}/snapshots</code>. Listar: <code>GET /collections/{name}/snapshots</code>. Restaurar: <code>PUT /collections/{name}/snapshots/recover</code>. Para produção self-hosted: automatize snapshots periódicos via cron/schedule, armazene em S3. Vector DB é estado crítico — sem snapshot, uma perda é irrecuperável. Qdrant Cloud tem snapshots automáticos.',
    tip: 'Mencionar que vector DB não tem replicação de WAL como Postgres — snapshot é o mecanismo de backup.',
  },
  {
    level: 'Senior',
    q: 'Como versionar embeddings ao trocar de modelo?',
    a: '<strong>Problema:</strong> novo modelo gera vetores incompatíveis com antigos. <strong>Estratégia 1 — Named vectors:</strong> adicionar campo novo (<code>v2_embedding</code>), re-processar pontos gradualmente, buscar em v2 quando disponível. <strong>Estratégia 2 — Nova collection:</strong> criar <code>docs_v2</code>, indexar todos os pontos com novo modelo, validar e redirecionar o cliente. Zero downtime com blue/green. <strong>Nunca misturar</strong> vetores de modelos diferentes no mesmo campo — recall cai sem erro explícito.',
    tip: 'Named vectors permitem migração gradual — mantenha v1 e v2 em paralelo até validar o novo modelo.',
  },
  {
    level: 'Senior',
    q: 'Qual o impacto do parâmetro m no HNSW?',
    a: '<code>m</code> = número de conexões bidirecionais por nó (camadas superiores usam m, camada 0 usa m*2). <strong>m baixo (4–8):</strong> menos RAM, build mais rápido, recall menor. <strong>m médio (16):</strong> bom equilíbrio — padrão Qdrant. <strong>m alto (32–64):</strong> recall maior, RAM e build time proporcional ao m. Para produção: m=16 para maioria dos casos. Só aumente se benchmark com seu dataset mostrar melhora real de recall que justifique o custo de RAM. Quantização int8 + m=16 geralmente bate m=32 + float32 em custo-benefício.',
    tip: 'Padrão m=16 serve para quase todos os casos. Antes de aumentar, tente quantização int8 — melhor custo-benefício.',
  },
  {
    level: 'Pleno',
    q: 'Quais métricas de distância o Qdrant suporta e quando usar cada uma?',
    a: '<strong>Cosine:</strong> mede ângulo, invariante à magnitude. Use para text embeddings não normalizados (OpenAI ada-002, Cohere). <strong>Dot product:</strong> produto escalar — matematicamente igual ao Cosine para vetores L2-normalizados, mais rápido. Use quando o modelo normaliza os vetores (E5, GTE com normalize=True). <strong>Euclid (L2):</strong> distância euclidiana. Use para image embeddings ou quando magnitude tem significado semântico. <strong>Manhattan:</strong> raro, para dados esparsos específicos.',
    tip: 'Use Dot para vetores já normalizados (E5, GTE) — é matematicamente igual ao Cosine mas mais rápido.',
  },
  {
    level: 'Pleno',
    q: 'Como monitorar a saúde de uma collection Qdrant?',
    a: '<strong>GET /collections/{name}</strong>: status (green/yellow/red), vectors_count, indexed_vectors_count. yellow = indexação em andamento, red = problema crítico. <strong>GET /metrics</strong>: Prometheus metrics — latência de busca P50/P99, taxa de indexação, uso de memória. <strong>GET /cluster</strong>: estado do cluster, peers, consensus. Alertar quando: status != green, latência P99 > SLO, memória > 80% do limite. Integrar com Prometheus + Grafana.',
    tip: 'Status yellow é normal durante indexação — apenas red requer ação imediata. Monitore indexed_vectors_count.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre upsert e update de payload?',
    a: '<strong>upsert_points:</strong> substitui o ponto inteiro (vector + payload). Se ID existe, sobrescreve TUDO — campos de payload não especificados são apagados. <strong>set_payload (POST /points/payload):</strong> atualiza apenas os campos especificados, mantém os demais. Ideal para updates parciais (ex: só atualizar "status"). <strong>overwrite_payload:</strong> substitui TODO o payload (mantém o vetor). <strong>delete_payload_field:</strong> remove campo específico do payload. Use filtros para selecionar quais pontos atualizar.',
    tip: 'set_payload para updates parciais; upsert para substituição total. Não use upsert se só precisa atualizar um campo.',
  },
  {
    level: 'Senior',
    q: 'O que é HNSW e por que Qdrant o escolheu em vez de IVF?',
    a: '<strong>IVF (Inverted File Index):</strong> divide espaço em clusters (Voronoi via k-means), busca apenas clusters mais próximos da query. Requer treinamento offline com dataset completo, difícil de atualizar incrementalmente. Filtros degradam performance (candidatos em clusters diferentes). <strong>HNSW:</strong> grafo hierárquico, online (sem treinamento), suporta updates em tempo real, excelente recall. Qdrant escolheu HNSW porque: (1) indexação incremental sem batch de treinamento, (2) Filterable HNSW é viável com grafos mas não com clusters IVF.',
    tip: 'HNSW permite indexação incremental — sem retraining ao adicionar novos pontos, ao contrário do IVF.',
  },
  {
    level: 'Pleno',
    q: 'Como configurar uma collection Qdrant para produção do zero?',
    a: 'Sequência: (1) <code>PUT /collections/{name}</code> com vectors (size, distance), hnsw_config (m: 16, ef_construct: 100), quantization_config (scalar int8). (2) Criar payload indexes para campos usados em filtros: <code>PUT /collections/{name}/index</code>. (3) Upsert pontos em batches de 256–512. (4) Verificar status: <code>GET /collections/{name}</code> → status: green. (5) Testar recall com ground truth antes de ir a produção. (6) Configurar snapshot periódico.',
    tip: 'Verificar status green antes de abrir tráfego — yellow significa indexação em andamento, latência de busca será alta.',
  },
  {
    level: 'Senior',
    q: 'Como calcular recall no Qdrant e diagnosticar problemas?',
    a: '<strong>Recall@K</strong> = porcentagem dos K vizinhos reais (brute-force) que aparecem no resultado HNSW. Para medir: (1) Calcular ground truth com <code>exact: true</code> na query (brute-force). (2) Comparar com resultado HNSW normal. (3) Recall < 95% = investigar. Causas comuns: ef muito baixo (aumentar hnsw_ef na query), quantização agressiva sem rescoring (ativar rescore: true), m muito baixo para o tamanho do dataset. Monitorar recall em produção amostrando periodicamente com exact=true.',
    tip: 'Meça recall com exact: true como ground truth. Recall < 95% — primeiro aumente hnsw_ef na query, depois revise m.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'PUT /collections/{name}', sig: 'PUT /collections/{name} body: { vectors: { size, distance }, hnsw_config, quantization_config }', desc: 'Criar collection. distance: Cosine | Dot | Euclid. hnsw_config: { m: 16, ef_construct: 100 }.' },
  { name: 'PUT /points (upsert)', sig: 'PUT /collections/{name}/points body: { points: [{ id, vector, payload }] }', desc: 'Upsert atômico em batch. Use batch de 256–512 para performance.' },
  { name: 'POST /points/search', sig: 'POST /collections/{name}/points/search body: { vector, filter, limit, params: { hnsw_ef } }', desc: 'Busca vetorial. Inclua filter com must/should/must_not. hnsw_ef: 128 para recall melhor.' },
  { name: 'POST /points/scroll', sig: 'POST /collections/{name}/points/scroll body: { limit, offset, filter, with_payload, with_vector }', desc: 'Paginação cursor-based. Retorna next_page_offset. Loop até null.' },
  { name: 'PUT /collections/{name}/index', sig: 'PUT /collections/{name}/index body: { field_name, field_schema: "keyword" | "integer" | "float" | "geo" }', desc: 'Criar payload index para filtros eficientes. Obrigatório para campos usados em must/should.' },
  { name: 'POST /collections/{name}/snapshots', sig: 'POST /collections/{name}/snapshots', desc: 'Criar snapshot (backup). Retorna nome do arquivo. Restaurar via PUT /snapshots/recover.' },
  { name: 'query (hybrid — SDK)', sig: 'client.query_points(collection, prefetch=[dense, sparse], query=Fusion.RRF, limit=10)', desc: 'Hybrid search com RRF. prefetch especifica dense + sparse named vectors.' },
  { name: 'GET /collections/{name}', sig: 'GET /collections/{name}', desc: 'Status: green (ok), yellow (indexando), red (erro). vectors_count, indexed_vectors_count.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Filtrar campo sem payload index — brute-force O(N) em todos os pontos' },
  { ok: false, t: 'Misturar vetores de modelos diferentes no mesmo named vector — recall cai silenciosamente' },
  { ok: false, t: 'Binary quantization sem rescore: true — recall pode cair para 90%' },
  { ok: false, t: 'm > 32 sem calibrar recall no seu dataset — RAM explode sem benefício real' },
  { ok: false, t: 'Collection sem snapshot — vector DB é estado crítico, perda é irrecuperável' },
  { ok: true,  t: 'int8 quantization + rescore: true — 4x menos RAM, recall ~99%' },
  { ok: true,  t: 'tenant_id como keyword payload index — multitenancy eficiente em uma collection' },
  { ok: true,  t: 'Named vectors para migração de modelo sem downtime' },
  { ok: true,  t: 'hnsw_ef: 128 na query para calibrar recall por SLO de latência' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'HNSW-F: por que Filterable HNSW é melhor',
    trick: 'PRE quebra, PÓS falta, FIL passa',
    expansion: [
      ['PRE — Pre-filter', 'Filtra antes de entrar no grafo — quebra os caminhos, recall despenca'],
      ['PÓS — Post-filter', 'Busca k vizinhos e filtra depois — pode retornar menos que k resultados'],
      ['FIL — Filterable', 'Grafo consciente do filtro — traversa apenas nós válidos, recall e contagem corretos'],
    ],
    explanation: 'Os três problemas de busca vetorial com filtro, e por que Filterable HNSW é a solução correta.',
    example: 'Query com tenant_id=acme: PRE→grafo partido→recall ruim. PÓS→filtra depois→menos que k. FIL→traversal guiado→exatamente k resultados.',
    why: 'Entrevista sempre pergunta por que Qdrant é melhor que "só filtrar depois". Esse mnemônico explica os dois anti-padrões antes da solução.',
  },
  {
    label: 'DQMTS: configuração de collection para produção',
    trick: 'Dá Qualidade Mesmo Tendo Scale',
    expansion: [
      ['D — Distance metric', 'Cosine para embeddings não normalizados, Dot para normalizados (E5), Euclid para imagens'],
      ['Q — Quantização', 'int8 para produção geral: 4x menos RAM, recall ~99%, ative rescore=true'],
      ['M — m do HNSW', 'm=16 para a maioria dos casos, m=32 apenas com recall comprovadamente melhor'],
      ['T — ef e ef_construct', 'ef_construct=100 para stream, 200 para one-shot. ef na query: calibre para SLO P99'],
      ['S — Snapshot', 'Configure snapshot periódico — vector DB é estado crítico, backup obrigatório'],
    ],
    explanation: 'Os 5 parâmetros que importam ao criar uma collection Qdrant para produção.',
    example: 'PUT /collections/docs com: distance:Cosine, scalar int8, m:16, ef_construct:100, depois criar payload indexes.',
    why: 'Configuração errada no início = reindexação cara em produção. Memorizar os 5 parâmetros evita erros.',
  },
  {
    label: 'RRF: Reciprocal Rank Fusion',
    trick: '1 sobre (60 mais rank) — soma dos rankers',
    expansion: [
      ['1 — Numerador', 'Score de cada documento em cada ranker é 1/(k + rank)'],
      ['60 — k constante', 'k=60 suaviza diferenças entre posições próximas (rank 1 vs rank 5)'],
      ['rank — Posição', 'Rank 1 = 1/61 ≈ 0.016. Rank 10 = 1/70 ≈ 0.014. Diferença pequena e suave'],
      ['Soma — Fusão', 'Score final = soma dos RRF scores de todos os rankers (dense + sparse)'],
    ],
    explanation: 'RRF combina rankings de fontes heterogêneas sem normalizar as escalas de score.',
    example: 'Doc A: rank 1 em dense (1/61) + rank 3 em sparse (1/63) = 0.032. Não precisa normalizar cosine similarity vs BM25.',
    why: 'A maioria esquece que RRF usa apenas ranks, não scores absolutos — isso é o que torna robusto a escalas diferentes.',
  },
]

// ── Dados: Anti-patterns ──────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Filtrar sem payload index',
    badDesc: 'Buscar com filtro em campo sem payload index — brute-force O(N)',
    badCode: [
      { t: '# CRIANDO a collection sem índice de payload\n' },
      { t: 'client.search(\n' },
      { t: '    collection_name="docs",\n' },
      { t: '    query_vector=emb,\n' },
      { t: '    query_filter=Filter(must=[\n' },
      { t: '        FieldCondition(key=' },
      { t: '"tenant_id"', c: '#ef4444' },
      { t: ', match=MatchValue(value="acme"))\n' },
      { t: '    ]),\n' },
      { t: ')  # Sem payload index → O(N) scan em todos os pontos' },
    ],
    goodDesc: 'Criar payload index antes de usar o campo em filtros',
    goodCode: [
      { t: '# ANTES de inserir dados: criar payload index\n' },
      { t: 'client.create_payload_index(\n' },
      { t: '    collection_name=' },
      { t: '"docs"', c: '#4ade80' },
      { t: ',\n' },
      { t: '    field_name=' },
      { t: '"tenant_id"', c: '#4ade80' },
      { t: ',\n' },
      { t: '    field_schema=PayloadSchemaType.KEYWORD,\n' },
      { t: ')  # Agora filtros em tenant_id usam índice invertido\n' },
      { t: '# Criar índice para TODOS os campos usados em filtros' },
    ],
    why: 'Sem payload index, filtro é brute-force O(N) em todos os pontos. Com 10M vetores, é lento demais para produção.',
  },
  {
    title: 'Quantização binária sem rescoring',
    badDesc: 'Usar binary quantization sem rescore — recall pode cair para 90%',
    badCode: [
      { t: '# Configuração com binary quantization\n' },
      { t: 'client.recreate_collection(\n' },
      { t: '    collection_name="docs",\n' },
      { t: '    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),\n' },
      { t: '    quantization_config=BinaryQuantization(...),\n' },
      { t: ')\n\n' },
      { t: 'results = client.search(\n' },
      { t: '    query_vector=emb, limit=10\n' },
      { t: '    # SEM rescore=True → recall ~90-95%\n' },
      { t: ')' },
    ],
    goodDesc: 'Ativar rescore=True para re-rank com float32 original',
    goodCode: [
      { t: '# Binary OK mas com rescoring obrigatório\n' },
      { t: 'results = client.search(\n' },
      { t: '    query_vector=emb,\n' },
      { t: '    limit=10,\n' },
      { t: '    search_params=SearchParams(\n' },
      { t: '        quantization=QuantizationSearchParams(\n' },
      { t: '            rescore=' },
      { t: 'True', c: '#4ade80' },
      { t: ',  # Re-rank com float32 original\n' },
      { t: '            oversampling=' },
      { t: '2.0', c: '#4ade80' },
      { t: ',  # Busca 20 candidatos, re-rank para 10\n' },
      { t: '        )\n' },
      { t: '    )\n' },
      { t: ')  # Recall ~99% com 32x menos RAM' },
    ],
    why: 'Binary quantization sem rescoring perde 5–10% de recall. O pattern oversampling+rescore resolve isso com custo mínimo.',
  },
  {
    title: 'Misturar vetores de modelos diferentes',
    badDesc: 'Indexar com modelo A e buscar com modelo B no mesmo campo',
    badCode: [
      { t: '# Indexou com model="text-embedding-ada-002"\n' },
      { t: 'client.upsert(collection_name="docs", points=[\n' },
      { t: '    PointStruct(id=1, vector=' },
      { t: 'ada_002_embedding', c: '#ef4444' },
      { t: ', payload={...})\n' },
      { t: '])\n\n' },
      { t: '# Depois troca de modelo mas busca sem reindexar\n' },
      { t: 'results = client.search(\n' },
      { t: '    query_vector=' },
      { t: 'e5_embedding', c: '#ef4444' },
      { t: ',  # Modelo diferente!\n' },
      { t: ')  # Recall ~30-50% — resultados parecem ok mas são lixo' },
    ],
    goodDesc: 'Usar named vectors para migração gradual de modelo',
    goodCode: [
      { t: '# Adicionar novo named vector para o modelo novo\n' },
      { t: 'client.update_collection(\n' },
      { t: '    "docs",\n' },
      { t: '    vectors_config={\n' },
      { t: '        ' },
      { t: '"v1_ada"', c: '#4ade80' },
      { t: ': VectorParams(size=1536, distance=Distance.COSINE),\n' },
      { t: '        ' },
      { t: '"v2_e5"', c: '#4ade80' },
      { t: ': VectorParams(size=768, distance=Distance.DOT),\n' },
      { t: '    }\n' },
      { t: ')\n' },
      { t: '# Populace v2_e5 gradualmente, busque em v2_e5 quando disponível' },
    ],
    why: 'Vetores de modelos diferentes são incompatíveis — cosine similarity entre eles é aleatória. O erro é silencioso: retorna resultados mas com recall ~30%.',
  },
  {
    title: 'Sem snapshot em produção',
    badDesc: 'Rodar Qdrant sem backup — perda de dados é irrecuperável',
    badCode: [
      { t: '# Qdrant em produção sem nenhum backup configurado\n' },
      { t: '# docker run qdrant/qdrant\n' },
      { t: '# ... meses de dados indexados ...\n' },
      { t: '# Falha de disco / volume deletado por acidente\n' },
      { t: '# → TODOS os vetores e payloads perdidos\n' },
      { t: '# → Reprocessar embeddings = horas/dias de compute' },
    ],
    goodDesc: 'Automatizar snapshots periódicos em armazenamento externo',
    goodCode: [
      { t: '# Script de backup (cron diário)\n' },
      { t: 'import httpx, boto3\n\n' },
      { t: 'async def backup_collection(collection: str):\n' },
      { t: '    async with httpx.AsyncClient() as http:\n' },
      { t: '        # 1. Criar snapshot\n' },
      { t: '        r = await http.post(\n' },
      { t: '            f"http://qdrant:6333/collections/{collection}/snapshots"\n' },
      { t: '        )\n' },
      { t: '        name = r.json()["result"]["name"]\n' },
      { t: '        # 2. Download + upload para S3\n' },
      { t: '        # 3. Deletar snapshots antigos (retenção)\n' },
      { t: '        print(f"Backup {name} → s3://bucket/qdrant/{name}")' },
    ],
    why: 'Vector DB não tem WAL replicado como Postgres. Snapshot é o único mecanismo de backup. Sem ele, uma perda é total e cara de recuperar.',
  },
  {
    title: 'Upsert substituindo payload sem querer',
    badDesc: 'Usar upsert para atualizar um campo — apaga os outros sem aviso',
    badCode: [
      { t: '# Quero só atualizar o campo "status"\n' },
      { t: 'client.upsert(\n' },
      { t: '    collection_name="docs",\n' },
      { t: '    points=[PointStruct(\n' },
      { t: '        id=42,\n' },
      { t: '        vector=' },
      { t: 'original_vector', c: '#ef4444' },
      { t: ',\n' },
      { t: '        payload={' },
      { t: '"status": "published"', c: '#ef4444' },
      { t: '}  # Apaga title, tenant_id, score!\n' },
      { t: '    )]\n' },
      { t: ')' },
    ],
    goodDesc: 'Usar set_payload para update parcial de campos',
    goodCode: [
      { t: '# Atualizar apenas o campo "status" sem tocar nos outros\n' },
      { t: 'client.set_payload(\n' },
      { t: '    collection_name=' },
      { t: '"docs"', c: '#4ade80' },
      { t: ',\n' },
      { t: '    payload={' },
      { t: '"status": "published"', c: '#4ade80' },
      { t: '},\n' },
      { t: '    points=' },
      { t: '[42]', c: '#4ade80' },
      { t: ',  # IDs específicos ou Filter\n' },
      { t: ')  # Só "status" é atualizado, outros campos preservados' },
    ],
    why: 'upsert substitui tudo — vector + payload completo. Para updates parciais, use set_payload. Errar isso apaga dados em silêncio.',
  },
]

// ── Dados: Quick Reference ────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Collections',
        entries: [
          { key: 'PUT /collections/{name}', value: 'Criar collection' },
          { key: 'DELETE /collections/{name}', value: 'Deletar collection' },
          { key: 'GET /collections/{name}', value: 'Status + info' },
          { key: 'PUT /collections/{name}/index', value: 'Criar payload index' },
          { key: 'POST /collections/{name}/snapshots', value: 'Criar snapshot' },
          { key: 'GET /collections', value: 'Listar todas as collections' },
        ],
      },
      {
        title: 'HNSW Parâmetros',
        entries: [
          { key: 'm: 16', value: 'Conexões por nó (padrão)', badge: 'default', badgeColor: '#38bdf8' },
          { key: 'ef_construct: 100', value: 'Qualidade de build', badge: 'build', badgeColor: '#a78bfa' },
          { key: 'ef: 128', value: 'Candidatos por query', badge: 'query', badgeColor: '#4ade80' },
          { key: 'on_disk: true', value: 'Para collections > 10M vetores' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Points',
        entries: [
          { key: 'PUT /points', value: 'Upsert em batch' },
          { key: 'POST /points/search', value: 'Busca vetorial' },
          { key: 'POST /points/scroll', value: 'Paginação cursor-based' },
          { key: 'POST /points/payload', value: 'Update parcial de payload' },
          { key: 'POST /points/delete', value: 'Deletar por IDs ou filtro' },
          { key: 'GET /points/{id}', value: 'Buscar ponto por ID' },
        ],
      },
      {
        title: 'Quantização',
        entries: [
          { key: 'int8 (Scalar)', value: '4x menos RAM, recall ~99%', badge: 'recomendado', badgeColor: '#4ade80' },
          { key: 'binary', value: '32x menos RAM, recall ~90-95%', badge: 'com rescore', badgeColor: '#f59e0b' },
          { key: 'rescore: true', value: 'Re-rank com float32 original' },
          { key: 'oversampling: 2.0', value: 'Busca 2K candidatos para K final' },
        ],
      },
    ],
  },
]

// ── PDF Builders ──────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () =>
    buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'Qdrant',
      stackLabel: 'Database / Vector Search',
    }),
  cheatsheet: () =>
    buildCheatsheetPdf({
      skillName: 'Qdrant',
      accentColor: C,
      stackLabel: 'Database / Vector Search',
      sections: {
        hooks: CHEATSHEET_HOOKS,
        depRows: [],
        rules: CHEATSHEET_RULES,
        performanceTips: [
          'int8 quantization + rescore=True: 4x menos RAM, recall ~99%',
          'Payload index obrigatório para campos usados em filtros',
          'hnsw_ef: 128 para recall melhor (default é baixo)',
          'Batch upsert de 256–512 pontos para indexação eficiente',
          'Snapshot periódico para backup — vector DB é estado crítico',
        ],
        patterns: [],
        mentalModels: [
          'Filterable HNSW: grafo traversado apenas em nós que passam no filtro',
          'RRF: score = Σ 1/(60 + rank_i) — funciona com escalas incompatíveis',
          'Quantização + rescoring: candidate com vetor comprimido, re-rank com float32',
        ],
      },
    }),
  mnemonics: () =>
    buildMnemonicsPdf({
      mnemonics: MNEMONICS,
      accentColor: C,
      skillName: 'Qdrant',
      stackLabel: 'Database / Vector Search',
    }),
  antipatterns: () =>
    buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'Qdrant',
      stackLabel: 'Database / Vector Search',
    }),
  'quick-ref': () =>
    buildQuickRefPdf({
      columns: QUICK_REF_COLUMNS,
      skillName: 'Qdrant',
      accentColor: C,
      stackLabel: 'Database / Vector Search',
      tagline: 'Vector DB escrito em Rust — HNSW filterable, hybrid search, quantização',
    }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function QdrantPdfs() {
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
