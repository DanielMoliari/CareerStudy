import type { SkillContent } from '@/types'

const hnswIvf: SkillContent = {
    tagline: 'Algoritmos de busca aproximada por similaridade (ANN) — base de vector DB rápido.',
    why: 'Pgvector, Qdrant, Pinecone, Weaviate todos usam HNSW por padrão. Saber explicar trade-off recall/latência/RAM e quando IVF vence é diferencial em entrevista AI senior.',
    summary: 'HNSW (Hierarchical Navigable Small World) e IVF (Inverted File Index) são os dois algoritmos ANN mais usados em vector DBs. HNSW é grafo multi-camada; IVF particiona em clusters. HNSW é padrão por velocidade/recall; IVF brilha em datasets enormes com restrição de RAM. Saber tunar M, ef_search, nlist, nprobe é skill prática.',
    keypoints: [
      { title: 'HNSW básico', body: 'Grafo multi-layer. Camada 0 tem todos os pontos; camadas superiores tem subset cada vez menor. Busca desce de cima pra baixo.' },
      { title: 'M e efConstruction', body: 'M = max conexões por no (16-64 tipico). efConstruction = candidatos durante build (200+ pra qualidade). Maior = melhor recall, mais memória.' },
      { title: 'efSearch', body: 'Tamanho da fila durante busca. Aumenta = mais recall, mais latência. Tunar até atingir SLA.' },
      { title: 'IVF básico', body: 'k-means clusteriza dataset em nlist clusters. Busca = compara query com centroids, pega nprobe clusters mais próximos, busca dentro deles.' },
      { title: 'IVF-PQ', body: 'IVF + Product Quantization. Comprime vetores em códigos menores. Reduz RAM em 8-32x com perda de recall manejavel. Bom pra bilhoes de pontos.' },
      { title: 'Recall vs latência', body: 'Trade-off central. ANN nunca é 100% exato. Recall@10 = quantos dos 10 verdadeiros vizinhos foram retornados.' },
      { title: 'HNSW vs IVF', body: 'HNSW: melhor recall/latência, alto uso de RAM (todo grafo em memória). IVF: menor RAM, recall menor, melhor pra disco/quantizacao.' },
      { title: 'Filtragem com vetor', body: 'Filtros (where category=X) + ANN é difícil. Pre-filter quebra o grafo; post-filter pode retornar menos. Qdrant/Weaviate tem hibrido.' },
    ],
    gotchas: [
      'Aumentar M sem aumentar efConstruction não melhora qualidade — desbalanceado.',
      'efSearch alto demais mata throughput sem ganho proporcional.',
      'IVF com nlist baixo (10) faz o cluster ficar enorme — perde vantagem.',
      'Esquecer de normalizar vetores antes de cosine — distancia errada.',
      'Filtros muito seletivos (1% dos dados) destroem performance ANN — considere index estruturado complementar.',
      'HNSW não suporta delete eficiente — recriar index periodicamente.',
      'Comparar recall sem ground truth (brute force em sample) é impossivel.',
    ],
    interview: [
      { q: 'Diferenca entre HNSW e IVF?', a: '<p><strong>HNSW</strong>: grafo navegavel multi-camada. Sem clustering. Busca segue arestas. Recall alto, RAM pesada.</p><p><strong>IVF</strong>: particiona em N clusters via k-means. Busca compara com centroids, pega nprobe clusters. Memoria menor (especialmente com PQ), recall menor.</p><p>Pra maioria dos casos < 10M pontos, HNSW vence. Pra bilhoes com RAM limitada, IVF-PQ.</p>' },
      { q: 'Como tuna HNSW pra produção?', a: '<p>Pipeline:</p><ul><li>Define SLA: ex: p95 < 50ms, recall@10 > 0.95.</li><li>Build com M=32, efConstruction=200 (default razoavel).</li><li>Mede recall vs ground truth (brute force em sample).</li><li>Aumenta efSearch até bater recall target. Mede latência.</li><li>Se latência ruim, aumenta M (mais RAM).</li></ul>' },
      { q: 'O que é recall@k e por que importa?', a: '<p>Recall@k = (vizinhos verdadeiros retornados em top-k) / k. Mede qualidade do ANN vs busca exata.</p><p>Importa porque ANN é trade-off: recall alto custa latência/RAM. SLA define quanto você aceita perder. Recall@10 = 0.95 significa que dos 10 mais próximos reais, você achou 9.5 em media.</p>' },
      { q: 'Quando IVF-PQ?', a: '<p>Datasets enormes (100M+ pontos) onde manter HNSW em RAM é inviavel. PQ comprime vetores 8-32x; IVF reduz comparacoes.</p><p>Trade-off: recall cai (0.85-0.92 tipicos). Vale quando custo de RAM é proibitivo.</p>' },
      { q: 'Como faz busca filtrada eficiente?', a: '<p>Tres estrategias:</p><ul><li><strong>Pre-filter</strong>: aplica filtro antes do ANN. Mata performance se filtro muito seletivo.</li><li><strong>Post-filter</strong>: ANN primeiro, filtra depois. Pode retornar menos que k.</li><li><strong>Hibrido</strong>: Qdrant/Weaviate constroem índice consciente do filtro (filterable HNSW).</li></ul><p>Em filtros muito seletivos, melhor combinar com BTree em Postgres.</p>' },
    ],
    resources: [
      { title: 'HNSW paper (Malkov, 2016)', url: 'https://arxiv.org/abs/1603.09320', kind: 'artigo' },
      { title: 'Faiss wiki — IVF', url: 'https://github.com/facebookresearch/faiss/wiki/Faiss-indexes', kind: 'docs' },
      { title: 'Pinecone — HNSW guide', url: 'https://www.pinecone.io/learn/séries/faiss/hnsw/', kind: 'artigo' },
      { title: 'Qdrant — Filterable HNSW', url: 'https://qdrant.tech/articles/filtrable-hnsw/', kind: 'artigo' },
      { title: 'ekzhu/datasketch', url: 'https://github.com/ekzhu/datasketch', kind: 'docs' },
      { title: 'pgvector docs', url: 'https://github.com/pgvector/pgvector', kind: 'docs' },
    ],
  }

export default hnswIvf
