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
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta RAG ────────────────────────────────────────────────────────────────
const C = '#a855f7'   // roxo indigo — identidade RAG/AI — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre RAG em entrevista sênior de AI',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: pipeline completo (indexação e retrieval), chunking, embedding models, hybrid search, reranking, HyDE, RAGAS métricas, Contextual Retrieval, diagnóstico de falhas, RAG vs fine-tuning.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet',
    subtitle: 'Pipeline, decisões de chunking, retrieval e RAGAS numa página',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referência densa: fases do pipeline (LSER | EARAG), estratégias de chunking, modelos de embedding, vector stores, métricas RAGAS com diagnóstico e query transformation.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Os 3 truques que fixam RAG na memória para a entrevista',
    type: 'mnemonics',
    pages: 2,
    description: 'Pipeline em dois acrônimos (LSER | EARAG), métricas RAGAS com FARC, e estratégias de retrieval com DSH.',
    icon: '03',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'RAG do pipeline básico ao estado da arte em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 categorias (Indexação, Retrieval, Geração, RAGAS, Avançado, Vector Stores) e checklist de 10 perguntas para auto-avaliar o domínio.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'O que é RAG e por que usar em vez de fine-tuning?',
    a: 'RAG (Retrieval-Augmented Generation) busca documentos relevantes em runtime e injeta como contexto no prompt antes de gerar resposta. Resolve o problema do LLM não conhecer dados privados, recentes ou específicos.\n\nRAG ganha quando: dados mudam frequentemente, volume de docs é grande, precisa citar a fonte, equipe pequena sem infra de treinamento.\n\nFine-tuning ganha quando: precisa mudar estilo, terminologia interna, ou comportamento de classificação estável.\n\nNa prática: combine — fine-tune para estilo + RAG para fatos. Sempre comece por RAG.',
    tip: 'Em entrevista: RAG é o ponto de partida. A combinação RAG + FT é o estado da arte.',
  },
  {
    level: 'Pleno',
    q: 'Quais são as fases do pipeline RAG?',
    a: 'Fase 1 — Indexação (offline): Load → Split → Embed → Store. Processa documentos e armazena vetores no vector DB.\n\nFase 2 — Retrieval+Generation (por query): Embed query → ANN Search (top-50) → Rerank (top-5) → Augment prompt → LLM → Response.\n\nMnemônico: LSER | EARAG. A separação em duas fases é fundamental: indexação é custosa e roda raramente; retrieval é leve e roda a cada query.',
    tip: 'Cite o mnemônico LSER | EARAG — demonstra que você conhece o pipeline de cor.',
  },
  {
    level: 'Pleno',
    q: 'Como escolher o tamanho do chunk?',
    a: 'Não existe tamanho universal — depende do documento e da query esperada.\n\nRegras práticas: 256-512 tokens com 10-20% de overlap para documentos com parágrafos densos. 512-1024 tokens quando contexto local é importante.\n\nComo validar: meça Context Recall com RAGAS — baixo = chunks cortando informações. Context Precision baixo = chunks grandes com ruído.\n\nEstrutura hierárquica: chunk pequeno para retrieval preciso + chunk pai para contexto amplo. Melhor dos dois mundos.',
    tip: 'Sempre mencione que testou com RAGAS — demonstra que você mensura em vez de chutar.',
  },
  {
    level: 'Pleno',
    q: 'Por que usar hybrid search em vez de só vetorial?',
    a: 'Dense (embedding) captura semântica mas falha em termos exatos raros — siglas, códigos de erro, nomes próprios.\n\nSparse (BM25) é excelente para termos exatos mas não captura paráfrases.\n\nHybrid com RRF combina os rankings: Score = Σ 1/(k + rank_i), k=60. Sem calibrar pesos. Cobre os pontos cegos de ambos — padrão em produção.',
    tip: 'Citar RRF com a fórmula demonstra que você entende o mecanismo, não apenas que "hybrid é melhor".',
  },
  {
    level: 'Senior',
    q: 'Como o reranking melhora a qualidade do RAG?',
    a: 'Biencoder (ANN search): vetoriza doc e query separadamente — rápido mas perde nuance.\n\nCross-encoder (reranker): lê query + doc juntos — muito mais preciso porque vê o contexto completo, mas lento para escalar.\n\nSolução: biencoder recupera top-50, cross-encoder reranqueia e seleciona top-5. Custo pequeno, ganho grande de precision.\n\nModelos: Cohere Rerank, bge-reranker-v2-m3 (open-source).',
    tip: 'A distinção biencoder vs cross-encoder e o motivo pelo qual cross-encoder é mais preciso é o coração do reranking.',
  },
  {
    level: 'Senior',
    q: 'Quais são as 4 métricas do RAGAS e como interpretar?',
    a: 'Faithfulness: claims da resposta apoiados no contexto? Baixo = alucinação. Fix: instrução explícita no prompt.\n\nAnswer Relevancy: resposta é sobre a pergunta? Baixo = off-topic. Fix: revise o prompt.\n\nContext Precision: docs no topo são relevantes? Baixo = retrieval com ruído. Fix: adicione reranking.\n\nContext Recall: recuperou todos os docs necessários? Baixo = chunking cortando dados. Fix: revise chunking.\n\nMnemônico: FARC. Score 0.8+ é bom, <0.6 tem problema sério.',
    tip: 'Mnemônico FARC. Diagnóstico por exclusão: Faithfulness → prompt, Precision → retrieval, Recall → chunking.',
  },
  {
    level: 'Senior',
    q: 'O que é HyDE e quando usar?',
    a: 'HyDE (Hypothetical Document Embedding): em vez de embedar a query diretamente, pede ao LLM para gerar uma resposta hipotética e embeda essa resposta.\n\nPor que funciona: a hipótese tem vocabulário e estrutura similar aos docs relevantes.\n\nQuando usar: queries muito curtas ou genéricas onde o retrieval falha. Adiciona latência (1 chamada LLM extra).\n\nCuidado: se o LLM alucina na hipótese, você embeda a alucinação. Combine com query original (ensemble).',
    tip: 'Propor ensemble (HyDE + query original) demonstra maturidade sobre os riscos do HyDE.',
  },
  {
    level: 'Senior',
    q: 'Como lidar com documentos que atualizam frequentemente?',
    a: 'Pipeline incremental com rastreamento de versão. Cada documento tem doc_id + hash do conteúdo.\n\nNo ingest: calcula hash, compara com armazenado. Mesmo hash → skip. Hash diferente → re-embed e atualiza chunks. Deletado → tombstone no vector DB.\n\nTriggers: Webhook (imediato), CDC/Debezium capturando WAL do banco (eficiente), Cron (periódico).\n\nTrocar de embedding model invalida todo o índice — versionar modelo junto ao doc_id.',
    tip: 'Mencionar que trocar de embedding model invalida o índice é o detalhe que demonstra experiência com RAG em produção.',
  },
  {
    level: 'Senior',
    q: 'Como reduzir latência de RAG em produção?',
    a: 'Cache de embeddings por hash(query). Cache semântico de respostas: se similaridade > 0.95 com query anterior, retorna resposta cacheada.\n\nHNSW no vector DB para ANN sub-100ms. Streaming da geração para TTFT baixo.\n\nModelo menor + rerank forte: Haiku é 20x mais barato que Sonnet. Parallel retrieval em RAG multi-source com RRF.',
    tip: 'Cache semântico (não só cache exato) é o insight avançado — serve para variações da mesma pergunta.',
  },
  {
    level: 'Senior',
    q: 'Qual vector store escolher para produção?',
    a: 'pgvector: já usa Postgres? Zero infra nova. ACID. Filtros SQL nativos. Ótimo até ~10M vetores.\n\nChroma: dev e testes locais. Zero config. Não para produção séria.\n\nQdrant: produção séria. Filtros avançados, scalar quantization, hybrid search nativo.\n\nPinecone: managed, zero ops. Caro em escala.\n\nPara 95% dos projetos: comece com pgvector e migre para Qdrant quando precisar de features especializadas.',
    tip: 'A resposta pragmática (comece com pgvector) demonstra julgamento de engenharia.',
  },
  {
    level: 'Senior',
    q: 'Como diagnosticar quando o RAG está respondendo mal?',
    a: 'Framework em camadas:\n\n1. Retrieval falhou? Inspecione os chunks. Se não relevantes: melhore chunking, embedding ou hybrid retrieval.\n2. Reranking ajudou? Compare top-50 vs. top-5. O doc certo está no top-5?\n3. Contexto contém a resposta? Se não: doc não indexado ou chunking cortou a info.\n4. LLM seguiu o contexto? Faithfulness baixo = alucinação. Revise prompt.\n5. Resposta relevante? Answer Relevancy baixo = off-topic. Revise prompt.',
    tip: 'Diagnóstico por camada, não soluções genéricas. Cada métrica RAGAS aponta para um componente específico.',
  },
  {
    level: 'Senior',
    q: 'O que é o problema "Lost in the Middle" em RAG?',
    a: 'LLMs prestam mais atenção ao início e ao fim do prompt (primacy/recency bias). Chunks relevantes no meio de um contexto longo são ignorados mesmo estando presentes.\n\nPaper Stanford 2023: performance cai 20%+ quando a resposta está no meio do contexto.\n\nMitigações: chunks mais relevantes no início e no fim. Top-3 de qualidade > top-10 com ruído. Reranking garante que o mais relevante está no topo.',
    tip: 'Citar o paper de Stanford com o dado de 20%+ de queda demonstra que você lê literatura técnica.',
  },
  {
    level: 'Senior',
    q: 'Como o Contextual Retrieval da Anthropic melhora o RAG padrão?',
    a: 'Problema: chunks isolados perdem o contexto do documento pai. "Cresceu 3% no trimestre" não diz o quê cresceu.\n\nSolução: antes de embedar cada chunk, usa-se Claude Haiku para gerar 1-2 frases de contexto situando o chunk no documento. Depois embeda prefixo + chunk.\n\nResultado: redução de 49% na taxa de retrieval com falha. Custo extra: ~$1 por 1M tokens de chunk.',
    tip: 'Saber o número (49% de melhoria) e o mecanismo diferencia candidatos em entrevistas de AI Engineering.',
  },
  {
    level: 'Senior',
    q: 'Como implementar citação de fontes no RAG?',
    a: 'Armazene metadata rico em cada chunk: source, page, section, date.\n\nPasse ao LLM: {"text": "...", "source": "Manual.pdf", "page": 14}\n\nNo prompt: "Ao responder, cite as fontes no formato [Fonte: {source}, p.{page}]."\n\nPost-processing: parse as citações e substitua por links clicáveis.\n\nGrounding check: verifique se cada citação existe no contexto injetado — LLM pode inventar número de página.',
    tip: 'O grounding check das citações é o detalhe avançado — sem ele, o LLM pode inventar "p. 42" para um chunk da p. 7.',
  },
  {
    level: 'Pleno',
    q: 'Qual o impacto de um chunking ruim no pipeline?',
    a: 'Chunking ruim é a causa mais frequente de RAG com baixo recall.\n\nChunk muito grande: dilui o sinal — Context Precision cai.\nChunk muito pequeno: perde contexto — Context Recall cai.\nQuebra no meio de frase ou tabela: dado truncado nunca é recuperado.\nPDFs sem extração correta: tabelas viram texto linear embaralhado.\n\nComo validar: inspecione manualmente 20-30 chunks do corpus mais representativo.',
    tip: 'A inspeção manual de chunks é o passo que separa quem fez RAG de verdade de quem só leu sobre.',
  },
  {
    level: 'Senior',
    q: 'Como usar RAG com dados estruturados (tabelas, banco de dados)?',
    a: 'RAG vetorial não funciona bem para dados tabulares — queries agregadas exigem SQL, não similaridade semântica.\n\nText-to-SQL: LLM transforma pergunta em SQL, executa, retorna resultado. Validar e sanitizar o SQL gerado.\n\nRAG sobre schema: indexa esquema + exemplos de queries como contexto. LLM gera SQL mais preciso.\n\nHybrid: RAG vetorial para contexto narrativo + Text-to-SQL para dados numéricos. Router decide qual usar.',
    tip: 'Text-to-SQL com validação (sanitização contra prompt injection → SQL injection) é o detalhe de segurança que impressiona.',
  },
  {
    level: 'Pleno',
    q: 'Como fazer RAG com documentos multilíngues?',
    a: 'Use embedding multilíngue que suporte múltiplos idiomas no mesmo espaço vetorial. bge-m3 (BAAI) suporta 100+ idiomas.\n\nNão traduza antes de indexar — perde nuances e gera custo desnecessário.\n\nArmazene idioma como metadata para filtros.\n\nNa geração: instrua o LLM a responder no idioma da pergunta, independente do idioma dos chunks.',
    tip: 'bge-m3 como referência open-source multilíngue demonstra que você acompanha o ecossistema além das APIs pagas.',
  },
  {
    level: 'Senior',
    q: 'Como avaliar e monitorar RAG em produção?',
    a: 'Avaliação offline: eval set versionado com 50-200 perguntas. Roda RAGAS em cada PR. Gate de qualidade mínima (ex: faithfulness > 0.80) para merge.\n\nMonitoramento online: log inputs, contextos e respostas. Sample 1-5% para revisão humana. Thumbs up/down do usuário. LLM-judge amostral em 10% dos requests.\n\nAlertas: anomalias de latência, aumento de refusals, respostas muito curtas.',
    tip: 'Gate de qualidade no CI/CD é o que separa RAG amador de RAG de produção.',
  },
  {
    level: 'Senior',
    q: 'Qual o custo de RAG em produção e como otimizar?',
    a: 'Componentes: embedding ~$0.02/1M tokens, reranking Cohere ~$0.001/1K docs, LLM para geração é o maior custo.\n\nOtimizações: cache semântico com 50%+ hit rate em domínio específico. Routing: FAQ → cache, complexo → pipeline completo. Modelo menor + retrieval de qualidade (Haiku 20x mais barato). Batch embedding na indexação.',
    tip: 'Cache semântico com 50%+ hit rate é o dado concreto que demonstra experiência com volume real.',
  },
  {
    level: 'Senior',
    q: 'Como documentar e versionar um pipeline RAG?',
    a: 'Versionar cada componente como código: hash do corpus + data + embedding model name. Mudança de modelo invalida tudo.\n\nChunking config como parâmetros versionados. Prompt template com hash — qualquer mudança deve rodar o eval set.\n\nWorkflow: branch → muda componente → roda eval → compara delta → merge só se melhorou.\n\nInfra: LangSmith ou MLflow para rastrear experimentos com métricas.',
    tip: 'LangSmith ou MLflow demonstra que você usa ferramentas de MLOps, não só scripts ad hoc.',
  },
]

