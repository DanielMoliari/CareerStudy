'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta RAG ────────────────────────────────────────────────────────────────
const C      = '#a855f7'   // roxo indigo — identidade RAG/AI
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const IND    = '#6366f1'

// ─────────────────────────────────────────────────────────────────────────────
// Visual 1: Pipeline RAG Interativo
// ─────────────────────────────────────────────────────────────────────────────

const RAG_STAGES = [
  { idx: 0, color: RED,  title: 'Query',     sub: '"como voar?"',    body: 'Pergunta do usuário chega em texto natural. Pode ser reescrita (HyDE, query expansion) antes de seguir para embedding.' },
  { idx: 1, color: SKY,  title: 'Embed',     sub: '[0.21, -0.4...]', body: 'Modelo de embedding transforma texto em vetor de 768/1536/3072 dimensões. Deve ser o mesmo modelo usado offline para indexar — misturar modelos quebra tudo.' },
  { idx: 2, color: C,    title: 'Vector DB',  sub: 'top-K kNN',       body: 'Busca top-K vetores mais próximos por cosine similarity. ANN (HNSW, IVF) troca precisão por latência sub-100ms. Candidatos: pgvector, Qdrant, Pinecone.' },
  { idx: 3, color: AMB,  title: 'Rerank',    sub: 'cross-encoder',   body: 'Cross-encoder lê query+doc juntos (mais preciso). K=50 → top 5. Cohere Rerank ou bge-reranker. Faz diferença real em qualidade sem custo proibitivo.' },
  { idx: 4, color: IND,  title: 'Augment',   sub: 'build prompt',    body: 'Monta prompt: system + contexto recuperado + pergunta. Cuidado com "Lost in the Middle" — chunks mais relevantes no início e no fim do contexto.' },
  { idx: 5, color: GRN,  title: 'LLM',       sub: 'resposta',        body: 'Geração final com instrução "Responda APENAS com base no contexto". Inclua citações de fonte. Streaming para boa UX. Faithfulness baixo = alucinação.' },
]

