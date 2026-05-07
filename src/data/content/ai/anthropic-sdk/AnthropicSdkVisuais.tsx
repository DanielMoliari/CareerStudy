'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Anthropic SDK (bronze Anthropic) ────────────────────────────────────
const C      = '#c98346'   // bronze Anthropic
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#22c55e'
const RED    = '#ef4444'
const SKY    = '#38bdf8'
const AMB    = '#f59e0b'
const PRP    = '#a855f7'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Tool Use Loop: Fluxo Animado
// Justificativa: o loop de tool use é o conceito mais difícil de aprender
// porque é assimétrico (stop_reason muda o fluxo). Ver o loop com estados
// distintos (pensando, aguardando, executando, finalizando) ancora melhor
// que um diagrama estático.
// ═══════════════════════════════════════════════════════════════════════════════

const LOOP_STEPS = [
  {
    id: 'send',
    label: '1. Enviar Mensagem',
    icon: '📤',
    color: C,
    detail: 'POST /v1/messages com messages array + tools definition. Claude recebe o contexto completo e decide se responde diretamente ou usa uma ferramenta.',
    code: `await client.messages.create({
  model: 'claude-sonnet-4-5',
  tools, messages
})`,
    stopReason: null,
  },
  {
    id: 'check',
    label: '2. Checar stop_reason',
    icon: '🔍',
    color: AMB,
    detail: '"tool_use" → continuar o loop. "end_turn" → resposta final. "max_tokens" → truncado, atenção. "stop_sequence" → delimitador atingido.',
    code: `if (response.stop_reason === 'end_turn') break
if (response.stop_reason === 'tool_use') continue`,
    stopReason: 'tool_use',
  },
  {
    id: 'execute',
    label: '3. Executar Tools',
    icon: '⚙️',
    color: GRN,
    detail: 'Extrair TODOS os tool_use blocks. Executar cada função. Capturar resultado OU erro (is_error: true). Logar para auditoria.',
    code: `const toolBlocks = response.content.filter(b => b.type === 'tool_use')
const results = await Promise.all(toolBlocks.map(exec))`,
    stopReason: null,
  },
  {
    id: 'add',
    label: '4. Adicionar ao Histórico',
    icon: '📝',
    color: SKY,
    detail: 'CRÍTICO: adicionar a resposta do assistant COM os tool_use blocks ANTES dos tool_results. API retorna 400 se a conversa estiver malformada.',
    code: `messages.push({ role: 'assistant', content: response.content })
messages.push({ role: 'user', content: toolResults })`,
    stopReason: null,
  },
]

