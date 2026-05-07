'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta LLMOps ─────────────────────────────────────────────────────────────
const C = '#f59e0b'   // amber — NUNCA omitir, default seria cyan React

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista LLMOps',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: deploy de prompts, observabilidade (5 dimensões), redução de custo, fallback entre providers, guardrails, drift detection, A/B testing, multi-tenant. Cobre pleno e sênior com dicas de como responder.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Ferramentas, estratégias e decisões de LLMOps numa folha',
    type: 'quick-ref',
    pages: 2,
    description: 'Cartão de bolso: ferramentas por categoria (observabilidade, eval, guardrails, infra), estratégias de redução de custo com % de impacto, pipeline de deploy seguro e guia de decisão de provider.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'LLMOps do zero ao maduro em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 domínios (Prompt Registry, Eval/CI, Observabilidade, Guardrails, Custo, Resiliência) e checklist de 10 perguntas para auto-avaliar maturidade operacional.',
    icon: '03',
    goal: 'Mapeamento mental',
  },
]

// ── Dados: Q&A ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'O que você monitora em LLM em produção?',
    a: 'Cinco dimensões: (1) Negócio: aprovação, satisfação, task completion. (2) Qualidade: faithfulness/relevancy via RAGAS amostral, LLM-as-judge. (3) Sistema: latência p50/p99, tokens, custo/request, cache hit rate. (4) Falhas: rate limit, timeouts, schema inválido, refusals. (5) Drift: embedding drift, eval semanal vs baseline.',
    tip: 'Mencione as 5 dimensões. A maioria só fala latência e tokens — cobertura de negócio e drift demonstram maturidade sênior.',
  },
  {
    level: 'Senior',
    q: 'Como faria deploy seguro de novo prompt?',
    a: 'Pipeline: (1) CI eval com Promptfoo — gate bloqueia PR se score < threshold. (2) Shadow deploy: novo prompt paralelo ao antigo, 100% do tráfego, sem impacto. (3) Canary 5%, observa 24-48h. (4) Rollout gradual 20% → 50% → 100% com rollback automático se métricas caem.',
    tip: 'Shadow → Canary → Rollout. O rollback automático por threshold é o que demonstra operação real.',
  },
  {
    level: 'Senior',
    q: 'Como gerencia custo de LLM em produção?',
    a: 'Camadas: (1) Tag por feature/user/tenant. (2) Budget alerts por API key/tenant/dia. (3) Semantic cache Redis — 30-50% off. (4) Model routing: simples no Haiku/4o-mini (10x barato), complexo no Sonnet/4o. (5) Context compression: resumir histórico, trim sistema prompt. (6) Batch API para async: 50% desconto OpenAI/Anthropic.',
    tip: 'Começar por custo por feature/tenant antes de custo total demonstra que você pensa em accountability granular.',
  },
  {
    level: 'Senior',
    q: 'Como implementa fallback entre providers?',
    a: 'Camada de abstração (LiteLLM) com retry policy: Anthropic → OpenAI → Bedrock. Circuit breaker: > 5 falhas/60s → pula para próximo provider automaticamente. Prompts precisam ser portáveis (tool calling schema difere por provider). LiteLLM normaliza response format para OpenAI-compatible.',
    tip: 'Circuit breaker por provider vai além do retry ingênuo. Mencionar portabilidade de prompts entre providers é detalhe prático.',
  },
  {
    level: 'Senior',
    q: 'Como detecta hallucination em produção?',
    a: 'Faithfulness check (RAGAS): LLM-judge compara resposta com contexto recuperado — roda em 1-5% das requests. Citation requirement: prompt obriga citar fonte, valida que existe no contexto. Log-probabilities baixas = sinal de alucinação. Sampling humano: 1% vai para revisão manual — ground truth para calibrar métricas automáticas.',
    tip: 'Diferencie detecção (faithfulness check) de mitigação (melhorar contexto, não aumentar temperatura). Citar log-probabilities é diferencial sênior.',
  },
  {
    level: 'Senior',
    q: 'O que é prompt versioning e por que é obrigatório?',
    a: 'Tratar prompts como artefatos de software com versão, histórico e rollback. Obrigatório porque: (1) mudança de prompt pode degradar qualidade silenciosamente — sem versão, impossível identificar quando regrediu. (2) Reprodutibilidade de eval: precisa saber qual prompt rodou em qual test. (3) Auditoria em sistemas regulados. Ferramentas: git, LangSmith Hub, PromptLayer.',
    tip: 'Auditoria e reprodutibilidade são os argumentos mais fortes para contextos enterprise. Demonstra visão além do técnico.',
  },
  {
    level: 'Senior',
    q: 'Como faz A/B testing de prompts?',
    a: 'Sticky assignment por user_id hash — mesmo usuário sempre vê A ou B. Log prompt_version em todas as métricas. Análise estatística: mínimo 500 amostras por variante, p-value < 0.05. Decisão: B vence → rollout gradual; empate → mantém A (menos risco).',
    tip: 'Sticky assignment é o detalhe que diferencia A/B real de random. Usuário que viu A e depois B tem experiência incoerente — afeta feedback.',
  },
  {
    level: 'Senior',
    q: 'Como lida com drift em LLMs?',
    a: 'Input drift: embedding drift — compara distribuição de embeddings hoje vs 30d atrás. Alerta se distância média > threshold. Output drift: eval semanal automatizado vs baseline — alerta se score cai > 5%. Causa comum: provider fez model refresh silencioso (acontece com GPT-4, Claude sem aviso).',
    tip: 'Provider updates silenciosos sem mudança de versão são a causa mais comum de drift. Mencionar isso demonstra que você opera LLMs em produção real.',
  },
  {
    level: 'Senior',
    q: 'Como implementa semantic caching?',
    a: 'Fluxo: query → gera embedding (mesmo modelo sempre) → busca no Redis por cosine similarity → se sim > threshold (0.92-0.95) → retorna cached. Se miss → chama LLM → armazena com embedding e TTL. Invalidação por namespace ao mudar base de conhecimento. Threshold calibrado via A/B test.',
    tip: 'Mencionar calibração de threshold via A/B (não valor arbitrário) e invalidação por namespace demonstra operação real, não teoria.',
  },
  {
    level: 'Senior',
    q: 'Como estrutura LLMOps para multi-tenant?',
    a: 'Isolamento de custo: API key ou cost tag por tenant, budget cap por tenant. Isolamento de dados: traces mascarados por tenant_id, DPA com provider. Rate limiting por tenant: plano free < plano enterprise. System prompt personalizado por tenant, versionado separadamente. Eval set por vertical: genérico pode não capturar degradação em domínio específico.',
    tip: 'Isolamento de dados em traces é o item mais sensível (LangSmith pode expor dados entre tenants). Mencionar DPA com provider é diferencial de compliance.',
  },
  {
    level: 'Pleno',
    q: 'O que é um eval set e como montar um bom?',
    a: 'Coleção de casos de teste: input + expected output ou critério de qualidade. Golden set: 50-200 exemplos curados cobrindo casos normais e edge cases. Adversarial: inputs que quebraram em produção (retroalimentar bugs). Métricas por tipo: Q&A → RAGAS, extração → exact match, geração → LLM-judge com rubrica. Mínimo: 50 exemplos com score definido.',
    tip: 'Retroalimentar bugs de produção no eval set é o que torna o conjunto vivo e relevante ao longo do tempo.',
  },
  {
    level: 'Pleno',
    q: 'O que é LangSmith e para que serve?',
    a: 'Plataforma de observabilidade e eval para apps LLM da LangChain. Funcionalidades: Tracing (prompt, response, tokens, custo por run), Datasets e evaluators, Playground para testar prompts, Hub para prompt registry colaborativo, Monitoring de qualidade e custo. Alternativas: Langfuse (open-source, self-hosted), Phoenix (Arize), Helicone (proxy simples).',
    tip: 'Posicionar LangSmith vs Langfuse: SaaS integrado LangChain vs open-source provider-agnóstico. Em projetos com restrições de dados, Langfuse self-hosted é preferível.',
  },
  {
    level: 'Pleno',
    q: 'Como faz rate limiting de chamadas ao LLM?',
    a: 'Duas camadas: (1) Upstream (sua app): token bucket por usuário/tenant → 429 antes de chamar LLM, economiza custo e protege cota. (2) Downstream (provider): backoff exponencial com jitter em 429. Fila com BullMQ/SQS para workloads async absorve picos. Circuit breaker: X falhas em Y segundos → entra em fallback sem tentar mais.',
    tip: 'Separar upstream (protege custo) vs downstream (lida com provider) é a distinção fundamental. Candidatos que só pensam no downstream perdem a dimensão de proteção de custo.',
  },
  {
    level: 'Pleno',
    q: 'O que é model routing?',
    a: 'Redirecionar requests para modelos diferentes baseado em critérios dinâmicos. Estratégias: por complexidade (classificador → Haiku vs Sonnet, 10x diferença de custo), por feature (chat → Haiku, análise → Sonnet), por tier de tenant (free → barato, enterprise → premium), por latência SLA (sync → rápido, async → mais capaz). Implementação: LiteLLM Router com regras configuráveis.',
    tip: 'Classificador de intent como roteador (modelo pequeno decide qual modelo principal usar) é o padrão mais sofisticado. Poucos candidatos conhecem.',
  },
  {
    level: 'Pleno',
    q: 'Quais guardrails você usaria em produção?',
    a: 'Input: PII detection (Microsoft Presidio masca CPF/email/cartão), prompt injection detection (NeMo Guardrails ou classifier), topic classifier (rejeita fora do escopo). Output: toxicity (Perspective API), hallucination score, schema validation (Pydantic/Zod), sensitive info leak. LlamaGuard para safety end-to-end.',
    tip: 'Diferencie input guards (protege seu sistema) de output guards (protege o usuário). Ambos são necessários em produção regulada.',
  },
  {
    level: 'Pleno',
    q: 'Como versiona datasets e eval sets?',
    a: 'Git + DVC para datasets como arquivos versionados (DVC aponta para S3/GCS, git rastreia metadata). LangSmith Datasets para UI colaborativa. Formato padrão: JSONL com query, expected_output, metadata. Regra crítica: eval set deve ter versão fixada em cada CI run — resultados são comparáveis apenas se eval set é o mesmo.',
    tip: 'A regra de versão fixada do eval set é frequentemente ignorada. Se o eval muda entre runs, a comparação não tem validade estatística.',
  },
  {
    level: 'Pleno',
    q: 'Como instrumenta uma aplicação com Langfuse?',
    a: '@observe() decorator captura automaticamente inputs/outputs de funções. langfuse_context.update_current_trace() adiciona metadata (user_id, feature, prompt_version). Scores via langfuse_context.score_current_observation() para qualidade por request. langfuse.flush() antes de sair do processo. Exporta para Datadog via OTLP collector.',
    tip: 'Mencionar flush() antes de encerrar é o detalhe que candidatos sem experiência real esquecem — sem flush, últimos traces se perdem.',
  },
  {
    level: 'Pleno',
    q: 'Como usa a Batch API para reduzir custo?',
    a: 'Workloads async (embed de documentos, eval de prompts, geração de relatórios) não precisam de resposta imediata. OpenAI e Anthropic têm Batch API com 50% de desconto. Fluxo: envia batch de requests → provider processa em 24h → coleta resultados. Implementar com fila (BullMQ/SQS): jobs async vão para batch, jobs síncronos para API normal.',
    tip: 'Batch API é a otimização de custo menos conhecida mas com maior impacto para workloads de dados. 50% off sem degradação de qualidade.',
  },
  {
    level: 'Senior',
    q: 'Como lida com PII e compliance em pipelines LLM?',
    a: 'Input scrubbing: Presidio detecta e mascara PII antes de enviar ao LLM. Log sanitization: PII filtering em LangSmith/Langfuse antes de armazenar. Retenção: TTL de logs de LLM — dados pessoais não ficam indefinidamente. Contrato: verificar DPA com provider (OpenAI não usa API data para treinar, mas DPA deve ser assinado para compliance LGPD/GDPR).',
    tip: 'DPA com provider é crítico para compliance mas frequentemente esquecido por devs. Mencionar demonstra visão de produto além de código.',
  },
  {
    level: 'Senior',
    q: 'Como mensura o ROI de LLMOps bem implementado?',
    a: 'Custo: % redução por request após semantic cache + routing (benchmark: 30-60% em 3 meses). Qualidade: redução de hallucinations reportadas (benchmark: 40-70% com guardrails + eval CI). Velocity: tempo de deploy de prompt — horas → minutos. Confiabilidade: uptime com fallback vs sem (99.9% vs 99.0% em incidentes de provider). Incidentes: bugs de qualidade chegando em produção (benchmark: redução de 80% com eval gate).',
    tip: 'Quantificar ROI com benchmarks (mesmo estimados) demonstra que você sabe justificar investimento para stakeholders — habilidade sênior além do técnico.',
  },
]