function RagPipelineVisual() {
  const [ragActive, setRagActive] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ padding: '8px 14px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, textAlign: 'center' }}>
        Indexação offline: Docs {'→'} chunks {'→'} embed {'→'} indexa no Vector DB (mesmo modelo que a query usa!)
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

// ─────────────────────────────────────────────────────────────────────────────
// Visual 2: Pipeline de Indexação Offline
// ─────────────────────────────────────────────────────────────────────────────

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
          { title: 'Chunk size', body: 'Chunks menores = mais precisão na recuperação mas menos contexto. Chunks maiores = mais contexto mas menos precisão. 512–1024 tokens é ponto de partida comum.', color: SKY },
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

// ─────────────────────────────────────────────────────────────────────────────
// Visual 3: RAG vs Fine-tuning — ComparisonTable
// ─────────────────────────────────────────────────────────────────────────────

const RAG_FT_OPTIONS: ComparisonOption[] = [
  { id: 'rag',  label: 'RAG',          sublabel: 'Retrieval-Augmented Generation', color: C },
  { id: 'ft',   label: 'Fine-tuning',  sublabel: 'Treinamento adicional no modelo', color: AMB },
  { id: 'both', label: 'RAG + FT',     sublabel: 'Combinação ideal em produção',    color: GRN },
]

const RAG_FT_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'dados-dinamicos',
    label: 'Dados que mudam frequentemente',
    description: 'Catálogo, preços, docs internos atualizados toda semana',
    values: {
      rag:  { rating: 'excellent', note: 'Reindexar é rápido, sem re-treinar' },
      ft:   { rating: 'poor',     note: 'Re-treinar a cada mudança é caro' },
      both: { rating: 'excellent', note: 'RAG cuida dos dados dinâmicos' },
    },
  },
  {
    id: 'citacao-fonte',
    label: 'Citar fontes das respostas',
    description: 'Auditabilidade e grounding em documentos reais',
    values: {
      rag:  { rating: 'excellent', note: 'Metadata de cada chunk = fonte auditável' },
      ft:   { rating: 'poor',     note: 'Modelo "aprende" mas não cita' },
      both: { rating: 'excellent', note: 'RAG fornece grounding e citação' },
    },
  },
  {
    id: 'estilo-formato',
    label: 'Formato e estilo de resposta específico',
    description: 'Tom, terminologia interna, estrutura de output',
    values: {
      rag:  { rating: 'fair',     note: 'Depende do prompt; limitado' },
      ft:   { rating: 'excellent', note: 'O modelo internaliza o estilo' },
      both: { rating: 'excellent', note: 'FT fixa o estilo, RAG fixa os fatos' },
    },
  },
  {
    id: 'latencia',
    label: 'Latência por request',
    description: 'Tempo de resposta em produção',
    values: {
      rag:  { rating: 'fair',     note: 'Embedding + busca + rerank + LLM' },
      ft:   { rating: 'excellent', note: 'Só a inferência do modelo ajustado' },
      both: { rating: 'fair',     note: 'RAG adiciona latência inevitavelmente' },
    },
  },
  {
    id: 'custo-implantacao',
    label: 'Custo e complexidade de implantação',
    description: 'Infra, GPU, tempo de equipe',
    values: {
      rag:  { rating: 'good',     note: 'Vector DB + API do LLM' },
      ft:   { rating: 'poor',     note: 'GPU, dataset, ciclo de treinamento' },
      both: { rating: 'fair',     note: 'Mais complexo mas amortiza bem' },
    },
  },
  {
    id: 'privacidade',
    label: 'Dados privados / confidenciais',
    description: 'Nunca podem sair da empresa',
    values: {
      rag:  { rating: 'good',     note: 'VPC + vector DB self-hosted' },
      ft:   { rating: 'excellent', note: 'Modelo pode rodar on-premise' },
      both: { rating: 'good',     note: 'Depende do deployment' },
    },
  },
  {
    id: 'alucinacao',
    label: 'Controle de alucinação',
    description: 'Respostas fundamentadas em fatos reais',
    values: {
      rag:  { rating: 'excellent', note: 'Grounded no contexto injetado' },
      ft:   { rating: 'fair',     note: 'Modelo ainda pode alucinar' },
      both: { rating: 'excellent', note: 'RAG é o anchor anti-alucinação' },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Visual 4: Decision Tree — "Qual abordagem usar?"
// ─────────────────────────────────────────────────────────────────────────────

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'Os dados mudam com frequência (semanal ou mais)?',
  children: [
    { label: 'Sim', nodeId: 'dados-dinamicos', color: GRN },
    { label: 'Não', nodeId: 'dados-estaticos' },
  ],
}

const DT_NODES: Record<string, DTNode> = {
  'dados-dinamicos': {
    id: 'dados-dinamicos',
    question: 'Precisa citar a fonte de cada resposta?',
    children: [
      { label: 'Sim', nodeId: 'rag-puro', color: C },
      { label: 'Não', nodeId: 'rag-ou-ambos' },
    ],
  },
  'dados-estaticos': {
    id: 'dados-estaticos',
    question: 'O modelo precisa mudar estilo, tom ou terminologia interna?',
    children: [
      { label: 'Sim', nodeId: 'ft-ou-ambos', color: AMB },
      { label: 'Não', nodeId: 'volume-docs' },
    ],
  },
  'rag-puro': {
    id: 'rag-puro',
    recommendation: 'RAG',
    detail: 'RAG puro é a escolha certa. Dados dinâmicos + auditabilidade = RAG com metadata de fonte. Comece com pgvector + hybrid search (dense + BM25). Meça com RAGAS antes de complicar.',
    color: C,
    icon: '🔍',
  },
  'rag-ou-ambos': {
    id: 'rag-ou-ambos',
    question: 'Volume de documentos ultrapassa a context window do LLM?',
    children: [
      { label: 'Sim', nodeId: 'rag-recomendado', color: C },
      { label: 'Não', nodeId: 'considere-context' },
    ],
  },
  'ft-ou-ambos': {
    id: 'ft-ou-ambos',
    question: 'O knowledge base tem mais de 10k documentos?',
    children: [
      { label: 'Sim', nodeId: 'ambos', color: GRN },
      { label: 'Não', nodeId: 'ft-puro', color: AMB },
    ],
  },
  'volume-docs': {
    id: 'volume-docs',
    question: 'Volume de documentos ultrapassa a context window?',
    children: [
      { label: 'Sim', nodeId: 'rag-recomendado', color: C },
      { label: 'Não (poucos docs)', nodeId: 'long-context', color: SKY },
    ],
  },
  'rag-recomendado': {
    id: 'rag-recomendado',
    recommendation: 'RAG',
    detail: 'RAG é obrigatório quando o knowledge base não cabe no contexto. Implemente com hybrid search (dense + BM25) e reranking. Avalie com RAGAS para identificar gargalos.',
    color: C,
    icon: '🔍',
  },
  'considere-context': {
    id: 'considere-context',
    recommendation: 'RAG ou Long-Context',
    detail: 'Para poucos documentos dinâmicos, avalie long-context (Claude 200k) sem RAG — simpler. Para volumes maiores, RAG com indexação incremental.',
    color: SKY,
    icon: '⚖️',
  },
  'ambos': {
    id: 'ambos',
    recommendation: 'RAG + Fine-tuning',
    detail: 'A combinação ideal: fine-tune para estilo, tom e terminologia interna; RAG para recuperar fatos específicos. Fine-tune primeiro (mais rápido de validar), adicione RAG depois.',
    color: GRN,
    icon: '🚀',
  },
  'ft-puro': {
    id: 'ft-puro',
    recommendation: 'Fine-tuning',
    detail: 'Dados estáveis + volume pequeno + necessidade de estilo específico = fine-tuning. Construa dataset de alta qualidade (RLHF ou DPO). Avalie com held-out set antes de produção.',
    color: AMB,
    icon: '🎯',
  },
  'long-context': {
    id: 'long-context',
    recommendation: 'Long-Context direto no prompt',
    detail: 'Se você tem menos de 50 documentos pequenos e estáveis, colocar tudo no contexto pode ser mais simples que RAG. Claude 200k ou GPT-4 128k. Monitore custo por token.',
    color: SKY,
    icon: '📄',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 5: RAGAS Métricas — diagnóstico interativo
// ─────────────────────────────────────────────────────────────────────────────

const RAGAS_METRICS = [
  {
    key: 'faithfulness',
    label: 'Faithfulness',
    score: 0.72,
    threshold: 0.80,
    color: AMB,
    description: 'Claims da resposta estão apoiados no contexto recuperado?',
    baixo: 'Alucinação. O modelo mistura conhecimento paramétrico com o contexto. Solução: instrução explícita "Responda APENAS com base no contexto abaixo. Se não souber, diga \'não tenho informação sobre isso\'."',
    alto: 'Respostas grounded. O modelo cita informações presentes nos chunks recuperados.',
    exemplo: 'Ruim: LLM responde com dado que não está em nenhum chunk. Bom: toda claim é rastreável a um chunk específico.',
  },
  {
    key: 'answer-relevancy',
    label: 'Answer Relevancy',
    score: 0.91,
    threshold: 0.80,
    color: GRN,
    description: 'A resposta gerada é sobre a pergunta do usuário?',
    baixo: 'Resposta off-topic. O contexto pode estar relevante mas o LLM deriva. Revise o prompt de instrução.',
    alto: 'Resposta focada. O LLM usa o contexto para responder exatamente o que foi perguntado.',
    exemplo: 'Ruim: pergunta sobre preço, LLM explica características. Bom: pergunta sobre preço, resposta dá o preço.',
  },
  {
    key: 'context-precision',
    label: 'Context Precision',
    score: 0.65,
    threshold: 0.75,
    color: RED,
    description: 'Dos chunks no top-K, quantos são realmente relevantes?',
    baixo: 'Retrieval com muito ruído. Os top-5 chunks incluem docs irrelevantes. Adicione reranking (cross-encoder) ou melhore a estratégia de retrieval (hybrid search).',
    alto: 'Retrieval preciso. A maioria dos chunks no contexto contribui para a resposta.',
    exemplo: 'Ruim: top-5 contém 3 chunks sem relação com a query. Bom: todos os 5 chunks têm informação útil.',
  },
  {
    key: 'context-recall',
    label: 'Context Recall',
    score: 0.58,
    threshold: 0.75,
    color: RED,
    description: 'Recuperou todos os chunks necessários para responder? (requer ground truth)',
    baixo: 'Retrieval perdendo docs importantes. Chunks relevantes não estão sendo encontrados. Causas: chunking cortando info, embedding ruim, busca só densa sem BM25.',
    alto: 'Retrieval completo. O contexto contém tudo que é necessário para responder.',
    exemplo: 'Ruim: resposta correta requer doc X, mas X não foi recuperado. Bom: todos os docs da ground truth estão no top-K.',
  },
]

function RagMetricsVisual() {
  const [selected, setSelected] = useState<string | null>('context-precision')

  const active = RAGAS_METRICS.find(m => m.key === selected) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        RAGAS — 4 métricas para diagnóstico sistemático do pipeline RAG. Clique para ver diagnóstico e solução.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {RAGAS_METRICS.map(m => {
          const pct = Math.round(m.score * 100)
          const isOk = m.score >= m.threshold
          const isActive = selected === m.key
          return (
            <button
              key={m.key}
              onClick={() => setSelected(isActive ? null : m.key)}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                border: `2px solid ${isActive ? m.color : isOk ? `${m.color}40` : `${RED}40`}`,
                background: isActive ? `${m.color}15` : CARD,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'all .2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.label}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: isOk ? GRN : RED }}>{pct}%</span>
              </div>
              <div style={{ background: LINE, borderRadius: 4, height: 6, marginBottom: 8 }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 4,
                  background: isOk ? GRN : RED,
                  transition: 'width .4s',
                }} />
              </div>
              <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.5 }}>{m.description}</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                  background: isOk ? `${GRN}20` : `${RED}20`,
                  color: isOk ? GRN : RED,
                }}>
                  {isOk ? 'OK' : `Meta: ${Math.round(m.threshold * 100)}%`}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {active && (
        <div style={{
          padding: '16px 18px',
          borderRadius: 10,
          background: `${active.color}10`,
          border: `2px solid ${active.color}40`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: active.color }}>{active.label} — Diagnóstico</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: '10px 12px', borderRadius: 8, background: `${RED}15`, border: `1px solid ${RED}30` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: RED, marginBottom: 4 }}>SCORE BAIXO ({`<`}{Math.round(active.threshold * 100)}%) — CAUSA E SOLUÇÃO</div>
              <div style={{ fontSize: 11, color: FG, lineHeight: 1.6 }}>{active.baixo}</div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 8, background: `${GRN}15`, border: `1px solid ${GRN}30` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: GRN, marginBottom: 4 }}>SCORE ALTO — O QUE SIGNIFICA</div>
              <div style={{ fontSize: 11, color: FG, lineHeight: 1.6 }}>{active.alto}</div>
            </div>
          </div>
          <div style={{ padding: '8px 12px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
            <strong style={{ color: FG }}>Exemplo: </strong>{active.exemplo}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export default function RagVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'rag-pipeline',
      title: 'RAG Pipeline',
      subtitle: 'Query → Embed → Vector DB → Rerank → Augment → LLM — clique em cada etapa para ver detalhes',
      accent: C,
      component: <RagPipelineVisual />,
    },
    {
      id: 'rag-indexing',
      title: 'Pipeline de Indexação',
      subtitle: 'Documents → Chunking → Embedding → Vector DB — como o conhecimento entra no RAG',
      accent: AMB,
      component: <RagIndexingVisual />,
    },
    {
      id: 'rag-vs-ft',
      title: 'RAG vs Fine-tuning',
      subtitle: 'Comparação multidimensional: quando usar cada abordagem e a combinação ideal',
      accent: IND,
      component: (
        <ComparisonTable
          options={RAG_FT_OPTIONS}
          criteria={RAG_FT_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'rag-decision',
      title: 'Qual Abordagem Usar?',
      subtitle: 'Árvore de decisão: RAG puro, Fine-tuning, RAG + FT ou Long-Context',
      accent: GRN,
      component: (
        <DecisionTree
          root={DT_ROOT}
          nodes={DT_NODES}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'rag-metrics',
      title: 'RAGAS — Diagnóstico de Qualidade',
      subtitle: 'As 4 métricas essenciais: o que cada uma indica e como corrigir score baixo',
      accent: AMB,
      component: <RagMetricsVisual />,
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