function ToolUseLoopVisual() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Loop diagram */}
      <div style={{ position: 'relative', padding: '20px 0' }}>
        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LOOP_STEPS.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              {/* Left: step number + connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 30 }}>
                <button
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  style={{
                    width: 30, height: 30,
                    borderRadius: '50%',
                    border: `2px solid ${activeStep === i ? step.color : LINE}`,
                    background: activeStep === i ? step.color : CARD,
                    color: activeStep === i ? '#0f172a' : step.color,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all .2s',
                  }}
                >
                  {i + 1}
                </button>
                {i < LOOP_STEPS.length - 1 && (
                  <div style={{ width: 2, height: 16, background: LINE, margin: '3px 0' }} />
                )}
              </div>

              {/* Right: step content */}
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <button
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  style={{
                    width: '100%',
                    background: activeStep === i ? `${step.color}15` : CARD,
                    border: `1.5px solid ${activeStep === i ? step.color : LINE}`,
                    borderRadius: 8,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'all .2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{step.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: activeStep === i ? step.color : FG }}>{step.label}</span>
                    {step.stopReason && (
                      <span style={{ marginLeft: 'auto', fontSize: 9, background: `${AMB}20`, color: AMB, border: `1px solid ${AMB}`, borderRadius: 4, padding: '2px 6px' }}>
                        stop_reason: tool_use
                      </span>
                    )}
                  </div>
                </button>

                {activeStep === i && (
                  <div style={{ padding: '12px 14px', background: `${step.color}08`, border: `1px solid ${step.color}30`, borderRadius: '0 0 8px 8px', marginTop: -1 }}>
                    <div style={{ fontSize: 11, color: FG, lineHeight: 1.7, marginBottom: 10 }}>{step.detail}</div>
                    <div style={{ background: '#0f172a', borderRadius: 6, padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#94a3b8', lineHeight: 1.8 }}>
                      {step.code}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loop back indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, paddingLeft: 44 }}>
            <div style={{ fontSize: 11, color: AMB, fontWeight: 600 }}>↑ Volta ao passo 1 enquanto stop_reason = "tool_use"</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 44 }}>
            <div style={{ width: 8, height: 8, background: GRN, borderRadius: '50%' }} />
            <div style={{ fontSize: 11, color: GRN, fontWeight: 600 }}>Para quando stop_reason = "end_turn" — resposta final</div>
          </div>
        </div>
      </div>

      <div style={{ background: `${RED}10`, border: `1px solid ${RED}40`, borderRadius: 8, padding: '10px 14px', fontSize: 11, color: FGMUTE, lineHeight: 1.6 }}>
        <strong style={{ color: RED }}>Ponto crítico:</strong> Sempre adicionar a resposta completa do assistant (com os tool_use blocks) ao histórico ANTES dos tool_results — mesmo que apenas um tool foi executado. A API retorna 400 se o histórico estiver malformado.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Prompt Caching: Custo vs Benefício
// Justificativa: a matemática do caching (10% hit, 125% write) não é intuitiva.
// Ver um diagrama de qual parte do prompt é estática vs dinâmica, e calcular
// o impacto real, ancora a decisão de quando (e o que) cachear.
// ═══════════════════════════════════════════════════════════════════════════════

const CACHE_SCENARIOS = [
  {
    id: 'system',
    label: 'System Prompt Longo',
    icon: '⚙️',
    tokens: 5000,
    requests: 100,
    description: 'Instruções detalhadas, regras de negócio, personalidade do assistente',
    color: C,
    isStatic: true,
  },
  {
    id: 'examples',
    label: 'Few-shot Examples',
    icon: '📚',
    tokens: 3000,
    requests: 100,
    description: '20 exemplos de Q&A para guiar o comportamento do modelo',
    color: SKY,
    isStatic: true,
  },
  {
    id: 'docs',
    label: 'Documentação de Referência',
    icon: '📄',
    tokens: 10000,
    requests: 50,
    description: 'Manual técnico, base de conhecimento estática',
    color: AMB,
    isStatic: true,
  },
  {
    id: 'user',
    label: 'Mensagem do Usuário',
    icon: '💬',
    tokens: 200,
    requests: 100,
    description: 'A pergunta atual — muda a cada request. NÃO cachear.',
    color: RED,
    isStatic: false,
  },
]

function CachingDiagram() {
  const [selected, setSelected] = useState<string | null>(null)

  const scenario = CACHE_SCENARIOS.find(s => s.id === selected)

  // Calcular economia
  const calcSavings = (tokens: number, requests: number) => {
    const withoutCache = tokens * requests
    const write = tokens * 1.25  // write = 125%
    const reads = tokens * 0.10 * (requests - 1)  // reads = 10%
    const withCache = write + reads
    const savings = ((withoutCache - withCache) / withoutCache) * 100
    return { withoutCache, withCache: Math.round(withCache), savings: Math.round(savings) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Diagram of prompt structure */}
      <div style={{ background: CARD, borderRadius: 10, padding: 16, border: `1px solid ${LINE}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: FGMUTE, letterSpacing: 1, marginBottom: 12 }}>ESTRUTURA DO PROMPT — ESTÁTICO PRIMEIRO, DINÂMICO NO FINAL</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CACHE_SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(selected === s.id ? null : s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                border: `1.5px solid ${selected === s.id ? s.color : LINE}`,
                background: selected === s.id ? `${s.color}15` : 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: selected === s.id ? s.color : FG }}>{s.label}</div>
                <div style={{ fontSize: 9, color: FGMUTE }}>{s.description}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {s.isStatic ? (
                  <div style={{ fontSize: 9, background: `${GRN}20`, color: GRN, border: `1px solid ${GRN}`, borderRadius: 4, padding: '2px 8px', fontWeight: 700 }}>
                    cache_control
                  </div>
                ) : (
                  <div style={{ fontSize: 9, background: `${RED}20`, color: RED, border: `1px solid ${RED}`, borderRadius: 4, padding: '2px 8px', fontWeight: 700 }}>
                    SEM cache
                  </div>
                )}
                <div style={{ fontSize: 9, color: FGMUTE }}>{s.tokens.toLocaleString()} tokens</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Savings calculation */}
      {scenario && scenario.isStatic && (
        <div style={{ background: `${scenario.color}10`, border: `2px solid ${scenario.color}50`, borderRadius: 10, padding: '16px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: scenario.color, marginBottom: 12 }}>
            {scenario.icon} {scenario.label} — Cálculo de Economia
          </div>
          {(() => {
            const calc = calcSavings(scenario.tokens, scenario.requests)
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div style={{ background: `${RED}15`, borderRadius: 8, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: FGMUTE, marginBottom: 4 }}>SEM CACHE</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: RED }}>{calc.withoutCache.toLocaleString()}</div>
                  <div style={{ fontSize: 9, color: FGMUTE }}>tokens totais</div>
                </div>
                <div style={{ background: `${GRN}15`, borderRadius: 8, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: FGMUTE, marginBottom: 4 }}>COM CACHE</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: GRN }}>{calc.withCache.toLocaleString()}</div>
                  <div style={{ fontSize: 9, color: FGMUTE }}>tokens efetivos</div>
                </div>
                <div style={{ background: `${scenario.color}20`, borderRadius: 8, padding: '12px', textAlign: 'center', border: `2px solid ${scenario.color}` }}>
                  <div style={{ fontSize: 9, color: FGMUTE, marginBottom: 4 }}>ECONOMIA</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: scenario.color }}>{calc.savings}%</div>
                  <div style={{ fontSize: 9, color: FGMUTE }}>de tokens</div>
                </div>
              </div>
            )
          })()}
          <div style={{ marginTop: 10, fontSize: 10, color: FGMUTE }}>
            Simulação com {scenario.requests} requests de {scenario.tokens.toLocaleString()} tokens cada.
            Hit rate = {scenario.requests - 1}/{scenario.requests} requests (1 write + {scenario.requests - 1} reads).
          </div>
        </div>
      )}

      {scenario && !scenario.isStatic && (
        <div style={{ background: `${RED}10`, border: `2px solid ${RED}50`, borderRadius: 10, padding: '16px 20px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: RED, marginBottom: 8 }}>
            ⚠️ NÃO cachear — parte dinâmica
          </div>
          <div style={{ fontSize: 11, color: FG, lineHeight: 1.7 }}>
            A mensagem do usuário muda a cada request — se você colocar cache_control aqui, o prefixo antes dela seria invalidado a cada mudança. Nunca coloque partes dinâmicas antes de partes estáticas no prefixo.
          </div>
        </div>
      )}

      {!selected && (
        <div style={{ textAlign: 'center', fontSize: 12, color: FGMUTE }}>
          Clique em um bloco para ver o cálculo de economia de cache
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Modelos: Haiku vs Sonnet vs Opus (ComparisonTable)
// Justificativa: "quando usar cada modelo?" é a pergunta mais frequente
// para devs iniciando com Claude. A tabela de comparação por critério
// resolve a dúvida rapidamente e serve como referência de consulta.
// ═══════════════════════════════════════════════════════════════════════════════

const MODEL_OPTIONS: ComparisonOption[] = [
  { id: 'haiku', label: 'Haiku 4.5', color: GRN },
  { id: 'sonnet', label: 'Sonnet 4.5', color: C },
  { id: 'opus', label: 'Opus 4.5', color: PRP },
]

const MODEL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'speed',
    label: 'Velocidade',
    values: {
      haiku: { rating: 'excellent', note: '~1-2s por resposta' },
      sonnet: { rating: 'good', note: '~3-5s por resposta' },
      opus: { rating: 'fair', note: '~6-15s por resposta' },
    },
  },
  {
    id: 'cost',
    label: 'Custo Relativo',
    values: {
      haiku: { rating: 'excellent', note: '1x (base)' },
      sonnet: { rating: 'good', note: '~8-10x mais caro' },
      opus: { rating: 'poor', note: '~30-50x mais caro' },
    },
  },
  {
    id: 'reasoning',
    label: 'Raciocínio Complexo',
    values: {
      haiku: { rating: 'fair', note: 'Suficiente para tasks simples' },
      sonnet: { rating: 'good', note: 'Bom para maioria dos casos' },
      opus: { rating: 'excellent', note: 'Superior em problemas hard' },
    },
  },
  {
    id: 'tool-use',
    label: 'Tool Use',
    values: {
      haiku: { rating: 'good', note: 'Tools simples, 1-2 etapas' },
      sonnet: { rating: 'excellent', note: 'Multi-step, tool choice correto' },
      opus: { rating: 'excellent', note: 'Multi-step complexo, edge cases' },
    },
  },
  {
    id: 'coding',
    label: 'Código',
    values: {
      haiku: { rating: 'fair', note: 'Boilerplate, snippets simples' },
      sonnet: { rating: 'good', note: 'Código de produção, refactoring' },
      opus: { rating: 'excellent', note: 'Código difícil, debugging profundo' },
    },
  },
  {
    id: 'best-for',
    label: 'Melhor Para',
    values: {
      haiku: { rating: 'excellent', note: 'Classificação, extração, routing, workers em multi-agent' },
      sonnet: { rating: 'excellent', note: 'RAG, chat, agentes, APIs — cavalo de batalha' },
      opus: { rating: 'excellent', note: 'Análise profunda, código difícil, escrita criativa' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Progressão: Do Básico ao Expert com Anthropic SDK
// ═══════════════════════════════════════════════════════════════════════════════

const SDK_PROGRESSION: ProgressionLevel[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    label: 'Nível 0',
    emoji: '🌱',
    concepts: [
      { name: 'client.messages.create()', tip: 'Primeira chamada à Messages API' },
      { name: 'role: user/assistant', tip: 'Estrutura básica de messages' },
      { name: 'stop_reason: end_turn', tip: 'Saber quando a resposta está completa' },
      { name: 'usage.input_tokens', tip: 'Monitorar consumo de tokens' },
    ],
  },
  {
    id: 'tool-use',
    name: 'Tool Use',
    label: 'Nível 1',
    emoji: '⚙️',
    concepts: [
      { name: 'tools definition', tip: 'name, description, input_schema JSON Schema' },
      { name: 'stop_reason: tool_use', tip: 'Identificar quando executar tools' },
      { name: 'tool_result messages', tip: 'Retornar resultados no formato correto' },
      { name: 'Multi-tool loop', tip: 'Loop até end_turn com max_iterations' },
    ],
  },
  {
    id: 'streaming',
    name: 'Streaming',
    label: 'Nível 2',
    emoji: '⚡',
    concepts: [
      { name: 'content_block_delta', tip: 'Processar texto em tempo real' },
      { name: 'partial_json accumulation', tip: 'Acumular JSON de tool até content_block_stop' },
      { name: 'message.stream()', tip: 'Modo stream idiomático do SDK TS' },
      { name: 'Streaming UX', tip: 'Texto ao vivo + tool em background' },
    ],
  },
  {
    id: 'caching',
    name: 'Prompt Caching',
    label: 'Nível 3',
    emoji: '💾',
    concepts: [
      { name: 'cache_control: ephemeral', tip: 'Marcar blocos estáticos' },
      { name: 'Hit 10% / Write 125%', tip: 'Entender o modelo de custo' },
      { name: 'Estático antes do dinâmico', tip: 'Ordem importa para a cache key' },
      { name: 'cache_read_input_tokens', tip: 'Monitorar hit rate no usage' },
    ],
  },
  {
    id: 'expert',
    name: 'Expert',
    label: 'Nível 4',
    emoji: '🏆',
    concepts: [
      { name: 'Extended thinking', tip: 'thinking blocks para raciocínio visível' },
      { name: 'Batch API (50% off)', tip: 'Workloads async com polling' },
      { name: 'Computer use sandbox', tip: 'Executor seguro em Docker' },
      { name: 'Multi-agent com model routing', tip: 'Haiku workers + Sonnet orchestrator' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Montagem dos visuais
// ─────────────────────────────────────────────────────────────────────────────

export default function AnthropicSdkVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'tool-loop',
      title: 'Tool Use Loop',
      subtitle: 'O loop completo de tool use — clique em cada passo para ver código e detalhes',
      accent: C,
      component: <ToolUseLoopVisual />,
    },
    {
      id: 'caching',
      title: 'Prompt Caching',
      subtitle: 'Qual parte do prompt cachear e qual é a economia real',
      accent: AMB,
      component: <CachingDiagram />,
    },
    {
      id: 'modelos',
      title: 'Haiku vs Sonnet vs Opus',
      subtitle: 'Comparação por velocidade, custo e caso de uso — para model routing consciente',
      accent: C,
      component: (
        <ComparisonTable
          options={MODEL_OPTIONS}
          criteria={MODEL_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
    {
      id: 'progressao',
      title: 'Progressão com o SDK',
      subtitle: 'Do Hello World ao Expert em 5 níveis — o que dominar em cada etapa',
      accent: GRN,
      component: (
        <ProgressionMap
          levels={SDK_PROGRESSION}
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