// ── Dados: Quick Reference ────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'OBSERVABILIDADE',
        entries: [
          { key: 'LangSmith', value: 'SaaS, integrado LangChain, prompt hub, datasets', badge: 'SaaS', badgeColor: '#f59e0b' },
          { key: 'Langfuse', value: 'Open-source, self-hosted, OTLP export, cost por tenant', badge: 'OSS', badgeColor: '#22c55e' },
          { key: 'Helicone', value: 'Proxy drop-in, zero SDK, cost tracking', badge: 'proxy', badgeColor: '#38bdf8' },
          { key: 'Phoenix (Arize)', value: 'ML-native, embedding drift, OTLP', badge: 'OSS', badgeColor: '#22c55e' },
        ],
      },
      {
        title: 'EVAL / CI',
        entries: [
          { key: 'Promptfoo', value: 'YAML config, CI gate, HTML report, provider-agnóstico', badge: 'OSS', badgeColor: '#22c55e' },
          { key: 'RAGAS', value: 'faithfulness, relevancy, context recall — métricas RAG', badge: 'métricas', badgeColor: '#6366f1' },
          { key: 'LLM-as-judge', value: 'Prompt GPT-4/Claude para avaliar output — escala', badge: 'padrão', badgeColor: '#f59e0b' },
          { key: 'Min pass rate', value: 'npx promptfoo check-results --min-pass-rate 0.90', badge: 'CLI', badgeColor: '#475569' },
        ],
      },
      {
        title: 'GUARDRAILS',
        entries: [
          { key: 'Presidio', value: 'PII detection + masking — CPF, email, cartão', badge: 'Microsoft', badgeColor: '#38bdf8' },
          { key: 'Guardrails AI', value: 'Validators com retry automático em output inválido', badge: 'OSS', badgeColor: '#22c55e' },
          { key: 'NeMo Guardrails', value: 'Colang rules, flows complexos, NVIDIA', badge: 'NVIDIA', badgeColor: '#76c00d' },
          { key: 'LlamaGuard', value: 'Modelo fine-tuned para safety input/output', badge: 'Meta', badgeColor: '#6366f1' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'REDUÇÃO DE CUSTO',
        entries: [
          { key: 'Semantic cache', value: 'Redis + embeddings. Queries similares → cached. 30-50% off', badge: '-40%', badgeColor: '#22c55e' },
          { key: 'Model routing', value: 'Haiku/4o-mini para simples (10x mais barato). Sonnet para complexo', badge: '-10x custo', badgeColor: '#22c55e' },
          { key: 'Batch API', value: 'OpenAI/Anthropic Batch: async, 50% off', badge: '-50%', badgeColor: '#22c55e' },
          { key: 'Context compression', value: 'Resumir histórico, trim system prompt, remover redundância', badge: '-20-40%', badgeColor: '#22c55e' },
          { key: 'Cost tagging', value: 'Tag por feature/tenant → custo granular rastreável', badge: 'visibilidade', badgeColor: '#f59e0b' },
          { key: 'Budget alerts', value: 'Alerta antes de estourar. Circuit breaker emergencial', badge: 'segurança', badgeColor: '#ef4444' },
        ],
      },
      {
        title: 'PIPELINE DE DEPLOY',
        entries: [
          { key: '1. CI Eval', value: 'Promptfoo gate — PR não merga se score < threshold', badge: 'automático', badgeColor: '#f59e0b' },
          { key: '2. Shadow', value: '100% paralelo. Zero risco. Detecta divergências.', badge: '0% risco', badgeColor: '#22c55e' },
          { key: '3. Canary 5%', value: 'Tráfego real por 24-48h. Sticky assignment por user_id.', badge: '5% tráfego', badgeColor: '#f59e0b' },
          { key: '4. Rollout', value: '20% → 50% → 100%. Rollback auto se métrica cai.', badge: 'seguro', badgeColor: '#22c55e' },
        ],
      },
      {
        title: 'RESILIÊNCIA',
        entries: [
          { key: 'LiteLLM', value: '100+ providers, fallback, router, circuit breaker', badge: 'OSS', badgeColor: '#22c55e' },
          { key: 'Fallback chain', value: 'Anthropic → OpenAI → Bedrock em timeout/rate limit/5xx', badge: 'padrão', badgeColor: '#f59e0b' },
          { key: 'Circuit breaker', value: '> 5 falhas/60s → pula direto para próximo provider', badge: 'auto', badgeColor: '#6366f1' },
          { key: 'Rate limiting', value: 'Token bucket upstream (custo) + backoff downstream (provider)', badge: '2 camadas', badgeColor: '#38bdf8' },
        ],
      },
    ],
  },
]

