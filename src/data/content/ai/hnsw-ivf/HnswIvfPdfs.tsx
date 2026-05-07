'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta HNSW/IVF ───────────────────────────────────────────────────────────
const C = '#6366f1'   // indigo — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 19 perguntas mais cobradas em entrevista ANN/Vector DB',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: HNSW vs IVF, tuning de parâmetros (M, ef_construction, ef_search, nlist, nprobe), recall@K, Product Quantization, busca filtrada, normalização de vetores, dimensionalidade, escolha de vector DB. Pleno e sênior com dicas práticas.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'HNSW, IVF-PQ, pgvector e decisão de vector DB numa folha',
    type: 'quick-ref',
    pages: 2,
    description: 'Cartão de bolso: parâmetros de HNSW e IVF-PQ com valores típicos, operadores pgvector SQL, comparação RAM por escala, guia de decisão de vector DB por dataset size e requisitos.',
    icon: '02',
    goal: 'Consulta rápida',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Explique a diferença entre HNSW e IVF. Quando escolher cada um?',
    a: 'HNSW: grafo multi-camada, busca greedy de cima para baixo. Recall 0.95-0.99, tudo em RAM (3-4GB/1M × 768d). Ideal para < 50M vetores com RAM disponível. IVF: k-means em nlist clusters, busca compara com centroids e inspeciona nprobe clusters. IVF-PQ comprime 32-384x. RAM ~100MB/1M vetores. Recall 0.85-0.92. Ideal para > 100M vetores ou RAM limitada.',
    tip: 'Cite números concretos (RAM, recall típico). Entrevistadores validam se você já operou em produção ou só leu documentação.',
  },
  {
    level: 'Senior',
    q: 'Como tunaria HNSW para p99 < 50ms e recall@10 > 0.95?',
    a: 'Pipeline: (1) Ground truth: brute force em 200 queries de produção, salva 10 vizinhos reais. (2) Build com M=32, efConstruction=200. (3) Varia ef_search (64, 100, 200, 400), mede recall e p99 em cada. Plota curva recall × latência. (4) Identifica ef_search onde recall > 0.95 e p99 < 50ms. (5) Se p99 estoura antes: aumentar M (mais RAM, menos ef_search necessário). (6) Validar sob carga concorrente.',
    tip: 'A curva recall × latência é o artefato visual do processo. Mencionar validação sob carga concorrente demonstra pensamento de produção.',
  },
  {
    level: 'Pleno',
    q: 'O que é Recall@K e por que importa?',
    a: 'Recall@K = (vizinhos verdadeiros retornados no top-K) / K. Recall@10 = 0.90 → dos 10 mais próximos reais, você retorna 9 em média. Importa porque ANN é por definição aproximado — trade-off recall vs latência/RAM. Em RAG: recall baixo → LLM não recebe contexto correto → hallucination. Em recomendação: recall baixo → itens relevantes perdidos. Medir sempre contra ground truth (brute force em amostra) — sem ground truth, o número não tem significado.',
    tip: 'Conectar recall ao impacto no sistema (RAG = hallucination, recomendação = relevância). Candidatos que só definem sem conectar ao negócio demonstram visão limitada.',
  },
  {
    level: 'Pleno',
    q: 'O que é IVF-PQ e quando usar?',
    a: 'IVF-PQ = IVF + Product Quantization. PQ divide vetor de 768d em M subvetores, quantiza cada um para 1 byte (256 centroids). 768d × 4 bytes = 3072 bytes → 8 bytes com PQ (m=8). Compressão 384x. Comparação via lookup table em vez de ponto flutuante — 4-10x mais rápido. Recall 0.85-0.92. Usar quando: dataset > 100M vetores, RAM proibitiva para HNSW, recall menor aceitável.',
    tip: 'Dar o cálculo concreto (384x compressão, 8 bytes vs 3KB) e o caso de uso (> 100M vetores) demonstra entendimento do problema real que PQ resolve.',
  },
  {
    level: 'Senior',
    q: 'Como implementa busca filtrada eficiente com HNSW?',
    a: 'Três estratégias: (1) Post-filter: ANN com K grande (100), filtra depois. Funciona se filtro retém > 10% dos dados. Pode retornar menos que K. (2) Pre-filter: subíndice por filtro estático. HNSW do subconjunto perde conectividade se muito pequeno. (3) Hybrid (Qdrant, Weaviate): filterable HNSW — índice consciente do filtro. Correto para filtros dinâmicos variados. Regra: < 1% seletividade → BTree no Postgres + ANN complementar.',
    tip: 'Mencionar o limiar de 10% e o fallback para BTree são detalhes de experiência real. Candidatos que só listam as estratégias sem os limites demonstram teoria sem prática.',
  },
  {
    level: 'Pleno',
    q: 'Por que nunca misturar modelos de embedding entre indexação e busca?',
    a: 'Modelos criam espaços vetoriais próprios e incompatíveis. Mesmo com mesma dimensão, dois modelos mapeiam conceitos para regiões completamente diferentes. "Gato" em text-embedding-3-small e "gato" em bge-m3 produzem vetores sem correlação de distância. Resultado: recall cai para zero ou pior — sistema funciona sem erro mas com qualidade zero (mais perigoso que falhar explicitamente). Qualquer mudança de modelo exige rebuild completo de todo o índice.',
    tip: 'O insight de "funciona mas com qualidade zero" é o mais valioso — é bug silencioso que só aparece ao medir recall. Mencionar isso demonstra experiência com problemas reais de produção.',
  },
  {
    level: 'Senior',
    q: 'Quanto de RAM consome um índice HNSW com 10M vetores de 768 dimensões?',
    a: 'Cálculo: Vetores: 10M × 768 × 4 bytes (float32) = 30.7 GB. Grafo (M=16): 10M × 32 arestas × 4 bytes = 1.28 GB. Overhead estrutura (~20%): ~6 GB. Total: ~38 GB. Em r6g.2xlarge AWS (64GB RAM) cabe com folga. Com 1536d (OpenAI text-embedding-3-small) dobra para ~76 GB. IVF-PQ (m=8): 10M × 8 bytes = 80MB de vetores — dramaticamente menor.',
    tip: 'Dar o número concreto (38GB) e a instância AWS que comporta demonstra que você pensa em custo de infraestrutura, não só algoritmos.',
  },
  {
    level: 'Pleno',
    q: 'O que é cosine similarity e quando usar em vez de L2?',
    a: 'Cosine: mede ângulo entre vetores — ignora magnitude, considera direção semântica. L2: distância euclidiana — sensível à magnitude. Para embeddings de texto: usar cosine (magnitude varia por comprimento de texto, direção representa semântica). Vetores normalizados (norma L2=1): cosine e L2 são equivalentes. A maioria dos modelos modernos já normaliza a saída — verificar com np.linalg.norm(vec) ≈ 1.0.',
    tip: 'A equivalência matemática cosine ↔ L2 em vetores normalizados é o detalhe que diferencia quem sabe geometria de quem memorizou regras. Mencionar que você verifica sempre via norm é pragmatismo.',
  },
  {
    level: 'Senior',
    q: 'Como monitora qualidade de índice ANN em produção?',
    a: 'Estratégia: (1) Recall periódico: amostrar 200 queries semanalmente, rodar brute force e HNSW, calcular recall@10 — alerta se cai > 2% vs baseline. (2) Latência: p50/p99 por endpoint. (3) Embedding drift: queries hoje vs 30d atrás — drift pode pedir rebalanceamento. (4) Zero-result queries: alta taxa = problema de filtro, não ANN. (5) Index staleness: HNSW soft-deletes acima de 10-20% → reconstruir índice.',
    tip: 'Index staleness por soft-delete é frequentemente ignorado. Mencionar que HNSW tem delete ineficiente e precisa de reconstrução periódica demonstra experiência de operação real.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre pgvector e Qdrant? Quando usar cada um?',
    a: 'pgvector: extensão PostgreSQL — HNSW e IVF, ACID, transações, joins relacionais. Filtros via BTree/GIN nativos. Melhor para: já tem Postgres, < 10M vetores, queries combinam filtros relacionais + vetor. Qdrant: Vector DB dedicado em Rust, filterable HNSW nativo (filtros seletivos eficientes), múltiplos vetores por ponto, sparse vectors, quantização avançada. Melhor para: > 10M vetores, filtros dinâmicos variados, features avançadas.',
    tip: 'Começar por "já tem Postgres?" é a resposta sênior — elimina dependência de infra. Posicionar Qdrant para casos avançados evita over-engineering.',
  },
  {
    level: 'Senior',
    q: 'Como funciona busca híbrida (sparse + dense)?',
    a: 'Dense vectors: 768-3072 dims, todos não-zero, captura semântica. Sparse vectors: milhares de dims, maioria zero, captura keywords exatas (SPLADE/BM25). Busca híbrida: roda ANN dense (HNSW) + sparse em paralelo, combina scores com RRF (Reciprocal Rank Fusion) ou alpha ponderado. Melhor recall que qualquer um sozinho — captura semântica + keywords. Qdrant, Weaviate, Elasticsearch têm suporte nativo.',
    tip: 'Busca híbrida é diferencial real de sênior — a maioria dos projetos atingem melhor recall com hybrid do que dense puro. RRF como método de fusão demonstra conhecimento prático.',
  },
  {
    level: 'Senior',
    q: 'Como faz manutenção de índice HNSW em produção?',
    a: 'Problemas: soft deletes acumulam (nó marcado como deletado mas polui o grafo, recall degrada). Inserções desbalanceiam o grafo. Estratégias: (1) Full rebuild periódico quando soft-deletes > 10% ou mensal. Feito offline em cópia, blue/green swap para zero downtime. (2) Qdrant segmented: compacta segmentos individualmente sem offline total. (3) Rebuild ao mudar M, PQ threshold ou dimensão.',
    tip: 'Blue/green swap para rebuild sem downtime é o que demonstra operação de produção real. Candidatos que só dizem "reconstruir" deixam a solução incompleta.',
  },
  {
    level: 'Pleno',
    q: 'Por que normalizar vetores antes de indexar?',
    a: 'Normalização = dividir pelo módulo L2 → vetor com norma = 1, na hiperesfera unitária. Por que importa: (1) Cosine em vetores normalizados = equivalente a L2 — usa L2 (mais rápido) com resultado de cosine. (2) Sem normalização, documentos longos têm norma maior → dominam em L2 sem ser mais relevantes. (3) Eficiência computacional. Verificar: np.linalg.norm(vec) ≈ 1.0 — a maioria dos modelos modernos já normaliza.',
    tip: 'L2 em vetores normalizados = cosine é a ponte entre teoria matemática e implementação prática. Verificar sempre via norm é pragmatismo de produção.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria busca por similaridade para 1 bilhão de vetores?',
    a: 'Escala requer: (1) Sharding horizontal: N shards de 10M vetores, query broadcast para todos, agrega top-K de cada shard, re-rankeia. (2) IVF-PQ obrigatório: HNSW 1B = ~3TB RAM inviável. IVF-PQ + Faiss: ~10-20GB. (3) Dois estágios: ANN rápido (recall menor, 100 candidatos) → re-rank preciso nos 100. (4) Infra: Faiss (Meta) ou ScaNN (Google). Pinecone/Weaviate têm sharding gerenciado.',
    tip: 'Sharding + IVF-PQ + dois estágios é o padrão de bilhões. Cada um sozinho é insuficiente — a composição demonstra pensamento sistêmico.',
  },
  {
    level: 'Pleno',
    q: 'Como usar pgvector com HNSW no PostgreSQL?',
    a: 'CREATE EXTENSION IF NOT EXISTS vector; CREATE INDEX USING hnsw (col vector_cosine_ops) WITH (m=32, ef_construction=200); SET hnsw.ef_search = 100; SELECT * FROM items ORDER BY embedding <=> query_vec LIMIT 10; Operadores: <=> cosine, <-> L2, <#> inner product. Limites: tudo em RAM, build serial, sem PQ nativo (pgvector 0.7+ tem scalar quantization). Dim máxima: 2000d em versões antigas.',
    tip: 'Citar os limites concretos (build serial, sem PQ, 2000d limite) demonstra que você usa pgvector em produção e conhece suas fronteiras.',
  },
  {
    level: 'Senior',
    q: 'Qual o impacto de dimensionalidade alta no recall de HNSW?',
    a: 'Maldição da dimensionalidade: em > 100d, distâncias entre pontos aleatórios convergem — todos ficam aproximadamente equidistantes. HNSW perde discriminabilidade das conexões do grafo → para mesmo recall, precisa M maior e ef_search maior. Na prática: 768d (BERT, bge-base) → M=16-32 ok. 1536d → M=32-48. 3072d → M=64+ para recall > 0.95. Dimensão maior ≠ sempre melhor — modelo precisa usar as dimensões efetivamente.',
    tip: 'Conectar maldição da dimensionalidade a parâmetros concretos (M maior, mais RAM) transforma teoria em decisão de engenharia.',
  },
  {
    level: 'Pleno',
    q: 'Como avaliaria qual vector DB usar em novo projeto?',
    a: 'Framework: (1) Já tem Postgres? → pgvector. Zero infra extra. (2) > 100M vetores? → Qdrant ou Pinecone managed. (3) Filtros dinâmicos variados? → Qdrant filterable HNSW. (4) Hybrid sparse+dense? → Qdrant, Weaviate, Elasticsearch. (5) Self-hosted obrigatório? → pgvector, Qdrant, Weaviate, Milvus. (6) Managed serverless? → Pinecone, Zilliz. Red flag: escolher Qdrant "premium" quando pgvector resolve; escolher pgvector para 1B vetores.',
    tip: '"Já tem Postgres?" é a primeira pergunta sênior — evita over-engineering e custo desnecessário. Maioria dos projetos em estágio inicial resolve com pgvector.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o algoritmo de inserção no HNSW?',
    a: 'Passos: (1) Sortear nível: distribuição exponencial decrescente (parâmetro M_L = 1/ln(M)) — maioria fica só na Layer 0. (2) Busca greedy do topo até nível sorteado: acha vizinho mais próximo em camadas superiores. (3) Inserção em cada Layer 0..l: encontra efConstruction candidatos, seleciona M melhores com heurística de diversidade, cria arestas bidirecionais. (4) Shrink: se vizinho já tem M conexões, remove a mais fraca. Complexidade: O(log N) amortizado.',
    tip: 'Heurística de seleção diversificada (não simplesmente M mais próximos) é o insight do paper original de Malkov (2016). Demonstra leitura crítica da literatura.',
  },
  {
    level: 'Senior',
    q: 'Como HNSW garante conectividade e por que isso importa para recall?',
    a: 'Conectividade garante busca greedy sempre acha o vizinho: diversified selection ao inserir — M vizinhos escolhidos em diferentes direções do espaço, não só os M mais próximos triviais. Sem diversidade: clusters densos com poucos pontes → busca fica presa em ótimos locais. Com diversidade: cada nó cobre o espaço ao redor → busca navega eficientemente. Camadas superiores criam atalhos (small world property) que permitem saltos longos antes de refinar.',
    tip: 'A diferença entre "M mais próximos" e "M mais próximos com diversidade" é o que distingue teoria superficial de leitura do paper original.',
  },
]

