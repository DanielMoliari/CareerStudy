'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'

// ── Paleta OpenAI ──────────────────────────────────────────────────────────────
const C      = '#10a37f'   // verde OpenAI
const C2     = '#34d399'   // verde claro
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#f87171'
const AMB    = '#fbbf24'
const SKY    = '#38bdf8'
const PRP    = '#a78bfa'
const GRY    = '#64748b'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Ciclo de Tool Use: SequenceDiagram completo
// O fluxo temporal entre app ↔ OpenAI ↔ ferramentas não é óbvio em texto
// ═══════════════════════════════════════════════════════════════════════════════

const TOOL_ACTORS: SeqActor[] = [
  { id: 'user',   label: 'Usuário',       color: FGMUTE },
  { id: 'app',    label: 'Sua Aplicação', color: AMB },
  { id: 'openai', label: 'OpenAI API',    color: C },
  { id: 'fn',     label: 'Função Real',   color: GRN },
]

const TOOL_MESSAGES: SeqMessage[] = [
  { from: 'user',   to: 'app',    label: '"Qual o clima em SP amanhã?"', type: 'sync' },
  { from: 'app',    to: 'openai', label: 'POST /v1/chat/completions + tools[]', type: 'sync', note: 'tools: [get_weather, get_forecast]' },
  { from: 'openai', to: 'app',    label: 'finish_reason: "tool_calls"', type: 'return', note: 'tool_calls: [{name:"get_forecast", args:{city:"SP",days:1}}]' },
  { from: 'app',    to: 'fn',     label: 'getForecast("SP", 1)',         type: 'async',  note: 'você executa — OpenAI não tem acesso' },
  { from: 'fn',     to: 'app',    label: '{"temp":24,"rain":false}',     type: 'return', note: 'resultado real da sua função' },
  { from: 'app',    to: 'openai', label: 'role:"tool", tool_call_id, content', type: 'sync', note: 'tool_call_id é OBRIGATÓRIO' },
  { from: 'openai', to: 'app',    label: 'finish_reason: "stop"',        type: 'return', note: '"Amanhã em SP: 24°C, sem chuva."' },
  { from: 'app',    to: 'user',   label: 'resposta final ao usuário',    type: 'return' },
]