// ── Dados: CheatSheet ─────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'LSER', sig: 'Load → Split → Embed → (Sto)Re', desc: 'Fase de indexação offline. Roda quando docs mudam. Mesmo embedding model que será usado na query.' },
  { name: 'EARAG', sig: 'Embed → ANN → Rerank → Augment → Generate', desc: 'Fase de retrieval por query. Embed query (mesmo modelo), top-50 ANN, cross-encoder top-5, augment prompt, LLM.' },
  { name: 'Chunking fixed+overlap', sig: 'chunk_size=512, overlap=64', desc: 'Ponto de partida padrão (~12% overlap). Medir Context Recall com RAGAS para calibrar.' },
  { name: 'Chunking hierarchical', sig: 'filho (retrieval) + pai (contexto)', desc: 'Estado da arte: chunk pequeno para retrieval preciso, chunk pai injetado no LLM para contexto rico.' },
  { name: 'text-embedding-3-small', sig: 'OpenAI, 1536 dims, $0.02/1M', desc: 'Barato e forte para inglês. Normalize com L2 antes de cosine similarity.' },
  { name: 'bge-m3', sig: 'BAAI, multilíngue, open-source', desc: '100+ idiomas, forte em retrieval zero-shot. Melhor opção open-source para produção multilíngue.' },
  { name: 'Hybrid + RRF', sig: 'Score = Σ 1/(k+rank_i), k=60', desc: 'Dense + BM25 combinados sem calibrar pesos. Padrão em produção — cobre pontos cegos de cada abordagem.' },
  { name: 'Cohere Rerank', sig: 'top-50 → cross-encoder → top-5', desc: 'Reranking com cross-encoder. Biencoder rápido para candidatos, cross-encoder preciso para filtrar.' },
  { name: 'HyDE', sig: 'LLM hipótese → embed hipótese', desc: 'Melhora retrieval em queries curtas. Risco: alucinação na hipótese. Combine com query original (ensemble).' },
  { name: 'Contextual Retrieval', sig: 'Haiku gera prefixo + embed(prefixo+chunk)', desc: '-49% falhas de retrieval (Anthropic). ~$1/1M tokens de chunk. Estado da arte em 2024-2025.' },
  { name: 'pgvector', sig: 'PostgreSQL extension, HNSW/IVFFlat', desc: 'Ponto de partida. Zero infra nova, ACID, filtros SQL. Ótimo até ~10M vetores.' },
  { name: 'Qdrant', sig: 'produção, filtros avançados, hybrid nativo', desc: 'Para quando pgvector não basta. Scalar quantization, filtros complexos, hybrid search integrado.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: false, t: 'Mesmo embedding na indexação e na query — trocar invalida todo o índice silenciosamente' },
  { ok: false, t: 'Sem instrução explícita "Responda APENAS com base no contexto" → alucinação garantida' },
  { ok: false, t: 'Chunks mais relevantes no meio do contexto → Lost in the Middle (queda de 20%+)' },
  { ok: false, t: 'Avaliar RAG só na intuição sem eval set com 50+ Q&As → regressão silenciosa' },
  { ok: true, t: 'RAGAS: Faithfulness↓→prompt | Precision↓→retrieval | Recall↓→chunking' },
  { ok: true, t: 'Cache semântico (threshold 0.95) para queries frequentes — 50%+ hit rate em domínio específico' },
  { ok: true, t: 'Gate de qualidade no CI/CD: faithfulness > 0.80 para cada PR que muda prompt ou retrieval' },
]

