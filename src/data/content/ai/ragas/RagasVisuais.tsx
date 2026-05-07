'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'

// ── Paleta RAGAS ──────────────────────────────────────────────────────────────
const C      = '#06b6d4'   // cyan — identidade RAGAS/eval
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const IND    = '#6366f1'
const VIO    = '#a855f7'

// ─────────────────────────────────────────────────────────────────────────────
// Visual 1: RAGAS Métricas — diagnóstico interativo
// ─────────────────────────────────────────────────────────────────────────────

const METRICS = [
  {
    key: 'faithfulness',
    label: 'Faithfulness',
    abbr: 'F',
    score: 0.61,
    threshold: 0.80,
    color: RED,
    description: 'Claims da resposta estão apoiadas no contexto recuperado?',
    mechanism: 'LLM-judge decompõe a resposta em N claims atômicas e verifica cada uma contra os chunks.',
    baixo: 'Alucinação. O modelo mistura conhecimento paramétrico com o contexto. Fix: adicione instrução "Responda APENAS com base no contexto abaixo. Se não souber, diga que não tem informação."',
    alto: 'Respostas grounded. Todas as claims são rastreáveis ao contexto recuperado.',
    componente: 'Prompt de instrução',
  },
  {
    key: 'answer-relevancy',
    label: 'Answer Relevancy',
    abbr: 'A',
    score: 0.88,
    threshold: 0.80,
    color: GRN,
    description: 'A resposta gerada é sobre a pergunta do usuário?',
    mechanism: 'Gera M perguntas reversas a partir da resposta e mede similaridade semântica com a pergunta original.',
    baixo: 'Resposta off-topic. O LLM usa o contexto mas deriva para outro assunto. Revise a instrução e filtre contexto.',
    alto: 'Resposta focada. O LLM usa o contexto para responder exatamente o que foi perguntado.',
    componente: 'Prompt de instrução',
  },
  {
    key: 'context-precision',
    label: 'Context Precision',
    abbr: 'C',
    score: 0.65,
    threshold: 0.75,
    color: AMB,
    description: 'Dos chunks no top-K, quantos são realmente relevantes para a pergunta?',
    mechanism: 'LLM-judge classifica cada chunk como relevante ou não. Score é precisão ponderada pela posição.',
    baixo: 'Retrieval com ruído. Os top-K incluem docs irrelevantes que confundem o modelo. Fix: cross-encoder reranking.',
    alto: 'Retrieval preciso. A maioria dos chunks no contexto contribui para a resposta.',
    componente: 'Retrieval / Reranking',
  },
  {
    key: 'context-recall',
    label: 'Context Recall',
    abbr: 'R',
    score: 0.52,
    threshold: 0.75,
    color: IND,
    description: 'Recuperou todos os chunks necessários para responder? (requer ground truth anotado)',
    mechanism: 'Usa NLI para verificar se o ground truth pode ser gerado a partir do contexto recuperado.',
    baixo: 'Retrieval perdendo docs importantes. Fix: hybrid search (dense + BM25), revise chunk size e overlap.',
    alto: 'Retrieval completo. O contexto contém tudo necessário para a resposta correta.',
    componente: 'Chunking / Retrieval',
  },
]