const TOOL_GROUPS: SeqGroup[] = [
  { label: 'ciclo tool_calls', kind: 'loop', fromMsg: 1, toMsg: 5, color: C },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Comparação de modelos: tabela multi-critério
// Escolher o modelo certo é a decisão mais impactante de custo
// ═══════════════════════════════════════════════════════════════════════════════

const MODEL_OPTIONS: ComparisonOption[] = [
  { id: 'mini',    label: 'gpt-4o-mini',     sublabel: 'barato e rápido',  color: GRN },
  { id: 'gpt4o',   label: 'gpt-4o',          sublabel: 'produção geral',   color: AMB },
  { id: 'o1mini',  label: 'o1-mini',         sublabel: 'raciocínio médio', color: SKY },
  { id: 'o1',      label: 'o1',              sublabel: 'raciocínio máximo', color: PRP },
]

const MODEL_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'reasoning', label: 'Raciocínio', category: 'Capacidade',
    description: 'Qualidade em tarefas que exigem raciocínio multi-step (matemática, código difícil, análise).',
    values: {
      mini:   { rating: 'fair',      note: 'Adequado para tarefas simples de raciocínio' },
      gpt4o:  { rating: 'good',      note: 'Bom para a maioria dos casos de produção' },
      o1mini: { rating: 'excellent', note: 'Excelente em math, código e lógica' },
      o1:     { rating: 'excellent', note: 'Melhor raciocínio disponível; reserve para problems hard' },
    },
  },
  {
    id: 'latency', label: 'Latência', category: 'Performance',
    description: 'Tempo de resposta típico. o1 "pensa" antes de responder — tem latência muito alta.',
    values: {
      mini:   { rating: 'excellent', note: '~0.5-1s — ótimo para real-time' },
      gpt4o:  { rating: 'good',      note: '~1-3s — adequado para produção' },
      o1mini: { rating: 'fair',      note: '~5-15s — raciocínio custa tempo' },
      o1:     { rating: 'poor',      note: '~10-60s — não use para real-time' },
    },
  },
  {
    id: 'cost', label: 'Custo relativo', category: 'Operacional',
    description: 'Custo por token comparado ao gpt-4o-mini como base (1x).',
    values: {
      mini:   { rating: 'excellent', note: '1x — base de comparação' },
      gpt4o:  { rating: 'fair',      note: '~15-30x — custo significativo em volume' },
      o1mini: { rating: 'fair',      note: '~20x — mais barato que o1 completo' },
      o1:     { rating: 'poor',      note: '~60-80x — apenas para casos críticos' },
    },
  },
  {
    id: 'streaming', label: 'Streaming', category: 'Features',
    description: 'Suporte a streaming SSE para exibir tokens progressivamente.',
    values: {
      mini:   { rating: 'excellent', note: 'Streaming completo suportado' },
      gpt4o:  { rating: 'excellent', note: 'Streaming completo suportado' },
      o1mini: { rating: 'fair',      note: 'Suporte limitado em algumas versões' },
      o1:     { rating: 'poor',      note: 'Não suporta streaming em versões iniciais' },
    },
  },
  {
    id: 'system_msg', label: 'System message', category: 'Features',
    description: 'Suporte ao campo system na lista de mensagens.',
    values: {
      mini:   { rating: 'excellent', note: 'Suportado — use para persona e regras' },
      gpt4o:  { rating: 'excellent', note: 'Suportado — recomendado' },
      o1mini: { rating: 'na',        note: 'Verifique versão — pode não suportar' },
      o1:     { rating: 'poor',      note: 'Não suporta — use developer message' },
    },
  },
  {
    id: 'bestfor', label: 'Melhor para', category: 'Uso ideal',
    description: 'Caso de uso principal onde esse modelo se destaca.',
    values: {
      mini:   { rating: 'excellent', note: 'Triagem, classificação, extração barata' },
      gpt4o:  { rating: 'excellent', note: 'Chat, código geral, análise de produção' },
      o1mini: { rating: 'excellent', note: 'Math, debugging, problemas lógicos' },
      o1:     { rating: 'excellent', note: 'Problemas extremamente difíceis de código/ciência' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Stack de Structured Output: do prompt ao JSON garantido
// As camadas de garantia são não-óbvias — texto não ensina bem
// ═══════════════════════════════════════════════════════════════════════════════

const STRUCTURED_LAYERS: Layer[] = [
  {
    id: 'user_intent',
    label: 'Intenção do Desenvolvedor',
    sublabel: 'O que você quer extrair',
    description: 'Você tem uma estrutura de dados em mente: nome, email, empresa de um texto livre. O objetivo é chegar a um objeto TypeScript tipado de forma confiável.',
    code: 'type Contact = { name: string; email: string | null; company: string | null }',
    color: GRY,
    examples: ['Extração de entidades', 'Parsing de documentos', 'Classificação estruturada'],
  },
  {
    id: 'zod_schema',
    label: 'Schema Zod',
    sublabel: 'Definição tipada do contrato',
    description: 'Zod define o schema TypeScript com todas as regras. zodToJsonSchema() converte para JSON Schema automaticamente — sem escrever JSON Schema à mão.',
    code: 'const ContactSchema = z.object({ name: z.string(), email: z.string().nullable(), company: z.string().nullable() })',
    color: SKY,
    examples: ['Type safety em compile time', 'Conversão automática para JSON Schema', 'Validação runtime'],
  },
  {
    id: 'json_schema',
    label: 'JSON Schema (strict)',
    sublabel: 'Contrato com a API',
    description: 'O JSON Schema convertido precisa ter additionalProperties: false em TODOS os objetos e todos os campos em required[]. Sem isso, o strict mode falha silenciosamente.',
    code: '{ type: "object", additionalProperties: false, required: ["name","email","company"], properties: {...} }',
    color: AMB,
    examples: ['additionalProperties: false obrigatório', 'Todos os campos em required', 'Campos opcionais viram type: ["T","null"]'],
  },
  {
    id: 'constrained_decoding',
    label: 'Constrained Decoding',
    sublabel: 'Garantia matemática da OpenAI',
    description: 'O schema é compilado em um autômato finito. Em cada step de geração, tokens que quebrariam o JSON válido têm probabilidade forçada a 0. O modelo não pode "escapar" do schema.',
    code: '// strict: true ativa constrained decoding — não é instrução, é garantia estrutural',
    color: C,
    examples: ['Autômato finito determinístico', 'Tokens inválidos → prob = 0', 'Impossível gerar JSON inválido'],
  },
  {
    id: 'runtime_validation',
    label: 'Validação Runtime (Zod)',
    sublabel: 'Última linha de defesa',
    description: 'Mesmo com constrained decoding, valide o output com Zod antes de usar. Garante type safety em TypeScript e detecta qualquer anomalia semântica.',
    code: 'const result = ContactSchema.parse(JSON.parse(response.choices[0].message.content!))',
    color: GRN,
    examples: ['Type narrowing em TypeScript', 'Erro explícito se inválido', 'Base para retry inteligente'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

export default function OpenaiSdkVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'tool-use-cycle',
      title: 'Ciclo de Tool Use',
      subtitle: 'Fluxo temporal completo: app ↔ OpenAI ↔ suas funções',
      accent: C,
      component: (
        <SequenceDiagram
          actors={TOOL_ACTORS}
          messages={TOOL_MESSAGES}
          groups={TOOL_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="Function Calling: ciclo completo"
          description="O modelo NUNCA executa código — apenas decide qual função chamar e formata os argumentos em JSON. Você executa a função real e devolve o resultado via role:'tool'."
        />
      ),
    },
    {
      id: 'model-comparison',
      title: 'Qual Modelo Usar?',
      subtitle: 'Comparação multi-critério: latência, custo, raciocínio e suporte',
      accent: C,
      component: (
        <ComparisonTable
          options={MODEL_OPTIONS}
          criteria={MODEL_CRITERIA}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Modelos OpenAI: guia de seleção"
          description="Escolher o modelo errado é o erro mais caro. gpt-4o-mini custa 30x menos que gpt-4o para tarefas de triagem. Reserve o1 apenas para raciocínio extremamente difícil."
        />
      ),
    },
    {
      id: 'structured-output-stack',
      title: 'Stack de Structured Output',
      subtitle: 'Do schema Zod ao JSON garantido: cinco camadas de confiabilidade',
      accent: C,
      component: (
        <LayerStack
          layers={STRUCTURED_LAYERS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
          title="Structured Output com strict mode"
          description="Strict mode não é instrução ao modelo — é garantia matemática. O schema é compilado em um autômato que torna impossível emitir JSON inválido."
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
