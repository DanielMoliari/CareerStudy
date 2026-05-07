import type { SkillContent } from '@/types'

const hnswIvf: SkillContent = {
  tagline: 'Algoritmos ANN — HNSW e IVF: a base de todo vector DB rápido.',
  why: 'Pgvector, Qdrant, Pinecone, Weaviate todos usam HNSW por padrão. Saber explicar trade-off recall/latência/RAM e quando IVF-PQ vence é diferencial real em entrevista AI sênior.',
  summary: 'HNSW (Hierarchical Navigable Small World) e IVF (Inverted File Index) são os dois algoritmos ANN mais usados em vector DBs. HNSW é grafo multi-camada — melhor recall/latência, pesado em RAM. IVF particiona em clusters via k-means — menor RAM, ideal para bilhões de vetores com IVF-PQ. Saber tunar M, ef_construction, ef_search, nlist, nprobe é habilidade prática de production engineering.',
  keypoints: [
    { title: 'O problema ANN', body: 'Approximate Nearest Neighbor: encontrar os K vetores mais próximos de uma query em um espaço de alta dimensão (~768-3072d). Busca exata (brute force) é O(N×D) — inviável em milhões de pontos. ANN troca precisão por velocidade. Recall@K mede a qualidade do trade-off.' },
    { title: 'HNSW — estrutura', body: 'Grafo hierárquico de navegação. Camada 0 contém TODOS os pontos e suas conexões. Camadas superiores contêm subsets cada vez menores. Busca começa no topo (poucos pontos, atalhos longos) e desce até a camada 0 (refinamento local).' },
    { title: 'HNSW — parâmetros de build', body: 'M = max conexões por nó (16-64 típico; padrão pgvector: 16, Qdrant: 16). efConstruction = tamanho da fila durante build (200+ para boa qualidade). Maiores valores = melhor recall, mais memória, build mais lento. São parâmetros de indexação — não mudam após build.' },
    { title: 'HNSW — parâmetro de busca', body: 'ef_search (ou ef) = tamanho da fila de candidatos durante busca. Maior = mais recall, mais latência. Padrão: 64-200. Tunar até bater SLA de latência e recall desejado. Único parâmetro alterável em runtime sem rebuildar o índice.' },
    { title: 'IVF — estrutura', body: 'Inverted File Index: k-means clusteriza dataset em nlist clusters. Cada vetor pertence ao cluster mais próximo. Busca compara query com todos os centroids (nlist comparações), pega nprobe clusters mais próximos, e faz busca exata dentro deles.' },
    { title: 'IVF — parâmetros', body: 'nlist = número de clusters (tipicamente sqrt(N) a 4×sqrt(N)). nprobe = clusters inspecionados na busca (tradeoff recall/latência). nlist baixo → clusters grandes, busca lenta. nprobe alto → mais recall, mais lento.' },
    { title: 'IVF-PQ — compressão', body: 'Product Quantization comprime vetores de 768d float32 (~3KB) em códigos de bytes (~48 bytes = 64x compressão). Divide vetor em subvetores, quantiza cada um com k-means local. Reduz RAM em 8-32x com perda de recall gerenciável (0.85-0.95 típico).' },
    { title: 'HNSW vs IVF — quando usar', body: 'HNSW: datasets < 50M pontos, RAM disponível, recall > 0.95 necessário, latência ultra baixa. IVF-PQ: datasets > 100M pontos, RAM limitada, recall 0.85-0.92 aceitável, custo de infraestrutura crítico.' },
    { title: 'Recall@K — a métrica central', body: 'Recall@K = (verdadeiros vizinhos retornados no top-K) / K. Medido contra ground truth (brute force em amostra de queries). Recall@10 = 0.95 significa: dos 10 mais próximos reais, você achou 9.5 em média. SLA típico: 0.90-0.99.' },
    { title: 'Busca filtrada', body: 'WHERE category = "tech" AND vector ANN = query é difícil. Pre-filter: aplica filtro antes do ANN → dataset menor → grafo HNSW perde conectividade. Post-filter: ANN primeiro → filtra depois → pode retornar menos que K. Hybrid (Qdrant, Weaviate): índice consciente do filtro.' },
  ],
  gotchas: [
    'Aumentar M sem aumentar efConstruction: grafo fica desbalanceado, recall não melhora.',
    'efSearch alto demais mata throughput sem ganho proporcional de recall — há um platô.',
    'IVF com nlist muito baixo (ex: 10 para 1M pontos) faz clusters gigantes — perde toda vantagem.',
    'Esquecer de normalizar vetores antes de cosine similarity — distância errada, recall horroroso.',
    'Filtros muito seletivos (< 1% dos dados) destroem performance ANN — considere índice estruturado complementar.',
    'HNSW não suporta delete eficiente — o nó é "apagado" mas permanece no grafo. Recriar índice periodicamente.',
    'Comparar recall sem ground truth (brute force em sample) é impossível — número sem referência não tem sentido.',
    'Usar embedding de um modelo para indexar e outro para query — recall cai para zero (espaços incompatíveis).',
    'HNSW todo em RAM: 1M vetores de 768d float32 = ~3GB. Planejar infra antes de indexar dataset grande.',
  ],
  interview: [
    {
      level: 'senior',
      q: 'Explique a diferença entre HNSW e IVF. Quando você escolheria cada um?',
      a: '<p><strong>HNSW (Hierarchical Navigable Small World):</strong></p><ul><li>Estrutura: grafo multi-camada. Busca desce hierarquicamente do topo até a camada 0.</li><li>Recall: geralmente 0.95+ com parâmetros razoáveis.</li><li>Latência: sub-milissegundo para datasets de 1M pontos.</li><li>RAM: HNSW inteiro em RAM. 1M × 768d float32 ≈ 3GB + overhead do grafo.</li><li><strong>Melhor para:</strong> datasets &lt; 50M, RAM disponível, SLA de qualidade alto.</li></ul><p><strong>IVF (Inverted File Index):</strong></p><ul><li>Estrutura: k-means clusteriza em nlist clusters. Busca compara com centroids, inspeciona nprobe clusters.</li><li>Recall: 0.85-0.92 típico com IVF-PQ.</li><li>RAM: apenas centroids e índice IVF em RAM. Vetores comprimidos com PQ.</li><li><strong>Melhor para:</strong> datasets &gt; 100M, RAM limitada, recall menor aceitável.</li></ul>',
      tip: 'Cite os números concretos (recall, RAM por 1M vetores). Entrevistadores validam se você já operou em produção ou só leu documentação.',
    },
    {
      level: 'senior',
      q: 'Como você tunaria um índice HNSW para um SLA de p99 < 50ms e recall@10 > 0.95?',
      a: '<p>Pipeline de tuning:</p><ol><li><strong>Gerar ground truth:</strong> brute force em amostra de 1000 queries de produção. Salvar os 10 vizinhos reais de cada.</li><li><strong>Build inicial:</strong> M=32, efConstruction=200 (defaults razoáveis). Medir recall inicial.</li><li><strong>Tunar efSearch:</strong> começar em 64, aumentar incrementalmente (100, 200, 400). Medir recall e latência p99 em cada passo. Plotar curva recall×latência.</li><li><strong>Se p99 estourar antes de atingir recall 0.95:</strong> aumentar M (mais conexões = recall maior por efSearch menor). Custo: mais RAM.</li><li><strong>Validar em carga:</strong> benchmark com concorrência real — latência sob carga difere de benchmark serial.</li></ol><p>Ferramentas: ann-benchmarks.com para comparar, Qdrant/pgvector têm endpoints de benchmark embutidos.</p>',
      tip: 'Mencione a curva recall×latência como o artefato visual da análise — é o que equipes de ML engineering usam para tomar decisão.',
    },
    {
      level: 'pleno',
      q: 'O que é Recall@K e por que ele importa em ANN?',
      a: '<p>Recall@K = (vizinhos verdadeiros retornados no top-K) / K.</p><p>Exemplo: Recall@10 = 0.90 → dos 10 mais próximos reais, você retorna 9 em média.</p><p><strong>Por que importa:</strong></p><ul><li>ANN é por definição aproximado — você nunca retorna os exatos K mais próximos.</li><li>O trade-off recall vs latência/RAM é a decisão central de qualquer sistema de busca por similaridade.</li><li>Em RAG: recall baixo significa que o LLM não recebe o contexto correto → hallucination.</li><li>Em recomendação: recall baixo significa que você perde itens relevantes → pior experiência.</li></ul><p>Medição: necessita de ground truth (brute force em sample). Sem ground truth, o número não tem significado.</p>',
      tip: 'Sempre conecte recall ao impacto no sistema final (RAG = hallucination, recomendação = relevância). Candidatos que só definem sem conectar ao negócio demonstram visão limitada.',
    },
    {
      level: 'pleno',
      q: 'O que é IVF-PQ e quando é a escolha certa?',
      a: '<p><strong>IVF-PQ = Inverted File Index + Product Quantization.</strong></p><p>Product Quantization comprime vetores:</p><ul><li>Divide o vetor de 768d em M subvetores (ex: 8 subvetores de 96d cada).</li><li>Cada subvetor é quantizado para um de 256 centroids (1 byte).</li><li>Resultado: vetor de 8 bytes vs 768×4=3072 bytes. Compressão de 384x.</li><li>Com 8 bytes de código, comparação de distância usa lookup table — muito mais rápido.</li></ul><p><strong>Quando usar:</strong></p><ul><li>Datasets &gt; 100M vetores onde manter HNSW em RAM é inviável (100M × 3KB = 300GB).</li><li>RAM limitada (edge, instâncias menores).</li><li>Recall 0.85-0.92 aceitável para o caso de uso.</li></ul>',
      tip: 'Dar os números concretos de compressão (384x, 8 bytes vs 3KB) e o impact de RAM (300GB para 100M) demonstra que você entendeu o problema real que PQ resolve.',
    },
    {
      level: 'senior',
      q: 'Como implementa busca filtrada eficiente com HNSW?',
      a: '<p>Três estratégias, cada uma com trade-offs:</p><ol><li><strong>Post-filter (mais simples):</strong> faz ANN completo com K grande (ex: 100), depois filtra pelos critérios. Funciona se filtro retém &gt; 10% dos dados. Problema: pode retornar menos que K após o filtro.</li><li><strong>Pre-filter (problemático em geral):</strong> constrói subíndice só com os pontos que passam no filtro. Eficiente se filtro é estático, mas HNSW do subconjunto perde conectividade se muito pequeno.</li><li><strong>Hybrid index (Qdrant, Weaviate):</strong> índice estruturado consciente do filtro. Qdrant mantém payload index separado do HNSW, combina eficientemente. É a solução correta para filtros dinâmicos variados.</li></ol><p>Regra prática: filtro retém &gt; 10% → post-filter. Filtro muito seletivo (&lt; 1%) → considere BTree no Postgres + vetor separado para os poucos resultados.</p>',
      tip: 'Mencionar o limiar de 10% e o fallback para BTree são detalhes que só aparecem com experiência real. Candidatos que só descrevem as estratégias sem os limites demonstram teoria sem prática.',
    },
    {
      level: 'pleno',
      q: 'Por que você não deve misturar modelos de embedding entre indexação e busca?',
      a: '<p>Modelos de embedding criam espaços vetoriais próprios e incompatíveis.</p><p>Exemplo:</p><ul><li>text-embedding-3-small e text-embedding-3-large têm 1536d vs 3072d — dimensões diferentes, impossível comparar.</li><li>Mesmo com mesma dimensão, diferentes modelos mapeiam conceitos para regiões completamente diferentes do espaço.</li><li>"gato" em text-embedding-3-small e "gato" em bge-m3 produzem vetores sem correlação de distância entre si.</li></ul><p>Resultado: recall cai para zero ou pior — você retorna vizinhos aleatórios. O sistema funciona (sem erro) mas com qualidade zero, o que é mais perigoso que falhar explicitamente.</p><p>Regra: escolha o modelo de embedding, fixe-o, versione-o. Qualquer mudança de modelo exige rebuildar TODO o índice.</p>',
      tip: 'A observação de que "funciona mas com qualidade zero" é o insight mais valioso — é um bug silencioso que só aparece ao medir recall. Mencionar isso demonstra experiência com problemas reais de produção.',
    },
    {
      level: 'senior',
      q: 'Quanto de RAM consome um índice HNSW com 10M vetores de 768 dimensões?',
      a: '<p><strong>Cálculo passo a passo:</strong></p><ul><li>Vetores brutos: 10M × 768 × 4 bytes (float32) = <strong>30.7 GB</strong></li><li>Grafo HNSW (M=16): cada nó tem em média M×2=32 arestas × 4 bytes = 128 bytes por nó. 10M nós = <strong>1.28 GB</strong></li><li>Overhead de estrutura (~20%): <strong>~6 GB</strong></li><li><strong>Total estimado: ~38 GB</strong></li></ul><p>Com HNSW em pgvector/Qdrant, TUDO fica em RAM. Em r6g.2xlarge da AWS (64GB RAM), 10M vetores de 768d cabe com folga. Com 1536d (OpenAI text-embedding-3-small), dobra tudo.</p><p>IVF-PQ (m=8): 10M × 8 bytes = 80MB de vetores comprimidos + overhead. Dramaticamente menor.</p>',
      tip: 'Dar o número concreto (38 GB para 10M × 768d) e a instância AWS que comporta demonstra que você pensa em custo de infraestrutura, não só em algoritmos.',
    },
    {
      level: 'pleno',
      q: 'O que é cosine similarity e quando usar em vez de L2?',
      a: '<p><strong>Cosine similarity:</strong> mede o ângulo entre dois vetores — ignora magnitude, considera apenas direção.</p><p>Fórmula: cos(A, B) = (A·B) / (||A|| × ||B||). Resultado entre -1 e 1; 1 = idênticos, 0 = ortogonais.</p><p><strong>L2 (distância euclidiana):</strong> distância absoluta no espaço. Sensível à magnitude dos vetores.</p><p><strong>Quando usar cosine:</strong></p><ul><li>Embeddings de texto (TF-IDF, modelos de linguagem) — magnitude varia por comprimento de texto mas direção representa semântica.</li><li>Normalizar para L2=1 primeiro torna cosine e L2 equivalentes (L2 de vetores normalizados = 2 - 2×cosine). A maioria dos modelos modernos já normaliza.</li></ul><p><strong>Quando usar L2:</strong> imagens, áudio, sinais onde magnitude tem significado semântico.</p>',
      tip: 'A equivalência matemática entre cosine e L2 em vetores normalizados é o detalhe que diferencia quem sabe geometria de quem memorizou regras. Mencionar que modelos modernos já normalizam é pragmatismo.',
    },
    {
      level: 'senior',
      q: 'Como monitora a qualidade de um índice ANN em produção?',
      a: '<p>Estratégia de monitoramento:</p><ol><li><strong>Recall periódico:</strong> semanalmente, amostrar 200 queries de produção, rodar brute force e HNSW, calcular recall@10. Alerta se cai &gt; 2% vs baseline.</li><li><strong>Latência:</strong> p50/p99 por endpoint de busca. Alerta se p99 &gt; SLA.</li><li><strong>Embedding drift:</strong> distribuição das queries mudou? Calcular distância média entre embeddings de queries de hoje vs 30d atrás. Drift pode significar que o índice precisa de rebalanceamento.</li><li><strong>Zero-result queries:</strong> queries que retornam 0 resultados após filtro (post-filter muito seletivo). Alta taxa = problema de filtro, não de ANN.</li><li><strong>Index staleness:</strong> para índices que não aceitam delete real (HNSW), monitorar % de vetores soft-deleted. Acima de 10-20%, reconstruir índice.</li></ol>',
      tip: 'A métrica de index staleness por soft-delete é frequentemente ignorada. Mencionar que HNSW tem delete ineficiente e precisa de reconstrução periódica demonstra experiência de operação real.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre pgvector e Qdrant? Quando usar cada um?',
      a: '<p><strong>pgvector:</strong></p><ul><li>Extensão do PostgreSQL — vetor dentro do banco relacional.</li><li>HNSW e IVF suportados. ACID, transações, joins com dados relacionais.</li><li>Filtragem eficiente via índices BTree/GIN do Postgres.</li><li><strong>Melhor para:</strong> já tem Postgres, dataset &lt; 10M vetores, queries frequentemente combinam filtros relacionais + vetor.</li></ul><p><strong>Qdrant:</strong></p><ul><li>Vector DB dedicado, construído em Rust.</li><li>HNSW com filterable index nativo — busca filtrada eficiente even with selective filters.</li><li>Suporta múltiplos vetores por ponto, sparse vectors, quantização.</li><li><strong>Melhor para:</strong> dataset &gt; 10M vetores, filtros dinâmicos variados, features avançadas (hybrid sparse+dense).</li></ul>',
      tip: 'A chave é "já tem Postgres?" — para a maioria dos projetos, pgvector é suficiente e elimina uma dependência de infraestrutura. Posicione Qdrant para casos de uso avançados.',
    },
    {
      level: 'senior',
      q: 'Como funcionam sparse vectors e busca híbrida em vector DBs?',
      a: '<p><strong>Dense vectors</strong> (o que discutimos): 768-3072 dimensões, todos os valores não-zero. Captura semântica mas pode perder keywords exatas.</p><p><strong>Sparse vectors</strong>: milhares de dimensões (vocabulário), maioria zero. Representa term frequency. Modelos como SPLADE geram sparse vectors neurais — melhor que TF-IDF.</p><p><strong>Busca híbrida:</strong></p><ul><li>Roda dense ANN (HNSW) + sparse BM25/SPLADE em paralelo.</li><li>Combina scores com RRF (Reciprocal Rank Fusion) ou alpha ponderado.</li><li>Captura semântica (dense) + keywords exatas (sparse) — melhor recall que qualquer um sozinho.</li></ul><p>Qdrant, Weaviate e Elasticsearch têm suporte nativo a hybrid. pgvector + pg_search (Paradedb) para SQL.</p>',
      tip: 'Busca híbrida é diferencial real de sênior — a maioria dos projetos de produção atingem melhor recall com hybrid do que com dense puro. Mencionar RRF como método de fusão demonstra conhecimento prático.',
    },
    {
      level: 'pleno',
      q: 'O que é Product Quantization na prática? Como afeta busca?',
      a: '<p><strong>PQ na prática:</strong></p><ol><li>Treinamento offline: divide cada vetor de D dims em M subvetores de D/M dims. Roda k-means em cada subvetor (256 centroids por subvetor = 1 byte de código).</li><li>Compressão: cada vetor vira M bytes (ex: M=8 → 8 bytes) vs D×4 bytes (ex: 768d → 3072 bytes).</li><li>Distância com lookup table: distância de uma query a vetores comprimidos é calculada via lookup de distâncias parciais pré-computadas — sem operações de ponto flutuante.</li></ol><p><strong>Impacto na busca:</strong></p><ul><li>Velocidade: 4-10x mais rápido por comparação vs float32.</li><li>Recall: cai para 0.85-0.92 típico vs 0.97+ com float32.</li><li>RAM: 384x menos para vetores (mas HNSW ainda mantém grafo separado).</li></ul>',
      tip: 'Explicar o lookup table como mecanismo de aceleração (não apenas a compressão) demonstra que você entende por que PQ é rápido, não só que é pequeno.',
    },
    {
      level: 'senior',
      q: 'Como faz rebalanceamento e manutenção de índice HNSW em produção?',
      a: '<p>Problemas com o tempo:</p><ul><li><strong>Soft deletes acumulam:</strong> HNSW não suporta delete real — nó é marcado como deletado mas permanece no grafo e polui a busca. Recall degrada gradualmente.</li><li><strong>Inserções desbalanceiam:</strong> HNSW foi construído com distribuição do dataset original. Inserções concentradas em regiões específicas criam densidade desigual.</li></ul><p>Estratégias de manutenção:</p><ul><li><strong>Full rebuild periódico:</strong> reconstruir índice completo (mensal, ou quando soft-deletes &gt; 10%). Feito offline em cópia. Blue/green swap.</li><li><strong>Quantização rescala:</strong> ao mudar threshold de PQ ou M, rebuild é obrigatório.</li><li><strong>Qdrant segmented:</strong> divide índice em segmentos, permite compactação de segmentos individualmente sem offline total.</li></ul>',
      tip: 'A estratégia blue/green para rebuild de índice sem downtime é o que demonstra visão de operação de produção. Candidatos que só descrevem "reconstruir" sem mencionar continuidade de serviço deixam a solução incompleta.',
    },
    {
      level: 'pleno',
      q: 'Por que normalizar vetores antes de indexar?',
      a: '<p>Normalização = dividir cada vetor pelo seu módulo (norma L2). Resultado: vetores com norma = 1, todos na superfície de uma hiperesfera unitária.</p><p><strong>Por que importa:</strong></p><ul><li>Cosine similarity em vetores normalizados = equivale a L2 entre vetores normalizados. Permite usar L2 (mais rápido) para obter resultado equivalente a cosine.</li><li>Sem normalização, vetores de documentos longos têm norma maior → dominam na busca por L2 independente da relevância semântica.</li><li>HNSW com L2 em vetores normalizados: mais eficiente computacionalmente que cosine sem normalizar.</li></ul><p>Maioria dos modelos modernos (text-embedding-3, OpenAI embeddings, Cohere) já normalizam a saída. Verificar sempre com <code>np.linalg.norm(vec)</code>.</p>',
      tip: 'O insight de que L2 em vetores normalizados é equivalente a cosine é a ponte entre teoria matemática e implementação prática. Mencionar que você verifica sempre via norm é pragmatismo de produção.',
    },
    {
      level: 'senior',
      q: 'Como você implementaria um sistema de busca por similaridade para 1 bilhão de vetores?',
      a: '<p>A escala de 1B vetores exige abordagem diferente de sistemas menores:</p><ol><li><strong>Sharding horizontal:</strong> dividir em N shards (ex: 100 shards de 10M vetores cada). Query broadcast para todos os shards, agrega os top-K de cada shard, re-rankeia.</li><li><strong>IVF-PQ obrigatório:</strong> HNSW para 1B vetores = ~3TB de RAM apenas para vetores. IVF-PQ + FAISS: ~10GB de índice comprimido.</li><li><strong>Dois estágios:</strong> ANN rápido com recall menor (candidatos 100) → re-rank com modelo mais preciso nos 100 candidatos.</li><li><strong>Infraestrutura:</strong> Faiss (Meta) ou ScaNN (Google) para ANN de alta escala. Pinecone/Weaviate têm sharding gerenciado.</li><li><strong>Indexação incremental:</strong> inserir novos vetores sem rebuild. FAISS permite inserção, mas com degradação de qualidade após 10% do índice.</li></ol>',
      tip: 'A combinação sharding + IVF-PQ + dois estágios é o padrão de produção em escala de bilhão. Cada um sozinho é insuficiente — a composição é o que demonstra pensamento sistêmico.',
    },
    {
      level: 'pleno',
      q: 'Como o pgvector implementa HNSW e quais são seus limites?',
      a: '<p>pgvector &gt;= 0.5.0 suporta HNSW nativo:</p><pre><code>CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops)\nWITH (m = 16, ef_construction = 64);\n\nSET hnsw.ef_search = 100;\nSELECT * FROM items\nORDER BY embedding &lt;=&gt; query_vec\nLIMIT 10;</code></pre><p><strong>Limites do pgvector:</strong></p><ul><li>HNSW inteiro em shared_buffers RAM — sem swap para disco.</li><li>Build é serial (sem paralelismo de workers como Qdrant).</li><li>Filtragem: post-filter nativo. Para filtros muito seletivos, Qdrant é melhor.</li><li>Dimensão máxima: 2000d (pgvector &lt; 0.7). Versões novas suportam mais.</li><li>Sem Product Quantization nativo (pgvector 0.7+ tem scalar quantization).</li></ul>',
      tip: 'Citar os limites concretos (2000d, sem PQ nativo, build serial) demonstra que você usa pgvector em produção e conhece suas fronteiras, não só que sabe criar o índice.',
    },
    {
      level: 'senior',
      q: 'Qual o impacto de dimensionalidade alta no recall de HNSW?',
      a: '<p>A <strong>maldição da dimensionalidade</strong> afeta ANN de formas não-óbvias:</p><ul><li>Em alta dimensão (&gt; 100d), distâncias entre pontos aleatórios convergem — todos os pontos ficam "aproximadamente equidistantes".</li><li>Isso reduz a discriminabilidade das conexões do grafo HNSW — o grafo se torna menos eficiente como guia de navegação.</li><li>Resultado: para mesma qualidade de recall em 3072d vs 768d, precisar de M maior e efSearch maior → mais RAM, mais latência.</li></ul><p>Na prática:</p><ul><li>768d (BERT, bge-base): HNSW funciona muito bem com M=16-32.</li><li>1536d (text-embedding-3-small): M=32-48 recomendado.</li><li>3072d (text-embedding-3-large): M=64+ para recall &gt; 0.95.</li></ul><p>Dimensão maior ≠ sempre melhor recall — o modelo precisa usar as dimensões efetivamente.</p>',
      tip: 'Conectar maldição da dimensionalidade a parâmetros HNSW concretos (M maior, mais RAM) é o que transforma teoria em decisão de engenharia. A maioria dos candidatos cita a maldição mas não sabe o que fazer com ela.',
    },
    {
      level: 'pleno',
      q: 'Como você avaliaria qual vector DB usar em um novo projeto?',
      a: '<p>Framework de decisão:</p><ol><li><strong>Já tem Postgres?</strong> → Comece com pgvector. Elimina dependência de infra. Reavalie quando &gt; 10M vetores.</li><li><strong>Dataset &gt; 100M vetores?</strong> → Qdrant ou Pinecone (managed). Considere Faiss se on-premise.</li><li><strong>Filtros dinâmicos frequentes?</strong> → Qdrant (filterable HNSW) ou Weaviate.</li><li><strong>Hybrid search (sparse + dense)?</strong> → Qdrant, Weaviate, ou Elasticsearch.</li><li><strong>Self-hosted obrigatório?</strong> → pgvector, Qdrant, Weaviate, Milvus.</li><li><strong>Managed/serverless?</strong> → Pinecone, Zilliz (Milvus cloud), Weaviate Cloud.</li></ol><p>Red flags: escolher vector DB "premium" quando pgvector resolve; escolher pgvector para 1B vetores.</p>',
      tip: 'Começar pela pergunta "já tem Postgres?" é a resposta sênior — evita over-engineering e custo desnecessário. A maioria dos projetos em estágio inicial resolve com pgvector.',
    },
    {
      level: 'senior',
      q: 'Como funciona o algoritmo de inserção de um novo vetor no HNSW?',
      a: '<p>Algoritmo de inserção:</p><ol><li><strong>Sortear nível:</strong> o nó é inserido em camadas 0..l, onde l é sorteado com distribuição exponencial decrescente (a maioria dos nós fica só na camada 0). Parâmetro que controla isso é M_L = 1/ln(M).</li><li><strong>Busca greedy do topo até l:</strong> encontra o vizinho mais próximo do novo nó em cada camada acima de l.</li><li><strong>Inserção em cada camada 0..l:</strong> encontra efConstruction candidatos mais próximos, seleciona os M melhores, cria arestas bidirecionais.</li><li><strong>Shrink de vizinhos existentes:</strong> se um vizinho já tem M conexões, remove a conexão mais fraca para manter M.</li></ol><p>Complexidade: O(log N) amortizado por inserção — é por isso que HNSW é eficiente mesmo para datasets grandes.</p>',
      tip: 'Explicar o sorteio de nível com distribuição exponencial é o detalhe que demonstra leitura do paper original de Malkov (2016). É o que cria a estrutura hierárquica sem precisar de reparticionamento.',
    },
    {
      level: 'senior',
      q: 'Como HNSW garante conectividade do grafo e por que isso importa para recall?',
      a: '<p>Conectividade é o que garante que o algoritmo de busca greedy sempre encontra o vizinho correto:</p><ul><li><strong>Small World:</strong> cada nó tem M conexões escolhidas para maximizar cobertura local. As camadas superiores criam "atalhos" que permitem saltos longos (propriedade navigable).</li><li><strong>Diversified selection:</strong> ao selecionar os M vizinhos de um novo nó, HNSW não pega os M mais próximos trivialmente — usa "heurística de seleção de vizinhos" que prioriza vizinhos em diferentes direções. Isso garante diversidade de conexões.</li><li><strong>Por que importa:</strong> sem diversidade, o grafo cria clusters densos com poucos pontes — busca fica presa em ótimos locais. Com diversidade, cada nó tem conexões que cobrem o espaço ao redor.</li></ul><p>Parâmetro relacionado: <code>extend_candidates</code> e <code>keep_pruned_connections</code> em algumas implementações melhoram recall em troca de mais RAM.</p>',
      tip: 'A heurística de seleção diversificada (não simplesmente os M mais próximos) é o insight mais sofisticado do paper original. Candidatos que sabem isso demonstraram leitura crítica da literatura.',
    },
  ],
  diagrams: [
    {
      title: 'Estrutura do Grafo HNSW — Multi-camada',
      html: `<style>
.hnsw-struct { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.hnsw-layer { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.hnsw-layer-label { font-size: 10px; font-weight: 700; color: #94a3b8; min-width: 60px; text-align: right; font-family: "JetBrains Mono", monospace; }
.hnsw-layer-nodes { display: flex; gap: 8px; align-items: center; flex: 1; padding: 10px 14px; border-radius: 8px; border: 1.5px dashed #334155; }
.hnsw-node { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; cursor: default; }
.hnsw-sep { height: 1px; background: #334155; flex: 1; }
.hnsw-desc { font-size: 10px; color: #94a3b8; margin-top: 4px; text-align: center; }
</style>
<div class="hnsw-struct">
  <div class="hnsw-layer">
    <div class="hnsw-layer-label">Layer 3</div>
    <div class="hnsw-layer-nodes" style="background:#6366f110">
      <div class="hnsw-node" style="background:#6366f1;color:#fff">A</div>
      <div class="hnsw-sep"></div>
      <div class="hnsw-node" style="background:#6366f1;color:#fff">G</div>
    </div>
    <div style="font-size:10px;color:#6366f1;min-width:100px">2 nós — atalhos longos</div>
  </div>
  <div class="hnsw-layer">
    <div class="hnsw-layer-label">Layer 2</div>
    <div class="hnsw-layer-nodes" style="background:#6366f108">
      <div class="hnsw-node" style="background:#6366f180;color:#fff">A</div>
      <div class="hnsw-sep"></div>
      <div class="hnsw-node" style="background:#6366f180;color:#fff">D</div>
      <div class="hnsw-sep"></div>
      <div class="hnsw-node" style="background:#6366f180;color:#fff">G</div>
      <div class="hnsw-sep"></div>
      <div class="hnsw-node" style="background:#6366f180;color:#fff">J</div>
    </div>
    <div style="font-size:10px;color:#94a3b8;min-width:100px">subset menor</div>
  </div>
  <div class="hnsw-layer">
    <div class="hnsw-layer-label">Layer 1</div>
    <div class="hnsw-layer-nodes" style="background:#6366f105">
      <div class="hnsw-node" style="background:#475569;color:#e2e8f0">A</div>
      <div class="hnsw-node" style="background:#475569;color:#e2e8f0">B</div>
      <div class="hnsw-node" style="background:#475569;color:#e2e8f0">D</div>
      <div class="hnsw-node" style="background:#475569;color:#e2e8f0">F</div>
      <div class="hnsw-node" style="background:#475569;color:#e2e8f0">G</div>
      <div class="hnsw-node" style="background:#475569;color:#e2e8f0">J</div>
    </div>
    <div style="font-size:10px;color:#94a3b8;min-width:100px">subset médio</div>
  </div>
  <div class="hnsw-layer">
    <div class="hnsw-layer-label">Layer 0</div>
    <div class="hnsw-layer-nodes" style="background:#6366f103;flex-wrap:wrap">
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">A</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">B</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">C</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">D</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">E</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">F</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">G</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">H</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">I</div>
      <div class="hnsw-node" style="background:#334155;color:#e2e8f0;width:24px;height:24px;font-size:9px">J</div>
      <div style="font-size:9px;color:#94a3b8;padding-left:4px">... todos os pontos</div>
    </div>
    <div style="font-size:10px;color:#6366f1;min-width:100px">TODOS os nós + M vizinhos cada</div>
  </div>
  <div class="hnsw-desc">Busca: entra no topo → greedy desce → refinamento na Layer 0. Atalhos nas camadas superiores evitam busca exaustiva.</div>
</div>`,
      caption: 'Hierarquia HNSW: camadas superiores com atalhos longos, Layer 0 com todos os pontos e conexões densas.',
    },
    {
      title: 'IVF vs HNSW — Trade-offs em Produção',
      html: `<style>
.hnsw-cmp { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.hnsw-cmp-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 11px; }
.hnsw-cmp-table th { padding: 8px 10px; text-align: left; border-bottom: 2px solid #334155; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #94a3b8; }
.hnsw-cmp-table td { padding: 7px 10px; border-bottom: 1px solid #1e293b; vertical-align: top; }
.hnsw-win { color: #22c55e; font-weight: 700; }
.hnsw-ok { color: #f59e0b; }
.hnsw-bad { color: #ef4444; }
.hnsw-th-alg { color: #6366f1; font-size: 12px; font-weight: 800; }
</style>
<div class="hnsw-cmp">
  <table class="hnsw-cmp-table">
    <thead>
      <tr><th>Critério</th><th class="hnsw-th-alg">HNSW</th><th style="color:#f59e0b;font-size:12px;font-weight:800">IVF-PQ</th></tr>
    </thead>
    <tbody>
      <tr><td>Recall típico</td><td class="hnsw-win">0.95-0.99</td><td class="hnsw-ok">0.85-0.92</td></tr>
      <tr><td>Latência</td><td class="hnsw-win">sub-ms (1-5ms p99)</td><td class="hnsw-ok">5-20ms p99</td></tr>
      <tr><td>RAM (1M × 768d)</td><td class="hnsw-bad">~3-4 GB</td><td class="hnsw-win">~100-200 MB</td></tr>
      <tr><td>RAM (1B × 768d)</td><td class="hnsw-bad">~3 TB</td><td class="hnsw-win">~10-20 GB</td></tr>
      <tr><td>Build time</td><td class="hnsw-ok">minutos (1M)</td><td class="hnsw-win">minutos (1M) + treino PQ</td></tr>
      <tr><td>Delete eficiente</td><td class="hnsw-bad">Não (soft delete)</td><td class="hnsw-ok">Sim (reindexação de cluster)</td></tr>
      <tr><td>Filtros seletivos</td><td class="hnsw-ok">Com Qdrant hybrid</td><td class="hnsw-ok">Post-filter ou rebuild</td></tr>
      <tr><td>Ideal para</td><td class="hnsw-win">&lt; 50M vetores, alta qualidade</td><td class="hnsw-win">&gt; 100M, RAM limitada</td></tr>
    </tbody>
  </table>
</div>`,
      caption: 'Comparação objetiva HNSW vs IVF-PQ para guiar a decisão em produção.',
    },
    {
      title: 'Parâmetros de Tuning HNSW',
      html: `<style>
.hnsw-params { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; }
.hnsw-param-row { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; padding: 12px; border-radius: 8px; background: #1e293b; border: 1.5px solid #334155; }
.hnsw-param-name { font-size: 13px; font-weight: 800; font-family: "JetBrains Mono", monospace; color: #6366f1; min-width: 130px; }
.hnsw-param-range { font-size: 10px; color: #f59e0b; font-family: "JetBrains Mono", monospace; min-width: 90px; }
.hnsw-param-desc { font-size: 11px; color: #94a3b8; flex: 1; line-height: 1.5; }
.hnsw-param-phase { font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: .05em; }
</style>
<div class="hnsw-params">
  <div class="hnsw-param-row">
    <div class="hnsw-param-name">M</div>
    <div class="hnsw-param-range">16-64</div>
    <div class="hnsw-param-desc">Max conexões por nó. Mais = melhor recall, mais RAM, build mais lento. Padrão: 16.</div>
    <div class="hnsw-param-phase" style="background:#1e293b;color:#ef4444;border:1px solid #ef4444">BUILD</div>
  </div>
  <div class="hnsw-param-row">
    <div class="hnsw-param-name">ef_construction</div>
    <div class="hnsw-param-range">64-400</div>
    <div class="hnsw-param-desc">Candidatos durante build. Mais = melhor qualidade do grafo, build mais lento. Padrão: 200.</div>
    <div class="hnsw-param-phase" style="background:#1e293b;color:#ef4444;border:1px solid #ef4444">BUILD</div>
  </div>
  <div class="hnsw-param-row">
    <div class="hnsw-param-name">ef_search</div>
    <div class="hnsw-param-range">64-400</div>
    <div class="hnsw-param-desc">Candidatos durante busca. Mais = mais recall, mais latência. Ajustável em runtime. Padrão: 64-100.</div>
    <div class="hnsw-param-phase" style="background:#1e293b;color:#22c55e;border:1px solid #22c55e">QUERY</div>
  </div>
  <div style="font-size:10px;color:#94a3b8;margin-top:8px;padding:8px;background:#1e293b;border-radius:6px">
    Regra prática: comece com M=32, ef_construction=200, ef_search=100. Medir recall vs ground truth. Aumentar ef_search até recall target. Se latência explode, aumentar M.
  </div>
</div>`,
      caption: 'Parâmetros HNSW separados por fase (build vs query) e seus valores típicos.',
    },
  ],
  cheatsheet: {
    title: 'HNSW / IVF Cheatsheet — Referência de Produção',
    html: `<style>
.hnsw-cs { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; color: #e2e8f0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.hnsw-cs-section { }
.hnsw-cs-title { font-size: 11px; font-weight: 800; color: #6366f1; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px; }
.hnsw-cs-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 5px; font-size: 10px; }
.hnsw-cs-key { color: #38bdf8; font-family: "JetBrains Mono", monospace; min-width: 110px; flex-shrink: 0; }
.hnsw-cs-val { color: #94a3b8; line-height: 1.5; }
</style>
<div class="hnsw-cs">
  <div class="hnsw-cs-section">
    <div class="hnsw-cs-title">HNSW — Parâmetros</div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">M</span><span class="hnsw-cs-val">16-64 conexões/nó. Mais RAM, mais recall</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">ef_construction</span><span class="hnsw-cs-val">200+ para qualidade. Só afeta build</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">ef_search</span><span class="hnsw-cs-val">Ajustável runtime. 100-200 para recall &gt;0.95</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">RAM 1M×768d</span><span class="hnsw-cs-val">~3-4 GB (grafo + vetores float32)</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">Recall típico</span><span class="hnsw-cs-val">0.95-0.99 com parâmetros razoáveis</span></div>
  </div>
  <div class="hnsw-cs-section">
    <div class="hnsw-cs-title">IVF-PQ — Parâmetros</div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">nlist</span><span class="hnsw-cs-val">sqrt(N) a 4×sqrt(N). Clusters k-means</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">nprobe</span><span class="hnsw-cs-val">1-nlist. 10-50 típico. Mais = mais recall</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">PQ m</span><span class="hnsw-cs-val">Subvetores. 8-96. Mais = menos compressão</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">RAM 1B×768d</span><span class="hnsw-cs-val">~10-20 GB com PQ (vs 3TB HNSW)</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">Recall típico</span><span class="hnsw-cs-val">0.85-0.92 com IVF-PQ</span></div>
  </div>
  <div class="hnsw-cs-section">
    <div class="hnsw-cs-title">pgvector — SQL</div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">HNSW index</span><span class="hnsw-cs-val">USING hnsw (col vector_cosine_ops)</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">ef_search</span><span class="hnsw-cs-val">SET hnsw.ef_search = 100;</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">cosine op</span><span class="hnsw-cs-val">ORDER BY col &lt;=&gt; query_vec LIMIT K</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">L2 op</span><span class="hnsw-cs-val">ORDER BY col &lt;-&gt; query_vec LIMIT K</span></div>
  </div>
  <div class="hnsw-cs-section">
    <div class="hnsw-cs-title">Decisão</div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">&lt; 10M + Postgres</span><span class="hnsw-cs-val">pgvector HNSW. Sem infra extra.</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">10M-100M</span><span class="hnsw-cs-val">Qdrant ou pgvector dedicado.</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">&gt; 100M</span><span class="hnsw-cs-val">Qdrant / Pinecone com IVF-PQ.</span></div>
    <div class="hnsw-cs-row"><span class="hnsw-cs-key">1B+</span><span class="hnsw-cs-val">Faiss IVF-PQ + sharding.</span></div>
  </div>
</div>`,
  },
  mindmap: {
    title: 'HNSW / IVF — Mapa Mental',
    html: `<style>
.hnsw-mm { font-family: "Space Grotesk", sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; color: #e2e8f0; }
.hnsw-mm-center { text-align: center; margin-bottom: 20px; }
.hnsw-mm-title { font-size: 16px; font-weight: 800; color: #6366f1; }
.hnsw-mm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.hnsw-mm-node { background: #1e293b; border: 1.5px solid #334155; border-radius: 8px; padding: 10px; }
.hnsw-mm-node-title { font-size: 11px; font-weight: 700; margin-bottom: 6px; }
.hnsw-mm-node-items { font-size: 10px; color: #94a3b8; line-height: 1.7; }
</style>
<div class="hnsw-mm">
  <div class="hnsw-mm-center"><div class="hnsw-mm-title">ANN: HNSW &amp; IVF</div></div>
  <div class="hnsw-mm-grid">
    <div class="hnsw-mm-node"><div class="hnsw-mm-node-title" style="color:#6366f1">HNSW</div><div class="hnsw-mm-node-items">• Grafo multi-camada<br>• M, ef_construction, ef_search<br>• Recall 0.95-0.99<br>• Todo em RAM</div></div>
    <div class="hnsw-mm-node"><div class="hnsw-mm-node-title" style="color:#f59e0b">IVF-PQ</div><div class="hnsw-mm-node-items">• k-means clustering<br>• nlist, nprobe<br>• PQ = compressão 32-384x<br>• RAM eficiente</div></div>
    <div class="hnsw-mm-node"><div class="hnsw-mm-node-title" style="color:#22c55e">Métricas</div><div class="hnsw-mm-node-items">• Recall@K vs ground truth<br>• Latência p50/p99<br>• Throughput (QPS)<br>• RAM footprint</div></div>
    <div class="hnsw-mm-node"><div class="hnsw-mm-node-title" style="color:#38bdf8">Vector DBs</div><div class="hnsw-mm-node-items">• pgvector: Postgres nativo<br>• Qdrant: filterable HNSW<br>• Pinecone: managed<br>• Faiss: escala bilhões</div></div>
    <div class="hnsw-mm-node"><div class="hnsw-mm-node-title" style="color:#ef4444">Gotchas</div><div class="hnsw-mm-node-items">• Normalizar vetores<br>• Mesmo modelo para embed/query<br>• HNSW: delete = rebuild<br>• nlist muito baixo = cluster gigante</div></div>
    <div class="hnsw-mm-node"><div class="hnsw-mm-node-title" style="color:#a855f7">Busca Filtrada</div><div class="hnsw-mm-node-items">• Post-filter: &gt;10% dados<br>• Pre-filter: filtros estáticos<br>• Hybrid: Qdrant, Weaviate<br>• BTree + ANN: &lt;1% seletividade</div></div>
  </div>
</div>`,
  },
  mnemonics: [
    {
      label: 'MES — Parâmetros HNSW',
      trick: 'MES: M (conexões), efConstruction (qualidade de build), efSearch (qualidade de busca)',
      explanation: 'M = quantas conexões cada nó tem (mais = mais RAM, mais recall); efConstruction = qualidade do grafo ao construir (não muda depois); efSearch = profundidade da busca em runtime (único ajustável sem rebuild). MES é a sequência: defina M → efC → ajuste efS em produção.',
    },
    {
      label: 'HNSW = Hotel de muitos andares',
      trick: 'HNSW é um hotel: térreo tem TODOS os quartos, andares superiores têm menos — busca começa no penthouse e desce',
      explanation: 'Layer 0 (térreo) = todos os pontos com conexões densas. Camadas superiores = subsets cada vez menores. Busca entra no andar mais alto (poucos nós, atalhos longos), desce greedily, chega no térreo onde refina. Os elevadores entre andares = as conexões M de cada nó.',
    },
    {
      label: 'IVF = Biblioteca com departamentos',
      trick: 'IVF é uma biblioteca: k-means cria departamentos (clusters), centróide é o índice, nprobe é quantos departamentos você visita',
      explanation: 'nlist = número de departamentos (clusters via k-means). Centróides = cartão de cada departamento. Busca: olha todos os cartões (nlist comparações) → escolhe nprobe departamentos mais relevantes → lê livros só deles. PQ = versão resumida de cada livro (comprimida mas aproximada).',
    },
    {
      label: 'RNG — O que medir em ANN',
      trick: 'RNG: Recall, eNock (kNock = RAM/latência), Ground truth',
      explanation: 'R = Recall@K (qualidade principal); N = kNock = custo operacional (RAM, latência, throughput); G = Ground truth (brute force em amostra — sem ele o recall não tem referência). Sem G, R é invenção. Sem equilibrar R e N, o sistema não é viável em produção.',
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: 'Indexar e buscar vetores com pgvector',
      description: 'Instale pgvector em PostgreSQL local. Crie tabela com coluna vector(768). Insira 1000 vetores aleatórios. Crie índice HNSW com m=16, ef_construction=64. Execute busca por similaridade cosine e compare resultado com brute force. Calcule recall@10 manualmente.',
      concepts: ['pgvector', 'hnsw', 'cosine-similarity', 'recall', 'sql'],
    },
    {
      level: 'intermediario',
      title: 'Benchmark HNSW: curva recall × latência',
      description: 'Usando Qdrant (Docker) ou pgvector, indexe 100K vetores de 768d (gerados aleatoriamente ou com sentence-transformers em textos reais). Gere ground truth via brute force em 200 queries. Varie ef_search de 32 a 512 em passos. Para cada valor, meça recall@10 e latência p99. Plote a curva recall×latência e identifique o ponto de eficiência ótima.',
      concepts: ['hnsw', 'ef_search', 'recall', 'benchmark', 'curva-recall-latencia', 'ground-truth'],
    },
    {
      level: 'senior',
      title: 'Implementar busca semântica com Qdrant e filtros',
      description: 'Construa um sistema de busca de artigos com: (1) indexação de 10K artigos com sentence-transformers, (2) busca por similaridade + filtro por category e date_range em Qdrant, (3) compare recall com post-filter vs Qdrant filterable HNSW, (4) implemente semantic cache (Redis) para queries repetidas, (5) instrumente latência p99 e cache hit rate. Demonstre que filtros seletivos (<5%) quebram performance com post-filter mas funcionam com filterable HNSW.',
      concepts: ['qdrant', 'filterable-hnsw', 'post-filter', 'semantic-cache', 'sentence-transformers', 'observabilidade'],
    },
    {
      level: 'senior',
      title: 'Comparar HNSW vs IVF-PQ em escala',
      description: 'Usando Faiss (Python), indexe 5M vetores de 768d com (a) HNSW M=32, ef=200 e (b) IVF4096-PQ64. Meça: RAM usada, tempo de build, recall@10, latência p99 para ambos. Crie relatório com a curva recall×latência de cada e recomendação justificada de qual usar para um dataset de 50M e outro de 500M, com RAM máxima de 16GB.',
      concepts: ['faiss', 'ivf-pq', 'hnsw', 'benchmark', 'ram-footprint', 'product-quantization', 'escala'],
    },
  ],
  codeExamples: [
    {
      title: 'Criar índice HNSW no pgvector',
      language: 'sql',
      code: `-- Instalar extensão
CREATE EXTENSION IF NOT EXISTS vector;

-- Criar tabela
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índice HNSW para cosine similarity
CREATE INDEX ON documents
USING hnsw (embedding vector_cosine_ops)
WITH (m = 32, ef_construction = 200);

-- Índice BTree para filtros
CREATE INDEX ON documents (category);
CREATE INDEX ON documents (created_at);

-- Busca por similaridade (cosine)
-- SET hnsw.ef_search = 100;  -- ajustar recall/latência
SELECT
    id,
    content,
    1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similarity
FROM documents
WHERE category = 'tech'
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 10;

-- Verificar uso do índice
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM documents
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 10;`,
    },
    {
      title: 'Busca com Qdrant (Python) — HNSW + filtros',
      language: 'python',
      code: `from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue, Range
)
import numpy as np

client = QdrantClient(host="localhost", port=6333)

# Criar coleção com HNSW
client.create_collection(
    collection_name="documents",
    vectors_config=VectorParams(
        size=768,
        distance=Distance.COSINE,
        # HNSW params (Qdrant defaults: m=16, ef_construction=100)
        hnsw_config={"m": 32, "ef_construct": 200, "full_scan_threshold": 10000}
    )
)

# Indexar pontos
points = [
    PointStruct(
        id=i,
        vector=np.random.rand(768).tolist(),
        payload={"category": "tech", "year": 2024, "title": f"Doc {i}"}
    )
    for i in range(10000)
]
client.upsert(collection_name="documents", points=points)

# Busca com filtro (Qdrant usa filterable HNSW nativamente)
query_vec = np.random.rand(768).tolist()

results = client.search(
    collection_name="documents",
    query_vector=query_vec,
    query_filter=Filter(
        must=[
            FieldCondition(key="category", match=MatchValue(value="tech")),
            FieldCondition(key="year", range=Range(gte=2023)),
        ]
    ),
    limit=10,
    with_payload=True,
    search_params={"ef": 150}  # ef_search em runtime
)

for hit in results:
    print(f"id={hit.id}, score={hit.score:.4f}, title={hit.payload['title']}")`,
    },
    {
      title: 'Benchmark recall@K — HNSW vs brute force (Faiss)',
      language: 'python',
      code: `import faiss
import numpy as np
import time

DIM = 768
N_VECTORS = 500_000
K = 10

# Gerar dataset
print("Gerando vetores...")
vectors = np.random.rand(N_VECTORS, DIM).astype('float32')
faiss.normalize_L2(vectors)  # normalizar para cosine

# Gerar queries e ground truth via brute force
N_QUERIES = 200
queries = np.random.rand(N_QUERIES, DIM).astype('float32')
faiss.normalize_L2(queries)

print("Calculando ground truth (brute force)...")
flat_index = faiss.IndexFlatIP(DIM)  # inner product = cosine em vetores normalizados
flat_index.add(vectors)
_, gt = flat_index.search(queries, K)  # ground truth

# Criar índice HNSW
print("Construindo índice HNSW...")
hnsw = faiss.IndexHNSWFlat(DIM, 32)  # M=32
hnsw.hnsw.efConstruction = 200
t0 = time.time()
hnsw.add(vectors)
build_time = time.time() - t0
print(f"Build: {build_time:.1f}s")

# Benchmark com diferentes ef_search
results = []
for ef in [32, 64, 100, 200, 400]:
    hnsw.hnsw.efSearch = ef
    t0 = time.time()
    _, I = hnsw.search(queries, K)
    latency_ms = (time.time() - t0) / N_QUERIES * 1000

    # Calcular recall
    recall = sum(
        len(set(I[i]) & set(gt[i])) / K
        for i in range(N_QUERIES)
    ) / N_QUERIES

    results.append((ef, recall, latency_ms))
    print(f"ef_search={ef:4d} | recall@{K}={recall:.4f} | latency={latency_ms:.2f}ms")

print(f"\\nRAM estimada: {hnsw.sa_code_size() * N_VECTORS / 1e9:.2f} GB")`,
    },
    {
      title: 'IVF-PQ com Faiss — compressão extrema',
      language: 'python',
      code: `import faiss
import numpy as np

DIM = 768
N_VECTORS = 10_000_000  # 10M vetores
K = 10

# Para IVF-PQ, treinamento é necessário
# nlist = número de clusters (regra: sqrt(N) a 4*sqrt(N))
nlist = 4096
# PQ: m = número de subvetores (m deve dividir DIM)
# DIM=768, m=48 → subvetores de 16d cada → 48 bytes por vetor
m_pq = 48

# Criar índice IVF-PQ
quantizer = faiss.IndexFlatIP(DIM)
index = faiss.IndexIVFPQ(quantizer, DIM, nlist, m_pq, 8)  # 8 bits por subvetor

# Treinar com subset (100K-500K exemplos)
print("Treinando quantizer...")
train_vecs = np.random.rand(200_000, DIM).astype('float32')
faiss.normalize_L2(train_vecs)
index.train(train_vecs)

# Adicionar vetores em batches (10M em memória pode ser pesado)
BATCH = 500_000
for batch_start in range(0, N_VECTORS, BATCH):
    batch = np.random.rand(min(BATCH, N_VECTORS - batch_start), DIM).astype('float32')
    faiss.normalize_L2(batch)
    index.add(batch)
    print(f"Indexados: {min(batch_start + BATCH, N_VECTORS):,}/{N_VECTORS:,}")

# Tunar nprobe (clusters inspecionados)
queries = np.random.rand(100, DIM).astype('float32')
faiss.normalize_L2(queries)

for nprobe in [1, 10, 50, 100, nlist]:
    index.nprobe = nprobe
    _, I = index.search(queries, K)
    print(f"nprobe={nprobe:6d} → top-{K} results")

# RAM estimada
bytes_per_vec = m_pq  # 48 bytes com PQ (vs 768*4=3072 bytes float32)
total_gb = N_VECTORS * bytes_per_vec / 1e9
print(f"\\nRAM vetores: ~{total_gb:.1f} GB (vs {N_VECTORS * DIM * 4 / 1e9:.1f} GB sem PQ)")`,
    },
  ],
  videos: [
    { title: 'Vector Databases: Embeddings, ANN and HNSW explained', channel: 'Qdrant', url: 'https://www.youtube.com/watch?v=e6Yk_3lGDL0' },
    { title: 'HNSW Algorithm Explained', channel: 'James Briggs', url: 'https://www.youtube.com/watch?v=QvKMwLjdK-s' },
    { title: 'Faiss: A Library for Efficient Similarity Search', channel: 'Meta AI', url: 'https://www.youtube.com/watch?v=sKyvsdEv6rk' },
    { title: 'Vector Search Fundamentals — Pinecone', channel: 'Pinecone', url: 'https://www.youtube.com/watch?v=NEreVar9Ymo' },
    { title: 'pgvector vs Qdrant vs Pinecone — Deep Dive', channel: 'Zack Proser', url: 'https://www.youtube.com/watch?v=zv7GxKdl00s' },
    { title: 'ANN Benchmarks and How to Read Them', channel: 'Erik Bernhardsson', url: 'https://www.youtube.com/watch?v=Rqnmfvxz4fA' },
  ],
  resources: [
    { title: 'HNSW Paper — Malkov & Yashunin (2016)', url: 'https://arxiv.org/abs/1603.09320', kind: 'artigo' },
    { title: 'Faiss Wiki — IVF Indexes', url: 'https://github.com/facebookresearch/faiss/wiki/Faiss-indexes', kind: 'docs' },
    { title: 'ANN Benchmarks — ann-benchmarks.com', url: 'https://ann-benchmarks.com/', kind: 'pratica' },
    { title: 'Pinecone — HNSW Guide', url: 'https://www.pinecone.io/learn/series/faiss/hnsw/', kind: 'artigo' },
    { title: 'Qdrant — Filterable HNSW', url: 'https://qdrant.tech/articles/filtrable-hnsw/', kind: 'artigo' },
    { title: 'pgvector Documentation', url: 'https://github.com/pgvector/pgvector', kind: 'docs' },
    { title: 'Qdrant Documentation', url: 'https://qdrant.tech/documentation/', kind: 'docs' },
    { title: 'Weaviate — Vector Index Explained', url: 'https://weaviate.io/blog/vector-index-explained', kind: 'artigo' },
    { title: 'Product Quantization for Nearest Neighbor Search (Jégou 2010)', url: 'https://lear.inrialpes.fr/pubs/2011/JDS11/jegou_searching_with_quantization.pdf', kind: 'artigo' },
  ],
}

export default hnswIvf
