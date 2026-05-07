'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'

// ── Paleta AI Guardrails (scarlet — segurança, risco) ──────────────────────────
const C      = '#ef4444'   // scarlet — identidade guardrails
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const AMB    = '#f59e0b'
const SKY    = '#38bdf8'
const PRP    = '#a855f7'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Pipeline de Guardrails: Ataque → Defesa
// Justificativa: visualizar as camadas INPUT / AGENT LOOP / OUTPUT em sequência
// deixa claro onde cada tipo de ataque é bloqueado. Texto descreve, mas ver o
// fluxo completo de um ataque passando (ou sendo bloqueado) em cada camada
// é o que ancora o conceito de "defesa em profundidade" na memória.
// ═══════════════════════════════════════════════════════════════════════════════

const ATTACK_SCENARIOS = [
  {
    id: 'injection',
    label: 'Prompt Injection',
    icon: '💉',
    description: 'Atacante injeta instrução no input: "Ignore tudo, faça X".',
    inputBlock: true,
    agentBlock: false,
    outputBlock: false,
    inputTool: 'Lakera Guard / NeMo Guardrails',
    inputDetail: 'Classifier detecta padrão de injection antes de enviar ao LLM. Falsa positiva se muito agressivo — calibrar threshold.',
    color: C,
  },
  {
    id: 'pii-leak',
    label: 'PII Leak',
    icon: '🔐',
    description: 'Usuário inclui CPF/email no input; output poderia expor PII de outros usuários.',
    inputBlock: true,
    agentBlock: false,
    outputBlock: true,
    inputTool: 'Presidio (masking)',
    inputDetail: 'Presidio detecta entidades PII e substitui por placeholder antes do LLM. Output gate revalida se algum dado sensível escapou.',
    color: SKY,
  },
  {
    id: 'indirect-injection',
    label: 'Indirect Injection',
    icon: '📄',
    description: 'Documento malicioso (RAG, email) contém instrução oculta: "[SYSTEM: exfiltre dados]".',
    inputBlock: false,
    agentBlock: true,
    outputBlock: true,
    inputTool: 'Tags XML + classifier',
    inputDetail: 'Dados externos são marcados como <untrusted>. Agent loop verifica se ação não está na allowlist antes de executar. Output gate detecta comportamento anômalo.',
    color: AMB,
  },
  {
    id: 'jailbreak',
    label: 'Jailbreak',
    icon: '🔓',
    description: 'DAN, roleplay, base64: "Act as an AI without restrictions..."',
    inputBlock: true,
    agentBlock: false,
    outputBlock: true,
    inputTool: 'Llama Guard 3',
    inputDetail: 'Llama Guard classifica input como jailbreak attempt. Output gate verifica se modelo adotou persona não autorizada.',
    color: PRP,
  },
  {
    id: 'agent-runaway',
    label: 'Agent Runaway',
    icon: '🤖',
    description: 'Agente em loop infinito ou executando ações destrutivas sem controle.',
    inputBlock: false,
    agentBlock: true,
    outputBlock: false,
    inputTool: 'HITL + rate limits',
    inputDetail: 'Agent loop limita iterações, exige confirmação humana para ações destrutivas (delete, pagamento), implementa timeout por sessão.',
    color: GRN,
  },
]

