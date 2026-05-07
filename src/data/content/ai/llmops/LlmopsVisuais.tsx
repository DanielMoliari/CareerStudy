'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta LLMOps ─────────────────────────────────────────────────────────────
const C      = '#f59e0b'   // amber — identidade LLMOps
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const IND    = '#6366f1'
const PRP    = '#a855f7'

// ─────────────────────────────────────────────────────────────────────────────
// Visual 1: Pipeline de Deploy de Prompt (interativo por fase)
// ─────────────────────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  {
    id: 0,
    color: SKY,
    icon: '📝',
    title: 'Prompt Registry',
    subtitle: 'v2.1.0 fixada',
    body: 'Prompts versionados como código. Cada deploy referencia uma versão exata (git tag ou LangSmith Hub). Rollback = trocar versão referenciada. Sem registry, rollback é impossível.',
    detail: 'Ferramentas: LangSmith Hub, PromptLayer, git + YAML. A versão do prompt deve ser logada em cada trace para rastreabilidade completa.',
  },
  {
    id: 1,
    color: C,
    icon: '🧪',
    title: 'CI Eval',
    subtitle: 'gate automático',
    body: 'Eval set roda em cada PR. Gate bloqueia merge se score cai abaixo do threshold (ex: faithfulness < 0.85). Sem gate, cada mudança de prompt é fé.',
    detail: 'Ferramentas: Promptfoo (YAML config), RAGAS, OpenAI Evals. O eval set deve ter exemplos golden (curados) + adversariais (bugs reais de produção).',
  },
  {
    id: 2,
    color: PRP,
    icon: '👁️',
    title: 'Shadow Deploy',
    subtitle: '100% paralelo',
    body: 'Novo prompt roda em paralelo ao antigo em 100% do tráfego. Outputs comparados sem impacto no usuário. Detecta divergências antes de qualquer rollout.',
    detail: 'O shadow deploy é a fase mais segura: zero risco de impacto. Ideal para validar que o novo prompt não alucina mais ou custa mais antes de expor a usuários reais.',
  },
  {
    id: 3,
    color: GRN,
    icon: '🐦',
    title: 'Canary 5%',
    subtitle: '24-48h observação',
    body: '5% do tráfego real vai para o novo prompt. Monitorar métricas por 24-48h: qualidade (eval amostral), custo (tokens), latência, feedback do usuário.',
    detail: 'Sticky assignment: mesmo usuário sempre vê o mesmo prompt (A ou B). Evita experiência incoerente. Rollback automático se qualidade cai > threshold definido.',
  },
  {
    id: 4,
    color: GRN,
    icon: '🚀',
    title: 'Rollout 100%',
    subtitle: 'ou rollback auto',
    body: 'Rollout gradual: 20% → 50% → 100%. Rollback automático se métricas caem. O rollback é instantâneo (troca versão no registry).',
    detail: 'Tempo total do pipeline: 2-5 dias para prompt crítico. Para prompts de baixo risco (UI copy), pode comprimir para horas. A velocidade é calibrada pelo risco da funcionalidade.',
  },
]