function MetricsDiagnostic() {
  const [selected, setSelected] = useState<string>('faithfulness')

  const active = METRICS.find(m => m.key === selected) ?? METRICS[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        RAGAS — 4 métricas para diagnóstico sistemático. Clique em cada uma para ver mecanismo e diagnóstico.
      </div>

      {/* FARC pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        {METRICS.map(m => {
          const pct = Math.round(m.score * 100)
          const isOk = m.score >= m.threshold
          const isActive = selected === m.key
          return (
            <button
              key={m.key}
              onClick={() => setSelected(m.key)}
              style={{
                padding: '14px 18px',
                borderRadius: 10,
                border: `2px solid ${isActive ? m.color : isOk ? `${m.color}40` : `${RED}40`}`,
                background: isActive ? `${m.color}18` : CARD,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'all .2s',
                minWidth: 160,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: m.color }}>{m.label}</span>
                <span style={{
                  fontSize: 15, fontWeight: 800,
                  color: isOk ? GRN : RED,
                }}>{pct}%</span>
              </div>
              <div style={{ background: LINE, borderRadius: 4, height: 5, marginBottom: 8 }}>
                <div style={{
                  width: `${pct}%`, height: '100%', borderRadius: 4,
                  background: isOk ? GRN : RED,
                  transition: 'width .4s',
                }} />
              </div>
              <div style={{ fontSize: 10, color: FGMUTE, lineHeight: 1.4 }}>{m.description}</div>
              <div style={{ marginTop: 6 }}>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
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

      {/* Detail panel */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 10,
        background: `${active.color}10`,
        border: `2px solid ${active.color}40`,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `${active.color}20`,
            border: `1.5px solid ${active.color}60`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: active.color, flexShrink: 0,
          }}>{active.abbr}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: active.color }}>{active.label}</div>
            <div style={{ fontSize: 11, color: FGMUTE }}>
              Componente afetado: <strong style={{ color: FG }}>{active.componente}</strong>
            </div>
          </div>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}`, fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
          <strong style={{ color: FG }}>Mecanismo: </strong>{active.mechanism}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: `${RED}15`, border: `1px solid ${RED}30` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: RED, marginBottom: 4 }}>SCORE BAIXO — CAUSA E FIX</div>
            <div style={{ fontSize: 11, color: FG, lineHeight: 1.6 }}>{active.baixo}</div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 8, background: `${GRN}15`, border: `1px solid ${GRN}30` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: GRN, marginBottom: 4 }}>SCORE ALTO — SIGNIFICA</div>
            <div style={{ fontSize: 11, color: FG, lineHeight: 1.6 }}>{active.alto}</div>
          </div>
        </div>
      </div>

      {/* FARC legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {METRICS.map(m => (
          <div key={m.key} style={{
            padding: '6px 14px', borderRadius: 8, background: CARD,
            border: `1px solid ${LINE}`, textAlign: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.abbr}</div>
            <div style={{ fontSize: 9, color: FGMUTE, marginTop: 2 }}>{m.label.split(' ')[0]}</div>
          </div>
        ))}
        <div style={{
          padding: '6px 14px', borderRadius: 8, background: CARD,
          border: `1px solid ${LINE}`, textAlign: 'center', display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C }}>= FARC</div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 2: Pipeline de avaliação RAGAS
// ─────────────────────────────────────────────────────────────────────────────

function EvalPipeline() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const steps = [
    {
      title: 'Eval Set',
      sub: '50–200 Q&As',
      color: VIO,
      detail: 'Conjunto de perguntas representativas do domínio, versionado em Git LFS ou S3. Inclui perguntas simples, de raciocínio, multi-documento e edge cases (sem resposta no corpus, ambíguas).',
    },
    {
      title: 'RAG Pipeline',
      sub: 'Retrieval + Geração',
      color: C,
      detail: 'O pipeline real processa cada pergunta do eval set: embeda a query, recupera top-K chunks, (opcionalmente) reranqueia, monta o prompt e gera a resposta com o LLM.',
    },
    {
      title: 'LLM Judge',
      sub: 'Haiku / 4o-mini',
      color: AMB,
      detail: 'Modelo diferente do que gerou as respostas (evitar viés). Avalia cada tripla (question, answer, contexts) com 5–15 chamadas por exemplo. Use modelo barato para volume.',
    },
    {
      title: 'Scores FARC',
      sub: '0–1 por exemplo',
      color: GRN,
      detail: 'RAGAS retorna scores individuais por exemplo e agregados. Exporta Dataset HuggingFace compatível. Analise distribuição, não só média — um score baixo pode estar concentrado em um tipo de pergunta.',
    },
    {
      title: 'Gate CI/CD',
      sub: 'Threshold por métrica',
      color: RED,
      detail: 'Se qualquer métrica cai abaixo do threshold (ex: Faithfulness < 0.80), o PR é bloqueado automaticamente. Score postado como comentário no PR para análise do time.',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Pipeline de avaliação RAGAS — da pergunta ao gate de qualidade automático
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {steps.map((step, i) => (
          <div key={step.title} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              style={{
                padding: '12px 16px',
                borderRadius: 10,
                border: `2px solid ${activeStep === i ? step.color : LINE}`,
                background: activeStep === i ? `${step.color}18` : CARD,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'center',
                minWidth: 100,
                transition: 'all .2s',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: activeStep === i ? step.color : FG, marginBottom: 4 }}>{step.title}</div>
              <div style={{ fontSize: 10, color: FGMUTE, fontFamily: 'JetBrains Mono, monospace' }}>{step.sub}</div>
            </button>
            {i < steps.length - 1 && (
              <div style={{ fontSize: 18, color: FGMUTE, flexShrink: 0 }}>{'→'}</div>
            )}
          </div>
        ))}
      </div>

      {activeStep !== null && (
        <div style={{
          padding: '14px 18px', borderRadius: 10,
          background: `${steps[activeStep].color}12`,
          border: `2px solid ${steps[activeStep].color}40`,
          fontSize: 13, color: FG, lineHeight: 1.7,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: steps[activeStep].color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>
            {steps[activeStep].title}
          </div>
          {steps[activeStep].detail}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'Modelo de judge', val: 'Diferente do gerador', color: AMB },
          { label: 'Eval set mínimo', val: '50 Q&As para gate', color: C },
          { label: 'Frequência', val: 'A cada PR relevante', color: GRN },
        ].map(item => (
          <div key={item.label} style={{ padding: '10px 12px', borderRadius: 8, background: CARD, border: `1px solid ${LINE}` }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: FG }}>{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 3: Diagnóstico por combinação de métricas
// ─────────────────────────────────────────────────────────────────────────────

function DiagnosticMatrix() {
  const [hovered, setHovered] = useState<number | null>(null)

  const patterns = [
    {
      faith: 'low', prec: 'high', recall: 'high',
      label: 'Prompt fraco',
      detail: 'Contexto tem tudo que precisa, mas o LLM não está usando. Instrução de grounding ausente ou fraca. Fix: adicione "Responda APENAS com base no contexto".',
      color: RED,
    },
    {
      faith: 'low', prec: 'low', recall: 'high',
      label: 'Retrieval com ruído',
      detail: 'Chunks irrelevantes no top-K confundem o LLM, que acaba recorrendo ao conhecimento paramétrico. Fix: cross-encoder reranking.',
      color: AMB,
    },
    {
      faith: 'high', prec: 'low', recall: 'low',
      label: 'Retrieval crítico',
      detail: 'LLM segue o contexto (bom!) mas o contexto tem pouca informação relevante. Problema de retrieval severo. Fix: revise chunking e embedding.',
      color: RED,
    },
    {
      faith: 'high', prec: 'high', recall: 'low',
      label: 'Recall faltando',
      detail: 'O que é recuperado é relevante e o LLM usa bem, mas faltam docs. Fix: hybrid search (dense + BM25) ou chunk overlap maior.',
      color: IND,
    },
    {
      faith: 'low', prec: 'high', recall: 'low',
      label: 'Dual fix necessário',
      detail: 'Precisão razoável mas recall baixo e LLM não segue o contexto. Dois problemas simultâneos: prompt fraco + retrieval incompleto.',
      color: VIO,
    },
    {
      faith: 'high', prec: 'high', recall: 'high',
      label: 'Pipeline saudável',
      detail: 'Todas as métricas acima do threshold. Verifique Answer Relevancy e monitore latência. O pipeline está funcionando bem.',
      color: GRN,
    },
  ]

  const chip = (val: string) => (
    <span style={{
      display: 'inline-block', fontSize: 9, fontWeight: 700,
      padding: '2px 7px', borderRadius: 4,
      background: val === 'high' ? `${GRN}20` : `${RED}20`,
      color: val === 'high' ? GRN : RED,
    }}>
      {val === 'high' ? 'Alto' : 'Baixo'}
    </span>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 12, color: FGMUTE, textAlign: 'center' }}>
        Diagnóstico por combinação de métricas — cada padrão indica uma causa raiz diferente
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {patterns.map((p, i) => (
          <button
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setHovered(hovered === i ? null : i)}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 80px 80px 140px 1fr',
              gap: 10,
              alignItems: 'center',
              padding: '10px 14px',
              borderRadius: 8,
              border: `1.5px solid ${hovered === i ? p.color : LINE}`,
              background: hovered === i ? `${p.color}10` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all .15s',
            }}
          >
            <div>{chip(p.faith)}<div style={{ fontSize: 9, color: FGMUTE, marginTop: 2 }}>Faithfulness</div></div>
            <div>{chip(p.prec)}<div style={{ fontSize: 9, color: FGMUTE, marginTop: 2 }}>Precision</div></div>
            <div>{chip(p.recall)}<div style={{ fontSize: 9, color: FGMUTE, marginTop: 2 }}>Recall</div></div>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.color }}>→ {p.label}</div>
            {hovered === i && (
              <div style={{ fontSize: 11, color: FG, lineHeight: 1.5 }}>{p.detail}</div>
            )}
            {hovered !== i && (
              <div style={{ fontSize: 11, color: FGMUTE }}>Clique para ver o fix</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 4: RAGAS vs Alternativas — ComparisonTable
// ─────────────────────────────────────────────────────────────────────────────

const EVAL_OPTIONS: ComparisonOption[] = [
  { id: 'ragas',   label: 'RAGAS',    sublabel: 'Métricas padronizadas + LLM-judge', color: C },
  { id: 'trulens', label: 'TruLens',  sublabel: 'Trace completo + observability',    color: VIO },
  { id: 'ares',    label: 'ARES',     sublabel: 'Classificadores fine-tuned (Stanford)', color: AMB },
]

const EVAL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'setup',
    label: 'Facilidade de setup',
    description: 'Tempo para ter avaliação funcionando do zero',
    values: {
      ragas:   { rating: 'excellent', note: 'pip install + 5 linhas de código' },
      trulens: { rating: 'good',      note: 'Mais configuração de feedback functions' },
      ares:    { rating: 'poor',      note: 'Requer fine-tuning do classificador' },
    },
  },
  {
    id: 'custo',
    label: 'Custo por avaliação',
    description: 'LLM calls por exemplo avaliado',
    values: {
      ragas:   { rating: 'fair',      note: '5–15 LLM calls por exemplo' },
      trulens: { rating: 'fair',      note: 'Similar ao RAGAS em LLM-based' },
      ares:    { rating: 'excellent', note: 'Classificador local, sem LLM calls por eval' },
    },
  },
  {
    id: 'observability',
    label: 'Observability do pipeline',
    description: 'Visibilidade de cada etapa durante a avaliação',
    values: {
      ragas:   { rating: 'fair',      note: 'Score final, sem trace detalhado' },
      trulens: { rating: 'excellent', note: 'Trace completo com reasoning do judge' },
      ares:    { rating: 'poor',      note: 'Score apenas, sem explicabilidade' },
    },
  },
  {
    id: 'integracao',
    label: 'Integração com frameworks RAG',
    description: 'LangChain, LlamaIndex, etc.',
    values: {
      ragas:   { rating: 'excellent', note: 'Integração nativa e documentada' },
      trulens: { rating: 'excellent', note: 'Integração com LangChain, LlamaIndex' },
      ares:    { rating: 'poor',      note: 'Integração manual necessária' },
    },
  },
  {
    id: 'dominio',
    label: 'Qualidade para domínios específicos',
    description: 'Precisão para domínios técnicos ou de nicho',
    values: {
      ragas:   { rating: 'good',      note: 'Bom, mas LLM-judge tem viés geral' },
      trulens: { rating: 'good',      note: 'Similar, depende do modelo de judge' },
      ares:    { rating: 'excellent', note: 'Fine-tuned no domínio = mais preciso' },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────────────────────

export default function RagasVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'metrics',
      title: 'Métricas FARC',
      subtitle: 'As 4 métricas core — mecanismo, diagnóstico e fix por score baixo — clique em cada uma',
      accent: C,
      component: <MetricsDiagnostic />,
    },
    {
      id: 'pipeline',
      title: 'Pipeline de Avaliação',
      subtitle: 'Eval Set → RAG → LLM Judge → Scores → Gate CI/CD — clique em cada etapa',
      accent: GRN,
      component: <EvalPipeline />,
    },
    {
      id: 'diagnostic',
      title: 'Diagnóstico por Combinação',
      subtitle: 'Cada padrão de métricas aponta para uma causa raiz diferente no pipeline',
      accent: AMB,
      component: <DiagnosticMatrix />,
    },
    {
      id: 'comparison',
      title: 'RAGAS vs Alternativas',
      subtitle: 'RAGAS vs TruLens vs ARES — quando usar cada framework de avaliação',
      accent: VIO,
      component: (
        <ComparisonTable
          options={EVAL_OPTIONS}
          criteria={EVAL_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
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