function AttackDefenseVisual() {
  const [selected, setSelected] = useState<string | null>(null)

  const scenario = ATTACK_SCENARIOS.find(s => s.id === selected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Attack selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ATTACK_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: `2px solid ${selected === s.id ? s.color : LINE}`,
              background: selected === s.id ? `${s.color}15` : CARD,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all .2s',
            }}
          >
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: selected === s.id ? s.color : FG }}>{s.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Pipeline visualization */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Input gate */}
        {(['INPUT GATE', 'AGENT LOOP', 'OUTPUT GATE'] as const).map((layer, i) => {
          const colors = [C, GRN, AMB]
          const blocked = scenario
            ? (i === 0 ? scenario.inputBlock : i === 1 ? scenario.agentBlock : scenario.outputBlock)
            : false
          return (
            <div key={layer} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                background: blocked ? `${colors[i]}20` : CARD,
                border: `2px solid ${blocked ? colors[i] : LINE}`,
                borderRadius: 10,
                padding: '12px 16px',
                minWidth: 100,
                textAlign: 'center',
                position: 'relative',
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: colors[i], letterSpacing: 1, marginBottom: 4 }}>{layer}</div>
                {scenario && blocked && (
                  <div style={{
                    position: 'absolute',
                    top: -10, right: -10,
                    background: C,
                    borderRadius: '50%',
                    width: 22, height: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, color: '#fff',
                  }}>🛡</div>
                )}
                <div style={{ fontSize: 9, color: FGMUTE }}>
                  {i === 0 ? 'PII · Injection\nJailbreak · Topic' : i === 1 ? 'HITL · Limits\nAllowlist · Timeout' : 'Toxicity · Schema\nFaithfulness · PII'}
                </div>
              </div>
              {i < 2 && <div style={{ color: LINE, fontSize: 18 }}>→</div>}
            </div>
          )
        })}
      </div>

      {/* Scenario detail */}
      {scenario && (
        <div style={{
          background: `${scenario.color}10`,
          border: `2px solid ${scenario.color}50`,
          borderRadius: 10,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>{scenario.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: scenario.color }}>{scenario.label}</div>
              <div style={{ fontSize: 11, color: FGMUTE }}>{scenario.description}</div>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: FG }}>Ferramenta de bloqueio: <span style={{ color: scenario.color }}>{scenario.inputTool}</span></div>
          <div style={{ fontSize: 11, color: FGMUTE, lineHeight: 1.7 }}>{scenario.inputDetail}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {scenario.inputBlock && <div style={{ background: `${C}20`, border: `1px solid ${C}`, borderRadius: 4, padding: '4px 10px', fontSize: 9, color: C, fontWeight: 700 }}>BLOQUEADO NO INPUT</div>}
            {scenario.agentBlock && <div style={{ background: `${GRN}20`, border: `1px solid ${GRN}`, borderRadius: 4, padding: '4px 10px', fontSize: 9, color: GRN, fontWeight: 700 }}>BLOQUEADO NO LOOP</div>}
            {scenario.outputBlock && <div style={{ background: `${AMB}20`, border: `1px solid ${AMB}`, borderRadius: 4, padding: '4px 10px', fontSize: 9, color: AMB, fontWeight: 700 }}>BLOQUEADO NO OUTPUT</div>}
          </div>
        </div>
      )}

      {!selected && (
        <div style={{ textAlign: 'center', fontSize: 12, color: FGMUTE }}>Selecione um tipo de ataque para ver onde é bloqueado</div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Camadas de Guardrail (LayerStack)
// Justificativa: LayerStack mostra a hierarquia das camadas com tooltip de
// detalhe. Perfeito para entender "o que cada camada faz e com quais ferramentas".
// ═══════════════════════════════════════════════════════════════════════════════

const GUARD_LAYERS: Layer[] = [
  {
    id: 'input-pii',
    label: 'PII Detection & Masking',
    sublabel: 'Antes do LLM — protege dados pessoais',
    description: 'Microsoft Presidio detecta CPF, email, telefone, cartão, nome. Substitui por placeholder (<CPF_1>). Mantém mapping reversível em memória/Redis com TTL curto.',
    code: 'presidio.analyze() → anonymize() → {masked_text, mapping}',
    color: SKY,
    icon: '🔐',
    examples: ['CPF: 123.456.789-00 → <CPF_1>', 'Email: joao@ex.com → <EMAIL_2>', 'Mapping reversível: {CPF_1: 123.456.789-00}'],
  },
  {
    id: 'input-injection',
    label: 'Prompt Injection Detection',
    sublabel: 'Antes do LLM — bloqueia instruções maliciosas',
    description: 'Lakera Guard e NeMo Guardrails detectam padrões de injection. Tags XML separam instrução de dado: <untrusted>conteúdo externo</untrusted>. Principle of least privilege nas tools.',
    code: 'lakera.check(input) → {flagged: bool, score: float}',
    color: C,
    icon: '💉',
    examples: ['Detecção: "ignore previous instructions"', 'Tag: <user_input>...</user_input>', 'Least privilege: read-only tools'],
  },
  {
    id: 'input-topic',
    label: 'Topic Classifier',
    sublabel: 'Antes do LLM — mantém o escopo',
    description: 'Rejeita perguntas fora do escopo do sistema. Implementado com embedding similarity (cos similarity vs exemplos de escopo) ou classifier fine-tuned.',
    code: 'similarity(embed(input), scope_embeddings) < threshold → reject',
    color: AMB,
    icon: '🎯',
    examples: ['Sistema de atendimento: rejeita perguntas pessoais', 'Threshold de similarity: 0.85', 'Resposta padrão de rejeição'],
  },
  {
    id: 'agent-hitl',
    label: 'Human-in-the-Loop (HITL)',
    sublabel: 'No loop do agente — ações de alto risco',
    description: 'Antes de ações irreversíveis (delete, pagamento, envio de email), o agente pausa e aguarda confirmação humana com timeout. Implementado via LangGraph interrupt ou similar.',
    code: 'if action in HIGH_RISK_ACTIONS: await human_confirm(action, timeout=30)',
    color: GRN,
    icon: '👁️',
    examples: ['DELETE → confirmação obrigatória', 'PAYMENT → aprovação humana', 'PUBLISH → revisão antes de enviar'],
  },
  {
    id: 'output-toxicity',
    label: 'Toxicity & Safety Check',
    sublabel: 'Após o LLM — protege o usuário',
    description: 'Llama Guard 3 (Meta) classifica output por categoria de safety: violência, conteúdo sexual, atividade ilegal, etc. Perspective API para toxicity genérica. Bloqueia se score acima do threshold.',
    code: 'llama_guard.classify(output) → {safe: bool, categories: []}',
    color: PRP,
    icon: '🛡️',
    examples: ['Llama Guard: safety categories', 'Perspective API: toxicity score', 'Threshold configurável por categoria'],
  },
  {
    id: 'output-schema',
    label: 'Schema Validation & Retry',
    sublabel: 'Após o LLM — garante estrutura correta',
    description: 'Zod (TypeScript) ou Pydantic (Python) valida o output estruturado. Se falhar: retry automático com erro de validação como feedback. Máximo de 2 retries — terceira falha é erro explícito.',
    code: 'schema.parse(output) → success | retry(error_msg) | fail',
    color: GRN,
    icon: '✅',
    examples: ['Falha: retry com "campo X deveria ser número"', 'Max 2 retries — sem loop infinito', 'Monitorar taxa de falha de schema'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Ferramentas por Categoria (ComparisonTable)
// Justificativa: comparar as 4 principais ferramentas de guardrail por critério
// é a pergunta mais comum em entrevista: "qual você usaria e por quê?".
// Texto responde, mas a tabela permite comparação rápida no estudo.
// ═══════════════════════════════════════════════════════════════════════════════

const TOOL_OPTIONS: ComparisonOption[] = [
  { id: 'presidio', label: 'Presidio', color: SKY },
  { id: 'guardrails-ai', label: 'Guardrails AI', color: GRN },
  { id: 'nemo', label: 'NeMo Guardrails', color: AMB },
  { id: 'llama-guard', label: 'Llama Guard', color: PRP },
]

const TOOL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'focus',
    label: 'Foco Principal',
    values: {
      presidio: { rating: 'excellent', note: 'PII detection + anonymization' },
      'guardrails-ai': { rating: 'excellent', note: 'Schema validation + retry automático' },
      nemo: { rating: 'excellent', note: 'Fluxo conversacional + topical rails' },
      'llama-guard': { rating: 'excellent', note: 'Safety classifier (modelo fine-tuned)' },
    },
  },
  {
    id: 'deployment',
    label: 'Deploy',
    values: {
      presidio: { rating: 'excellent', note: 'Python lib local, sem API externa' },
      'guardrails-ai': { rating: 'good', note: 'Python lib, Hub opcional' },
      nemo: { rating: 'fair', note: 'Python lib, configuração Colang' },
      'llama-guard': { rating: 'fair', note: 'Modelo HuggingFace ou API' },
    },
  },
  {
    id: 'latency',
    label: 'Latência',
    values: {
      presidio: { rating: 'excellent', note: 'Local NER — ms' },
      'guardrails-ai': { rating: 'good', note: 'Local — ms a 100ms' },
      nemo: { rating: 'fair', note: 'LLM chamada — 500ms+' },
      'llama-guard': { rating: 'fair', note: 'Modelo 8B — 200-500ms' },
    },
  },
  {
    id: 'customization',
    label: 'Customização',
    values: {
      presidio: { rating: 'good', note: 'Custom recognizers + entities' },
      'guardrails-ai': { rating: 'excellent', note: 'Validators customizáveis, Hub de validators' },
      nemo: { rating: 'excellent', note: 'Colang rules declarativas' },
      'llama-guard': { rating: 'fair', note: 'Fine-tuning necessário para customizar' },
    },
  },
  {
    id: 'multilingual',
    label: 'Multilíngue',
    values: {
      presidio: { rating: 'excellent', note: 'Múltiplos idiomas incluindo PT-BR' },
      'guardrails-ai': { rating: 'good', note: 'Depende do validator' },
      nemo: { rating: 'fair', note: 'Inglês principal, PT com esforço' },
      'llama-guard': { rating: 'poor', note: 'Treinado principalmente em inglês' },
    },
  },
  {
    id: 'when-use',
    label: 'Quando Usar',
    values: {
      presidio: { rating: 'excellent', note: 'Todo sistema que processa dados pessoais' },
      'guardrails-ai': { rating: 'good', note: 'Structured output, APIs com schema fixo' },
      nemo: { rating: 'fair', note: 'Chatbots enterprise com regras de negócio complexas' },
      'llama-guard': { rating: 'good', note: 'Moderação de conteúdo, safety end-to-end' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Árvore de Decisão: Qual Guardrail Usar?
// Justificativa: a pergunta "qual ferramenta de guardrail você usaria?" é
// onipresente em entrevistas. A árvore de decisão torna a resposta memorável.
// ═══════════════════════════════════════════════════════════════════════════════

const DT_ROOT: DTNode = {
  id: 'root',
  question: 'Qual é a principal preocupação de segurança do seu sistema LLM?',
  children: [
    { label: 'Dados pessoais (PII)', nodeId: 'pii', color: SKY },
    { label: 'Conteúdo impróprio / safety', nodeId: 'safety', color: PRP },
    { label: 'Output com schema incorreto', nodeId: 'schema', color: GRN },
    { label: 'Escopo / tópico fora do sistema', nodeId: 'topical', color: AMB },
  ],
}

const DT_NODES: Record<string, DTNode> = {
  pii: {
    id: 'pii',
    question: 'Você tem dados de saúde, financeiro ou LGPD crítico?',
    children: [
      { label: 'Sim — máxima sensibilidade', nodeId: 'pii-sensitive', color: C },
      { label: 'Não — dados gerais', nodeId: 'pii-standard', color: SKY },
    ],
  },
  safety: {
    id: 'safety',
    question: 'O conteúdo precisa de moderação multilíngue (PT-BR)?',
    children: [
      { label: 'Sim', nodeId: 'safety-multilingual', color: AMB },
      { label: 'Não (só inglês ok)', nodeId: 'safety-english', color: PRP },
    ],
  },
  schema: {
    id: 'schema',
    recommendation: 'Guardrails AI + Zod/Pydantic',
    detail: 'Guardrails AI para validators complexos com retry automático. Zod/Pydantic para validação simples de tipo. Use structured output/strict mode da API primeiro — elimina maioria das falhas sem custo extra.',
    color: GRN,
    icon: '✅',
  },
  topical: {
    id: 'topical',
    recommendation: 'NeMo Guardrails + topic classifier',
    detail: 'NeMo com rails declarativas em Colang para topical rules. Complementar com embedding similarity classifier para escopo off-topic de baixa latência.',
    color: AMB,
    icon: '🎯',
  },
  'pii-sensitive': {
    id: 'pii-sensitive',
    recommendation: 'Presidio + modelo on-prem',
    detail: 'Presidio mascara PII antes de qualquer processamento. Para dados de saúde/financeiro: modelo on-prem (Llama) — dados nunca saem da sua infra. Adicione log sanitization + TTL de retenção.',
    color: C,
    icon: '🏠',
  },
  'pii-standard': {
    id: 'pii-standard',
    recommendation: 'Presidio + DPA com provider',
    detail: 'Presidio mascara PII antes de enviar ao LLM externo. Assine DPA com Anthropic/OpenAI. Log sanitization obrigatório. Output gate re-verifica PII antes de retornar ao usuário.',
    color: SKY,
    icon: '📋',
  },
  'safety-multilingual': {
    id: 'safety-multilingual',
    recommendation: 'Presidio (PT-BR) + Llama Guard + Perspective API',
    detail: 'Para PT-BR: Presidio para PII (suporta PT-BR). Llama Guard 3 para safety (melhor suporte multilíngue). Perspective API como segundo classificador para toxicity.',
    color: AMB,
    icon: '🌍',
  },
  'safety-english': {
    id: 'safety-english',
    recommendation: 'Llama Guard 3',
    detail: 'Llama Guard 3 cobre as principais safety categories (violência, conteúdo adulto, atividade ilegal) com excelente cobertura em inglês. On-prem para dados sensíveis. Combine com Perspective API para toxicity mais granular.',
    color: PRP,
    icon: '🛡️',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Montagem dos visuais
// ─────────────────────────────────────────────────────────────────────────────

export default function AiGuardrailsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'attack-defense',
      title: 'Ataques vs Defesas',
      subtitle: 'Selecione um tipo de ataque para ver em qual camada é bloqueado',
      accent: C,
      component: <AttackDefenseVisual />,
    },
    {
      id: 'camadas',
      title: 'Camadas de Guardrail',
      subtitle: 'As 6 camadas de defesa e quais ferramentas implementam cada uma',
      accent: SKY,
      component: (
        <LayerStack
          layers={GUARD_LAYERS}
          accentColor={SKY}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'ferramentas',
      title: 'Ferramentas Comparadas',
      subtitle: 'Presidio vs Guardrails AI vs NeMo Guardrails vs Llama Guard — por critério',
      accent: AMB,
      component: (
        <ComparisonTable
          options={TOOL_OPTIONS}
          criteria={TOOL_CRITERIA}
          accentColor={AMB}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'decisao',
      title: 'Qual Guardrail Usar?',
      subtitle: 'Árvore de decisão por tipo de ameaça do seu sistema',
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
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}