// ── Dados: Mnemônicos ─────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Pipeline RAG — fases e etapas',
    trick: 'LSER | EARAG',
    expansion: [
      ['L', 'Load — carrega docs (PDF, URL, S3, DB)'],
      ['S', 'Split — divide em chunks'],
      ['E', 'Embed — vetoriza com embedding model'],
      ['R', '(Sto)Re — armazena no vector DB'],
      ['E', 'Embed query — mesmo modelo da indexação'],
      ['A', 'ANN Search — top-50 por cosine similarity'],
      ['R', 'Rerank — cross-encoder top-50 → top-5'],
      ['A', 'Augment — monta prompt com contexto'],
      ['G', 'Generate — LLM gera resposta fundamentada'],
    ],
    explanation: 'LSER é a fase de indexação offline. EARAG é a fase de retrieval que roda a cada query.',
    example: 'Qual modelo embedar a query? O mesmo do LSER. Trocar quebra tudo.',
    why: 'O pipeline completo é A pergunta de RAG em entrevistas. Saber as 9 etapas de cor é obrigatório.',
  },
  {
    label: 'Métricas RAGAS para diagnóstico',
    trick: 'FARC',
    expansion: [
      ['F', 'Faithfulness — resposta grounded no contexto?'],
      ['A', 'Answer Relevancy — resposta sobre a pergunta?'],
      ['R', 'Recall do contexto — recuperou todos os docs?'],
      ['C', 'Context Precision — docs recuperados são relevantes?'],
    ],
    explanation: 'Cada métrica aponta para um componente: F → prompt, A → prompt, R → chunking, C → retrieval.',
    example: 'Faithfulness 0.55 + Context Precision 0.90 = prompt sem instrução. F baixo + C baixo = retrieval com ruído.',
    why: 'Diagnóstico por métrica evita tentativa e erro. Saber o que cada score baixo significa diferencia candidatos.',
  },
  {
    label: 'Estratégias de retrieval',
    trick: 'DSH',
    expansion: [
      ['D', 'Dense — embeddings, captura semântica e paráfrases'],
      ['S', 'Sparse — BM25, captura termos exatos e siglas'],
      ['H', 'Hybrid — combina D e S com RRF'],
    ],
    explanation: 'D falha em "ERR-4072". S falha em "como faço login" = "processo de autenticação". H cobre os dois.',
    example: 'pgvector suporta hybrid? Sim, com pg_sparse. Qdrant tem hybrid nativo. Weaviate também.',
    why: 'Em produção sempre H. Candidatos que só citam embeddings demonstram experiência limitada com edge cases.',
  },
]

