import type { SkillContent } from '@/types'

const pgvector: SkillContent = {
  tagline: "Extensão Postgres para armazenar e buscar vetores (embeddings) com ANN.",
  why: "pgvector permite fazer RAG e semantic search sem um vector DB separado. Integra com Postgres existente. Saber os índices (IVFFlat, HNSW) e quando sair do Postgres para Qdrant/Pinecone é diferencial em stack AI.",
  summary: "pgvector adiciona o tipo vector ao Postgres, operadores de distância (cosine, L2, inner product) e índices ANN: IVFFlat (inverted file, menor RAM) e HNSW (melhor recall, mais RAM). Permite busca semântica sobre embeddings de texto/imagem diretamente no Postgres, combinando com filtros relacionais.\n\nA principal vantagem é a simplicidade operacional: sem banco adicional, transações ACID incluindo vetores, filtros SQL nativo. A limitação é escala — acima de ~10M vetores, HNSW em RAM se torna proibitivo e bancos especializados como Qdrant ou Pinecone são mais eficientes.",
  keypoints: [
    { title: "Tipo vector", body: "Coluna vector(1536) para embedding OpenAI text-embedding-3-small. Suporta dimensões de 1 a 16.000. Operadores: <-> (L2), <=> (cosine), <#> (inner product negativo)." },
    { title: "IVFFlat index", body: "Particiona vetores em N listas via k-means. Busca compara query com centroids, pega top K listas, busca dentro delas. Menor RAM que HNSW. Parâmetros: lists (clusters), probes (quantas listas buscar em query)." },
    { title: "HNSW index", body: "Grafo hierárquico de navegabilidade. Melhor recall e latência que IVFFlat. Mais RAM (todos os vetores ficam no grafo). Parâmetros: m (conexões por nó), ef_construction (construção), ef_search (busca). Disponível desde pgvector 0.5." },
    { title: "Hybrid search", body: "Combina busca vetorial com filtros SQL: SELECT ... ORDER BY embedding <=> $1 WHERE category = 'X' LIMIT 10. Pré-filtro muito seletivo pode degradar ANN — pgvector cai para seq scan em alguns casos." },
    { title: "Distâncias", body: "Cosine similarity para embeddings de texto (normaliza por magnitude, bom para comparação semântica). L2 para embeddings geométricos. Inner product para modelos que maximizam produto interno (ada-002 da OpenAI)." },
    { title: "Quando sair do Postgres", body: "Bilhões de vetores: HNSW em RAM inviável. Filtros complexos frequentes: Qdrant tem HNSW filterable nativo. Multitenancy: Qdrant tem collections isoladas. Mas até ~10M vetores, pgvector resolve bem." },
  ],
  gotchas: [
    "Vetores não normalizados com cosine similarity — resultado errado. Normalize ao inserir ou use l2_normalize().",
    "IVFFlat sem ANALYZE após carga inicial — statistics erradas, planner pode escolher seq scan.",
    "HNSW com m muito alto — RAM explode. Default m=16 é bom ponto de partida (cada vetor = m * 2 ponteiros).",
    "SELECT sem LIMIT em tabela grande — retorna todos os vetores com scores, sem index pruning eficiente.",
    "Índice não usado com WHERE clause muito seletiva — pré-filtro pode fazer pgvector cair para seq scan. Verifique com EXPLAIN.",
  ],
  interview: [
    {
      q: "Quando usaria pgvector vs Qdrant?",
      a: "<p>pgvector: já tem Postgres na stack, volume moderado (<10M vetores), quer combinar busca vetorial com queries relacionais (JOINs, transações), quer simplicidade operacional.</p><p>Qdrant: volume grande (100M+), filtros complexos e frequentes, performance de busca crítica com SLA de latência, multitenancy por collection, payload filtering nativo eficiente.</p><p>Estratégia: comece com pgvector. Migre quando precisar — a API de busca vetorial é similar o suficiente para abstração.</p>",
      level: "pleno",
    },
    {
      q: "Como implementaria RAG com pgvector?",
      a: "<p>1. Chunk documentos (500–1000 tokens com overlap de 100). 2. Gera embeddings (OpenAI text-embedding-3-small ou similar). 3. Armazena em tabela: id, content TEXT, embedding vector(1536), metadata JSONB, source TEXT. 4. Cria HNSW index: CREATE INDEX ON docs USING hnsw(embedding vector_cosine_ops). 5. Query: gera embedding da pergunta, faz SELECT content ORDER BY embedding <=> $1 LIMIT 5. 6. Passa chunks recuperados como contexto para o LLM.</p>",
      tip: "Mencionar overlap de chunks e o armazenamento de metadata para filtragem contextual demonstra experiência prática.",
      level: "pleno",
    },
    {
      q: "Qual a diferença entre IVFFlat e HNSW?",
      a: "<p>IVFFlat: divide vetores em N clusters (lists). Query busca em top-K clusters (probes). Menor RAM (armazena apenas centroids + índice compacto). Recall depende de probes — mais probes = melhor recall, mais lento. Requer carga inicial para treinar k-means (bom para bulk insert).</p><p>HNSW: grafo hierárquico onde cada nó conecta a M vizinhos em múltiplas camadas. Busca navega do topo ao fundo. Melhor recall com mesma latência que IVFFlat. Mais RAM (grafo completo em memória). Mais rápido para inserts incrementais. Escolha HNSW para produção com volume moderado.</p>",
      level: "senior",
    },
  ],
  resources: [
    { title: "pgvector GitHub", url: "https://github.com/pgvector/pgvector", kind: "docs" },
    { title: "Supabase — pgvector guide", url: "https://supabase.com/docs/guides/ai/vector-columns", kind: "docs" },
  ],
}

export default pgvector
