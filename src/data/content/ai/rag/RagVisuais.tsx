'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'

const C      = '#a855f7'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const SKY    = '#38bdf8'

const RAG_STAGES = [
  { idx: 0, color: RED,  title: 'Query',     sub: '"como voar?"',    body: 'Pergunta do usuário chega em texto natural. Pode ser reescrita (HyDE, query expansion) antes de seguir.' },
  { idx: 1, color: SKY,  title: 'Embed',     sub: '[0.21, -0.4...]', body: 'Modelo de embedding transforma texto em vetor de 768/1536/3072 dims. Mesmo modelo usado offline pra indexar precisa ser usado online pra buscar.' },
  { idx: 2, color: C,    title: 'Vector DB',  sub: 'top-K kNN',       body: 'Busca top-K vetores mais próximos por cosine/dot. ANN (HNSW, IVF) trocando recall por latência. Pinecone, pgvector, Qdrant, Chroma.' },
  { idx: 3, color: AMB,  title: 'Rerank',    sub: 'cross-encoder',   body: 'Cross-encoder reordena os candidatos com modelo mais caro mas mais preciso. K=50 → top 5. Faz diferença real em qualidade.' },
  { idx: 4, color: GRN,  title: 'Augment',   sub: 'build prompt',    body: 'Monta prompt: system + contexto recuperado + pergunta. Cuidado com lost in the middle e tokens.' },
  { idx: 5, color: RED,  title: 'LLM',       sub: 'resposta',        body: 'Geração final com citation. Considere streaming, fallback se nada relevante, e logging pra avaliação.' },
]

function RagPipelineVisual() {
  const [ragActive, setRagActive] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ padding: '8px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, textAlign: 'center' }}>
        Indexação offline: Docs {'→'} chunks {'→'} embed {'→'} indexa no Vector DB (mesmo modelo!)
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {RAG_STAGES.map((stage, i) => (
          <div key={stage.idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setRagActive(ragActive === stage.idx ? null : stage.idx)}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: `2px solid ${ragActive === stage.idx ? stage.color : LINE}`,
                background: ragActive === stage.idx ? `${stage.color}20` : CARD,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'center',
                minWidth: 90,
                transition: 'all .2s',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: ragActive === stage.idx ? stage.color : FG, marginBottom: 4 }}>{stage.title}</div>
              <div style={{ fontSize: 10, color: FGMUTE, fontFamily: 'JetBrains Mono, monospace' }}>{stage.sub}</div>
            </button>
            {i < RAG_STAGES.length - 1 && (
              <div style={{ fontSize: 16, color: FGMUTE, flexShrink: 0 }}>{'→'}</div>
            )}
          </div>
        ))}
      </div>

      {ragActive !== null && (
        <div style={{
          padding: '14px 18px',
          borderRadius: 10,
          background: `${RAG_STAGES[ragActive].color}12`,
          border: `2px solid ${RAG_STAGES[ragActive].color}40`,
          fontSize: 13,
          color: FG,
          lineHeight: 1.7,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: RAG_STAGES[ragActive].color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {RAG_STAGES[ragActive].title}
          </div>
          {RAG_STAGES[ragActive].body}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {RAG_STAGES.map(stage => (
          <button
            key={stage.idx}
            onClick={() => setRagActive(ragActive === stage.idx ? null : stage.idx)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              border: `1.5px solid ${ragActive === stage.idx ? stage.color : LINE}`,
              background: ragActive === stage.idx ? `${stage.color}10` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all .15s',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: stage.color, marginTop: 6, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: stage.color }}>{stage.title}</span>
              <span style={{ fontSize: 11, color: FGMUTE, marginLeft: 8, fontFamily: 'JetBrains Mono, monospace' }}>{stage.sub}</span>
              {ragActive === stage.idx && (
                <div style={{ fontSize: 12, color: FG, marginTop: 6, lineHeight: 1.6 }}>{stage.body}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function RagIndexingVisual() {
  const steps = [
    { label: 'Documents', sub: 'PDFs, markdown, HTML...', color: AMB },
    { label: 'Chunking', sub: 'split por tokens/parágrafos', color: SKY },
    { label: 'Embedding Model', sub: 'text-embedding-3-large', color: C },
    { label: 'Vector DB', sub: 'indexed & ready', color: GRN },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 13, color: FGMUTE, textAlign: 'center' }}>
        Pipeline de indexação offline — roda uma vez (ou incrementalmente) antes do RAG servir queries
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {steps.map((step, i) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: '16px 20px',
              borderRadius: 10,
              background: `${step.color}15`,
              border: `2px solid ${step.color}50`,
              textAlign: 'center',
              minWidth: 120,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: step.color, marginBottom: 4 }}>{step.label}</div>
              <div style={{ fontSize: 10, color: FGMUTE }}>{step.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ fontSize: 20, color: FGMUTE }}>{'→'}</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 16px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 12, color: FGMUTE, lineHeight: 1.7 }}>
        <strong style={{ color: FG }}>Atenção crítica:</strong> o modelo de embedding usado na indexação offline deve ser <strong style={{ color: C }}>exatamente o mesmo</strong> usado online para embedar a query do usuário. Trocar de modelo invalida todo o índice.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { title: 'Chunk size', body: 'Chunks menores = mais precisão na recuperação mas mais tokens. Chunks maiores = mais contexto mas menos precisão. 512–1024 tokens é ponto de partida comum.', color: SKY },
          { title: 'Overlap', body: 'Overlap entre chunks evita cortar contexto no meio. 10–20% de overlap é padrão. Importante para documentos com fluxo contínuo de raciocínio.', color: AMB },
          { title: 'Metadata', body: 'Armazene metadata junto com o vetor: source, page, section, date. Permite filtros híbridos (vetor + metadata) para retrieval mais preciso.', color: C },
          { title: 'Reindexação', body: 'Documentos atualizados precisam ser reindexados. Estratégias: full rebuild (simples), incremental por doc_id (eficiente), streaming (Kafka + pipeline).', color: GRN },
        ].map(item => (
          <div key={item.title} style={{ padding: '12px 14px', borderRadius: 8, background: CARD, border: `1px solid ${item.color}30` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>{item.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RagVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'rag-pipeline',
      title: 'RAG Pipeline',
      subtitle: 'Query → Embed → Vector DB → Rerank → Augment → LLM',
      accent: C,
      component: <RagPipelineVisual />,
    },
    {
      id: 'rag-indexing',
      title: 'Pipeline de Indexação Offline',
      subtitle: 'Documents → Chunking → Embedding → Vector DB — como o conhecimento entra no RAG',
      accent: AMB,
      component: <RagIndexingVisual />,
    },
  ]

  void BG; void LINE; void FG

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