// ── Dados: Quick Reference ────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'HNSW — PARÂMETROS',
        entries: [
          { key: 'M', value: '16-64 conexões/nó. Default: 16. Mais = mais RAM, mais recall', badge: 'BUILD', badgeColor: '#ef4444' },
          { key: 'ef_construction', value: '200+ para qualidade. Só afeta build, não altera depois', badge: 'BUILD', badgeColor: '#ef4444' },
          { key: 'ef_search', value: '64-400. Aumenta recall, aumenta latência. Único ajustável runtime', badge: 'QUERY', badgeColor: '#22c55e' },
          { key: 'RAM (1M×768d)', value: '~3-4 GB (grafo + vetores float32)', badge: 'custo', badgeColor: '#f59e0b' },
          { key: 'RAM (1B×768d)', value: '~3 TB — inviável. Use IVF-PQ.', badge: 'limite', badgeColor: '#ef4444' },
          { key: 'Delete', value: 'Soft delete. Rebuild ao atingir 10-20% de deletados.', badge: 'operação', badgeColor: '#6366f1' },
        ],
      },
      {
        title: 'IVF-PQ — PARÂMETROS',
        entries: [
          { key: 'nlist', value: 'sqrt(N) a 4×sqrt(N) clusters. 1M vetores → nlist=1024-4096', badge: 'BUILD', badgeColor: '#ef4444' },
          { key: 'nprobe', value: '10-50 típico. Mais = mais recall, mais latência. Ajustável runtime', badge: 'QUERY', badgeColor: '#22c55e' },
          { key: 'PQ m', value: 'Subvetores. 8-96. Mais subvetores = menos compressão, mais recall', badge: 'BUILD', badgeColor: '#ef4444' },
          { key: 'Compressão', value: '768d × 4B = 3072B → 8B (m=8). Fator 384x', badge: '-384x RAM', badgeColor: '#22c55e' },
          { key: 'RAM (1B×768d)', value: '~10-20 GB com PQ — viável vs 3TB HNSW', badge: 'viável', badgeColor: '#22c55e' },
          { key: 'Recall típico', value: '0.85-0.92 com IVF-PQ vs 0.95-0.99 HNSW', badge: 'trade-off', badgeColor: '#f59e0b' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'PGVECTOR — SQL',
        entries: [
          { key: 'Instalar', value: 'CREATE EXTENSION IF NOT EXISTS vector;', badge: 'DDL', badgeColor: '#6366f1' },
          { key: 'HNSW index', value: 'USING hnsw (col vector_cosine_ops) WITH (m=32, ef_construction=200)', badge: 'DDL', badgeColor: '#6366f1' },
          { key: 'ef_search', value: 'SET hnsw.ef_search = 100;  — por sessão ou global', badge: 'runtime', badgeColor: '#22c55e' },
          { key: 'Cosine <=>', value: 'ORDER BY embedding <=> query_vec LIMIT K', badge: 'DML', badgeColor: '#38bdf8' },
          { key: 'L2 <->', value: 'ORDER BY embedding <-> query_vec LIMIT K', badge: 'DML', badgeColor: '#38bdf8' },
          { key: 'Inner product <#>', value: 'ORDER BY embedding <#> query_vec LIMIT K', badge: 'DML', badgeColor: '#38bdf8' },
        ],
      },
      {
        title: 'DECISÃO DE VECTOR DB',
        entries: [
          { key: '< 10M + Postgres', value: 'pgvector HNSW — zero infra extra, ACID', badge: 'padrão', badgeColor: '#22c55e' },
          { key: '10M - 100M', value: 'Qdrant (filtros) ou pgvector dedicado', badge: 'médio', badgeColor: '#f59e0b' },
          { key: '> 100M', value: 'Qdrant managed ou Pinecone com IVF-PQ', badge: 'grande', badgeColor: '#ef4444' },
          { key: '1B+', value: 'Faiss IVF-PQ + sharding horizontal', badge: 'extremo', badgeColor: '#ef4444' },
          { key: 'Filtros seletivos', value: 'Qdrant filterable HNSW — < 1% seletividade ok', badge: 'Qdrant', badgeColor: '#6366f1' },
          { key: 'Managed serverless', value: 'Pinecone ou Zilliz (Milvus cloud)', badge: 'SaaS', badgeColor: '#38bdf8' },
        ],
      },
      {
        title: 'TUNING — WORKFLOW',
        entries: [
          { key: '1. Ground truth', value: 'Brute force em 200 queries → salva top-10 reais', badge: 'obrigatório', badgeColor: '#ef4444' },
          { key: '2. Build inicial', value: 'M=32, ef_construction=200 (defaults razoáveis)', badge: 'baseline', badgeColor: '#f59e0b' },
          { key: '3. Varia ef_search', value: '64 → 100 → 200 → 400. Mede recall e p99 em cada', badge: 'iteração', badgeColor: '#6366f1' },
          { key: '4. Plota curva', value: 'Recall × latência. Identifica ponto ótimo.', badge: 'análise', badgeColor: '#6366f1' },
          { key: '5. Ajusta M', value: 'Se p99 estoura antes de recall SLA: aumenta M', badge: 'RAM vs latência', badgeColor: '#f59e0b' },
          { key: '6. Valida carga', value: 'Benchmark concorrente — latência difere do serial', badge: 'produção', badgeColor: '#22c55e' },
        ],
      },
    ],
  },
]

// ── Builders ─────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'HNSW / IVF',
    stackLabel: 'AI Engineering — Vector Search',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'HNSW / IVF',
    accentColor: C,
    stackLabel: 'AI Engineering — Vector Search',
    tagline: 'Parâmetros, SQL e decisões de vector DB em produção',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function HnswIvfPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)
  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />)}
      </div>
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}
