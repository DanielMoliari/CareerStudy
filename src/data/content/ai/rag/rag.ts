import type { SkillContent } from '@/types'

const rag: SkillContent = {
    tagline: 'Retrieval-Augmented Generation: busca contexto e injeta no prompt antes de gerar resposta.',
    why: 'RAG é o padrão mais cobrado em entrevista sênior de AI. Saber pipeline (chunk → embed → retrieve → rerank → generate), trade-offs com fine-tuning e como avaliar (RAGAS) separa o nível. Em 2025-2026, todo sistema de AI empresarial usa RAG ou variante — dominar isso é diferencial de empregabilidade real.',
    prerequisite: 'LLMs básicos (tokens, context window, embeddings). API de um LLM (Anthropic ou OpenAI). Noção de banco vetorial (cosine similarity). Python básico para os exemplos de código.',
    summary: 'RAG resolve o problema do LLM não saber fatos seus (privados, recentes, específicos). Você indexa documentos como vetores; na hora da pergunta, busca os top-k mais similares e injeta no prompt como contexto. O modelo responde fundamentado nos documentos — não no treinamento.\n\nO pipeline tem duas fases: Indexação (Load → Split → Embed → Store no vector DB) e Retrieval+Generation (Query → Embed query → ANN Search → Rerank → Augment prompt → LLM → Response). A magia está nos detalhes: chunking (tamanho e overlap), embedding model (multilíngue vs. monolíngue), retrieval híbrido (denso + esparso), reranking (cross-encoder), query transformation (HyDE, step-back) e avaliação (RAGAS).\n\nFalhas comuns: chunk grande demais dilui relevância, chunk pequeno perde contexto; retrieval só vetorial perde siglas e códigos exatos; sem reranking você injeta os 5 top do ANN que podem incluir docs irrelevantes; sem instrução explícita "responda só do contexto", o LLM alucina misturando conhecimento paramétrico; sem eval set, você não sabe se uma mudança melhorou ou piorou.',
    howToStudy: '<strong>Tem 1 hora?</strong> Leia os keypoints do pipeline (indexação + retrieval), os 3 diagramas e os gotchas. Depois revise os Q&As de nível pleno.<br><br><strong>Tem um fim de semana?</strong> Implemente o exercício 1 (RAG básico com ChromaDB + OpenAI). Depois leia sobre reranking (exercício 2) e RAGAS (exercício 3). Esses 3 exercícios cobrem 90% do que aparece em entrevista de AI engineering.<br><br><strong>Tem uma semana?</strong> Leia o artigo da Anthropic sobre Contextual Retrieval. Implemente hybrid search com BM25 + vetor. Rode RAGAS no seu pipeline e identifique onde o score é mais baixo — esse é o seu gargalo de melhoria.<br><br><strong>Modelo mental:</strong> RAG = dê ao LLM o contexto certo no momento certo. Cada componente do pipeline existe para aumentar a chance de que o contexto injetado seja relevante, preciso e completo.',
    diagrams: [
      {
        title: 'Pipeline RAG — Indexação e Retrieval+Generation',
        html: `<div style="background:#0f172a;padding:28px 20px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .rg1-phase{margin-bottom:20px}
    .rg1-phase-title{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;color:#a855f7;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:10px;padding:4px 10px;background:rgba(168,85,247,.10);border-radius:4px;display:inline-block}
    .rg1-flow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .rg1-node{padding:10px 14px;background:rgba(168,85,247,.10);border:1px solid rgba(168,85,247,.30);border-radius:8px;font-size:12px;font-weight:600;color:#e9d5ff;cursor:pointer;transition:all .2s;position:relative;min-width:80px;text-align:center}
    .rg1-node:hover{background:rgba(168,85,247,.25);border-color:#a855f7;transform:translateY(-2px)}
    .rg1-node:hover .rg1-tt{display:block}
    .rg1-tt{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#1e1b4b;border:1px solid #7c3aed;padding:9px 12px;border-radius:7px;font-size:11px;line-height:1.6;z-index:20;width:220px;text-align:left;color:#c4b5fd;font-weight:400;box-shadow:0 6px 24px rgba(0,0,0,.5);white-space:normal}
    .rg1-tt::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#7c3aed}
    .rg1-arrow{color:#7c3aed;font-size:16px;font-weight:700;flex-shrink:0}
    .rg1-sep{height:1px;background:linear-gradient(90deg,transparent,rgba(168,85,247,.3),transparent);margin:8px 0 16px}
  </style>
  <div style="font-size:15px;font-weight:700;color:#a855f7;margin-bottom:18px;text-align:center">PIPELINE RAG COMPLETO</div>
  <div class="rg1-phase">
    <div class="rg1-phase-title">FASE 1 — INDEXAÇÃO (offline)</div>
    <div class="rg1-flow">
      <div class="rg1-node">Load<div class="rg1-tt">Carrega documentos de qualquer fonte: PDF, URL, banco, S3. LangChain Loaders, pypdf, BeautifulSoup.</div></div>
      <div class="rg1-arrow">→</div>
      <div class="rg1-node">Split<div class="rg1-tt">Divide em chunks. Fixed-size (simples), sliding window (overlap), semantic (fronteiras naturais), hierarchical (chunk pequeno + contexto pai).</div></div>
      <div class="rg1-arrow">→</div>
      <div class="rg1-node">Embed<div class="rg1-tt">Converte texto em vetor de alta dimensão. text-embedding-3-small (OpenAI), bge-m3 (multilíngue), all-MiniLM. Normalize para cosine similarity.</div></div>
      <div class="rg1-arrow">→</div>
      <div class="rg1-node">Store<div class="rg1-tt">Armazena vetores em vector DB. pgvector (Postgres), Chroma (local), Qdrant (produção), Pinecone (managed). Mantém metadata do chunk.</div></div>
    </div>
  </div>
  <div class="rg1-sep"></div>
  <div class="rg1-phase">
    <div class="rg1-phase-title">FASE 2 — RETRIEVAL + GENERATION (online, por query)</div>
    <div class="rg1-flow">
      <div class="rg1-node">Query<div class="rg1-tt">Pergunta do usuário. Pode ser transformada antes de embedar: HyDE (gera resposta hipotética), step-back (pergunta mais abstrata), query expansion.</div></div>
      <div class="rg1-arrow">→</div>
      <div class="rg1-node">Embed<div class="rg1-tt">Mesmo modelo da indexação. Query e docs precisam do mesmo espaço vetorial — misturar modelos quebra tudo.</div></div>
      <div class="rg1-arrow">→</div>
      <div class="rg1-node">ANN<div class="rg1-tt">Busca aproximada por vizinhos mais próximos (HNSW, IVF). Sub-100ms mesmo com milhões de vetores. Retorna top-50 candidatos.</div></div>
      <div class="rg1-arrow">→</div>
      <div class="rg1-node">Rerank<div class="rg1-tt">Cross-encoder lê query+doc juntos (mais preciso). Cohere Rerank, bge-reranker. Filtra top-50 → top-5. Reduz ruído no contexto.</div></div>
      <div class="rg1-arrow">→</div>
      <div class="rg1-node">Augment<div class="rg1-tt">Injeta top-k chunks no prompt com instrução: "Responda APENAS com base no contexto. Se não souber, diga não sei."</div></div>
      <div class="rg1-arrow">→</div>
      <div class="rg1-node">LLM<div class="rg1-tt">Gera resposta fundamentada nos chunks. Claude, GPT-4o. Streaming para UX. Modelo menor (Haiku) + rerank forte = custo-benefício ótimo.</div></div>
    </div>
  </div>
</div>`,
        caption: 'Hover em cada componente para ver detalhes. A Fase 1 roda offline (indexação). A Fase 2 roda a cada query do usuário.',
      },
      {
        title: 'Estratégias de Chunking — impacto em recall e precision',
        html: `<div style="background:#0f172a;padding:22px 18px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .rg2-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .rg2-card{background:rgba(168,85,247,.07);border:1px solid rgba(168,85,247,.20);border-radius:10px;padding:13px}
    .rg2-title{font-weight:700;font-size:12px;color:#c4b5fd;margin-bottom:6px}
    .rg2-vis{background:#1e1b4b;border-radius:6px;padding:7px;margin-bottom:7px;font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.7}
    .rg2-ch{display:inline-block;padding:2px 6px;border-radius:3px;margin:1px}
    .rg2-a{background:rgba(168,85,247,.30);color:#e9d5ff}
    .rg2-b{background:rgba(99,102,241,.30);color:#c7d2fe}
    .rg2-ov{background:rgba(239,68,68,.20);color:#fca5a5}
    .rg2-c{background:rgba(168,85,247,.15);color:#c4b5fd}
    .rg2-body{font-size:11px;color:#94a3b8;line-height:1.65}
    .rg2-tag{display:inline-block;padding:2px 7px;border-radius:4px;font-size:9px;font-weight:700;margin-top:5px}
    .rg2-g{background:rgba(74,222,128,.15);color:#4ade80}
    .rg2-r{background:rgba(239,68,68,.15);color:#f87171}
    .rg2-y{background:rgba(251,191,36,.15);color:#fbbf24}
  </style>
  <div style="font-size:13px;font-weight:700;color:#a855f7;margin-bottom:14px;text-align:center">ESTRATÉGIAS DE CHUNKING</div>
  <div class="rg2-grid">
    <div class="rg2-card">
      <div class="rg2-title">Fixed-Size</div>
      <div class="rg2-vis"><span class="rg2-ch rg2-a">chunk_1 (512)</span> <span class="rg2-ch rg2-b">chunk_2 (512)</span> <span class="rg2-ch rg2-a">chunk_3 (512)</span></div>
      <div class="rg2-body">Divide por número fixo de tokens. Simples. Pode quebrar no meio de frase ou ideia.</div>
      <span class="rg2-tag rg2-y">Para começar</span> <span class="rg2-tag rg2-r">Perde fronteiras</span>
    </div>
    <div class="rg2-card">
      <div class="rg2-title">Sliding Window (overlap)</div>
      <div class="rg2-vis"><span class="rg2-ch rg2-a">chunk_1</span><span class="rg2-ch rg2-ov">overlap</span><span class="rg2-ch rg2-b">chunk_2</span><span class="rg2-ch rg2-ov">overlap</span><span class="rg2-ch rg2-a">chunk_3</span></div>
      <div class="rg2-body">Chunks com 10-20% de overlap. Preserva contexto na fronteira. ~15% mais chunks.</div>
      <span class="rg2-tag rg2-g">Preserva contexto</span> <span class="rg2-tag rg2-y">Mais chunks</span>
    </div>
    <div class="rg2-card">
      <div class="rg2-title">Semântico (fronteiras naturais)</div>
      <div class="rg2-vis"><span class="rg2-ch rg2-a">§ Parágrafo 1</span><br><span class="rg2-ch rg2-b">§ Parágrafo 2</span><br><span class="rg2-ch rg2-a">## Seção 3</span></div>
      <div class="rg2-body">Divide por parágrafo/seção/heading. Coerente semanticamente. Requer parser de estrutura.</div>
      <span class="rg2-tag rg2-g">Alta coerência</span> <span class="rg2-tag rg2-y">Tamanho variável</span>
    </div>
    <div class="rg2-card">
      <div class="rg2-title">Hierarchical (pai-filho)</div>
      <div class="rg2-vis"><span class="rg2-ch rg2-a">Pai: Seção inteira (contexto)</span><br><span class="rg2-ch rg2-c">▸ Filho 1</span> <span class="rg2-ch rg2-c">▸ Filho 2</span></div>
      <div class="rg2-body">Retrieval no filho (preciso), injeta o pai (contexto amplo). Melhor precision sem perder recall.</div>
      <span class="rg2-tag rg2-g">Melhor de ambos</span> <span class="rg2-tag rg2-r">Mais complexo</span>
    </div>
  </div>
</div>`,
        caption: 'Hierárquico é geralmente o melhor: chunk pequeno para retrieval preciso, chunk pai para contexto rico na geração.',
      },
      {
        title: 'Dense vs Sparse vs Hybrid Retrieval',
        html: `<div style="background:#0f172a;padding:22px 18px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .rg3-cols{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px}
    .rg3-col{background:rgba(168,85,247,.07);border:1px solid rgba(168,85,247,.20);border-radius:10px;padding:13px}
    .rg3-title{font-weight:700;font-size:12px;color:#c4b5fd;margin-bottom:7px;text-align:center}
    .rg3-body{font-size:11px;color:#94a3b8;line-height:1.65}
    .rg3-g{color:#4ade80;font-size:11px}
    .rg3-r{color:#f87171;font-size:11px}
    .rg3-ex{background:#1e1b4b;border-radius:6px;padding:7px;margin-top:7px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#a78bfa}
    .rg3-rrf{background:rgba(168,85,247,.10);border:1px solid rgba(168,85,247,.25);border-radius:8px;padding:11px;text-align:center}
  </style>
  <div style="font-size:13px;font-weight:700;color:#a855f7;margin-bottom:12px;text-align:center">TIPOS DE RETRIEVAL</div>
  <div class="rg3-cols">
    <div class="rg3-col">
      <div class="rg3-title">Dense / Semântico</div>
      <div class="rg3-body">Embeddings. Cosine similarity. Captura sinônimos e paráfrases.<br><br><span class="rg3-g">✓ Queries semânticas</span><br><span class="rg3-r">✗ Termos exatos raros</span></div>
      <div class="rg3-ex">Query: "pagar conta"<br>Acha: "realizar pagamento"</div>
    </div>
    <div class="rg3-col">
      <div class="rg3-title">Sparse / Lexical (BM25)</div>
      <div class="rg3-body">TF-IDF melhorado. Busca por termo exato. Bom para siglas, códigos.<br><br><span class="rg3-g">✓ Termos exatos</span><br><span class="rg3-r">✗ Paráfrases</span></div>
      <div class="rg3-ex">Query: "ERR-4072"<br>Acha: doc com "ERR-4072"</div>
    </div>
    <div class="rg3-col">
      <div class="rg3-title">Hybrid (Dense+Sparse)</div>
      <div class="rg3-body">RRF combina ambos. Cobre pontos cegos de cada abordagem.<br><br><span class="rg3-g">✓ Melhor recall geral</span><br><span class="rg3-g">✓ Padrão em produção</span></div>
      <div class="rg3-ex">RRF: 1/(k + rank_d)<br>    + 1/(k + rank_s)</div>
    </div>
  </div>
  <div class="rg3-rrf">
    <div style="font-weight:700;color:#a855f7;margin-bottom:5px;font-size:12px">Reciprocal Rank Fusion (RRF)</div>
    <div style="font-size:11px;color:#a78bfa">Score = Σ 1/(k + rank_i) — k=60 é constante de suavização. Robusto sem calibração de pesos. Padrão de fusão em hybrid search.</div>
  </div>
</div>`,
        caption: 'Em produção: use hybrid (dense + BM25) com RRF. Dense pega "como faço X", BM25 pega "ERR-4072" — nenhum cobre tudo sozinho.',
      },
    ],
    keypoints: [
      { title: 'Pipeline canônico: LSER + EARAG', body: 'Indexação: Load → Split → Embed → (Sto)Re. Retrieval+Generation: Embed query → ANN Search → Rerank → Augment → Generate. Cada etapa tem falha própria — precisa testar com RAGAS.', code: '# Fase de indexação (offline)\ndocs    = loader.load("docs/")         # carrega PDFs, URLs, etc.\nchunks  = splitter.split(docs)         # divide em chunks\nvectors = embedder.embed(chunks)       # vetoriza\nvector_db.store(vectors, metadata)     # armazena\n\n# Fase de retrieval (por query)\nq_vec      = embedder.embed(query)              # vetoriza a query\ncandidates = vector_db.search(q_vec, top_k=50) # ANN top-50\nreranked   = reranker.rerank(query, candidates)[:5]\nresponse   = llm.generate(query, context=reranked)' },
      { title: 'Chunking: tamanho e estratégia importam', body: 'Fixed-size com overlap é o começo. Semântico (por parágrafo) melhora coerência. Hierarchical (filho para retrieval, pai para contexto) é o estado da arte. Tamanho típico: 256-512 tokens com 10-20% overlap.', code: '# LangChain — RecursiveCharacterTextSplitter\nfrom langchain.text_splitter import RecursiveCharacterTextSplitter\n\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=512,\n    chunk_overlap=64,   # ~12% overlap\n    separators=["\\n\\n", "\\n", ". ", " "],\n)\nchunks = splitter.split_documents(docs)' },
      { title: 'Embedding models: tradeoffs', body: 'text-embedding-3-small (OpenAI): barato ($0.02/1M tokens), 1536 dims, ótimo para inglês. bge-m3 (BAAI): open-source, multilíngue, forte. all-MiniLM-L6: leve, rápido, ótimo para protótipos. Sempre normalize o vetor antes de cosine similarity.' },
      { title: 'Dense vs Sparse vs Hybrid', body: 'Dense (embedding): capta semântica, falha em termos exatos raros. Sparse (BM25): ótimo para termos exatos, falha em paráfrases. Hybrid com Reciprocal Rank Fusion (RRF): cobre os pontos cegos de ambos — padrão em produção.' },
      { title: 'Reranking: cross-encoder após biencoder', body: 'Biencoder (ANN search): rápido, calcula doc e query separadamente. Cross-encoder: lê query+doc juntos (mais preciso), mas lento. Solução: biencoder para top-50, cross-encoder para filtrar top-5. Cohere Rerank, bge-reranker-v2.', code: '# Reranking com Cohere\nimport cohere\nco = cohere.Client("API_KEY")\ncandidates = vector_db.search(q_vector, top_k=50)\nresults = co.rerank(\n    query=query,\n    documents=[c.text for c in candidates],\n    top_n=5,\n    model="rerank-english-v3.0"\n)' },
      { title: 'Query transformation: HyDE e step-back', body: 'HyDE (Hypothetical Document Embedding): pede ao LLM para gerar uma resposta hipotética para a query, depois embeda essa resposta. Funciona porque a hipótese tem vocabulário similar aos docs relevantes. Step-back: transforma query específica em mais abstrata para buscar princípios gerais.' },
      { title: 'RAGAS: as 4 métricas essenciais', body: 'Faithfulness: claims da resposta estão apoiados no contexto? (detecta alucinação). Answer Relevancy: resposta é sobre a pergunta? Context Precision: docs no topo são relevantes? Context Recall: pegou todos os docs necessários? (requer ground truth).', code: 'from ragas import evaluate\nfrom ragas.metrics import faithfulness, answer_relevancy, context_precision\n\nresults = evaluate(\n    dataset=eval_dataset,\n    metrics=[faithfulness, answer_relevancy, context_precision]\n)\nprint(results)  # scores 0-1 por métrica' },
      { title: 'Vector stores: quando usar qual', body: 'pgvector: já tem Postgres, ótimo até 10M vetores, ACID. Chroma: local, zero config, ideal para dev/testes. Qdrant: produção séria, filtros avançados. Pinecone: managed, zero ops, caro em escala. Para 95% dos projetos: comece com pgvector e migre para Qdrant quando precisar de performance especializada.' },
      { title: 'RAG vs fine-tuning: regra prática', body: 'RAG quando: dados mudam frequentemente, volume grande de docs, precisa citar fonte, equipe pequena. Fine-tuning quando: precisa estilo/formato específico, terminologia interna, latência baixa, conhecimento estável. Na prática: fine-tune para estilo + RAG para fatos. Sempre comece por RAG.' },
    ],
    gotchas: [
      'Chunk grande demais dilui relevância; pequeno demais perde contexto. Teste 256, 512, 1024 e meça com RAGAS antes de decidir.',
      'Esquecer de normalizar embeddings antes de cosine similarity distorce o ranking — L2 normalize sempre.',
      'Usar só retrieval denso sem BM25 perde queries com siglas raras, códigos de erro, números de processo.',
      'Sem reranking: top-k do ANN frequentemente tem doc relevante na posição 8, fora do contexto injetado no prompt.',
      'Prompt sem instrução explícita "responda APENAS com base no contexto" — modelo alucina misturando conhecimento paramétrico.',
      'Avaliar RAG só na intuição: sem eval set (50+ perguntas) e RAGAS, você regride sem perceber.',
      'Indexar PDFs sem extrair tabelas corretamente: tabela vira texto linear embaralhado e a busca nunca encontra o dado.',
      'Usar o mesmo modelo de LLM para gerar e para julgar (RAGAS) — viés de auto-favorecimento. Use modelos diferentes.',
      'Context window overflow: top-20 chunks de 512 tokens = 10K tokens que podem exceder o limite do modelo.',
      'Não versionar o vector DB — mudança de embedding model invalida todos os vetores existentes silenciosamente.',
    ],
    interview: [
      { q: 'O que é RAG e por que usar em vez de fine-tuning?', a: '<p>RAG (Retrieval-Augmented Generation) busca documentos relevantes em tempo de execução e injeta como contexto no prompt antes de gerar resposta. Resolve o problema do LLM não conhecer dados privados, recentes ou específicos.</p><p><strong>RAG ganha sobre fine-tuning quando:</strong></p><ul><li>Dados mudam frequentemente (catálogo, preços, docs internos).</li><li>Volume de documentos é grande (não caberia no contexto).</li><li>Precisa citar a fonte da resposta.</li><li>Equipe pequena sem infra de treinamento.</li></ul><p><strong>Fine-tuning ganha quando:</strong> precisa mudar estilo/formato, terminologia interna, ou comportamento de classificação estável. Na prática, combinam-se: fine-tune para estilo + RAG para fatos.</p>', tip: 'Em entrevista: RAG é o ponto de partida e fine-tuning é investimento maior. Sempre comece por RAG.', level: 'pleno' },
      { q: 'Quais são as fases do pipeline RAG?', a: '<p><strong>Fase 1 — Indexação (offline):</strong> Load → Split → Embed → Store. Processa documentos e armazena vetores no vector DB.</p><p><strong>Fase 2 — Retrieval+Generation (por query):</strong> Embed query → ANN Search (top-50) → Rerank (top-5) → Augment prompt → LLM → Response.</p><p>A separação em duas fases é fundamental: indexação é custosa e roda raramente (quando docs mudam); retrieval é leve e roda a cada query.</p>', level: 'pleno' },
      { q: 'Como escolher o tamanho do chunk?', a: '<p>Não existe tamanho universal — depende do documento e da query esperada.</p><p><strong>Regras práticas:</strong> 256-512 tokens com 10-20% overlap para documentos com parágrafos densos. 512-1024 tokens quando contexto local é importante (código, regulação).</p><p><strong>Como validar:</strong> meça Context Recall (RAGAS) — se estiver baixo, chunks podem estar cortando informações. Se Context Precision estiver baixo, chunks grandes trazem ruído.</p><p><strong>Estratégia hierárquica</strong>: chunk pequeno para retrieval preciso + chunk pai para contexto amplo. Melhor dos dois mundos.</p>', tip: 'Sempre mencione que testou com RAGAS — mostra que você mensura em vez de chutar.', level: 'pleno' },
      { q: 'Por que usar hybrid search em vez de só vetorial?', a: '<p>Retrieval denso captura semântica mas falha em termos exatos raros — siglas, códigos de erro, nomes próprios.</p><p>Retrieval esparso (BM25) é excelente para termos exatos mas não captura paráfrases.</p><p>Exemplos de falha: Dense falha em "ERR-4072" não encontrar doc com "ERR-4072". Sparse falha em "como faço login" não encontrar "processo de autenticação".</p><p>Hybrid com RRF (Reciprocal Rank Fusion) combina os rankings sem calibrar pesos: Score = Σ 1/(k + rank_i). Padrão em produção.</p>', level: 'pleno' },
      { q: 'Como o reranking melhora a qualidade do RAG?', a: '<p><strong>Biencoder</strong> (ANN search): vetoriza doc e query separadamente, faz dot product. Rápido mas perde nuance.</p><p><strong>Cross-encoder</strong> (reranker): lê query + doc juntos em par. Muito mais preciso mas lento para escalar a milhões de docs.</p><p><strong>Solução</strong>: biencoder recupera top-50 candidatos (milissegundos), cross-encoder reranqueia esses 50 e seleciona top-5. Custo pequeno, ganho grande de precision.</p><p>Modelos: Cohere Rerank, bge-reranker-v2-m3 (open-source).</p>', level: 'senior' },
      { q: 'Quais são as 4 métricas do RAGAS e como interpretar?', a: '<p><strong>Faithfulness</strong>: claims da resposta apoiados no contexto? Baixo = alucinação.</p><p><strong>Answer Relevancy</strong>: resposta é sobre a pergunta? Baixo = off-topic.</p><p><strong>Context Precision</strong>: docs no topo do retrieval são relevantes? Baixo = retrieval com ruído.</p><p><strong>Context Recall</strong>: recuperou todos os docs necessários? Requer ground truth. Baixo = chunking cortando dados.</p><p><strong>Diagnóstico:</strong> Faithfulness baixo → revise prompt de instrução. Context Precision baixo → melhore retrieval. Context Recall baixo → revise chunking.</p>', tip: 'Score 0.8+ é bom, 0.6-0.8 tem espaço de melhoria, <0.6 tem problema sério.', level: 'senior' },
      { q: 'O que é HyDE e quando usar?', a: '<p>HyDE (Hypothetical Document Embedding): em vez de embedar a query do usuário diretamente, peça ao LLM para gerar uma resposta hipotética para a query, e embede essa resposta.</p><p><strong>Por que funciona:</strong> a resposta hipotética tem vocabulário e estrutura similar aos documentos relevantes.</p><p><strong>Quando usar:</strong> quando queries são muito curtas ou genéricas e o retrieval falha. Adiciona latência (1 chamada LLM extra).</p><p><strong>Cuidado:</strong> se o LLM alucina na hipótese, você embeda a alucinação. Combine com query original (ensemble).</p>', level: 'senior' },
      { q: 'Como lidar com documentos que atualizam frequentemente?', a: '<p>Pipeline incremental com rastreamento de versão. Cada documento tem <code>doc_id</code> + <code>hash</code> do conteúdo.</p><p>No ingest: calcula hash, compara com armazenado. Mesmo hash → skip. Hash diferente → re-embed e atualiza chunks. Documento deletado → tombstone no vector DB.</p><p><strong>Triggers:</strong> Webhook (imediato), CDC/Debezium (WAL do banco), Cron (periódico, mais simples com algum delay).</p>', level: 'senior' },
      { q: 'Como reduzir latência de RAG em produção?', a: '<p>Cache de embeddings por hash(query). Cache de respostas semântico (similaridade > 0.95). HNSW no vector DB para sub-100ms. Streaming da geração para TTFT baixo. Modelo menor (Haiku, GPT-4o-mini) + rerank forte para custo-benefício. Parallel retrieval em RAG multi-source.</p>', level: 'senior' },
      { q: 'Qual vector store escolher para produção?', a: '<p><strong>pgvector</strong>: já usa Postgres? Zero infra nova. Ótimo até ~10M vetores. ACID. Filtros SQL nativos.</p><p><strong>Chroma</strong>: dev/testes. Zero config, in-memory ou disco.</p><p><strong>Qdrant</strong>: produção séria. Filtros avançados, eficiente, hybrid search nativo.</p><p><strong>Pinecone</strong>: managed, zero ops. Caro em escala.</p><p>Para 95% dos projetos: comece com pgvector e migre para Qdrant quando precisar de performance especializada.</p>', level: 'senior' },
      { q: 'Como diagnosticar quando o RAG está respondendo mal?', a: '<p>Framework em camadas:</p><ol><li><strong>Retrieval falhou?</strong> Inspecione os chunks recuperados. Se não relevantes: melhore chunking, embedding ou retrieval híbrido.</li><li><strong>Reranking ajudou?</strong> Compare top-50 vs. top-5. O doc certo está no top-5?</li><li><strong>Contexto contém a resposta?</strong> Se não: doc não indexado ou chunking cortou a info.</li><li><strong>LLM seguiu o contexto?</strong> Faithfulness baixo = alucinou. Revise instrução.</li><li><strong>Resposta é relevante?</strong> Answer Relevancy baixo = off-topic. Revise prompt.</li></ol>', tip: 'Em entrevista: diagnóstico por camada, não soluções genéricas.', level: 'senior' },
      { q: 'Como fazer RAG com documentos multilíngues?', a: '<p>Use embedding multilíngue que suporte múltiplos idiomas no mesmo espaço vetorial. bge-m3 (BAAI) suporta 100+ idiomas. Cohere multilingual também é bom.</p><p>Não traduza antes de indexar — perde nuances. Armazene idioma como metadata. Para maior precisão, combine com tradução da query antes do retrieval.</p><p>Na geração: instrua o LLM a responder no idioma da pergunta, não do contexto.</p>', level: 'senior' },
      { q: 'O que é o problema "Lost in the Middle" em RAG?', a: '<p>LLMs prestam mais atenção ao início e ao fim do prompt (primacy/recency bias). Chunks relevantes no meio de um contexto longo são "perdidos" — o modelo não os usa.</p><p><strong>Mitigações:</strong> coloque os chunks mais relevantes no início e no fim do contexto. Reduza o número de chunks (top-3 de qualidade > top-10 com ruído). Use reranking para garantir que o mais relevante está no topo. Modelos mais novos têm bias menor — mas ainda existe.</p>', level: 'senior' },
      { q: 'Como usar RAG com dados estruturados (tabelas, banco de dados)?', a: '<p>Para dados tabulares, RAG vetorial não funciona bem — queries agregadas exigem SQL, não similaridade semântica.</p><p><strong>Text-to-SQL</strong>: LLM transforma pergunta em SQL, executa, retorna resultado. Validar e sanitizar o SQL gerado.</p><p><strong>RAG sobre schema</strong>: indexa esquema + exemplos de queries como contexto. LLM gera SQL mais preciso.</p><p><strong>Hybrid</strong>: RAG vetorial para contexto narrativo + Text-to-SQL para dados numéricos.</p>', level: 'senior' },
      { q: 'Como o Contextual Retrieval da Anthropic melhora o RAG padrão?', a: '<p>O problema: chunks isolados perdem o contexto do documento pai. Chunk "cresceu 3% no trimestre" não diz o quê cresceu.</p><p><strong>Solução:</strong> antes de embedar cada chunk, usa-se Claude Haiku para gerar um prefixo de 1-2 frases situando o chunk no documento. Depois embeda <code>prefixo + chunk</code>.</p><p><strong>Resultado:</strong> redução de 49% na taxa de retrieval com falha em benchmarks da Anthropic. Custo extra: ~$1 por 1M tokens de chunk.</p>', tip: 'Mencionar Contextual Retrieval em entrevista sênior de AI demonstra que você acompanha o estado da arte.', level: 'senior' },
      { q: 'Como implementar citação de fontes no RAG?', a: '<p>Armazene metadata rico em cada chunk: source, page, section. Passe para o LLM com instrução de citação.</p><pre><code>{"text": "...", "source": "Manual_v2.pdf", "page": 14, "section": "3.2"}</code></pre><p>No prompt: "Ao citar, use [Fonte: {source}, p.{page}]." Post-processing: parse as citações e substitua por links clicáveis. Grounding check: verifique se cada citação existe no contexto injetado — LLM pode inventar número de página.</p>', level: 'senior' },
      { q: 'Qual o custo de RAG em produção e como otimizar?', a: '<p>Componentes: Embedding ~$0.02/1M tokens (text-embedding-3-small). Reranking Cohere ~$0.001/1K docs. LLM para geração é o maior custo.</p><p>Otimizações: cache semântico de queries frequentes (50%+ hit rate em domínio específico). Routing: FAQ → cache; complexo → pipeline completo. Modelo menor (Haiku) + retrieval de qualidade. Batch embedding na indexação.</p>', level: 'senior' },
      { q: 'Qual o impacto de um chunking ruim no pipeline?', a: '<p>Chunking ruim é a causa mais frequente de RAG com baixo recall e difícil de diagnosticar.</p><ul><li><strong>Chunk muito grande</strong>: dilui o sinal do embedding. Context Precision cai.</li><li><strong>Chunk muito pequeno</strong>: perde contexto necessário. Context Recall cai.</li><li><strong>Quebra no meio de frase/tabela</strong>: dado truncado não é encontrado.</li><li><strong>PDFs sem extração correta</strong>: tabelas viram texto linear, fórmulas viram lixo.</li></ul><p>Como validar: inspecione manualmente 20-30 chunks do corpus mais representativo.</p>', level: 'pleno' },
      { q: 'Como avaliar e monitorar RAG em produção?', a: '<p><strong>Avaliação offline (CI/CD):</strong> eval set versionado com 50-200 perguntas. Roda RAGAS em cada PR. Gate de qualidade mínima (ex: faithfulness > 0.80).</p><p><strong>Monitoramento online:</strong> log todos os inputs, contextos e respostas. Sample 1-5% para revisão humana. Thumbs up/down do usuário. LLM-judge amostral em 10% dos requests. Alertas em anomalias de latência, refusals, respostas muito curtas.</p>', level: 'senior' },
      { q: 'Como documentar e versionar um pipeline RAG?', a: '<p>Versionar cada componente: hash do corpus + data + embedding model usado. Mudança de embedding model = re-indexar tudo. Chunking config como código. Prompt template versionado com hash. Eval set no Git LFS ou S3 com baseline de scores.</p><p>Quando mudar qualquer componente, rode o eval set e compare o delta antes de ir para produção.</p>', level: 'senior' },
    ],
    mnemonics: [
      {
        label: 'Pipeline RAG — fases e etapas',
        trick: 'LSER | EARAG',
        explanation: 'Indexação: L(oad) → S(plit) → E(mbed) → (Sto)R(e). Retrieval+Gen: E(mbed query) → A(NN search) → R(erank) → A(ugment) → G(enerate). As duas fases do pipeline em sequência.',
      },
      {
        label: 'Métricas RAGAS',
        trick: 'FARC',
        explanation: 'F(aithfulness) — resposta está no contexto?; A(nswer Relevancy) — resposta é sobre a pergunta?; R(ecall do contexto) — pegou todos os docs?; C(ontext Precision) — docs no topo são relevantes? Score < 0.7 em qualquer = problema a resolver.',
      },
      {
        label: 'Retrieval estratégias',
        trick: 'DSH',
        explanation: 'D(ense) — embedding, captura semântica; S(parse) — BM25, captura termos exatos; H(ybrid) — combina os dois com RRF. Sempre use H em produção: elimina os pontos cegos de D e S.',
      },
    ],
    cheatsheet: {
      title: 'RAG — Referência Rápida de Decisões',
      html: `<div style="background:#0f172a;padding:26px 20px;border-radius:14px;font-family:'JetBrains Mono',monospace;color:#e2e8f0;">
  <style>
    .rgcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .rgcs-card{padding:12px 14px;background:rgba(168,85,247,.07);border-radius:8px;border:1px solid rgba(168,85,247,.18)}
    .rgcs-title{font-size:10.5px;font-weight:700;color:#c4b5fd;text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;padding-bottom:5px;border-bottom:1px solid rgba(168,85,247,.18)}
    .rgcs-row{font-size:10.5px;line-height:1.8;color:#94a3b8;padding:1px 0}
    .rgcs-row b{color:#e9d5ff}
  </style>
  <div class="rgcs-grid">
    <div class="rgcs-card">
      <div class="rgcs-title">Chunking</div>
      <div class="rgcs-row"><b>Fixed+overlap</b>: 512 tok, overlap 64</div>
      <div class="rgcs-row"><b>Semântico</b>: por parágrafo/seção</div>
      <div class="rgcs-row"><b>Hierarchical</b>: filho p/ retrieval, pai p/ contexto</div>
      <div class="rgcs-row"><b>Context Recall baixo</b> → aumenta chunk</div>
    </div>
    <div class="rgcs-card">
      <div class="rgcs-title">Embedding Models</div>
      <div class="rgcs-row"><b>OpenAI</b>: text-embedding-3-small (barato)</div>
      <div class="rgcs-row"><b>Open-source</b>: bge-m3 (multilíngue)</div>
      <div class="rgcs-row"><b>Leve</b>: all-MiniLM-L6 (proto)</div>
      <div class="rgcs-row"><b>Normalize</b> antes de cosine similarity</div>
    </div>
    <div class="rgcs-card">
      <div class="rgcs-title">Retrieval</div>
      <div class="rgcs-row"><b>Dense</b>: semântica, sinônimos</div>
      <div class="rgcs-row"><b>BM25</b>: termos exatos, siglas</div>
      <div class="rgcs-row"><b>Hybrid + RRF</b>: padrão em produção</div>
      <div class="rgcs-row"><b>Rerank</b>: top-50 → cross-encoder → top-5</div>
    </div>
    <div class="rgcs-card">
      <div class="rgcs-title">RAGAS — Diagnóstico</div>
      <div class="rgcs-row"><b>Faithfulness baixo</b>: prompt sem instrução</div>
      <div class="rgcs-row"><b>Relevancy baixo</b>: retrieval off-topic</div>
      <div class="rgcs-row"><b>Precision baixo</b>: ruído no retrieval</div>
      <div class="rgcs-row"><b>Recall baixo</b>: chunking cortando info</div>
    </div>
    <div class="rgcs-card">
      <div class="rgcs-title">Vector Stores</div>
      <div class="rgcs-row"><b>pgvector</b>: já tem Postgres → use</div>
      <div class="rgcs-row"><b>Chroma</b>: dev e testes locais</div>
      <div class="rgcs-row"><b>Qdrant</b>: produção, filtros avançados</div>
      <div class="rgcs-row"><b>Pinecone</b>: managed, zero ops</div>
    </div>
    <div class="rgcs-card">
      <div class="rgcs-title">Query Transformation</div>
      <div class="rgcs-row"><b>HyDE</b>: gera hipótese, embeda hipótese</div>
      <div class="rgcs-row"><b>Step-back</b>: query → mais abstrata</div>
      <div class="rgcs-row"><b>Expansion</b>: 1 query → N variações</div>
      <div class="rgcs-row"><b>Contextual Retrieval</b>: prefixo de contexto</div>
    </div>
  </div>
</div>`,
      caption: 'Comece simples (fixed-size + pgvector + dense), meça com RAGAS, adicione complexidade onde o score indica problema.',
    },
    mindmap: {
      title: 'RAG — Mapa Mental Completo',
      html: `<div style="background:#0f172a;padding:26px 18px;border-radius:14px;font-family:'Plus Jakarta Sans',sans-serif;color:#e2e8f0;">
  <style>
    .rgmm-center{text-align:center;margin-bottom:20px}
    .rgmm-hub{display:inline-block;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-weight:800;font-size:14px;padding:11px 22px;border-radius:12px;box-shadow:0 4px 20px rgba(168,85,247,.4)}
    .rgmm-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px}
    .rgmm-branch{background:rgba(168,85,247,.07);border:1px solid rgba(168,85,247,.18);border-radius:10px;padding:12px}
    .rgmm-title{font-weight:700;font-size:11px;color:#c4b5fd;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid rgba(168,85,247,.15);text-transform:uppercase;letter-spacing:.5px}
    .rgmm-leaf{font-size:11px;color:#94a3b8;line-height:1.85;padding:1px 0}
    .rgmm-leaf::before{content:'› ';color:#a855f7;font-weight:700}
    .rgmm-leaf b{color:#e9d5ff}
  </style>
  <div class="rgmm-center">
    <div class="rgmm-hub">RETRIEVAL-AUGMENTED GENERATION</div>
    <div style="color:#475569;font-size:11px;margin-top:6px">Dê ao LLM o contexto certo no momento certo</div>
  </div>
  <div style="text-align:center;color:#a855f7;font-size:18px;margin-bottom:9px">↓</div>
  <div class="rgmm-grid">
    <div class="rgmm-branch">
      <div class="rgmm-title">Indexação (offline)</div>
      <div class="rgmm-leaf"><b>Load</b> — PDF, URL, S3, DB</div>
      <div class="rgmm-leaf"><b>Split</b> — fixed / semantic / hierarq.</div>
      <div class="rgmm-leaf"><b>Embed</b> — bge-m3, text-emb-3-small</div>
      <div class="rgmm-leaf"><b>Store</b> — pgvector, Qdrant, Chroma</div>
    </div>
    <div class="rgmm-branch">
      <div class="rgmm-title">Retrieval (por query)</div>
      <div class="rgmm-leaf"><b>Embed query</b> — mesmo modelo</div>
      <div class="rgmm-leaf"><b>ANN Search</b> — HNSW, IVF</div>
      <div class="rgmm-leaf"><b>Rerank</b> — cross-encoder 50→5</div>
      <div class="rgmm-leaf"><b>Hybrid</b> — Dense + BM25 + RRF</div>
    </div>
    <div class="rgmm-branch">
      <div class="rgmm-title">Geração</div>
      <div class="rgmm-leaf"><b>Augment</b> — injeta chunks no prompt</div>
      <div class="rgmm-leaf"><b>Instrução</b> — "só do contexto"</div>
      <div class="rgmm-leaf"><b>Citação</b> — metadata de fonte</div>
      <div class="rgmm-leaf"><b>Streaming</b> — TTFT baixo</div>
    </div>
    <div class="rgmm-branch">
      <div class="rgmm-title">Avaliação (RAGAS)</div>
      <div class="rgmm-leaf"><b>Faithfulness</b> — sem alucinação</div>
      <div class="rgmm-leaf"><b>Answer Relevancy</b> — on-topic</div>
      <div class="rgmm-leaf"><b>Context Precision</b> — retrieval limpo</div>
      <div class="rgmm-leaf"><b>Context Recall</b> — não perdeu info</div>
    </div>
    <div class="rgmm-branch">
      <div class="rgmm-title">Query Transform</div>
      <div class="rgmm-leaf"><b>HyDE</b> — hipótese → embed</div>
      <div class="rgmm-leaf"><b>Step-back</b> — mais abstrata</div>
      <div class="rgmm-leaf"><b>Expansion</b> — N variações</div>
      <div class="rgmm-leaf"><b>Contextual</b> — prefixo de contexto</div>
    </div>
    <div class="rgmm-branch">
      <div class="rgmm-title">RAG vs Fine-tuning</div>
      <div class="rgmm-leaf"><b>RAG</b> — dados mudam, citar fonte</div>
      <div class="rgmm-leaf"><b>FT</b> — estilo, formato, latência</div>
      <div class="rgmm-leaf"><b>Combine</b> — FT estilo + RAG fatos</div>
      <div class="rgmm-leaf"><b>Sempre comece</b> por RAG</div>
    </div>
  </div>
</div>`,
      caption: 'Mapa mental para revisão rápida. Pipeline completo de RAG de ponta a ponta.',
    },
    exercises: [
      {
        level: 'iniciante',
        title: 'Pipeline RAG básico com PDF + ChromaDB + OpenAI',
        description: 'Implemente um chatbot que responde perguntas sobre um PDF usando RAG básico. Carregar PDF, dividir em chunks (512 tok, overlap 64), embedar com text-embedding-3-small, armazenar no ChromaDB, recuperar top-5 para cada query, gerar com GPT-4o-mini com instrução de grounding.',
        concepts: ['chunking', 'embeddings', 'vector store', 'augmentation'],
        hint: 'Use LangChain para conectar as peças. Foque em entender cada etapa antes de usar a abstração de chain.',
      },
      {
        level: 'intermediario',
        title: 'Implementar reranking com cross-encoder',
        description: 'Adicione reranking ao pipeline do exercício 1. Use Cohere Rerank ou bge-reranker-v2-m3. Recupere top-50 com ANN search, reranqueie para top-5. Meça a diferença de qualidade comparando respostas com e sem reranking nas mesmas queries.',
        concepts: ['biencoder', 'cross-encoder', 'reranking', 'precision'],
        hint: 'Para medir diferença: anote manualmente a relevância dos chunks no top-5 antes e depois do reranking.',
      },
      {
        level: 'senior',
        title: 'Avaliar pipeline com RAGAS e corrigir o ponto fraco',
        description: 'Crie um eval set de 30 perguntas com respostas esperadas. Rode RAGAS e calcule as 4 métricas. Identifique qual métrica está mais baixa e implemente uma melhoria (Context Recall < 0.7 → chunking hierárquico; Faithfulness < 0.8 → revise prompt). Meça novamente e documente o delta.',
        concepts: ['RAGAS', 'faithfulness', 'context precision', 'eval set', 'melhoria iterativa'],
        hint: 'Inicie com perguntas variadas: simples, compostas, multi-doc, e perguntas sem resposta no corpus.',
      },
    ],
    videos: [
      { title: 'RAG from Scratch (série completa)', channel: 'LangChain', url: '', topic: 'RAG do básico ao avançado — chunking, retrieval, reranking, query transformation', note: 'Série oficial LangChain, 12 partes, código no GitHub' },
      { title: 'Building Production RAG Systems', channel: 'Andrej Karpathy', url: '', topic: 'Técnicas avançadas: HyDE, reranking, hybrid search', note: 'Foca em produção — não só protótipo' },
      { title: 'Evaluating RAG with RAGAS', channel: 'AI Makerspace', url: '', topic: 'RAGAS na prática com código e interpretação de scores', note: 'Como configurar eval set e agir sobre os resultados' },
      { title: 'Contextual Retrieval — Anthropic Technique', channel: 'Anthropic Developers', url: '', topic: 'Contextual Retrieval com dados de benchmark', note: 'Referência do artigo original Anthropic' },
      { title: 'RAG vs Fine-Tuning: Which Should You Use?', channel: 'AI Jason', url: '', topic: 'Framework de decisão com exemplos práticos', note: 'Quando RAG, quando FT, quando combinar' },
    ],
    resources: [
      { title: 'LangChain — RAG concepts', url: 'https://python.langchain.com/docs/concepts/rag/', kind: 'docs' },
      { title: 'Anthropic — Contextual Retrieval', url: 'https://www.anthropic.com/news/contextual-retrieval', kind: 'artigo' },
      { title: 'Pinecone learn — RAG', url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', kind: 'artigo' },
      { title: 'RAGAS docs', url: 'https://docs.ragas.io/', kind: 'docs' },
      { title: 'Simon Willison — RAG tag', url: 'https://simonwillison.net/tags/rag/', kind: 'artigo' },
      { title: 'OpenAI Cookbook — RAG', url: 'https://cookbook.openai.com/examples/question_answering_using_embeddings', kind: 'docs' },
      { title: 'Lost in the Middle (Liu et al. 2023)', url: 'https://arxiv.org/abs/2307.03172', kind: 'artigo' },
      { title: 'Jerry Liu — Advanced RAG Techniques', url: 'https://medium.com/llamaindex-blog/a-cheat-sheet-and-some-recipes-for-building-advanced-rag-803a9d94c41b', kind: 'artigo' },
    ],
    codeExamples: [
      {
        title: 'Pipeline RAG completo com LangChain + OpenAI + ChromaDB',
        description: 'Indexação de PDF e retrieval com geração fundamentada no contexto',
        language: 'python',
        code: `from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# ---- FASE 1: INDEXAÇÃO ----
loader = PyPDFLoader("documento.pdf")
pages = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=64,
    separators=["\\n\\n", "\\n", ". ", " "],
)
chunks = splitter.split_documents(pages)

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vector_db = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# ---- FASE 2: RETRIEVAL + GENERATION ----
PROMPT_TEMPLATE = """Use APENAS o contexto abaixo para responder.
Se a resposta não estiver no contexto, diga:
"Não encontrei essa informação nos documentos."

Contexto:
{context}

Pergunta: {question}
Resposta:"""

prompt = PromptTemplate(
    template=PROMPT_TEMPLATE,
    input_variables=["context", "question"]
)

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vector_db.as_retriever(search_kwargs={"k": 5}),
    chain_type_kwargs={"prompt": prompt},
    return_source_documents=True,
)

result = qa_chain.invoke({"query": "Qual é o prazo de entrega?"})
print("Resposta:", result["result"])
print("Fontes:", [d.metadata for d in result["source_documents"]])`,
      },
      {
        title: 'Hybrid Search com BM25 + Dense + RRF',
        description: 'Retrieval híbrido com Reciprocal Rank Fusion — padrão em produção',
        language: 'python',
        code: `from rank_bm25 import BM25Okapi
from langchain_openai import OpenAIEmbeddings
import numpy as np

class HybridRetriever:
    def __init__(self, chunks: list[str], top_k: int = 5):
        self.chunks = chunks
        self.top_k = top_k
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        # BM25 (sparse)
        tokenized = [c.lower().split() for c in chunks]
        self.bm25 = BM25Okapi(tokenized)
        # Dense vectors
        self.dense_vectors = np.array(self.embeddings.embed_documents(chunks))
        norms = np.linalg.norm(self.dense_vectors, axis=1, keepdims=True)
        self.dense_vectors = self.dense_vectors / norms  # L2 normalize

    def _rrf(self, *rankings: list[int], k: int = 60) -> list[int]:
        """Reciprocal Rank Fusion — combina N rankings sem calibrar pesos."""
        scores: dict[int, float] = {}
        for ranking in rankings:
            for rank, doc_idx in enumerate(ranking):
                scores[doc_idx] = scores.get(doc_idx, 0) + 1.0 / (k + rank + 1)
        return sorted(scores, key=lambda x: scores[x], reverse=True)

    def retrieve(self, query: str) -> list[str]:
        bm25_scores = self.bm25.get_scores(query.lower().split())
        bm25_ranking = np.argsort(bm25_scores)[::-1].tolist()
        q_vec = np.array(self.embeddings.embed_query(query))
        q_vec = q_vec / np.linalg.norm(q_vec)
        dense_scores = self.dense_vectors @ q_vec
        dense_ranking = np.argsort(dense_scores)[::-1].tolist()
        final_ranking = self._rrf(bm25_ranking, dense_ranking)
        return [self.chunks[i] for i in final_ranking[:self.top_k]]

# BM25 pega "ERR-4072" exato; Dense pega "prazo de garantia" semântico
retriever = HybridRetriever(chunks=[c.page_content for c in chunks])
context = retriever.retrieve("qual o prazo de garantia ERR-4072?")`,
      },
      {
        title: 'Avaliação com RAGAS — eval set automatizado',
        description: 'Configurar eval set e interpretar as 4 métricas do RAGAS em CI',
        language: 'python',
        code: `from ragas import evaluate
from ragas.metrics import (
    faithfulness, answer_relevancy,
    context_precision, context_recall,
)
from datasets import Dataset

eval_data = {
    "question": ["Qual é o prazo de entrega padrão?", "Como cancelar um pedido?"],
    "answer": ["O prazo padrão é 5 dias úteis.", "Acesse Minha Conta > Pedidos."],
    "contexts": [
        ["...prazo padrão de entrega é 5 dias úteis para capitais..."],
        ["...cancelamento pode ser feito em até 24h em Minha Conta..."],
    ],
    "ground_truth": [
        "O prazo padrão é 5 dias úteis.",
        "Cancele em Minha Conta > Pedidos em até 24h.",
    ],
}

dataset = Dataset.from_dict(eval_data)
results = evaluate(
    dataset=dataset,
    metrics=[faithfulness, answer_relevancy, context_precision, context_recall],
)
print(results)
# {'faithfulness': 0.92, 'answer_relevancy': 0.87, ...}

# Diagnóstico automático
if results['faithfulness'] < 0.80:
    print("ALERTA: Alucinação — revise o prompt de instrução")
if results['context_precision'] < 0.75:
    print("ALERTA: Ruído no retrieval — considere reranking ou hybrid search")
if results['context_recall'] < 0.75:
    print("ALERTA: Info perdida — revise chunking (talvez muito pequeno)")`,
      },
    ],
  }

export default rag