// ── Dados: Mindmap ────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Prompt Registry',
    color: '#f59e0b',
    items: [
      { t: 'Versão semântica', k: true },
      { t: 'git / LangSmith Hub', k: true },
      { t: 'Rollback imediato', k: true },
      { t: 'A/B testing', a: true },
      { t: 'Prompt changelog', a: true },
    ],
  },
  {
    label: 'Eval & CI',
    color: '#22c55e',
    items: [
      { t: 'Golden set (50+ exemplos)', k: true },
      { t: 'Promptfoo gate no PR', k: true },
      { t: 'RAGAS faithfulness', k: true },
      { t: 'LLM-as-judge', a: true },
      { t: 'Adversarial (bugs reais)', a: true },
      { t: 'Eval set versionado', a: true },
    ],
  },
  {
    label: 'Observabilidade',
    color: '#38bdf8',
    items: [
      { t: 'Trace por request', k: true },
      { t: 'Custo por request', k: true },
      { t: 'LangSmith / Langfuse', k: true },
      { t: 'OTLP → Datadog', a: true },
      { t: 'Embedding drift', a: true },
      { t: '5 dimensões de monit.', a: true },
    ],
  },
  {
    label: 'Guardrails',
    color: '#ef4444',
    items: [
      { t: 'PII masking (Presidio)', k: true },
      { t: 'Output schema validation', k: true },
      { t: 'Prompt injection guard', a: true },
      { t: 'Toxicity check', a: true },
      { t: 'LlamaGuard safety', a: true },
    ],
  },
  {
    label: 'Custo',
    color: '#a855f7',
    items: [
      { t: 'Cost tagging', k: true },
      { t: 'Budget alerts', k: true },
      { t: 'Semantic cache (30-50%)', k: true },
      { t: 'Model routing (10x)', a: true },
      { t: 'Batch API (50% off)', a: true },
      { t: 'Context compression', a: true },
    ],
  },
  {
    label: 'Resiliência',
    color: '#6366f1',
    items: [
      { t: 'Fallback multi-provider', k: true },
      { t: 'Rate limiting upstream', k: true },
      { t: 'Circuit breaker', a: true },
      { t: 'LiteLLM Router', a: true },
      { t: 'Shadow + Canary deploy', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'Prompts têm versão e histórico (git ou LangSmith Hub)?',
  'CI eval roda em cada PR com gate de qualidade mínima?',
  'Todo request tem trace com prompt, response, tokens e custo?',
  'PII é mascarado antes de enviar para o LLM e antes de logar?',
  'Custo está taggeado por feature e por tenant?',
  'Há semantic cache reduzindo chamadas repetidas?',
  'Existe fallback para pelo menos 2 providers diferentes?',
  'Budget alert ativa antes de estourar cota?',
  'Eval set roda semanalmente para detectar drift?',
  'Rollback de prompt leva menos de 5 minutos?',
]

// ── Builders ─────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'LLMOps',
    stackLabel: 'AI Engineering',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'LLMOps',
    accentColor: C,
    stackLabel: 'AI Engineering',
    tagline: 'Ferramentas, estratégias e decisões de LLMOps em produção',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'LLMOps',
    stackLabel: 'AI Engineering',
    coverTitle: 'LLMOps — Do Zero ao Maduro',
    coverSubtitle: 'Mapa mental de maturidade operacional para sistemas com LLM',
    checklistTitle: 'Checklist de Maturidade LLMOps',
    checklistDesc: '10 perguntas para auto-avaliar seu sistema. Todas marcadas = LLMOps nível 3+.',
  }),
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function LlmopsPdfs() {
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