// ── Dados: Mindmap ────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Indexação (offline)',
    color: '#a855f7',
    items: [
      { t: 'Load: PDF, URL, S3, DB', k: true },
      { t: 'Split: fixed / semantic / hierarq.', k: true },
      { t: 'Embed: bge-m3, text-emb-3-small', k: true },
      { t: 'Store: pgvector, Qdrant, Chroma', k: true },
      { t: 'Incremental indexing por hash', a: true },
      { t: 'Contextual Retrieval (prefixo Haiku)', a: true },
    ],
  },
  {
    label: 'Retrieval (por query)',
    color: '#38bdf8',
    items: [
      { t: 'Embed query (mesmo modelo)', k: true },
      { t: 'ANN Search: HNSW, IVF', k: true },
      { t: 'Dense: cosine similarity', k: true },
      { t: 'Hybrid: Dense + BM25 + RRF', k: true },
      { t: 'Cross-encoder reranking (50→5)', a: true },
      { t: 'HyDE: hipótese antes de embedar', a: true },
      { t: 'Step-back: query mais abstrata', a: true },
    ],
  },
  {
    label: 'Geração',
    color: '#22c55e',
    items: [
      { t: 'Augment: contexto + instrução', k: true },
      { t: '"Responda APENAS do contexto"', k: true },
      { t: 'Streaming para TTFT baixo', k: true },
      { t: 'Citação de fontes por chunk', k: true },
      { t: 'Lost in the Middle: ordem importa', a: true },
      { t: 'Cache semântico 0.95 threshold', a: true },
    ],
  },
  {
    label: 'Avaliação — RAGAS',
    color: '#f59e0b',
    items: [
      { t: 'Faithfulness: grounding (alucinação)', k: true },
      { t: 'Answer Relevancy: foco', k: true },
      { t: 'Context Precision: ruído', k: true },
      { t: 'Context Recall: completude', k: true },
      { t: 'Eval set 50-200 Q&As versionado', a: true },
      { t: 'Gate de qualidade no CI/CD', a: true },
    ],
  },
  {
    label: 'Avançado',
    color: '#6366f1',
    items: [
      { t: 'Contextual Retrieval -49% falhas', a: true },
      { t: 'Chunking hierárquico (pai-filho)', a: true },
      { t: 'RAG + Fine-tuning combinados', a: true },
      { t: 'Text-to-SQL para dados estruturados', a: true },
      { t: 'Graph RAG para conhecimento conectado', a: true },
      { t: 'LangSmith/MLflow para tracking', a: true },
    ],
  },
  {
    label: 'Vector Stores',
    color: '#94a3b8',
    items: [
      { t: 'pgvector: Postgres, ACID, simples', k: true },
      { t: 'Chroma: dev/testes, zero config', k: true },
      { t: 'Qdrant: produção, filtros avançados', k: true },
      { t: 'Pinecone: managed, zero ops', k: true },
      { t: 'HNSW: ANN sub-100ms', a: true },
      { t: 'Scalar quantization: memória', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Explico as fases LSER e EARAG sem hesitar?',
  'Sei quando usar chunk hierárquico vs fixed-size?',
  'Entendo por que hybrid search supera só dense?',
  'Consigo implementar reranking com cross-encoder?',
  'Sei diagnosticar problema via métricas RAGAS (FARC)?',
  'Conheço a diferença entre Faithfulness e Context Recall?',
  'Sei quando RAG é melhor que fine-tuning e vice-versa?',
  'Entendo Contextual Retrieval e o dado de -49% de falhas?',
  'Sei escolher vector store por cenário (pgvector vs Qdrant)?',
  'Consigo descrever como monitorar RAG em produção?',
]

// ── Builders ──────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'RAG',
    stackLabel: 'AI Engineering',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'RAG',
    accentColor: C,
    stackLabel: 'Pipeline · Retrieval · RAGAS',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['text-embedding-3-small', 'OpenAI — barato, forte em inglês'],
        ['bge-m3', 'BAAI — open-source, multilíngue, produção'],
        ['pgvector', 'Postgres extension — começo, ACID, filtros SQL'],
        ['Qdrant', 'Produção séria — filtros avançados, hybrid nativo'],
        ['Cohere Rerank', 'Cross-encoder reranking — top-50 → top-5'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Cache semântico (threshold 0.95) — 50%+ hit rate em domínio específico',
        'Streaming da geração para TTFT baixo (Time to First Token)',
        'Modelo menor + retrieval de qualidade: Haiku é 20x mais barato que Sonnet',
        'HNSW no vector DB para ANN sub-100ms mesmo com milhões de vetores',
        'Batch embedding na indexação — não um por um',
      ],
      patterns: [
        {
          name: 'Hybrid Search com RRF',
          code: `# Pseudo-código de fusão\nfor rank, doc in enumerate(dense_results):\n    scores[doc] += 1 / (60 + rank)\nfor rank, doc in enumerate(bm25_results):\n    scores[doc] += 1 / (60 + rank)\nfinal = sorted(scores, key=lambda d: scores[d], reverse=True)`,
          desc: 'Dense + BM25 combinados. k=60 é constante de suavização. Robusto sem calibrar pesos.',
        },
        {
          name: 'Contextual Retrieval',
          code: `# Anthropic Contextual Retrieval\nprompt = f"""Dado o documento D, escreva 1-2 frases\nde contexto para este chunk: {chunk}"""\nprefix = claude_haiku(prompt)\nembedding = embed(prefix + "\\n" + chunk)`,
          desc: '-49% falhas de retrieval. ~$1/1M tokens de chunk com Haiku.',
        },
        {
          name: 'RAGAS eval set',
          code: `from ragas import evaluate\nfrom ragas.metrics import (\n  faithfulness, answer_relevancy,\n  context_precision, context_recall\n)\nresults = evaluate(dataset, metrics=[...])\nprint(results)  # scores 0-1`,
          desc: 'Rodar em cada PR. Gate: faithfulness > 0.80 para merge.',
        },
      ],
      mentalModels: [
        'LSER (indexação) | EARAG (retrieval) — dois modos, mesmo embedding model',
        'FARC: Faithfulness→prompt, Answer→prompt, Recall→chunking, Context→retrieval',
        'DSH: Dense captura semântica, Sparse captura exatos, Hybrid cobre os dois',
        'Hierárquico: chunk filho para retrieval preciso, pai para contexto rico',
        'Contextual Retrieval: prefixo de 2 frases situando o chunk = -49% falhas',
      ],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'RAG',
    stackLabel: 'Retrieval-Augmented Generation',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'RAG',
    stackLabel: 'Retrieval-Augmented Generation',
    checklistTitle: 'Auto-avaliação pré-entrevista',
    checklistDesc: 'Responda SIM para pelo menos 8 antes de ir a uma entrevista de AI Engineering.',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function RagPdfs() {
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