function DeployPipelineVisual() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '4px 0' }}>
      {/* Pipeline steps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => setActive(active === stage.id ? null : stage.id)}
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                border: `2px solid ${active === stage.id ? stage.color : LINE}`,
                background: active === stage.id ? `${stage.color}18` : CARD,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'center',
                minWidth: 110,
                transition: 'all .2s',
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 6 }}>{stage.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: active === stage.id ? stage.color : FG, marginBottom: 3 }}>
                {stage.title}
              </div>
              <div style={{ fontSize: 10, color: FGMUTE, fontFamily: 'JetBrains Mono, monospace' }}>
                {stage.subtitle}
              </div>
            </button>
            {i < PIPELINE_STAGES.length - 1 && (
              <div style={{ fontSize: 18, color: LINE, flexShrink: 0 }}>{'→'}</div>
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {active !== null && (() => {
        const stage = PIPELINE_STAGES[active]
        return (
          <div style={{
            padding: '18px 20px',
            borderRadius: 10,
            background: `${stage.color}10`,
            border: `2px solid ${stage.color}50`,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{stage.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{stage.title}</div>
                <div style={{ fontSize: 11, color: FGMUTE }}>{stage.subtitle}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: FG, lineHeight: 1.7 }}>{stage.body}</div>
            <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.6, borderTop: `1px solid ${LINE}`, paddingTop: 10 }}>
              {stage.detail}
            </div>
          </div>
        )
      })()}

      {/* Phase list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {PIPELINE_STAGES.map(stage => (
          <button
            key={stage.id}
            onClick={() => setActive(active === stage.id ? null : stage.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '9px 14px',
              borderRadius: 8,
              border: `1.5px solid ${active === stage.id ? stage.color : LINE}`,
              background: active === stage.id ? `${stage.color}10` : 'transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all .15s',
            }}
          >
            <span style={{ fontSize: 14 }}>{stage.icon}</span>
            <div style={{ fontSize: 11, fontWeight: 700, color: stage.color, minWidth: 110 }}>{stage.title}</div>
            <div style={{ fontSize: 11, color: FGMUTE, flex: 1 }}>{stage.body.slice(0, 80)}{'...'}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 2: Camadas de observabilidade (LayerStack)
// ─────────────────────────────────────────────────────────────────────────────

const OBS_LAYERS: Layer[] = [
  {
    id: 'negocio',
    label: 'Negócio',
    sublabel: 'O que o produto precisa',
    description: 'Taxa de aprovação, satisfação do usuário (thumbs up/down), task completion rate, churn da feature LLM. São as métricas que o PM e o CEO entendem.',
    code: 'approval_rate, user_satisfaction, task_completion',
    color: GRN,
    icon: '📊',
    examples: ['approval_rate > 85%', 'satisfaction_score > 4.2/5', 'task_completion > 70%'],
  },
  {
    id: 'qualidade',
    label: 'Qualidade',
    sublabel: 'A resposta é boa?',
    description: 'Faithfulness, relevancy, hallucination rate via RAGAS amostral (1-5% das requests). LLM-as-judge para escala. Citation accuracy quando RAG está envolvido.',
    code: 'faithfulness, relevancy, hallucination_rate',
    color: C,
    icon: '🎯',
    examples: ['faithfulness > 0.85', 'hallucination_rate < 2%', 'citation_accuracy > 90%'],
  },
  {
    id: 'sistema',
    label: 'Sistema',
    sublabel: 'Como o sistema se comporta',
    description: 'Latência p50/p95/p99, tokens consumidos (in/out), custo por request em USD, cache hit rate, throughput (requests/min).',
    code: 'latency_p99, tokens_total, cost_usd, cache_hit_rate',
    color: SKY,
    icon: '⚙️',
    examples: ['p99 < 5s', 'cost_per_req < $0.01', 'cache_hit > 30%'],
  },
  {
    id: 'falhas',
    label: 'Falhas',
    sublabel: 'O que quebrou',
    description: 'Rate limit errors (429), timeouts, schema validation failures, refusals (LLM recusou responder), provider 5xx errors.',
    code: 'rate_limit_errors, timeouts, schema_invalid, refusals',
    color: RED,
    icon: '🚨',
    examples: ['rate_limit_rate < 0.1%', 'timeout_rate < 0.5%', 'refusal_rate < 1%'],
  },
  {
    id: 'drift',
    label: 'Drift',
    sublabel: 'Mudou sem você perceber',
    description: 'Distribuição de inputs mudou (embedding drift), qualidade das respostas degradou (eval score semanal vs baseline), provider fez update silencioso.',
    code: 'embedding_drift, weekly_eval_score, input_distribution',
    color: PRP,
    icon: '📉',
    examples: ['eval_score delta < -5%', 'embedding_drift < threshold', 'eval semanal automatizado'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Visual 3: Ferramentas de Observabilidade — ComparisonTable
// ─────────────────────────────────────────────────────────────────────────────

const OBS_OPTIONS: ComparisonOption[] = [
  { id: 'langsmith', label: 'LangSmith', color: C },
  { id: 'langfuse', label: 'Langfuse', color: GRN },
  { id: 'helicone', label: 'Helicone', color: SKY },
  { id: 'phoenix', label: 'Phoenix (Arize)', color: PRP },
]

const OBS_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'setup',
    label: 'Facilidade de Setup',
    values: {
      langsmith: { rating: 'good', note: 'SaaS, SDK integrado ao LangChain' },
      langfuse: { rating: 'good', note: 'SaaS ou self-hosted Docker' },
      helicone: { rating: 'excellent', note: 'Drop-in proxy, zero SDK' },
      phoenix: { rating: 'fair', note: 'Requer configuração OTLP' },
    },
  },
  {
    id: 'selfhost',
    label: 'Self-hosted',
    values: {
      langsmith: { rating: 'fair', note: 'Enterprise plan (pago)' },
      langfuse: { rating: 'excellent', note: 'Open-source, Docker Compose' },
      helicone: { rating: 'fair', note: 'Enterprise apenas' },
      phoenix: { rating: 'excellent', note: 'Open-source, pip install' },
    },
  },
  {
    id: 'eval',
    label: 'Eval & Datasets',
    values: {
      langsmith: { rating: 'excellent', note: 'Dataset hub, playground, evaluators' },
      langfuse: { rating: 'good', note: 'Datasets e scores via API' },
      helicone: { rating: 'poor', note: 'Foco em métricas, não em eval' },
      phoenix: { rating: 'good', note: 'Trace-level evals, LLM-as-judge' },
    },
  },
  {
    id: 'cost',
    label: 'Monitoramento de Custo',
    values: {
      langsmith: { rating: 'good', note: 'Por run, por projeto' },
      langfuse: { rating: 'excellent', note: 'Por usuário/sessão/tenant granular' },
      helicone: { rating: 'excellent', note: 'Cost tracking primeiro-classe' },
      phoenix: { rating: 'fair', note: 'Via métricas OTLP' },
    },
  },
  {
    id: 'provider',
    label: 'Provider agnóstico',
    values: {
      langsmith: { rating: 'good', note: 'LangChain nativo, outros via OTLP' },
      langfuse: { rating: 'excellent', note: 'Qualquer provider, OTLP' },
      helicone: { rating: 'excellent', note: 'Proxy universal' },
      phoenix: { rating: 'excellent', note: 'OTLP, provider-agnóstico' },
    },
  },
  {
    id: 'preco',
    label: 'Preço (free tier)',
    values: {
      langsmith: { rating: 'good', note: '5K traces/mês grátis' },
      langfuse: { rating: 'excellent', note: 'Self-host gratuito, cloud free tier' },
      helicone: { rating: 'good', note: '100K requests/mês grátis' },
      phoenix: { rating: 'excellent', note: 'Open-source, sem limite local' },
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Visual 4: Árvore de decisão — Qual ferramenta de LLMOps usar?
// ─────────────────────────────────────────────────────────────────────────────

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'Qual é a prioridade principal do seu sistema LLMOps?',
  children: [
    { label: 'Observabilidade e traces', nodeId: 'obs', color: C },
    { label: 'Eval e qualidade de prompts', nodeId: 'eval', color: GRN },
    { label: 'Custo e otimização', nodeId: 'cost', color: SKY },
    { label: 'Resiliência e fallback', nodeId: 'resilience', color: PRP },
  ],
}

const DT_NODES: Record<string, DTNode> = {
  obs: {
    id: 'obs',
    question: 'Você precisa de self-hosted (LGPD/GDPR)?',
    children: [
      { label: 'Sim, dados sensíveis', nodeId: 'obs-selfhost', color: RED },
      { label: 'Não, SaaS ok', nodeId: 'obs-saas', color: GRN },
    ],
  },
  eval: {
    id: 'eval',
    question: 'Seu stack usa LangChain?',
    children: [
      { label: 'Sim', nodeId: 'eval-lc', color: C },
      { label: 'Não (OpenAI SDK, custom)', nodeId: 'eval-custom', color: SKY },
    ],
  },
  cost: {
    id: 'cost',
    question: 'Você tem multi-tenant (SaaS)?',
    children: [
      { label: 'Sim', nodeId: 'cost-multitenant', color: C },
      { label: 'Não', nodeId: 'cost-simple', color: GRN },
    ],
  },
  resilience: {
    id: 'resilience',
    recommendation: 'LiteLLM Router',
    detail: 'LiteLLM é a escolha universal para fallback multi-provider. Suporta 100+ providers, normaliza response format, tem circuit breaker e load balancing nativo.',
    color: PRP,
    icon: '⚡',
  },
  'obs-selfhost': {
    id: 'obs-selfhost',
    recommendation: 'Langfuse Self-hosted',
    detail: 'Langfuse open-source roda via Docker Compose. OTLP-compatível, custo por tenant granular, sem dados saindo da sua infra. Ideal para compliance LGPD/GDPR.',
    color: GRN,
    icon: '🏠',
  },
  'obs-saas': {
    id: 'obs-saas',
    recommendation: 'LangSmith ou Langfuse Cloud',
    detail: 'LangSmith se você usa LangChain (integração nativa, prompt hub). Langfuse Cloud se quer provider-agnóstico com free tier generoso.',
    color: C,
    icon: '☁️',
  },
  'eval-lc': {
    id: 'eval-lc',
    recommendation: 'LangSmith + Promptfoo',
    detail: 'LangSmith para traces e dataset management (integração nativa LangChain). Promptfoo para gate de CI no PR — YAML simples, roda em GitHub Actions.',
    color: C,
    icon: '🔗',
  },
  'eval-custom': {
    id: 'eval-custom',
    recommendation: 'Promptfoo + RAGAS',
    detail: 'Promptfoo para gate de CI (provider-agnóstico). RAGAS para métricas de qualidade (faithfulness, relevancy). Langfuse para traces e scoring.',
    color: SKY,
    icon: '🧪',
  },
  'cost-multitenant': {
    id: 'cost-multitenant',
    recommendation: 'Langfuse + semantic cache',
    detail: 'Langfuse rastreia custo por tenant_id nativamente. Combine com semantic cache Redis (30-50% off) e model routing (Haiku para simples, Sonnet para complexo).',
    color: GRN,
    icon: '💰',
  },
  'cost-simple': {
    id: 'cost-simple',
    recommendation: 'Helicone + semantic cache',
    detail: 'Helicone proxy captura custo sem código extra. Adicione semantic cache Redis para redução imediata. Budget alert no Datadog/CloudWatch como segurança.',
    color: SKY,
    icon: '💵',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual 5: Progressão — Do zero ao LLMOps maduro
// ─────────────────────────────────────────────────────────────────────────────

const PROGRESSION_LEVELS: ProgressionLevel[] = [
  {
    id: 'naive',
    name: 'Sem LLMOps',
    label: 'Nível 0',
    emoji: '🌱',
    concepts: [
      { name: 'Prompts hardcoded', tip: 'Sem versão, sem rollback, mudança = deploy' },
      { name: 'Sem observabilidade', tip: 'Debugging por logs de texto' },
      { name: 'Custo desconhecido', tip: 'Surpresa na fatura mensal' },
      { name: 'Sem eval', tip: 'Qualidade avaliada por "parece ok"' },
    ],
  },
  {
    id: 'basic',
    name: 'LLMOps Básico',
    label: 'Nível 1',
    emoji: '📦',
    concepts: [
      { name: 'Prompt registry (git)', tip: 'Prompts em YAML versionados no git' },
      { name: 'Logging básico', tip: 'Log de prompt/response por request' },
      { name: 'Budget alert', tip: 'Alerta em Datadog quando custo > threshold' },
      { name: 'Eval manual', tip: 'Checklist manual antes de cada deploy' },
    ],
  },
  {
    id: 'intermediate',
    name: 'LLMOps Intermediário',
    label: 'Nível 2',
    emoji: '⚙️',
    concepts: [
      { name: 'Traces por request', tip: 'LangSmith/Langfuse: prompt, response, tokens, custo' },
      { name: 'Eval em CI', tip: 'Promptfoo gate bloqueia PR se score cai' },
      { name: 'Semantic cache', tip: 'Redis + embeddings: 30-50% de redução de custo' },
      { name: 'Fallback básico', tip: 'LiteLLM: Anthropic → OpenAI na falha' },
    ],
  },
  {
    id: 'advanced',
    name: 'LLMOps Avançado',
    label: 'Nível 3',
    emoji: '🚀',
    concepts: [
      { name: 'Shadow deploy + canary', tip: 'Deploy seguro de prompts com rollback automático' },
      { name: 'Guardrails (PII + injeção)', tip: 'Presidio masking + injection detection' },
      { name: 'Model routing', tip: 'Classificador de complexidade roteia para Haiku vs Sonnet' },
      { name: 'Drift detection', tip: 'Eval semanal automatizado + embedding drift alert' },
    ],
  },
  {
    id: 'expert',
    name: 'LLMOps Maduro',
    label: 'Nível 4',
    emoji: '🏆',
    concepts: [
      { name: 'Multi-tenant completo', tip: 'Budget cap por tenant, isolamento de dados em traces' },
      { name: 'A/B testing de prompts', tip: 'Sticky assignment + análise estatística' },
      { name: 'OTLP → Datadog/Grafana', tip: 'Métricas LLM integradas ao observability platform' },
      { name: 'Post-mortem de hallucination', tip: 'Loop: hallucination → caso no eval set → análise de causa raiz' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Montagem dos visuais
// ─────────────────────────────────────────────────────────────────────────────

export default function LlmopsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'deploy-pipeline',
      title: 'Pipeline de Deploy de Prompt',
      subtitle: 'Clique em cada fase para ver detalhes — do registry ao rollout seguro',
      accent: C,
      component: <DeployPipelineVisual />,
    },
    {
      id: 'observabilidade',
      title: 'Camadas de Observabilidade',
      subtitle: 'As 5 dimensões que todo sistema LLM em produção deve monitorar',
      accent: SKY,
      component: (
        <LayerStack
          layers={OBS_LAYERS}
          accentColor={SKY}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'ferramentas',
      title: 'Ferramentas de Observabilidade',
      subtitle: 'LangSmith vs Langfuse vs Helicone vs Phoenix — comparação por critério',
      accent: C,
      component: (
        <ComparisonTable
          options={OBS_OPTIONS}
          criteria={OBS_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'decisao',
      title: 'Qual Ferramenta LLMOps Usar?',
      subtitle: 'Árvore de decisão por prioridade do seu sistema',
      accent: GRN,
      component: (
        <DecisionTree
          root={DT_ROOT}
          nodes={DT_NODES}
          accentColor={GRN}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'progressao',
      title: 'Progressão LLMOps — Do Zero ao Maduro',
      subtitle: 'Os 5 níveis de maturidade operacional para sistemas com LLM',
      accent: C,
      component: (
        <ProgressionMap
          levels={PROGRESSION_LEVELS}
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
