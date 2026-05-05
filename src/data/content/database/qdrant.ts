import type { SkillContent } from '@/types'

const qdrant: SkillContent = {
  tagline: "Vector database de alta performance: HNSW filterable, payload indexing, multitenancy.",
  why: "Qdrant é uma das melhores opções para vector DB em produção. Saber quando usar sobre pgvector, como configurar coleções e filtros, é diferencial em stack AI.",
  summary: "Qdrant é um vector database escrito em Rust, otimizado para busca ANN com filtros. Suporta HNSW com filtros (filterable HNSW), payload indexing (índices em metadados), named vectors (múltiplos vetores por ponto), sparse vectors (para hybrid search BM25 + denso), collections, snapshots e API REST/gRPC.\n\nO principal diferencial do Qdrant sobre soluções como pgvector é o filterable HNSW: durante a construção do índice, o grafo é consciente dos filtros mais comuns, permitindo busca vetorial filtrada sem o custo de pre/post-filtering que degrada recall ou precision.",
  keypoints: [
    { title: "Collections", body: "Unidade de organização. Cada collection tem sua configuração de vetor (dimensão, métrica de distância). Isolamento completo entre collections — boa para multitenancy por cliente." },
    { title: "Points", body: "Unidade de dado: id + vector(s) + payload (metadados JSON). Payload é indexável e filtrável. Suporta upsert atômico." },
    { title: "Filterable HNSW", body: "Qdrant constrói HNSW consciente dos filtros. Para filtros seletivos, atravessa subgrafo relevante. Evita o problema de pre-filter (quebra HNSW) ou post-filter (pode retornar menos que k)." },
    { title: "Payload indexing", body: "Índices em campos do payload (keyword, integer, float, geo). Melhora performance de filtros em busca híbrida. Sem índice, filtro é brute-force." },
    { title: "Named vectors", body: "Um ponto pode ter múltiplos vetores nomeados (ex: title_embedding e body_embedding). Busca em cada um independentemente ou com fusão de scores." },
    { title: "Sparse vectors", body: "Suporte a sparse vectors (BM25, SPLADE). Combinado com dense vectors = hybrid search com Reciprocal Rank Fusion. Melhor recall que só dense em domínios especializados com jargão técnico." },
    { title: "Configuração de coleção", body: "vectors: { size: 1536, distance: Cosine }. hnsw_config: { m: 16, ef_construct: 100 }. quantization_config para comprimir vetores (scalar int8 = 4x menos RAM, recall ~99%)." },
  ],
  gotchas: [
    "Collection sem payload index para filtros frequentes — performance ruim em filtros seletivos (brute-force scan).",
    "m muito alto em HNSW — RAM e tempo de build explodem. Default 16 é bom; aumente para 32 apenas com recall comprovadamente melhor.",
    "Quantização agressiva (binary) — recall cai muito. Scalar (int8) é equilíbrio melhor: 4x menos RAM, recall quase igual.",
    "Sem snapshot/backup — vector DB é estado crítico. Configure snapshots periódicos via API de snapshots do Qdrant.",
    "Payload com chaves dinâmicas — impossível indexar tudo antecipadamente. Pense no schema de payload antes de definir a collection.",
  ],
  interview: [
    {
      q: "Como Qdrant resolve busca com filtros eficientemente?",
      a: "<p>Filterable HNSW: durante a construção do índice, Qdrant é consciente dos filtros mais comuns e constrói o grafo de forma que o traversal possa ser guiado por filtros.</p><p>Durante busca com filtro, em vez de pré-filtrar (quebra o grafo HNSW, destrói o recall) ou pós-filtrar (pode retornar menos que k resultados), Qdrant navega no subgrafo de pontos que satisfazem o filtro. Resultado: recall alto com filtros seletivos sem overhead.</p>",
      level: "senior",
    },
    {
      q: "Quando hybrid search (sparse + dense) é necessário?",
      a: "<p>Dense vectors (embeddings) são bons para similaridade semântica mas podem falhar em matching exato de termos raros: nomes próprios, códigos, jargão técnico, SKUs, IDs. 'iPhone 15 Pro Max 256GB' pode ter score baixo contra 'smartphone Apple 2023' semanticamente, mas exact match é o correto.</p><p>Sparse vectors (BM25, SPLADE) são bons para matching de termos exatos. Combinar via Reciprocal Rank Fusion ou score linear melhora recall em domínios especializados. Qdrant suporta nativamente com query de named vectors.</p>",
      level: "senior",
    },
    {
      q: "Qual a diferença entre Qdrant e pgvector?",
      a: "<p>pgvector: integrado ao Postgres (mesma transação, ACID, JOINs SQL), operacionalmente simples, bom até ~10M vetores. Filtros via SQL mas sem HNSW filterable — filtros muito seletivos degradam performance.</p><p>Qdrant: vector DB dedicado, filterable HNSW nativo, payload indexing, sparse vectors, quantização, collections isoladas. Melhor em escala, filtros complexos, multitenancy. Mais complexidade operacional — servidor adicional, API própria.</p>",
      level: "pleno",
    },
    {
      q: "O que é quantização de vetores e qual o impacto?",
      a: "<p>Quantização reduz a precisão dos floats do vetor para representação menor. Scalar quantization (int8): 4x menos RAM que float32, recall típico > 99%, speedup na busca. Binary quantization: 32x menos RAM, recall pode cair para 90–95%.</p><p>Qdrant suporta quantização por collection com rescoring: busca com vetor quantizado para candidatos, re-rank com vetor original nos top-K. Boa estratégia para manter recall alto com menos RAM.</p>",
      level: "senior",
    },
  ],
  resources: [
    { title: "Qdrant docs", url: "https://qdrant.tech/documentation/", kind: "docs" },
    { title: "Qdrant — Filterable HNSW", url: "https://qdrant.tech/articles/filtrable-hnsw/", kind: "artigo" },
  ],
}

export default qdrant
